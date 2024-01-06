import User from '../models/User';
import jwt from 'jsonwebtoken';
import cryptoConfig from '../configs/crypto.json';
import crypto from 'crypto';
import cryptoUtils from '../utils/crypto';
import Token from '../models/Token';

interface Tokens {
    refresh: string,
    access: string
};

const ACCESS_TOKEN_EXPIRATION = '15 minutes';
const REFRESH_TOKEN_LENGTH = 64;

const token = {
    generateTokens: async (userId: string, username: string) : Promise<Tokens> => {
        let access_token = jwt.sign({userid: userId, username}, cryptoConfig.secret_key, {
            expiresIn: ACCESS_TOKEN_EXPIRATION
        });
        let refresh_token = crypto.randomBytes(REFRESH_TOKEN_LENGTH).toString('hex');

        let token = new Token({
            token: cryptoUtils.sha512(refresh_token),
            user: userId
        });

        await token.save();

        return {
            access: access_token,
            refresh: refresh_token
        };
    },

    verifyAccessToken: (token: string) : boolean => {
        try {
            jwt.verify(token, cryptoConfig.secret_key);
            return true;
        } catch(error) {
            return false;
        }
    },

    decodeAccessToken: (token: string) => {
        try {
            return jwt.verify(token, cryptoConfig.secret_key, { ignoreExpiration: true });
        } catch(error) {
            return "";
        }
    },

    verifyRefreshToken: async (token: string, userId?: string) : Promise<boolean> => {
        let saved_token = await Token.findOne({ token: cryptoUtils.sha512(token) });
        return !!saved_token;
    },

    removeRefreshToken: async (token: string) : Promise<void> => {
        await Token.findOneAndDelete({ token });
    }
};

export default token;