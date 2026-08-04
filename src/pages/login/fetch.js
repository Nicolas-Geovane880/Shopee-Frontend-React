export const sendLogin = async (email, password) => {
    
    const response = await fetch (`${process.env.REACT_APP_API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify ({email, password}),
        }).catch (() => { throw new Error ("Erro ao enviar requisição")});

    const data = await response.json ();

    if (response.status === 400) {
        throw new Error ("Credenciais inválidas");
    }

    return data;
}