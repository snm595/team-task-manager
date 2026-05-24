const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const User = require('../models/User');

/**
 * @desc    Get all projects (admin sees all, member sees their own)
 * @route   GET /api/projects
 * @access  Private
 */
const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      // Admin sees all projects
      projects = await Project.find()
        .populate('createdBy', 'name email')
        .populate('members', 'name email')
        .sort({ createdAt: -1 });
    } else {
      // Members see only projects they belong to
      projects = await Project.find({ members: req.user._id })
        .populate('createdBy', 'name email')
        .populate('members', 'name email')
        .sort({ createdAt: -1 });
    }
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private (Admin only)
 */
const createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { title, description, members } = req.body;

    const project = await Project.create({
      title,
      description,
      createdBy: req.user._id,
      members: members || [],
    });

    const populated = await Project.findById(project._id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Create project error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update a project
 * @route   PUT /api/projects/:id
 * @access  Private (Admin only)
 */
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { title, description, members } = req.body;

    project.title = title || project.title;
    project.description = description !== undefined ? description : project.description;
    if (members) project.members = members;

    await project.save();

    const updated = await Project.findById(project._id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    res.json(updated);
  } catch (error) {
    console.error('Update project error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Delete a project
 * @route   DELETE /api/projects/:id
 * @access  Private (Admin only)
 */
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all members (for adding to projects)
 * @route   GET /api/projects/members
 * @access  Private (Admin only)
 */
const getMembers = async (req, res) => {
  try {
    const members = await User.find().select('name email role');
    res.json(members);
  } catch (error) {
    console.error('Get members error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject, getMembers };
