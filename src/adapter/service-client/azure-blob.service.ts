import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import { Injectable } from "@nestjs/common";
import { AzureBlobServiceInterface } from "../../domain/interface/azure-blob.service";
import { v4 } from "uuid";

@Injectable()
export class AzureBlobService implements AzureBlobServiceInterface {
  containerName: string;
  azureConnection = process.env.AZURE_STORAGE_CONNECTION_STRING;

  private getBlobClient(imageName: string): BlockBlobClient {
    try {
      const blobClientService = BlobServiceClient.fromConnectionString(this.azureConnection);
      const containerClient = blobClientService.getContainerClient(this.containerName);
      const blobClient = containerClient.getBlockBlobClient(imageName);
      return blobClient;
    } catch (error) {
      console.error('Error getting BlobClient:', error);
      throw new Error('Failed to get BlobClient');
    }
  }

  public async uploadFile(file: Express.Multer.File, containerName: string): Promise<string> {
    try {
      this.containerName = containerName;
      const fileName = v4() + file.originalname;
      const blobClient = this.getBlobClient(fileName);
      await blobClient.uploadData(file.buffer);
      return fileName;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  public async deleteFile(filename: string, containerName: string): Promise<void> {
    try {
      this.containerName = containerName;
      const blobClient = this.getBlobClient(filename);
      await blobClient.deleteIfExists();
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }
}