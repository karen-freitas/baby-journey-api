import { Inject, Injectable } from '@nestjs/common';

import { RecordEntity } from '../entity/record';
import { BabyJourneyRepositoryInterface } from '../interface/baby-journey.repository';
import { AzureBlobServiceInterface } from '../interface/azure-blob.service';
import { BabyJourneyDocument } from '../model/baby-journey.model';

@Injectable()
export class BabyJourneyService {
  constructor(
    @Inject(BabyJourneyRepositoryInterface)
    private readonly babyJourneyRepository: BabyJourneyRepositoryInterface,
    @Inject(AzureBlobServiceInterface)
    private readonly blobService: AzureBlobServiceInterface
  ) {}

  async saveMilestone(
    id: string,
    milestone: RecordEntity,
    file: Express.Multer.File
  ): Promise<BabyJourneyDocument> {
    const blobFileName = await this.blobService.uploadFile(file);
    milestone.image = blobFileName;
    const updatedUser = await this.babyJourneyRepository.saveMilestone(
      id,
      milestone
    );
    return updatedUser;
  }

  async saveMemory(
    id: string,
    memory: RecordEntity,
    file: Express.Multer.File
  ): Promise<BabyJourneyDocument> {
    const blobFileName = await this.blobService.uploadFile(file);
    memory.image = blobFileName;
    const updatedUser = await this.babyJourneyRepository.saveMemory(id, memory);
    return updatedUser;
  }

  async deleteMilestone(
    id: string,
    milestoneId: string
  ): Promise<BabyJourneyDocument> {
    const milestone = await this.babyJourneyRepository.findMilestoneById(
      id,
      milestoneId
    );
    await this.blobService.deleteFile(milestone.image);
    const updatedUser = await this.babyJourneyRepository.deleteMilestone(
      id,
      milestoneId
    );
    return updatedUser;
  }

  async deleteMemory(
    id: string,
    memoryId: string
  ): Promise<BabyJourneyDocument> {
    const memory = await this.babyJourneyRepository.findMemoryById(
      id,
      memoryId
    );
    await this.blobService.deleteFile(memory.image);
    const updatedUser = await this.babyJourneyRepository.deleteMemory(
      id,
      memoryId
    );
    return updatedUser;
  }

  async downloadFile(filename: string): Promise<string> {
    try {
      const fileBuffer = await this.blobService.downloadFile(filename);
      const base64Image = fileBuffer.toString('base64');
      return `data:image/jpeg;base64,${base64Image}`;
    } catch {
      throw new Error('Failed to download and convert file to image');
    }
  }

  async updateMilestone(
    id: string,
    milestoneId: string,
    milestone: RecordEntity
  ): Promise<BabyJourneyDocument> {
    const updatedUser = await this.babyJourneyRepository.updateMilestone(
      id,
      milestoneId,
      milestone
    );
    return updatedUser;
  }

  async updateMemory(
    id: string,
    memoryId: string,
    memory: RecordEntity
  ): Promise<BabyJourneyDocument> {
    const updatedUser = await this.babyJourneyRepository.updateMemory(
      id,
      memoryId,
      memory
    );
    return updatedUser;
  }
}
