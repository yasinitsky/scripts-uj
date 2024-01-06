import express, { response } from 'express';
import Response from '../utils/response';
import token from '../services/token';
import { body } from 'express-validator';

export default (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let response = new Response();
    let bearerHeader = req.headers['authorization'];
    if(!bearerHeader) return res.status(401).json(JSON.stringify(response));

    let accessToken = bearerHeader.split(' ')[1];
    if(!accessToken) return res.status(401).json(JSON.stringify(response));

    if(!token.verifyAccessToken(accessToken)) return res.status(401).json(JSON.stringify(response));

    next();
};