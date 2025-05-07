export interface AzureBlobServiceInterface {
  uploadFile(file: Express.Multer.File): Promise<string>;
  deleteFile(filename: string): Promise<void>;
  downloadFile(filename: string): Promise<Buffer>;
}

export const AzureBlobServiceInterface = Symbol('AzureBlobServiceInterface');
