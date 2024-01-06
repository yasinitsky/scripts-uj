import express from 'express';
import { validationResult } from 'express-validator';
import Response from '../utils/response';

export default (req: express.Request , res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if(errors.isEmpty()) return next();

    const response = new Response();
    for(const error of errors.array()) {
        response.appendError(error.msg);
    }

    res.status(400).json(response);
};