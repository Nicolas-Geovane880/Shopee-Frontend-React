import React from "react";
import { sendForgotPassword } from "./fetch";
import minimalistIconUltra from "../../assets/images/minimalist-ultra-icon.png";
import errorIcon from "../../assets/images/close.png"
import { validateEmail } from "./validadeEmail";
import "./style.css"


class ForgotPassword extends React.Component {

    constructor (props) {
        super (props);

        this.state = {
            email: "",

            emailErrorMessage: "",
            hiddenErrorMessage: "hidden",

            errorMessage: "",

            sentRequest: false,

            loading: false,
        };

        this.forgotPassword = this.forgotPassword.bind (this);
    }

    async forgotPassword () {
        const isValid = validateEmail (this.state.email, this);

        if (!isValid) return;

        this.setState ({loading: true});
        try {
            const isSuccess = await sendForgotPassword (this.state.email);
    
            if (isSuccess) this.setState ({sentRequest: true});
    
            else this.setState ({sentRequest: false});
        } catch (error) {
            this.setState ({errorMessage: error.message, hiddenErrorMessage: "show"});
        } finally {
            this.setState ({loading: false});
        }

    }

    render () {
        if (this.state.sentRequest) {
            return (
                <div>
                    <header id="this-home-header">
                        <img src={minimalistIconUltra}></img>
                        
                        <h2>Esqueci minha senha</h2>
                    </header>

                    <div id="validate-code-container">
                        <h2>O link de recuperação foi enviado para o email informado</h2>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <div id="signup-error-message" className={this.state.hiddenErrorMessage}><img id="error-icon" src={errorIcon}></img>{this.state.errorMessage}</div>
                <header id="this-home-header">
                    <img src={minimalistIconUltra}></img>
                    
                    <h2>Esqueci minha senha</h2>
                </header>

                <div id="validate-code-container">
                    <h2 id="forgot-password-heading">Informe seu endereço de email para mandarmos o link de recuperação</h2>

                    <span>{this.state.emailErrorMessage}</span>

                    <div id="validate-code-input">
                        <input
                            value={this.state.code} 
                            onChange={(e) => this.setState ({email: e.target.value, hiddenErrorMessage: "hidden"})} 
                            placeholder="E-mail"
                            className={this.state.emailErrorMessage !== "" ? "field-has-error" : "field-has-no-error"}>
                        </input>

                        <button onClick={this.forgotPassword} disabled={this.state.loading}>{this.state.loading ? 
                                (
                                    <span className="button-spinner"></span>
                                ) :
                                ("ENVIAR LINK")}</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ForgotPassword;