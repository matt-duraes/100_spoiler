import React from 'react';

const TabNavigation = ({ activeTab, onTabChange, toReadCount, readCount }) => {
  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 max-w-md">
      <button
        onClick={() => onTabChange('to-read')}
        className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
          activeTab === 'to-read'
            ? 'bg-white text-orange-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Para Ler ({toReadCount})
      </button>
      <button
        onClick={() => onTabChange('read')}
        className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
          activeTab === 'read'
            ? 'bg-white text-green-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Lidos ({readCount})
      </button>
    </div>
  );
};

export default TabNavigation;
