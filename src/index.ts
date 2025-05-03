import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import customerRoutes from './routes/customer.routes';
import paymentRoutes from './routes/payment.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'https://dsosoftware.netlify.app',
  'https://checkout.razorpay.com',
  'https://api.razorpay.com/v1/',
  'https://api.razorpay.com'
   // Razorpay's official domain
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/', customerRoutes);
app.use('/api/payment', paymentRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('✅ MongoDB Atlas connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
  });
