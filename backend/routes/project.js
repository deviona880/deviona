const express = require("express")
const router = express.Router()
const Project = require("../models/Project")
const Attachment = require("../models/Attachment")
const auth = require("../middleware/authMiddleware")
const User = require("../models/User")

// Middleware: check if admin
const isAdmin = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Non authentifié" })
  const user = await User.findById(req.user.id)
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Accès refusé (Admin uniquement)" })
  }
  next()
}

// Get all projects (admin only)
router.get("/", auth, isAdmin, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate({
        path: 'attachments',
        options: { sort: { 'createdAt': -1 } }
      })
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get project by ID
router.get("/:id", auth, isAdmin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('attachments');
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Admin: create project for a user
router.post("/", auth, isAdmin, async (req, res) => {
  try {
    const { title, description, userEmail, startDate, endDate } = req.body;
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      return res.status(400).json({ message: "End date cannot be before start date" });
    }

    // Check if user exists
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    const project = new Project({
      title,
      description,
      userEmail,
      startDate: start,
      endDate: end,
      createdBy: req.user.id,
      status: 'pending',
      attachments: []
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update project
router.put("/:id", auth, isAdmin, async (req, res) => {
  try {
    const { title, description, userEmail, startDate, endDate, status } = req.body;
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      return res.status(400).json({ message: "End date cannot be before start date" });
    }

    // Check if user exists
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        userEmail,
        startDate: start,
        endDate: end,
        status,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('attachments');

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update project status
router.patch("/:id/status", auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate('attachments');

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Admin: delete project
router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete all attachments
    await Attachment.deleteMany({ projectId: project._id });

    // Delete the project
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: "Project and all attachments deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get project attachments
router.get("/:id/attachments", auth, isAdmin, async (req, res) => {
  try {
    const attachments = await Attachment.find({ projectId: req.params.id })
      .sort({ createdAt: -1 });
    res.json(attachments);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// Get all projects for a specific user by email (admin only)
router.get("/user/:email", auth, isAdmin, async (req, res) => {
  try {
    const userEmail = req.params.email;

    // Check if user exists
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const projects = await Project.find({ userEmail })
      .populate({
        path: 'attachments',
        options: { sort: { 'createdAt': -1 } }
      })
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// Get projects by user email (no auth required)
router.get("/UserProjects/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;

    const projects = await Project.find({ userEmail })
      .populate({
        path: "attachments",
        options: { sort: { createdAt: -1 } }
      })
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});






module.exports = router
