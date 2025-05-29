import { IsNotEmpty, IsBoolean, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  professionalId: number;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  time: string;

  @IsBoolean()
  available: boolean;
}
