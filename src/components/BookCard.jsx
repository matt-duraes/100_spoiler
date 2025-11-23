import React from 'react';
import { Edit3, Trash2, Check, EyeOff } from 'lucide-react';

const BookCard = ({ book, onEdit, onDelete, onMoveBook, readOnly = false }) => {
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
        {!readOnly && (
          <div className="absolute top-3 right-3 flex space-x-1">
            <button
              onClick={() => onEdit(book)}
              className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
            >
              <Edit3 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => {
                if (window.confirm('Tem certeza que deseja excluir este livro?')) {
                  onDelete(book.id);
                }
              }}
              className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-gray-600 mb-2 text-sm">{book.author}</p>
        
        {book.tags && book.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {book.tags.map((tag, index) => (
              <span key={index} className="px-2 py-0.5 bg-purple-50 text-purple-600 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Adicionado em {book.addedAt}</span>
          {!readOnly ? (
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
          ) : (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              book.status === 'to-read'
                ? 'bg-green-100 text-green-800'
                : 'bg-orange-100 text-orange-800'
            }`}>
              {book.status === 'to-read' ? 'Para Ler' : 'Lido'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
