import { IUserData } from '../types/user.types';
import { Repository } from 'typeorm';
import { Roles } from '../constants';
import { User } from '../entity/User';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

export class UserService {
    constructor(private _userRepository: Repository<User>) {}

    async create({ firstName, lastName, email, password }: IUserData) {
        //hash the password
        const SALT_ROUNDS = 10;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        try {
            return await this._userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: Roles.CUSTOMER,
            });

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            const error = createHttpError(
                500,
                'Failer to store regsiter user data in the database',
            );

            throw error;
        }
    }
}
