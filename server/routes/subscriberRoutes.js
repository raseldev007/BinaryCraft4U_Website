const express = require('express');
const router = express.Router();
const { subscribe, getSubscribers } = require('../controllers/subscriberController');
// const { protect, authorize } = require('../middleware/auth'); // Optionally add admin protection to getSubscribers

router.route('/')
    .post(subscribe)
    .get(getSubscribers); // Need to add protect and authorize('admin') when auth is ready

module.exports = router;
