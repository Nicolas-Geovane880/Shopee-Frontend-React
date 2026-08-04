export const validateLogin = (email, password, component) => {
    let emailHasError = "";
    let passwordHasError = "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
        emailHasError = "Informe um email válido";
    }

    if (!password) {
        passwordHasError = "Não deixe esse campo em branco";
    }

    component.setState ({emailErrorMessage: emailHasError, passwordErrorMessage: passwordHasError});

    if (emailHasError !== "" || passwordHasError !== "") {
        return false;
    }

    return true;
}