const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require("../middleware/roleMiddleware");
const {createBooking, getMyBookings, cancelBooking, getEventBookings} = require('../controllers/bookingController');

router.post(
    "/",
    authMiddleware,
    createBooking
);
router.get(
    "/my-bookings",
    authMiddleware,
    getMyBookings
);
router.put(
    "/:id/cancel",
    authMiddleware,
    cancelBooking
);
router.get(
    "/event/:eventId",
    authMiddleware,
    authorizeRoles("organizer"),
    getEventBookings
);
module.exports = router;