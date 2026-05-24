import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/endpoints';

const StatCard = ({ label, value, icon, color }) => {
  const colorClasses = {
    blue: {
      border: 'border-blue-500/25',
      glow: 'shadow-blue-500/5',
      text: 'text-blue-400',
      bg: 'bg-blue-500/10',
      line: 'bg-blue-500',
    },
    green: {
      border: 'border-green-500/25',
      glow: 'shadow-green-500/5',
      text: 'text-green-400',
      bg: 'bg-green-500/10',
      line: 'bg-green-500',
    },
    amber: {
      border: 'border-amber-500/25',
      glow: 'shadow-amber-500/5',
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      line: 'bg-amber-500',
    },
    red: {
      border: 'border-red-500/25',
      glow: 'shadow-red-500/5',
      text: 'text-red-400',
      bg: 'bg-red-500/10',
      line: 'bg-red-500',
    },
    purple: {
      border: 'border-purple-500/25',
      glow: 'shadow-purple-500/5',
      text: 'text-purple-400',
      bg: 'bg-purple-500/10',
      line: 'bg-purple-500',
    },
  };

  const style = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`glass-panel glass-panel-hover rounded-2xl border ${style.border} p-6 shadow-lg ${style.glow} relative overflow-hidden group`}>
      {/* Accent line at top */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${style.line} opacity-80 group-hover:h-[5px] transition-all duration-300`}></div>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">{label}</span>
        <span className={`inline-flex items-center justify-center w-11 h-11 rounded-xl text-xl ${style.bg} ${style.text} shadow-[0_0_15px_rgba(255,255,255,0.02)] transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </span>
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-extrabold text-slate-100 tracking-tight">{value}</span>
      </div>

      {/* Futuristic status detail decoration */}
      <div className="mt-3 flex items-center gap-1.5 text-slate-500 text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-ping"></span>
        <span>Realtime Updates Active</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-medium">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header section with sleek stats subtitle */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Realtime performance metrics, team tasks status &amp; project analytics.
          </p>
        </div>
      </div>

      {/* Grid of beautifully designed metric widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        <StatCard
          label="Total Tasks"
          value={stats?.totalTasks || 0}
          icon="📋"
          color="blue"
        />
        <StatCard
          label="Completed"
          value={stats?.completedTasks || 0}
          icon="✅"
          color="green"
        />
        <StatCard
          label="Pending Tasks"
          value={stats?.pendingTasks || 0}
          icon="⏳"
          color="amber"
        />
        <StatCard
          label="Overdue Tasks"
          value={stats?.overdueTasks || 0}
          icon="🚨"
          color="red"
        />
        <StatCard
          label="Active Projects"
          value={stats?.projectCount || 0}
          icon="📁"
          color="purple"
        />
      </div>

      {/* Interactive welcome/quickstart panel */}
      <div className="glass-panel rounded-2xl border border-slate-900 p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl pointer-events-none select-none">
          ⚡
        </div>
        <div className="relative z-10 space-y-3">
          <h2 className="text-lg font-bold text-slate-200">Welcome to the TeamTask space</h2>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            From the sidebar menu, you can explore the <strong className="text-violet-400 font-semibold">Projects</strong> to organize tasks under common scopes, and jump to <strong className="text-violet-400 font-semibold">Tasks</strong> to track individual team assignments. If you are an admin, you can create new projects and tasks as well.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
