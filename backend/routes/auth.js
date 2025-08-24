const express= require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')
const {body,validationResult}=require('express-validator');
const User=require('../models/User');
const auth=require('../middleware/authMiddleware');


//inscription
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Le nom est requis'),
    body('email').isEmail().withMessage('L\'email doit être valide'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Role invalide')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'Utilisateur déjà existant' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user with optional role (default to 'user')
      user = new User({
        name,
        email,
        password: hashedPassword,
        role: role || 'user',
        isActive: true // Set default active status
      });

      await user.save();
      
      // Return user without password
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      
      res.status(201).json({ 
        message: 'Utilisateur créé avec succès', 
        user: userWithoutPassword 
      });
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
  }
);



//connexion
router.post('/login', 
    [body('email').isEmail().withMessage('L\'email doit être valide'),
     body('password').notEmpty().withMessage('Le mot de passe est requis')],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Identifiants invalides' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Identifiants invalides' });
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token});
        } catch (err) {
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }
);


//get data of connected user
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Get all users (admin only)
router.get('/users', auth, async (req, res) => {
  try {
    // Check if the connected user is admin
    const currentUser = await User.findById(req.user.id);
    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).json({ message: "Accès refusé (Admin uniquement)" });
    }

    const users = await User.find().select('-password'); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});
// Update user (admin only)
router.put('/users/:id', auth, async (req, res) => {
  try {
    // Check if the connected user is admin
    const currentUser = await User.findById(req.user.id);
    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).json({ message: "Accès refusé (Admin uniquement)" });
    }

    const { name, email, role, isActive } = req.body;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isActive },
      { new: true, runValidators: true }
    ).select('-password'); // don't return password

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ message: "Utilisateur mis à jour avec succès", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});
router.put('/update-profile/:id', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Build update object
        const updateData = { name, email, phone };

        // If password is provided, hash it
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// Toggle user active status (admin only)
router.patch('/users/:id/toggle', auth, async (req, res) => {
  try {
    // Check if the connected user is admin
    const currentUser = await User.findById(req.user.id);
    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).json({ message: "Accès refusé (Admin uniquement)" });
    }

    // Find user and toggle isActive
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: "Statut de l'utilisateur mis à jour avec succès", user });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = router;