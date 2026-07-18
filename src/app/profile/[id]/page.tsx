'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Car } from '@/types';
import CarCard from '@/components/car/CarCard';
import { PageLoading } from '@/components/ui/Loading';
import { IoCarSport, IoLocation, IoCalendar, IoCall, IoMail, IoChatbubble } from 'react-icons/io5';

interface SellerProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  city?: string;
  description?: string;
  role: string;
  created_at: string;
  cars: Car[];
  stats: { total_cars: number; active_cars: number };
}

export default function PublicProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phoneModal, setPhoneModal] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchProfile = async () => {
      try {
        const data = await api.get<SellerProfile>(`/users/${id}`);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'Profil topilmadi');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <PageLoading />;

  if (error || !profile) {
    return (
      <div className="page-container text-center py-20">
        <IoCarSport className="mx-auto text-gray-300 mb-4" size={80} />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profil topilmadi</h2>
        <p className="text-gray-500 mb-6">{error || "Bu foydalanuvchi mavjud emas"}</p>
        <Link href="/cars" className="btn-primary">E'lonlar ro'yxatiga qaytish</Link>
      </div>
    );
  }

  return (
    <div className="page-container page-transition">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-20 h-20 rounded-2xl object-cover" />
              ) : (
                <span className="text-3xl font-bold text-white">{profile.full_name?.charAt(0) || 'U'}</span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.full_name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                {profile.city && (
                  <span className="flex items-center gap-1"><IoLocation size={14} />{profile.city}</span>
                )}
                <span className="flex items-center gap-1"><IoCalendar size={14} />A'zo: {new Date(profile.created_at).toLocaleDateString('uz-UZ')}</span>
              </div>
            </div>
          </div>

          {profile.description && (
            <div className="mt-4 pt-4 border-t border-gray-100 text-gray-600 text-sm">{profile.description}</div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card p-4 text-center">
            <IoCarSport className="mx-auto text-primary-500 mb-1" size={24} />
            <div className="text-2xl font-bold text-gray-900">{profile.stats.total_cars}</div>
            <div className="text-sm text-gray-500">Jami e'lonlar</div>
          </div>
          <div className="card p-4 text-center">
            <IoCarSport className="mx-auto text-green-500 mb-1" size={24} />
            <div className="text-2xl font-bold text-gray-900">{profile.stats.active_cars}</div>
            <div className="text-sm text-gray-500">Faol e'lonlar</div>
          </div>
        </div>

        {/* Cars */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">E'lonlari ({profile.cars.length})</h2>
          {profile.cars.length === 0 ? (
            <div className="card p-12 text-center">
              <IoCarSport className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Hali e'lonlari yo'q</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
