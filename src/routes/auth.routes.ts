import express from 'express';
import {
  login,
  register,
  getMe,
  requestOtp,
  verifyOtpAndRegister,
} from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/login', login);
router.post('/register', register); // optional fallback
router.get('/me', verifyToken, getMe);

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtpAndRegister);

export default router;
