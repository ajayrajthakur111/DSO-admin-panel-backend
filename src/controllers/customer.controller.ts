import { Request, Response } from 'express';
import { Customer } from '../models/customer.model';
import { User } from '../models/user.model';

export const getAllCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    const customers = await Customer.find({ adminId: userId }).sort({ createdAt: -1 });

    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch customers', error: err });
  }
};


export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      adminId: userId,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { customers: customer._id },
    });

    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create customer', error: err });
  }
};
// PUT /api/customers/:id
export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, phone, status } = req.body;

    const updated = await Customer.findByIdAndUpdate(
      id,
      { name, phone, status },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update customer', error: err });
  }
};

export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deleted = await Customer.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete customer', error: err });
  }
};