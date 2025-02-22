import express from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/db';
import { User } from '../entity/User';
import logger from '../config/logger';

const router = express.Router();

const userReposotory = AppDataSource.getRepository(User);
const userService = new UserService(userReposotory);
const authController = new AuthController(userService, logger);

router.post('/register', (req, res, next) =>
    authController.register(req, res, next),
);

export default router;
