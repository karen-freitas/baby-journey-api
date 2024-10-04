import { BabyJourneyDocument } from '../../adapter/schemas/baby-journey.schema';
import { UserEntity } from '../entity/user';
import { RecordEntity } from '../entity/record';

export interface BabyJourneyRepositoryInterface {
  createUser(user: UserEntity): Promise<BabyJourneyDocument>;
  findUserByEmail(email: string): Promise<BabyJourneyDocument | undefined>;
  findUserById(id: string): Promise<BabyJourneyDocument>;
  deleteUser(id: string): Promise<void>;
  saveMilestone(
    id: string,
    milestone: RecordEntity
  ): Promise<BabyJourneyDocument>;
  saveMemory(id: string, memory: RecordEntity): Promise<BabyJourneyDocument>;
  deleteMilestone(
    id: string,
    milestoneId: string
  ): Promise<BabyJourneyDocument>;
  deleteMemory(id: string, memoryId: string): Promise<BabyJourneyDocument>;
  findMilestoneById(id: string, milestoneId: string): Promise<RecordEntity>;
  findMemoryById(id: string, memoryId: string): Promise<RecordEntity>;
}

export const BabyJourneyRepositoryInterface = Symbol(
  'BabyJourneyRepositoryInterface'
);
