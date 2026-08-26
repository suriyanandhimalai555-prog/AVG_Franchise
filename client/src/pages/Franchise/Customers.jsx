import React, { useState } from 'react';
import { Users, Phone, Mail, MapPin, Search } from 'lucide-react';

const Customers = () => {
  const [customers] = useState([
    { id: 'CUST-101', name: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul@gmail.com', orders: 12, spent: 45000 },
    { id: 'CUST-102', name: 'Anita Roy', phone: '+91 98123 45678', email: 'anita@gmail.com', orders: 8, spent: 28000 },
    { id: 'CUST-103', name: 'Vikram Singh', phone: '+91 97111 22233', email: 'vikram@gmail.com', orders: 15, spent: 62000 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Branch Customers</h1>
          <p className="text-xs text-slate-500 mt-1">Manage client records and transaction histories</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs w-64 shadow-sm">
          <Search className="w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search customer by name..." className="outline-none bg-transparent w-full text-slate-700" />
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
            <tr>
              <th className="py-3.5 px-4 font-bold">Customer ID</th>
              <th className="py-3.5 px-4 font-bold">Name</th>
              <th className="py-3.5 px-4 font-bold">Phone</th>
              <th className="py-3.5 px-4 font-bold">Email</th>
              <th className="py-3.5 px-4 font-bold">Total Orders</th>
              <th className="py-3.5 px-4 font-bold">Total Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{c.id}</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                <td className="py-3.5 px-4 text-slate-600">{c.phone}</td>
                <td className="py-3.5 px-4 text-slate-500">{c.email}</td>
                <td className="py-3.5 px-4 font-bold text-slate-800">{c.orders}</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">₹{c.spent.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;