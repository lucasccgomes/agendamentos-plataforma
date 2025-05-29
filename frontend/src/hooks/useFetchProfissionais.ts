import { useState } from 'react';
import { api } from '@/services/api';

export function useFetchProfissionais() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  const fetchByEspecialidade = async (especialidade: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/users');
      const filtrados = res.data.filter(
        (u: any) => u.role === 'profissional' && u.especialidade.toLowerCase() === especialidade.toLowerCase()
      );
      setData(filtrados);
    } catch {
      setError('Erro ao buscar profissionais.');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchByEspecialidade };
}