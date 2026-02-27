const express = require('express');
const router = express.Router();
const { getBlogs, getBlog, getAdminBlogs, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', getBlogs);
router.get('/admin/all', protect, adminOnly, getAdminBlogs);
router.get('/:slug', getBlog);

// Admin routes
router.post('/', protect, adminOnly, createBlog);
router.put('/:id', protect, adminOnly, updateBlog);
router.delete('/:id', protect, adminOnly, deleteBlog);

module.exports = router;
