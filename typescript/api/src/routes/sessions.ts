import express from 'express';
import { body } from 'express-validator';
import validationHandler from '../middleware/validationHandler';
import user from '../services/user';
import Response from '../utils/response';
import token from '../services/token';

const router = express.Router();

const postValidators = [
    body('username').isString().withMessage('Username should be a string'),
    body('password').isString().withMessage('Password should be a string')
];

const deleteValidators = [
    body('refreshToken').isString().withMessage('Refresh token should be a string')
];

const putValidators = [
    body('accessToken').isString().withMessage('Access token should be a string'),
    body('refreshToken').isString().withMessage('Refresh token should be a string')
];

class SessionsResponse extends Response {
    public refreshToken: string = "";
    public accessToken: string = "";
    public username: string = "";
    public userId: string = "";
};

router.get('/sessions/:refreshToken', async (req: express.Request, res: express.Response) => {
    let response = new SessionsResponse();

    return res.status(await token.verifyRefreshToken(req.params.refreshToken) ? 200 : 401).json(response);
});

router.post('/sessions', postValidators, validationHandler, async (req: express.Request, res: express.Response) => {
    let response = new SessionsResponse();
    response.username = req.body.username;

    let userData = await user.findByCredentials(req.body.username, req.body.password);
    if(!userData) {
        response.appendError("Invalid username or password");
        return res.status(400).json(JSON.stringify(response));
    }

    let tokens = await token.generateTokens(userData._id.toString(), req.body.username);
    response.accessToken = tokens.access;
    response.refreshToken = tokens.refresh;
    response.userId = userData._id.toString();
    res.status(200).json(JSON.stringify(response));
});

router.delete('/sessions/:refreshToken', async (req: express.Request, res: express.Response) => {
    let response = new SessionsResponse();
    await token.removeRefreshToken(req.params.refreshToken);
    res.status(200).json(JSON.stringify(response));
});

router.put('/sessions', putValidators, validationHandler, async (req: express.Request, res: express.Response) => {
    let response = new SessionsResponse();

    let decodedAccessToken = token.decodeAccessToken(req.body.accessToken);
    if(!decodedAccessToken) return res.status(401).json(JSON.stringify(response));
    console.log(decodedAccessToken);

    let username = (<any>decodedAccessToken).username;
    let userId = (<any>decodedAccessToken).userid;

    if(!await token.verifyRefreshToken(req.body.refreshToken, userId)) return res.status(401).json(JSON.stringify(response));

    console.log(decodedAccessToken);

    await token.removeRefreshToken(req.body.refreshToken);

    let newTokens = await token.generateTokens(userId, username);
    response.accessToken = newTokens.access;
    response.refreshToken = newTokens.refresh;

    return res.status(200).json(JSON.stringify(response));
});

module.exports = router;