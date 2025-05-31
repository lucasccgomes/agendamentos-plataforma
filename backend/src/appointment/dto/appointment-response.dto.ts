// src/appointment/dto/appointment-response.dto.ts
export class AppointmentResponseDto {
  id: number;
  status: string;
  createdAt: Date;
  client: {
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
    };
  };
}
