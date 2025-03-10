import 'reflect-metadata';

import express, { NextFunction, Request, Response } from 'express';

import { HttpError } from 'http-errors';
import authRouter from './routes/auth.route';
import cookieParser from 'cookie-parser';
import logger from './config/logger';

const app = express();

app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('Welcome to Auth Service!!');
});

app.use('/auth', authRouter);

//Global error handler

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);

    const statusCode = err.status || 500;

    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                status: statusCode,
                path: '',
                location: '',
            },
        ],
    });
});

export default app;
