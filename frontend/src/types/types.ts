export type Role = 'cliente' | 'profissional';

export interface UserBase {
  id: number;
  name: string;
  email: string;
  role: Role;
  specialty?: string;
}

export interface User extends UserBase {
  photo: string;
}

export interface Professional extends UserBase {
  bio: string;
  phone: string;
  consultationPrice: number;
  specialty: string;
  role: 'profissional';
}

export interface Client extends UserBase {
  role: 'cliente';
}

export interface Schedule {
  id: number;
  date: string;
  time: string;
  professional: Professional;
  available: boolean;
}

export interface Appointment {
  id: number;
  status: string;
  client: Pick<Client, 'id' | 'name' | 'specialty'>;
  schedule: {
    id: number;
    date: string;
    time: string;
    professional: Pick<Professional, 'id' | 'name' | 'specialty' | 'phone' | 'consultationPrice'>;
  };
}

export interface FadeInItemProps {
  children: React.ReactNode;
  delay?: number;
}
