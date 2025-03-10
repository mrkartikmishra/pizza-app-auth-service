import JwksClient, { GetVerificationKey } from 'jwks-rsa';

import { Config } from '../config';
import { Request } from 'express';
import { expressjwt } from 'express-jwt';

export default expressjwt({
    secret: JwksClient.expressJwtSecret({
        jwksUri: Config.JWKS_URI!,
        cache: true,
        rateLimit: true,
    }) as GetVerificationKey,

    algorithms: ['RS256'],

    getToken(req: Request) {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.split(' ')[1] !== 'undefined') {
            const token = authHeader.split(' ')[1];

            if (token) {
                return token;
            }
        }

        type AuthCookies = {
            accessToken: string;
        };

        const { accessToken } = req.cookies as AuthCookies;

        return accessToken;
    },
});
