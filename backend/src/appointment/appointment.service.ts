import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentResponseDto } from './dto/appointment-response.dto';
import { User } from '../user/entities/user.entity';
import { Schedule } from '../schedule/entities/schedule.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const client = await this.userRepository.findOneBy({ id: createAppointmentDto.clientId });
    const schedule = await this.scheduleRepository.findOneBy({ id: createAppointmentDto.scheduleId });

    if (!client || !schedule) {
      throw new NotFoundException('Cliente ou horário não encontrado');
    }

    const appointment = this.appointmentRepository.create({
      client,
      schedule,
      status: createAppointmentDto.status,
    });

    const savedAppointment = await this.appointmentRepository.save(appointment);

    schedule.available = false;
    await this.scheduleRepository.save(schedule);

    return savedAppointment;
  }

  async findAll(): Promise<AppointmentResponseDto[]> {
    const appointments = await this.appointmentRepository.find({
      relations: ['client', 'schedule', 'schedule.professional'],
    });

    return appointments.map((a) => ({
      id: a.id,
      status: a.status,
      createdAt: a['createdAt'],
      client: {
        id: a.client.id,
        name: a.client.name,
      },
      schedule: {
        id: a.schedule.id,
        date: a.schedule.date,
        time: a.schedule.time,
        professional: {
          id: a.schedule.professional.id,
          name: a.schedule.professional.name,
        },
      },
    }));
  }

  async findOne(id: number): Promise<AppointmentResponseDto> {
    const a = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['client', 'schedule', 'schedule.professional'],
    });

    if (!a) throw new NotFoundException('Agendamento não encontrado');

    return {
      id: a.id,
      status: a.status,
      createdAt: a['createdAt'],
      client: {
        id: a.client.id,
        name: a.client.name,
      },
      schedule: {
        id: a.schedule.id,
        date: a.schedule.date,
        time: a.schedule.time,
        professional: {
          id: a.schedule.professional.id,
          name: a.schedule.professional.name,
        },
      },
    };
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    const result = await this.appointmentRepository.update(id, updateAppointmentDto);
    if (result.affected === 0) {
      throw new NotFoundException('Agendamento não encontrado');
    }
    return { message: 'Agendamento atualizado com sucesso' };
  }

  async remove(id: number) {
    const result = await this.appointmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Agendamento não encontrado');
    }
    return { message: 'Agendamento removido com sucesso' };
  }
}
