import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  role: 'cliente' | 'profissional';

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber()
  consultationPrice?: number;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
@IsString()
whatsapp?: string;

@IsOptional()
@Matches(/^\/[a-zA-Z0-9-_]+$/, { message: 'LinkedIn deve ser no formato /perfil' })
linkedin?: string;

@IsOptional()
@Matches(/^\/[a-zA-Z0-9-_]+$/, { message: 'GitHub deve ser no formato /perfil' })
github?: string;

@IsOptional()
@IsString()
portfolio?: string;

}



