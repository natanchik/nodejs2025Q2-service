import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserById(id: string): Promise<User> {
    if (uuidValidate(id)) {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User is not found');
      }
      return user;
    } else {
      throw new BadRequestException('User id is not correct');
    }
  }

  createUser(createUserDto: CreateUserDto): Promise<User> {
    if (
      'login' in createUserDto &&
      'password' in createUserDto &&
      createUserDto.login &&
      createUserDto.password
    ) {
      const id = uuidv4();
      const newUser = this.userRepository.create({
        id: id,
        login: createUserDto.login,
        password: createUserDto.password,
        version: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return this.userRepository.save(newUser);
    } else {
      throw new BadRequestException('Request is not correct');
    }
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
    id: string,
  ): Promise<User> {
    if (
      'oldPassword' in updatePasswordDto &&
      'newPassword' in updatePasswordDto
    ) {
      if (uuidValidate(id)) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
          throw new NotFoundException('User is not found');
        }
        if (user.password === updatePasswordDto.oldPassword) {
          await this.userRepository.update(id, {
            id,
            login: user.login,
            password: updatePasswordDto.newPassword,
            version: ++user.version,
            createdAt: user.createdAt,
            updatedAt: Date.now(),
          });
          return this.userRepository.findOne({ where: { id } });
        } else {
          throw new ForbiddenException('Old password is not correct');
        }
      } else {
        throw new BadRequestException('User id is not correct');
      }
    } else {
      throw new BadRequestException('Request is not correct');
    }
  }

  async deleteUserById(id: string): Promise<void> {
    if (uuidValidate(id)) {
      const user = await this.userRepository.findOne({ where: { id } });
      if (user) {
        await this.userRepository.delete(id);
      } else {
        throw new NotFoundException('User is not found');
      }
    } else {
      throw new BadRequestException('User id is not correct');
    }
  }
}
