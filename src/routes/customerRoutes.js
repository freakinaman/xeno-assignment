const express = require("express");
const Customer = require("../models/customer");

const router = express.Router();

// Add a new customer
router.post("/", async (req, res) => {
    try {
        const { name, email, phone, totalSpending, visits, lastVisitedAt } = req.body;

        const newCustomer = await Customer.create({
            name,
            email,
            phone,
            totalSpending,
            visits,
            lastVisitedAt,
        });

        res.status(201).json(newCustomer);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to add customer." });
    }
});

// Get all customers
router.get("/", async (req, res) => {
    try {
        const customers = await Customer.find(); // Fetch all customers
        res.status(200).json(customers);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch customers." });
    }
});

module.exports = router;
