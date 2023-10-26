const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 4000;

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    credentials: true, 
    optionsSuccessStatus: 204 
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to PostgreSQL
const pool = new Pool({
    user: 'prathap',
    host: 'localhost',
    database: 'image_human_ai',
    password: 'Prathap@8493',
    port: 5432,
});

// Endpoint to get all statistics
app.get('/api/statistics', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM image_predicted_data');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch statistics.' });
    }
});

// Endpoint to update statistics for an image
app.post('/api/statistics', async (req, res) => {
    const { img_id,image_src, shown, correct, incorrect } = req.body;
    try {
        await pool.query(
            'INSERT INTO image_predicted_data (img_id,image_src, shown, correct, incorrect) VALUES ($1, $2, $3, $4,$5) ON CONFLICT (img_id) DO UPDATE SET image_src=$2,shown = $3, correct = $4, incorrect = $5',
            [img_id,image_src, shown, correct, incorrect]
        );
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update statistics.' });
    }
});

app.get('/api/predicted', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM user_statistics');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch statistics.' });
    }
});

app.post('/api/predicted', async (req, res) => {
    const { user_ip,correct_count, incorrect_count} = req.body;
    try {
        await pool.query(
            'INSERT INTO user_statistics (user_ip, correct_count, incorrect_count) VALUES ($1, $2, $3) ON CONFLICT (user_ip) DO UPDATE SET correct_count=$2,incorrect_count = $3',
            [user_ip,correct_count,incorrect_count]
        );
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update statistics.' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
