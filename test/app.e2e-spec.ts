import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppController } from '../src/core/app.controller';
import { AppService } from '../src/core/app.service';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect({ message: 'Welcome to the Gateway Service' });
    });

    it('/health (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get('/health')
            .expect(200);

        expect(response.body).toMatchObject({ status: 'ok' });
        expect(typeof response.body.timestamp).toBe('string');
    });
});
