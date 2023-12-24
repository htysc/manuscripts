import { createContext } from "react";

export const defaultContext = {
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    date_joined: '',
    token: '',
};

export const getContext = () => {
    const jsonContext = localStorage.getItem('userContext');
    if (jsonContext) {
        return JSON.parse(jsonContext);
    } else {
        return defaultContext;
    }
}

export const APIContext = createContext(defaultContext);
