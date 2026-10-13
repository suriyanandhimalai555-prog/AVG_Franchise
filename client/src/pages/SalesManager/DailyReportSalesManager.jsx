import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Send, Clock, Calendar, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const RAW_API_URL = import.meta.env.VITE_APP_BASE_URL || '';
const API_BASE_URL = RAW_API_URL.endsWith('/') ? RAW_API_URL.slice(0, -1) : RAW_API_URL;

const DailyReportSalesManager = () => {
  const [reports, setReports] = useState([]);
  const [reportContent, setReportContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const token = localStorage.getItem('token') || '';

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/daily-reports`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      } else {
        throw new Error('Failed to fetch daily reports.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!reportContent.content?.trim() && reportContent.trim() === '') return;

    try {
      setSubmitting(true);
      setError(null);
      setSuccessMsg(null);

      const res = await fetch(`${API_BASE_URL}/api/daily-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reportContent })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit report.');
      }

      setSuccessMsg('EOD Report submitted successfully!');
      setReportContent('');
      fetchReports();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales Manager Daily EOD Report</h1>
          <p className="text-xs text-slate-500 mt-1">
            Submit your daily performance update, field visits summary, collections, and end-of-day notes.
          </p>
        </div>
        <div className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1.5 w-fit">
          <Calendar className="w-3.5 h-3.5" />
          {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Submission Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          Compose End-of-Day (EOD) Update
        </h2>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmitReport} className="space-y-4">
          <textarea
            rows={4}
            placeholder="Type your summary here (e.g., Franchises visited, total collections followed up, new lead updates, issues faced)..."
            value={reportContent}
            onChange={(e) => setReportContent(e.target.value)}
            className="w-full p-3.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y placeholder-slate-400 text-slate-800"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit EOD Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* History List Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          Submission History
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400 text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span>Loading your reports history...</span>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No daily reports submitted yet.
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div 
                key={report.id}
                className="p-4 bg-slate-50/80 border border-slate-200/60 rounded-xl space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-500 border-b border-slate-200/60 pb-2">
                  <span className="font-bold text-slate-800">{report.userName} ({report.userCode})</span>
                  <div className="flex items-center gap-1.5 font-mono text-blue-600 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(report.submittedAt || report.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  {report.reportContent}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyReportSalesManager;