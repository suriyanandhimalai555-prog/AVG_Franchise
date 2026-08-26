import React, { useState } from 'react';
import { CheckSquare, AlertCircle, Clock } from 'lucide-react';

const PendingTasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Submit Daily Closing Report', priority: 'High', due: 'Today, 07:00 PM', status: 'Pending' },
    { id: 2, title: 'Follow up on Pending Dues (₹12,400)', priority: 'Medium', due: 'Tomorrow', status: 'Pending' },
    { id: 3, title: 'Verify Bank Transfer TXN-9084', priority: 'High', due: 'Immediate', status: 'Pending' },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pending Tasks</h1>
        <p className="text-xs text-slate-500 mt-1">Branch daily operational task queue</p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100/60 transition-colors">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={task.status === 'Completed'} 
                onChange={() => toggleTask(task.id)}
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer" 
              />
              <div>
                <div className={`text-xs font-bold ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {task.title}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" /> Due: {task.due}
                </div>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              task.priority === 'High' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
            }`}>
              {task.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingTasks;