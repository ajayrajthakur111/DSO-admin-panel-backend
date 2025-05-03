import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail'; // Assuming path
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res
            .cookie('token', token, {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .status(201)
            .json({ id: user._id, name: user.name, email: user.email });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed', error: err });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        if (!user.password) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res
            .cookie('token', token, {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .status(200)
            .json({ id: user._id, name: user.name, email: user.email });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err });
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).userId;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch user', error: err });
    }
};

export const requestOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        console.log(email)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000);
        let user = await User.findOne({ email });
        console.log(user, "user")
        if (!user) {
            user = new User({ email });
        }
        console.log(expires, 'expires')
        user.otp = otp;
        user.otpExpiresAt = expires;
        await user.save();
        console.log("first")
        await sendEmail({
            to: email,
            subject: 'Verification Code',
            html: `<p>Your OTP code is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`
        });

        res.status(200).json({ message: 'OTP sent to your email.' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to send OTP.', error: err });
    }
};

export const verifyOtpAndRegister = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, otp } = req.body;
        const user = await User.findOne({ email });
        const date = new Date()
        console.log("1", req.body, date)
        if (!user || user.otp !== otp || !user.otpExpiresAt || user.otpExpiresAt.getTime() < date.getTime()) {
            res.status(400).json({ message: 'Invalid or expired OTP.' });
            return;
        }
        user.name = name;
        user.password = await bcrypt.hash(password, 10);
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();
        console.log("3", JWT_SECRET)
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res
            .cookie('token', token, {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .status(201)
            .json({ id: user._id, name: user.name, email: user.email });
    } catch (err) {
        res.status(500).json({ message: 'OTP verification failed.', error: err });
    }
};
