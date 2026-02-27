const Subscriber = require('../models/Subscriber');

// @desc    Subscribe to newsletter
// @route   POST /api/subscribers
// @access  Public
const subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Please provide an email address' });
        }

        // Check if subscriber already exists
        const existingSubscriber = await Subscriber.findOne({ email });

        if (existingSubscriber) {
            if (existingSubscriber.status === 'unsubscribed') {
                existingSubscriber.status = 'active';
                await existingSubscriber.save();
                return res.status(200).json({ success: true, message: 'Successfully re-subscribed to the newsletter!' });
            }
            return res.status(400).json({ success: false, message: 'Email is already subscribed' });
        }

        // Create new subscriber
        const subscriber = await Subscriber.create({ email });

        res.status(201).json({
            success: true,
            data: subscriber,
            message: 'Successfully subscribed to the newsletter!'
        });
    } catch (error) {
        console.error('Subscription error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server Error. Please try again later.' });
    }
};

// @desc    Get all active subscribers
// @route   GET /api/subscribers
// @access  Private/Admin
const getSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find({ status: 'active' }).sort('-createdAt');
        res.status(200).json({ success: true, count: subscribers.length, data: subscribers });
    } catch (error) {
        console.error('Fetch subscribers error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    subscribe,
    getSubscribers
};
