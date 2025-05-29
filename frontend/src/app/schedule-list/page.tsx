'use client';

import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Notification from '../../components/Notification';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiEdit, FiTrash2, FiCheck, FiX, FiArrowLeft, FiList } from 'react-icons/fi';
import FadeInItem from '@/components/FadeInItem';
import AvailabilityBadge from '@/components/AvailabilityBadge';
import type { Schedule } from '@/types/types';

const ScheduleList = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const fetchSchedules = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get('/schedules');
      const mySchedules = res.data.filter((s: Schedule) => s.professional.id === user.id);
      setSchedules(mySchedules);
      setFilteredSchedules(mySchedules);
    } catch {
      setMessage('Erro ao carregar horários. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchSchedules();
  }, [user]);

  useEffect(() => {
    if (schedules.length > 0) {
      let filtered = [...schedules];

      if (filterDate) {
        filtered = filtered.filter(s => s.date === filterDate);
      }

      if (filterStatus !== 'all') {
        const isAvailable = filterStatus === 'available';
        filtered = filtered.filter(s => s.available === isAvailable);
      }

      setFilteredSchedules(filtered);
    }
  }, [filterDate, filterStatus, schedules]);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/schedules/${id}`);
      setMessage('Horário excluído com sucesso!');
      setConfirmDelete(null);
      fetchSchedules();
    } catch {
      setMessage('Erro ao excluir horário.');
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingId(schedule.id);
    setEditDate(schedule.date);
    setEditTime(schedule.time);
  };

  const handleUpdate = async (id: number) => {
    try {
      await api.patch(`/schedules/${id}`, {
        date: editDate,
        time: editTime
      });
      setMessage('Horário atualizado com sucesso!');
      setEditingId(null);
      fetchSchedules();
    } catch {
      setMessage('Erro ao atualizar horário.');
    }
  };

  const formatDate = (dataString: string) => {
    try {
      const date = new Date(dataString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dataString;
    }
  }; 

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Meus Horários</h1>
          <p className="opacity-90">Gerencie seus horários disponíveis para agendamento</p>
        </div>
      </div>
      
      <motion.div 
        className="p-6 max-w-6xl mx-auto -mt-6"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Coluna lateral - Filtros e Ações */}
          <div className="lg:col-span-1 space-y-6">
            <FadeInItem>
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FiList className="mr-2 text-blue-600" /> Filtros
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Data</label>
                    <Input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      leftIcon={<FiCalendar className="text-gray-400" />}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Status</label>
                    <select
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="todos">Todos</option>
                      <option value="disponivel">Disponíveis</option>
                      <option value="ocupado">Ocupados</option>
                    </select>
                  </div>
                  
                  <Button 
                    className="w-full bg-red-500 border border-gray-300 text-gray-700 hover:bg-red-600 mt-2"
                    onClick={() => {
                      setFilterDate('');
                      setFilterStatus('todos');
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </Card>
            </FadeInItem>
            
            <FadeInItem delay={0.1}>
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FiCalendar className="mr-2 text-blue-600" /> Ações
                </h3>
                
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
                    onClick={() => router.push('/register-schedules')}
                  >
                    <FiCalendar className="mr-2" /> Novo Horário
                  </Button>
                  
                  <Button 
                    className="w-full bg-gray-500 border border-gray-300 text-gray-700 hover:bg-gray-600 flex items-center justify-center"
                    onClick={() => router.push('/dashboard')}
                  >
                    <FiArrowLeft className="mr-2" /> Dashboard
                  </Button>
                </div>
              </Card>
            </FadeInItem>
            
            <FadeInItem delay={0.2}>
              <Card>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Resumo
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total</span>
                    <span className="font-semibold">{schedules.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Disponíveis</span>
                    <span className="font-semibold">{schedules.filter(h => h.available).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ocupados</span>
                    <span className="font-semibold">{schedules.filter(h => !h.available).length}</span>
                  </div>
                </div>
              </Card>
            </FadeInItem>
          </div>
          
          {/* Coluna principal - Lista de Horários */}
          <div className="lg:col-span-3 space-y-6">
            <FadeInItem delay={0.3}>
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Lista de Horários</h2>
                  {message && <Notification message={message} type={message.includes('sucesso') ? 'success' : 'error'} />}
                </div>

                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse flex p-4 border border-gray-100 rounded-lg">
                        <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredSchedules.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <FiCalendar className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-gray-500">Nenhum horário encontrado.</p>
                    <Button 
                      className="mt-4 bg-blue-600 hover:bg-blue-700"
                      onClick={() => router.push('/register-schedules')}
                    >
                      Cadastrar Novo Horário
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredSchedules.map((horario, index) => (
                      <motion.div 
                        key={horario.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
                      >
                        {editingId === horario.id ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <Input
                                label="Data"
                                type="date"
                                value={editDate}
                                onChange={(e) => setEditDate(e.target.value)}
                                leftIcon={<FiCalendar className="text-gray-400" />}
                              />
                              <Input
                                label="Hora"
                                type="time"
                                value={editTime}
                                onChange={(e) => setEditTime(e.target.value)}
                                leftIcon={<FiClock className="text-gray-400" />}
                              />
                            </div>
                            <div className="flex gap-2 justify-end">
                              <Button 
                                onClick={() => handleUpdate(horario.id)}
                                className="bg-blue-600 hover:bg-blue-700 flex items-center"
                              >
                                <FiCheck className="mr-2" /> Salvar
                              </Button>
                              <Button 
                                onClick={() => setEditingId(null)}
                                className="bg-gray-500 hover:bg-gray-600 flex items-center"
                              >
                                <FiX className="mr-2" /> Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div className="flex items-start">
                              <div className="bg-blue-100 p-3 rounded-full mr-4">
                                <FiClock className="text-blue-600" />
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <FiCalendar className="mr-2 text-gray-500" />
                                  <span className="font-medium">{formatDate(horario.date)}</span>
                                  <span className="mx-2">•</span>
                                  <FiClock className="mr-2 text-gray-500" />
                                  <span>{horario.time}</span>
                                </div>
                                <div className="mt-2">
                                <AvailabilityBadge available={horario.available}  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              {confirmDelete === horario.id ? (
                                <div className="flex items-center space-x-2 bg-red-50 p-2 rounded-lg">
                                  <span className="text-sm text-red-600">Confirmar?</span>
                                  <Button 
                                    onClick={() => handleDelete(horario.id)}
                                    className="bg-red-500 hover:bg-red-600 !py-1 !px-2 flex items-center"
                                  >
                                    <FiCheck className="mr-1" /> Sim
                                  </Button>
                                  <Button 
                                    onClick={() => setConfirmDelete(null)}
                                    className="bg-gray-500 hover:bg-gray-600 !py-1 !px-2 flex items-center"
                                  >
                                    <FiX className="mr-1" /> Não
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <Button
                                    onClick={() => handleEdit(horario)}
                                    disabled={!horario.available}
                                    className={`flex items-center ${horario.available ? 'bg-blue-600 hover:bg-blue-700' : 'opacity-50 cursor-not-allowed bg-gray-400'}`}
                                  >
                                    <FiEdit className="mr-1" /> Editar
                                  </Button>
                                  <Button
                                    onClick={() => setConfirmDelete(horario.id)}
                                    disabled={!horario.available}
                                    className={`flex items-center ${horario.available? 'bg-red-500 hover:bg-red-600' : 'opacity-50 cursor-not-allowed bg-gray-400'}`}
                                  >
                                    <FiTrash2 className="mr-1" /> Excluir
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </Card>
            </FadeInItem>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ScheduleList;
