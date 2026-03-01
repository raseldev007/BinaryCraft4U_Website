require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');
const cacheControl = require('./middleware/cacheControl');

// Connect DB
connectDB();

const app = express();

// ==============================
// SECURITY MIDDLEWARE
// ==============================
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow uploads to be served
}));

// CORS config
const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'https://binarynexa4u.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
];
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        // Allow all Vercel preview/production domains
        if (origin.endsWith('.vercel.app')) return callback(null, true);
        // In development, allow all
        if (process.env.NODE_ENV !== 'production') return callback(null, true);
        callback(new Error('Not allowed by CORS: ' + origin));
    },
    credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitize user data to prevent MongoDB injection (Disabled due to Express 5 compatibility)
// const mongoSanitize = require('express-mongo-sanitize');
// app.use(mongoSanitize());

// Prevent HTTP parameter pollution (Disabled due to Express 4.19+ incompatibility)
// const hpp = require('hpp');
// app.use(hpp({ whitelist: ['category', 'tags', 'sort', 'page', 'limit'] }));

// HTTP Request logging with Morgan → Winston
app.use(morgan('combined', { stream: logger.stream }));

// Rate limiting (global) — applies before routes
app.use('/api', apiLimiter);
app.use('/api', cacheControl(300, 60)); // 5min cache, 1min stale-while-revalidate

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==============================
// ROUTES (v1)
// ==============================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/subscribers', require('./routes/subscriberRoutes'));
app.use('/api/blog', require('./routes/blogRoutes'));

// API versioning aliases (same routes, v1 prefix)
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/products', require('./routes/productRoutes'));
app.use('/api/v1/services', require('./routes/serviceRoutes'));
app.use('/api/v1/cart', require('./routes/cartRoutes'));
app.use('/api/v1/orders', require('./routes/orderRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));
app.use('/api/v1/blog', require('./routes/blogRoutes'));
app.use('/api/v1/contact', require('./routes/contactRoutes'));
app.use('/api/v1/subscribers', require('./routes/subscriberRoutes'));

// ==============================
// HEALTH CHECK
// ==============================
app.get('/api/health', (req, res) => {
    const uptime = process.uptime();
    const memUsage = process.memoryUsage();
    res.json({
        success: true,
        message: 'BinaryNexa API is running!',
        environment: process.env.NODE_ENV || 'development',
        uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
        memory: {
            heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
            heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        },
        timestamp: new Date().toISOString()
    });
});
app.get('/api/v1/health', (req, res) => res.redirect('/api/health'));

// ==============================
// ERROR HANDLER
// ==============================
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
logger.info(`Starting server in ${process.env.NODE_ENV || 'development'} mode...`);
app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
    if (process.env.NODE_ENV === 'production') {
        logger.info('Production environment detected.');
    }
});
