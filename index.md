import React, { useState } from 'react';
import { Book, Plus, Search, Eye, EyeOff, Trash2, Edit3, Check } from 'lucide-react';

const BookLibrarySaaS = () => {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('to-read');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    cover: '',
    status: 'to-read'
  });

  const addOrUpdateBook = () => {
    if (!formData.title.trim()) return;

    const bookData = {
      id: editingBook?.id || Date.now(),
      title: formData.title,
      author: formData.author || 'Autor não informado',
      cover: formData.cover || 'https://via.placeholder.com/200x300/6366f1/white?text=Sem+Capa',
      status: formData.status,
      addedAt: editingBook?.addedAt || new Date().toLocaleDateString('pt-BR')
    };

    if (editingBook) {
      setBooks(books.map(book => book.id === editingBook.id ? bookData : book));
    } else {
      setBooks([...books, bookData]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', author: '', cover: '', status: 'to-read' });
    setShowModal(false);
    setEditingBook(null);
  };

  const deleteBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  const moveBook = (id) => {
    setBooks(books.map(book => 
      book.id === id 
        ? { ...book, status: book.status === 'to-read' ? 'read' : 'to-read' }
        : book
    ));
  };

  const editBook = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      cover: book.cover,
      status: book.status
    });
    setShowModal(true);
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = book.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const toReadCount = books.filter(book => book.status === 'to-read').length;
  const readCount = books.filter(book => book.status === 'read').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}


      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar livros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Para Ler</h3>
                <p className="text-3xl font-bold text-orange-600">{toReadCount}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Eye className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Lidos</h3>
                <p className="text-3xl font-bold text-green-600">{readCount}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('to-read')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'to-read'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Para Ler ({toReadCount})
          </button>
          <button
            onClick={() => setActiveTab('read')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'read'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Lidos ({readCount})
          </button>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {books.length === 0 ? 'Nenhum livro cadastrado' : 'Nenhum livro encontrado'}
            </h3>
            <p className="text-gray-500">
              {books.length === 0 ? 'Comece adicionando seu primeiro livro!' : 'Tente uma busca diferente'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div key={book.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative overflow-hidden">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x300/6366f1/white?text=Sem+Capa';
                    }}
                  />
                  <div className="absolute top-3 right-3 flex space-x-1">
                    <button
                      onClick={() => editBook(book)}
                      className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
                    >
                      <Edit3 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => deleteBook(book.id)}
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
                      onClick={() => moveBook(book.id)}
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
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingBook ? 'Editar Livro' : 'Adicionar Novo Livro'}
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
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={addOrUpdateBook}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    {editingBook ? 'Atualizar' : 'Adicionar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookLibrarySaaS;