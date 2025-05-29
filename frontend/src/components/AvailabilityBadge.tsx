import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface Props {
  available: boolean;
}

const AvailabilityBadge = ({ available }: Props) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {available ? <FiCheckCircle className="mr-1" /> : <FiXCircle className="mr-1" />}
      {available ? 'Disponível' : 'Indisponível'}
    </span>
  );
};

export default AvailabilityBadge;
