import { InvalidTokenException } from "../../utils/exception/InvalidTokenException";

export const fetchUserInfos = async (token) => {
    const response = await fetch (`${process.env.REACT_APP_API_URL}/users/me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }).catch (() => {throw new Error ("Failed to fetch user infos")});

    const data = await response.json ();

    if (!response.ok) throw new Error (data.message || "Erro");

    return data;
}

export const sendRefreshToken = async (refreshToken) => {
    const response = await fetch (`${process.env.REACT_APP_API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify ({refreshToken}),
    }).catch (() => {throw new InvalidTokenException (500, "Failed to fetch user infos")});

    const data = await response.json ();

    if (!response.ok) {
        throw new InvalidTokenException (401, "Erro");
    }

    return data;
}
