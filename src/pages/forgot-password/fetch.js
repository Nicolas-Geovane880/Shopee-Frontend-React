export const sendForgotPassword = async (email) => {
    const response = await fetch (`${process.env.REACT_APP_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify ({email}),
    }).catch ((error) => {throw new Error("Erro ao enviar o link");
    });

    if (response.ok) return true;

    return false;
}