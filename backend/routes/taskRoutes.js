const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/tasks
router.get('/', getTasks);

// POST /api/tasks (Admin only)
router.post(
  '/',
  authorize('admin'),
  [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('dueDate').notEmpty().withMessage('Due date is required'),
    body('assignedTo').notEmpty().withMessage('Assigned user is required'),
    body('projectId').notEmpty().withMessage('Project is required'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
  ],
  createTask
);

// PUT /api/tasks/:id (Admin only)
router.put('/:id', authorize('admin'), updateTask);

// DELETE /api/tasks/:id (Admin only)
router.delete('/:id', authorize('admin'), deleteTask);

// PATCH /api/tasks/:id/status (Any authenticated user)
router.patch('/:id/status', updateTaskStatus);

module.exports = router;
