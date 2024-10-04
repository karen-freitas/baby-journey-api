import { Module } from '@nestjs/common';
import { AppController } from './adapter/controller/baby-journey.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BabyJourneySchema } from './adapter/schemas/baby-journey.schema';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './domain/service/user.service';
import { AuthController } from './adapter/controller/auth.controller';
import { BabyJourneyRepository } from './adapter/repository/baby-journey.repository';
import { AuthService } from './domain/service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './adapter/controller/user.controller';
import { BabyJourneyService } from './domain/service/baby-journey.service';
import { BabyJourneyRepositoryInterface } from './domain/interface/baby-journey.repository';
import { AzureBlobService } from './adapter/service-client/azure-blob.service';
import { AzureBlobServiceInterface } from './domain/interface/azure-blob.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: 'BabyJourney', schema: BabyJourneySchema },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),
  ],
  controllers: [AppController, AuthController, UserController],
  providers: [
    UsersService,
    AuthService,
    BabyJourneyService,
    AzureBlobService,
    {
      provide: BabyJourneyRepositoryInterface,
      useClass: BabyJourneyRepository,
    },
    {
      provide: AzureBlobServiceInterface,
      useClass: AzureBlobService,
    }
  ],
})
export class AppModule { }
