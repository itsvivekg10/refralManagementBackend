const mongoose = require("mongoose");

const mongoUrl = process.env.MONGODB_URL;

const connectTODB = async () => {
    try {
        await mongoose.connect(mongoUrl);
        console.log("✅ Connected to MongoDB Atlas:", mongoose.connection.host);
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
    }
};

module.exports = connectTODB;
