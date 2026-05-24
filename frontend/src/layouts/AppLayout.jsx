import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/projects', label: 'Projects', icon: '📁' },
    { path: '/tasks', label: 'Tasks', icon: '✅' },
  ];

  if (isAdmin) {
    navItems.push({ path: '/projects/create', label: 'Create Project', icon: '➕' });
    navItems.push({ path: '/tasks/create', label: 'Create Task', icon: '📝' });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay with blur */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-950/90 border-r border-slate-900/80 backdrop-blur-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-900/60">
          <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
            <span className="text-white font-bold text-xl tracking-wider">T</span>
          </div>
          <span className="font-extrabold text-xl bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
            TeamTask
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 py-6 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-violet-600/15 to-blue-600/5 text-white border-l-2 border-violet-500 shadow-[inset_1px_0_0_rgba(255,255,255,0.05)]'
                    : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-100'
                }`}
              >
                <span className={`text-lg transition-transform ${active ? 'scale-110' : ''}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile / Logout Card at the Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-900/60 bg-slate-950/40">
          <div className="flex items-center gap-3 mb-4 p-2 rounded-xl bg-slate-900/30 border border-slate-900/40">
            <div className="relative w-10 h-10 bg-gradient-to-br from-violet-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-violet-500/10">
              {user?.name?.charAt(0)?.toUpperCase()}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs text-slate-400/80 font-mono capitalize tracking-wide">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-red-950/20 rounded-xl border border-transparent hover:border-red-900/30 transition-all cursor-pointer"
          >
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
};

const Navbar = ({ onMenuToggle }) => {
  const { user } = useAuth();

  return (
    <header className="bg-slate-950/40 border-b border-slate-900/60 px-6 py-4 flex items-center justify-between lg:justify-end backdrop-blur-md">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-xl hover:bg-slate-900 text-slate-400 cursor-pointer transition-colors border border-slate-900"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs text-slate-500">Workspace Active</p>
          <p className="text-sm font-medium text-slate-300">
            Welcome, <span className="text-slate-100 font-semibold">{user?.name}</span>
          </p>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 capitalize tracking-wide">
          ⚡ {user?.role}
        </span>
      </div>
    </header>
  );
};

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#060813] text-slate-100 overflow-hidden font-sans relative">
      {/* Decorative background glow circles */}
      <div className="glow-blob-1 top-[-100px] left-[-100px]"></div>
      <div className="glow-blob-2 bottom-[-100px] right-[-100px]"></div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
