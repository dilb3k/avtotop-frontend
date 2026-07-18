'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/api';
import { Car } from '@/types';
import CarCard from '@/components/car/CarCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { PageLoading } from '@/components/ui/Loading';
import toast from 'react-hot-toast';
import {
  IoPerson, IoMail, IoCall, IoLocation, IoCalendar,
  IoCarSport, IoEye, IoHeart, IoAdd, IoSettings, IoLogOut, IoTrash
} from 'react-icons/io5';

export default function ProfilePage() {
  const { user, profile, loading: authLoading, signOut, updateProfile, refreshUser } = useAuth();
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    city: '',
    description: '',
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        city: profile.city || '',
        description: profile.description || '',
      });
    }
  }, [profile]);

  const fetchMyCars = async () => {
    try {
      const data = await api.get<Car[]>('/cars/my/listings');
      setCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyCars();
    }
  }, [isAuthenticated]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProfile(formData);
      await refreshUser();
      toast.success("Profil yangilandi!");
      setEditMode(false);
    } catch (error: any) {
      toast.error(error.message || 'Xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCar = async (carId: string) => {
    if (!confirm("E'lonni o'chirmoqchimisiz? Bu amal bekor qilib bo'lmaydi.")) return;

    try {
      await api.delete(`/cars/${carId}`);
      setCars(cars.filter(car => car.id !== carId));
      toast.success("E'lon o'chirildi");
    } catch (error: any) {
      toast.error(error.message || 'Xatolik yuz berdi');
    }
  };

  const handleStatusChange = async (carId: string, status: string) => {
    try {
      await api.put(`/cars/${carId}`, { status });
      fetchMyCars();
      toast.success("E'lon holati yangilandi");
    } catch (error: any) {
      toast.error(error.message || 'Xatolik yuz berdi');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (authLoading) return <PageLoading />;

  if (!user || !profile) return null;

  const stats = {
    total: cars.length,
    active: cars.filter(c => c.status === 'active').length,
    sold: cars.filter(c => c.status === 'sold').length,
    totalViews: cars.reduce((sum, car) => sum + (car.views || 0), 0),
  };

  return (
    <div className="page-container page-transition">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-20 h-20 rounded-2xl object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-white">
                  {profile.full_name?.charAt(0) || 'U'}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{profile.full_name}</h1>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <IoMail size={14} />
                      {profile.email}
                    </span>
                    {profile.phone && (
                      <span className="flex items-center gap-1">
                        <IoCall size={14} />
                        {profile.phone}
                      </span>
                    )}
                    {profile.city && (
                      <span className="flex items-center gap-1">
                        <IoLocation size={14} />
                        {profile.city}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <IoCalendar size={14} />
                      A'zo: {new Date(profile.created_at).toLocaleDateString('uz-UZ')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditMode(!editMode)}
                  >
                    <IoSettings className="mr-1" size={16} />
                    {editMode ? 'Bekor' : 'Tahrirlash'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <IoLogOut size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          {editMode && (
            <form onSubmit={handleUpdateProfile} className="mt-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="To'liq ism"
                  name="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
                <Input
                  label="Telefon"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+998 90 123 45 67"
                />
                <Input
                  label="Shahar"
                  name="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Toshkent"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  O'zingiz haqida
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Qisqacha o'zingiz haqida..."
                />
              </div>
              <div className="mt-4 flex gap-2">
                <Button type="submit" loading={saving} size="sm">
                  Saqlash
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditMode(false)}>
                  Bekor qilish
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card p-4 text-center">
            <IoCarSport className="mx-auto text-primary-500 mb-1" size={24} />
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500">Jami e'lonlar</div>
          </div>
          <div className="card p-4 text-center">
            <IoCarSport className="mx-auto text-green-500 mb-1" size={24} />
            <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
            <div className="text-sm text-gray-500">Faol e'lonlar</div>
          </div>
          <div className="card p-4 text-center">
            <IoCarSport className="mx-auto text-yellow-500 mb-1" size={24} />
            <div className="text-2xl font-bold text-gray-900">{stats.sold}</div>
            <div className="text-sm text-gray-500">Sotilgan</div>
          </div>
          <div className="card p-4 text-center">
            <IoEye className="mx-auto text-blue-500 mb-1" size={24} />
            <div className="text-2xl font-bold text-gray-900">{stats.totalViews}</div>
            <div className="text-sm text-gray-500">Ko'rishlar</div>
          </div>
        </div>

        {/* My Cars */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Mening e'lonlarim
            </h2>
            <Link href="/create" className="btn-primary">
              <IoAdd className="mr-1" size={18} />
              Yangi e'lon
            </Link>
          </div>

          {loading ? (
            <PageLoading />
          ) : cars.length === 0 ? (
            <div className="card p-12 text-center">
              <IoCarSport className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Hali e'lonlaringiz yo'q</h3>
              <p className="text-gray-500 mb-4">Birinchi e'loningizni yarating</p>
              <Link href="/create" className="btn-primary inline-flex">
                <IoAdd className="mr-1" size={18} />
                E'lon qo'shish
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cars.map((car) => (
                <div key={car.id} className="relative">
                  <CarCard car={car} />
                  <div className="absolute top-3 right-3 flex gap-1 z-10">
                    <Link
                      href={`/edit/${car.id}`}
                      className="p-2 bg-white/90 rounded-lg shadow-sm hover:bg-white text-gray-600"
                      title="Tahrirlash"
                    >
                      <IoSettings size={14} />
                    </Link>
                    <button
                      onClick={() => handleStatusChange(car.id, car.status === 'active' ? 'sold' : 'active')}
                      className="p-2 bg-white/90 rounded-lg shadow-sm hover:bg-white text-gray-600"
                      title={car.status === 'active' ? "Sotilgan deb belgilash" : "Faollashtirish"}
                    >
                      {car.status === 'active' ? '✅' : '🔄'}
                    </button>
                    <button
                      onClick={() => handleDeleteCar(car.id)}
                      className="p-2 bg-white/90 rounded-lg shadow-sm hover:bg-red-50 text-red-500"
                      title="O'chirish"
                    >
                      <IoTrash size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
