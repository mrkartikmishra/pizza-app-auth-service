import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { IUserData } from '../types/user.types';

export class UserService {
    constructor(private _userRepository: Repository<User>) {}

    async create({ firstName, lastName, email, password }: IUserData) {
        await this._userRepository.save({
            firstName,
            lastName,
            email,
            password,
        });
    }
}
