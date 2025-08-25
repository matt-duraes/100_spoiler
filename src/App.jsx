import React, { useState } from 'react';
import { useBooks } from './hooks/useBooks';
import { useModal } from './hooks/useModal';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import StatsCards from './components/StatsCards';
import TabNavigation from './components/TabNavigation';
import BooksGrid from './components/BooksGrid';
import BookModal from './components/BookModal';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('to-read');
  
  const { 
    books, 
    addBook, 
    updateBook, 
    deleteBook, 
    moveBook, 
    filterBooks, 
    getBookStats 
  } = useBooks();

  const { 
    isOpen: isModalOpen, 
    editingItem: editingBook, 
    openModal, 
    closeModal 
  } = useModal();

  const stats = getBookStats();
  const filteredBooks = filterBooks(searchTerm, activeTab);

  const handleAddBook = () => {
    openModal();
  };

  const handleEditBook = (book) => {
    openModal(book);
  };

  const handleSaveBook = (bookData, bookId) => {
    if (bookId) {
      updateBook(bookId, bookData);
    } else {
      addBook(bookData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header onAddBook={handleAddBook} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />
        
        <StatsCards 
          toReadCount={stats.toReadCount} 
          readCount={stats.readCount} 
        />
        
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          toReadCount={stats.toReadCount}
          readCount={stats.readCount}
        />
        
        <BooksGrid
          books={filteredBooks}
          totalBooks={stats.totalBooks}
          onEdit={handleEditBook}
          onDelete={deleteBook}
          onMoveBook={moveBook}
        />
      </div>

      <BookModal
        isOpen={isModalOpen}
        book={editingBook}
        onClose={closeModal}
        onSave={handleSaveBook}
      />
    </div>
  );
}

export default App;
