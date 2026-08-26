import React, { useState } from 'react';
import { 
  CheckSquare, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  IndianRupee, 
  FileText, 
  PhoneCall 
} from 'lucide-react';

const mockEntries = [
  {
    id: 'ENTRY-901',
    franchiseId: 'FR-101',
    franchiseName: 'North Franchise Store A',
    submittedAt: 'Today, 08:30 PM',
    salesAmount: 45000,
    collectionAmount: 40000,
    cashInHand: 5000,
    status: 'Pending Verification',
    remarks: 'Standard daily closure entry.',
  },
  {
    id: 'ENTRY-902',
    franchiseId: 'FR-103',
    franchiseName: 'East Side Station',
    submittedAt: 'Today, 07:45 PM',
    salesAmount: 32000,
    collectionAmount: 32000,
    cashInHand: 0,
    status: 'Verified',
    remarks: 'Full collection remitted via UPI.',
  },
];

const DailyEntryVerification = () => {
  const [entries, setEntries] = useState(mockEntries);

  const handleVerify = (id) => {
    setEntries(entries.map(e => e.id === id ? { ...e, status: 'Verified' } : e));
  };

  const handleReject = (id) => {
    setEntries(entries.map(e => e.id === id ? { ...e, status: 'Rejected' } : e));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Entry Verification</h1>
        <p className="text-xs text-slate-500 mt-1">Review and verify daily sales and collection reports from assigned outlets</p>
      </div>

      {/* Unsubmitted Warning Alert Box */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-600 text-white rounded-xl font-bold">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-rose-900">Attention: Unsubmitted Daily Reports</h4>
            <p className="text-[11px] text-rose-700 mt-0.5">
              2 outlets in your territory have not submitted their daily reports for today.
            </p>
          </div>
        </div>
        <button className="px-3.5 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors shrink-0">
          Follow Up Now
        </button>
      </div>

      {/* Verification Entries Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Submissions Log</h3>
          <span className="text-[11px] font-semibold text-slate-500">Showing Today's Entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 font-bold">Franchise</th>
                <th className="py-3.5 px-4 font-bold">Submission Time</th>
                <th className="py-3.5 px-4 font-bold">Reported Sales</th>
                <th className="py-3.5 px-4 font-bold">Collection</th>
                <th className="py-3.5 px-4 font-bold">Verification Status</th>
                <th className="py-3.5 px-4 text-center font-bold">Manager Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {entries.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{item.franchiseName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{item.franchiseId}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">{item.submittedAt}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">₹{item.salesAmount.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">₹{item.collectionAmount.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      item.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {item.status === 'Pending Verification' ? (
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleVerify(item.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors"
                        >
                          Verify
                        </button>
                        <button 
                          onClick={() => handleReject(item.id)}
                          className="px-2.5 py-1 bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 rounded-lg text-[11px] font-bold transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Action Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DailyEntryVerification;