import app from './app';
import { calculateDiscountPrice } from './utils';
import request from 'supertest';

describe('App Test case', () => {
    it('Should calculate discount amount', () => {
        const discount = calculateDiscountPrice(200, 10);
        expect(discount).toBe(20);
    });

    it('Should return 200 status code', async () => {
        const response = await request(app).get('/').send();

        expect(response.statusCode).toBe(200);
    });
});
