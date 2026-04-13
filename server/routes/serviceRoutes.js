const express = require('express');
const router = express.Router();
const { getServices, getService, createService, updateService, deleteService } = require('../controllers/serviceController');
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

// Optional multer: supports both multipart (file upload page) and plain JSON (admin modal)
const optionalUpload = (req, res, next) => {
    const ct = req.headers['content-type'] || '';
    if (ct.includes('multipart/form-data')) {
        return upload.single('image')(req, res, next);
    }
    next();
};

router.get('/', getServices);
router.get('/:id', getService);
router.post('/', protect, adminOnly, optionalUpload, createService);
router.put('/:id', protect, adminOnly, optionalUpload, updateService);
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;
