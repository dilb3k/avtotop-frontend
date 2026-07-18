'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCars } from '@/hooks/useCars';
import { SearchFilters } from '@/types';
import { api } from '@/lib/api';
import CarCard from '@/components/car/CarCard';
import CarFilters from '@/components/car/CarFilters';
import { PageLoading } from '@/components/ui/Loading';
import { IoSearch, IoCarSport } from 'react-icons/io5';

function CarsContent() {
  const searchParams = useSearchParams();
  const [brands, setBrands] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  // Get initial filters from URL
  const initialFilters: SearchFilters = {
    category_id: searchParams.get('category_id') || undefined,
    brand: searchParams.get('brand') || undefined,
    model: searchParams.get('model') || undefined,
    year_from: searchParams.get('year_from') ? Number(searchParams.get('year_from')) : undefined,
    year_to: searchParams.get('year_to') ? Number(searchParams.get('year_to')) : undefined,
    price_from: searchParams.get('price_from') ? Number(searchParams.get('price_from')) : undefined,
    price_to: searchParams.get('price_to') ? Number(searchParams.get('price_to')) : undefined,
    fuel_type: searchParams.get('fuel_type') || undefined,
    transmission: searchParams.get('transmission') || undefined,
    body_type: searchParams.get('body_type') || undefined,
    city: searchParams.get('city') || undefined,
    search: searchParams.get('search') || undefined,
    sort_by: searchParams.get('sort_by') || 'created_at',
    sort_order: searchParams.get('sort_order') as 'asc' | 'desc' || 'desc',
    page: 1,
    limit: 12,
  };

  const {
    cars,
    total,
    totalPages,
    loading,
    error,
    filters,
    updateFilters,
    setPage,
  } = useCars(initialFilters);

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const data = await api.get<{ filters: { brands: string[]; cities: string[] } }>('/search?q=');
        setBrands(data.filters?.brands || []);
        setCities(data.filters?.cities || []);
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };
    fetchFilterOptions();
  }, []);

  const handleSearch = (search: string) => {
    updateFilters({ search: search || undefined });
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Barcha e'lonlar</h1>
        <p className="text-gray-600">
          {total} ta mashina topildi
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Mashina qidirish..."
            className="input-field pl-12"
          />
        </div>
      </div>

      {/* Sort */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Saralash:</span>
          <select
            value={`${filters.sort_by}_${filters.sort_order}`}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'created_at') {
                updateFilters({ sort_by: 'created_at', sort_order: 'desc' });
              } else if (val === 'price_asc') {
                updateFilters({ sort_by: 'price', sort_order: 'asc' });
              } else if (val === 'price_desc') {
                updateFilters({ sort_by: 'price', sort_order: 'desc' });
              } else if (val === 'year_desc') {
                updateFilters({ sort_by: 'year', sort_order: 'desc' });
              } else if (val === 'year_asc') {
                updateFilters({ sort_by: 'year', sort_order: 'asc' });
              } else if (val === 'mileage_asc') {
                updateFilters({ sort_by: 'mileage', sort_order: 'asc' });
              } else if (val === 'views_desc') {
                updateFilters({ sort_by: 'views', sort_order: 'desc' });
              }
            }}
            className="select-field !w-auto !py-2 text-sm"
          >
            <option value="created_at_desc">Eng yangi</option>
            <option value="price_asc">Narx (arzon)</option>
            <option value="price_desc">Narx (qimmat)</option>
            <option value="year_desc">Yil (yangi)</option>
            <option value="year_asc">Yil (eski)</option>
            <option value="mileage_asc">Probeng kam</option>
            <option value="views_desc">Mashhur</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <CarFilters
          filters={filters}
          onFilterChange={updateFilters}
          brands={brands}
          cities={cities}
        />

        {/* Cars Grid */}
        <div className="flex-1">
          {loading ? (
            <PageLoading />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="btn-primary">
                Qaytadan urinib ko'ring
              </button>
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-12 card">
              <IoCarSport className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Hech narsa topilmadi</h3>
              <p className="text-gray-500 mb-4">Filtrlarni o'zgartiring yoki boshqa so'z bilan qidiring</p>
              <button
                onClick={() =>
                  updateFilters({
                    search: undefined,
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
                className="btn-secondary"
              >
                Filtrlarni tozalash
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8 pb-24 lg:pb-8">
                  <button
                    onClick={() => setPage(Math.max(1, filters.page! - 1))}
                    disabled={filters.page === 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Oldingi
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = filters.page! <= 3
                      ? i + 1
                      : filters.page! >= totalPages - 2
                      ? totalPages - 4 + i
                      : filters.page! - 2 + i;
                    
                    if (page < 1 || page > totalPages) return null;
                    
                    return (
                      <button
                        key={page}
                        onClick={() => setPage(page)}
                        className={`w-10 h-10 rounded-xl font-medium transition-colors ${
                          filters.page === page
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage(Math.min(totalPages, filters.page! + 1))}
                    disabled={filters.page === totalPages}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Keyingi
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <CarsContent />
    </Suspense>
  );
}
