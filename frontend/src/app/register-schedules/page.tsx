'use client';

import { useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Notification from '../../components/Notification';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiPlus, FiArrowLeft, FiCheck, FiList } from 'react-icons/fi';
import FadeInItem from '@/components/FadeInItem';

const RegisterSchedules = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
 
  const [multipleDates, setMultipleDates] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeSlots, setTimeSlots] = useState(['']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessage('Usuário não autenticado!');
      return;
    }

    setLoading(true);
    setMessage('');
    setSuccess(false);

    try {
      if (multipleDates) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const dates = [];
        
        for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
          dates.push(new Date(dt).toISOString().split('T')[0]);
        }
        
        const promises = [];
        for (const dt of dates) {
          for (const tm of timeSlots) {
            if (tm.trim()) {
              promises.push(
                api.post('/schedules', {
                  date: dt,
                  time: tm,
                  professionalId: user.id,
                })
              );
            }
          }
        }
        
        await Promise.all(promises);
        setMessage(`${promises.length} horários cadastrados com sucesso!`);
      } else {
        await api.post('/schedules', {
          date,
          time,
          professionalId: user.id,
        });
        setMessage('Horário cadastrado com sucesso!');
      }
    
      setSuccess(true);
      
      setDate('');
      setTime('');
      setStartDate('');
      setEndDate('');
      setTimeSlots(['']);
    } catch {
      setMessage('Erro ao cadastrar horário. Tente novamente.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, '']);
  };

  const updateTimeSlot = (index: number, value: string) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index] = value;
    setTimeSlots(newTimeSlots);
  };
  
  const removeTimeSlot = (index: number) => {
    if (timeSlots.length > 1) {
      const newTimeSlots = [...timeSlots];
      newTimeSlots.splice(index, 1);
      setTimeSlots(newTimeSlots);
    }
  };  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Cadastrar Horários</h1>
          <p className="opacity-90">Disponibilize horários para seus clientes agendarem</p>
        </div>
      </div>
      
      <motion.div 
        className="p-6 max-w-6xl mx-auto -mt-6"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <FadeInItem>
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FiCalendar className="mr-2 text-blue-600" /> Ações
                </h3>
                
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-green-700 border border-gray-300 text-gray-700 hover:bg-green-600 flex items-center justify-center"
                    onClick={() => router.push('/schedule-list')}
                  >
                    <FiList className="mr-2" /> Ver Meus Horários
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
            
            <FadeInItem delay={0.1}>
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FiCalendar className="mr-2 text-blue-600" /> Tipo de Cadastro
                </h3>
                
                <div className="flex items-center justify-center mb-4">
                  <div className="flex space-x-4">
                    <div 
                      className={`px-4 py-2 rounded-full cursor-pointer flex items-center transition-colors ${
                        !multipleDates 
                          ? 'bg-blue-100 text-blue-800 font-medium' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      onClick={() => setMultipleDates(false)}
                    >
                      <FiCalendar className="mr-2" /> Único
                    </div>
                    <div 
                      className={`px-4 py-2 rounded-full cursor-pointer flex items-center transition-colors ${
                        multipleDates 
                          ? 'bg-indigo-100 text-indigo-800 font-medium' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      onClick={() => setMultipleDates(true)}
                    >
                      <FiCalendar className="mr-2" /> Múltiplos
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">
                  {multipleDates 
                    ? 'Cadastre vários horários de uma vez selecionando um período e horários específicos.' 
                    : 'Cadastre um horário específico selecionando data e hora.'}
                </p>
              </Card>
            </FadeInItem>
          </div>
          <div className="lg:col-span-3 space-y-6">
            <FadeInItem delay={0.2}>
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">
                    {multipleDates ? 'Cadastro de Múltiplos Horários' : 'Cadastro de Horário'}
                  </h2>
                </div>

                {message && (
                  <Notification 
                    message={message} 
                    type={success ? 'success' : 'error'} 
                  />
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {!multipleDates ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FadeInItem delay={0.3}>
                        <Input 
                          label="Data" 
                          type="date" 
                          value={date} 
                          onChange={(e) => setDate(e.target.value)} 
                          required 
                          leftIcon={<FiCalendar className="text-gray-400" />}
                        />
                      </FadeInItem>
                      
                      <FadeInItem delay={0.4}>
                        <Input 
                          label="Hora" 
                          type="time" 
                          value={time} 
                          onChange={(e) => setTime(e.target.value)} 
                          required 
                          leftIcon={<FiClock className="text-gray-400" />}
                        />
                      </FadeInItem>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FadeInItem delay={0.3}>
                          <Input 
                            label="Data Inicial" 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                            required 
                            leftIcon={<FiCalendar className="text-gray-400" />}
                          />
                        </FadeInItem>
                        
                        <FadeInItem delay={0.4}>
                          <Input 
                            label="Data Final" 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                            required 
                            leftIcon={<FiCalendar className="text-gray-400" />}
                          />
                        </FadeInItem>
                      </div>
                      
                      <FadeInItem delay={0.5}>
                        <div className="space-y-3">
                          <label className="text-gray-700 text-sm font-bold mb-2 flex items-center">
                            <FiClock className="mr-2 text-gray-400" /> Horários
                          </label>
                          
                          {timeSlots.map((slot, index: number) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Input 
                                type="time" 
                                value={slot} 
                                onChange={(e) => updateTimeSlot(index, e.target.value)} 
                                required 
                                className="flex-1"
                              />
                              {index > 0 && (
                                <Button 
                                  type="button"
                                  className="bg-red-500 hover:bg-red-600 !p-2"
                                  onClick={() => removeTimeSlot(index)}
                                >
                                  <FiCheck />
                                </Button>
                              )}
                            </div>
                          ))}
                          
                          <Button 
                            type="button"
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center"
                            onClick={addTimeSlot}
                          >
                            <FiPlus className="mr-2" /> Adicionar Horário
                          </Button>
                        </div>
                      </FadeInItem>
                    </div>
                  )}
                  
                  <FadeInItem delay={0.6}>
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center h-12 mt-6"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Cadastrando...
                        </>
                      ) : (
                        <>
                          <FiCalendar className="mr-2" /> 
                          {multipleDates ? 'Cadastrar Horários' : 'Cadastrar Horário'}
                        </>
                      )}
                    </Button>
                  </FadeInItem>
                </form>
                
                {success && (
                  <FadeInItem delay={0.7}>
                    <div className="mt-6 flex justify-center">
                      <Button 
                        className="bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center"
                        onClick={() => router.push('/schedule-list')}
                      >
                        <FiList className="mr-2" /> Ver Meus Horários
                      </Button>
                    </div>
                  </FadeInItem>
                )}
              </Card>
            </FadeInItem>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterSchedules;
