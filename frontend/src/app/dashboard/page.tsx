"use client";

import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { FiCalendar, FiClock, FiList, FiPlus, FiLogOut, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import FadeInItem from '@/components/FadeInItem';
import StatusBadge from '@/components/StatusBadge';
import type { Appointment } from '@/types/types';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const res = await api.get<Appointment[]>('/appointments');
      const filtered: Appointment[] = user!.role === 'profissional'
        ? res.data.filter((appt: Appointment) => appt.schedule.professional.id === user!.id)
        : res.data.filter((appt: Appointment) => appt.client.id === user!.id);

      const confirmed = filtered.filter(appt => appt.status.toLowerCase() === 'confirmado').length;
      const pending = filtered.filter(appt => appt.status.toLowerCase() === 'pendente').length;

      setStats({
        total: filtered.length,
        confirmed,
        pending
      });

      setAppointments(filtered.slice(0, 3));
    } catch {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log('Usuário carregado:', user);
  }, [user]);
  

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (!user) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 bg-blue-200 rounded-full mb-4"></div>
        <div className="h-4 bg-blue-200 rounded w-24 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Bem-vindo, {user.name}!</h1>
          <p className="opacity-90">Gerencie seus agendamentos e serviços em um só lugar</p>
        </div>
      </div>

      <motion.div
        className="p-6 max-w-6xl mx-auto space-y-6 -mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Coluna lateral - Perfil */}
          <div className="lg:col-span-1 space-y-6">
            <FadeInItem>
              <Card className="overflow-visible">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 p-1 -mt-12 shadow-lg">
                    <img
                      src={user.photo ? `${api.defaults.baseURL}/uploads/${user.photo}` : '/9187532.png'}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover rounded-full bg-white"
                    />
                  </div>
                  <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium mt-1">
                    {user.role === 'profissional' ? 'Profissional' : 'Cliente'}
                  </div>

                  {user.role === 'profissional' && user.specialty && (
                    <p className="mt-3 text-sm text-gray-600">
                      <span className="font-medium">Especialidade:</span> {user.specialty}
                    </p>
                  )}

                  <div className="w-full border-t border-gray-100 my-4 pt-4">
                    <Button
                      className="w-full flex items-center justify-center bg-red-500 border border-gray-300 text-black hover:bg-red-600"
                      onClick={logout}
                    >
                      <FiLogOut className="mr-2" /> Sair
                    </Button>
                  </div>
                </div>
              </Card>
            </FadeInItem>

            {/* Estatísticas */}
            <FadeInItem delay={0.1}>
              <Card>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Resumo
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <FiCalendar className="mr-2 text-blue-500" /> Total
                    </span>
                    <span className="font-semibold">{stats.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <FiCheckCircle className="mr-2 text-green-500" /> Confirmados
                    </span>
                    <span className="font-semibold">{stats.confirmed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <FiAlertCircle className="mr-2 text-yellow-500" /> Pendentes
                    </span>
                    <span className="font-semibold">{stats.pending}</span>
                  </div>
                </div>
              </Card>
            </FadeInItem>
          </div>

          {/* Coluna principal - Agendamentos */}
          <div className="lg:col-span-3 space-y-6">
            <FadeInItem delay={0.2}>
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center">
                    <FiList className="mr-2 text-blue-600" /> Últimos Agendamentos
                  </h2>
                  <Button
                    className="text-sm bg-gray-600 border border-gray-300 text-gray-700 hover:bg-gray-500"
                    onClick={() => router.push(user.role === 'profissional' ? '/professional-appointments' : '/client-appointments')}
                  >
                    Ver Todos
                  </Button>
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
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <FiCalendar className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-gray-500">Sem agendamentos recentes.</p>
                    <Button
                      className="mt-4 bg-blue-600 hover:bg-blue-700"
                      onClick={() => router.push(user.role === 'cliente' ? '/schedule' : '/register-schedules')}
                    >
                      {user.role === 'cliente' ? 'Agendar Agora' : 'Cadastrar Horário'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appointments.map((appt: Appointment, index: number) => (
                      <motion.div
                        key={appt.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start">
                          <div className="bg-blue-100 p-3 rounded-full mr-4">
                            <FiClock className="text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-medium">
                                  {user.role === 'cliente'
                                    ? `Consulta com ${appt.schedule?.professional?.name || 'Profissional'}`
                                    : `Atendimento para ${appt.client?.name || 'Cliente'}`
                                  }
                                </h3>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <FiCalendar className="mr-1" />
                                  {formatDate(appt.schedule.date)}
                                  <span className="mx-2">•</span>
                                  <FiClock className="mr-1" />
                                  {appt.schedule.time}
                                </div>
                              </div>
                              <StatusBadge status={appt.status} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </Card>
            </FadeInItem>

            {/* Ações rápidas */}
            <FadeInItem delay={0.3}>
              <Card>
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <FiPlus className="mr-2 text-blue-600" /> Ações Rápidas
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.role === 'profissional' ? (
                    <>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center h-12"
                        onClick={() => router.push('/register-schedules')}
                      >
                        <FiPlus className="mr-2" /> Cadastrar Horário
                      </Button>
                      <Button
                        className="bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center h-12"
                        onClick={() => router.push('/schedule-list')}
                      >
                        <FiList className="mr-2" /> Ver Meus Horários
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center h-12 col-span-2"
                      onClick={() => router.push('/schedule')}
                    >
                      <FiCalendar className="mr-2" /> Agendar Novo Serviço
                    </Button>
                  )}
                </div>
              </Card>
            </FadeInItem>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
