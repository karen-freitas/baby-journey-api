import { Module } from '@nestjs/common';
import { AppController } from './adapter/controller/baby-journey.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BabyJourneySchema } from './adapter/schemas/baby-journey.schema';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './domain/service/user.service';
import { AuthController } from './adapter/controller/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{ name: 'BabyJourney', schema: BabyJourneySchema }]),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, UsersService],
  exports: [UsersService]
})
export class AppModule { }
