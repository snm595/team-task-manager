import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signup(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
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
        <div className="text-center mb-6 animate-float">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-violet-600 to-blue-500 rounded-2xl mb-3 shadow-lg shadow-violet-600/30">
            <span className="text-white font-black text-3xl">T</span>
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
            Get Started Free
          </h1>
          <p className="text-slate-400 mt-2 text-sm font-medium">
            Create an account to manage your projects effortlessly
          </p>
        </div>

        {/* glass-panel Signup Form */}
        <div className="glass-panel rounded-2xl border border-slate-800/80 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400 flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-sm text-slate-100 glow-input focus:outline-none placeholder-slate-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
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
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl text-sm text-slate-100 glow-input focus:outline-none placeholder-slate-500"
                placeholder="Min 6 characters"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Account Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm text-slate-100 glow-input focus:outline-none bg-slate-900 border-slate-800"
              >
                <option value="member" className="bg-slate-900 text-slate-100">Member (Colleague)</option>
                <option value="admin" className="bg-slate-900 text-slate-100">Admin (Manager)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
