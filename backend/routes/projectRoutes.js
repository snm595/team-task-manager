const express = require('express');
const { body } = require('express-validator');
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getMembers,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/projects/members - Get all users (for adding to projects)
router.get('/members', authorize('admin'), getMembers);

// GET /api/projects
router.get('/', getProjects);

// POST /api/projects (Admin only)
router.post(
  '/',
  authorize('admin'),
  [body('title').trim().notEmpty().withMessage('Project title is required')],
  createProject
);

// PUT /api/projects/:id (Admin only)
router.put('/:id', authorize('admin'), updateProject);

// DELETE /api/projects/:id (Admin only)
router.delete('/:id', authorize('admin'), deleteProject);

module.exports = router;
