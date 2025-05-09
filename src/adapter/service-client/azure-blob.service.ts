import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AzureBlobServiceInterface } from '../../domain/interface/azure-blob.service';
import { v4 } from 'uuid';
import { EnvironmentConfig } from '../../configs/environment.config';
import { Readable } from 'stream';
import * as fs from 'fs';

@Injectable()
export class AzureBlobService implements AzureBlobServiceInterface {
  constructor(private readonly environmentConfig: EnvironmentConfig) {}

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
      throw new InternalServerErrorException(
        'Failed to get BlobClient',
        error.message
      );
    }
  }

  public async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const fileName = v4() + file.originalname;
      const blobClient = this.getBlobClient(fileName);
      const stream = Readable.from(file.buffer);
      await blobClient.uploadStream(stream);
      return fileName;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to upload file to Azure Blob Storage',
        error.message
      );
    }
  }

  public async deleteFile(filename: string): Promise<void> {
    try {
      const blobClient = this.getBlobClient(filename);
      await blobClient.deleteIfExists();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete file from Azure Blob Storage',
        error.message
      );
    }
  }

  public async downloadFile(filename: string): Promise<Buffer> {
    try {
      const blobClient = this.getBlobClient(filename);
      const downloadResponse = await blobClient.downloadToBuffer();
      return downloadResponse;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to download file from Azure Blob Storage',
        error.message
      );
    }
  }

  public async downloadFileToPath(filename: string, path: string): Promise<void> {
    try {
      const blobClient = this.getBlobClient(filename);
      const writableStream = fs.createWriteStream(path);
      const downloadResponse = await blobClient.download(0);
      downloadResponse.readableStreamBody?.pipe(writableStream);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to download file to path from Azure Blob Storage',
        error.message
      );
    }
  }
}
