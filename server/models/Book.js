import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: String,
  publishedYear: Number,
  genre: String,
  price: Number,
  description: String,
  pages: Number,
  publisher: String,
  language: String,
  rating: Number,
  stock: Number,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Book', bookSchema);
