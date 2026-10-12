import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Timer, LogIn, LogOut, Loader2, MapPin } from 'lucide-react';

const RAW_API_URL = import.meta.env.VITE_APP_BASE_URL || '';
const API_BASE_URL = RAW_API_URL.endsWith('/') ? RAW_API_URL.slice(0, -1) : RAW_API_URL;

const AttendanceCheckInWidget = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token') || '';
  const USER_ID = user.id || user.franchise_id || user._id || null;

  const [attendance, setAttendance] = useState({
    status: 'NOT_CHECKED_IN',
    rawCheckIn: null,
    rawCheckOut: null,
    checkInTime: null,
    checkOutTime: null,
    loading: false,
    location: ''
  });

  const [elapsedTime, setElapsedTime] = useState('00h 00m 00s');

  const calculateDuration = (startTime, endTime) => {
    if (!startTime) return '00h 00m 00s';
    const start = new Date(startTime).getTime();
    const end = endTime ? new Date(endTime).getTime() : new Date().getTime();
    const diffInMs = Math.max(0, end - start);

    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  };

  useEffect(() => {
    let timer;
    if (attendance.status === 'CHECKED_IN' && attendance.rawCheckIn) {
      setElapsedTime(calculateDuration(attendance.rawCheckIn));
      timer = setInterval(() => {
        setElapsedTime(calculateDuration(attendance.rawCheckIn));
      }, 1000);
    } else if (attendance.status === 'CHECKED_OUT' && attendance.rawCheckIn && attendance.rawCheckOut) {
      setElapsedTime(calculateDuration(attendance.rawCheckIn, attendance.rawCheckOut));
    } else {
      setElapsedTime('00h 00m 00s');
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [attendance.status, attendance.rawCheckIn, attendance.rawCheckOut]);

  const fetchAttendanceStatus = useCallback(async () => {
    if (!USER_ID) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/attendance/status/${USER_ID}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setAttendance({
          status: data.status,
          rawCheckIn: data.record?.check_in_time || null,
          rawCheckOut: data.record?.check_out_time || null,
          checkInTime: data.record?.check_in_time ? new Date(data.record.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
          checkOutTime: data.record?.check_out_time ? new Date(data.record.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
          location: data.record?.check_in_location || '',
          loading: false
        });
      }
    } catch (err) {
      console.error('Error loading attendance status:', err);
    }
  }, [USER_ID, token]);

  useEffect(() => {
    fetchAttendanceStatus();
  }, [fetchAttendanceStatus]);

  const getCurrentLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ latitude: null, longitude: null, locationName: 'Browser standard' });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          let locationName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

          try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              locationName = geoData.display_name?.split(',').slice(0, 3).join(',') || locationName;
            }
          } catch (e) {
            console.warn('Geocoding resolution fallback:', e);
          }

          resolve({ latitude: lat, longitude: lng, locationName });
        },
        () => {
          resolve({ latitude: null, longitude: null, locationName: 'Location Permission Denied' });
        },
        { timeout: 8000 }
      );
    });
  };

  const handleAttendanceAction = async () => {
    if (!USER_ID) {
      alert('User session error. Please re-login.');
      return;
    }

    setAttendance((prev) => ({ ...prev, loading: true }));
    const isCheckIn = attendance.status !== 'CHECKED_IN';
    const endpoint = isCheckIn ? 'check-in' : 'check-out';

    let payload = { franchiseId: USER_ID };

    if (isCheckIn) {
      const locationData = await getCurrentLocation();
      payload = { ...payload, ...locationData };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/attendance/${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || 'Attendance action failed');
        return;
      }

      await fetchAttendanceStatus();
    } catch (err) {
      console.error('Error toggling attendance:', err);
      alert('Network error while recording attendance');
    } finally {
      setAttendance((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl">
      <div className="flex items-center gap-3 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          <Clock className="w-4 h-4 text-blue-600" />
          {attendance.status === 'CHECKED_IN' && (
            <span>Checked In: <strong className="text-slate-900">{attendance.checkInTime}</strong></span>
          )}
          {attendance.status === 'CHECKED_OUT' && (
            <span>
              Out at <strong className="text-slate-900">{attendance.checkOutTime}</strong> (Last Shift)
            </span>
          )}
          {attendance.status === 'NOT_CHECKED_IN' && <span className="text-slate-500">Not Checked In Today</span>}
        </div>

        {attendance.status !== 'NOT_CHECKED_IN' && (
          <div className="flex items-center gap-1 pl-2 border-l border-slate-200 text-xs font-bold text-emerald-600">
            <Timer className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>{elapsedTime}</span>
          </div>
        )}
      </div>

      {attendance.location && (
        <div className="hidden xl:flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg truncate max-w-xs">
          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span className="truncate">{attendance.location}</span>
        </div>
      )}

      <button
        onClick={handleAttendanceAction}
        disabled={attendance.loading}
        className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
          attendance.status === 'CHECKED_IN'
            ? 'bg-rose-600 hover:bg-rose-700 text-white'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
        }`}
      >
        {attendance.loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : attendance.status === 'CHECKED_IN' ? (
          <>
            <LogOut className="w-4 h-4" /> Check Out
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4" /> Check In
          </>
        )}
      </button>
    </div>
  );
};

export default AttendanceCheckInWidget;