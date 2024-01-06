import mongoose from 'mongoose';
import User from '../models/User';

const database = {
    connect: async (address: string, port: number, name: string) : Promise<void> => {
        mongoose.connect(`mongodb://${address}:${port}/${name}`);
    },
}

export default database;