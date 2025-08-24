const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");
const Project = require("../models/Project");
const Contact = require("../models/contact"); // Fixed casing to match existing import

// Get dashboard stats
router.get("/dashboard", auth, async (req, res) => {
  try {
    // Count total entities
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalContacts = await Contact.countDocuments();
    
    // Count today's contacts
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayContacts = await Contact.countDocuments({
      createdAt: { $gte: today }
    });

    // Count projects by status
    const projectStats = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Count contacts by date (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const contactStats = await Contact.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Count users by role
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get latest activities
    const latestActivities = await Promise.all([
      Contact.find().sort({ createdAt: -1 }).limit(5),
      Project.find().sort({ createdAt: -1 }).limit(5),
      User.find().sort({ createdAt: -1 }).select('-password').limit(5)
    ]);

    res.json({
      overview: {
        totalUsers,
        totalProjects,
        totalContacts,
        todayContacts
      },
      projectStats,
      contactStats,
      userStats,
      activities: {
        latestContacts: latestActivities[0],
        latestProjects: latestActivities[1],
        latestUsers: latestActivities[2]
      },
      systemStatus: "Online"
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats", error: err.message });
  }
});

// Add route to get detailed stats
router.get("/detailed", auth, async (req, res) => {
  try {
    const timeRanges = {
      today: new Date(new Date().setHours(0, 0, 0, 0)),
      week: new Date(new Date().setDate(new Date().getDate() - 7)),
      month: new Date(new Date().setMonth(new Date().getMonth() - 1))
    };

    const stats = {
      contacts: {
        total: await Contact.countDocuments(),
        today: await Contact.countDocuments({ createdAt: { $gte: timeRanges.today } }),
        thisWeek: await Contact.countDocuments({ createdAt: { $gte: timeRanges.week } }),
        thisMonth: await Contact.countDocuments({ createdAt: { $gte: timeRanges.month } })
      },
      projects: {
        total: await Project.countDocuments(),
        byStatus: await Project.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        recent: await Project.find().sort({ createdAt: -1 }).limit(5)
      },
      users: {
        total: await User.countDocuments(),
        active: await User.countDocuments({ isActive: true }),
        byRole: await User.aggregate([
          { $group: { _id: '$role', count: { $sum: 1 } } }
        ])
      }
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Error fetching detailed stats", error: err.message });
  }
});

module.exports = router;
