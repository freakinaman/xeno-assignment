const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
    name: { type: String, required: true },
    audienceCriteria: { type: Object, required: true }, // Store filters as JSON
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Campaign", campaignSchema);
