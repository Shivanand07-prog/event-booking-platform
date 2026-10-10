const express = require("express");

const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", authMiddleware, (req, res) => {
    res.json({
        message: "Profile fetched successfully",
        user: req.user
    });
});
router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
    });

    res.json({ message: "Logged out successfully" });
});

module.exports = router;