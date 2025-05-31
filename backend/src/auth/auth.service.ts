import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validateUser(email: string, pass: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (isPasswordValid) {
      // Remove a senha antes de retornar
      const { password, ...safeUser } = user;
      return safeUser;
    }

    return null;
  }

  async login(user: User): Promise<{
    access_token: string;
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
      photo: string | null;
    };
  }> {
    if (!user) throw new UnauthorizedException('Usuário inválido');

    const payload = { username: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo || null, // corrigido aqui
      },
    };
  }
}
