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
// DEV-ONLY SEED ROUTE
// ==============================
if (process.env.NODE_ENV !== 'production') {
    app.post('/api/seed', async (req, res) => {
        try {
            const Product = require('./models/Product');
            const Service = require('./models/Service');
            const User = require('./models/User');

            // Helper: generate slug from title (mirrors pre-save hook)
            const toSlug = (title) => title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

            const products = [
                { title: "Modern SaaS Dashboard Template", slug: toSlug("Modern SaaS Dashboard Template"), description: "A high-performance, dark-themed dashboard template built with Next.js 14, Tailwind CSS, and Framer Motion. Includes 20+ custom components.", price: 4500, originalPrice: 6500, category: "Templates", images: ["/uploads/saas-dashboard.png"], previewUrl: "https://demo.binarynexa4u.com/saas", isFeatured: true, isActive: true, tags: ["Next.js", "Tailwind", "SaaS"] },
                { title: "Ultimate E-commerce Starter Kit", slug: toSlug("Ultimate E-commerce Starter Kit"), description: "Complete e-commerce solution with cart, checkout, and payment integration. Fully responsive and optimized for mobile.", price: 8500, originalPrice: 12000, category: "Templates", images: ["/uploads/ecommerce-starter.png"], previewUrl: "https://demo.binarynexa4u.com/ecommerce", isFeatured: true, isActive: true, tags: ["E-commerce", "React", "Node.js"] },
                { title: "Premium Portfolio Bundle", slug: toSlug("Premium Portfolio Bundle"), description: "Showcase your work with style. Includes 5 distinct portfolio styles with smooth transitions and interactive elements.", price: 2500, originalPrice: 4000, category: "Templates", images: ["/uploads/portfolio-bundle.png"], previewUrl: "https://demo.binarynexa4u.com/portfolio", isFeatured: true, isActive: true, tags: ["Portfolio", "Frontend", "Animation"] },
                { title: "AI-Powered CRM Boilerplate", slug: toSlug("AI-Powered CRM Boilerplate"), description: "Jumpstart your CRM development. Includes user management, lead tracking, and AI insights integration.", price: 15000, originalPrice: 20000, category: "Software", images: ["/uploads/crm-boilerplate.png"], previewUrl: "https://demo.binarynexa4u.com/crm", isFeatured: true, isActive: true, tags: ["CRM", "AI", "Business"] },
                { title: "CyberSecurity Audit Toolkit", slug: toSlug("CyberSecurity Audit Toolkit"), description: "Professional grade security auditing tools for small to medium businesses. Identify vulnerabilities before they become threats.", price: 12000, originalPrice: 15000, category: "Software", images: ["/uploads/security-toolkit.png"], previewUrl: "https://demo.binarynexa4u.com/audit", isFeatured: true, isActive: true, tags: ["Security", "Tools", "Audit"] },
                { title: "Scalable Cloud Hosting (Startup)", slug: toSlug("Scalable Cloud Hosting Startup"), description: "Optimized cloud hosting for growing startups. Includes managed SSL, daily backups, and 99.9% uptime guarantee.", price: 3000, category: "Hosting", images: ["/uploads/cloud-hosting.png"], previewUrl: "https://console.binarynexa4u.com", isFeatured: true, isActive: true, tags: ["Hosting", "Cloud", "Reliability"] }
            ];

            const services = [
                { title: "Custom Web Application Development", slug: toSlug("Custom Web Application Development"), description: "Scale your business with a tailored web solution.", price: 50000, category: "Development", features: ["Full-stack Development", "API Integration", "Database Design", "Ongoing Maintenance"], icon: "fas fa-code", isFeatured: true, isActive: true, delivery: "2-4 weeks" },
                { title: "Premium UI/UX Design", slug: toSlug("Premium UI/UX Design"), description: "Captivate your audience with stunning, user-centric designs.", price: 25000, category: "Design", features: ["Wireframing & Prototyping", "Visual Identity", "Responsive Design", "User Testing"], icon: "fas fa-paint-brush", isFeatured: true, isActive: true, delivery: "1-2 weeks" },
                { title: "Enterprise Cloud Migration", slug: toSlug("Enterprise Cloud Migration"), description: "Move your infrastructure to the cloud with zero downtime.", price: 75000, category: "Infrastructure", features: ["Zero-downtime Migration", "Cost Optimization", "Security Hardening", "Cloud Governance"], icon: "fas fa-cloud-upload-alt", isFeatured: true, isActive: true, delivery: "4-8 weeks" },
                { title: "Custom Mobile Apps Development", slug: toSlug("Custom Mobile Apps Development"), description: "High-performance iOS and Android apps that engage your customers.", price: 40000, category: "Development", features: ["iOS & Android Development", "Mobile-First UI/UX", "API Integration", "App Store Submission"], icon: "fas fa-mobile-alt", isFeatured: true, isActive: true, delivery: "4-12 weeks" }
            ];

            await Product.deleteMany({});
            await Service.deleteMany({});
            const Blog = require('./models/Blog');
            await Blog.deleteMany({});

            await Product.insertMany(products);
            await Service.insertMany(services);

            const blogs = [
                {
                    title: "Why Flutter is the Ultimate Choice for Cross-Platform App Development in 2026",
                    slug: "why-flutter-ultimate-choice-cross-platform-app-development-2026",
                    content: "<p>In the rapidly evolving landscape of mobile app development, choosing the right framework is critical for both speed to market and long-term maintainability. As an expert Flutter developer, I've seen firsthand how Flutter leapfrogs traditional native development and other cross-platform tools.</p><h2>The Power of a Single Codebase</h2><p>Flutter allows us to write code once and deploy it natively to iOS and Android. This isn't just a marketing gimmick—it translates to a massive reduction in development time and perfectly synchronized feature releases across all platforms.</p><h2>Real-World Impact: From Amar Bari to BD Weather App</h2><p>My recent projects heavily utilize the Flutter and Firebase ecosystem to deliver robust, scalable solutions:</p><ul><li><strong>Amar Bari (Rent Manager):</strong> A comprehensive ecosystem for landlords and tenants to manage properties and payments. Complex state management and automated bookkeeping are handled seamlessly by Flutter.</li><li><strong>NBDA (Blood Donation App):</strong> A mission-critical application connecting blood donors with patients in real-time. Ensuring real-time availability and synchronization across unstable networks for life-saving coordination is made possible through Firebase Realtime Database and background sync.</li><li><strong>BD Weather App:</strong> Visualizing complex meteorological shifts across Bangladesh with precision. Developed to provide users with hyper-local forecasts using interactive maps and external API integrations.</li></ul><h2>Mastering the Ecosystem</h2><p>Building a great app isn't just about UI. It's about architecture. By leveraging advanced State Management solutions in tandem with robust RESTful API integrations, we can build enterprise-grade applications that are both gorgeous and structurally sound.</p><blockquote><p>\"Flutter isn't just a UI toolkit; it's a complete paradigm shift in how we approach multi-platform software engineering.\"</p></blockquote>",
                    excerpt: "Discover why Flutter, combined with Firebase and advanced state management, is the premiere tech stack for building complex, scalable mobile apps like Amar Bari, NBDA, and BD Weather.",
                    category: "Development", tags: ["Flutter", "Cross-Platform", "App Development", "Firebase"],
                    featuredImage: "/uploads/blog_flutter_dev.png", author: "Md. Rasel",
                    published: true, isFeatured: true, views: 500
                },
                {
                    title: "The Future of Modern Web Development: Next.js and React Trends in 2026",
                    slug: "future-of-modern-web-development-nextjs-react-2026",
                    content: "<p>As we navigate through 2026, the landscape of web development has fundamentally shifted. Next.js has solidified its position as the enterprise standard for React applications, bringing unparalleled capabilities in Server-Side Rendering (SSR) and Edge Computing.</p><h2>The Rise of React Server Components</h2><p>React Server Components (RSC) have moved from an experimental feature to a core architectural pattern. By pushing the heavy lifting to the server, developers are now delivering zero-bundle-size applications that load instantaneously, even on low-end devices.</p><h2>Edge Computing as the New Norm</h2><p>Deploying monolithic servers in a single region is a practice of the past. Today's modern applications are deployed directly to the Edge, running serverless functions physically closer to the user to guarantee sub-50ms latency worldwide.</p><h3>Why This Matters for Your Business</h3><ul><li><strong>SEO Dominance:</strong> Instant load times and fully rendered HTML significantly boost Core Web Vitals.</li><li><strong>Conversion Rates:</strong> A 100ms decrease in load time can increase conversion rates by up to 8%.</li><li><strong>Developer Velocity:</strong> Unified tooling decreases onboarding time for new engineers.</li></ul>",
                    excerpt: "Explore how React Server Components and Edge Computing are redefining the limits of enterprise web applications.",
                    category: "Development", tags: ["React", "Next.js", "Web Development", "Future"],
                    featuredImage: "/uploads/blog_web_dev.png", author: "BinaryNexa Engineering",
                    published: true, isFeatured: true, views: 1245
                },
                {
                    title: "Supercharging Business CRM with Generative AI Predictions",
                    slug: "supercharging-business-crm-ai-predictions",
                    content: "<p>Customer Relationship Management (CRM) systems have historically been passive databases. In 2026, the integration of Generative AI has transformed CRMs into active, predictive business engines.</p><h2>From Logging to Predicting</h2><p>Modern CRMs no longer just log calls; they analyze sentiment, predict churn, and calculate the exact probability of deal closure. By constantly analyzing millions of data points across email, voice, and chat integrations, AI models can now highlight exactly which accounts need immediate attention.</p><h2>Automated Workflow Synthesis</h2><p>Imagine a CRM that drafts follow-up emails, schedules meetings, and updates deal stages without a single click from your sales reps. This is the reality of AI-augmented CRM systems today, saving enterprise teams thousands of hours annually.</p><h3>Key Benefits</h3><ul><li><strong>Predictive Lead Scoring:</strong> Focus your human capital strictly on the top 10% highest-probability prospects.</li><li><strong>Automated Data Entry:</strong> NLP models extract entities from unstructured text to automatically populate database fields.</li></ul>",
                    excerpt: "From passive databases to predictive engines: How AI is transforming enterprise CRM workflows.",
                    category: "AI", tags: ["AI", "CRM", "Business Intelligence", "Machine Learning"],
                    featuredImage: "/uploads/blog_ai_crm.png", author: "BinaryNexa AI Labs",
                    published: true, isFeatured: true, views: 3420
                },
                {
                    title: "Enterprise Cloud Migration: A Zero-Downtime Strategy",
                    slug: "enterprise-cloud-migration-zero-downtime-strategy",
                    content: "<p>Migrating monolithic legacy systems to the cloud is often viewed as a high-risk endeavor. However, with modern orchestration tools and a phased approach, enterprises can transition critical workloads to AWS, GCP, or Azure with absolutely zero downtime.</p><h2>The Multi-Phase Approach</h2><p>A successful migration is never a lift and shift operation. It requires a meticulous, multi-phase methodology:</p><ol><li><strong>Discovery & Assessment:</strong> Mapping complex network dependencies and legacy hardware constraints.</li><li><strong>The Strangler Fig Pattern:</strong> Incrementally replacing specific functionalities with new microservices.</li><li><strong>Data Synchronization:</strong> Using continuous replication tools like AWS DMS to keep databases mirrored.</li></ol><h2>Security at the Forefront</h2><p>Cloud migration is the perfect opportunity to implement a Zero Trust architecture. By utilizing IAM roles, VPC peering, and KMS encryption, enterprises end up with a significantly harder security posture post-migration.</p>",
                    excerpt: "Learn the methodology behind seamlessly migrating legacy monolithic applications to the cloud without interrupting business operations.",
                    category: "Cloud", tags: ["Cloud Computing", "AWS", "Infrastructure", "Migration"],
                    featuredImage: "/uploads/blog_cloud_migration.png", author: "BinaryNexa Cloud Team",
                    published: true, isFeatured: false, views: 890
                },
                {
                    title: "UI/UX Design Trends Defining Digital Products in 2026",
                    slug: "ui-ux-design-trends-defining-digital-products-2026",
                    content: "<p>As technology capabilities expand, user expectations follow suit. The UI/UX trends of 2026 are focused less on superficial aesthetics and entirely on creating frictionless, highly contextual digital experiences.</p><h2>Spatial Computing Interfaces</h2><p>With the mainstream adoption of mixed-reality headsets, designers are moving beyond flat screens. UI elements must now exist in 3D space, requiring an entirely new understanding of depth, lighting, and spatial hierarchy.</p><h2>Hyper-Personalization via Machine Learning</h2><p>Static layouts are obsolete. Modern interfaces use lightweight machine learning models to adapt their layout in real-time based on the user's specific behaviors, time of day, and immediate goals.</p><h3>The Return to Skeuomorphism (Neuomorphism 2.0)</h3><p>We are seeing a resurgence of tactile interfaces—buttons that look clickable, shadows that mimic real-world lighting, and micro-interactions that provide satisfying haptic feedback.</p>",
                    excerpt: "From spatial computing to hyper-personalized interfaces, discover the design philosophies shaping the future of digital products.",
                    category: "Design", tags: ["UI/UX", "Design Systems", "Web Design", "Trends"],
                    featuredImage: "/uploads/blog_ui_ux.png", author: "BinaryNexa Design Studio",
                    published: true, isFeatured: true, views: 5612
                },
                {
                    title: "Essential Cybersecurity Protocols for Modern Startups",
                    slug: "essential-cybersecurity-protocols-for-modern-startups",
                    content: "<p>Startups often prioritize shipping features rapidly over securing their infrastructure—a decision that can lead to catastrophic breaches. In today's threat landscape, cybersecurity is not an enterprise luxury; it's a day-one startup necessity.</p><h2>The Threat Landscape</h2><p>Automated scanning bots relentlessly probe public IPs for known vulnerabilities within minutes of deployment. Ransomware groups specifically target poorly secured startup databases due to their willingness to pay for survival.</p><h2>Day-One Implementation Checklist</h2><ul><li><strong>Enforce Multi-Factor Authentication (MFA):</strong> Across all internal tools, cloud consoles, and code repositories.</li><li><strong>Principle of Least Privilege:</strong> Developers should only have access to exact databases and environments they need.</li><li><strong>Automated Secret Scanning:</strong> Prevent API keys and credentials from being committed to the codebase.</li></ul><h2>Continuous Monitoring</h2><p>Incorporate cheap, effective automated DAST/SAST tooling into your CI/CD pipeline to catch vulnerabilities before they hit production.</p>",
                    excerpt: "Why cybersecurity is a day-one necessity, and the critical protocols every startup founder must implement immediately.",
                    category: "Security", tags: ["Cybersecurity", "Startups", "DevSecOps", "Data Protection"],
                    featuredImage: "/uploads/blog_cyber_sec.png", author: "BinaryNexa Security Ops",
                    published: true, isFeatured: false, views: 2105
                }
            ];
            await Blog.insertMany(blogs);

            // Seed Admin User
            const adminEmail = 'admin@binarycraft4u.com';
            const adminExists = await User.findOne({ email: adminEmail });
            if (!adminExists) {
                const adminUser = new User({
                    name: 'Admin User',
                    email: adminEmail,
                    password: 'AdminPassword123!',
                    role: 'admin'
                });
                await adminUser.save();
            }

            logger.info('[SUCCESS] Database seeded via /api/seed route');
            res.json({ success: true, message: `Seeded ${products.length} products, ${services.length} services, and ${blogs.length} blogs.` });
        } catch (err) {
            logger.error('Seed error: ' + err.message);
            res.status(500).json({ success: false, error: err.message });
        }
    });
}

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
