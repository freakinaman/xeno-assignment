const express = require("express");
const Campaign = require("../models/campaign");
const Customer = require("../models/customer");
const CommunicationLog = require("../models/communicationLog");

const router = express.Router();

// Create a new campaign
router.post("/", async (req, res) => {
    try {
        const { name, audienceCriteria, message } = req.body;

        // Validate required fields
        if (!name || !audienceCriteria || !message) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Create the campaign
        const newCampaign = await Campaign.create({
            name,
            audienceCriteria,
            message,
        });

        res.status(201).json(newCampaign);
    } catch (err) {
        console.error("Error creating campaign:", err.message);
        res.status(500).json({ error: "Failed to create campaign." });
    }
});

// Get all campaigns
router.get("/", async (req, res) => {
    try {
        const campaigns = await Campaign.find().sort({ createdAt: -1 }); // Sort by most recent
        res.status(200).json(campaigns);
    } catch (err) {
        console.error("Error fetching campaigns:", err.message);
        res.status(500).json({ error: "Failed to fetch campaigns." });
    }
});

// Get campaign details by ID
router.get("/:id", async (req, res) => {
    try {
        const campaignId = req.params.id;

        // Fetch campaign by ID
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({ error: "Campaign not found." });
        }

        res.status(200).json(campaign);
    } catch (err) {
        console.error("Error fetching campaign details:", err.message);
        res.status(500).json({ error: "Failed to fetch campaign details." });
    }
});

// DELETE a campaign by ID
router.delete("/:id", async (req, res) => {
    try {
        const campaignId = req.params.id;
        const campaign = await Campaign.findByIdAndDelete(campaignId);
        if (!campaign) {
            return res.status(404).json({ error: "Campaign not found." });
        }
        res.status(200).json({ message: "Campaign deleted successfully." });
    } catch (err) {
        console.error("Error deleting campaign:", err.message);
        res.status(500).json({ error: "Failed to delete campaign." });
    }
});

// Get campaign stats
router.get("/:id/stats", async (req, res) => {
    try {
        const campaignId = req.params.id;

        // Check if campaign exists
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({ error: "Campaign not found." });
        }

        // Aggregate communication logs
        const stats = await CommunicationLog.aggregate([
            { $match: { campaignId: campaign._id } },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        // Format response
        const result = stats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
        }, {});

        res.status(200).json({
            campaign: campaign.name,
            stats: {
                SENT: result["SENT"] || 0,
                FAILED: result["FAILED"] || 0,
            },
        });
    } catch (err) {
        console.error("Error fetching campaign stats:", err.message);
        res.status(500).json({ error: "Failed to fetch campaign stats." });
    }
});

module.exports = router;
