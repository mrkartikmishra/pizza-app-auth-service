import { NextFunction, Response } from 'express';
import { ICreateUserRequest } from '../types/user.types';
import { UserService } from '../services/UserService';
import { Logger } from 'winston';

export class AuthController {
    constructor(
        private _userService: UserService,
        private _logger: Logger,
    ) {}

    async register(req: ICreateUserRequest, res: Response, next: NextFunction) {
        const { firstName, lastName, email, password } = req.body;

        this._logger.debug('New user registration request', {
            firstName,
            lastName,
            email,
            password: '*****',
        });

        try {
            const user = await this._userService.create({
                firstName,
                lastName,
                email,
                password,
            });

            this._logger.info('User registered successfully!!', {
                id: user.id,
            });

            res.status(201).json({ id: user.id });
        } catch (err) {
            next(err);
            return;
        }
    }
}
