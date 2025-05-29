import { Injectable } from '@nestjs/common';
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
  ) { }

  async create(createScheduleDto: CreateScheduleDto) {
    const professional = await this.userRepository.findOneBy({ id: createScheduleDto.professionalId });

    if (!professional) {
      throw new Error('Profissional não encontrado');
    }

    const schedule = this.scheduleRepository.create({
      date: createScheduleDto.date,
      time: createScheduleDto.time,
      professional,
      available: true 
    });    

    return this.scheduleRepository.save(schedule);
  }

  findAll() {
    return this.scheduleRepository.find({ relations: ['professional'] });
  }

  findOne(id: number) {
    return this.scheduleRepository.findOne({ where: { id }, relations: ['professional'] });
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return this.scheduleRepository.update(id, updateScheduleDto);
  }

  remove(id: number) {
    return this.scheduleRepository.delete(id);
  }
}
