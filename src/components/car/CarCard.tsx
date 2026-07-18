'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Car } from '@/types';
import { formatPrice, getPrimaryImage, formatDate } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/api';
import { IoHeart, IoHeartOutline, IoEye, IoLocation, IoCalendar, IoSpeedometer, IoFlame } from 'react-icons/io5';
import toast from 'react-hot-toast';

interface CarCardProps {
  car: Car;
  onFavoriteToggle?: (carId: string, isFavorite: boolean) => void;
}

export default function CarCard({ car, onFavoriteToggle }: CarCardProps) {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(car.is_favorite || false);
  const [imageError, setImageError] = useState(false);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Sevimlilarga qo'shish uchun tizimga kiring");
      return;
    }

    try {
      await api.post(`/favorites/${car.id}/toggle`);
      setIsFavorite(!isFavorite);
      onFavoriteToggle?.(car.id, !isFavorite);
      toast.success(isFavorite ? "Sevimlilardan o'chirildi" : "Sevimlilarga qo'shildi");
    } catch (error: any) {
      toast.error(error.message || 'Xatolik yuz berdi');
    }
  };

  const imageUrl = getPrimaryImage(car.car_images);
  const sellerName = car.profiles?.full_name || 'Noma\'lum';
  const categoryName = car.categories?.name || '';

  return (
    <Link href={`/cars/${car.id}`}>
      <div className="card card-hover group cursor-pointer h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {!imageError ? (
            <img
              src={imageUrl}
              alt={car.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-4xl">🚗</span>
            </div>
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Category badge */}
          {categoryName && (
            <div className="absolute top-3 left-3">
              <span className="badge bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm">
                {car.categories?.icon} {categoryName}
              </span>
            </div>
          )}

          {/* Favorite button */}
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
          >
            {isFavorite ? (
              <IoHeart className="text-red-500" size={18} />
            ) : (
              <IoHeartOutline className="text-gray-500 hover:text-red-500" size={18} />
            )}
          </button>

          {/* Views */}
          {car.views > 0 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white/90 text-xs">
              <IoEye size={14} />
              <span>{car.views}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1 mb-1">
            {car.brand} {car.model} {car.year}
          </h3>

          {/* Price */}
          <p className="text-xl font-bold text-primary-600 mb-3">
            {formatPrice(car.price)}
          </p>

          {/* Specs */}
          <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <IoCalendar size={12} />
              {car.year}
            </span>
            <span className="flex items-center gap-1">
              <IoSpeedometer size={12} />
              {car.mileage ? `${car.mileage.toLocaleString()} km` : 'Yangi'}
            </span>
            {car.fuel_type && (
              <span className="flex items-center gap-1">
                <IoFlame size={12} />
                {car.fuel_type}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <IoLocation size={12} />
              {car.city}
            </span>
            <span className="text-xs text-gray-400">
              {formatDate(car.created_at)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
