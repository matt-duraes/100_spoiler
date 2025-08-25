import React from 'react';
import { Book, Plus } from 'lucide-react';

const Header = ({ onAddBook }) => {
  return (
    <div className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Book className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">100Spoiler</h1>
          </div>
          <button
            onClick={onAddBook}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Adicionar Livro</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
