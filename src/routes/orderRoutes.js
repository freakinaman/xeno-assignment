const express = require("express");
const Order = require("../models/order");

const router = express.Router();

// Add a new order
router.post("/", async (req, res) => {
    try {
        const { customerId, orderAmount, orderDate } = req.body;

        const newOrder = await Order.create({
            customerId,
            orderAmount,
            orderDate,
        });

        res.status(201).json(newOrder);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to add order." });
    }
});

// Get all orders
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find().populate("customerId"); // Populate customer details
        res.status(200).json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch orders." });
    }
});

module.exports = router;
