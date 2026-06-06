const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const isUserAlreadyExist = await userModel.findOne({
            $or: [{ username }, { email }],
        });
        if (isUserAlreadyExist) {
            return res.status(400).json({ message: "User already exist" });
        }
        const hash = await bcrypt.hash(password, 10);
        const user = await userModel.create({ username, email, password: hash });
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 86400000
        });

        return res.status(201).json({
            message: "User created successfully", user: {
                id: user._id,
                username: user.username,
                email: user.email,

            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
}


async function loginUserController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 86400000
        });
        return res.status(200).json({
            message: "User logged in successfully", user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        })

    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
}

async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token;

        if (token) await tokenBlacklistModel.create({ token })
        res.clearCookie("token");

        res.status(200).json({
            message: "user logged out successfully"
        })
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
}


async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id);
        return res.status(200).json({
            message: "User found successfully", user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        })
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
}


module.exports = { registerUserController, loginUserController, logoutUserController, getMeController };
