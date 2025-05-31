import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const professional = await this.userRepository.findOneBy({ id: createScheduleDto.professionalId });

    if (!professional) {
      throw new NotFoundException('Profissional não encontrado');
    }

    const schedule = this.scheduleRepository.create({
      date: createScheduleDto.date,
      time: createScheduleDto.time,
      professional,
      available: true,
    });

    return this.scheduleRepository.save(schedule);
  }

  async findAll(): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      relations: ['professional'],
      order: { date: 'ASC', time: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['professional'],
    });

    if (!schedule) {
      throw new NotFoundException('Horário não encontrado');
    }

    return schedule;
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto): Promise<{ message: string }> {
    const result = await this.scheduleRepository.update(id, updateScheduleDto);

    if (result.affected === 0) {
      throw new NotFoundException('Horário não encontrado');
    }

    return { message: 'Horário atualizado com sucesso' };
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.scheduleRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Horário não encontrado');
    }

    return { message: 'Horário removido com sucesso' };
  }
}
