'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Car, SearchFilters } from '@/types';

interface UseCarsResult {
  cars: Car[];
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCars(initialFilters: SearchFilters = {}) {
  const [filters, setFilters] = useState<SearchFilters>({
    page: 1,
    limit: 12,
    ...initialFilters,
  });

  useEffect(() => {
    setFilters(prev => {
      const updated = { ...initialFilters, page: prev.page, limit: prev.limit };
      if (JSON.stringify(updated) !== JSON.stringify(prev)) {
        return updated;
      }
      return prev;
    });
  }, [initialFilters.category_id, initialFilters.brand, initialFilters.search]);
  const [result, setResult] = useState<UseCarsResult>({
    cars: [],
    total: 0,
    totalPages: 0,
    loading: true,
    error: null,
    refetch: () => {},
  });

  const fetchCars = useCallback(async () => {
    try {
      setResult(prev => ({ ...prev, loading: true, error: null }));

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const data = await api.get<{
        cars: Car[];
        total: number;
        total_pages: number;
      }>(`/cars?${params.toString()}`);

      setResult({
        cars: data.cars || [],
        total: data.total || 0,
        totalPages: data.total_pages || 0,
        loading: false,
        error: null,
        refetch: fetchCars,
      });
    } catch (error: any) {
      setResult(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Xatolik yuz berdi',
        refetch: fetchCars,
      }));
    }
  }, [filters]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const setPage = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return {
    ...result,
    filters,
    updateFilters,
    setPage,
  };
}

export function useCar(id: string | null) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchCar = async () => {
      try {
        setLoading(true);
        const data = await api.get<Car>(`/cars/${id}`);
        setCar(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  return { car, loading, error };
}
