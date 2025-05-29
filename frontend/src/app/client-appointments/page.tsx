'use client';

import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Notification from '../../components/Notification';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiUser, FiDollarSign, FiPhone, FiInfo, FiArrowLeft, FiLogOut, FiCheckCircle, FiAlertCircle, FiXCircle } from 'react-icons/fi';
import FadeInItem from '@/components/FadeInItem';
import StatusBadge from '@/components/StatusBadge';
import type { Appointment } from '@/types/types';

const ClientAppointments = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [confirmCancel, setConfirmCancel] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);

  const fetchAppointments = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await api.get('/appointments');
      const allAppointments: Appointment[] = response.data;

      const filtered = user.role === 'profissional'
        ? allAppointments.filter(appt => appt.schedule.professional.id === user.id)
        : allAppointments.filter(appt => appt.client.id === user.id);

      setAppointments(filtered);
      applyFilters(filtered);
    } catch {
      setError('Erro ao carregar agendamentos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchAppointments();
  }, [user, router]);

  const applyFilters = (appts = appointments) => {
    if (filterStatus === 'todos') {
      setFilteredAppointments(appts);
    } else {
      setFilteredAppointments(appts.filter(appt =>
        appt.status.toLowerCase() === filterStatus.toLowerCase()
      ));
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filterStatus]);

  const handleCancel = async (appointmentId: number, scheduleId: number) => {
    if (!user) return;

    setLoading(true);
    try {
      await api.delete(`/appointments/${appointmentId}`);
      await api.patch(`/schedules/${scheduleId}`, { available: true });

      setMessage('Agendamento cancelado com sucesso!');
      setConfirmCancel(null);
      fetchAppointments();
    } catch {
      setError('Erro ao cancelar agendamento.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dataString: string) => {
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dataString;
    }
  };

  const stats = {
    total: appointments.length,
    confirmados: appointments.filter(a => a.status.toLowerCase() === 'confirmado').length,
    pendentes: appointments.filter(a => a.status.toLowerCase() === 'pendente').length,
    cancelados: appointments.filter(a => a.status.toLowerCase() === 'cancelado').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Meus Agendamentos</h1>
          <p className="opacity-90">Gerencie seus agendamentos e consultas</p>
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
                  <FiCalendar className="mr-2 text-blue-600" /> Filtros
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Status</label>
                    <select
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="todos">Todos</option>
                      <option value="confirmado">Confirmados</option>
                      <option value="pendente">Pendentes</option>
                      <option value="cancelado">Cancelados</option>
                    </select>
                  </div>

                  <Button
                    className="w-full bg-orange-400 border border-gray-300 text-gray-700 hover:bg-orange-500 mt-2"
                    onClick={() => setFilterStatus('todos')}
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
                    onClick={() => router.push('/schedule')}
                  >
                    <FiCalendar className="mr-2" /> Novo Agendamento
                  </Button>

                  <Button
                    className="w-full bg-gray-500 border border-gray-300 text-gray-700 hover:bg-gray-600 flex items-center justify-center"
                    onClick={() => router.push('/dashboard')}
                  >
                    <FiArrowLeft className="mr-2" /> Dashboard
                  </Button>

                  <Button
                    className="w-full bg-red-500 border border-red-300 text-red-700 hover:bg-red-600 flex items-center justify-center"
                    onClick={logout}
                  >
                    <FiLogOut className="mr-2" /> Sair
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
                    <span className="font-semibold">{stats.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <FiCheckCircle className="mr-2 text-green-500" /> Confirmados
                    </span>
                    <span className="font-semibold">{stats.confirmados}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <FiAlertCircle className="mr-2 text-yellow-500" /> Pendentes
                    </span>
                    <span className="font-semibold">{stats.pendentes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <FiXCircle className="mr-2 text-red-500" /> Cancelados
                    </span>
                    <span className="font-semibold">{stats.cancelados}</span>
                  </div>
                </div>
              </Card>
            </FadeInItem>
          </div>

          {/* Coluna principal - Lista de Agendamentos */}
          <div className="lg:col-span-3 space-y-6">
            <FadeInItem delay={0.3}>
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Lista de Agendamentos</h2>
                  {(message || error) && (
                    <Notification
                      message={message || error}
                      type={message ? 'success' : 'error'}
                    />
                  )}
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
                ) : filteredAppointments.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <FiCalendar className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-gray-500">Nenhum agendamento encontrado.</p>
                    <Button
                      className="mt-4 bg-blue-600 hover:bg-blue-700"
                      onClick={() => router.push('/schedule')}
                    >
                      Agendar Agora
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAppointments.map((appt, index) => (
                      <motion.div
                        key={appt.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="border border-gray-100 rounded-lg hover:shadow-md transition-shadow overflow-hidden"
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start">
                              <div className="bg-blue-100 p-3 rounded-full mr-4">
                                <FiUser className="text-blue-600" />
                              </div>
                              <div>
                                <div className="flex items-center mb-2">
                                  <h3 className="font-medium text-lg mr-3">
                                    {appt.schedule.professional.name}
                                  </h3>
                                  <StatusBadge status={appt.status} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <FiCalendar className="mr-2 text-gray-400" />
                                    <span>Data: {formatDate(appt.schedule.date)}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <FiClock className="mr-2 text-gray-400" />
                                    <span>Hora: {appt.schedule.time}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <FiInfo className="mr-2 text-gray-400" />
                                    <span>Especialidade: {appt.schedule.professional.specialty}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <FiPhone className="mr-2 text-gray-400" />
                                    <span>Telefone: {appt.schedule.professional.phone}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <FiDollarSign className="mr-2 text-gray-400" />
                                    <span>
                                      Preço: {new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                      }).format(appt.schedule.professional.consultationPrice || 0)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {appt.status.toLowerCase() !== 'cancelado' && (
                              <div>
                                {confirmCancel === appt.id ? (
                                  <div className="flex flex-col items-end space-y-2 bg-red-50 p-2 rounded-lg">
                                    <span className="text-sm text-red-600 font-medium">Confirmar cancelamento?</span>
                                    <div className="flex space-x-2">
                                      <Button
                                        onClick={() => handleCancel(appt.id, appt.schedule.id)}
                                        className="bg-red-500 hover:bg-red-600 !py-1 !px-2 flex items-center"
                                      >
                                        <FiCheckCircle className="mr-1" /> Sim
                                      </Button>
                                      <Button
                                        onClick={() => setConfirmCancel(null)}
                                        className="bg-gray-500 hover:bg-gray-600 !py-1 !px-2 flex items-center"
                                      >
                                        <FiXCircle className="mr-1" /> Não
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <Button
                                    className="bg-red-500 hover:bg-red-600 flex items-center"
                                    onClick={() => setConfirmCancel(appt.id)}
                                  >
                                    <FiXCircle className="mr-1" /> Cancelar
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
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

export default ClientAppointments;
