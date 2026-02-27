const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Contact = require('../models/Contact');

exports.getDashboard = async (req, res, next) => {
    try {
        const [usersCount, ordersCount, productsCount, servicesCount, messagesCount, recentOrders, orders] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            Order.countDocuments(),
            Product.countDocuments({ isActive: true }),
            Service.countDocuments({ isActive: true }),
            Contact.countDocuments({ isRead: false }),
            Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
            Order.find({ paymentStatus: 'paid' })
        ]);
        const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        res.json({ success: true, data: { usersCount, ordersCount, productsCount, servicesCount, messagesCount, revenue, recentOrders } });
    } catch (error) { next(error); }
};

exports.getAnalytics = async (req, res, next) => {
    try {
        const now = new Date();
        const months = [];
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({ year: d.getFullYear(), month: d.getMonth() });
        }

        const [allOrders, allUsers] = await Promise.all([
            Order.find({}).select('totalAmount paymentStatus createdAt').lean(),
            User.find({ role: 'user' }).select('createdAt').lean()
        ]);

        const monthlyData = months.map(({ year, month }) => {
            const label = new Date(year, month, 1).toLocaleString('en', { month: 'short', year: '2-digit' });
            const monthOrders = allOrders.filter(o => {
                const d = new Date(o.createdAt);
                return d.getFullYear() === year && d.getMonth() === month;
            });
            const monthUsers = allUsers.filter(u => {
                const d = new Date(u.createdAt);
                return d.getFullYear() === year && d.getMonth() === month;
            });
            const revenue = monthOrders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.totalAmount, 0);
            return { label, orders: monthOrders.length, revenue, users: monthUsers.length };
        });

        res.json({ success: true, data: { monthlyData } });
    } catch (error) { next(error); }
};

exports.getTopProducts = async (req, res, next) => {
    try {
        const topProducts = await Order.aggregate([
            { $unwind: '$items' },
            { $match: { 'items.itemType': 'product' } },
            { $group: { _id: '$items.itemId', title: { $first: '$items.title' }, totalSold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);
        res.json({ success: true, data: topProducts });
    } catch (error) { next(error); }
};

exports.getUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const query = { role: 'user' };
        if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
        const users = await User.find(query).select('-password').sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit);
        const total = await User.countDocuments(query);
        res.json({ success: true, users, total });
    } catch (error) { next(error); }
};

exports.toggleBlockUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.json({ success: true, message: user.isBlocked ? 'User blocked' : 'User unblocked', user });
    } catch (error) { next(error); }
};

exports.deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted' });
    } catch (error) { next(error); }
};

exports.getAllOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const query = status ? { status } : {};
        const orders = await Order.find(query).populate('user', 'name email').sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit);
        const total = await Order.countDocuments(query);
        res.json({ success: true, orders, total });
    } catch (error) { next(error); }
};

exports.exportOrdersCSV = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 }).lean();
        const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Total (BDT)', 'Status', 'Payment Status', 'Payment Method', 'Date'];
        const rows = orders.map(o => [
            o._id.toString(),
            o.user?.name || 'N/A',
            o.user?.email || 'N/A',
            o.totalAmount,
            o.status,
            o.paymentStatus,
            o.paymentMethod,
            new Date(o.createdAt).toISOString().split('T')[0]
        ]);
        const csv = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');
        res.send(csv);
    } catch (error) { next(error); }
};

exports.exportUsersCSV = async (req, res, next) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 }).lean();
        const headers = ['User ID', 'Name', 'Email', 'Phone', 'Provider', 'Blocked', 'Joined'];
        const rows = users.map(u => [
            u._id.toString(),
            u.name,
            u.email,
            u.phone || '',
            u.provider,
            u.isBlocked ? 'Yes' : 'No',
            new Date(u.createdAt).toISOString().split('T')[0]
        ]);
        const csv = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
        res.send(csv);
    } catch (error) { next(error); }
};

exports.getMessages = async (req, res, next) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json({ success: true, messages });
    } catch (error) { next(error); }
};

exports.markMessageRead = async (req, res, next) => {
    try {
        await Contact.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ success: true, message: 'Marked as read' });
    } catch (error) { next(error); }
};
