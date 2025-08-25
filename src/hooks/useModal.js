import { useState } from 'react';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const openModal = (item = null) => {
    setEditingItem(item);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingItem(null);
  };

  return {
    isOpen,
    editingItem,
    openModal,
    closeModal
  };
};
