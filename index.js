require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

// const connectDB = require('./config/db');          // your DB file
const candidateRoutes = require('./routes/candidates'); 
const { errorHandler, notFound } = require('./middleware/errorHandler');
const connectTODB = require('./config/mongoose.config');

const app = express();

// Connect to DB
connectTODB()

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, uploadDir)));

// API Routes
app.use('/api/candidates', candidateRoutes);

// Health check
app.get('/', (req, res) => {
    res.send({ ok: true, message: "Candidate Referral Backend running" });
});

// Not found + Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
