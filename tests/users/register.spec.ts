import request from 'supertest';
import app from '../../src/app';

describe('POST /auth/register', () => {
    describe('All fields given properly', () => {
        it('should return 200 status code', async () => {
            //AAA

            //Arrange

            const userData = {
                firstName: 'Kartik',
                lastName: 'Mishra',
                email: 'kartikmishra@gmail.com',
                password: 'secret',
            };

            //Act

            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            //Assert

            expect(response.statusCode).toBe(201);
        });

        it('should return valid json data', async () => {
            //Arrange

            const userData = {
                firstName: 'Kartik',
                lastName: 'Mishra',
                email: 'kartikmishra@gmail.com',
                password: 'secret',
            };

            //Act

            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            //Assert

            expect(
                (response.headers as Record<string, string>)['content-type'],
            ).toEqual(expect.stringContaining('json'));
        });

        it('should persists the data in the database', async () => {
            //Arrange

            const userData = {
                firstName: 'Kartik',
                lastName: 'Mishra',
                email: 'kartikmishra@gmail.com',
                password: 'secret',
            };

            //Act

            await request(app).post('/auth/register').send(userData);

            //Assert
        });
    });

    describe('All fields NOT given properly', () => {});
});
