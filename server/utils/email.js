const nodemailer = require('nodemailer');
const logger = require('./logger');

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

/**
 * Send an email
 * @param {Object} options - { to, subject, html, text }
 */
const sendEmail = async ({ to, subject, html, text }) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            logger.warn('Email credentials not configured. Skipping email send.');
            return { success: false, reason: 'Email not configured' };
        }
        const transporter = createTransporter();
        const info = await transporter.sendMail({
            from: `"Binary Craft" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to,
            subject,
            text: text || '',
            html: html || '',
        });
        logger.info(`Email sent to ${to}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        logger.error(`Error sending email to ${to}: ${error.message}`);
        return { success: false, error: error.message };
    }
};

/**
 * Send order confirmation email
 */
const sendOrderConfirmationEmail = async (user, order) => {
    const itemsHTML = order.items.map(item =>
        `<tr>
            <td style="padding:8px;border-bottom:1px solid #eee">${item.title}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">৳${item.price.toLocaleString()}</td>
        </tr>`
    ).join('');

    const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px">
        <div style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:30px;border-radius:12px 12px 0 0;text-align:center">
            <h1 style="color:white;margin:0;font-size:24px">⚡ Binary Craft</h1>
            <p style="color:rgba(255,255,255,0.8);margin:8px 0 0">Order Confirmation</p>
        </div>
        <div style="background:white;padding:30px;border-radius:0 0 12px 12px;box-shadow:0 4px 20px rgba(0,0,0,0.1)">
            <h2 style="color:#1f2937">Hello, ${user.name}! 👋</h2>
            <p style="color:#6b7280">Your order has been successfully placed. Here's your order summary:</p>
            
            <div style="background:#f3f4f6;padding:15px;border-radius:8px;margin:20px 0">
                <p style="margin:0;color:#374151"><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
                <p style="margin:8px 0 0;color:#374151"><strong>Payment Method:</strong> ${order.paymentMethod?.toUpperCase() || 'COD'}</p>
            </div>
            
            <table style="width:100%;border-collapse:collapse;margin:20px 0">
                <thead>
                    <tr style="background:#f3f4f6">
                        <th style="padding:10px;text-align:left;color:#374151">Item</th>
                        <th style="padding:10px;text-align:center;color:#374151">Qty</th>
                        <th style="padding:10px;text-align:right;color:#374151">Price</th>
                    </tr>
                </thead>
                <tbody>${itemsHTML}</tbody>
                <tfoot>
                    <tr>
                        <td colspan="2" style="padding:12px;font-weight:bold;color:#1f2937">Total</td>
                        <td style="padding:12px;font-weight:bold;color:#3b82f6;text-align:right">৳${order.totalAmount.toLocaleString()}</td>
                    </tr>
                </tfoot>
            </table>
            
            <div style="text-align:center;margin-top:30px">
                <a href="${process.env.CLIENT_URL}/user/order-history" style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:white;padding:12px 30px;border-radius:8px;text-decoration:none;font-weight:bold">
                    View My Orders
                </a>
            </div>
            
            <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:30px">
                Built in Bangladesh 🇧🇩 | Binary Craft — Premium IT Solutions
            </p>
        </div>
    </div>`;

    return sendEmail({ to: user.email, subject: `Order Confirmed! #${order._id.toString().slice(-8).toUpperCase()} — Binary Craft`, html });
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (user, resetToken) => {
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px">
        <div style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:30px;border-radius:12px 12px 0 0;text-align:center">
            <h1 style="color:white;margin:0;font-size:24px">⚡ Binary Craft</h1>
            <p style="color:rgba(255,255,255,0.8);margin:8px 0 0">Password Reset Request</p>
        </div>
        <div style="background:white;padding:30px;border-radius:0 0 12px 12px;box-shadow:0 4px 20px rgba(0,0,0,0.1)">
            <h2 style="color:#1f2937">Hello, ${user.name}!</h2>
            <p style="color:#6b7280">We received a request to reset your password. Click the button below to set a new password. This link expires in <strong>10 minutes</strong>.</p>
            <div style="text-align:center;margin:30px 0">
                <a href="${resetURL}" style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:white;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px">
                    Reset Password
                </a>
            </div>
            <p style="color:#9ca3af;font-size:13px">If you didn't request a password reset, please ignore this email. Your password won't change.</p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
            <p style="color:#9ca3af;font-size:12px;text-align:center">
                Built in Bangladesh 🇧🇩 | Binary Craft — Premium IT Solutions
            </p>
        </div>
    </div>`;

    return sendEmail({ to: user.email, subject: 'Password Reset — Binary Craft', html });
};

module.exports = { sendEmail, sendOrderConfirmationEmail, sendPasswordResetEmail };
