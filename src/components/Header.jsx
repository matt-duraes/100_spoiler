import React, { useState } from 'react';
import { Book, Plus, Menu, X } from 'lucide-react';

const Header = ({ onAddBook, user, onLogout, onOpenFriends }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-white shadow-lg border-b relative z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Book className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">100Spoiler</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-gray-900 font-medium">{user.name}</div>
                  <div className="text-xs text-purple-600 font-bold">#{user.friendCode}</div>
                </div>
                <button
                  onClick={onOpenFriends}
                  className="text-gray-600 hover:text-purple-600 font-medium px-3 py-2 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  Amigos
                </button>
                <button
                  onClick={onLogout}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Sair
                </button>
              </div>
            )}
            <button
              onClick={onAddBook}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Adicionar Livro</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-4 border-t mt-4 animate-in slide-in-from-top-2 duration-200">
            {user && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-purple-600 font-bold">#{user.friendCode}</div>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-sm text-red-600 font-medium px-3 py-1 border border-red-200 rounded-md hover:bg-red-50"
                  >
                    Sair
                  </button>
                </div>
                
                <button
                  onClick={() => {
                    onOpenFriends();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg font-medium transition-colors"
                >
                  Meus Amigos
                </button>
              </div>
            )}
            
            <button
              onClick={() => {
                onAddBook();
                setIsMenuOpen(false);
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-200 shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span>Adicionar Livro</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
