import express from 'express';
import { createCustomer, deleteCustomer, getAllCustomers, updateCustomer } from '../controllers/customer.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/customers', verifyToken, getAllCustomers);
router.post('/createCustomers', verifyToken, createCustomer);
router.put('/customers/:id', verifyToken, updateCustomer);
router.delete('/customers/:id', verifyToken, deleteCustomer);



export default router;
