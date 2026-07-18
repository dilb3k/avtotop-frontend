'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useCar } from '@/hooks/useCars';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/api';
import { formatPrice, formatDate, getPrimaryImage } from '@/lib/utils';
import { PageLoading } from '@/components/ui/Loading';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import {
  IoHeart, IoHeartOutline, IoShare, IoFlag, IoArrowBack,
  IoCalendar, IoSpeedometer, IoFuel, IoColorFill, IoCarSport,
  IoLocation, IoPerson, IoCall, IoTime, IoEye, IoClose, IoChevronLeft, IoChevronRight
} from 'react-icons/io5';

export default function CarDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { car, loading, error } = useCar(id);
  const { user, isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Sevimlilarga qo'shish uchun tizimga kiring");
      return;
    }

    try {
      await api.post(`/favorites/${car?.id}/toggle`);
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? "Sevimlilardan o'chirildi" : "Sevimlilarga qo'shildi");
    } catch (error: any) {
      toast.error(error.message || 'Xatolik yuz berdi');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: car ? `${car.brand} ${car.model} ${car.year}` : 'Avtotop',
          text: car ? `${car.brand} ${car.model} ${car.year} - ${formatPrice(car.price)}` : '',
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Havola nusxalandi');
    }
  };

  if (loading) return <PageLoading />;

  if (error || !car) {
    return (
      <div className="page-container text-center py-20">
        <IoCarSport className="mx-auto text-gray-300 mb-4" size={80} />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">E'lon topilmadi</h2>
        <p className="text-gray-500 mb-6">{error || 'Bu e'lon mavjud emas yoki o\'chirilgan'}</p>
        <Link href="/cars" className="btn-primary">
          E'lonlar ro'yxatiga qaytish
        </Link>
      </div>
    );
  }

  const images = car.car_images || [];
  const seller = car.profiles;

  const specs = [
    { icon: IoCalendar, label: 'Yil', value: car.year },
    { icon: IoSpeedometer, label: 'Probeg', value: car.mileage ? `${car.mileage.toLocaleString()} km` : "Yangi" },
    { icon: IoFuel, label: 'Yoqilg\'i', value: car.fuel_type || "Noma'lum" },
    { icon: IoCarSport, label: 'Uzatma', value: car.transmission || "Noma'lum" },
    { icon: IoColorFill, label: 'Rang', value: car.color || "Noma'lum" },
    { icon: IoCarSport, label: 'Karobka', value: car.body_type || "Noma'lum" },
    { icon: IoSpeedometer, label: 'Dvigatel', value: car.engine_volume ? `${car.engine_volume} L` : "Noma'lum" },
    { icon: IoLocation, label: 'Shahar', value: car.city },
  ].filter(spec => spec.value && spec.value !== "Noma'lum");

  return (
    <div className="page-container pb-24 lg:pb-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">Bosh sahifa</Link>
        <span>/</span>
        <Link href="/cars" className="hover:text-primary-600">E'lonlar</Link>
        <span>/</span>
        <span className="text-gray-900">{car.brand} {car.model}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="card overflow-hidden">
            {images.length > 0 ? (
              <>
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={images[selectedImageIndex]?.url}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white"
                      >
                        <IoChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => setSelectedImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white"
                      >
                        <IoChevronRight size={20} />
                      </button>
                    </>
                  )}
                  <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 text-white text-sm rounded-full">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? 'border-primary-500'
                            : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`Rasm ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <IoCarSport className="mx-auto text-gray-300 mb-2" size={64} />
                  <p className="text-gray-500">Rasm yo'q</p>
                </div>
              </div>
            )}
          </div>

          {/* Title and Price */}
          <div className="card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {car.brand} {car.model} {car.year}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <IoEye size={14} />
                    {car.views} marta ko'rildi
                  </span>
                  <span className="flex items-center gap-1">
                    <IoTime size={14} />
                    {formatDate(car.created_at)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary-600">
                  {formatPrice(car.price)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleFavoriteToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
                  isFavorite
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {isFavorite ? <IoHeart size={18} /> : <IoHeartOutline size={18} />}
                {isFavorite ? "Sevimlilar" : "Sevimlilar"}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <IoShare size={18} />
                Ulashish
              </button>
            </div>
          </div>

          {/* Specifications */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Texnik xususiyatlari</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {specs.map((spec, index) => {
                const Icon = spec.icon;
                return (
                  <div key={index} className="text-center p-3 bg-gray-50 rounded-xl">
                    <Icon className="mx-auto text-gray-400 mb-1" size={20} />
                    <p className="text-xs text-gray-500">{spec.label}</p>
                    <p className="font-medium text-gray-900 text-sm">{spec.value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description */}
          {car.description && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tavsif</h2>
              <div className={`text-gray-600 whitespace-pre-wrap ${!showFullDescription ? 'line-clamp-4' : ''}`}>
                {car.description}
              </div>
              {car.description.length > 200 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2"
                >
                  {showFullDescription ? 'Kamroq' : "Batafsil ko'rish"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Seller Card */}
          <div className="card p-6 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Sotuvchi</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                {seller?.avatar_url ? (
                  <img
                    src={seller.avatar_url}
                    alt={seller.full_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold text-primary-700">
                    {seller?.full_name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <div>
                <Link
                  href={`/profile/${seller?.id}`}
                  className="font-medium text-gray-900 hover:text-primary-600"
                >
                  {seller?.full_name || "Noma'lum"}
                </Link>
                <p className="text-sm text-gray-500">
                  {seller?.created_at ? `A'zo: ${formatDate(seller.created_at)}` : ''}
                </p>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="space-y-3">
              {seller?.phone && (
                <a
                  href={`tel:${seller.phone}`}
                  className="flex items-center justify-center gap-2 w-full btn-primary"
                >
                  <IoCall size={18} />
                  Qo'ng'iroq qilish
                </a>
              )}
              <Link
                href={`/profile/${seller?.id}`}
                className="flex items-center justify-center gap-2 w-full btn-secondary"
              >
                <IoPerson size={18} />
                Profilini ko'rish
              </Link>
            </div>

            {/* Safety Tips */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
              <h4 className="font-medium text-yellow-800 mb-2">Xavfsizlik maslahatlari</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Mashinani ko'rishdan oldin telefonda gaplashing</li>
                <li>• Pulni naqd yoki bank orqali to'lang</li>
                <li>• Shartnoma tuzing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
