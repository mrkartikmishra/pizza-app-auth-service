import { AppDataSource } from '../../src/config/db';
import { DataSource } from 'typeorm';
import { Roles } from '../../src/constants';
import { User } from '../../src/entity/User';
import app from '../../src/app';
import createJWKSMock from 'mock-jwks';
import request from 'supertest';

describe('GET /auth/self', () => {
    let connection: DataSource;

    let jwks: ReturnType<typeof createJWKSMock>;

    beforeAll(async () => {
        jwks = createJWKSMock('http://localhost:3001');
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterEach(() => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe('Given all fields', () => {
        it('should return 200 status code', async () => {
            const accessToken = jwks.token({
                sub: '1',
                role: Roles.CUSTOMER,
            });
            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken}`])
                .send();

            expect(response.statusCode).toBe(200);
        });

        it('should return the user data based on the token', async () => {
            const userData = {
                firstName: 'kartik',
                lastName: 'Mishra',
                email: 'kartikmishra@gmail.com',
                password: 'secretpassword',
            };

            const userRepository = connection.getRepository(User);

            const data = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });

            //generate token

            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role,
            });

            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken}`]);

            expect(response.body.id).toBe(data.id);
        });

        it('should not return the password field', async () => {
            const userData = {
                firstName: 'kartik',
                lastName: 'Mishra',
                email: 'kartikmishra@gmail.com',
                password: 'secretpassword',
            };

            const userRepository = connection.getRepository(User);

            const data = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });

            //generate token

            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role,
            });

            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken}`]);

            expect(response.body).not.toHaveProperty('password');
        });
    });
});
