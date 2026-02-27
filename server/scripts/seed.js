const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/Product');
const Service = require('../models/Service');

const products = [
    {
        title: "Modern SaaS Dashboard Template",
        description: "A high-performance, dark-themed dashboard template built with Next.js 14, Tailwind CSS, and Framer Motion. Includes 20+ custom components.",
        price: 4500,
        originalPrice: 6500,
        category: "Templates",
        isFeatured: true,
        isActive: true,
        tags: ["Next.js", "Tailwind", "SaaS"],
        isNew: true
    },
    {
        title: "Ultimate E-commerce Starter Kit",
        description: "Complete e-commerce solution with cart, checkout, and payment integration. Fully responsive and optimized for mobile devices.",
        price: 8500,
        originalPrice: 12000,
        category: "Templates",
        isFeatured: true,
        isActive: true,
        tags: ["E-commerce", "React", "Node.js"]
    },
    {
        title: "Premium Portfolio Bundle",
        description: "Showcase your work with style. Includes 5 distinct portfolio styles with smooth transitions and interactive elements.",
        price: 2500,
        originalPrice: 4000,
        category: "Templates",
        isFeatured: true,
        isActive: true,
        tags: ["Portfolio", "Frontend", "Animation"]
    },
    {
        title: "AI-Powered CRM Boilerplate",
        description: "Jumpstart your CRM development with this robust boilerplate. Includes user management, lead tracking, and AI insights integration.",
        price: 15000,
        originalPrice: 20000,
        category: "Software",
        isFeatured: true,
        isActive: true,
        tags: ["CRM", "AI", "Business"],
        isNew: true
    },
    {
        title: "CyberSecurity Audit Toolkit",
        description: "Professional grade security auditing tools for small to medium businesses. Identify vulnerabilities before they become threats.",
        price: 12000,
        originalPrice: 15000,
        category: "Software",
        isFeatured: true,
        isActive: true,
        tags: ["Security", "Tools", "Audit"]
    },
    {
        title: "Scalable Cloud Hosting (Startup)",
        description: "Optimized cloud hosting for growing startups. Includes managed SSL, daily backups, and 99.9% uptime guarantee.",
        price: 3000,
        category: "Hosting",
        isFeatured: true,
        isActive: true,
        tags: ["Hosting", "Cloud", "Reliability"]
    }
];

const services = [
    {
        title: "Custom Web Application Development",
        description: "Scale your business with a tailored web solution. From planning to deployment, we build secure, scalable, and high-performance applications.",
        price: 50000,
        category: "Development",
        features: ["Full-stack Development", "API Integration", "Database Design", "Ongoing Maintenance"],
        icon: "fas fa-code",
        isFeatured: true,
        isActive: true,
        delivery: "2-4 weeks"
    },
    {
        title: "Premium UI/UX Design",
        description: "Captivate your audience with stunning, user-centric designs. We focus on usability, accessibility, and brand consistency.",
        price: 25000,
        category: "Design",
        features: ["Wireframing & Prototyping", "Visual Identity", "Responsive Design", "User Testing"],
        icon: "fas fa-paint-brush",
        isFeatured: true,
        isActive: true,
        delivery: "1-2 weeks"
    },
    {
        title: "Enterprise Cloud Migration",
        description: "Move your infrastructure to the cloud with confidence. We handle everything from strategy to execution for a seamless transition.",
        price: 75000,
        category: "Infrastructure",
        features: ["Zero-downtime Migration", "Cost Optimization", "Security Hardening", "Cloud Governance"],
        icon: "fas fa-cloud-upload-alt",
        isFeatured: true,
        isActive: true,
        delivery: "4-8 weeks"
    }
];

const seedDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/binarycraft';
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Clear existing data (optional, but good for consistent seeding)
        console.log('Clearing existing products and services...');
        await Product.deleteMany({});
        await Service.deleteMany({});

        console.log('Seeding products...');
        for (const p of products) {
            await new Product(p).save();
        }
        console.log(`Successfully seeded ${products.length} products`);

        console.log('Seeding services...');
        for (const s of services) {
            await new Service(s).save();
        }
        console.log(`Successfully seeded ${services.length} services`);

        console.log('Database seeding complete! 🚀');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
