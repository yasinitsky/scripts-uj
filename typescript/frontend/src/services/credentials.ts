interface ICredentials {
    accessToken: string | null,
    refreshToken: string | null,
    userId: string | null
};

const credentials = {
    storeTokens: (access: string, refresh: string) => {
        localStorage.setItem("access-token", access);
        localStorage.setItem("refresh-token", refresh);
    },
    storeUserId: (userId: string) => {
        localStorage.setItem("user-id", userId);
    },
    clear: () => {
        localStorage.removeItem("access-token");
        localStorage.removeItem("refresh-token");
        localStorage.removeItem("user-id");
    },
    getAll: () : ICredentials => {
        return {
            accessToken: localStorage.getItem("access-token"),
            refreshToken: localStorage.getItem("refresh-token"),
            userId: localStorage.getItem("user-id")
        }
    }
};

export default credentials;