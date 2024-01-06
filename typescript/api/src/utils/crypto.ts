import crypto from 'crypto';

export default {
    sha512: (str: string) : string => {
        return crypto.createHash('sha512').update(str, 'utf-8').digest('hex');
    }
};