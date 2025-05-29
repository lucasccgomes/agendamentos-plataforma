import { FiInfo, FiPhone, FiDollarSign, FiUser } from 'react-icons/fi';
import type { Professional } from '@/types/types';

interface Props {
  professional: Professional;
}

export default function ProfessionalInfo({ professional }: Props) {
  return (
    <div className="flex flex-col md:flex-row items-start gap-4">
      <div className="bg-blue-100 p-4 rounded-full">
        <FiUser className="text-blue-600 text-3xl" />
      </div>
      <div className="space-y-2 flex-1">
        <h3 className="text-xl font-semibold">{professional.name}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex items-center">
            <FiInfo className="text-blue-600 mr-2" />
            <span className="text-gray-700 font-medium">Especialidade:</span>
            <span className="ml-2">{professional.specialty}</span>
          </div>
          <div className="flex items-center">
            <FiPhone className="text-blue-600 mr-2" />
            <span className="text-gray-700 font-medium">Telefone:</span>
            <span className="ml-2">{professional.phone}</span>
          </div>
          <div className="flex items-center">
            <FiDollarSign className="text-blue-600 mr-2" />
            <span className="text-gray-700 font-medium">Preço:</span>
            <span className="ml-2">R$ {Number(professional.consultationPrice).toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-2">
          <span className="text-gray-700 font-medium flex items-center">
            <FiInfo className="text-blue-600 mr-2" /> Bio:
          </span>
          <p className="text-gray-600 mt-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
            {professional.bio || 'Informações não disponíveis.'}
          </p>
        </div>
      </div>
    </div>
  );
}
