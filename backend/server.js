require("dotenv").config();
const express = require("express");
// const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');


const app = express();

app.use(express.json());
// app.use(cors({
// 	origin: "http://localhost:3000", // React app URL
// 	credentials: true,}));
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT,() =>{console.log(`Server running on port ${PORT}`)});