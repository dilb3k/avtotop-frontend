const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Xatolik: ${response.status}`);
      }

      return data;
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error('Serverga ulanib bo\'lmadi. Internetga ulanishni tekshiring.');
      }
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  async uploadImage(file: File): Promise<{ url: string }> {
    const token = this.getToken();
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Rasmni yuklashda xatolik');
    }
    return data;
  }

  async uploadImages(files: File[]): Promise<{ urls: string[] }> {
    const token = this.getToken();
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    const response = await fetch(`${API_URL}/upload/multiple`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Rasmlarni yuklashda xatolik');
    }
    return data;
  }
}

export const api = new ApiClient();
