import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { AzureBlobServiceInterface } from '../../domain/interface/azure-blob.service';
import { v4 } from 'uuid';
import { EnvironmentConfig } from '../../configs/environment.config';

@Injectable()
export class AzureBlobService implements AzureBlobServiceInterface {
  constructor(
    private readonly environmentConfig: EnvironmentConfig
  ) { }

  private getBlobClient(imageName: string): BlockBlobClient {
    try {
      const blobClientService = BlobServiceClient.fromConnectionString(
        this.environmentConfig.azureConnectionString
      );
      const containerClient = blobClientService.getContainerClient(
        this.environmentConfig.azureContainerName
      );
      const blobClient = containerClient.getBlockBlobClient(imageName);
      return blobClient;
    } catch (error) {
      console.error('Error getting BlobClient:', error);
      throw new Error('Failed to get BlobClient');
    }
  }

  public async uploadFile(
    file: Express.Multer.File,
  ): Promise<string> {
    try {
      const fileName = v4() + file.originalname;
      const blobClient = this.getBlobClient(fileName);
      await blobClient.uploadData(file.buffer);
      return fileName;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  public async deleteFile(
    filename: string,
  ): Promise<void> {
    try {
      const blobClient = this.getBlobClient(filename);
      await blobClient.deleteIfExists();
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }
}
