import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

const seedUsers = async () => {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await User.deleteMany({});
  const users = [
    {
      username: 'admin',
      email: 'admin@bookstore.com',
      password: await bcrypt.hash('password123', 12),
      role: 'admin',
    },
    {
      username: 'editor',
      email: 'editor@bookstore.com',
      password: await bcrypt.hash('password123', 12),
      role: 'editor',
    },
    {
      username: 'user',
      email: 'user@bookstore.com',
      password: await bcrypt.hash('password123', 12),
      role: 'user',
    },
  ];
  const created = await User.insertMany(users);
  console.log('Seeded users:', created.map(u => ({ id: u._id, username: u.username, role: u.role })));
  mongoose.disconnect();
};

seedUsers();
