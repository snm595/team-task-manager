import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask, getProjects, getMembers } from '../services/endpoints';

const CreateTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, membersRes] = await Promise.all([
          getProjects(),
          getMembers(),
        ]);
        setProjects(projectsRes.data);
        setMembers(membersRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !dueDate || !assignedTo || !projectId) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await createTask({ title, description, priority, dueDate, assignedTo, projectId });
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
          Create Task
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Create and assign new milestones to project contributors
        </p>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-900 p-6 sm:p-8 shadow-xl">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="task-title" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Task Title *
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm text-slate-100 glow-input focus:outline-none placeholder-slate-500"
              placeholder="e.g. Implement Oauth Authentication"
            />
          </div>

          <div>
            <label htmlFor="task-desc" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Description / Target Notes
            </label>
            <textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm text-slate-100 glow-input focus:outline-none resize-none placeholder-slate-500"
              placeholder="Provide context and notes for the assignee..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="project" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Project *
              </label>
              <select
                id="project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-sm text-slate-100 glow-input focus:outline-none bg-slate-900 border-slate-800"
              >
                <option value="">Select associated project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="assignee" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Assign To *
              </label>
              <select
                id="assignee"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-sm text-slate-100 glow-input focus:outline-none bg-slate-900 border-slate-800"
              >
                <option value="">Select target contributor</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="priority" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Task Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm text-slate-100 glow-input focus:outline-none bg-slate-900 border-slate-800"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div>
              <label htmlFor="due-date" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Due Date *
              </label>
              <input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-sm text-slate-100 glow-input focus:outline-none bg-slate-900 border-slate-800 color-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Creating Task...' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/tasks')}
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

export default CreateTask;
