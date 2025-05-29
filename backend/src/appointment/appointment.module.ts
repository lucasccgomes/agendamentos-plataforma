import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { User } from '../user/entities/user.entity';
import { Schedule } from '../schedule/entities/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, User, Schedule])],
  controllers: [AppointmentController],
  providers: [AppointmentService]
})
export class AppointmentModule {}
