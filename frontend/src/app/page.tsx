'use client';

import Link from 'next/link';
import Card from '../components/Card';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import { FiUser, FiCalendar, FiClock, FiLogIn, FiUserPlus } from 'react-icons/fi';
import FadeInItem from '@/components/FadeInItem';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-6 shadow-md">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Plataforma de Agendamentos
          </motion.h1>
          <motion.p 
            className="text-xl opacity-90 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Conectando profissionais e clientes de forma simples e eficiente
          </motion.p>
        </div>
      </div>
      
      <motion.div 
        className="p-6 max-w-6xl mx-auto -mt-10"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <FadeInItem>
          <Card className="text-center p-8 mb-10">
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Bem-vindo à nossa plataforma para profissionais autônomos disponibilizarem seus horários e clientes realizarem agendamentos de forma rápida e prática.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center px-8 py-3 text-lg">
                  <FiLogIn className="mr-2" /> Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center px-8 py-3 text-lg">
                  <FiUserPlus className="mr-2" /> Cadastre-se
                </Button>
              </Link>
            </div>
          </Card>
        </FadeInItem>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <FadeInItem delay={0.2}>
            <Card className="overflow-hidden h-full">
              <div className="h-2 bg-blue-600 w-full -mt-4 mb-6"></div>
              <div className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FiUser className="text-blue-600 text-3xl" />
                </div>
                <h2 className="text-2xl font-semibold mb-4 text-center">Para Profissionais</h2>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
                      <FiCalendar className="text-blue-600" />
                    </span>
                    <span>Cadastre seus horários disponíveis com facilidade</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
                      <FiClock className="text-blue-600" />
                    </span>
                    <span>Gerencie seus agendamentos em um só lugar</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
                      <FiUser className="text-blue-600" />
                    </span>
                    <span>Acompanhe o histórico de atendimentos</span>
                  </li>
                </ul>
                <div className="mt-6 text-center">
                  <Link href="/register">
                    <Button className="bg-blue-600 border border-blue-600 text-blue-600 hover:bg-blue-500">
                      Começar como Profissional
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </FadeInItem>

          <FadeInItem delay={0.4}>
            <Card className="overflow-hidden h-full">
              <div className="h-2 bg-indigo-600 w-full -mt-4 mb-6"></div>
              <div className="p-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FiUser className="text-indigo-600 text-3xl" />
                </div>
                <h2 className="text-2xl font-semibold mb-4 text-center">Para Clientes</h2>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="bg-indigo-100 p-1 rounded-full mr-2 mt-1">
                      <FiUser className="text-indigo-600" />
                    </span>
                    <span>Encontre profissionais qualificados</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-indigo-100 p-1 rounded-full mr-2 mt-1">
                      <FiCalendar className="text-indigo-600" />
                    </span>
                    <span>Visualize horários disponíveis em tempo real</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-indigo-100 p-1 rounded-full mr-2 mt-1">
                      <FiClock className="text-indigo-600" />
                    </span>
                    <span>Agende consultas com apenas alguns cliques</span>
                  </li>
                </ul>
                <div className="mt-6 text-center">
                  <Link href="/register">
                    <Button className="bg-indigo-600 border border-indigo-600 text-indigo-600 hover:bg-indigo-500">
                      Começar como Cliente
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </FadeInItem>
        </div>
        
        <FadeInItem delay={0.6}>
          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-4">© 2025 Plataforma de Agendamentos. Todos os direitos reservados.</p>
          </div>
        </FadeInItem>
      </motion.div>
    </div>
  );
}
