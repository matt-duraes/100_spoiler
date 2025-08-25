import React from 'react';
import { Eye, Check } from 'lucide-react';

const StatsCards = ({ toReadCount, readCount }) => {
  return (
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
  );
};

export default StatsCards;
