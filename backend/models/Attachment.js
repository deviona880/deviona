const mongoose = require('mongoose');

const attachementSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ["task", "file", "note"], default: "task" },
    content: { type: String},
    fileUrl: { type: String },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Attachment', attachementSchema);