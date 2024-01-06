import { Schema, model } from 'mongoose';

interface IProduct {
    name: string,
    price: number,
    category: Schema.Types.ObjectId
};

const product = new Schema<IProduct>({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
});

export default model('Product', product);