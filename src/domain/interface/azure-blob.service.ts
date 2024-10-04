export interface AzureBlobServiceInterface {
  uploadFile(file: Express.Multer.File): Promise<string>;
  deleteFile(filename: string): Promise<void>;
}

export const AzureBlobServiceInterface = Symbol('AzureBlobServiceInterface');
