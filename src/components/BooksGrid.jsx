import React from 'react';
import { Book } from 'lucide-react';
import BookCard from './BookCard';

const BooksGrid = ({ books, totalBooks, onEdit, onDelete, onMoveBook }) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-16">
        <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          {totalBooks === 0 ? 'Nenhum livro cadastrado' : 'Nenhum livro encontrado'}
        </h3>
        <p className="text-gray-500">
          {totalBooks === 0 ? 'Comece adicionando seu primeiro livro!' : 'Tente uma busca diferente'}
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
        />
      ))}
    </div>
  );
};

export default BooksGrid;
