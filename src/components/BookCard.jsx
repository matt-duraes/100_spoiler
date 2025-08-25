import React from 'react';
import { Edit3, Trash2, Check, EyeOff } from 'lucide-react';

const BookCard = ({ book, onEdit, onDelete, onMoveBook }) => {
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/200x300/6366f1/white?text=Sem+Capa';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
        />
        <div className="absolute top-3 right-3 flex space-x-1">
          <button
            onClick={() => onEdit(book)}
            className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
          >
            <Edit3 className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(book.id)}
            className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-gray-600 mb-3 text-sm">{book.author}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Adicionado em {book.addedAt}</span>
          <button
            onClick={() => onMoveBook(book.id)}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
              book.status === 'to-read'
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
            }`}
          >
            {book.status === 'to-read' ? (
              <>
                <Check className="w-4 h-4" />
                <span>Marcar como lido</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Marcar para ler</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
