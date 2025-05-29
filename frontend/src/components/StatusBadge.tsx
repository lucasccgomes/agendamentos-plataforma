import { FiCheckCircle, FiAlertCircle, FiXCircle } from 'react-icons/fi';

interface Props {
  status: string;
}

const StatusBadge = ({ status }: Props) => {
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case 'confirmado':
        return { color: 'bg-green-100 text-green-800', icon: <FiCheckCircle className="mr-1" /> };
      case 'pendente':
        return { color: 'bg-yellow-100 text-yellow-800', icon: <FiAlertCircle className="mr-1" /> };
      case 'cancelado':
        return { color: 'bg-red-100 text-red-800', icon: <FiXCircle className="mr-1" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: <FiAlertCircle className="mr-1" /> };
    }
  };

  const { color, icon } = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {icon}
      {status}
    </span>
  );
};

export default StatusBadge;
