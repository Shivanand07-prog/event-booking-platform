const User = require("../models/User");
const bcrypt = require('bcrypt');
const event = require('../models/Event');
const jwt = require('jsonwebtoken');


const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const allowedRoles = ["attendee", "organizer", "worker"];

        const userRole = allowedRoles.includes(role)
            ? role
            : "attendee";

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: userRole,
        });

        return res.status(201).json({
            message: "Registration successful",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            message: "Server error during registration",
        });
    }
};

const loginUser = async (req, res) => {
    const {email, password} = req.body;
    const existingUser = await User.findOne({email});

    if(!existingUser) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }
    
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if(!isPasswordCorrect){
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }
    const token = jwt.sign(
        { userId: existingUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
    res.cookie("token", token, {
        httpOnly: true,
        secure: false
    });
    return res.status(200).json({
        message: "Login Successful"
    })


}
const createEvent = async (req, res) => {
    
}
module.exports = {registerUser, loginUser};