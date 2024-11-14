const express = require("express");
const Campaign = require("../models/campaign");
const Customer = require("../models/customer");
const CommunicationLog = require("../models/communicationLog");

const router = express.Router();

// Helper function to build a valid MongoDB query from audience criteria
const buildQueryFromCriteria = (criteriaArray) => {
    const query = {};
    criteriaArray.forEach(({ field, operator, value }) => {
        if (field && operator && value !== undefined) {
            query[field] = { [operator]: isNaN(value) ? value : Number(value) }; // Convert value to number if applicable
        }
    });
    return query;
};

// Send messages for a campaign
router.post("/:id/send", async (req, res) => {
    try {
        const campaignId = req.params.id;

        // Fetch the campaign
        console.log(`Fetching campaign with ID: ${campaignId}`);
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            console.error("Campaign not found.");
            return res.status(404).json({ error: "Campaign not found." });
        }
        console.log("Campaign found:", campaign);

        // Transform audience criteria into a valid query object
        const query = buildQueryFromCriteria(campaign.audienceCriteria);

        // Fetch audience based on criteria
        console.log("Fetching audience with criteria:", query);
        const audience = await Customer.find(query);
        console.log("Audience fetched:", audience);

        if (!audience.length) {
            console.error("No customers match the audience criteria.");
            return res.status(404).json({ error: "No customers match the audience criteria." });
        }

        // Simulate sending messages
        const logs = [];
        for (const customer of audience) {
            const status = Math.random() < 0.9 ? "SENT" : "FAILED"; // 90% chance SENT
            console.log(`Sending message to customer: ${customer.name}, Status: ${status}`);

            const log = await CommunicationLog.create({
                campaignId: campaign._id,
                customerId: customer._id,
                message: campaign.message.replace("[Name]", customer.name || "Customer"),
                status,
                sentAt: new Date(),
            });

            logs.push(log);
        }

        console.log("All messages sent. Logs:", logs);
        res.status(201).json({ message: "Messages sent successfully.", logs });
    } catch (err) {
        console.error("Error occurred while sending messages:", err.message);
        res.status(500).json({ error: "Failed to send messages." });
    }
});

// Get all message logs
router.get("/", async (req, res) => {
    try {
        const { campaignId, status } = req.query;
        const filter = {};

        // Apply filters if provided
        if (campaignId) filter.campaignId = campaignId;
        if (status) filter.status = status;

        console.log("Fetching message logs with filter:", filter);
        const logs = await CommunicationLog.find(filter);
        console.log("Message logs fetched:", logs);

        res.status(200).json(logs);
    } catch (err) {
        console.error("Error occurred while fetching message logs:", err.message);
        res.status(500).json({ error: "Failed to fetch message logs." });
    }
});

// Get specific message log by ID
router.get("/:id", async (req, res) => {
    try {
        const logId = req.params.id;

        console.log(`Fetching message log with ID: ${logId}`);
        const log = await CommunicationLog.findById(logId);
        if (!log) {
            console.error("Message log not found.");
            return res.status(404).json({ error: "Message log not found." });
        }
        console.log("Message log fetched:", log);

        res.status(200).json(log);
    } catch (err) {
        console.error("Error occurred while fetching message log:", err.message);
        res.status(500).json({ error: "Failed to fetch message log." });
    }
});

module.exports = router;
