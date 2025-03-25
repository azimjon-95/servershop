require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/admin.routes');
const factoryRoutes = require('./routes/factory.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    credentials: true,// cookie-ni serverga yuborishni tasdiqlash
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], // bu hammasi frontendga yuborilgan methodlarni qo'shadi
    allowedHeaders: ['Content-Type', 'authorization'] // bu hammasi serverga yuborilgan headersni qo'shadi
}));

// Database Connection
connectDB();

// get
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Routes
app.use('/admin', adminRoutes);
app.use('/factories', factoryRoutes);

// Server Start
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});