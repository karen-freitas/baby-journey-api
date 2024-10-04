import { Inject, Injectable } from "@nestjs/common";

import { RecordEntity } from "../entity/record";
import { BabyJourneyRepositoryInterface } from "../interface/baby-journey.repository";
import { BabyJourneyDocument } from "../../adapter/schemas/baby-journey.schema";
import { AzureBlobServiceInterface } from "../interface/azure-blob.service";

@Injectable()
export class BabyJourneyService {
  constructor(
    @Inject(BabyJourneyRepositoryInterface) private readonly babyJourneyRepository: BabyJourneyRepositoryInterface,
    @Inject(AzureBlobServiceInterface) private readonly blobService: AzureBlobServiceInterface
  ) { }

  async saveMilestone(id: string, milestone: RecordEntity, file: Express.Multer.File): Promise<BabyJourneyDocument> {
    const blobFileName = await this.blobService.uploadFile(file, process.env.AZURE_STORAGE_CONTAINER_NAME);
    milestone.image = blobFileName;
    const updatedUser = await this.babyJourneyRepository.saveMilestone(id, milestone);
    return updatedUser;
  }

  async saveMemory(id: string, memory: RecordEntity, file: Express.Multer.File): Promise<BabyJourneyDocument> {
    const blobFileName = await this.blobService.uploadFile(file, process.env.AZURE_STORAGE_CONTAINER_NAME);
    memory.image = blobFileName;
    const updatedUser = await this.babyJourneyRepository.saveMemory(id, memory);
    return updatedUser;
  }

  async deleteMilestone(id: string, milestoneId: string): Promise<BabyJourneyDocument> {
    const milestone = await this.babyJourneyRepository.findMilestoneById(id, milestoneId);
    await this.blobService.deleteFile(milestone.image, process.env.AZURE_STORAGE_CONTAINER_NAME);
    const updatedUser = await this.babyJourneyRepository.deleteMilestone(id, milestoneId);
    return updatedUser;
  }

  async deleteMemory(id: string, memoryId: string): Promise<BabyJourneyDocument> {
    const memory = await this.babyJourneyRepository.findMemoryById(id, memoryId);
    await this.blobService.deleteFile(memory.image, process.env.AZURE_STORAGE_CONTAINER_NAME);
    const updatedUser = await this.babyJourneyRepository.deleteMemory(id, memoryId);
    return updatedUser;
  }


}