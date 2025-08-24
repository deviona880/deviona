const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    userEmail: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
