export interface AzureBlobServiceInterface {
  uploadFile(file: Express.Multer.File, containerName: string): Promise<string>;
  deleteFile(filename: string, containerName: string): Promise<void>;
}

export const AzureBlobServiceInterface = Symbol('AzureBlobServiceInterface');

