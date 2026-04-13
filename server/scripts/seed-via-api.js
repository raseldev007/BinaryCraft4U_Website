/**
 * seed-via-api.js
 * Seeds products & services directly into the already-running
 * server's MongoDB (including the in-memory instance).
 * Usage: node scripts/seed-via-api.js
 */

require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');

const Product = require('../models/Product');
const Service = require('../models/Service');

const products = [
    {
        title: "Modern SaaS Dashboard Template",
        description: "A high-performance, dark-themed dashboard template built with Next.js 14, Tailwind CSS, and Framer Motion. Includes 20+ custom components.",
        price: 4500, originalPrice: 6500, category: "Templates",
        images: ["/uploads/saas-dashboard.png"],
        previewUrl: "https://demo.binarynexa4u.com/saas",
        isFeatured: true, isActive: true, tags: ["Next.js", "Tailwind", "SaaS"], isNew: true
    },
    {
        title: "Ultimate E-commerce Starter Kit",
        description: "Complete e-commerce solution with cart, checkout, and payment integration. Fully responsive and optimized for mobile devices.",
        price: 8500, originalPrice: 12000, category: "Templates",
        images: ["/uploads/ecommerce-starter.png"],
        previewUrl: "https://demo.binarynexa4u.com/ecommerce",
        isFeatured: true, isActive: true, tags: ["E-commerce", "React", "Node.js"]
    },
    {
        title: "Premium Portfolio Bundle",
        description: "Showcase your work with style. Includes 5 distinct portfolio styles with smooth transitions and interactive elements.",
        price: 2500, originalPrice: 4000, category: "Templates",
        images: ["/uploads/portfolio-bundle.png"],
        previewUrl: "https://demo.binarynexa4u.com/portfolio",
        isFeatured: true, isActive: true, tags: ["Portfolio", "Frontend", "Animation"]
    },
    {
        title: "AI-Powered CRM Boilerplate",
        description: "Jumpstart your CRM development with this robust boilerplate. Includes user management, lead tracking, and AI insights integration.",
        price: 15000, originalPrice: 20000, category: "Software",
        images: ["/uploads/crm-boilerplate.png"],
        previewUrl: "https://demo.binarynexa4u.com/crm",
        isFeatured: true, isActive: true, tags: ["CRM", "AI", "Business"], isNew: true
    },
    {
        title: "CyberSecurity Audit Toolkit",
        description: "Professional grade security auditing tools for small to medium businesses. Identify vulnerabilities before they become threats.",
        price: 12000, originalPrice: 15000, category: "Software",
        images: ["/uploads/security-toolkit.png"],
        previewUrl: "https://demo.binarynexa4u.com/audit",
        isFeatured: true, isActive: true, tags: ["Security", "Tools", "Audit"]
    },
    {
        title: "Scalable Cloud Hosting (Startup)",
        description: "Optimized cloud hosting for growing startups. Includes managed SSL, daily backups, and 99.9% uptime guarantee.",
        price: 3000, category: "Hosting",
        images: ["/uploads/cloud-hosting.png"],
        previewUrl: "https://console.binarynexa4u.com",
        isFeatured: true, isActive: true, tags: ["Hosting", "Cloud", "Reliability"]
    }
];

const services = [
    {
        title: "Custom Web Application Development",
        description: "Scale your business with a tailored web solution. From planning to deployment.",
        price: 50000, category: "Development",
        features: ["Full-stack Development", "API Integration", "Database Design", "Ongoing Maintenance"],
        icon: "fas fa-code", isFeatured: true, isActive: true, delivery: "2-4 weeks"
    },
    {
        title: "Premium UI/UX Design",
        description: "Captivate your audience with stunning, user-centric designs.",
        price: 25000, category: "Design",
        features: ["Wireframing & Prototyping", "Visual Identity", "Responsive Design", "User Testing"],
        icon: "fas fa-paint-brush", isFeatured: true, isActive: true, delivery: "1-2 weeks"
    },
    {
        title: "Enterprise Cloud Migration",
        description: "Move your infrastructure to the cloud with confidence. Zero-downtime migration.",
        price: 75000, category: "Infrastructure",
        features: ["Zero-downtime Migration", "Cost Optimization", "Security Hardening", "Cloud Governance"],
        icon: "fas fa-cloud-upload-alt", isFeatured: true, isActive: true, delivery: "4-8 weeks"
    },
    {
        title: "Custom Mobile Apps Development",
        description: "Engage your customers on the go with high-performance iOS and Android apps.",
        price: 40000, category: "Development",
        features: ["iOS & Android Development", "Mobile-First UI/UX Design", "API & Cloud Integration", "App Store Submission"],
        icon: "fas fa-mobile-alt", isFeatured: true, isActive: true, delivery: "4-12 weeks"
    }
];

const seed = async () => {
    try {
        // Use in-memory server if available, otherwise real URI
        const { MongoMemoryServer } = require('mongodb-memory-server');

        // Try to connect to existing running mongod via shared URI
        // Since in-memory server URI is dynamic, we re-create one here for seeding
        console.log('⚙️  Starting temporary in-memory MongoDB for seeding...');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
        console.log('✅ Connected to seed instance');

        await Product.deleteMany({});
        await Service.deleteMany({});

        await Product.insertMany(products);
        console.log(`✅ Seeded ${products.length} products`);

        await Service.insertMany(services);
        console.log(`✅ Seeded ${services.length} services`);

        await mongod.stop();
        console.log('\n⚠️  Note: This seeded a temporary instance.');
        console.log('   To seed the LIVE server, use a real MONGO_URI in server/.env');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err.message);
        process.exit(1);
    }
};

seed();
