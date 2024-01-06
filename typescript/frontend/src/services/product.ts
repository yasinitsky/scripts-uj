import axios from 'axios';

const product =  {
    get: (category?: string) => {
        return axios.get(`/products/${category}`);
    },
    getOne: (id: string) => {
        return axios.get(`/product/${id}`);
    }
};

export default product;