import { existsByEmail } from "./fetch";

export const validateSignup = async (event, component) => {
    event.preventDefault ();

    let nameHasError = "";
    let emailHasError = "";
    let passwordHasError = "";
    let confirmPasswordHasError = "";

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)\S{8,}$/;

    if (component.state.name.length <= 10) {
        nameHasError = "Nome deve ter no mínimo 10 dígitos";
    }

    if (component.state.email.length < 10 || !component.state.email.includes ("@") || !component.state.email.includes (".com")) {
        emailHasError = "E-mail deve ter no mínimo 10 dígitos e ser válido";
    }

    if (emailHasError === "") {
        try {
            const byEmail = await existsByEmail (component.state.email, component);

            console.log("BY EMAIL:", byEmail);
        
            if (byEmail) {
                emailHasError = "E-mail já utilizado";
            }
        } catch (error) {
            component.setState ({errorMessage: "Erro ao enviar a requisição", hiddenErrorMessage: "show"});
        }
    }

    if (!passwordRegex.test(component.state.password)) {
        passwordHasError = "Mínimo 8 dígitos com pelo menos 1 número e sem espaços";
    }

    if (component.state.password !== component.state.confirmPassword) {
        confirmPasswordHasError = "As senhas devem ser iguais";
    }

    component.setState ({
        nameErrorMessage: nameHasError,
        emailErrorMessage: emailHasError,
        passwordErrorMessage: passwordHasError,
        confirmPasswordErrorMessage: confirmPasswordHasError,
    });

    if (nameHasError !== "" || emailHasError !== "" || passwordHasError !== "" || confirmPasswordHasError !== "") {
        return false;
    }

    return true;
}