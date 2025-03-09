import express, { NextFunction, Request, Response } from 'express';

import { AppDataSource } from '../config/db';
import { AuthController } from '../controllers/AuthController';
import { CredentialService } from '../services/CredentialService';
import { RefreshToken } from '../entity/RefreshToken';
import { TokenService } from '../services/TokenService';
import { User } from '../entity/User';
import { UserService } from '../services/UserService';
import logger from '../config/logger';
import loginValidator from '../validators/login-validator';
import registerValidator from '../validators/register-validator';

const router = express.Router();

const userReposotory = AppDataSource.getRepository(User);
const userService = new UserService(userReposotory);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshTokenRepository);
const credentialService = new CredentialService();
const authController = new AuthController(
    userService,
    logger,
    tokenService,
    credentialService,
);

router.post(
    '/register',
    registerValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authController.register(req, res, next),
);

router.post(
    '/login',
    loginValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authController.login(req, res, next),
);

export default router;
