'use client';

import { useState } from 'react';
import { api } from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Notification from '../../components/Notification';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiInfo, FiPhone, FiDollarSign, FiArrowLeft } from 'react-icons/fi';
import FadeInItem from '@/components/FadeInItem';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'cliente' | 'profissional'>('cliente');

  const [bio, setBio] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [phone, setPhone] = useState('');
  const [consultationPrice, setConsultationPrice] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', role);

      if (photo) {
        formData.append('photo', photo);
      }

      if (role === 'profissional') {
        formData.append('bio', bio);
        formData.append('specialty', specialty);
        formData.append('phone', phone);

        if (consultationPrice) {
          formData.append('consultationPrice', String(Number(consultationPrice)));
        }
      }

      await api.post('/users', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('Cadastro realizado com sucesso!');
      setTimeout(() => router.push('/login'), 1500);
    } catch {
      setMessage('Erro ao cadastrar usuário. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50  text-gray-800">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Cadastre-se</h1>
          <p className="opacity-90">Crie sua conta para acessar todos os recursos</p>
        </div>
      </div>

      <motion.div
        className="p-6 max-w-md mx-auto -mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-visible">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl text-black font-semibold">Informações Pessoais</h2>
            <Button
              className="text-sm bg-green-400 border border-gray-300 text-gray-700 hover:bg-green-500 flex items-center"
              onClick={() => router.push('/login')}
            >
              <FiArrowLeft className="mr-2" />Login
            </Button>
          </div>

          {message && (
            <FadeInItem>
              <Notification
                message={message}
                type={message.includes('sucesso') ? 'success' : 'error'}
              />
            </FadeInItem>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FadeInItem delay={0.1}>
              <div className="flex items-center justify-center mb-6">
                <div className="flex space-x-4">
                  <div
                    className={`px-4 py-2 rounded-full cursor-pointer flex items-center transition-colors ${role === 'cliente'
                      ? 'bg-blue-100 text-blue-800 font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    onClick={() => setRole('cliente')}
                  >
                    <FiUser className="mr-2" /> Cliente
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full cursor-pointer flex items-center transition-colors ${role === 'profissional'
                      ? 'bg-indigo-100 text-indigo-800 font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    onClick={() => setRole('profissional')}
                  >
                    <FiUser className="mr-2" /> Profissional
                  </div>
                </div>
              </div>
            </FadeInItem>
            <FadeInItem delay={0.45}>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2 items-center">
                  <FiUser className="mr-2 text-gray-400" /> Foto de Perfil
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  className="w-full text-black p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </FadeInItem>
            <FadeInItem delay={0.2}>
              <Input
                label="Nome Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                leftIcon={<FiUser className="text-gray-400" />}
              />
            </FadeInItem>
            <FadeInItem delay={0.3}>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                leftIcon={<FiMail className="text-gray-400" />}
              />
            </FadeInItem>

            <FadeInItem delay={0.4}>
              <Input
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                leftIcon={<FiLock className="text-gray-400" />}
                helperText="Mínimo de 6 caracteres"
              />
            </FadeInItem>

            {/* Campos adicionais para profissional */}
            {role === 'profissional' && (
              <motion.div
                className="space-y-4 border-t border-gray-100 pt-4 mt-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <FadeInItem delay={0.5}>
                  <h3 className="text-md font-medium text-gray-700 mb-2">Informações Profissionais</h3>
                </FadeInItem>

                <FadeInItem delay={0.6}>
                  <Input
                    label="Especialidade"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    required
                    leftIcon={<FiInfo className="text-gray-400" />}
                  />
                </FadeInItem>

                <FadeInItem delay={0.7}>
                  <Input
                    label="Telefone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    leftIcon={<FiPhone className="text-gray-400" />}
                  />
                </FadeInItem>

                <FadeInItem delay={0.8}>
                  <Input
                    label="Preço da Consulta"
                    type="number"
                    value={consultationPrice}
                    onChange={(e) => setConsultationPrice(e.target.value)}
                    required
                    leftIcon={<FiDollarSign className="text-gray-400" />}
                  />
                </FadeInItem>

                <FadeInItem delay={0.9}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2 items-center">
                      <FiInfo className="mr-2 text-gray-400" /> Bio
                    </label>
                    <textarea
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Descreva sua experiência e especialidades..."
                    />
                  </div>
                </FadeInItem>
              </motion.div>
            )}

            <FadeInItem delay={role === 'profissional' ? 1 : 0.5}>
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
                ) : 'Cadastrar'}
              </Button>
            </FadeInItem>

            <FadeInItem delay={role === 'profissional' ? 1.1 : 0.6}>
              <p className="text-center text-sm text-gray-600 mt-4">
                Já possui uma conta?{' '}
                <span
                  className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
                  onClick={() => router.push('/login')}
                >
                  Faça login
                </span>
              </p>
            </FadeInItem>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;