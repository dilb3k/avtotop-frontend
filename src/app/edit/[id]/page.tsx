'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/api';
import { Car, Category } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { PageLoading } from '@/components/ui/Loading';
import toast from 'react-hot-toast';
import { IoSave, IoArrowBack, IoTrash } from 'react-icons/io5';

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

export default function EditCarPage() {
  const params = useParams();
  const id = params?.id as string;
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand: '',
    model: '',
    year: '',
    price: '',
    category_id: '',
    fuel_type: '',
    transmission: '',
    body_type: '',
    color: '',
    engine_volume: '',
    mileage: '',
    city: '',
    status: 'active',
  });
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carData, catsData] = await Promise.all([
          api.get<Car>(`/cars/${id}`),
          api.get<Category[]>('/categories'),
        ]);

        // Check ownership
        if (carData.seller_id !== user?.id && user?.role !== 'admin') {
          toast.error("Bu e'lonni tahrirlashga ruxsatingiz yo'q");
          router.push('/profile');
          return;
        }

        setFormData({
          title: carData.title || '',
          description: carData.description || '',
          brand: carData.brand || '',
          model: carData.model || '',
          year: carData.year?.toString() || '',
          price: carData.price?.toString() || '',
          category_id: carData.category_id || '',
          fuel_type: carData.fuel_type || '',
          transmission: carData.transmission || '',
          body_type: carData.body_type || '',
          color: carData.color || '',
          engine_volume: carData.engine_volume?.toString() || '',
          mileage: carData.mileage?.toString() || '',
          city: carData.city || '',
          status: carData.status || 'active',
        });
        setImages(carData.car_images?.map(img => img.url) || []);
        setCategories(catsData || []);
      } catch (error: any) {
        toast.error("E'lonni yuklashda xatolik");
        router.push('/profile');
      } finally {
        setLoading(false);
      }
    };

    if (id && isAuthenticated) {
      fetchData();
    }
  }, [id, isAuthenticated, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddImage = () => {
    const url = prompt("Rasm URL kiriting:");
    if (url && url.trim()) {
      if (images.length >= 10) {
        toast.error("Ko'pi bilan 10 ta rasm qo'shish mumkin");
        return;
      }
      setImages([...images, url.trim()]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.brand || !formData.model || !formData.price || !formData.city) {
      toast.error("Barcha majburiy maydonlarni to'ldiring");
      return;
    }

    setSaving(true);

    try {
      const updateData = {
        ...formData,
        year: Number(formData.year),
        price: Number(formData.price),
        engine_volume: formData.engine_volume ? Number(formData.engine_volume) : null,
        mileage: formData.mileage ? Number(formData.mileage) : null,
        category_id: formData.category_id || null,
        fuel_type: formData.fuel_type || null,
        transmission: formData.transmission || null,
        body_type: formData.body_type || null,
        color: formData.color || null,
        description: formData.description || null,
        images,
      };

      await api.put(`/cars/${id}`, updateData);
      toast.success("E'lon yangilandi!");
      router.push('/profile');
    } catch (error: any) {
      toast.error(error.message || "E'lonni yangilashda xatolik");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) return <PageLoading />;

  return (
    <div className="page-container max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">E'lonni tahrirlash</h1>
        <Link href="/profile" className="btn-secondary">
          <IoArrowBack className="mr-1" size={18} />
          Orqaga
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Status */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">E'lon holati</h2>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'active', label: 'Faol' },
              { value: 'sold', label: 'Sotilgan' },
              { value: 'inactive', label: 'Nofaol' },
            ]}
          />
        </div>

        {/* Basic Info */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Asosiy ma'lumotlar</h2>
          <div className="space-y-4">
            <Input
              label="Sarlavha *"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Marka *"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
              />
              <Input
                label="Model *"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Yil *"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                min="1950"
                max={new Date().getFullYear() + 1}
                required
              />
              <Input
                label="Narx (so'm) *"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="Shahar *"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Technical Specs */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Texnik xususiyatlari</h2>
          <div className="space-y-4">
            <Select
              label="Kategoriya"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
              placeholder="Tanlang"
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Yoqilg'i turi"
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleChange}
                options={FUEL_TYPES}
                placeholder="Tanlang"
              />
              <Select
                label="Uzatma qutisi"
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                options={TRANSMISSIONS}
                placeholder="Tanlang"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Karobka turi"
                name="body_type"
                value={formData.body_type}
                onChange={handleChange}
                options={BODY_TYPES}
                placeholder="Tanlang"
              />
              <Input
                label="Rang"
                name="color"
                value={formData.color}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Dvigatel hajmi (l)"
                name="engine_volume"
                type="number"
                step="0.1"
                value={formData.engine_volume}
                onChange={handleChange}
              />
              <Input
                label="Probeg (km)"
                name="mileage"
                type="number"
                value={formData.mileage}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tavsif</h2>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="input-field resize-none"
          />
        </div>

        {/* Images */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rasmlar</h2>
          
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {images.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={url}
                    alt={`Rasm ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50%" x="50%" text-anchor="middle" dy=".3em" font-size="30">🖼️</text></svg>';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <IoTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button
            type="button"
            variant="secondary"
            onClick={handleAddImage}
            className="w-full"
          >
            Rasm qo'shish
          </Button>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pb-8">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            className="flex-1"
          >
            Bekor qilish
          </Button>
          <Button
            type="submit"
            loading={saving}
            className="flex-1"
          >
            <IoSave className="mr-2" size={18} />
            Saqlash
          </Button>
        </div>
      </form>
    </div>
  );
}
