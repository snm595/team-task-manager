import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTasks, deleteTask, updateTaskStatus } from '../services/endpoints';

const statusConfig = {
  todo: { label: 'Todo', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  'in-progress': { label: 'In Progress', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  completed: { label: 'Completed', bg: 'bg-green-500/10 text-green-400 border-green-500/20' },
};

const priorityConfig = {
  low: { label: 'Low', bg: 'bg-slate-500/10 text-slate-400 border border-slate-500/20' },
  medium: { label: 'Medium', bg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  high: { label: 'High', bg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]' },
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();

  const fetchTasks = async () => {
    try {
      const { data } = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const { data } = await updateTaskStatus(taskId, newStatus);
      setTasks(tasks.map((t) => (t._id === taskId ? data : t)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(id);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const isOverdue = (dueDate, status) => {
    return status !== 'completed' && new Date(dueDate) < new Date();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
            Tasks Workspace
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Review assignments, update task status &amp; track deadlines.
          </p>
        </div>
        {isAdmin && (
          <Link
            to="/tasks/create"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            ➕ New Task
          </Link>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-medium">
          ⚠️ {error}
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border border-slate-900/60 shadow-xl">
          <span className="text-5xl mb-4 block">✅</span>
          <h3 className="text-lg font-bold text-slate-300">No active tasks found</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto font-medium">
            Tasks correspond to specific user assignments containing priorities, milestones &amp; due dates.
          </p>
          {isAdmin && (
            <Link
              to="/tasks/create"
              className="text-violet-400 font-semibold text-sm mt-4 inline-block hover:underline"
            >
              Assign your first task &rarr;
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tasks.map((task) => {
            const overdue = isOverdue(task.dueDate, task.status);
            return (
              <div
                key={task._id}
                className={`glass-panel rounded-2xl border p-5 shadow-lg transition-all duration-300 hover:translate-x-1 ${
                  overdue
                    ? 'border-red-500/40 bg-red-500/[0.02] hover:border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.05)]'
                    : 'border-slate-900 hover:border-slate-800/80 hover:bg-slate-900/40'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left task details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap mb-2">
                      <h3 className="font-bold text-slate-100 text-base tracking-tight truncate max-w-md">
                        {task.title}
                      </h3>
                      {overdue && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse-glow">
                          Overdue
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-sm text-slate-400 mb-3.5 line-clamp-2 leading-relaxed font-medium">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 flex-wrap text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1 font-medium">
                        📁 <span className="text-slate-400 font-semibold">{task.projectId?.title || 'Scope Space'}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium">
                        👤 <span className="text-slate-400 font-semibold">{task.assignedTo?.name || 'Unassigned'}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium">
                        📅 <span className={`font-semibold ${overdue ? 'text-red-400' : 'text-slate-400'}`}>{formatDate(task.dueDate)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right task badges & settings */}
                  <div className="flex items-center gap-3 flex-wrap md:flex-nowrap border-t border-slate-900/60 pt-3 md:pt-0 md:border-t-0">
                    {/* Priority Badge */}
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        priorityConfig[task.priority]?.bg
                      } ${priorityConfig[task.priority]?.text}`}
                    >
                      ⚡ {priorityConfig[task.priority]?.label}
                    </span>

                    {/* Status Dropdown */}
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-bold border border-slate-800 bg-slate-950/80 cursor-pointer focus:ring-2 focus:ring-violet-500/50 focus:outline-none transition-colors ${
                        statusConfig[task.status]?.text
                      }`}
                    >
                      <option value="todo" className="bg-slate-950 text-slate-400 font-bold">Todo</option>
                      <option value="in-progress" className="bg-slate-950 text-blue-400 font-bold">In Progress</option>
                      <option value="completed" className="bg-slate-950 text-green-400 font-bold">Completed</option>
                    </select>

                    {/* Admin Actions */}
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/25 transition-all cursor-pointer text-sm"
                        title="Delete task"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tasks;
