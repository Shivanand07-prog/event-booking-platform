const mongoose = require("mongoose");

const workPostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        eventName: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
        },

        location: {
            type: String,
            required: true,
        },

        date: {
            type: Date,
            required: true,
        },

        pay: {
            type: Number,
            required: true,
            min: 0,
        },

        payType: {
            type: String,
            enum: ["per hour", "per day", "fixed"],
            required: true,
        },

        workersNeeded: {
            type: Number,
            required: true,
            min: 1,
        },

        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        status: {
            type: String,
            enum: ["open", "closed"],
            default: "open",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("WorkPost", workPostSchema);