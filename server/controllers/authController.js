const crypto = require('crypto');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { sendPasswordResetEmail } = require('../utils/email');
const logger = require('../utils/logger');

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
        logger.info(`New user registered: ${email}`);
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
        logger.info(`User logged in: ${email}`);
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

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture, sub: googleId } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (user) {
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
            user = await User.create({
                name,
                email,
                googleId,
                avatar: picture || '',
                provider: 'google',
            });
            logger.info(`New Google user registered: ${email}`);
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

// @desc Forgot password — sends reset email
// @route POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Please provide your email address.' });

        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal if email exists or not for security
            return res.json({ success: true, message: 'If an account exists with that email, a password reset link has been sent.' });
        }

        if (user.provider === 'google') {
            return res.status(400).json({ success: false, message: 'This account uses Google Sign-In. Password reset is not available.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save({ validateBeforeSave: false });

        // Send email (fire-and-forget, don't block the response)
        sendPasswordResetEmail(user, resetToken).catch(err =>
            logger.error(`Failed to send password reset email to ${user.email}: ${err.message}`)
        );

        logger.info(`Password reset requested for: ${email}`);
        res.json({ success: true, message: 'If an account exists with that email, a password reset link has been sent.' });
    } catch (error) { next(error); }
};

// @desc Reset password
// @route POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res, next) => {
    try {
        const { password } = req.body;
        if (!password || password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
        }

        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Password reset token is invalid or has expired.' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        logger.info(`Password reset successful for: ${user.email}`);
        const token = generateToken(user._id);
        res.json({ success: true, token, message: 'Password reset successful. You are now logged in.' });
    } catch (error) { next(error); }
};
