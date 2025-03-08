import express, { NextFunction, Request, Response } from 'express';

import { AppDataSource } from '../config/db';
import { AuthController } from '../controllers/AuthController';
import { RefreshToken } from '../entity/RefreshToken';
import { TokenService } from '../services/TokenService';
import { User } from '../entity/User';
import { UserService } from '../services/UserService';
import logger from '../config/logger';
import registerValidator from '../validators/register-validator';

const router = express.Router();

const userReposotory = AppDataSource.getRepository(User);
const userService = new UserService(userReposotory);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshTokenRepository);
const authController = new AuthController(userService, logger, tokenService);

router.post(
    '/register',
    registerValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authController.register(req, res, next),
);

export default router;
