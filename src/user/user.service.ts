import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

import { users } from './users';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  getUsers() {
    return Object.values(users);
  }

  getUserById(id: string) {
    if (uuidValidate(id)) {
      if (id in users) {
        return users[id];
      } else {
        throw new NotFoundException('User is not found');
      }
    } else {
      throw new BadRequestException('User id is not correct');
    }
  }

  createUser(createUserDto: CreateUserDto) {
    if (
      'login' in createUserDto &&
      'password' in createUserDto &&
      createUserDto.login &&
      createUserDto.password
    ) {
      const id = uuidv4();
      users[id] = {
        id: id,
        login: createUserDto.login,
        password: createUserDto.password,
        version: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      return {
        id: id,
        login: users[id].login,
        version: 1,
        createdAt: users[id].createdAt,
        updatedAt: users[id].updatedAt,
      };
    } else {
      throw new BadRequestException('Request is not correct');
    }
  }

  updatePassword(updatePasswordDto: UpdatePasswordDto, id: string) {
    if (
      'oldPassword' in updatePasswordDto &&
      'newPassword' in updatePasswordDto
    ) {
      if (uuidValidate(id)) {
        if (id in users) {
          if (users[id].password === updatePasswordDto.oldPassword) {
            users[id].password = updatePasswordDto.newPassword;
            users[id].version = ++users[id].version;
            users[id].updatedAt = Date.now();
          }
          return {
            id: id,
            login: users[id].login,
            version: users[id].version,
            createdAt: users[id].createdAt,
            updatedAt: users[id].updatedAt,
          };
        } else {
          throw new NotFoundException('User is not found');
        }
      } else {
        throw new BadRequestException('User id is not correct');
      }
    } else {
      throw new BadRequestException('Request is not correct');
    }
  }

  deleteUserById(id: string) {
    if (uuidValidate(id)) {
      if (id in users) {
        delete users[id];
      } else {
        throw new NotFoundException('User is not found');
      }
    } else {
      throw new BadRequestException('User id is not correct');
    }
  }
}
