import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/books`);
      setBooks(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const addBook = async (bookData) => {
    try {
      const response = await axios.post(`${API_URL}/api/books`, bookData);
      setBooks(prevBooks => [...prevBooks, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateBook = async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/api/books/${id}`, updatedData);
      setBooks(prevBooks => 
        prevBooks.map(book => 
          book.id === id ? response.data : book
        )
      );
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/books/${id}`);
      setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const moveBook = async (id) => {
    const book = books.find(b => b.id === id);
    if (book) {
      const newStatus = book.status === 'to-read' ? 'read' : 'to-read';
      await updateBook(id, { status: newStatus });
    }
  };

  const filterBooks = (searchTerm, status) => {
    return books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = book.status === status;
      return matchesSearch && matchesStatus;
    });
  };

  const getBookStats = () => {
    const toReadCount = books.filter(book => book.status === 'to-read').length;
    const readCount = books.filter(book => book.status === 'read').length;
    return { toReadCount, readCount, totalBooks: books.length };
  };

  return {
    books,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    moveBook,
    filterBooks,
    getBookStats,
    refreshBooks: fetchBooks
  };
};
