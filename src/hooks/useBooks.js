import { useState } from 'react';

export const useBooks = () => {
  const [books, setBooks] = useState([]);

  const addBook = (bookData) => {
    const newBook = {
      id: Date.now(),
      title: bookData.title,
      author: bookData.author || 'Autor não informado',
      cover: bookData.cover || 'https://via.placeholder.com/200x300/6366f1/white?text=Sem+Capa',
      status: bookData.status,
      addedAt: new Date().toLocaleDateString('pt-BR')
    };
    setBooks(prevBooks => [...prevBooks, newBook]);
  };

  const updateBook = (id, updatedData) => {
    setBooks(prevBooks => 
      prevBooks.map(book => 
        book.id === id 
          ? { ...book, ...updatedData }
          : book
      )
    );
  };

  const deleteBook = (id) => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
  };

  const moveBook = (id) => {
    setBooks(prevBooks => 
      prevBooks.map(book => 
        book.id === id 
          ? { 
              ...book, 
              status: book.status === 'to-read' ? 'read' : 'to-read' 
            }
          : book
      )
    );
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
    addBook,
    updateBook,
    deleteBook,
    moveBook,
    filterBooks,
    getBookStats
  };
};
