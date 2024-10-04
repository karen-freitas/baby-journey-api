import { RecordEntity } from "./record";
import { UserEntity } from "./user";

export class BabyJourneyEntity extends UserEntity {
  milestones: RecordEntity[];
  memories: RecordEntity[];
}
