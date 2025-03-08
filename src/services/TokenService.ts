import jwt, { JwtPayload } from 'jsonwebtoken';

import { Config } from '../config';
import { RefreshToken } from '../entity/RefreshToken';
import { Repository } from 'typeorm';
import { User } from '../entity/User';
import createHttpError from 'http-errors';
import fs from 'fs';
import path from 'path';

export class TokenService {
    constructor(private refreshTokenRepository: Repository<RefreshToken>) {}

    generateAccessToken(payload: JwtPayload) {
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
            throw error;
        }
        const accessToken = jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1h',
            issuer: 'auth-service',
        });

        return accessToken;
    }

    generateRefreshToken(payload: JwtPayload) {
        const refreshToken = jwt.sign(payload, Config.REFRESH_TOKEN_SECRET!, {
            algorithm: 'HS256',
            expiresIn: '1y',
            issuer: 'auth-service',
            jwtid: String(payload.id),
        });

        return refreshToken;
    }

    async persistRefreshToken(user: User) {
        // Persists refresh token in the DB

        const YEAR_IN_MS = 1000 * 60 * 60 * 24 * 365; // 1 year

        const newRefreshToken = await this.refreshTokenRepository.save({
            expiresAt: new Date(Date.now() + YEAR_IN_MS),
            user: user,
        });

        return newRefreshToken;
    }
}
