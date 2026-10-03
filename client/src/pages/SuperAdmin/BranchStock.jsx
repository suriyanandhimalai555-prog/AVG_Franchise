import React, { useState, useEffect } from 'react';
import { Package, Plus, Loader2, RefreshCw, Scale, Hash, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

const BranchStock = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    stockName: '',
    singleStockWeight: '',
    count: '',
  });

  const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5000';

  // Fetch stocks from backend
  const fetchStocks = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${baseUrl}/api/stocks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (result.success) {
        setStocks(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch stocks.');
      }
    } catch (err) {
      console.error('Error fetching stocks:', err);
      toast.error('Server connection failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${baseUrl}/api/stocks/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || 'Stock updated successfully!');
        setFormData({ stockName: '', singleStockWeight: '', count: '' });
        fetchStocks(); // Refresh table
      } else {
        toast.error(result.message || 'Failed to save stock.');
      }
    } catch (err) {
      console.error('Error saving stock:', err);
      toast.error('Server error while saving stock.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate Aggregates
  const totalItems = stocks.reduce((sum, item) => sum + Number(item.count || 0), 0);
  const totalWeight = stocks.reduce((sum, item) => sum + Number(item.total_weight || 0), 0).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Branch Stock Inventory</h1>
          <p className="text-xs text-slate-500 mt-1">Manage and update stock allocations for superadmin oversight</p>
        </div>
        <button
          onClick={fetchStocks}
          className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition flex items-center gap-2 text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Live Stock
        </button>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Categories</span>
            <div className="text-lg font-bold text-slate-800">{stocks.length}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Stock Count</span>
            <div className="text-lg font-bold text-emerald-600">{totalItems.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Gross Weight</span>
            <div className="text-lg font-bold text-indigo-600">{totalWeight} kg</div>
          </div>
        </div>
      </div>

      {/* Add / Update Stock Entry Form */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <Layers className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-800">Add / Update Stock Entry</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Stock Name
            </label>
            <input
              type="text"
              name="stockName"
              required
              value={formData.stockName}
              onChange={handleInputChange}
              placeholder="e.g. Gold Bar 24K"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Single Weight (kg / g)
            </label>
            <input
              type="number"
              step="0.01"
              name="singleStockWeight"
              required
              value={formData.singleStockWeight}
              onChange={handleInputChange}
              placeholder="e.g. 10.5"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Quantity / Count
            </label>
            <input
              type="number"
              name="count"
              required
              value={formData.count}
              onChange={handleInputChange}
              placeholder="e.g. 50"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>{submitting ? 'Updating...' : 'Save Stock'}</span>
          </button>
        </form>
      </div>

      {/* Stock Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Live Inventory Table</h3>
        </div>

        <div className="overflow-x-auto min-h-[250px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-xs font-medium">Loading stock data...</span>
            </div>
          ) : stocks.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold">No stock entries found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                  <th className="py-3.5 px-5">Stock ID</th>
                  <th className="py-3.5 px-5">Item Name</th>
                  <th className="py-3.5 px-5">Unit Weight</th>
                  <th className="py-3.5 px-5">Quantity Count</th>
                  <th className="py-3.5 px-5">Calculated Total Weight</th>
                  <th className="py-3.5 px-5">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
                {stocks.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-blue-600">STK-{String(s.id).padStart(4, '0')}</td>
                    <td className="py-4 px-5 font-bold text-slate-800">{s.stock_name}</td>
                    <td className="py-4 px-5">{s.single_stock_weight}</td>
                    <td className="py-4 px-5 font-bold text-slate-700">{s.count}</td>
                    <td className="py-4 px-5 font-bold text-emerald-600">{s.total_weight}</td>
                    <td className="py-4 px-5 text-slate-400 font-mono text-[11px]">
                      {new Date(s.updated_at || s.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchStock;