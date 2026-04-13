const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Use upload.any() so both multipart (file upload page) and JSON (modal) work on the same route
const optionalUpload = (req, res, next) => {
    const ct = req.headers['content-type'] || '';
    if (ct.includes('multipart/form-data')) {
        return upload.array('images', 5)(req, res, next);
    }
    next();
};

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, adminOnly, optionalUpload, createProduct);
router.put('/:id', protect, adminOnly, optionalUpload, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
