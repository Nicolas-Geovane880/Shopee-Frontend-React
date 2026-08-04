import React from "react";
import { sendResendCode, sendValidateCode } from "./fetch";
import minimalistIconUltra from "../../assets/images/minimalist-ultra-icon.png";
import "./validate-code.css"
import errorIcon from "../../assets/images/close.png"
import { validateCodeInput } from "./validateCodeInput";

class ValidateCode extends React.Component {

    constructor (props) {
        super (props);

        this.state = {
            code: "",
            resendCooldown: 60,
            challengeId: "",

            codeErrorMessage: "",

            errorMessage: "",
            hiddenErrorMessage: "hidden",
        }

        this.startCooldown = this.startCooldown.bind (this);
        this.validateCode = this.validateCode.bind (this);
        this.resendCode = this.resendCode.bind (this);
    }

    intervalId = null;

    componentDidMount () {
        this.startCooldown ();
        const params = new URLSearchParams (window.location.search);
        const challengeId = params.get ("challengeId");

        this.setState ({challengeId});
    }

    componentWillUnmount () {
        clearInterval (this.intervalId);    
    }

    startCooldown () {
        clearInterval (this.intervalId);

        this.intervalId = setInterval (() => {
            this.setState ((prevState) => {
                if (prevState.resendCooldown <= 1) {
                    clearInterval (this.intervalId);
                    return { resendCooldown: 0 }
                }

                return { resendCooldown: prevState.resendCooldown - 1 }
            });
        }, 1000)
    }

    async validateCode () {
        const isValid = validateCodeInput (this);

        if (!isValid) return;

        try {
            const data = await sendValidateCode (this.state.code, this.state.challengeId);

            if (!data) return;

            localStorage.setItem ("accessToken", data.accessToken.code);
            localStorage.setItem ("refreshToken", data.refreshToken.code);

            window.location.href = "/";

        } catch (error) {
            this.setState ({errorMessage: error.message, hiddenErrorMessage: "show"});
        }
    }

    async resendCode () {
        try {
            const data = await sendResendCode (this.state.challengeId);

            this.setState ({challengeId: data.challengeId, resendCooldown: 60}, () => {
                this.startCooldown ();
            });

        } catch (error) {
            this.setState ({errorMessage: error.message, hiddenErrorMessage: "show"});
        }
    }

    render () {
        return (
            <div id="main-container">
                <div id="signup-error-message" className={this.state.hiddenErrorMessage}><img id="error-icon" src={errorIcon}></img>{this.state.errorMessage}</div>
                <header id="this-home-header">
                    <img src={minimalistIconUltra}></img>
                    
                    <h2>Validar código</h2>
                </header>

                <div id="validate-code-container">
                    <h2>Um código de verificação foi enviado para o email informado</h2>

                    <span>{this.state.codeErrorMessage}</span>
                    <div id="validate-code-input">
                        <input
                            value={this.state.code} 
                            onChange={(e) => this.setState ({code: e.target.value, hiddenErrorMessage: "hidden"})} 
                            placeholder="Insira o código"
                            className={this.state.codeErrorMessage !== "" ? "field-has-error" : "field-has-no-error"}>
                        </input>

                        <button onClick={this.validateCode}>VALIDAR CÓDIGO</button>
                    </div>

                    <button disabled={this.state.resendCooldown > 0} id="resend-code-btn" onClick={this.resendCode}>
                        {this.state.resendCooldown > 0 ? 
                        `Reenviar código em ${this.state.resendCooldown}` : 
                        "Reenviar código"}
                    </button>   
                </div>
            </div>
        )
    }
}

export default ValidateCode;