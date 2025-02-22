import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { IUserData } from '../types/user.types';
import createHttpError from 'http-errors';
import { Roles } from '../constants';

export class UserService {
    constructor(private _userRepository: Repository<User>) {}

    async create({ firstName, lastName, email, password }: IUserData) {
        try {
            return await this._userRepository.save({
                firstName,
                lastName,
                email,
                password,
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
