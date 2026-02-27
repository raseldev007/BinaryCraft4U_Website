const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    category: { type: String, required: true },
    images: [{ type: String }],
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

module.exports = mongoose.model('Product', productSchema);
