import Category from "../models/Category";

export default {
    getAllCategories: async () => {
        return await Category.find();
    },

    create: async (name: string) => {
        let category = new Category({ name });
        try {
            await category.save();
        } catch(err: any) {
            if(err.code == 11000) return 'Category with this name already exist';
        }

        return '';
    },

    findById: async (id: string) => {
        return await Category.findById(id);
    }
};