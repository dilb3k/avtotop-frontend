'use client';

import { useState, useEffect } from 'react';
import { SearchFilters } from '@/types';
import { api } from '@/lib/api';
import { IoFilter, IoClose, IoChevronDown } from 'react-icons/io5';

interface CarFiltersProps {
  filters: SearchFilters;
  onFilterChange: (filters: Partial<SearchFilters>) => void;
  brands?: string[];
  cities?: string[];
}

const FUEL_TYPES = [
  { value: 'benzin', label: 'Benzin' },
  { value: 'dizel', label: 'Dizel' },
  { value: 'gaz', label: 'Gaz' },
  { value: 'elektro', label: 'Elektro' },
  { value: 'gibrid', label: 'Gibrid' },
];

const TRANSMISSIONS = [
  { value: 'avtomat', label: 'Avtomat' },
  { value: 'mexanik', label: 'Mexanik' },
];

const BODY_TYPES = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'hetchbek', label: 'Hetchbek' },
  { value: 'universall', label: 'Universall' },
  { value: 'krossover', label: 'Krossover' },
  { value: 'dzhip', label: 'Djip' },
  { value: 'pikap', label: 'Pikap' },
  { value: 'miniven', label: 'Miniven' },
  { value: 'kabriolet', label: 'Kabriolet' },
];

const SORT_OPTIONS = [
  { value: 'created_at', label: "Eng yangi" },
  { value: 'price_asc', label: "Narx (arzon)" },
  { value: 'price_desc', label: "Narx (qimmat)" },
  { value: 'year_desc', label: "Yil (yangi)" },
  { value: 'year_asc', label: "Yil (eski)" },
  { value: 'mileage', label: "Probeng kam" },
  { value: 'popular', label: "Mashhur" },
];

const YEAR_OPTIONS = Array.from({ length: 30 }, (_, i) => ({
  value: String(new Date().getFullYear() - i),
  label: String(new Date().getFullYear() - i),
}));

export default function CarFilters({ filters, onFilterChange, brands = [], cities = [] }: CarFiltersProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.get<any[]>('/categories');
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showMobileFilters]);

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => value && !['page', 'limit', 'sort_by', 'sort_order'].includes(key)
  ).length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Kategoriya</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFilterChange({ category_id: undefined })}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !filters.category_id
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Hammasi
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ category_id: cat.id })}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.category_id === cat.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brand */}
      {brands.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Marka</label>
          <select
            value={filters.brand || ''}
            onChange={(e) => onFilterChange({ brand: e.target.value || undefined })}
            className="select-field"
          >
            <option value="">Hammasi</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
      )}

      {/* Year Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Yil</label>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={filters.year_from || ''}
            onChange={(e) => onFilterChange({ year_from: e.target.value ? Number(e.target.value) : undefined })}
            className="select-field"
          >
            <option value="">Dan</option>
            {YEAR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            value={filters.year_to || ''}
            onChange={(e) => onFilterChange({ year_to: e.target.value ? Number(e.target.value) : undefined })}
            className="select-field"
          >
            <option value="">Gacha</option>
            {YEAR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Narx (so'm)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Dan"
            value={filters.price_from || ''}
            onChange={(e) => onFilterChange({ price_from: e.target.value ? Number(e.target.value) : undefined })}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Gacha"
            value={filters.price_to || ''}
            onChange={(e) => onFilterChange({ price_to: e.target.value ? Number(e.target.value) : undefined })}
            className="input-field"
          />
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Yoqilg'i turi</label>
        <div className="flex flex-wrap gap-2">
          {FUEL_TYPES.map((ft) => (
            <button
              key={ft.value}
              onClick={() => onFilterChange({ fuel_type: filters.fuel_type === ft.value ? undefined : ft.value })}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.fuel_type === ft.value
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {ft.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Uzatma qutisi</label>
        <div className="flex flex-wrap gap-2">
          {TRANSMISSIONS.map((t) => (
            <button
              key={t.value}
              onClick={() => onFilterChange({ transmission: filters.transmission === t.value ? undefined : t.value })}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.transmission === t.value
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Karobka turi</label>
        <div className="flex flex-wrap gap-2">
          {BODY_TYPES.map((bt) => (
            <button
              key={bt.value}
              onClick={() => onFilterChange({ body_type: filters.body_type === bt.value ? undefined : bt.value })}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.body_type === bt.value
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {bt.label}
            </button>
          ))}
        </div>
      </div>

      {/* City */}
      {cities.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shahar</label>
          <select
            value={filters.city || ''}
            onChange={(e) => onFilterChange({ city: e.target.value || undefined })}
            className="select-field"
          >
            <option value="">Hammasi</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      )}

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <button
          onClick={() =>
            onFilterChange({
              category_id: undefined,
              brand: undefined,
              year_from: undefined,
              year_to: undefined,
              price_from: undefined,
              price_to: undefined,
              fuel_type: undefined,
              transmission: undefined,
              body_type: undefined,
              city: undefined,
            })
          }
          className="w-full btn-secondary text-sm"
        >
          Filtrlarni tozalash ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <div className="card p-4 sticky top-24">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <IoFilter size={18} />
              Filtrlar
              {activeFilterCount > 0 && (
                <span className="badge badge-primary">{activeFilterCount}</span>
              )}
            </h3>
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className={`lg:hidden fixed bottom-4 left-4 right-4 z-40 transition-opacity ${showMobileFilters ? 'pointer-events-none opacity-0' : ''}`}>
        <button
          onClick={() => setShowMobileFilters(true)}
          className="w-full btn-primary flex items-center justify-center gap-2 shadow-xl"
        >
          <IoFilter size={18} />
          Filtrlar
          {activeFilterCount > 0 && (
            <span className="ml-1 w-5 h-5 bg-white text-primary-600 rounded-full text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl animate-slide-up overflow-y-auto flex flex-col">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between z-10">
              <h3 className="font-semibold text-gray-900">Filtrlar</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <IoClose size={20} />
              </button>
            </div>
            <div className="p-4 flex-1">
              <FilterContent />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full btn-primary"
              >
                Natijalarni ko'rish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
