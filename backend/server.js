const express = require('express');
const mongoose = require('mongoose');
const cros= require('cors');
require('dotenv').config();

const app = express();
app.use(cros());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connecté"))
    .catch(err => console.error("❌ Erreur MongoDB :", err));


// Import routes
app.use('/auth', require('./routes/auth'));
app.use('/contact', require('./routes/contact'));
app.use('/projects', require('./routes/project'));
app.use('/attachments', require('./routes/attachment'));
app.use('/stats', require('./routes/stats'));


app.listen(process.env.PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${process.env.PORT}`);
});