import express from 'express';
import { body } from 'express-validator';
import validationHandler from '../middleware/validationHandler';
import User from '../models/User';
import database from '../services/database';
import crypto from '../utils/crypto';
import Response from '../utils/response';
import user from '../services/user';

const router = express.Router();

const validator = [
    body('username').isString().withMessage('Username should be a string'),
    body('username').trim().isLength({min: 3, max: 16}).withMessage('Username should contain from 3 to 16 characters'),
    body('password').isString().withMessage('Password should be a string'),
    body('password').trim().isLength({min: 3, max: 16}).withMessage('Password should contain from 3 to 16 characters'),
];

class UsersResponse extends Response {
    public username: string = "";
};

router.post('/users', validator, validationHandler, async (req: express.Request, res: express.Response) => {
    const response = new UsersResponse();

    let result = await user.create(req.body.username, req.body.password);
    if(result.length > 0) {
        response.appendError(result);
        return res.status(400).json(JSON.stringify(response));
    }

    response.username = req.body.username;
    res.status(200).json(JSON.stringify(response));
});

module.exports = router;