import { useState } from 'react';
import { api } from '@/services/api';
import { Professional } from '@/types/types';

export function useFetchProfissionais() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Professional[]>([]);
  const [error, setError] = useState('');

  const fetchBySpecialty = async (specialty: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get<Professional[]>('/users');

      const filtrados = response.data.filter(
        (user): user is Professional =>
          user.role === 'profissional' &&
          !!user.specialty &&
          user.specialty.toLowerCase() === specialty.toLowerCase()
      );

      setData(filtrados);
    } catch {
      setError('Erro ao buscar profissionais.');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchBySpecialty };
}
