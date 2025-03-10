import { AppDataSource } from '../../src/config/db';
import { DataSource } from 'typeorm';
import { RefreshToken } from '../../src/entity/RefreshToken';
import { Roles } from '../../src/constants';
import { User } from '../../src/entity/User';
import app from '../../src/app';
import { isJwt } from '../utils';
import request from 'supertest';

describe('POST /auth/register', () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        // Truncate tables
        // await truncateTables(connection);

        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe('All fields given properly', () => {
        it('should return 200 status code', async () => {
            //AAA

            //Arrange

            const userData = {
                firstName: 'Kartik',
                lastName: 'Mishra',
                email: 'kartikmishra@gmail.com',
                password: 'secretpassword',
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
                password: 'secretpassword',
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
                password: 'secretpassword',
            };

            //Act

            await request(app).post('/auth/register').send(userData);

            //Assert

            const repository = await connection.getRepository(User);
            const users = await repository.find();
            expect(users).toHaveLength(1);

            expect(users[0].firstName).toBe(userData.firstName);
            expect(users[0].lastName).toBe(userData.lastName);
            expect(users[0].email).toBe(userData.email);
        });

        it('should return an ID of the created user', async () => {
            //Arrange

            const userData = {
                firstName: 'Kartik',
                lastName: 'Mishra',
                email: 'kartikmishra@gmail.com',
                password: 'secretpassword',
            };

            //Act

            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            //Assert

            const repository = await connection.getRepository(User);
            const users = await repository.find();
            expect(response.body).toHaveProperty('id');

            expect(response.body.id as Record<string, string>).toBe(
                users[0].id,
            );
        });

        it('should assign customer role to the registered user', async () => {
            //Arrange

            const userData = {
                firstName: 'Kartik',
                lastName: 'Mishra',
                email: 'kartikmishra@gmail.com',
                password: 'secretpassword',
            };

            //Act

            await request(app).post('/auth/register').send(userData);

            //Assert

            const repository = await connection.getRepository(User);
            const users = await repository.find();
            expect(users[0]).toHaveProperty('role');
            expect(users[0].role).toBe(Roles.CUSTOMER);
        });

        it('should store hashed password in the database', async () => {
            //Arrange

            const userData = {
                firstName: 'Kartik',
                lastName: 'Mishra',
                email: 'kartikmishra@gamil.com',
                password: 'secretpassword',
            };

            //Act

            await request(app).post('/auth/register').send(userData);

            //Assert

            const usersRepository = AppDataSource.getRepository(User);
            const users = await usersRepository.find();
            expect(users[0].password).not.toBe(userData.password);

            expect(users[0].password).toHaveLength(60);
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
        });

        it('should return 400 status code if user email id is already exists', async () => {
            //Arrange

            const userData = {
                firstName: 'kartik',
                lastName: 'Mishra',
                email: 'kartikmishra@gmail.com',
                password: 'secretpassword',
            };

            //Act

            const userRepository = connection.getRepository(User);
            await userRepository.save({ ...userData, role: Roles.CUSTOMER });

            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            const users = await userRepository.find();

            //Assert

            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);
        });

        it('should return valid access token and refresh token', async () => {
            //Arrange

            const userData = {
                firstName: 'kartik',
                lastName: 'Mishra',
                email: 'kartikmishra@gmail.com',
                password: 'secretpassword',
            };

            //Act

            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            //Assert

            let accessToken: string | null = null;
            let refreshToken: string | null = null;

            interface Headers {
                ['set-cookie']: string[];
            }

            const cookies =
                (response.headers as unknown as Headers)['set-cookie'] || [];

            cookies.forEach((cookie) => {
                if (cookie.startsWith('accessToken=')) {
                    accessToken = cookie.split(';')[0].split('=')[1];
                }

                if (cookie.startsWith('refreshToken=')) {
                    refreshToken = cookie.split(';')[0].split('=')[1];
                }
            });

            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();

            expect(isJwt(accessToken)).toBeTruthy();
            expect(isJwt(refreshToken)).toBeTruthy();
        });

        it('should persists refresh token in the DB', async () => {
            //Arrange

            const userData = {
                firstName: 'kartik',
                lastName: 'Mishra',
                email: 'kartikmishra@gmail.com',
                password: 'secretpassword',
            };

            //Act

            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            //Assert

            const refreshTokenRepository =
                connection.getRepository(RefreshToken);

            const res = await connection.getRepository(RefreshToken).find();

            expect(res).toHaveLength(1);

            const tokens = await refreshTokenRepository
                .createQueryBuilder('refreshTokens')
                .where('refreshTokens.userId = :userId', {
                    userId: response.body.id,
                })
                .getMany();

            expect(tokens).toHaveLength(1);
        });
    });

    describe('All fields NOT given properly', () => {
        it('should return 400 status code if email field is missing', async () => {
            //Arrange

            const userData = {
                firstName: 'Kartik',
                lastName: 'Mishra',
                email: '',
                password: 'secretpassword',
            };

            //Act

            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            //Assert

            //Assert
            expect(response.statusCode).toBe(400);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(0);
        });

        it('should return 400 status code if firstName field is missing', async () => {
            //Arrange

            const userData = {
                firstName: '',
                lastName: 'Mishra',
                email: 'kartikmishra@gmail.com',
                password: 'secretpassword',
            };

            //Act

            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            //Assert

            //Assert
            expect(response.statusCode).toBe(400);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(0);
        });

        it('should return 400 status code if lastName field is missing', async () => {
            //Arrange

            const userData = {
                firstName: 'Kartik',
                lastName: '',
                email: 'kartikmishra@gmail.com',
                password: 'secretpassword',
            };

            //Act

            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            //Assert

            //Assert
            expect(response.statusCode).toBe(400);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(0);
        });

        it('should return 400 status code if password field is missing', async () => {
            //Arrange

            const userData = {
                firstName: 'Kartik',
                lastName: 'Mishra',
                email: 'kartikmishra@gmail.com',
                password: '',
            };

            //Act

            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            //Assert

            //Assert
            expect(response.statusCode).toBe(400);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(0);
        });
    });

    describe('Fields are not in proper format', () => {
        it('should trim email field if trailing space is there', async () => {
            //Arrange
            const userData = {
                firstName: 'Kartik',
                lastName: 'Mishra',
                email: ' kartikmishra@gmail.com ',
                password: 'secretpassword',
            };

            //Act
            await request(app).post('/auth/register').send(userData);

            //Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users[0].email).toBe('kartikmishra@gmail.com');
        });

        it('should return 400 status code if email is not a valid email', async () => {
            //Arrange
            const userData = {
                firstName: 'Kartik',
                lastName: 'Mishra',
                email: 'kartikmishra@gm',
                password: 'secretpassword',
            };

            //Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            //Assert
            expect(response.statusCode).toBe(400);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(0);
        });

        it('should return 400 status code if password length is less than 8 characters', async () => {
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
            expect(response.statusCode).toBe(400);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(0);
        });
    });
});
