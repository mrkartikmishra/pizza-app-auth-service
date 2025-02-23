import express, { NextFunction, Request, Response } from 'express';

import { AppDataSource } from '../config/db';
import { AuthController } from '../controllers/AuthController';
import { User } from '../entity/User';
import { UserService } from '../services/UserService';
import logger from '../config/logger';
import registerValidator from '../validators/register-validator';

const router = express.Router();

const userReposotory = AppDataSource.getRepository(User);
const userService = new UserService(userReposotory);
const authController = new AuthController(userService, logger);

router.post(
    '/register',
    registerValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authController.register(req, res, next),
);

export default router;
