import { Schema, model } from 'mongoose';

interface ICategory {
    name: string
};

const category = new Schema<ICategory>({
    name: {
        type: String,
        unique: true
    }
});

export default model("Category", category);