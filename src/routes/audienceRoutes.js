const express = require("express");
const Customer = require("../models/customer");

const router = express.Router();

// GET audience based on filters
router.get("/", async (req, res) => {
    try {
        const { totalSpending, visits, lastVisitedAt } = req.query;

        // Build query dynamically
        const query = {};
        if (totalSpending) query.totalSpending = { $gte: Number(totalSpending) };
        if (visits) query.visits = { $lte: Number(visits) };
        if (lastVisitedAt) query.lastVisitedAt = { $gte: new Date(lastVisitedAt) };

        // Fetch matching customers
        const customers = await Customer.find(query);

        res.status(200).json(customers);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch audience." });
    }
});

// POST /size to calculate audience size
router.post("/size", async (req, res) => {
    try {
        const { criteria } = req.body;

        if (!criteria) {
            return res.status(400).json({ message: "Criteria not provided" });
        }

        // Calculate audience size
        const audienceSize = await Customer.find(criteria).countDocuments();
        res.status(200).json({ size: audienceSize });
    } catch (err) {
        console.error("Error calculating audience size:", err.message);
        res.status(500).json({ error: "Failed to calculate audience size." });
    }
});

module.exports = router;
