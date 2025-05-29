'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiCheckCircle, FiSearch, FiUser } from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';

import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Notification from '../../components/Notification';
import FadeInItem from '../../components/FadeInItem';
import ProfessionalInfo from '../../components/ProfessionalInfo';
import { DateSelector } from '../../components/DateSelector';
import { ScheduleSelector } from '@/components/ScheduleSelector';
import type { Professional, Schedule } from '@/types/types';

const SchedulePage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [specialties, setSpecialties] = useState<string[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [allProfessionals, setAllProfessionals] = useState<Professional[]>([]);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) router.push('/login');
    else fetchProfessionalsAndSpecialties();
  }, [user, router]);

  useEffect(() => {
    if (professionals.length === 1) {
      handleSelectProfessional(professionals[0].id);
    }
  }, [professionals]);

  const formatarData = (dataString: string) => {
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

  const handleSelectProfessional = async (profId: number) => {
    const professional = professionals.find(p => p.id === profId) || null;
    setSelectedProfessional(professional);
    setSelectedScheduleId(null);
    setSelectedDate(null);

    try {
      const response = await api.get<Schedule[]>('/schedules');
      const horarios = response.data.filter(s => s.professional.id === profId && s.available);
      setSchedules(horarios);
      const datasUnicas = Array.from(new Set(horarios.map(h => h.date)));
      if (datasUnicas.length > 0) setSelectedDate(datasUnicas[0]);
    } catch {
      setMessage('Erro ao buscar horários disponíveis.');
    } finally {
    }
  };

  const fetchProfessionalsAndSpecialties = async () => {
    try {
      const response = await api.get<Professional[]>('/users');
      const professionals = response.data.filter(u => u.role === 'profissional');

      const uniqueSpecialties = Array.from(new Set(professionals.map(p => p.specialty)));
      setSpecialties(uniqueSpecialties);
      setAllProfessionals(professionals);
      setProfessionals(professionals); // mostra todos inicialmente
    } catch {
      setMessage('Erro ao carregar profissionais.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScheduleId) return setMessage('Selecione um horário!');

    setLoading(true);
    setMessage('');
    setSuccess(false);

    try {
      await api.post('/appointments', {
        clientId: user?.id,
        scheduleId: selectedScheduleId,
        status: 'pendente',
      });

      setMessage('Agendamento realizado com sucesso!');
      setSuccess(true);
      setSelectedScheduleId(null);
    } catch {
      setMessage('Erro ao realizar agendamento.');
    } finally {
      setLoading(false);
    }
  };

  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedSpecialty(selected);

    if (!selected) {
      setProfessionals(allProfessionals);
    } else {
      const filtered = allProfessionals.filter(
        p => p.specialty?.toLowerCase() === selected.toLowerCase()
      );
      setProfessionals(filtered);
    }

    setSelectedProfessional(null);
    setSchedules([]);
    setSelectedScheduleId(null);
    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Agendar Serviço</h1>
          <p className="opacity-90">Encontre profissionais e horários disponíveis para seu agendamento</p>
        </div>
      </div>

      <motion.div className="p-6 max-w-6xl mx-auto -mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <FadeInItem>
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FiSearch className="mr-2 text-blue-600" /> Filtros
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Filtrar por Especialidade</label>
                    <select
                      value={selectedSpecialty}
                      onChange={handleSpecialtyChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Todas as especialidades</option>
                      {specialties.map((esp, idx) => (
                        <option key={idx} value={esp}>{esp}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>
            </FadeInItem>

            <FadeInItem delay={0.1}>
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MdDashboard className="mr-2 text-blue-600" /> Ações
                </h3>
                <div className="space-y-3">
                  <Button
                    className="w-full bg-gray-500 border border-gray-300 text-gray-700 hover:bg-gray-600 flex items-center justify-center"
                    onClick={() => router.push('/dashboard')}
                  >
                    <FiArrowLeft className="mr-2" /> Dashboard
                  </Button>
                </div>
              </Card>
            </FadeInItem>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {message && (
              <FadeInItem>
                <Notification
                  message={message}
                  type={success ? 'success' : message.includes('Erro') ? 'error' : 'info'}
                />
              </FadeInItem>
            )}

            {professionals.length > 0 ? (
              <>
                <FadeInItem delay={0.2}>
                  <Card>
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                      <FiUser className="mr-2 text-blue-600" /> Profissionais Disponíveis
                    </h2>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500">Selecione um profissional para ver os horários disponíveis, ou visualize abaixo os profissionais listados.</p>
                      <select
                        value={selectedProfessional?.id ?? ''}
                        onChange={(e) => handleSelectProfessional(Number(e.target.value))}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Ver todos</option>
                        {professionals.map(prof => (
                          <option key={prof.id} value={prof.id}>
                            {prof.name} - {prof.specialty}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Card>
                </FadeInItem>
              </>
            ) : (
              <FadeInItem delay={0.2}>
                <Card>
                  <p className="text-gray-600">Nenhum profissional disponível no momento.</p>
                </Card>
              </FadeInItem>
            )}
            {selectedProfessional ? (
              <FadeInItem delay={0.3}>
                <ProfessionalInfo professional={selectedProfessional} />
              </FadeInItem>
            ) : (
              professionals.map((prof) => (
                <div
                  key={prof.id}
                  onClick={() => handleSelectProfessional(prof.id)}
                  className="cursor-pointer"
                >
                  <FadeInItem>
                    <ProfessionalInfo professional={prof} />
                  </FadeInItem>
                </div>
              ))
            )}
            {schedules.length > 0 && (
              <FadeInItem delay={0.4}>
                <Card>
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <FiCalendar className="mr-2 text-blue-600" /> Horários Disponíveis
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <DateSelector
                      dates={Array.from(new Set(schedules.map(h => h.date)))}
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                      formatarData={formatarData}
                    />

                    {selectedDate && (
                      <ScheduleSelector
                        schedules={schedules.filter(s => s.date === selectedDate)}
                        selectedId={selectedScheduleId}
                        onSelect={setSelectedScheduleId}
                      />
                    )}
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center h-12 mt-6"
                      disabled={loading || !selectedScheduleId}
                    >
                      {loading ? <><FiCheckCircle className="mr-2 animate-spin" /> Agendando...</> : <><FiCheckCircle className="mr-2" /> Confirmar Agendamento</>}
                    </Button>
                  </form>
                </Card>
              </FadeInItem>
            )}

            {success && (
              <FadeInItem delay={0.5}>
                <Card className="bg-green-50 border border-green-200">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                      <FiCheckCircle className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">Agendamento Confirmado!</h3>
                      <p className="text-green-700">Seu agendamento foi realizado com sucesso.</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      className="bg-green-600 hover:bg-green-700 flex items-center"
                      onClick={() => router.push('/dashboard')}
                    >
                      <FiCalendar className="mr-2" /> Ver Meus Agendamentos
                    </Button>
                  </div>
                </Card>
              </FadeInItem>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SchedulePage;
