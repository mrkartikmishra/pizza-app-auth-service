import { Request } from 'express';

export interface IUserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface ICreateUserRequest extends Request {
    body: IUserData;
}

export interface AuthRequest extends Request {
    auth: {
        sub: number;
        role: string;
    };
}
