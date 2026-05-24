import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060813] text-slate-100 px-4 relative overflow-hidden font-sans">
      {/* Decorative backdrop blobs */}
      <div className="glow-blob-1 top-[-10%] left-[-10%] opacity-80"></div>
      <div className="glow-blob-2 bottom-[-10%] right-[-10%] opacity-80"></div>
      <div className="glow-blob-3 top-[40%] left-[60%] opacity-50"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Branding Header */}
        <div className="text-center mb-8 animate-float">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-violet-600 to-blue-500 rounded-2xl mb-4 shadow-lg shadow-violet-600/30">
            <span className="text-white font-black text-3xl">T</span>
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
            Elevate Your Workflow
          </h1>
          <p className="text-slate-400 mt-2 text-sm font-medium">
            Sign in to access your dashboard and manage tasks
          </p>
        </div>

        {/* glass-panel Login Form */}
        <div className="glass-panel rounded-2xl border border-slate-800/80 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400 flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-sm text-slate-100 glow-input focus:outline-none placeholder-slate-500"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-sm text-slate-100 glow-input focus:outline-none placeholder-slate-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
