const express = require("express");
const cors = require("cors"); // Import CORS middleware
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const { connectDB } = require("./config/db");
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const audienceRoutes = require("./routes/audienceRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const messageRoutes = require("./routes/messageRoutes");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config(); // Load environment variables
require("./config/passport"); // Import Passport configuration

// Connect to MongoDB
connectDB();

// Initialize Express App
const app = express();

// CORS Configuration

const corsOptions = {
    origin: ["https://xeno-frontend-ochre.vercel.app"], // Allow your deployed frontend
    credentials: true, // Allow cookies and credentials
};
app.use(cors(corsOptions)); // Apply the updated CORS configuration


// Middleware
app.use(bodyParser.json());
app.use(express.json());

//Session Middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET || "002be8753a0047d37edb019e55adeb8fc39e12a68f9c64b382bd78795b3a197d", // Use your own secret or store it in .env
        resave: false,
        saveUninitialized: true,
    })
);

// app.use(
//     session({
//         secret: process.env.SESSION_SECRET || "002be8753a0047d37edb019e55adeb8fc39e12a68f9c64b382bd78795b3a197d",
//         resave: false,
//         saveUninitialized: true,
//         cookie: {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production", // Use secure cookies in production
//             sameSite: "none", // Required for cross-origin cookies
//         },
//     })
// );


// // CORS Configuration
// const corsOptions = {
//     origin: ["https://xeno-frontend-ochre.vercel.app"], // Frontend URL
//     credentials: true, // Allow credentials (cookies)
// };
// app.use(cors(corsOptions));

// Initialize Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes); // Google Authentication Routes
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers/audience", audienceRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/messages", messageRoutes);

// Health Check Route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Protected Dashboard Route
app.get("/api/dashboard", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.json({
        displayName: req.user.displayName,
        email: req.user.emails ? req.user.emails[0].value : "No email found",
    });
});

// Logging Routes for Debugging (Optional)
app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(`Route: ${middleware.route.path}`);
    }
});

// Fallback Route for Undefined Endpoints
app.use((req, res) => {
    res.status(404).json({ message: "Endpoint not found" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
});

// Export the app
module.exports = app;
