import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../../domain/service/user.service';
import { plainToClass } from 'class-transformer';
import { UserEntity } from '../../domain/entity/user';
import { AuthGuard } from '../guards/auth-guard';
import { UserModel } from '../../domain/model/user.model';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserModel> {
    const user = plainToClass(UserEntity, createUserDto);
    return this.usersService.create(user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }
}
