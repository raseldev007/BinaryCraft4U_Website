const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: '' },
    category: { type: String, default: 'General', trim: true },
    tags: [{ type: String, trim: true }],
    featuredImage: { type: String, default: '' },
    author: { type: String, default: 'Binary Craft Team' },
    published: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
}, { timestamps: true });

blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1, published: 1 });
blogSchema.index({ isFeatured: 1, published: 1 });
blogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Blog', blogSchema);
