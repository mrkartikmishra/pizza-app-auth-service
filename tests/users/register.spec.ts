import { AppDataSource } from '../../src/config/db';
import { DataSource } from 'typeorm';
import { Roles } from '../../src/constants';
import { User } from '../../src/entity/User';
import app from '../../src/app';
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
                password: 'secret',
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
                password: 'secret',
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
                password: 'secret',
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
    });

    describe('All fields NOT given properly', () => {});
});
