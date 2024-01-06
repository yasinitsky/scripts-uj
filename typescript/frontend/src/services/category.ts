import axios from 'axios';

const category = {
    getAll: () => {
        return axios({
            method: 'get',
            url: 'categories'
        });
    }
};

export default category;