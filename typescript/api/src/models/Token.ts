import { Schema, model } from "mongoose";

const token = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    token: {
        type: String,
        unique: true
    }
});

export default model('Token', token);