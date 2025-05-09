import { Inject, Injectable } from '@nestjs/common';
import { hashSync as bcryptHashSync } from 'bcrypt';
import { UserEntity } from '../entity/user';
import { BabyJourneyRepositoryInterface } from '../interface/baby-journey.repository';
import { AzureBlobServiceInterface } from '../interface/azure-blob.service';
import { UserModel } from '../model/user.model';
import { UserAlreadyRegisteredException } from '../exception/user-already-registered.exception';
import { BabyJourneyDocument } from '../model/baby-journey.model';

@Injectable()
export class UsersService {
  constructor(
    @Inject(BabyJourneyRepositoryInterface)
    private readonly babyJourneyRepository: BabyJourneyRepositoryInterface,
    @Inject(AzureBlobServiceInterface)
    private readonly blobService: AzureBlobServiceInterface
  ) {}

  async create(newUser: UserEntity): Promise<UserModel> {
    const userAlreadyRegistered = await this.findOne(newUser.email);

    if (userAlreadyRegistered) {
      throw new UserAlreadyRegisteredException(newUser.email);
    }
    const passwordHash = bcryptHashSync(newUser.password, 10);
    const dbUser = { ...newUser, password: passwordHash };

    const { id, name } = await this.babyJourneyRepository.createUser(dbUser);

    return { id, name } as UserModel;
  }

  async findOne(email: string): Promise<UserModel> {
    const userFound = await this.babyJourneyRepository.findUserByEmail(email);

    if (!userFound) {
      return null;
    }

    return {
      id: userFound.id,
      name: userFound.name,
      password: userFound.password,
    } as UserModel;
  }

  async findById(id: string): Promise<BabyJourneyDocument> {
    const userFound = await this.babyJourneyRepository.findUserById(id);

    if (!userFound) {
      return null;
    }

    return userFound;
  }

  async delete(id: string): Promise<void> {
    const user = await this.babyJourneyRepository.findUserById(id);
    if (!user) {
      throw new Error(`User with id '${id}' not found`);
    }
    await Promise.all(user.milestones.map((milestone) => this.blobService.deleteFile(milestone.image)));
    await Promise.all(user.memories.map((memory) => this.blobService.deleteFile(memory.image)));

    return this.babyJourneyRepository.deleteUser(id);
  }
}
