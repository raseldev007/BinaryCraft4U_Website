const express = require('express');
const router = express.Router();
const {
    getDashboard, getUsers, toggleBlockUser, deleteUser, getAllOrders, getMessages, markMessageRead,
    getAnalytics, getTopProducts, exportOrdersCSV, exportUsersCSV
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);
router.get('/dashboard', getDashboard);
router.get('/analytics', getAnalytics);
router.get('/top-products', getTopProducts);
router.get('/users', getUsers);
router.put('/users/:id/toggle-block', toggleBlockUser);
router.delete('/users/:id', deleteUser);
router.get('/orders', getAllOrders);
router.get('/messages', getMessages);
router.put('/messages/:id/read', markMessageRead);
router.get('/export/orders', exportOrdersCSV);
router.get('/export/users', exportUsersCSV);

module.exports = router;
