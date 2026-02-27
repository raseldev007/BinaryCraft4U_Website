const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, minlength: 6 }, // optional for OAuth users
    phone: { type: String, default: '' },
    address: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        zip: { type: String, default: '' },
        country: { type: String, default: '' }
    },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin', 'super_admin', 'manager', 'support'], default: 'user' },
    isBlocked: { type: Boolean, default: false },
    provider: { type: String, default: 'local' }, // 'local', 'google'
    googleId: { type: String, default: '' },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    wishlist: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId },
            itemType: { type: String, enum: ['product', 'service'] },
            title: { type: String },
            price: { type: Number },
            image: { type: String, default: '' },
        }
    ]
}, { timestamps: true });

// role index for admin queries
userSchema.index({ role: 1 });

userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return;
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
