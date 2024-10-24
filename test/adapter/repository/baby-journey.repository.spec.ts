import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BabyJourneyRepository } from '../../../src/adapter/repository/baby-journey.repository';
import { BabyJourneyDocument } from '../../../src/adapter/schemas/baby-journey.schema';
import { UserEntity } from '../../../src/domain/entity/user';
import { RecordEntity } from '../../../src/domain/entity/record';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

describe('BabyJourneyRepository', () => {
  let repository: BabyJourneyRepository;

  const mockUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password',
    milestones: [],
    memories: [],
    createdAt: new Date(),
    _id: 'someId',
  } as BabyJourneyDocument;

  const mockBabyJourneyModel = {
    new: jest.fn().mockResolvedValue(mockUser),
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(true),
    }),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
      select: jest.fn().mockReturnThis(),
    }),
    save: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        BabyJourneyRepository,
        {
          provide: getModelToken('BabyJourney'),
          useValue: mockBabyJourneyModel,
        },
      ],
    }).compile();

    repository = module.get<BabyJourneyRepository>(BabyJourneyRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const user: UserEntity = { email: 'test@example.com' } as UserEntity;
      const result = await repository.createUser(user);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if creation fails', async () => {
      jest.spyOn(mockBabyJourneyModel, 'create').mockImplementationOnce(() => { throw new Error('any error'); });
      const user: UserEntity = { email: 'test@example.com' } as UserEntity;
      let error: Error;
      try {
        await repository.createUser(user);
      }
      catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('Failed to create user');
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email', async () => {
      const result = await repository.findUserByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if finding fails', async () => {
      jest.spyOn(mockBabyJourneyModel, 'findOne').mockImplementationOnce(() => ({ exec: async () => { throw new Error('any error'); } }));
      let error: Error;
      try {
        await repository.findUserByEmail('test@example.com')
      }
      catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('Failed to find user by email');
    });
  });

  describe('findUserById', () => {
    it('should find a user by id', async () => {
      const result = await repository.findUserById('someUserId');
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user was not found', async () => {
      jest.spyOn(mockBabyJourneyModel, 'findById').mockResolvedValueOnce(() => ({ exec: async () => { null; } }));

      let error: Error;
      try {
        await repository.findUserById('someUserId');
      }
      catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('Failed to find user by id');
    });

    it('should throw an error if finding fails', async () => {
      jest.spyOn(mockBabyJourneyModel, 'findById').mockImplementationOnce(() => ({ exec: async () => { throw new Error('any error'); } }));
      let error: Error;
      try {
        await repository.findUserById('someUserId');
      }
      catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('Failed to find user by id');

    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      await expect(repository.deleteUser('someUserId')).resolves.toBeUndefined();
    });

    it('should throw an error if deletion fails', async () => {
      jest.spyOn(mockBabyJourneyModel, 'findByIdAndDelete').mockImplementationOnce(() => ({ exec: async () => { throw new Error('any error'); } }));
      let error: Error;
      try {
        await repository.deleteUser('someUserId');
      }
      catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('Failed to delete user');

    });
  });

  describe('saveMilestone', () => {
    it('should save a milestone', async () => {
      const milestone: RecordEntity = { title: 'First Step', description: 'First Step', date: '2021-01-01', image: 'image.jpg' } as RecordEntity;
      const result = await repository.saveMilestone('someUserId', milestone);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user not found', async () => {
      jest.spyOn(mockBabyJourneyModel, 'findByIdAndUpdate').mockResolvedValueOnce(() => ({ exec: async () => { null; } }));
      const milestone: RecordEntity = { title: 'First Step', description: 'First Step', date: '2021-01-01', image: 'image.jpg' } as RecordEntity;
      let error: Error;
      try {
        await repository.saveMilestone('someUserId', milestone);
      }
      catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('Failed to save milestone');
    });

    it('should throw an error if saving fails', async () => {
      jest.spyOn(mockBabyJourneyModel, 'findByIdAndUpdate').mockImplementationOnce(() => ({ exec: async () => { throw new Error('any error'); } }));
      const milestone: RecordEntity = { title: 'First Step', description: 'First Step', date: '2021-01-01', image: 'image.jpg' } as RecordEntity;
      let error: Error;
      try {
        await repository.saveMilestone('someUserId', milestone);
      }
      catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('Failed to save milestone');
    });
  });

  describe('saveMemory', () => {
    it('should save a memory', async () => {
      const memory: RecordEntity = { title: 'First Step', description: 'First Step', date: '2021-01-01', image: 'image.jpg' } as RecordEntity;
      const result = await repository.saveMemory('someUserId', memory);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user not found', async () => {
      jest.spyOn(mockBabyJourneyModel, 'findByIdAndUpdate').mockResolvedValueOnce(() => ({ exec: async () => { null; } }));
      const memory: RecordEntity = { title: 'First Step', description: 'First Step', date: '2021-01-01', image: 'image.jpg' } as RecordEntity;
      let error: Error;
      try {
        await repository.saveMemory('someUserId', memory);
      }
      catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('Failed to save memory');
    });

    it('should throw an error if saving fails', async () => {
      jest.spyOn(mockBabyJourneyModel, 'findByIdAndUpdate').mockImplementationOnce(() => ({ exec: async () => { throw new Error('any error'); } }));
      const memory: RecordEntity = { title: 'First Step', description: 'First Step', date: '2021-01-01', image: 'image.jpg' } as RecordEntity;
      let error: Error;
      try {
        await repository.saveMemory('someUserId', memory);
      }
      catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('Failed to save memory');
    });
  });

  describe('deleteMilestone', () => {
    it('should delete a milestone', async () => {
      const result = await repository.deleteMilestone('someUserId', 'someMilestoneId');
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user not found', async () => {
      jest.spyOn(mockBabyJourneyModel, 'findById').mockResolvedValueOnce(() => ({ exec: async () => { null; } }));
      let error: Error;
      try {
        await repository.deleteMilestone('someUserId', 'someMilestoneId');
      }
      catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('Failed to delete milestone');
    });

    it('should throw an error if deletion fails', async () => {
      jest.spyOn(mockBabyJourneyModel, 'findByIdAndUpdate').mockImplementationOnce(() => ({ exec: async () => { throw new Error('any error'); } }));
      let error: Error;
      try {
        await repository.deleteMilestone('someUserId', 'someMilestoneId');
      }
      catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('Failed to delete milestone');
    });
  });

  describe('deleteMemory', () => {
    it('should delete a memory', async () => {
      const result = await repository.deleteMemory('someUserId', 'someMilestoneId');
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user not found', async () => {
      jest.spyOn(mockBabyJourneyModel, 'findById').mockResolvedValueOnce(() => ({ exec: async () => { null; } }));
      let error: Error;
      try {
        await repository.deleteMemory('someUserId', 'someMilestoneId');
      }
      catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('Failed to delete memory');
    });

    it('should throw an error if deletion fails', async () => {
      jest.spyOn(mockBabyJourneyModel, 'findByIdAndUpdate').mockImplementationOnce(() => ({ exec: async () => { throw new Error('any error'); } }));
      let error: Error;
      try {
        await repository.deleteMemory('someUserId', 'someMilestoneId');
      }
      catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('Failed to delete memory');
    });
  });

  describe('findMilestoneById', () => {
    it('should find a milestone by id', async () => {
      const milestone: RecordEntity = { _id: 'someMilestoneId', title: 'First Step' } as RecordEntity;
      mockUser.milestones.push(milestone);
      const result = await repository.findMilestoneById('someUserId', 'someMilestoneId');
      expect(result).toEqual(milestone);
    });

    it('should throw an error if user not found', async () => {
      jest.spyOn(mockBabyJourneyModel, 'findById').mockResolvedValueOnce(() => ({ exec: async () => { null; } }));
      let error: Error;
      try {
        await repository.findMilestoneById('someUserId', 'someMilestoneId');
      }
      catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('Failed to find milestone');
    });

    it('should throw an error if milestone not found', async () => {
      let error: Error;
      try {
        await repository.findMilestoneById('someUserId', 'nonExistentMilestoneId');
      }
      catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('Failed to find milestone');
    });

    it('should throw an error if finding fails', async () => {
      jest.spyOn(mockBabyJourneyModel, 'findById').mockImplementationOnce(() => ({ exec: async () => { throw new Error('any error'); } }));
      let error: Error;
      try {
        await repository.findMilestoneById('someUserId', 'someMilestoneId');
      }
      catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('Failed to find milestone');
    });
  });

  describe('findMemoryById', () => {
    it('should find a memory by id', async () => {
      const memory: RecordEntity = { _id: 'someMemoryId', title: 'First Step' } as RecordEntity;
      mockUser.memories.push(memory);
      const result = await repository.findMemoryById('someUserId', 'someMemoryId');
      expect(result).toEqual(memory);
    });

    it('should throw an error if user not found', async () => {
      jest.spyOn(mockBabyJourneyModel, 'findById').mockResolvedValueOnce(() => ({ exec: async () => { null; } }));
      let error: Error;
      try {
        await repository.findMemoryById('someUserId', 'someMemoryId');
      }
      catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('Failed to find memory');
    });

    it('should throw an error if memory not found', async () => {
      let error: Error;
      try {
        await repository.findMemoryById('someUserId', 'nonExistentMemoryId');
      }
      catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('Failed to find memory');
    });

    it('should throw an error if finding fails', async () => {
      jest.spyOn(mockBabyJourneyModel, 'findById').mockImplementationOnce(() => ({ exec: async () => { throw new Error('any error'); } }));
      let error: Error;
      try {
        await repository.findMemoryById('someUserId', 'someMemoryId');
      }
      catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('Failed to find memory');
    });
  });
});