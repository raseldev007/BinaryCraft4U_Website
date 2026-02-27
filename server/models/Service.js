const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    features: [{ type: String }],
    icon: { type: String, default: 'fas fa-code' },
    image: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    delivery: { type: String, default: '3-5 business days' },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 }
}, { timestamps: true });

serviceSchema.pre('save', function () {
    if (this.isModified('title')) {
        this.slug = this.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
});

module.exports = mongoose.model('Service', serviceSchema);
