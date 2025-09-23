import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';
import { FilterOptions, NEIGHBORHOODS, SERVICE_TYPES, DOG_SIZES, BUSINESS_CATEGORIES } from '../../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  activeTab: 'requests' | 'sitters' | 'businesses';
  currentFilters: FilterOptions;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  activeTab,
  currentFilters
}) => {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);
  const [errors, setErrors] = useState<{
    dateRange?: string;
    priceRange?: string;
  }>({});

  if (!isOpen) return null;

  const handleApply = () => {
    const newErrors: { dateRange?: string; priceRange?: string } = {};
    
    // Validate date range
    if (filters.dateFrom && filters.dateTo) {
      const fromDate = new Date(filters.dateFrom);
      const toDate = new Date(filters.dateTo);
      if (fromDate > toDate) {
        newErrors.dateRange = 'טווח תאריכים לא תקין';
      }
    }
    
    // Validate price range
    if (filters.priceRange[0] > filters.priceRange[1]) {
      newErrors.priceRange = 'טווח מחירים לא תקין';
    }
    
    setErrors(newErrors);
    
    // Only apply if no errors
    if (Object.keys(newErrors).length === 0) {
      onApply(filters);
      onClose();
    }
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      neighborhoods: [],
      serviceTypes: [],
      priceRange: [0, 200],
      rating: 0,
      availability: 'all',
      dogSize: [],
      businessCategories: [],
      dateFrom: '',
      dateTo: '',
      timeOfDay: 'all',
      sortBy: 'date_asc'
    };
    setFilters(resetFilters);
    setErrors({});
  };

  const renderRequestFilters = () => (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <div>
        <h3 className="font-semibold mb-3 text-gray-800">תאריך השירות</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">מתאריך</label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, dateFrom: e.target.value }));
                setErrors(prev => ({ ...prev, dateRange: undefined }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">עד תאריך</label>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, dateTo: e.target.value }));
                setErrors(prev => ({ ...prev, dateRange: undefined }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {errors.dateRange && (
            <p className="text-red-500 text-sm">{errors.dateRange}</p>
          )}
        </div>
      </div>

      {/* Neighborhoods */}
      <div>
        <h3 className="font-semibold mb-3 text-gray-800">שכונות</h3>
        <p className="text-xs text-gray-500 mb-2">אם לא נבחר - נחשב כל השכונות</p>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {NEIGHBORHOODS.map((neighborhood) => (
            <label key={neighborhood} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.neighborhoods.includes(neighborhood)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFilters(prev => ({
                      ...prev,
                      neighborhoods: [...prev.neighborhoods, neighborhood]
                    }));
                  } else {
                    setFilters(prev => ({
                      ...prev,
                      neighborhoods: prev.neighborhoods.filter(n => n !== neighborhood)
                    }));
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm hover:text-blue-600 transition-colors">{neighborhood}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3 text-gray-800">טווח מחירים</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">מחיר מינימלי</label>
              <input
                type="number"
                min="0"
                value={filters.priceRange[0]}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setFilters(prev => ({
                    ...prev,
                    priceRange: [value, prev.priceRange[1]]
                  }));
                  setErrors(prev => ({ ...prev, priceRange: undefined }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">מחיר מקסימלי</label>
              <input
                type="number"
                min="0"
                value={filters.priceRange[1]}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 500;
                  setFilters(prev => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], value]
                  }));
                  setErrors(prev => ({ ...prev, priceRange: undefined }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="500"
              />
            </div>
          </div>
          <div className="text-sm text-gray-600">
            ₪{filters.priceRange[0]} - ₪{filters.priceRange[1]}
          </div>
          {errors.priceRange && (
            <p className="text-red-500 text-sm">{errors.priceRange}</p>
          )}
        </div>
      </div>

      {/* Days Filter */}
      <div>
        <h3 className="font-semibold mb-3 text-gray-800">ימים בשבוע</h3>
        <div className="space-y-2">
          {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map((day) => (
            <label key={day} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.availableDays?.includes(day) || false}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFilters(prev => ({
                      ...prev,
                      availableDays: [...(prev.availableDays || []), day]
                    }));
                  } else {
                    setFilters(prev => ({
                      ...prev,
                      availableDays: (prev.availableDays || []).filter(d => d !== day)
                    }));
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{day}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Time of Day */}
      <div>
        <h3 className="font-semibold mb-3 text-gray-800">שעות היום</h3>
        <div className="space-y-2">
          {[
            { value: 'all', label: 'כל השעות' },
            { value: 'morning', label: 'בוקר (06:00-12:00)' },
            { value: 'afternoon', label: 'צהריים (12:00-18:00)' },
            { value: 'evening', label: 'ערב (18:00-22:00)' }
          ].map((timeSlot) => (
            <label key={timeSlot.value} className="flex items-center gap-2">
              <input
                type="radio"
                name="timeSlot"
                checked={filters.timeOfDay === timeSlot.value}
                onChange={() => {
                  setFilters(prev => ({
                    ...prev,
                    timeOfDay: timeSlot.value
                  }));
                }}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{timeSlot.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <h3 className="font-semibold mb-3 text-gray-800">מיון</h3>
        <div className="space-y-2">
          {[
            { value: 'date_asc', label: 'תאריך השירות (מוקדם לאוחר)' },
            { value: 'date_desc', label: 'תאריך השירות (אוחר למוקדם)' },
            { value: 'price_low', label: 'מחיר (נמוך לגבוה)' },
            { value: 'price_high', label: 'מחיר (גבוה לנמוך)' },
            { value: 'created_desc', label: 'פורסם לאחרונה' },
            { value: 'created_asc', label: 'פורסם ראשון' }
          ].map((sortOption) => (
            <label key={sortOption.value} className="flex items-center gap-2">
              <input
                type="radio"
                name="sort"
                checked={filters.sortBy === sortOption.value}
                onChange={() => setFilters(prev => ({ ...prev, sortBy: sortOption.value }))}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{sortOption.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 backdrop-blur-sm">
      <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-md sm:w-full max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Filter className="w-6 h-6" />
            סינון ומיון
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-6 pb-safe">
          {activeTab === 'requests' ? renderRequestFilters() : (
            <div>
              {/* Keep existing filters for other tabs */}
              {/* Neighborhoods */}
              <div>
                <h3 className="font-bold mb-3 text-gray-800 text-lg">שכונות</h3>
                <div className="grid grid-cols-2 gap-3">
                  {NEIGHBORHOODS.map((neighborhood) => (
                    <label key={neighborhood} className="flex items-center gap-2 min-h-[44px]">
                      <input
                        type="checkbox"
                        checked={filters.neighborhoods.includes(neighborhood)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              neighborhoods: [...prev.neighborhoods, neighborhood]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              neighborhoods: prev.neighborhoods.filter(n => n !== neighborhood)
                            }));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 w-5 h-5"
                      />
                      <span className="text-base hover:text-blue-600 transition-colors">{neighborhood}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-bold mb-3 text-gray-800 text-lg">טווח מחירים</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={filters.priceRange[1]}
                      onChange={(e) => {
                        setFilters(prev => ({
                          ...prev,
                          priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                        }));
                      }}
                      className="flex-1 h-3"
                    />
                    <span className="text-base font-bold text-green-600 min-w-[60px]">₪{filters.priceRange[1]}</span>
                  </div>
                  <div className="text-base text-gray-600 font-medium">
                    עד ₪{filters.priceRange[1]} לשירות
                  </div>
                </div>
              </div>

              {errors.priceRange && (
                <p className="text-red-500 text-base">בדקו שמחיר מינימום נמוך ממחיר מקסימום.</p>
              )}

              {/* Sort Options for Sitters */}
              <div>
                <h3 className="font-bold mb-3 text-gray-800 text-lg">מיון</h3>
                <div className="space-y-2">
                  {[
                    { value: 'rating_desc', label: 'דירוג (גבוה לנמוך)' },
                    { value: 'rating_asc', label: 'דירוג (נמוך לגבוה)' },
                    { value: 'price_low', label: 'מחיר (נמוך לגבוה)' },
                    { value: 'price_high', label: 'מחיר (גבוה לנמוך)' },
                    { value: 'experience_desc', label: 'ניסיון (רב לפחות)' },
                    { value: 'experience_asc', label: 'ניסיון (פחות לרב)' },
                    { value: 'reviews_desc', label: 'מספר ביקורות (רב לפחות)' },
                    { value: 'newest', label: 'הצטרף לאחרונה' }
                  ].map((sortOption) => (
                    <label key={sortOption.value} className="flex items-center gap-3 min-h-[44px]">
                      <input
                        type="radio"
                        name="sitterSort"
                        checked={filters.sortBy === sortOption.value}
                        onChange={() => setFilters(prev => ({ ...prev, sortBy: sortOption.value }))}
                        className="text-blue-600 focus:ring-blue-500 w-5 h-5"
                      />
                      <span className="text-base">{sortOption.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {activeTab === 'sitters' && (
                <div>
                  <h3 className="font-bold mb-3 text-gray-800 text-lg">דירוג מינימלי</h3>
                  <div className="space-y-2">
                    {[4.5, 4.0, 3.5, 0].map((rating) => (
                      <label key={rating} className="flex items-center gap-3 min-h-[44px]">
                        <input
                          type="radio"
                          name="rating"
                          checked={filters.rating === rating}
                          onChange={() => setFilters(prev => ({ ...prev, rating }))}
                          className="text-blue-600 focus:ring-blue-500 w-5 h-5"
                        />
                        <span className="text-base">
                          {rating === 0 ? 'הכל' : `${rating}+ כוכבים`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Filter */}
              <div>
                <h3 className="font-bold mb-3 text-gray-800 text-lg">שנות ניסיון</h3>
                <div className="space-y-2">
                  {[
                    { value: 'מתחיל', label: 'מתחיל' },
                    { value: '1-2 שנים', label: '1-2 שנים' },
                    { value: '3-5 שנים', label: '3-5 שנים' },
                    { value: '5+ שנים', label: '5+ שנים' },
                    { value: '10+ שנים', label: '10+ שנים' }
                  ].map((exp) => (
                    <label key={exp.value} className="flex items-center gap-3 min-h-[44px]">
                      <input
                        type="checkbox"
                        checked={filters.experience?.includes(exp.value) || false}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              experience: [...(prev.experience || []), exp.value]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              experience: (prev.experience || []).filter(ex => ex !== exp.value)
                            }));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                      />
                      <span className="text-base">{exp.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Available Days Filter */}
              <div>
                <h3 className="font-bold mb-3 text-gray-800 text-lg">ימים בשבוע</h3>
                <div className="space-y-2">
                  {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map((day) => (
                    <label key={day} className="flex items-center gap-3 min-h-[44px]">
                      <input
                        type="checkbox"
                        checked={filters.availableDays?.includes(day) || false}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              availableDays: [...(prev.availableDays || []), day]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              availableDays: (prev.availableDays || []).filter(d => d !== day)
                            }));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                      />
                      <span className="text-base">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Time of Day Filter */}
              <div>
                <h3 className="font-bold mb-3 text-gray-800 text-lg">שעות היום</h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'כל השעות' },
                    { value: 'morning', label: 'בוקר (06:00-12:00)' },
                    { value: 'afternoon', label: 'צהריים (12:00-18:00)' },
                    { value: 'evening', label: 'ערב (18:00-22:00)' }
                  ].map((timeSlot) => (
                    <label key={timeSlot.value} className="flex items-center gap-3 min-h-[44px]">
                      <input
                        type="radio"
                        name="timeOfDay"
                        checked={filters.timeOfDay === timeSlot.value}
                        onChange={() => {
                          setFilters(prev => ({
                            ...prev,
                            timeOfDay: timeSlot.value
                          }));
                        }}
                        className="text-blue-600 focus:ring-blue-500 w-5 h-5"
                      />
                      <span className="text-base">{timeSlot.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Business Categories (for businesses only) */}
              {activeTab === 'businesses' && (
                <div>
                  <h3 className="font-bold mb-3 text-gray-800 text-lg">קטגוריית עסק</h3>
                  <div className="space-y-2">
                    {Object.entries(BUSINESS_CATEGORIES).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-3 min-h-[44px]">
                        <input
                          type="checkbox"
                          checked={filters.businessCategories.includes(key)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                businessCategories: [...prev.businessCategories, key]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                businessCategories: prev.businessCategories.filter(c => c !== key)
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                        />
                        <span className="text-base">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Opening Hours */}
              {activeTab === 'businesses' && (
                <div>
                  <h3 className="font-bold mb-3 text-gray-800 text-lg">שעות פעילות</h3>
                  <div className="space-y-2">
                    {['', 'open_now', 'open_today', 'open_weekend'].map((value) => (
                      <label key={value} className="flex items-center gap-3 min-h-[44px]">
                        <input
                          type="radio"
                          name="openingHours"
                          checked={filters.availability === value}
                          onChange={() => setFilters(prev => ({ ...prev, availability: value }))}
                          className="text-blue-600 focus:ring-blue-500 w-5 h-5"
                        />
                        <span className="text-base">
                          {value === '' ? 'הכל' :
                           value === 'open_now' ? 'פתוח עכשיו' :
                           value === 'open_today' ? 'פתוח היום' :
                           'פתוח בסופ״ש'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-gray-200 sticky bottom-0 bg-white z-10">
          <button
            onClick={handleReset}
            className="flex-1 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium text-base min-h-[48px]"
          >
            איפוס
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-colors font-bold text-base min-h-[48px]"
          >
            החל סינון
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;