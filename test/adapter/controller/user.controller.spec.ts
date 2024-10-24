import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../../src/adapter/controller/user.controller';
import { CreateUserDto } from '../../../src/adapter/dto/create-user.dto';
import { UserEntity } from '../../../src/domain/entity/user';
import { UserModel } from '../../../src/domain/model/user.model';
import { UsersService } from '../../../src/domain/service/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';


describe.only('UserController', () => {
  let userController: UserController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        ConfigService,
        JwtService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = { name: 'John Doe', email: 'john@example.com', password: 'password' };
      const userEntity = new UserEntity();
      userEntity.name = createUserDto.name;
      userEntity.email = createUserDto.email;
      userEntity.password = createUserDto.password;

      const userModel = { id: '1', name: 'John Doe', email: 'john@example.com', password: 'password' };

      jest.spyOn(usersService, 'create').mockResolvedValue(userModel as UserModel);

      const result = await userController.createUser(createUserDto);

      expect(result).toEqual(userModel);
      expect(usersService.create).toHaveBeenCalledWith(userEntity);
    });

    it('should throw an error if user creation fails', async () => {
      const createUserDto: CreateUserDto = { name: 'John Doe', email: 'john@example.com', password: 'password' };
      const userEntity = new UserEntity();
      userEntity.name = createUserDto.name;
      userEntity.email = createUserDto.email;
      userEntity.password = createUserDto.password;

      jest.spyOn(usersService, 'create').mockRejectedValue(new Error('User creation failed'));

      await expect(userController.createUser(createUserDto)).rejects.toThrow('User creation failed');
      expect(usersService.create).toHaveBeenCalledWith(userEntity);
    });


  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const userId = '1';

      jest.spyOn(usersService, 'delete').mockResolvedValue();

      await userController.deleteUser(userId);

      expect(usersService.delete).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if user deletion fails', async () => {
      const userId = '1';

      jest.spyOn(usersService, 'delete').mockRejectedValue(new Error('User deletion failed'));

      await expect(userController.deleteUser(userId)).rejects.toThrow('User deletion failed');
      expect(usersService.delete).toHaveBeenCalledWith(userId);
    });
  });
});