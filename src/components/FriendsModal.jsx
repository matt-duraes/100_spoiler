import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Users, X } from 'lucide-react';
import API_URL from '../config/api';

const FriendsModal = ({ isOpen, onClose, onViewLibrary }) => {
  const [friends, setFriends] = useState([]);
  const [newFriendCode, setNewFriendCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchFriends();
    }
  }, [isOpen]);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/friends`);
      setFriends(response.data);
    } catch (err) {
      console.error('Error fetching friends:', err);
    }
  };

  const handleAddFriend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(`${API_URL}/api/friends/add`, { friendCode: newFriendCode });
      setSuccess('Amigo adicionado com sucesso!');
      setNewFriendCode('');
      fetchFriends();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao adicionar amigo');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              Meus Amigos
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleAddFriend} className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adicionar novo amigo
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFriendCode}
                onChange={(e) => setNewFriendCode(e.target.value)}
                placeholder="Digite o código (ex: 123456)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                maxLength={6}
              />
              <button
                type="submit"
                disabled={loading || !newFriendCode}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
          </form>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Lista de Amigos
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {friends.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Você ainda não tem amigos adicionados.</p>
              ) : (
                friends.map((friend) => (
                  <div
                    key={friend.id}
                    onClick={() => onViewLibrary(friend)}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors group"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{friend.name}</p>
                      <p className="text-xs text-gray-500">#{friend.friendCode}</p>
                    </div>
                    <span className="text-xs text-purple-600 opacity-0 group-hover:opacity-100 font-medium">
                      Ver biblioteca →
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsModal;
