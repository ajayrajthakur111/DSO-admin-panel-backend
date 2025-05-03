import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Customer } from '../models/customer.model';
import { User } from '../models/user.model';

dotenv.config();
const email = 'ajayrajthakur111@gmail.com'
async function seed() {
    await mongoose.connect(process.env.MONGO_URI as string);

    const customers = await Customer.insertMany([

            { name: 'Alice Brown', email: 'alice@example.com', phone: '9123456780', adminId: '6815dc4d4bd8adea744d1cbc' },
            { name: 'Bob Taylor', email: 'bob@example.com', phone: '9234567890', adminId: '6815dc4d4bd8adea744d1cbc' },
            { name: 'Charlie Davis', email: 'charlie@example.com', phone: '9345678901', adminId: '6815dc4d4bd8adea744d1cbc' },
            { name: 'Diana Wilson', email: 'diana@example.com', phone: '9456789012', adminId: '6815dc4d4bd8adea744d1cbc' },
            { name: 'Ethan Clark', email: 'ethan@example.com', phone: '9567890123', adminId: '6815dc4d4bd8adea744d1cbc' },
            { name: 'Fiona Scott', email: 'fiona@example.com', phone: '9678901234', adminId: '6815dc4d4bd8adea744d1cbc' },
            { name: 'George Hall', email: 'george@example.com', phone: '9789012345', adminId: '6815dc4d4bd8adea744d1cbc' },
            { name: 'Hannah Lewis', email: 'hannah@example.com', phone: '9890123456', adminId: '6815dc4d4bd8adea744d1cbc' },
            { name: 'Ian Allen', email: 'ian@example.com', phone: '9901234567', adminId: '6815dc4d4bd8adea744d1cbc' },
            { name: 'Jasmine Young', email: 'jasmine@example.com', phone: '9012345678', adminId: '6815dc4d4bd8adea744d1cbc' },
            { name: 'Kevin Martin', email: 'kevin@example.com', phone: '9123456789', adminId: '6815dc4d4bd8adea744d1cbc' },
            { name: 'Laura King', email: 'laura@example.com', phone: '9234567891', adminId: '6815dc4d4bd8adea744d1cbc' },
            { name: 'Mark Baker', email: 'mark@example.com', phone: '9345678902', adminId: '6815dc4d4bd8adea744d1cbc' },
            { name: 'Nina Turner', email: 'nina@example.com', phone: '9456789013', adminId: '6815dc4d4bd8adea744d1cbc' },
            { name: 'Oscar Perez', email: 'oscar@example.com', phone: '9567890124', adminId: '6815dc4d4bd8adea744d1cbc' },
            { name: 'Paula Adams', email: 'paula@example.com', phone: '9678901235', adminId: '6815dc4d4bd8adea744d1cbc' },
            { name: 'Quinn Reed', email: 'quinn@example.com', phone: '9789012346', adminId: '6815dc4d4bd8adea744d1cbc' },
            { name: 'Rachel Murphy', email: 'rachel@example.com', phone: '9890123457', adminId: '6815dc4d4bd8adea744d1cbc' },
            { name: 'Steve Cox', email: 'steve@example.com', phone: '9901234568', adminId: '6815dc4d4bd8adea744d1cbc' },
            { name: 'Tina Bell', email: 'tina@example.com', phone: '9012345679', adminId: '6815dc4d4bd8adea744d1cbc' }
        

    ]);
    await User.findByIdAndUpdate(
        '6815dc4d4bd8adea744d1cbc',
        { $push: { customers: { $each: customers.map(customer => customer._id) } } },
        { new: true }
    );

    console.log('Dummy customers added.');
    process.exit(0);
}

seed();
