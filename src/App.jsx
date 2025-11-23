import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useBooks } from './hooks/useBooks';
import { useModal } from './hooks/useModal';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import StatsCards from './components/StatsCards';
import TabNavigation from './components/TabNavigation';
import BooksGrid from './components/BooksGrid';
import BookModal from './components/BookModal';
import FriendsModal from './components/FriendsModal';
import FriendLibrary from './components/FriendLibrary';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('to-read');
  const [selectedTag, setSelectedTag] = useState('');
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
  const { user, logout } = useAuth();
  
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
  
  // Extract all unique tags
  const allTags = [...new Set(books.flatMap(book => book.tags || []))].sort();

  // Enhanced filtering
  const filteredBooks = filterBooks(searchTerm, activeTab).filter(book => {
    if (!selectedTag) return true;
    return book.tags && book.tags.includes(selectedTag);
  });

  const handleSaveBook = async (bookData, bookId) => {
    if (bookId) {
      await updateBook(bookId, bookData);
    } else {
      await addBook(bookData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header 
        onAddBook={() => openModal()} 
        user={user} 
        onLogout={logout}
        onOpenFriends={() => setIsFriendsModalOpen(true)}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm} 
            />
          </div>
          
          {allTags.length > 0 && (
            <div className="w-full md:w-64">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              >
                <option value="">Todas as Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        
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
          onEdit={(book) => openModal(book)}
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

      <FriendsModal
        isOpen={isFriendsModalOpen}
        onClose={() => setIsFriendsModalOpen(false)}
        onViewLibrary={(friend) => window.location.href = `/friend/${friend.id}`}
      />
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/friend/:friendId" 
            element={
              <ProtectedRoute>
                <FriendLibrary />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
