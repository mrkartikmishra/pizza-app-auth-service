import { Response } from 'express';
import { ICreateUserRequest } from '../types/user.types';
import { UserService } from '../services/UserService';

export class AuthController {
    constructor(private _userService: UserService) {}

    async register(req: ICreateUserRequest, res: Response) {
        const { firstName, lastName, email, password } = req.body;

        await this._userService.create({
            firstName,
            lastName,
            email,
            password,
        });

        res.status(201).json({ msg: 'success' });
    }
}
