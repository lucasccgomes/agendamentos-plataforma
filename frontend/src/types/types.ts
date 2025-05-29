
export interface Professional {
    id: number;
    name: string;
    email: string;
    bio: string;
    specialty: string;
    phone: string;
    consultationPrice: number;
    role: 'cliente' | 'profissional';
  }
  
  export interface Schedule {
    id: number;
    date: string;
    time: string;
    professional: Professional;
    available: boolean;
  }
  
  export interface FadeInItemProps {
    children: React.ReactNode;
    delay?: number;
  }
  
  export interface Appointment {
    id: number;
    status: string;
    client: {specialty: string;
      id: number;
      name: string;
    };
    schedule: {
      id: number;
      date: string;
      time: string;
      professional: {
        id: number;
        name: string;
        specialty: string;
        phone: number;
        consultationPrice: number;
      };
    };
  }
  