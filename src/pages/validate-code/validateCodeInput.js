export const validateCodeInput = (component) => {
    let codeHasError = "";

    const regex = /^\d+$/;

    if (!component.state.code || component.state.code.length < 6 || !regex.test (component.state.code)) {
        codeHasError = "O código deve ter 6 dígitos númericos";
    }

    component.setState ({codeErrorMessage: codeHasError});

    if (codeHasError !== "") return false;

    return true;
}