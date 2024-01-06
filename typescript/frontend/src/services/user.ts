import axios from "axios"

const user = {
    create: (username: string, password: string) => {
        return axios.post('/users', {
            username,
            password
        });
    }
};

export default user;