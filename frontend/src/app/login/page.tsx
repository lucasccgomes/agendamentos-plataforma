'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Notification from '../../components/Notification';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiLogIn, FiUserPlus } from 'react-icons/fi';
import FadeInItem from '@/components/FadeInItem';

const LoginPage = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Bem-vindo de volta!</h1>
          <p className="opacity-90">Faça login para acessar sua conta</p>
        </div>
      </div>
      
      <motion.div 
        className="p-6 max-w-md mx-auto -mt-6"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-visible">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 p-1 -mt-14 shadow-lg flex items-center justify-center">
              <FiLogIn className="text-white text-2xl" />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-center mb-6">Acesse sua conta</h2>

          {error && (
            <FadeInItem>
              <Notification message={error} type="error" />
            </FadeInItem>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FadeInItem delay={0.1}>
              <Input 
                label="Email" 
                type="email" 
                value={email} 
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }} 
                required 
                leftIcon={<FiMail className="text-gray-400" />}
              />
            </FadeInItem>

            <FadeInItem delay={0.2}>
              <Input 
                label="Senha" 
                type="password" 
                value={password} 
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }} 
                required 
                leftIcon={<FiLock className="text-gray-400" />}
              />
            </FadeInItem>

            <FadeInItem delay={0.3}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Lembrar-me
                  </label>
                </div>
                <div className="text-sm">
                  <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                    Esqueceu a senha?
                  </span>
                </div>
              </div>
            </FadeInItem>

            <FadeInItem delay={0.4}>
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
                    Entrando...
                  </>
                ) : (
                  <>
                    <FiLogIn className="mr-2" /> Entrar
                  </>
                )}
              </Button>
            </FadeInItem>
            
            <FadeInItem delay={0.5}>
              <div className="mt-6 flex items-center justify-center">
                <div className="text-sm">
                  <p className="text-gray-600">
                    Não tem uma conta?{' '}
                    <span 
                      className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium flex items-center"
                      onClick={() => router.push('/register')}
                    >
                      <FiUserPlus className="mr-1" /> Cadastre-se
                    </span>
                  </p>
                </div>
              </div>
            </FadeInItem>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
