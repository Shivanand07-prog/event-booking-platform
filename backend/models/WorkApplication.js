const mongoose = require("mongoose");

const workApplicationSchema = new mongoose.Schema(
    {
        workPost: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WorkPost",
            required: true,
        },
        worker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

// A worker can apply only once to each job.
workApplicationSchema.index(
    { workPost: 1, worker: 1 },
    { unique: true }
);

module.exports = mongoose.model(
    "WorkApplication",
    workApplicationSchema
);
