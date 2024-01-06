import { Schema, model } from "mongoose";

interface IUser {
    username: string,
    password: string
};

const user = new Schema<IUser>({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

export default model('User', user);