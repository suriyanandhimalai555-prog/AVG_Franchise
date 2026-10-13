import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Clock, MapPin, Loader2, ShieldAlert, CheckCircle2, UserCheck } from 'lucide-react';

const RAW_API_URL = import.meta.env.VITE_APP_BASE_URL || '';
const API_BASE_URL = RAW_API_URL.endsWith('/') ? RAW_API_URL.slice(0, -1) : RAW_API_URL;

const ReportOfSalesmanager = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stateName, setStateName] = useState('');

  const token = localStorage.getItem('token') || '';

  // Fetch state reports restricted by State Head jurisdiction matching
  const fetchStateReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/api/daily-reports/state-reports`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch sales manager reports.');
      }

      setStateName(data.state || '');
      setReports(data.reports || []);
    } catch (err) {
      console.error('Error fetching state reports:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStateReports();
  }, [fetchStateReports]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales Manager EOD Reports</h1>
          <p className="text-xs text-slate-500 mt-1">
            Viewing daily performance submissions from Sales Managers assigned to your state jurisdiction.
          </p>
        </div>
        <div className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1.5 w-fit">
          <MapPin className="w-3.5 h-3.5 text-rose-500" />
          Jurisdiction: {stateName || 'Loading...'}
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Submitted Reports ({stateName})
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            Total Submissions: <span className="text-slate-900 font-bold">{reports.length}</span>
          </span>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400 text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span>Verifying jurisdiction & loading reports...</span>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <UserCheck className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">No Sales Manager Reports Found</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              There are no daily reports submitted by sales managers in <span className="font-semibold">{stateName}</span> yet, or states do not match.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div 
                key={report.id}
                className="p-4 bg-slate-50/75 border border-slate-200/70 rounded-xl space-y-3 hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      {report.userName ? report.userName.slice(0, 2).toUpperCase() : 'SM'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{report.userName}</div>
                      <div className="text-[10px] font-mono text-blue-600">{report.userCode} • State: {report.state}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200/80 shadow-2xs">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>{new Date(report.submittedAt || report.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed pl-1">
                  {report.reportContent}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportOfSalesmanager;