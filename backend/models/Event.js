const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    venue: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    image: {
        type: String
    },

    price: {
        type: Number,
        required: true
    },

    totalSeats: {
        type: Number,
        required: true
    },

    availableSeats: {
        type: Number,
        required: true
    },

    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {
    timestamps: true
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;