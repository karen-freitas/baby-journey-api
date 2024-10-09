import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../src/adapter/controller/baby-journey.controller';
import { BabyJourneyService } from '../../src/domain/service/baby-journey.service';
import { SaveRecordDTO } from '../../src/adapter/dto/save-record';
import { AuthGuard } from '../../src/adapter/guards/auth-guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('AppController', () => {
  let app: INestApplication;
  let babyJourneyService: BabyJourneyService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: BabyJourneyService,
          useValue: {
            saveMilestone: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    babyJourneyService = moduleRef.get<BabyJourneyService>(BabyJourneyService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should save a milestone', async () => {
    const file = Buffer.from('test file content');
    const body: SaveRecordDTO = {
      userId: 'user123',
      title: 'First Steps',
      description: 'Baby took first steps',
      date: new Date(),
    };

    const expectedResponse = {
      _id: 'milestone123',
      ...body,
      fileUrl: 'http://example.com/file.jpg',
    } as any;

    jest.spyOn(babyJourneyService, 'saveMilestone').mockResolvedValue(expectedResponse);

    await request(app.getHttpServer())
      .post('/milestone')
      .set('Content-Type', 'multipart/form-data')
      .field('userId', body.userId)
      .field('title', body.title)
      .field('description', body.description)
      .field('date', body.date)
      .attach('file', file, 'milestone.jpg')
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual(expectedResponse);
      });

    expect(babyJourneyService.saveMilestone).toHaveBeenCalledWith(
      body.userId,
      expect.objectContaining({
        title: body.title,
        description: body.description,
        date: body.date,
      }),
      expect.any(Object)
    );
  });

  it('should return 422 if file type is invalid', async () => {
    const file = Buffer.from('test file content');
    const body: SaveRecordDTO = {
      userId: 'user123',
      title: 'First Steps',
      description: 'Baby took first steps',
      date: new Date(),
    };

    await request(app.getHttpServer())
      .post('/milestone')
      .set('Content-Type', 'multipart/form-data')
      .field('userId', body.userId)
      .field('title', body.title)
      .field('description', body.description)
      .field('date', body.date.toISOString())
      .attach('file', file, 'milestone.txt')
      .expect(422);
  });

  it('should return 422 if file size exceeds limit', async () => {
    const file = Buffer.alloc(3000001); // 1 byte over the limit
    const body: SaveRecordDTO = {
      userId: 'user123',
      title: 'First Steps',
      description: 'Baby took first steps',
      date: new Date(),
    };

    await request(app.getHttpServer())
      .post('/milestone')
      .set('Content-Type', 'multipart/form-data')
      .field('userId', body.userId)
      .field('title', body.title)
      .field('description', body.description)
      .field('date', body.date.toISOString())
      .attach('file', file, 'milestone.jpg')
      .expect(422);
  });
});