import { NextFunction, Response } from 'express';

import { CredentialService } from '../services/CredentialService';
import { ICreateUserRequest } from '../types/user.types';
import { JwtPayload } from 'jsonwebtoken';
import { Logger } from 'winston';
import { TokenService } from '../services/TokenService';
import { UserService } from '../services/UserService';
import createHttpError from 'http-errors';
import { validationResult } from 'express-validator';

export class AuthController {
    constructor(
        private _userService: UserService,
        private _logger: Logger,
        private _tokenService: TokenService,
        private _credentialService: CredentialService,
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

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = this._tokenService.generateAccessToken(payload);

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60, //1h
                httpOnly: true,
            });

            // Persists refresh token in the DB

            const newRefreshToken =
                await this._tokenService.persistRefreshToken(user);

            const refreshToken = this._tokenService.generateRefreshToken({
                ...payload,
                id: newRefreshToken?.id,
            });

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

    async login(req: ICreateUserRequest, res: Response, next: NextFunction) {
        //check email is present or not
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { email, password } = req.body;

        this._logger.debug('User login request', {
            email,
            password: '*****',
        });

        //Check email exists or not

        const user = await this._userService.findByEmail(email);

        if (!user) {
            const error = createHttpError(
                400,
                'Email or Password does not match!!',
            );

            next(error);
            return;
        }

        const passwordMatch = await this._credentialService.comparePassword(
            password,
            user.password,
        );

        if (!passwordMatch) {
            const error = createHttpError(
                400,
                'Email or Password does not match!!',
            );

            next(error);
            return;
        }

        const payload: JwtPayload = {
            sub: String(user.id),
            role: user.role,
        };

        const accessToken = this._tokenService.generateAccessToken(payload);

        res.cookie('accessToken', accessToken, {
            domain: 'localhost',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60, //1h
            httpOnly: true,
        });

        // Persists refresh token in the DB

        const newRefreshToken =
            await this._tokenService.persistRefreshToken(user);

        const refreshToken = this._tokenService.generateRefreshToken({
            ...payload,
            id: newRefreshToken?.id,
        });

        res.cookie('refreshToken', refreshToken, {
            domain: 'localhost',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 365, //1y
            httpOnly: true,
        });

        this._logger.info('User logged in successfully!!');

        res.status(200).json({ id: user.id });
    }
}
