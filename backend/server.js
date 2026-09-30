const express = require('express');
const cors = require('cors');
const userService = require('./Services/userService.js');
const serviceMgmt = require('./Services/serviceMgmt.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, mail, password, deviceInfo } = req.body;
        
        if (!name || !mail || !password) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const newUser = await userService.createUser({ name, mail, password });
        
        const loginInfoPayload = {
            userMail: mail,
            userId: newUser.id,
            userName: name,
            ...(deviceInfo || {})
        };
        try {
            await userService.recordLoginHistory(loginInfoPayload);
        } catch (historyErr) {
            console.error('Failed to record initial login history on register:', historyErr);
        }

        res.status(201).json({ message: 'User created successfully', user: newUser });
        
    } catch (error) {
        if (error.message === 'A user with this email already exists.') {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { mail, password, deviceInfo } = req.body;
        
        if (!mail || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        const user = await userService.getUserByMail(mail);
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const { password: userPassword, ...userData } = user;

        const loginInfoPayload = {
            userMail: mail,
            userId: user.id,
            userName: user.name,
            ...(deviceInfo || {})
        };
        try {
            await userService.recordLoginHistory(loginInfoPayload);
        } catch (historyErr) {
            console.error('Failed to record login history:', historyErr);
        }

        res.status(200).json({ message: 'Login successful', user: userData });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/users/login-history', async (req, res) => {
    try {
        const { mail } = req.query;
        const history = await userService.getLoginHistory(mail);
        res.status(200).json({ history });
    } catch (error) {
        console.error('Fetch login history error:', error);
        res.status(500).json({ error: 'Failed to fetch login history' });
    }
});

app.post('/api/users/login-history', async (req, res) => {
    try {
        const { mail, deviceInfo } = req.body;
        const loginInfoPayload = {
            userMail: mail || 'anonymous',
            ...(deviceInfo || req.body)
        };
        const result = await userService.recordLoginHistory(loginInfoPayload);
        res.status(201).json({ message: 'Login history recorded successfully', id: result.id });
    } catch (error) {
        console.error('Record login history error:', error);
        res.status(500).json({ error: 'Failed to record login history' });
    }
});

app.put('/api/users/update', async (req, res) => {
    try {
        const { id, name, mail } = req.body;
        
        if (!id || !name || !mail) {
            return res.status(400).json({ error: 'Please provide user id, name, and email' });
        }

        const updatedUser = await userService.updateUser(id, { name, mail });
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
        
    } catch (error) {
        if (error.message === 'A user with this email already exists.') {
            return res.status(409).json({ error: error.message });
        }
        console.error('Update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/health/db', async (req, res) => {
    try {
        const dbStatus = await serviceMgmt.checkDatabaseConnection();
        if (dbStatus) {
            res.status(200).json({ message: 'Database connection is healthy' });
        } else {
            res.status(500).json({ error: 'Database connection failed' });
        }
    } catch (error) {
        console.error('Database health check error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
