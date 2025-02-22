import express from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/db';
import { User } from '../entity/User';

const router = express.Router();

const userReposotory = AppDataSource.getRepository(User);
const userService = new UserService(userReposotory);
const authController = new AuthController(userService);

router.post('/register', (req, res) => authController.register(req, res));

export default router;
