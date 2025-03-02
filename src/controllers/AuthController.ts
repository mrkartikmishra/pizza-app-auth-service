import { NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { Config } from '../config';
import { ICreateUserRequest } from '../types/user.types';
import { Logger } from 'winston';
import { UserService } from '../services/UserService';
import createHttpError from 'http-errors';
import fs from 'fs';
import path from 'path';
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

            let privateKey: Buffer;

            try {
                privateKey = fs.readFileSync(
                    path.join(__dirname, '../../certs/private.pem'),
                );
            } catch (err) {
                const error = createHttpError(
                    500,
                    `Error while reading private key:: ${err}`,
                );
                next(error);
                return;
            }

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = jwt.sign(payload, privateKey, {
                algorithm: 'RS256',
                expiresIn: '1h',
                issuer: 'auth-service',
            });

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60, //1h
                httpOnly: true,
            });

            const refreshToken = jwt.sign(
                payload,
                Config.REFRESH_TOKEN_SECRET!,
                {
                    algorithm: 'HS256',
                    expiresIn: '1y',
                    issuer: 'auth-service',
                },
            );

            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 365, //1y
                httpOnly: true,
            });

            res.status(201).json({ id: user.id });
        } catch (err) {
            next(err);
            return;
        }
    }
}
