import express from 'express';

import Book from '../models/Book.js';
import { authMiddleware, adminMiddleware, editorMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all books (public)
router.get('/', async (req, res) => {
  try {
    const { search, author, genre, minPrice, maxPrice, year, limit = 22 } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { genre: { $regex: search, $options: 'i' } }
      ];
    }
    if (author) query.author = { $regex: author, $options: 'i' };
    if (genre) query.genre = { $regex: `^${genre}$`, $options: 'i' };
    if (year) query.publishedYear = parseInt(year);
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    const books = await Book.find(query).limit(parseInt(limit));
    const total = await Book.countDocuments(query);
    res.json({ books, total, showing: books.length });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books', error: error.message });
  }
});

// Get single book (public)
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch book', error: error.message });
  }
});

// Get all genres (public)
router.get('/meta/genres', async (req, res) => {
  try {
    const genres = await Book.distinct('genre');
    console.log('Genres:', genres); // Debug log
    res.json(genres.sort());
  } catch (error) {
    console.error('Error fetching genres:', error); // Debug log
    res.status(500).json({ message: 'Failed to fetch genres', error: error.message });
  }
});

// Get all authors (public)
router.get('/meta/authors', async (req, res) => {
  try {
    const authors = await Book.distinct('author');
    console.log('Authors:', authors); // Debug log
    res.json(authors.sort());
  } catch (error) {
    console.error('Error fetching authors:', error); // Debug log
    res.status(500).json({ message: 'Failed to fetch authors', error: error.message });
  }
});

// Create new book (admin or editor)
router.post('/', authMiddleware, editorMiddleware, async (req, res) => {
  try {
    const { title, author, isbn, publishedYear, genre, price, description, pages, publisher, language, image } = req.body;
    if (!title || !author || !genre || !price) {
      return res.status(400).json({ message: 'Title, author, genre, and price are required' });
    }
    const newBook = new Book({
      title,
      author,
      isbn: isbn || '',
      publishedYear: publishedYear ? parseInt(publishedYear) : new Date().getFullYear(),
      genre,
      price: parseFloat(price),
      description: description || '',
      pages: pages ? parseInt(pages) : 0,
      publisher: publisher || '',
      language: language || 'English',
      rating: 0,
      stock: 0,
      image: image || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
    });
    await newBook.save();
    res.status(201).json({ message: 'Book created successfully', book: newBook });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create book', error: error.message });
  }
});

// Update book (admin or editor)
router.put('/:id', authMiddleware, editorMiddleware, async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book', error: error.message });
  }
});

// Delete book (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully', book: deletedBook });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book', error: error.message });
  }
});

export default router;