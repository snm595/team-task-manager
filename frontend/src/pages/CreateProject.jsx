import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject, getMembers } from '../services/endpoints';

const CreateProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data } = await getMembers();
        setAllMembers(data);
      } catch (err) {
        console.error('Failed to fetch members:', err);
      }
    };
    fetchMembers();
  }, []);

  const toggleMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Project title is required');
      return;
    }

    setLoading(true);
    try {
      await createProject({ title, description, members: selectedMembers });
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
          Create Project
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Set up a new workspace space and invite project team members
        </p>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-900 p-6 sm:p-8 shadow-xl">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Project Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm text-slate-100 glow-input focus:outline-none placeholder-slate-500"
              placeholder="e.g. Website Redesign v2"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm text-slate-100 glow-input focus:outline-none resize-none placeholder-slate-500"
              placeholder="Summarize the core target and goal of this project..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Add Team Members ({selectedMembers.length} selected)
            </label>
            {allMembers.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No registered members found.</p>
            ) : (
              <div className="max-h-56 overflow-y-auto border border-slate-900 rounded-xl divide-y divide-slate-900/60 bg-slate-950/20">
                {allMembers.map((member) => {
                  const isChecked = selectedMembers.includes(member._id);
                  return (
                    <label
                      key={member._id}
                      className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-900/35 cursor-pointer transition-colors ${
                        isChecked ? 'bg-violet-950/10' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleMember(member._id)}
                        className="w-4.5 h-4.5 rounded border-slate-800 text-violet-600 focus:ring-violet-500/50 bg-slate-900 accent-violet-600 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-200">{member.name}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wide ${
                            member.role === 'admin' 
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {member.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{member.email}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Creating Project...' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="px-6 py-3 bg-slate-900/80 hover:bg-slate-900 text-slate-300 text-sm font-semibold rounded-xl border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
