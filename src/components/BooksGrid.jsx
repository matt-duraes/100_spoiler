import React from 'react';
import { BookOpen } from 'lucide-react';
import BookCard from './BookCard';

const BooksGrid = ({ books, totalBooks, onEdit, onDelete, onMoveBook, readOnly = false }) => {
  if (totalBooks === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum livro encontrado</h3>
        <p className="text-gray-500">Comece adicionando alguns livros à sua coleção.</p>
      </div>
    );
  }

  // If totalBooks > 0 but books.length === 0 (e.g., due to search filter)
  if (books.length === 0) {
    return (
      <div className="text-center py-16">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Nenhum livro encontrado
        </h3>
        <p className="text-gray-500">
          Tente uma busca diferente
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onEdit={onEdit}
          onDelete={onDelete}
          onMoveBook={onMoveBook}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
};

export default BooksGrid;
