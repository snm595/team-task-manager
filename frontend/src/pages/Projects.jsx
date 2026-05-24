import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjects, deleteProject } from '../services/endpoints';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();

  const fetchProjects = async () => {
    try {
      const { data } = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project');
    }
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
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
            Projects Space
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Browse and organize active collaborative scopes.
          </p>
        </div>
        {isAdmin && (
          <Link
            to="/projects/create"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            ➕ New Project
          </Link>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-medium">
          ⚠️ {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border border-slate-900/60 shadow-xl">
          <span className="text-5xl mb-4 block">📁</span>
          <h3 className="text-lg font-bold text-slate-300">No active projects</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto font-medium">
            Projects are high-level spaces containing various tasks assigned to members.
          </p>
          {isAdmin && (
            <Link
              to="/projects/create"
              className="text-violet-400 font-semibold text-sm mt-4 inline-block hover:underline"
            >
              Create your first project &rarr;
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div
              key={project._id}
              className="glass-panel glass-panel-hover rounded-2xl border border-slate-900 p-6 shadow-xl relative group flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-bold text-slate-100 text-lg group-hover:text-violet-400 transition-colors tracking-tight line-clamp-1">
                    {project.title}
                  </h3>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/25 transition-all cursor-pointer text-sm"
                      title="Delete project"
                    >
                      🗑️
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-400 mb-6 line-clamp-3 leading-relaxed">
                  {project.description || 'No description provided.'}
                </p>
              </div>

              <div>
                {/* Team members subsection */}
                {project.members?.length > 0 ? (
                  <div className="mb-4 pt-3 border-t border-slate-900/40">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      👥 Project Members
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.members.map((member) => (
                        <span
                          key={member._id}
                          className="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-slate-900/50 border border-slate-800/80 text-slate-300 font-medium"
                          title={member.email}
                        >
                          {member.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 pt-3 border-t border-slate-900/40">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      👥 Project Members
                    </span>
                    <span className="text-xs text-slate-600 italic">No assigned members</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-900/40 pt-3 font-medium">
                  <span>
                    Owner: <span className="text-slate-400 font-semibold">{project.createdBy?.name || 'Manager'}</span>
                  </span>
                  <span>
                    Created: {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
