export const validateEmail = (email, component) => {

    let emailHasError = "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim()) || !email) {
        emailHasError = "Informe um email válido";
    }

    component.setState ({emailErrorMessage: emailHasError});

    if (emailHasError !== "") return false;

    return true;
}