'use client';

import { useState, useRef } from 'react';
import { api } from '@/lib/api';
import Button from './Button';
import toast from 'react-hot-toast';
import { IoCloudUpload, IoClose, IoReorderTwo } from 'react-icons/io5';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ images, onChange, maxImages = 10 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    try {
      const oversized = fileArray.filter(f => f.size > 5 * 1024 * 1024);
      if (oversized.length > 0) {
        toast.error(`${oversized.map(f => f.name).join(', ')} hajmi 5MB dan katta`);
        const validFiles = fileArray.filter(f => f.size <= 5 * 1024 * 1024);
        if (validFiles.length === 0) {
          setUploading(false);
          return;
        }
      }

      const { urls } = await api.uploadImages(fileArray.filter(f => f.size <= 5 * 1024 * 1024));
      onChange([...images, ...urls]);
      toast.success(`${urls.length} ta rasm yuklandi`);
    } catch (error: any) {
      toast.error(error.message || 'Rasm yuklashda xatolik');
    } finally {
      setUploading(false);
    }
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
    onChange(images.filter((_, i) => i !== index));
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
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200" />
              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary-500 text-white text-xs rounded-lg font-medium">
                  Asosiy
                </div>
              )}
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
              <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/50 text-white text-xs rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200
            ${uploading ? 'cursor-wait' : 'cursor-pointer'}
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
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-primary-100">
                <div className="w-6 h-6 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Yuklanmoqda...</p>
                <p className="text-xs text-gray-500 mt-1">Rasmlar saqlanmoqda</p>
              </div>
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

      {images.length >= maxImages && (
        <p className="text-sm text-amber-600 bg-amber-50 rounded-xl p-3 text-center">
          Maksimal {maxImages} ta rasm yuklangan
        </p>
      )}
    </div>
  );
}
