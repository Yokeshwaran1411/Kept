const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

router.post('/subscriptions', subscriptionController.createSubscription);
router.get('/subscriptions/:ctid', subscriptionController.getSubscriptions);
router.put('/subscriptions/:id', subscriptionController.updateSubscription);
router.delete('/subscriptions/:id', subscriptionController.deleteSubscription);

module.exports = router;
