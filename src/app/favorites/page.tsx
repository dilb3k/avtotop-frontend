'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/api';
import { Car } from '@/types';
import CarCard from '@/components/car/CarCard';
import { PageLoading } from '@/components/ui/Loading';
import Link from 'next/link';
import { IoHeart, IoCarSport } from 'react-icons/io5';

export default function FavoritesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<{ id: string; car: Car }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      const data = await api.get<{ id: string; car: Car }[]>('/users/favorites');
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (carId: string) => {
    try {
      await api.delete(`/favorites/${carId}`);
      setFavorites(favorites.filter(f => f.car?.id !== carId));
    } catch (error: any) {
      console.error('Error removing favorite:', error);
    }
  };

  if (authLoading) return <PageLoading />;

  return (
    <div className="page-container page-transition">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <IoHeart className="text-red-500" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sevimlilar</h1>
            <p className="text-gray-600 text-sm">{favorites.length} ta e'lon</p>
          </div>
        </div>

        {loading ? (
          <PageLoading />
        ) : favorites.length === 0 ? (
          <div className="card p-12 text-center">
            <IoHeart className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sevimlilar ro'yxati bo'sh</h3>
            <p className="text-gray-500 mb-4">Mashinalarni ko'rib chiqing va sevimlilaringizga qo'shing</p>
            <Link href="/cars" className="btn-primary inline-flex">
              <IoCarSport className="mr-1" size={18} />
              E'lonlarni ko'rish
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              fav.car && (
                <CarCard
                  key={fav.id}
                  car={{ ...fav.car, is_favorite: true }}
                  onFavoriteToggle={(carId) => handleRemoveFavorite(carId)}
                />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
