import User from "../models/User";
import crypto from "../utils/crypto";

const user = {
    create: async (username: string, password: string) : Promise<string> => {
        let user = new User({ 
            username: username,
            password: crypto.sha512(password)
        });
    
        try {
            await user.save();
        } catch(err: any) {
            if(err.code == 11000) {
                return 'User with this nickname already exists';
            }
        }

        return '';
    },

    findByCredentials: async (username: string, password: string) => {
        return await User.findOne({ username, password: crypto.sha512(password) });
    }
}

export default user;