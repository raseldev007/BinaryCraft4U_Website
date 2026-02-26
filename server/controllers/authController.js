const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

// @desc Register user
// @route POST /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            if (exists.provider === 'google') {
                return res.status(400).json({ success: false, message: 'This email is registered via Google. Please sign in with Google.' });
            }
            return res.status(400).json({ success: false, message: 'Email already registered. Please sign in.' });
        }

        const user = await User.create({ name, email, password, provider: 'local' });
        const token = generateToken(user._id);
        res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) { next(error); }
};

// @desc Login user
// @route POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: 'No account found with this email.' });
        }

        if (user.provider === 'google') {
            return res.status(400).json({ success: false, message: 'This account uses Google Sign-In. Please click "Continue with Google".' });
        }

        if (!(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid password.' });
        }

        if (user.isBlocked) return res.status(403).json({ success: false, message: 'Your account has been blocked.' });

        const token = generateToken(user._id);
        res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
    } catch (error) { next(error); }
};

// @desc Google OAuth login/register
// @route POST /api/auth/google
exports.googleAuth = async (req, res, next) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ success: false, message: 'Google credential is required.' });
        }

        if (!process.env.GOOGLE_CLIENT_ID) {
            return res.status(500).json({ success: false, message: 'Google OAuth not configured on server.' });
        }

        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture, sub: googleId } = ticket.getPayload();

        // Find or create user
        let user = await User.findOne({ email });

        if (user) {
            // User exists — update google info if needed
            if (user.isBlocked) {
                return res.status(403).json({ success: false, message: 'Your account has been blocked.' });
            }
            if (!user.googleId) {
                user.googleId = googleId;
                user.provider = 'google';
                if (picture && !user.avatar) user.avatar = picture;
                await user.save();
            }
        } else {
            // New user — create account
            user = await User.create({
                name,
                email,
                googleId,
                avatar: picture || '',
                provider: 'google',
            });
        }

        const token = generateToken(user._id);
        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
        });
    } catch (error) {
        if (error.message?.includes('Token used too late') || error.message?.includes('Invalid token')) {
            return res.status(401).json({ success: false, message: 'Google token expired. Please try again.' });
        }
        next(error);
    }
};

// @desc Get current user
// @route GET /api/auth/me
exports.getMe = async (req, res) => {
    res.json({ success: true, user: req.user });
};
