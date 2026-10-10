const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
} = require("../controllers/eventController");

router.get("/", getAllEvents);
router.get("/:id", getEventById);


router.post(
    "/",
    authMiddleware,
    authorizeRoles("organizer"),
    createEvent
);

router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("organizer"),
    updateEvent
);

router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("organizer"),
    deleteEvent

)

module.exports = router;