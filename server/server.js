require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        callback(null, true);
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/subscribers', require('./routes/subscriberRoutes'));

// Health check
app.get('/api/health', (req, res) => res.json({ success: true, message: 'Binary Craft API is running!' }));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
console.log(`🚀 Starting server in ${process.env.NODE_ENV || 'development'} mode...`);
app.listen(PORT, () => {
    console.log(`✅ Server is listening on port ${PORT}`);
    if (process.env.NODE_ENV === 'production') {
        console.log('🌐 Production environment detected.');
    }
});
