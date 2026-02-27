const Blog = require('../models/Blog');
const logger = require('../utils/logger');

// Helper: generate slug from title
const generateSlug = (title) =>
    title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

// @desc Get all published blog posts
// @route GET /api/blog
exports.getBlogs = async (req, res, next) => {
    try {
        const { category, featured, page = 1, limit = 9, search } = req.query;
        const query = { published: true };
        if (category && category !== 'All') query.category = category;
        if (featured === 'true') query.isFeatured = true;
        if (search) query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { excerpt: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } }
        ];

        const total = await Blog.countDocuments(query);
        const blogs = await Blog.find(query)
            .select('-content')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const categories = await Blog.distinct('category', { published: true });

        res.json({ success: true, blogs, total, pages: Math.ceil(total / limit), page: parseInt(page), categories });
    } catch (error) { next(error); }
};

// @desc Get single blog post by slug
// @route GET /api/blog/:slug
exports.getBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug, published: true });
        if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' });

        // Increment view count
        blog.views = (blog.views || 0) + 1;
        await blog.save();

        res.json({ success: true, blog });
    } catch (error) { next(error); }
};

// @desc Get all blogs (admin, including unpublished)
// @route GET /api/blog/admin/all
exports.getAdminBlogs = async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const total = await Blog.countDocuments();
        const blogs = await Blog.find()
            .select('-content')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();
        res.json({ success: true, blogs, total, pages: Math.ceil(total / limit) });
    } catch (error) { next(error); }
};

// @desc Create blog post (admin)
// @route POST /api/blog
exports.createBlog = async (req, res, next) => {
    try {
        const { title, content, excerpt, category, tags, featuredImage, author, published, isFeatured } = req.body;
        if (!title || !content) return res.status(400).json({ success: false, message: 'Title and content are required.' });

        const slug = generateSlug(title);
        const exists = await Blog.findOne({ slug });
        const finalSlug = exists ? `${slug}-${Date.now()}` : slug;

        const blog = await Blog.create({
            title, slug: finalSlug, content, excerpt,
            category: category || 'General',
            tags: Array.isArray(tags) ? tags : [],
            featuredImage: featuredImage || '',
            author: author || 'Binary Craft Team',
            published: published === true || published === 'true',
            isFeatured: isFeatured === true || isFeatured === 'true'
        });

        logger.info(`Blog post created: "${title}" by admin`);
        res.status(201).json({ success: true, blog });
    } catch (error) { next(error); }
};

// @desc Update blog post (admin)
// @route PUT /api/blog/:id
exports.updateBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' });
        logger.info(`Blog post updated: ${req.params.id}`);
        res.json({ success: true, blog });
    } catch (error) { next(error); }
};

// @desc Delete blog post (admin)
// @route DELETE /api/blog/:id
exports.deleteBlog = async (req, res, next) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        logger.info(`Blog post deleted: ${req.params.id}`);
        res.json({ success: true, message: 'Blog post deleted' });
    } catch (error) { next(error); }
};
