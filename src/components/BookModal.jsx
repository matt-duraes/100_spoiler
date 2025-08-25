import React, { useState, useEffect } from 'react';

const BookModal = ({ isOpen, book, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    cover: '',
    status: 'to-read'
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        cover: book.cover,
        status: book.status
      });
    } else {
      setFormData({
        title: '',
        author: '',
        cover: '',
        status: 'to-read'
      });
    }
  }, [book]);

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    onSave(formData, book?.id);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      author: '',
      cover: '',
      status: 'to-read'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {book ? 'Editar Livro' : 'Adicionar Novo Livro'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Digite o título do livro"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Autor
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Nome do autor"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL da Capa
              </label>
              <input
                type="url"
                value={formData.cover}
                onChange={(e) => setFormData({...formData, cover: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://exemplo.com/capa.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="to-read">Para Ler</option>
                <option value="read">Lido</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-8">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              {book ? 'Atualizar' : 'Adicionar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;
