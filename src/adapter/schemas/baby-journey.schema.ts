import { RecordEntity } from '../../domain/entity/record';
import mongoose from 'mongoose';

interface Record extends Document {
  title: string;
  description: string;
  date: Date;
  image: string;
}

const RecordSchema = new mongoose.Schema<Record>({
  title: { type: String, required: true },
  description: { type: String, required: false },
  date: { type: Date, required: true },
  image: { type: String, required: true },
});

export interface BabyJourneyDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  milestones: RecordEntity[];
  memories: RecordEntity[];
  createdAt: Date;
}

export const BabyJourneySchema = new mongoose.Schema<BabyJourneyDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  milestones: [{ type: RecordSchema }],
  memories: [{ type: RecordSchema }],
  createdAt: { type: Date, default: Date.now },
});
