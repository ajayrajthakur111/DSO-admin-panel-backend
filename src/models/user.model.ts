import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: { type: String, required: true, unique: true },
        password: String,
        otp: String,
        otpExpiresAt: Date,
        customers: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Customer',
            },
          ],
    },
    { timestamps: true }
);


export const User = mongoose.model('User', userSchema);
