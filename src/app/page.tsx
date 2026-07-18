'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Car, Category } from '@/types';
import CarCard from '@/components/car/CarCard';
import { ListSkeleton } from '@/components/ui/Loading';
import { IoSearch, IoCarSport, IoArrowForward, IoShield, IoStar, IoSpeedometer } from 'react-icons/io5';

export default function HomePage() {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsData, catsData] = await Promise.all([
          api.get<{ cars: Car[] }>('/cars?limit=6&sort_by=views&sort_order=desc'),
          api.get<Category[]>('/categories'),
        ]);
        setFeaturedCars(carsData.cars || []);
        setCategories(catsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/cars?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              O'zbekistondagi eng katta
              <span className="block text-accent-400">avtomobil bozori</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8">
              Minglab e'lonlar orasidan o'zingizga mos mashinani toping yoki o'z e'loningizni joylashtiring
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-2 bg-white/10 backdrop-blur-lg p-2 rounded-2xl border border-white/20">
                <div className="flex-1 relative">
                  <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Marka, model yoki kalit so'z kiriting..."
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
                <button type="submit" className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2">
                  <IoSearch size={18} />
                  <span className="hidden sm:inline">Qidirish</span>
                </button>
              </div>
            </form>

            {/* Stats */}
            <div className="flex justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-primary-200 text-sm">E'lonlar</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-primary-200 text-sm">Foydalanuvchilar</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">10+</div>
                <div className="text-primary-200 text-sm">Shaharlar</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-6 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <IoShield className="text-primary-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Xavfsiz bitim</h3>
                <p className="text-gray-600 text-sm">Barcha e'lonlar tekshirilgan va ishonchli sotuvchilar</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <IoStar className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Sifatli e'lonlar</h3>
                <p className="text-gray-600 text-sm">Batafsil ma'lumot va haqiqiy rasmlar bilan to'ldirilgan</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <IoSpeedometer className="text-accent-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Tezkor qidirish</h3>
                <p className="text-gray-600 text-sm">Keng filtrlar tizimi bilan tezda mos mashinani toping</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title mb-0">Kategoriyalar</h2>
            <Link href="/cars" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
              Barchasini ko'rish <IoArrowForward size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/cars?category_id=${category.id}`}
                className="card card-hover p-4 text-center group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-medium text-gray-900 text-sm">{category.name}</h3>
                {category.car_count !== undefined && (
                  <p className="text-xs text-gray-500 mt-1">{category.car_count} ta</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title mb-1">Mashhur e'lonlar</h2>
              <p className="text-gray-600">Ko'p ko'rilgan e'lonlar</p>
            </div>
            <Link href="/cars" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
              Barchasini ko'rish <IoArrowForward size={16} />
            </Link>
          </div>

          {loading ? (
            <ListSkeleton count={6} />
          ) : featuredCars.length === 0 ? (
            <div className="text-center py-12">
              <IoCarSport className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg">Hali e'lonlar yo'q</p>
              <Link href="/create" className="btn-primary mt-4 inline-flex">
                Birinchi e'lonni joylashtiring
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            O'z e'loningizni joylashtiring
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            Minglab foydalanuvchilar sizning e'loningizni ko'rishadi
          </p>
          <Link href="/create" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors shadow-xl">
            <IoCarSport size={20} />
            E'lon qo'shish
          </Link>
        </div>
      </section>
    </div>
  );
}
