import { MilestoneEntity } from 'src/domain/entity/milestone';
import mongoose from 'mongoose';
import { MemoryEntity } from 'src/domain/entity/memory';

interface Milestone extends Document {
  title: string;
  description: string;
  date: Date;
  photo: string;
}

const MilestoneSchema = new mongoose.Schema<Milestone>({
  title: { type: String, required: true },
  description: { type: String, required: false },
  date: { type: Date, required: true },
  photo: { type: String, required: true },
});

interface Memory extends Document {
  title: string;
  description: string;
  date: Date;
  photo: string;
}

const MemorySchema = new mongoose.Schema<Memory>({
  title: { type: String, required: true },
  description: { type: String, required: false },
  date: { type: Date, required: true },
  photo: { type: String, required: true },
});


export interface BabyJourneyDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  birthdate: Date;
  milestones: MilestoneEntity[];
  memories: MemoryEntity[];
  createdAt: Date;
}

export const BabyJourneySchema = new mongoose.Schema<BabyJourneyDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  birthdate: { type: Date, required: true },
  milestones: [{ type: MilestoneSchema }],
  memories: [{ type: MemorySchema }],
  createdAt: { type: Date, default: Date.now },
});