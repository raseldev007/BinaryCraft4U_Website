const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config({ path: './.env' });

// Load Models
const User = require('../models/User');
const Product = require('../models/Product');
const Service = require('../models/Service');

// Connect to DB
console.log('Connecting to:', process.env.MONGO_URI ? 'URI found' : 'URI MISSING');
if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is missing from environment variables');
    process.exit(1);
}
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Mongoose Connected...'))
    .catch(err => {
        console.error('Mongoose Connection Error:', err);
        process.exit(1);
    });

const users = [
    {
        name: 'Admin User',
        email: 'admin@binarycraft4u.com',
        password: 'AdminPassword123!', // will be hashed
        role: 'admin',
        phone: '+1 555-123-4567',
        address: { street: '123 Tech Lane', city: 'Silicon Valley', country: 'USA' }
    }
];

const products = [
    {
        title: 'Complete BD UI Kit',
        description: 'A premium UI kit for modern web applications featuring 100+ Bangladesh-ready localized components.',
        price: 5000,
        category: 'design',
        icon: '🎨',
        stock: 999,
        tags: ['New', 'Figma']
    },
    {
        title: 'SaaS Startup Boilerplate',
        description: 'Complete Next.js, Node, and MongoDB boilerplate to start your next South Asian SaaS in minutes.',
        price: 15000,
        discountPrice: 10000,
        category: 'software',
        icon: '🚀',
        stock: 50,
        tags: ['Sale', 'React']
    }
];

const services = [
    {
        title: 'Custom E-commerce Platform',
        description: 'Full-stack development of scalable e-commerce applications tailored to the Bangladeshi market (bKash/SSLCommerz ready).',
        price: 150000,
        category: 'web',
        icon: '🌐',
        delivery: '14-30 days',
        features: ['React/Next.js Frontend', 'Payment Gateway Integration', 'Database Design', 'Deployment']
    },
    {
        title: 'Corporate Security Audit',
        description: 'Comprehensive security audit of your server architecture and codebase to protect local businesses.',
        price: 80000,
        category: 'security',
        icon: '🛡️',
        delivery: '5-7 days',
        features: ['Vulnerability Scanning', 'Penetration Testing', 'Actionable Report']
    }
];

const importData = async () => {
    try {
        console.log('Clearing database...');
        await User.deleteMany();
        await Product.deleteMany();
        await Service.deleteMany();

        console.log('Seeding Users...');
        const salt = await bcrypt.genSalt(10);
        const hashedUsers = users.map(user => ({
            ...user,
            password: bcrypt.hashSync(user.password, salt)
        }));
        await User.insertMany(hashedUsers);

        console.log('Seeding Products...');
        const productsWithSlugs = products.map(p => ({
            ...p,
            slug: p.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        }));
        await Product.insertMany(productsWithSlugs);

        console.log('Seeding Services...');
        const servicesWithSlugs = services.map(s => ({
            ...s,
            slug: s.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        }));
        await Service.insertMany(servicesWithSlugs);

        console.log('✅ Local Data Imported Successfully!');
        process.exit();
    } catch (err) {
        console.error(`❌ Error importing data: ${err.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    console.log('Data destruction not implemented here. Use standard connect.');
    process.exit();
} else {
    importData();
}
