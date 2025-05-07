import { BabyJourneyDocument } from 'src/domain/model/baby-journey.model';
import mongoose from 'mongoose';

interface Record extends Document {
  title: string;
  description: string;
  date: string;
  image: string;
}

const RecordSchema = new mongoose.Schema<Record>({
  title: { type: String, required: true },
  description: { type: String, required: false },
  date: { type: String, required: true },
  image: { type: String, required: true },
});

export const BabyJourneySchema = new mongoose.Schema<BabyJourneyDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  milestones: [{ type: RecordSchema }],
  memories: [{ type: RecordSchema }],
  createdAt: { type: Date, default: Date.now },
});
