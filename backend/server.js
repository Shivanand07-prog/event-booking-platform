const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const workRoutes = require("./routes/workRoutes");

const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/work", workRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected");
})
.catch((error) => {
    console.log("MongoDB connection failed", error);
});

app.get("/", (req, res) => {
    res.send("Welcome to GatherX");
});

app.listen(process.env.PORT, () => {
    console.log(`GatherX is running on port ${process.env.PORT}`);
})