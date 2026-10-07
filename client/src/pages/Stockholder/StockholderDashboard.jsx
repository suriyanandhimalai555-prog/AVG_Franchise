import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  PieChart, 
  Package, 
  Scale, 
  ArrowUpRight, 
  FileText, 
  Download, 
  Shield, 
  Loader2, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';

const StockholderDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token') || user.token;
  const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5000';

  const [loading, setLoading] = useState(true);
  const [stocks, setStocks] = useState([]);
  const [requests, setRequests] = useState([]);

  // Fetch Live Stock and Stock Request Data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const authHeaders = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      const [stocksRes, requestsRes] = await Promise.all([
        fetch(`${baseUrl}/api/stocks`, { headers: authHeaders }),
        fetch(`${baseUrl}/api/stock-requests`, { headers: authHeaders }),
      ]);

      const stocksResult = await stocksRes.json();
      const requestsResult = await requestsRes.json();

      // Handle stocks payload (array or object containing data array)
      if (stocksRes.ok) {
        const stocksData = Array.isArray(stocksResult) 
          ? stocksResult 
          : stocksResult.data || stocksResult.stocks || [];
        setStocks(stocksData);
      } else {
        console.error('Stocks fetch failed:', stocksResult);
      }

      // Handle stock requests payload (array or object containing data array)
      if (requestsRes.ok) {
        const requestsData = Array.isArray(requestsResult) 
          ? requestsResult 
          : requestsResult.data || requestsResult.requests || [];
        setRequests(requestsData);
      } else {
        console.error('Stock requests fetch failed:', requestsResult);
      }
    } catch (error) {
      console.error('Failed to load dashboard telemetry:', error);
      toast.error('Failed to sync live dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [baseUrl]);

  // Dynamic Telemetry Computations with fallback fields
  const totalStockItems = stocks.length;
  const totalUnitCount = stocks.reduce((acc, item) => {
    const qty = parseInt(item.count || item.quantity || item.total_count, 10) || 0;
    return acc + qty;
  }, 0);

  const totalInventoryWeight = stocks.reduce((acc, item) => {
    const weight = parseFloat(item.single_stock_weight || item.weight) || 0;
    const count = parseInt(item.count || item.quantity || item.total_count, 10) || 0;
    return acc + weight * count;
  }, 0);

  const pendingRequestsCount = requests.filter(
    (r) => (r.status || '').toUpperCase() === 'PENDING'
  ).length;

  const financialMetrics = [
    {
      label: 'Total Stock Products',
      value: `${totalStockItems} Items`,
      change: '+ Live Sync',
      isPos: true,
      icon: Package,
    },
    {
      label: 'Total Available Units',
      value: `${totalUnitCount.toLocaleString()} Units`,
      change: 'In Warehouse',
      isPos: true,
      icon: PieChart,
    },
    {
      label: 'Total Portfolio Weight',
      value: `${totalInventoryWeight.toFixed(2)} kg`,
      change: 'Live Mass',
      isPos: true,
      icon: Scale,
    },
    {
      label: 'Pending Franchise Demands',
      value: `${pendingRequestsCount} Requests`,
      change: pendingRequestsCount > 0 ? 'Requires Action' : 'All Clear',
      isPos: pendingRequestsCount === 0,
      icon: TrendingUp,
    },
  ];

  const quarterlyReports = [
    { title: 'Q2 2026 Financial Earnings Report', date: 'Jul 15, 2026', size: '2.4 MB' },
    { title: 'Q1 2026 Dividend Distribution Audit', date: 'Apr 10, 2026', size: '1.8 MB' },
    { title: 'Annual Fiscal Statement 2025-26', date: 'Mar 31, 2026', size: '4.2 MB' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full">
              Shareholder Account
            </span>
            <button
              onClick={fetchDashboardData}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight">
            Welcome, {user.name || 'Valued Investor'}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Real-time equity breakdown, stock inventory telemetry, franchise demand logs, and official corporate reports.
          </p>
        </div>
        <PieChart className="absolute -right-8 -bottom-8 w-64 h-64 text-slate-800/60 pointer-events-none" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {financialMetrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{m.label}</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin text-amber-500" /> : m.value}
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{m.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Live Stock Requests */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Franchise Requests</h2>
              <p className="text-xs text-slate-500">Live demand tracking from registered franchise centers</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">Total: {requests.length}</span>
          </div>

          {loading ? (
            <div className="py-12 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
              <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              <span>Fetching live requests...</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="py-12 text-center text-xs font-medium text-slate-400">
              No franchise requests found in database.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-4">Franchise</th>
                    <th className="py-3 px-4">Product Item</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Requested Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {requests.slice(0, 5).map((req, idx) => {
                    const franchiseName = req.franchise_name || req.user?.name || req.franchise?.name || 'Franchise Unit';
                    const stockName = req.stock?.stock_name || req.stock_name || req.stock?.name || 'N/A';
                    const quantity = req.requested_count || req.quantity || req.count || 0;
                    const reqStatus = (req.status || 'PENDING').toUpperCase();
                    const createdAt = req.created_at || req.createdAt;

                    return (
                      <tr key={req.id || idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-800">{franchiseName}</td>
                        <td className="py-3.5 px-4 text-slate-600">{stockName}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {quantity} units
                        </td>
                        <td className="py-3.5 px-4">
                          {reqStatus === 'PENDING' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                              <Clock className="w-3 h-3 animate-pulse" /> Pending
                            </span>
                          )}
                          {reqStatus === 'APPROVED' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Approved
                            </span>
                          )}
                          {reqStatus === 'REJECTED' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                              <XCircle className="w-3 h-3" /> Rejected
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                          {createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Corporate Financial Reports */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Investor Documents</h2>
            <p className="text-xs text-slate-500 mb-4">Official quarterly and annual financial filings</p>

            <div className="space-y-3">
              {quarterlyReports.map((r, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between hover:bg-slate-100/80 transition">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-amber-600 shadow-sm">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{r.title}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{r.date} &bull; {r.size}</div>
                    </div>
                  </div>
                  <button className="p-1.5 text-slate-400 hover:text-slate-700">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
            <Shield className="w-4 h-4 text-slate-400" />
            <span>Audited by AVG Board of Directors</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StockholderDashboard;