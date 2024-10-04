export class EnvironmentConfig {
  azureConnectionString: string = process.env.AZURE_STORAGE_CONNECTION_STRING;
  azureContainerName: string = process.env.AZURE_STORAGE_CONTAINER_NAME;
  jwtSecret: string = process.env.JWT_SECRET_KEY;
  jwtExpirationTime: string = process.env.JWT_EXPIRATION_TIME;
  mongoUri: string = process.env.MONGO_URI;
  port: number = Number(process.env.PORT);
}

export const environmentConfig = new EnvironmentConfig();