import { NextFunction, Response } from 'express';

import { ICreateUserRequest } from '../types/user.types';
import { Logger } from 'winston';
import { UserService } from '../services/UserService';
import { validationResult } from 'express-validator';

export class AuthController {
    constructor(
        private _userService: UserService,
        private _logger: Logger,
    ) {}

    async register(req: ICreateUserRequest, res: Response, next: NextFunction) {
        //check email is present or not
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

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
