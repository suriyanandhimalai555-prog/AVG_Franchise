import React, { useState, useEffect, useCallback } from 'react';
import { 
  Clock, 
  Calendar, 
  Search, 
  RefreshCw, 
  UserCheck, 
  UserX, 
  Building2, 
  Timer,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const RAW_API_URL = import.meta.env.VITE_APP_BASE_URL || '';
const API_BASE_URL = RAW_API_URL.endsWith('/') ? RAW_API_URL.slice(0, -1) : RAW_API_URL;

const FranchiseCheckIn = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFranchise, setSearchFranchise] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Helper to calculate duration in HH:MM format
  const calculateDuration = (startTime, endTime) => {
    if (!startTime) return 'N/A';
    const start = new Date(startTime).getTime();
    const end = endTime ? new Date(endTime).getTime() : new Date().getTime();
    const diffMs = Math.max(0, end - start);

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  // Fetch all attendance logs from backend
  const fetchAllAttendance = useCallback(async () => {
    setLoading(true);
    try {
      let query = `${API_BASE_URL}/api/attendance/all?`;
      if (searchFranchise) query += `franchiseId=${encodeURIComponent(searchFranchise)}&`;
      if (selectedDate) query += `date=${encodeURIComponent(selectedDate)}&`;

      const response = await fetch(query);
      const data = await response.json();

      if (response.ok && data.success) {
        setAttendanceData(data.data);
      } else {
        console.error('Failed to load data:', data.message);
      }
    } catch (error) {
      console.error('Error fetching admin attendance data:', error);
    } finally {
      setLoading(false);
    }
  }, [searchFranchise, selectedDate]);

  useEffect(() => {
    fetchAllAttendance();
  }, [fetchAllAttendance]);

  // Compute summary metrics
  const activeNowCount = attendanceData.filter((item) => item.status === 'ACTIVE').length;
  const completedCount = attendanceData.filter((item) => item.status === 'COMPLETED').length;

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Franchise Attendance Logs</h1>
          <p className="text-xs text-slate-500 mt-1">Super Admin Overview: Real-time Check-In / Check-Out activity across all franchise branches.</p>
        </div>
        
        <button
          onClick={fetchAllAttendance}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Logs
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Records</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{attendanceData.length}</div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Currently Checked In</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{activeNowCount}</div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shift Completed</div>
            <div className="text-2xl font-bold text-slate-700 mt-1">{completedCount}</div>
          </div>
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl border border-slate-200">
            <UserX className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Franchise ID Filter */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by Franchise ID..."
              value={searchFranchise}
              onChange={(e) => setSearchFranchise(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Date Filter */}
          <div className="relative w-full sm:w-48">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {(searchFranchise || selectedDate) && (
          <button
            onClick={() => { setSearchFranchise(''); setSelectedDate(''); }}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 font-bold">Log ID</th>
                <th className="py-3.5 px-4 font-bold">Franchise ID</th>
                <th className="py-3.5 px-4 font-bold">Date</th>
                <th className="py-3.5 px-4 font-bold">Check-In Time</th>
                <th className="py-3.5 px-4 font-bold">Check-Out Time</th>
                <th className="py-3.5 px-4 font-bold">Duration</th>
                <th className="py-3.5 px-4 text-center font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 font-medium">
                    Loading attendance records...
                  </td>
                </tr>
              ) : attendanceData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 font-medium">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                attendanceData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400">#{row.id}</td>
                    <td className="py-3.5 px-4 font-bold text-blue-600 font-mono">{row.franchise_id}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {new Date(row.check_in_time).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {new Date(row.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {row.check_out_time ? (
                        new Date(row.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      ) : (
                        <span className="text-slate-400 italic">-- : --</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Timer className="w-3.5 h-3.5 text-slate-400" />
                        {calculateDuration(row.check_in_time, row.check_out_time)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        row.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {row.status === 'ACTIVE' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active Session
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 text-slate-400" /> Shift Completed
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FranchiseCheckIn;