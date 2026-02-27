const User = require('../models/User');

// @desc Get wishlist
// @route GET /api/users/wishlist
exports.getWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('wishlist');
        res.json({ success: true, wishlist: user.wishlist || [] });
    } catch (error) { next(error); }
};

// @desc Add item to wishlist
// @route POST /api/users/wishlist
exports.addToWishlist = async (req, res, next) => {
    try {
        const { itemId, itemType, title, price, image } = req.body;
        if (!itemId || !itemType || !title || price == null) {
            return res.status(400).json({ success: false, message: 'itemId, itemType, title, and price are required.' });
        }

        const user = await User.findById(req.user.id);
        const alreadyExists = user.wishlist.some(w => w.itemId?.toString() === itemId && w.itemType === itemType);

        if (alreadyExists) {
            return res.status(400).json({ success: false, message: 'Item already in wishlist.' });
        }

        user.wishlist.push({ itemId, itemType, title, price, image: image || '' });
        await user.save();

        res.json({ success: true, message: 'Added to wishlist', wishlist: user.wishlist });
    } catch (error) { next(error); }
};

// @desc Remove item from wishlist
// @route DELETE /api/users/wishlist/:itemId
exports.removeFromWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        user.wishlist = user.wishlist.filter(w => w._id.toString() !== req.params.itemId);
        await user.save();
        res.json({ success: true, message: 'Removed from wishlist', wishlist: user.wishlist });
    } catch (error) { next(error); }
};
