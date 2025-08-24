const express = require("express")
const router = express.Router()
const Attachment = require("../models/Attachment")
const Project = require("../models/Project")
const auth = require("../middleware/authMiddleware")
const User = require("../models/User")

// Middleware: check admin
const isAdmin = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Non authentifié" })
  const user = await User.findById(req.user.id)
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Accès refusé (Admin uniquement)" })
  }
  next()
}

// Admin: add attachment to project
router.post("/", auth, isAdmin, async (req, res) => {
  try {
    const { projectId, title, type, content, fileUrl } = req.body
    const project = await Project.findById(projectId)
    if (!project) return res.status(404).json({ message: "Projet introuvable" })

    const attachment = new Attachment({ projectId, title, type, content, fileUrl })
    await attachment.save()
    res.status(201).json(attachment)
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message })
  }
})

// Admin: start an attachment
router.put("/:id/start", auth, isAdmin, async (req, res) => {
  try {
    const attachment = await Attachment.findByIdAndUpdate(req.params.id, { status: "in-progress" }, { new: true })
    res.json(attachment)
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// Admin: finish an attachment
router.put("/:id/finish", auth, isAdmin, async (req, res) => {
  try {
    const attachment = await Attachment.findByIdAndUpdate(
      req.params.id, 
      { status: "completed" }, 
      { new: true }
    )
    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }
    res.json(attachment);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
})

module.exports = router
