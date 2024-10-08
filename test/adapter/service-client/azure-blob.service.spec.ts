import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import { AzureBlobService } from "../../../src/adapter/service-client/azure-blob.service";
import { EnvironmentConfig } from "../../../src/configs/environment.config";


jest.mock('@azure/storage-blob', () => ({
  BlobServiceClient: {
    fromConnectionString: jest.fn().mockReturnValue({
      getContainerClient: jest.fn().mockReturnValue({
        getBlockBlobClient: jest.fn().mockReturnValue({
          uploadData: jest.fn(),
          deleteIfExists: jest.fn(),
        }),
      }),
    }),
  },
  BlockBlobClient: jest.fn(),
}));

describe('AzureBlobService', () => {
  let service: AzureBlobService;
  let mockBlobClient: jest.Mocked<BlockBlobClient>;
  let mockEnvironmentConfig: EnvironmentConfig;

  beforeEach(() => {
    mockEnvironmentConfig = {
      azureConnectionString: 'test-connection-string',
      azureContainerName: 'test-container-name',
    } as EnvironmentConfig;

    service = new AzureBlobService(mockEnvironmentConfig);
    mockBlobClient = BlobServiceClient.fromConnectionString(mockEnvironmentConfig.azureConnectionString)
      .getContainerClient(mockEnvironmentConfig.azureContainerName)
      .getBlockBlobClient('') as jest.Mocked<BlockBlobClient>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize with environment config', () => {
    expect(service['environmentConfig']).toBe(mockEnvironmentConfig);
  });

  it('should upload a file', async () => {
    const file = {
      originalname: 'test.png',
      buffer: Buffer.from('test'),
    } as Express.Multer.File;

    const fileName = await service.uploadFile(file);

    expect(mockBlobClient.uploadData).toHaveBeenCalledWith(file.buffer);
    expect(fileName).toContain(file.originalname);
  });

  it('should throw an error if upload fails', async () => {
    mockBlobClient.uploadData.mockRejectedValue(new Error('Upload failed'));

    const file = {
      originalname: 'test.png',
      buffer: Buffer.from('test'),
    } as Express.Multer.File;

    await expect(service.uploadFile(file)).rejects.toThrow('Failed to upload file');
  });

  it('should delete a file', async () => {
    const filename = 'test.png';

    await service.deleteFile(filename);

    expect(mockBlobClient.deleteIfExists).toHaveBeenCalled();
  });

  it('should throw an error if delete fails', async () => {
    mockBlobClient.deleteIfExists.mockRejectedValue(new Error('Delete failed'));

    const filename = 'test.png';

    await expect(service.deleteFile(filename)).rejects.toThrow('Failed to delete file');
  });
});