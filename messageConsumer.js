const redis = require("redis");
const mongoose = require("mongoose");
const CommunicationLog = require("./models/communicationLog"); // Correct path to the model
const { connectDB } = require("./config/db"); // Ensure this path is correct

require("dotenv").config();

// Connect to MongoDB
connectDB();

// Create Redis subscriber
const subscriber = redis.createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379", // Use .env REDIS_URL or default local Redis
});
subscriber.connect();

subscriber.on("connect", () => {
    console.log("Connected to Redis...");
});

// Subscribe to the "messageQueue"
subscriber.subscribe("messageQueue", async (message) => {
    try {
        console.log("Message received from queue:", message);

        const { campaignId, customerId, messageText, status } = JSON.parse(message);

        // Log the message to the database
        const log = await CommunicationLog.create({
            campaignId,
            customerId,
            message: messageText,
            status,
            sentAt: new Date(),
        });

        console.log("Message logged successfully:", log);
    } catch (err) {
        console.error("Failed to process message from queue:", err.message);
    }
});
