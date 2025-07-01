import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/Book.js';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const books = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic',
    price: 10.99,
    description: 'A novel set in the Roaring Twenties.',
    pages: 180,
    publisher: 'Scribner',
    language: 'English',
    rating: 4.2,
    stock: 12,
    image: '',
    publishedYear: 1925,
    isbn: '9780743273565'
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Classic',
    price: 8.99,
    description: 'A novel about racial injustice in the Deep South.',
    pages: 281,
    publisher: 'J.B. Lippincott & Co.',
    language: 'English',
    rating: 4.8,
    stock: 8,
    image: '',
    publishedYear: 1960,
    isbn: '9780061120084'
  },
  {
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    price: 9.99,
    description: 'A novel about a dystopian future.',
    pages: 328,
    publisher: 'Secker & Warburg',
    language: 'English',
    rating: 4.6,
    stock: 15,
    image: '',
    publishedYear: 1949,
    isbn: '9780451524935'
  }
];

async function seedBooks() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await Book.deleteMany({});
    await Book.insertMany(books);
    console.log('✅ Books seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding books:', err);
    process.exit(1);
  }
}

seedBooks();
