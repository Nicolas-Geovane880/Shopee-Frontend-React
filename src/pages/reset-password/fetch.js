export const sendResetPassword = async (newPassword, token) => {
    try {
        const response = await fetch (`${process.env.REACT_APP_API_URL}/auth/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify ({newPassword, token}),
        });

        if (response.ok) return true;

        return false;
    } catch (error) {
        window.alert ("Erro ao enviar requisição");
        console.log (error);
    }
}