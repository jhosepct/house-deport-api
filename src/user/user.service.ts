import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserDto } from "../utils/dto/user.dto";

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }

  async createUser(user: CreateUserDto): Promise<UserDto> {
    const userFound = await this.userRepository.findOneBy({ email: user.email });
    if (userFound) throw new HttpException('Account exists', HttpStatus.CONFLICT);

    const newPassword = await bcrypt.hash(user.password, 10);
    const userObject = { ...user, password: newPassword }

    const newUser = this.userRepository.create(userObject);
    return (await this.userRepository.save(newUser)).ToJSON();
  }

  async getUsers(): Promise<UserDto[]>  {
    const result: User[] = await this.userRepository.find();
    return result.map((user) => user.ToJSON());
  }

  async getUserById(id: number): Promise<UserDto> {
    const userFound = await this.userRepository.findOneBy({ id });
    if (!userFound) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return userFound.ToJSON();
  }

  async deleteUser(id: number): Promise<HttpException> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return new HttpException('User deleted', HttpStatus.OK);
  }

  async updateUser(id: number, user: UpdateUserDto): Promise<UserDto> {
    const result = await this.userRepository.update(id, user);
    if (result.affected === 0) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const res = await this.userRepository.findOneBy({ id });
    return res.ToJSON();
  }
}
