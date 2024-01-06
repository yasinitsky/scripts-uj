import axios from "axios";
import credentials from "./credentials";

const session = {
    create: (username: string, password: string) => {
        return axios.post('/sessions', {
            username,
            password
        }).then(res => {
            let data = JSON.parse(res.data);
            credentials.storeTokens(data.accessToken, data.refreshToken);
            credentials.storeUserId(data.userId);
        });
    },

    refresh: () => {
        const { accessToken, refreshToken } = credentials.getAll();

        return axios.put('/sessions', {
            accessToken,
            refreshToken
        }).then(res => {
            credentials.storeTokens(res.data.accessToken, res.data.refreshToken);
        });
    },

    destroy: () => {
        const { refreshToken } = credentials.getAll();
        credentials.clear();

        return axios.delete(`/sessions/${refreshToken}`);
    },

    check: async () => {
        const { refreshToken, userId } = credentials.getAll();
        if(refreshToken === "undefined" || userId === "undefined" || refreshToken === null || userId === null) return false;

        try {
            await axios.get(`/sessions/${refreshToken}`);

            return true;
        } catch(error) {
            return false;
        }
    }
};

export default session;