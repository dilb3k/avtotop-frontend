'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/api';
import { Category } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import PriceInput from '@/components/ui/PriceInput';
import MileageInput from '@/components/ui/MileageInput';
import CitySelect from '@/components/ui/CitySelect';
import ImageUploader from '@/components/ui/ImageUploader';
import toast from 'react-hot-toast';
import {
  IoCarSport, IoArrowForward, IoArrowBack,
  IoCheckmark, IoColorFill, IoSpeedometer
} from 'react-icons/io5';

const FUEL_TYPES = [
  { value: 'benzin', label: 'Benzin' },
  { value: 'dizel', label: 'Dizel' },
  { value: 'gaz', label: 'Gaz' },
  { value: 'elektro', label: 'Elektro' },
  { value: 'gibrid', label: 'Gibrid' },
];

const TRANSMISSIONS = [
  { value: 'avtomat', label: "Avtomatik" },
  { value: 'mexanik', label: "Mexanik" },
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

const COLORS = [
  'Oq', 'Qora', 'Kumush', 'Qizil', 'Ko\'k', 'Yashil',
  'Sariq', 'Jigarrang', 'To\'q ko\'k', 'Kulrang', 'Bej', 'Binafsha'
];

export default function CreateCarPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand: '',
    model: '',
    year: new Date().getFullYear().toString(),
    price: 0,
    category_id: '',
    fuel_type: '',
    transmission: '',
    body_type: '',
    color: '',
    engine_volume: '',
    mileage: 0,
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

  const handleSubmit = async () => {
    if (!formData.brand || !formData.model || !formData.price || !formData.city) {
      toast.error("Marka, model, narx va shahar majburiy");
      return;
    }

    if (formData.price <= 0) {
      toast.error("Narx 0 dan katta bo'lishi kerak");
      return;
    }

    setLoading(true);

    try {
      const title = `${formData.brand} ${formData.model} ${formData.year}`;
      const carData = {
        title,
        brand: formData.brand,
        model: formData.model,
        year: Number(formData.year),
        price: formData.price,
        city: formData.city,
        category_id: formData.category_id || null,
        fuel_type: formData.fuel_type || null,
        transmission: formData.transmission || null,
        body_type: formData.body_type || null,
        color: formData.color || null,
        engine_volume: formData.engine_volume ? Number(formData.engine_volume) : null,
        mileage: formData.mileage || null,
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
      <div className="flex justify-center py-20">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Step indicator */}
      <div className="border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= s
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {step > s ? <IoCheckmark size={16} /> : s}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${
                step >= s ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {s === 1 ? "Ma'lumotlar" : s === 2 ? "Texnikasi" : "Rasmlar"}
              </span>
              {s < 3 && <div className={`w-12 h-0.5 mx-2 ${step > s ? 'bg-primary-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Basic info */}
      {step === 1 && (
        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Asosiy ma'lumotlar</h2>
            <p className="text-sm text-gray-500">Mashinangiz haqida batafsil ma'lumot kiriting</p>
          </div>

          {/* Brand + Model */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Marka *</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Toyota"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Model *</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Camry"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Auto-generated title preview */}
          {(formData.brand || formData.model) && (
            <div className="bg-primary-50 rounded-xl p-3 flex items-center gap-2">
              <IoCarSport className="text-primary-500" size={18} />
              <span className="text-sm text-primary-700">
                {formData.brand} {formData.model} {formData.year}
              </span>
            </div>
          )}

          {/* Year + Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Yil *</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="1950"
                max={new Date().getFullYear() + 1}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all"
              />
            </div>
            <PriceInput
              label="Narx *"
              value={formData.price}
              onChange={(val) => setFormData({ ...formData, price: val })}
              placeholder="0"
            />
          </div>

          {/* City */}
          <CitySelect
            label="Shahar *"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tavsif <span className="text-gray-400">(ixtiyoriy)</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all placeholder:text-gray-400 resize-none"
              placeholder="Mashina haqida qisqacha ma'lumot..."
            />
          </div>

          {/* Next */}
          <div className="flex justify-end pt-2">
            <Button onClick={() => {
              if (!formData.brand || !formData.model || !formData.price || !formData.city) {
                toast.error("Marka, model, narx va shaharni to'ldiring");
                return;
              }
              setStep(2);
            }}>
              Keyingi
              <IoArrowForward className="ml-2" size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Technical specs */}
      {step === 2 && (
        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Texnik xususiyatlar</h2>
            <p className="text-sm text-gray-500">Qo'shimcha ma'lumotlarni kiriting</p>
          </div>

          {/* Category */}
          <Select
            label="Kategoriya"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            options={categories.map(cat => ({ value: cat.id, label: `${cat.icon} ${cat.name}` }))}
            placeholder="Tanlang"
          />

          {/* Fuel + Transmission */}
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

          {/* Body type + Color */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Karobka turi"
              name="body_type"
              value={formData.body_type}
              onChange={handleChange}
              options={BODY_TYPES}
              placeholder="Tanlang"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <IoColorFill size={14} className="inline mr-1" />
                Rang
              </label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: c })}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      formData.color === c
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Engine + Mileage */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <IoSpeedometer size={14} className="inline mr-1" />
                Dvigatel hajmi (l)
              </label>
              <input
                type="number"
                name="engine_volume"
                step="0.1"
                value={formData.engine_volume}
                onChange={handleChange}
                placeholder="2.0"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all placeholder:text-gray-400"
              />
            </div>
            <MileageInput
              label="Probeg"
              value={formData.mileage}
              onChange={(val) => setFormData({ ...formData, mileage: val })}
              placeholder="0"
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-2">
            <Button variant="secondary" onClick={() => setStep(1)}>
              <IoArrowBack className="mr-2" size={16} />
              Orqaga
            </Button>
            <Button onClick={() => setStep(3)}>
              Keyingi
              <IoArrowForward className="ml-2" size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Images */}
      {step === 3 && (
        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Rasmlar</h2>
            <p className="text-sm text-gray-500">Mashinangiz rasmlarini yuklang (ixtiyoriy, maks. 10 ta)</p>
          </div>

          <ImageUploader images={images} onChange={setImages} />

          {/* Summary before submit */}
          <div className="bg-gray-50 rounded-xl p-4 mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">E'lon xulosasi:</h4>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="bg-white px-3 py-1 rounded-lg border border-gray-200">
                🚗 {formData.brand} {formData.model} {formData.year}
              </span>
              <span className="bg-white px-3 py-1 rounded-lg border border-gray-200">
                💰 {formData.price > 0 ? new Intl.NumberFormat('uz-UZ').format(formData.price) + " so'm" : "Ko'rsatilmagan"}
              </span>
              <span className="bg-white px-3 py-1 rounded-lg border border-gray-200">
                📍 {formData.city || "Ko'rsatilmagan"}
              </span>
              {formData.fuel_type && (
                <span className="bg-white px-3 py-1 rounded-lg border border-gray-200">
                  ⛽ {formData.fuel_type}
                </span>
              )}
              {formData.transmission && (
                <span className="bg-white px-3 py-1 rounded-lg border border-gray-200">
                  ⚙️ {formData.transmission}
                </span>
              )}
              {images.length > 0 && (
                <span className="bg-white px-3 py-1 rounded-lg border border-gray-200">
                  🖼 {images.length} ta rasm
                </span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-2">
            <Button variant="secondary" onClick={() => setStep(2)}>
              <IoArrowBack className="mr-2" size={16} />
              Orqaga
            </Button>
            <Button onClick={handleSubmit} loading={loading}>
              <IoCheckmark className="mr-2" size={18} />
              E'lon joylashtirish
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
