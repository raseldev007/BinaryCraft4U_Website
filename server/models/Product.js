const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: true },
    extendedDescription: { type: String, default: "" }, // For rich "why buy" details
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    category: { type: String, required: true },
    images: [{ type: String }],
    previewUrl: { type: String, default: "" }, // Live demo link
    stock: { type: Number, default: 0 },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 }
}, { timestamps: true });

productSchema.pre('save', function () {
    if (this.isModified('title')) {
        this.slug = this.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
});

productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
