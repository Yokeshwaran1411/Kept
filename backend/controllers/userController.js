const userModel = require('../models/userModel');

const registerUser = async (req, res) => {
    try {
        const { name, mail, password } = req.body;
        
        if (!name || !mail || !password) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const newUser = await userModel.create({ name, mail, password });
        res.status(201).json({ message: 'User created successfully', user: newUser });
        
    } catch (error) {
        if (error.message === 'A user with this email already exists.') {
            return res.status(409).json({ error: error.message });
        }
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { mail, password } = req.body;
        
        if (!mail || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        const user = await userModel.findByMail(mail);
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const { password: userPassword, ...userData } = user;
        res.status(200).json({ message: 'Login successful', user: userData });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id, name, mail } = req.body;
        
        if (!id || !name || !mail) {
            return res.status(400).json({ error: 'Please provide user id, name, and email' });
        }

        const updatedUser = await userModel.update(id, { name, mail });
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
        
    } catch (error) {
        if (error.message === 'A user with this email already exists.') {
            return res.status(409).json({ error: error.message });
        }
        console.error('Update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    updateUser
};
