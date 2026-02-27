const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' }); // Ensure correct absolute path for dotenv
const Product = require('../models/Product');
const Service = require('../models/Service');

const products = [
    {
        title: "Modern SaaS Dashboard Template",
        description: "A high-performance, dark-themed dashboard template built with Next.js 14, Tailwind CSS, and Framer Motion. Includes 20+ custom components.",
        extendedDescription: "<h3>Why Choose This Template?</h3><p>Accelerate your SaaS MVP launch with our meticulously crafted dashboard template. Built on the bleeding edge of web technology, it guarantees a <strong>99/100 Lighthouse score</strong> right out of the box.</p><h4>Why Ours Stands Out:</h4><ul class='list-disc pl-5 mt-2 space-y-1 text-text-muted'><li><strong>Bleeding Edge Tech:</strong> Fully utilizes Next.js 14 App Router and React Server Components.</li><li><strong>Flawless Animations:</strong> Fluid, 60fps animations powered by Framer Motion.</li><li><strong>Developer Experience:</strong> Heavily commented code, strict TypeScript, and comprehensive documentation make onboarding a breeze.</li></ul>",
        price: 4500,
        originalPrice: 6500,
        category: "Templates",
        images: ["/uploads/saas-dashboard.png"],
        previewUrl: "https://demo.binarycraft4u.com/saas",
        isFeatured: true,
        isActive: true,
        tags: ["Next.js", "Tailwind", "SaaS"],
        isNew: true
    },
    {
        title: "Ultimate E-commerce Starter Kit",
        description: "Complete e-commerce solution with cart, checkout, and payment integration. Fully responsive and optimized for mobile devices.",
        extendedDescription: "<h3>Transform Your Digital Storefront</h3><p>Stop wrestling with complex e-commerce setups. Our Starter Kit provides a production-ready foundation designed to maximize conversion rates and provide a frictionless shopping experience.</p><h4>The Binary Craft Advantage:</h4><ul class='list-disc pl-5 mt-2 space-y-1 text-text-muted'><li><strong>Conversion Optimized:</strong> UI/UX researched and designed specifically to reduce cart abandonment.</li><li><strong>Stripe Integration:</strong> Pre-configured secure payment processing.</li><li><strong>SEO Ready:</strong> Semantic HTML and dynamic meta tags ensure your products rank high.</li></ul>",
        price: 8500,
        originalPrice: 12000,
        category: "Templates",
        images: ["/uploads/ecommerce-starter.png"],
        previewUrl: "https://demo.binarycraft4u.com/ecommerce",
        isFeatured: true,
        isActive: true,
        tags: ["E-commerce", "React", "Node.js"]
    },
    {
        title: "Premium Portfolio Bundle",
        description: "Showcase your work with style. Includes 5 distinct portfolio styles with smooth transitions and interactive elements.",
        extendedDescription: "<h3>Make a Lasting First Impression</h3><p>Your portfolio is your digital handshake. This bundle offers 5 distinct, premium layouts designed to captivate potential clients and employers the moment they land on your page.</p><h4>Why Creatives Choose Us:</h4><ul class='list-disc pl-5 mt-2 space-y-1 text-text-muted'><li><strong>Unique Layouts:</strong> Stand out from the sea of generic templates with bespoke, award-winning design patterns.</li><li><strong>Performance First:</strong> Lazy-loaded images and minimal JS bundles guarantee lightning-fast load times.</li><li><strong>Easy Customization:</strong> Change colors, typography, and content via a simple configuration file.</li></ul>",
        price: 2500,
        originalPrice: 4000,
        category: "Templates",
        images: ["/uploads/portfolio-bundle.png"],
        previewUrl: "https://demo.binarycraft4u.com/portfolio",
        isFeatured: true,
        isActive: true,
        tags: ["Portfolio", "Frontend", "Animation"]
    },
    {
        title: "AI-Powered CRM Boilerplate",
        description: "Jumpstart your CRM development with this robust boilerplate. Includes user management, lead tracking, and AI insights integration.",
        extendedDescription: "<h3>The Future of Customer Management</h3><p>Don't build your CRM from scratch. Our boilerplate provides the complex auth, data tables, and charting infrastructure you need, supercharged with AI integrations.</p><h4>Why It's the Best Investment:</h4><ul class='list-disc pl-5 mt-2 space-y-1 text-text-muted'><li><strong>AI-Ready:</strong> Pre-built hooks and UI components for integrating OpenAI/Anthropic for predictive lead scoring.</li><li><strong>Enterprise Security:</strong> Role-based access control (RBAC) and JWT authentication built-in.</li><li><strong>Scalable Architecture:</strong> Designed to handle millions of rows without degrading performance.</li></ul>",
        price: 15000,
        originalPrice: 20000,
        category: "Software",
        images: ["/uploads/crm-boilerplate.png"],
        previewUrl: "https://demo.binarycraft4u.com/crm",
        isFeatured: true,
        isActive: true,
        tags: ["CRM", "AI", "Business"],
        isNew: true
    },
    {
        title: "CyberSecurity Audit Toolkit",
        description: "Professional grade security auditing tools for small to medium businesses. Identify vulnerabilities before they become threats.",
        extendedDescription: "<h3>Secure Your Perimeter</h3><p>Enterprise-grade security scanning shouldn't cost a fortune. This toolkit provides actionable insights and automated vulnerability scanning previously reserved for large corporations.</p><h4>Unmatched Value:</h4><ul class='list-disc pl-5 mt-2 space-y-1 text-text-muted'><li><strong>Comprehensive Scanning:</strong> Detects OWASP Top 10 vulnerabilities automatically.</li><li><strong>Actionable Reports:</strong> Generates beautiful, PDF-ready reports you can hand directly to stakeholders.</li><li><strong>Continuous Updates:</strong> Threat signatures update weekly to safeguard against zero-day exploits.</li></ul>",
        price: 12000,
        originalPrice: 15000,
        category: "Software",
        images: ["/uploads/security-toolkit.png"],
        previewUrl: "https://demo.binarycraft4u.com/audit",
        isFeatured: true,
        isActive: true,
        tags: ["Security", "Tools", "Audit"]
    },
    {
        title: "Scalable Cloud Hosting (Startup)",
        description: "Optimized cloud hosting for growing startups. Includes managed SSL, daily backups, and 99.9% uptime guarantee.",
        extendedDescription: "<h3>Infrastructure That Grows With You</h3><p>Focus on your code, not your servers. Our managed cloud hosting provides a zero-ops environment heavily optimized for modern JavaScript frameworks.</p><h4>Why Host With Binary Craft?</h4><ul class='list-disc pl-5 mt-2 space-y-1 text-text-muted'><li><strong>Blazing Fast:</strong> Edge caching deployed globally to 300+ cities.</li><li><strong>Ironclad Security:</strong> DDoS protection and automatic SSL certificate renewal.</li><li><strong>Dedicated Support:</strong> 24/7 access to actual engineers, not just support scripts.</li></ul>",
        price: 3000,
        category: "Hosting",
        images: ["/uploads/cloud-hosting.png"],
        previewUrl: "https://console.binarycraft4u.com",
        isFeatured: true,
        isActive: true,
        tags: ["Hosting", "Cloud", "Reliability"]
    }
];

