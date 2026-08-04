export const signup = async (component) => {
    component.setState ({loading: true});
    
    try {
        const response = await fetch("http://localhost:3001/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: component.state.name,
            email: component.state.email,
            password: component.state.password,
        }),
        });

        const data = await response.json();

        if (!response.ok) {
            component.setState ({errorMessage: data.message || "Erro ao cadastrar", hiddenErrorMessage: "show"});
            return;
        }

        window.location.href = "/login";
    } catch (error) {
        component.setState ({errorMessage: "Erro ao enviar a requisição", hiddenErrorMessage: "show"});
    } finally {
        component.setState ({loading: false});
    }
}

export const existsByEmail = async (email) => {
    const response = await fetch ("http://localhost:3001/users/validate-email", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify ({email}),
    });

    if (!response.ok) {
        return true;
    }

    return false;
}