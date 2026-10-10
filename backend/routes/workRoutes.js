const express = require("express");
const router = express.Router();

const {
    getWorkPosts,
    createWorkPost,
    applyForWork,
} = require("../controllers/workController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/", getWorkPosts);

router.post(
    "/",
    authMiddleware,
    authorizeRoles("organizer"),
    createWorkPost
);

router.post(
    "/:id/apply",
    authMiddleware,
    authorizeRoles("worker"),
    applyForWork
);

module.exports = router;
