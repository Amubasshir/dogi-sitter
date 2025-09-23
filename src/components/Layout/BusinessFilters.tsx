import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { BUSINESS_CATEGORIES } from '../../types';

interface BusinessFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const BusinessFilters: React.FC<BusinessFiltersProps> = ({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onFilterClick,
  sortBy,
  onSortChange
}) => {
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortOptions = [
    { value: 'distance', label: 'הכי קרוב אלי' },
    { value: 'rating', label: 'הכי גבוה בדירוג' },
    { value: 'price_low', label: 'מחיר (נמוך לגבוה)' },
    { value: 'price_high', label: 'מחיר (גבוה לנמוך)' },
    { value: 'newest', label: 'חדש באפליקציה' }
  ];

  return (
    <div className="bg-white/90 backdrop-blur-xl border-b border-orange-100 px-3 py-3 space-y-3 shadow-sm sticky top-20 z-30">
      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => onCategoryChange('')}
          className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shadow-soft min-h-[40px] ${
            selectedCategory === ''
              ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-orange-50 border border-orange-200'
          }`}
        >
          הכל
        </button>
        {Object.entries(BUSINESS_CATEGORIES).map(([key, label]) => (
          <button
            key={key}
            onClick={() => onCategoryChange(key)}
            className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shadow-soft min-h-[40px] ${
              selectedCategory === key
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-orange-50 border border-orange-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Search and Filter Row */}
      <div className="flex gap-2 items-center">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
          <input
            type="text"
            placeholder="חיפוש עסקים..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pr-4 pl-12 py-3 bg-white border border-orange-200 rounded-xl text-right placeholder-orange-300 text-base shadow-md focus:shadow-lg focus:border-orange-400 min-h-[48px]"
          />
        </div>

        {/* Filter Button */}
        <button
          onClick={onFilterClick}
          className="p-3 border border-orange-200 rounded-xl hover:bg-orange-50 transition-all bg-white shadow-md min-w-[48px] min-h-[48px] flex items-center justify-center"
        >
          <Filter className="w-6 h-6 text-orange-600" />
        </button>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="p-3 border border-orange-200 rounded-xl hover:bg-orange-50 transition-all bg-white shadow-md min-w-[48px] min-h-[48px] flex items-center justify-center"
          >
            <SlidersHorizontal className="w-6 h-6 text-orange-600" />
          </button>

          {showSortDropdown && (
            <div className="absolute left-0 mt-1 w-44 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-orange-100 py-2 z-50">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value);
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-right px-4 py-3 hover:bg-orange-50 text-sm transition-all min-h-[44px] ${
                    sortBy === option.value ? 'text-orange-600 bg-orange-50' : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessFilters;