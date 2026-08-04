export const sendValidateCode = async (code, challengeId) => {
    const response = await fetch (`${process.env.REACT_APP_API_URL}/auth/validate-code`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify ({challengeId, code}),
        }).catch ((error) => {
            throw new Error ("Erro ao enviar requisição");
        });

    const data = await response.json ();

    if (!response.ok) {
        throw new Error (data.message);
    }

    return data;
}

export const sendResendCode = async (challengeId) => {
    const response = await fetch (`${process.env.REACT_APP_API_URL}/auth/resend-code/${challengeId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    }).catch ((error) => { throw new Error ("Erro ao enviar requisição")});

    const data = await response.json ();

    if (!response.ok) {
        throw new Error ("Erro ao reenviar código");
    }

    return data;
}