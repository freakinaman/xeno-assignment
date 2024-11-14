const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    totalSpending: { type: Number, default: 0 },
    visits: { type: Number, default: 0 },
    lastVisitedAt: { type: Date },
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

module.exports = mongoose.model("Customer", customerSchema);
