import Product from "../models/Product";

export default {
    findByCategory: async (categoryId: string) => {
        try {
            return await Product.find({ category: categoryId });
        } catch(error) {
            return [];
        }
    },

    findAll: async () => {
        return await Product.find();
    },

    create: async (name: string, price: number, categoryId: string) => {
        let product = new Product({
            name,
            price,
            category: categoryId
        });

        await product.save();
    },

    findById: async (productId: string) => {
        try {
            return await Product.findById(productId);
        } catch(error) {
            return null;
        }
    }
};