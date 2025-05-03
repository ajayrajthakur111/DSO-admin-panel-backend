import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },  
  },
  { timestamps: true }
);

export const Customer = mongoose.model('Customer', customerSchema);
