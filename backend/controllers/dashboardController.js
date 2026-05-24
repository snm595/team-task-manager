const Task = require('../models/Task');
const Project = require('../models/Project');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
const getDashboardStats = async (req, res) => {
  try {
    let taskFilter = {};
    let projectFilter = {};

    // Members only see their own stats
    if (req.user.role === 'member') {
      taskFilter.assignedTo = req.user._id;
      projectFilter.members = req.user._id;
    }

    const [totalTasks, completedTasks, inProgressTasks, todoTasks, projectCount] =
      await Promise.all([
        Task.countDocuments(taskFilter),
        Task.countDocuments({ ...taskFilter, status: 'completed' }),
        Task.countDocuments({ ...taskFilter, status: 'in-progress' }),
        Task.countDocuments({ ...taskFilter, status: 'todo' }),
        Project.countDocuments(projectFilter),
      ]);

    // Overdue: tasks not completed and past due date
    const overdueTasks = await Task.countDocuments({
      ...taskFilter,
      status: { $ne: 'completed' },
      dueDate: { $lt: new Date() },
    });

    // Pending = todo + in-progress
    const pendingTasks = todoTasks + inProgressTasks;

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      projectCount,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboardStats };
