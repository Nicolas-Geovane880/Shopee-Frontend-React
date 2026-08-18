import React from "react";
import { sendForgotPassword } from "./fetch";
import minimalistIcon from "../../assets/images/teste1.png";
import errorIcon from "../../assets/images/close.png"
import { validateEmail } from "./validadeEmail";
import "./style.css"
import DinamicButton from "../../components/DinamicButton";
import AOS from "aos";
import "aos/dist/aos.css"

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

    componentDidMount () {
        AOS.init ({
            duration: 800,
            once: true
        })
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
                <div id="forgot-psw-main-container">
                    <header id="this-home-header">
                        <img src={minimalistIcon} alt=""></img>
                        
                        <h2>Esqueci minha senha</h2>
                    </header>

                    <div id="forgot-password-container-sent">
                        <h2>O link de recuperação foi enviado para <span>{this.state.email}</span></h2>
                    </div>
                </div>
            );
        }

        return (
            <div id="forgot-psw-main-container">
                <div id="signup-error-message" className={this.state.hiddenErrorMessage}><span id="error-icon">⨂</span>{this.state.errorMessage}</div>
                <header id="this-home-header">
                    <img src={minimalistIcon} alt=""></img>
                    
                    <h2>Esqueci minha senha</h2>
                </header>

                <div id="forgot-password-container" data-aos="fade-up">

                    <div id="forgot-psw-input">
                        <h2 id="forgot-password-heading">Informe seu email para mandarmos o link de recuperação</h2>

                        <span className="forgot-psw-error-message">{this.state.emailErrorMessage}</span>
                        <input
                            value={this.state.code} 
                            onChange={(e) => this.setState ({email: e.target.value, hiddenErrorMessage: "hidden"})} 
                            placeholder="E-mail"
                            className={this.state.emailErrorMessage !== "" ? "field-has-error" : "field-has-no-error"}>
                        </input>

                        <DinamicButton text={this.state.loading ? "Enviando" : "Enviar link"} isDisabled={this.state.loading} isLoading={this.state.loading} act={this.forgotPassword}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default ForgotPassword;