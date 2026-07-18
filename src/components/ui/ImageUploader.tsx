'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import Button from './Button';
import toast from 'react-hot-toast';
import { IoImage, IoTrash, IoCloudUpload, IoClose, IoReorderTwo } from 'react-icons/io5';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ images, onChange, maxImages = 10 }: ImageUploaderProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const filePath = `cars/${user.id}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

    const { error } = await supabase.storage
      .from('car-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data } = supabase.storage.from('car-images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));

    if (fileArray.length === 0) {
      toast.error("Faqat rasm fayllarni yuklash mumkin");
      return;
    }

    if (images.length + fileArray.length > maxImages) {
      toast.error(`Ko'pi bilan ${maxImages} ta rasm yuklash mumkin`);
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];
    let failed = 0;

    for (const file of fileArray) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} hajmi 5MB dan katta`);
        failed++;
        continue;
      }

      const url = await uploadFile(file);
      if (url) {
        uploadedUrls.push(url);
      } else {
        failed++;
      }
    }

    if (uploadedUrls.length > 0) {
      onChange([...images, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} ta rasm yuklandi`);
    }

    if (failed > 0) {
      toast.error(`${failed} ta rasm yuklashda xatolik`);
    }

    setUploading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    const [moved] = newImages.splice(index, 1);
    newImages.unshift(moved);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Uploaded images preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
              <img
                src={url}
                alt={`Rasm ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50%" x="50%" text-anchor="middle" dy=".3em" font-size="30">🖼️</text></svg>';
                }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200" />
              {/* Primary badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary-500 text-white text-xs rounded-lg font-medium">
                  Asosiy
                </div>
              )}
              {/* Action buttons */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(index)}
                    className="p-1.5 bg-white/90 hover:bg-white text-gray-700 rounded-lg text-xs font-medium"
                    title="Asosiy qilish"
                  >
                    <IoReorderTwo size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  title="O'chirish"
                >
                  <IoClose size={14} />
                </button>
              </div>
              {/* Index number */}
              <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/50 text-white text-xs rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone / Upload area */}
      {images.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200
            ${dragOver
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={handleInputChange}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="spinner" />
              <p className="text-sm text-gray-600">Yuklanmoqda...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className={`
                w-14 h-14 rounded-2xl flex items-center justify-center transition-colors
                ${dragOver ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'}
              `}>
                <IoCloudUpload size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Rasm tashlang yoki bosing
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPEG, PNG, WebP yoki GIF — maks. 5MB
                </p>
              </div>
              <p className="text-xs text-gray-400">
                {images.length}/{maxImages} rasm yuklangan
              </p>
            </div>
          )}
        </div>
      )}

      {/* Max images reached */}
      {images.length >= maxImages && (
        <p className="text-sm text-amber-600 bg-amber-50 rounded-xl p-3 text-center">
          Maksimal {maxImages} ta rasm yuklangan
        </p>
      )}
    </div>
  );
}
