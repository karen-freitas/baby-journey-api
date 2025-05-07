import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
  UsePipes,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../../domain/service/user.service';
import { plainToClass } from 'class-transformer';
import { UserEntity } from '../../domain/entity/user';
import { AuthGuard } from '../guards/auth-guard';
import { UserModel } from '../../domain/model/user.model';
import { ValidationPipe } from '../pipe/validation-pipe';
import { UserAlreadyRegisteredException } from '../../domain/exception/user-already-registered.exception';
import { BabyJourneyDocument } from 'src/domain/model/baby-journey.model';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserModel> {
    try {
      const user = plainToClass(UserEntity, createUserDto);

      return await this.usersService.create(user);
    } catch (error) {
      if (error instanceof UserAlreadyRegisteredException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUser(@Param('id') id: string): Promise<BabyJourneyDocument> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }
}