const services = [
    {
        title: "Custom Web Application Development",
        description: "Scale your business with a tailored web solution. From planning to deployment, we build secure, scalable, and high-performance applications.",
        extendedDescription: "<h3>Bring Your Vision to Life</h3><p>We don't just write code; we solve business problems. Our bespoke web applications are custom-engineered to automate your workflows, engage your users, and scale infinitely.</p><h4>Our Approach:</h4><ul class='list-disc pl-5 mt-2 space-y-1 text-text-muted'><li><strong>Discovery & Architecture:</strong> We map out every edge case and design a robust database schema before writing a single line of code.</li><li><strong>Agile Execution:</strong> Weekly sprint reviews ensure you are always in the loop and the product aligns with your vision.</li><li><strong>Post-Launch Support:</strong> We offer comprehensive SLAs to keep your application running smoothly year-round.</li></ul>",
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
        extendedDescription: "<h3>Design That Converts</h3><p>A beautiful website is useless if users can't navigate it. We blend behavioral psychology with striking visual design to create interfaces that users love and that drive measurable business results.</p><h4>Why Our Designs Win:</h4><ul class='list-disc pl-5 mt-2 space-y-1 text-text-muted'><li><strong>Data-Driven Decisions:</strong> We base our wireframes on actual user research and heatmaps, not just intuition.</li><li><strong>Pixel-Perfect Handoffs:</strong> We provide developers with comprehensive design systems, reducing friction and implementation errors.</li><li><strong>Accessible By Default:</strong> We adhere stringently to WCAG guidelines, ensuring your product is usable by everyone.</li></ul>",
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
        extendedDescription: "<h3>Modernize Your Infrastructure</h3><p>Legacy systems drain resources and slow down innovation. Our cloud architects specialize in migrating complex, monolithic applications to modern, microservice-based cloud environments with zero downtime.</p><h4>The Migration Process:</h4><ul class='list-disc pl-5 mt-2 space-y-1 text-text-muted'><li><strong>Comprehensive Audit:</strong> We analyze your current architecture to identify bottlenecks and structural dependencies.</li><li><strong>Phased Rollout:</strong> We migrate components systematically, reducing risk and allowing for continuous testing.</li><li><strong>Cost Optimization:</strong> Post-migration, we right-size your instances and implement auto-scaling to slash your monthly cloud bill.</li></ul>",
        price: 75000,
        category: "Infrastructure",
        features: ["Zero-downtime Migration", "Cost Optimization", "Security Hardening", "Cloud Governance"],
        icon: "fas fa-cloud-upload-alt",
        isFeatured: true,
        isActive: true,
        delivery: "4-8 weeks"
    },
    {
        title: "Custom Mobile Apps Development",
        description: "Engage your customers on the go. We build high-performance, native and cross-platform mobile applications for iOS and Android.",
        extendedDescription: "<h3>Mobile Experiences That Drive Engagement</h3><p>In today's mobile-first world, a poorly designed app is a lost customer. We specialize in building fast, intuitive, and beautiful mobile applications that users actually want to keep on their phones.</p><h4>Our Mobile Development Philosophy:</h4><ul class='list-disc pl-5 mt-2 space-y-1 text-text-muted'><li><strong>Native Performance:</strong> Whether using Swift/Kotlin or React Native/Flutter, we prioritize silky-smooth 60fps animations and rapid load times.</li><li><strong>User-Centric UI/UX:</strong> We design specifically for touch interfaces, ensuring intuitive navigation and gorgeous visuals.</li><li><strong>Robust Backend Integration:</strong> Seamlessly connect your app to custom APIs, real-time databases, and secure payment gateways.</li></ul>",
        price: 40000,
        category: "Development",
        features: ["iOS & Android Development", "Mobile-First UI/UX Design", "API & Cloud Integration", "App Store Optimization & Submission"],
        icon: "fas fa-mobile-alt",
        isFeatured: true,
        isActive: true,
        delivery: "4-12 weeks"
    }
];

const seedDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/binarycraft';
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

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
