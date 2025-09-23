import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilter: () => void;
  searchQuery: string;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilter, searchQuery, hasActiveFilters, onClearFilters }) => {

  return (
    <div className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-orange-100 px-3 py-3 sticky top-20 z-30">
      <div className="flex items-center gap-2">
        {/* Filter Button */}
        <button
          onClick={onFilter}
          className={`p-3 border rounded-xl hover:bg-orange-50 transition-all bg-white shadow-md min-w-[48px] min-h-[48px] flex items-center justify-center ${
            hasActiveFilters ? 'border-orange-400 bg-orange-50' : 'border-orange-200'
          }`}
        >
          <Filter className={`w-6 h-6 ${hasActiveFilters ? 'text-orange-700' : 'text-orange-600'}`} />
        </button>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="p-3 border border-red-200 rounded-xl hover:bg-red-50 transition-all bg-white shadow-md min-w-[48px] min-h-[48px] flex items-center justify-center"
            title="נקה סינון"
          >
            <X className="w-6 h-6 text-red-600" />
          </button>
        )}

        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
          <input
            type="text"
            placeholder="חפשו לפי שכונה/מחיר/שירות…"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className={`w-full pr-4 pl-12 py-3 bg-white border rounded-xl text-right placeholder-orange-300 transition-all duration-300 shadow-md focus:shadow-lg focus:border-orange-400 text-base min-h-[48px] ${
              searchQuery ? 'border-orange-400 bg-orange-50' : 'border-orange-200'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;