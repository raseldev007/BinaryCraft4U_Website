const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    adminName: { type: String, default: '' },
    action: { type: String, required: true }, // e.g. 'DELETE_USER', 'UPDATE_ORDER', 'CREATE_PRODUCT'
    target: { type: String, default: '' },    // e.g. user ID or product title
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    ip: { type: String, default: '' },
}, { timestamps: true });

activityLogSchema.index({ admin: 1, createdAt: -1 });
activityLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
