import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    if (!userData.password) {
      throw new Error('Password is required');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltOrRounds);

    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'name', 'phone'], // 👈 agrega password aquí
      relations: ['rol'],
    });
  }

  //   async findOne(id: number): Promise<User> {
  //     return await this.userRepository.findOneBy({ id });
  //   }

  //   async update(id: number, userData: Partial<User>): Promise<User> {
  //     await this.userRepository.update(id, userData);
  //     return this.findOne(id);
  //   }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
