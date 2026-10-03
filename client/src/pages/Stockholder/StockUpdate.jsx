import React, { useState, useEffect } from 'react';
import { Plus, Package, Scale, Hash, X, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const StockUpdate = () => {
  const [stocks, setStocks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    stockName: '',
    singleStockWeight: '',
    count: '',
  });

  const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5000';

  // Fetch stocks from Backend API with Auth Token
  const fetchStocks = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`${baseUrl}/api/stocks`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setStocks(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch stocks.');
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      toast.error('Server connection failed while loading stocks.');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Form Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${baseUrl}/api/stocks/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        toast.success('Stock updated successfully!');
        setFormData({ stockName: '', singleStockWeight: '', count: '' });
        setIsModalOpen(false);
        fetchStocks(); // Refresh table view
      } else {
        toast.error(result.message || 'Failed to update stock.');
      }
    } catch (error) {
      console.error('Submit Error:', error);
      toast.error('Server connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Stock Inventory Update</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Manage stock allocations, weight metrics, and count details</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStocks}
            className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl text-xs shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Update Stock</span>
          </button>
        </div>
      </div>

      {/* Stocks Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">Current Stock Inventory</h2>
          <span className="text-xs font-semibold text-slate-400">Total Entries: {stocks.length}</span>
        </div>

        {fetching ? (
          <div className="py-12 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
            <span>Loading stocks...</span>
          </div>
        ) : stocks.length === 0 ? (
          <div className="py-12 text-center text-xs font-medium text-slate-400">
            No stock entries found. Click <strong className="text-slate-600">Update Stock</strong> to add data.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Stock Item</th>
                  <th className="py-3.5 px-6">Single Unit Weight (kg)</th>
                  <th className="py-3.5 px-6">Quantity Count</th>
                  <th className="py-3.5 px-6">Total Calculated Weight</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {stocks.map((stock) => {
                  const totalWeight = (Number(stock.single_stock_weight) * Number(stock.count)).toFixed(2);
                  const isOutOfStock = stock.count <= 0;
                  const isLowStock = stock.count > 0 && stock.count <= 10;

                  return (
                    <tr key={stock.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-800 flex items-center gap-2">
                        <Package className="w-4 h-4 text-amber-500 shrink-0" />
                        {stock.stock_name}
                      </td>
                      <td className="py-4 px-6">{Number(stock.single_stock_weight).toFixed(2)} kg</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-lg font-bold border ${
                          isOutOfStock 
                            ? 'bg-rose-50 text-rose-700 border-rose-200' 
                            : 'bg-amber-50 text-amber-700 border-amber-200/60'
                        }`}>
                          {stock.count} units
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        {totalWeight} kg
                      </td>
                      <td className="py-4 px-6">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                            <X className="w-3 h-3" /> Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            Available
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-slate-400 text-[11px]">
                        {new Date(stock.updatedAt || stock.created_at).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Popup for Adding Stock */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold tracking-wide">Add New Stock Record</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Stock / Item Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Package className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="stockName"
                    required
                    value={formData.stockName}
                    onChange={handleChange}
                    placeholder="e.g. Gold Bar 24K"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Single Stock Weight (kg)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Scale className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    name="singleStockWeight"
                    required
                    min="0.01"
                    value={formData.singleStockWeight}
                    onChange={handleChange}
                    placeholder="e.g. 2.50"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Stock Count (Quantity)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Hash className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    name="count"
                    required
                    min="1"
                    value={formData.count}
                    onChange={handleChange}
                    placeholder="e.g. 100"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                  />
                </div>
              </div>

              {/* Dynamic Live Summary */}
              {formData.singleStockWeight && formData.count && (
                <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-xl text-xs flex justify-between items-center text-amber-900 font-semibold">
                  <span>Calculated Total Weight:</span>
                  <span className="text-sm font-bold text-amber-700">
                    {(parseFloat(formData.singleStockWeight || 0) * parseInt(formData.count || 0, 10)).toFixed(2)} kg
                  </span>
                </div>
              )}

              {/* Form Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl text-xs shadow-md shadow-amber-500/20 active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Stock</span>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default StockUpdate;