import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
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

  async create(createAppointmentDto: CreateAppointmentDto) {
    const client = await this.userRepository.findOneBy({ id: createAppointmentDto.clientId });
    const schedule = await this.scheduleRepository.findOneBy({ id: createAppointmentDto.scheduleId });

    if (!client || !schedule) {
      throw new Error('Cliente ou horário não encontrado');
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

  findAll() {
    return this.appointmentRepository.find({
      relations: ['client', 'schedule', 'schedule.professional'],
    });
  }
  
  findOne(id: number) {
    return this.appointmentRepository.findOne({
      where: { id },
      relations: ['client', 'schedule', 'schedule.professional'],
    });
  }  

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentRepository.update(id, updateAppointmentDto);
  }

  remove(id: number) {
    return this.appointmentRepository.delete(id);
  }
}
