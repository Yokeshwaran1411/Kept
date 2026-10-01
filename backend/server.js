const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', subscriptionRoutes);


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
