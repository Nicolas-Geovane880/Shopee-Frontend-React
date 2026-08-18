import React from "react";
import { sendResendCode, sendValidateCode } from "./fetch";
import minimalistIcon from "../../assets/images/teste1.png";
import "./validate-code.css"
import { validateCodeInput } from "./validateCodeInput";
import DinamicButton from "../../components/DinamicButton";
import AOS from "aos";
import "aos/dist/aos.css"

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

            loading: false,
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

        AOS.init ({
            duration: 800,
            once: true
        })
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

        this.setState ({loading: true});

        try {
            const data = await sendValidateCode (this.state.code, this.state.challengeId);

            if (!data) return;

            localStorage.setItem ("accessToken", data.accessToken.code);
            localStorage.setItem ("refreshToken", data.refreshToken.code);

            window.location.href = "/";

        } catch (error) {
            this.setState ({errorMessage: error.message, hiddenErrorMessage: "show"});
        } finally {
            this.setState ({loading: false});
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
            <div id="validate-code-main-container">

                <div id="signup-error-message" className={this.state.hiddenErrorMessage}><span id="error-icon">⨂</span>{this.state.errorMessage}</div>
                <header id="this-home-header">
                    <img src={minimalistIcon} alt=""></img>
                    
                    <h2>Validar código</h2>
                </header>

                <div id="validate-code-container" data-aos="fade-up">
                    <h2>Um código de verificação foi enviado para o email informado</h2>


                    <div id="validate-code-ctn">
                        <span className="validate-code-error-message">{this.state.codeErrorMessage}</span>
                        <input
                            id="validate-code-input"
                            value={this.state.code} 
                            onChange={(e) => this.setState ({code: e.target.value, hiddenErrorMessage: "hidden"})} 
                            placeholder="Insira o código"
                            className={this.state.codeErrorMessage !== "" ? "field-has-error" : "field-has-no-error"}>
                        </input>

                        <span
                            className={this.state.resendCooldown > 0 ? "disabled" : "unabled"}
                            id="resend-code-span"
                            onClick={this.state.resendCooldown <= 1 ? this.resendCode : () => {}}>{this.state.resendCooldown > 0 ? 
                            `Reenviar código em ${this.state.resendCooldown}` : 
                            "Reenviar código"}
                        </span>
                    </div>

                    <DinamicButton act={this.state.loading ? () => {} : this.validateCode}
                                   isLoading={this.state.loading}
                                   isDisabled={this.state.disabled}
                                   text={this.state.loading ? "Validando" : "Validar código"}/>
                </div>
            </div>
        )
    }
}

export default ValidateCode;