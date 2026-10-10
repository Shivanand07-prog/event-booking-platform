const mongoose = require("mongoose");
const WorkPost = require("../models/WorkPost");
const WorkApplication = require("../models/WorkApplication");

// GET /api/work - Fetch all job posts
const getWorkPosts = async (req, res) => {
    try {
        const jobs = await WorkPost.find()
            .sort({ createdAt: -1 })
            .populate("organizer", "name");

        return res.status(200).json(jobs);
    } catch (error) {
        console.error("Get work posts error:", error);

        return res.status(500).json({
            message: "Failed to fetch work posts",
        });
    }
};

// POST /api/work - Create a job post
const createWorkPost = async (req, res) => {
    try {
        const {
            title,
            eventName,
            description,
            category,
            location,
            date,
            pay,
            payType,
            workersNeeded,
        } = req.body;

        if (
            !title?.trim() ||
            !eventName?.trim() ||
            !description?.trim() ||
            !category?.trim() ||
            !location?.trim() ||
            !date ||
            pay === undefined ||
            pay === "" ||
            !payType ||
            workersNeeded === undefined ||
            workersNeeded === ""
        ) {
            return res.status(400).json({
                message: "Please provide all required job details",
            });
        }

        const numericPay = Number(pay);
        const numericWorkers = Number(workersNeeded);
        const workDate = new Date(date);

        if (
            !Number.isFinite(numericPay) ||
            numericPay < 0 ||
            !Number.isInteger(numericWorkers) ||
            numericWorkers < 1 ||
            Number.isNaN(workDate.getTime())
        ) {
            return res.status(400).json({
                message: "Please enter valid date, payment, and worker count",
            });
        }

        const job = await WorkPost.create({
            title: title.trim(),
            eventName: eventName.trim(),
            description: description.trim(),
            category: category.trim(),
            location: location.trim(),
            date: workDate,
            pay: numericPay,
            payType,
            workersNeeded: numericWorkers,
            organizer: req.user._id,
        });

        return res.status(201).json({
            message: "Job posted successfully",
            job,
        });
    } catch (error) {
        console.error("Create work post error:", error);

        return res.status(500).json({
            message: "Failed to create job post",
        });
    }
};

// POST /api/work/:id/apply - Apply for a job
const applyForWork = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid job ID",
            });
        }

        const job = await WorkPost.findById(id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        if (job.status !== "open") {
            return res.status(400).json({
                message: "Applications for this job are closed",
            });
        }

        if (job.organizer.toString() === req.user._id.toString()) {
            return res.status(403).json({
                message: "You cannot apply to your own job",
            });
        }

        const existingApplication = await WorkApplication.findOne({
            workPost: id,
            worker: req.user._id,
        });

        if (existingApplication) {
            return res.status(409).json({
                message: "You have already applied for this job",
            });
        }

        const application = await WorkApplication.create({
            workPost: id,
            worker: req.user._id,
        });

        return res.status(201).json({
            message: "Application submitted successfully!",
            application,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "You have already applied for this job",
            });
        }

        console.error("Apply for work error:", error);

        return res.status(500).json({
            message: "Failed to submit application",
        });
    }
};

module.exports = {
    getWorkPosts,
    createWorkPost,
    applyForWork,
};
