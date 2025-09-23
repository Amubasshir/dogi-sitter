import React from 'react';
import { X } from 'lucide-react';
import { FilterOptions, NEIGHBORHOODS, SERVICE_TYPES, BUSINESS_CATEGORIES } from '../../types';

interface FilterChipsProps {
  filters: FilterOptions;
  onRemoveFilter: (filterType: string, value?: string) => void;
  onClearAll: () => void;
  searchQuery: string;
  onRemoveSearch: () => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
  searchQuery,
  onRemoveSearch
}) => {
  const chips: Array<{ type: string; label: string; value?: string }> = [];

  // Search query chip
  if (searchQuery.trim()) {
    chips.push({
      type: 'search',
      label: `"${searchQuery.trim()}"`
    });
  }

  // Status chip
  if (filters.availability && filters.availability !== 'all') {
    const statusLabels = {
      'open': 'פתוח',
      'completed': 'הושלם'
    };
    chips.push({
      type: 'status',
      label: statusLabels[filters.availability as keyof typeof statusLabels] || filters.availability
    });
  }

  // Neighborhoods chips
  filters.neighborhoods.forEach(neighborhood => {
    chips.push({
      type: 'neighborhood',
      label: neighborhood,
      value: neighborhood
    });
  });

  // Service types chips
  filters.serviceTypes.forEach(serviceType => {
    chips.push({
      type: 'serviceType',
      label: SERVICE_TYPES[serviceType as keyof typeof SERVICE_TYPES] || serviceType,
      value: serviceType
    });
  });

  // Price range chip
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 200) {
    chips.push({
      type: 'priceRange',
      label: `₪${filters.priceRange[0]}–₪${filters.priceRange[1]}`
    });
  }

  // Date range chips
  if (filters.dateFrom) {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    let dateLabel = filters.dateFrom;
    if (filters.dateFrom === today) {
      dateLabel = 'היום';
    } else if (filters.dateFrom === tomorrow) {
      dateLabel = 'מחר';
    } else {
      dateLabel = new Date(filters.dateFrom).toLocaleDateString('he-IL');
    }
    
    chips.push({
      type: 'dateFrom',
      label: `מ-${dateLabel}`
    });
  }

  if (filters.dateTo) {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    let dateLabel = filters.dateTo;
    if (filters.dateTo === today) {
      dateLabel = 'היום';
    } else if (filters.dateTo === tomorrow) {
      dateLabel = 'מחר';
    } else {
      dateLabel = new Date(filters.dateTo).toLocaleDateString('he-IL');
    }
    
    chips.push({
      type: 'dateTo',
      label: `עד-${dateLabel}`
    });
  }

  // Time of day chip
  if (filters.timeOfDay && filters.timeOfDay !== 'all') {
    const timeLabels = {
      'morning': 'בוקר',
      'afternoon': 'צהריים',
      'evening': 'ערב'
    };
    chips.push({
      type: 'timeOfDay',
      label: timeLabels[filters.timeOfDay as keyof typeof timeLabels] || filters.timeOfDay
    });
  }

  // Rating chip
  if (filters.rating > 0) {
    chips.push({
      type: 'rating',
      label: `${filters.rating}+ כוכבים`
    });
  }

  // Business categories chips
  filters.businessCategories.forEach(category => {
    chips.push({
      type: 'businessCategory',
      label: BUSINESS_CATEGORIES[category as keyof typeof BUSINESS_CATEGORIES] || category,
      value: category
    });
  });

  // Dog size chips
  filters.dogSize.forEach(size => {
    const sizeLabels = {
      'small': 'קטן',
      'medium': 'בינוני',
      'large': 'גדול'
    };
    chips.push({
      type: 'dogSize',
      label: `כלב ${sizeLabels[size as keyof typeof sizeLabels] || size}`,
      value: size
    });
  });

  // Experience chips
  if (filters.experience) {
    filters.experience.forEach(exp => {
      chips.push({
        type: 'experience',
        label: `ניסיון: ${exp}`,
        value: exp
      });
    });
  }

  // Available days chips
  if (filters.availableDays) {
    filters.availableDays.forEach(day => {
      chips.push({
        type: 'availableDay',
        label: `זמין ב${day}`,
        value: day
      });
    });
  }

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/90 backdrop-blur-xl border-b border-orange-100 px-3 py-3 sticky top-24 z-20">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Filter chips */}
        {chips.map((chip, index) => (
          <div
            key={`${chip.type}-${chip.value || chip.label}-${index}`}
            className="flex items-center gap-1 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium border border-orange-200 shadow-sm"
          >
            <span>{chip.label}</span>
            <button
              onClick={() => {
                if (chip.type === 'search') {
                  onRemoveSearch();
                } else {
                  onRemoveFilter(chip.type, chip.value);
                }
              }}
              className="w-4 h-4 bg-orange-200 hover:bg-orange-300 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-2.5 h-2.5 text-orange-700" />
            </button>
          </div>
        ))}

        {/* Clear all button */}
        <button
          onClick={onClearAll}
          className="flex items-center gap-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium border border-red-200 shadow-sm hover:from-red-200 hover:to-pink-200 transition-all"
        >
          <X className="w-4 h-4" />
          <span>נקה הכול</span>
        </button>
      </div>
    </div>
  );
};

export default FilterChips;