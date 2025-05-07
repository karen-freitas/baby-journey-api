import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserEntity } from '../../domain/entity/user';
import { BabyJourneyRepositoryInterface } from '../../domain/interface/baby-journey.repository';
import { RecordEntity } from '../../domain/entity/record';
import { BabyJourneyDocument } from 'src/domain/model/baby-journey.model';

@Injectable()
export class BabyJourneyRepository implements BabyJourneyRepositoryInterface {
  constructor(
    @InjectModel('BabyJourney')
    private babyJourneyModel: Model<BabyJourneyDocument>
  ) {}

  async createUser(user: UserEntity): Promise<BabyJourneyDocument> {
    try {
      return await this.babyJourneyModel.create(user);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create user',
        error.message
      );
    }
  }

  async findUserByEmail(
    email: string
  ): Promise<BabyJourneyDocument | undefined> {
    try {
      return await this.babyJourneyModel.findOne({ email }).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find user by email',
        error.message
      );
    }
  }

  async findUserById(id: string): Promise<BabyJourneyDocument> {
    try {
      const user = await this.babyJourneyModel
        .findById(id)
        .select('-password')
        .exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find user by id',
        error.message
      );
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.babyJourneyModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete user',
        error.message
      );
    }
  }

  async saveMilestone(
    id: string,
    milestone: RecordEntity
  ): Promise<BabyJourneyDocument> {
    try {
      const user = await this.babyJourneyModel
        .findByIdAndUpdate(
          { _id: id },
          { $push: { milestones: milestone } },
          { new: true }
        )
        .select('-password')
        .exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to save milestone',
        error.message
      );
    }
  }

  async saveMemory(
    id: string,
    memory: RecordEntity
  ): Promise<BabyJourneyDocument> {
    try {
      const user = await this.babyJourneyModel
        .findByIdAndUpdate(id, { $push: { memories: memory } }, { new: true })
        .select('-password')
        .exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to save memory',
        error.message
      );
    }
  }

  async deleteMilestone(
    id: string,
    milestoneId: string
  ): Promise<BabyJourneyDocument> {
    try {
      const user = await this.babyJourneyModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const userUpdated = await this.babyJourneyModel
        .findByIdAndUpdate(
          id,
          { $pull: { milestones: { _id: milestoneId } } },
          { new: true }
        )
        .select('-password')
        .exec();

      if (!userUpdated) {
        throw new NotFoundException('Milestone not found');
      }
      return userUpdated;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete milestone',
        error.message
      );
    }
  }

  async deleteMemory(
    id: string,
    memoryId: string
  ): Promise<BabyJourneyDocument> {
    try {
      const user = await this.babyJourneyModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const userUpdated = await this.babyJourneyModel
        .findByIdAndUpdate(
          id,
          { $pull: { memories: { _id: memoryId } } },
          { new: true }
        )
        .select('-password')
        .exec();

      if (!userUpdated) {
        throw new NotFoundException('Milestone not found');
      }
      return userUpdated;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete memory',
        error.message
      );
    }
  }

  async findMilestoneById(
    id: string,
    milestoneId: string
  ): Promise<RecordEntity> {
    try {
      const user = await this.babyJourneyModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const milestone = user.milestones.find(
        (milestone) => milestone._id.toString() === milestoneId
      );
      if (!milestone) {
        throw new NotFoundException('Milestone not found');
      }

      return milestone;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find milestone',
        error.message
      );
    }
  }

  async findMemoryById(id: string, memoryId: string): Promise<RecordEntity> {
    try {
      const user = await this.babyJourneyModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const memory = user.memories.find(
        (memory) => memory._id.toString() === memoryId
      );
      if (!memory) {
        throw new NotFoundException('Memory not found');
      }

      return memory;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find memory',
        error.message
      );
    }
  }

  async updateMilestone(
    id: string,
    milestoneId: string,
    milestone: RecordEntity
  ): Promise<BabyJourneyDocument> {
    try {
      const user = await this.babyJourneyModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const updatedUser = await this.babyJourneyModel
        .findOneAndUpdate(
          { _id: id, 'milestones._id': milestoneId },
          { $set: { 'milestones.$': milestone } }
        )
        .select('-password')
        .exec();

      if (!updatedUser) {
        throw new NotFoundException('Milestone not found');
      }
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update milestone',
        error.message
      );
    }
  }
  async updateMemory(
    id: string,
    memoryId: string,
    memory: RecordEntity
  ): Promise<BabyJourneyDocument> {
    try {
      const user = await this.babyJourneyModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const updatedUser = await this.babyJourneyModel
        .findOneAndUpdate(
          { _id: id, 'memories._id': memoryId },
          { $set: { 'memories.$': memory } }
        )
        .select('-password')
        .exec();

      if (!updatedUser) {
        throw new NotFoundException('Memory not found');
      }
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update memory',
        error.message
      );
    }
  }
}
