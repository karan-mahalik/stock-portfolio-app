import User from '../models/User.model.js'
import Holding from '../models/Holding.model.js'
import Watchlist from '../models/Watchlist.model.js'
import Alert from '../models/Alert.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exist" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashPassword
        });

        const token = jwt.sign({ id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "Signup success",
            user: { id: user._id, name: user.name, email: user.email },
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email & Password required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Wrong password" });
        }

        const token = jwt.sign({ id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "Login success",
            user: { id: user._id, name: user.name, email: user.email },
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, email } = req.body;

        if (!name && !email) {
            return res.status(400).json({ message: "Nothing to update" });
        }

        if (email) {
            const existing = await User.findOne({ email });
            if (existing && existing._id.toString() !== userId) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Profile updated",
            user: updatedUser
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};


export const deleteAccount = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await Holding.deleteMany({ userId });
        await Watchlist.deleteMany({ userId });
        await Alert.deleteMany({ userId });

        return res.status(200).json({ message: "Account deleted successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};
