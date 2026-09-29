const subscriptionModel = require('../models/subscriptionModel');

const createSubscription = async (req, res) => {
    try {
        const { ctid, type, name, amount, renewal_date, method, method_details } = req.body;
        if (!name || !ctid) return res.status(400).json({ error: 'Please provide name and ctid' });
        const newSub = await subscriptionModel.create({ ctid, type, name, amount, renewal_date, method, method_details });
        res.status(201).json({ message: 'Subscription created successfully', subscription: newSub });
    } catch (error) {
        console.error('Error creating subscription:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getSubscriptions = async (req, res) => {
    try {
        const { ctid } = req.params;
        if (!ctid) return res.status(400).json({ error: 'ctid is required' });
        const subscriptions = await subscriptionModel.findByCtid(ctid);
        res.status(200).json({ subscriptions });
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, name, amount, renewal_date, method, method_details } = req.body;
        const updatedSub = await subscriptionModel.update(id, { type, name, amount, renewal_date, method, method_details });
        res.status(200).json({ message: 'Subscription updated successfully', subscription: updatedSub });
    } catch (error) {
        console.error('Error updating subscription:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        await subscriptionModel.delete(id);
        res.status(200).json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        console.error('Error deleting subscription:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createSubscription, getSubscriptions, updateSubscription, deleteSubscription };
