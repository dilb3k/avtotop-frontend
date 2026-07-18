'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/api';
import { Category } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import toast from 'react-hot-toast';
import { IoCarSport, IoImage, IoTrash } from 'react-icons/io5';

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

export default function CreateCarPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand: '',
    model: '',
    year: new Date().getFullYear().toString(),
    price: '',
    category_id: '',
    fuel_type: '',
    transmission: '',
    body_type: '',
    color: '',
    engine_volume: '',
    mileage: '',
    city: '',
  });
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.get<Category[]>('/categories');
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddImage = () => {
    const url = prompt("Rasm URL kiriting (masalan, Google Drive yoki boshqa manba):");
    if (url && url.trim()) {
      if (images.length >= 10) {
        toast.error("Ko'pi bilan 10 ta rasm qo'shish mumkin");
        return;
      }
      setImages([...images, url.trim()]);
      toast.success("Rasm qo'shildi");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.brand || !formData.model || !formData.price || !formData.city) {
      toast.error("Barcha majburiy maydonlarni to'ldiring");
      return;
    }

    if (Number(formData.price) <= 0) {
      toast.error("Narx 0 dan katta bo'lishi kerak");
      return;
    }

    if (Number(formData.year) < 1950 || Number(formData.year) > new Date().getFullYear() + 1) {
      toast.error("Noto'g'ri yil");
      return;
    }

    setLoading(true);

    try {
      const carData = {
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

      await api.post('/cars', carData);
      toast.success("E'lon muvaffaqiyatli yaratildi!");
      router.push('/profile');
    } catch (error: any) {
      toast.error(error.message || "E'lon yaratishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="page-container flex justify-center py-20">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page-container max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Yangi e'lon qo'shish</h1>
        <p className="text-gray-600">Mashinangiz haqida ma'lumot kiriting</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Asosiy ma'lumotlar</h2>
          <div className="space-y-4">
            <Input
              label="Sarlavha *"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Masalan: Toyota Camry 2020"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Marka *"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Toyota"
                required
              />
              <Input
                label="Model *"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Camry"
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
                placeholder="150000000"
                required
              />
            </div>

            <Input
              label="Shahar *"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Toshkent"
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
                placeholder="Oq"
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
                placeholder="2.0"
              />
              <Input
                label="Probeg (km)"
                name="mileage"
                type="number"
                value={formData.mileage}
                onChange={handleChange}
                placeholder="50000"
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
            placeholder="Mashina haqida batafsil ma'lumot..."
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
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary-500 text-white text-xs rounded">
                      Asosiy
                    </div>
                  )}
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
            <IoImage className="mr-2" size={18} />
            Rasm qo'shish
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Rasm URL manzilini kiriting (Google Drive, Imgur va boshqalar)
          </p>
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
            loading={loading}
            className="flex-1"
          >
            <IoCarSport className="mr-2" size={18} />
            E'lon joylashtirish
          </Button>
        </div>
      </form>
    </div>
  );
}
