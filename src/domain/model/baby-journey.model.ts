import mongoose from 'mongoose';
import { RecordEntity } from '../entity/record';

export interface BabyJourneyDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  milestones: RecordEntity[];
  memories: RecordEntity[];
  createdAt: Date;
}
