import React from "react";
import { sendLogin } from "./fetch";
import errorIcon from "../../assets/images/close.png"
import "../../global.css"
import "./login.css"
import { validateLogin } from "./validateLogin";
import "../../global.css";
import minimalistIcon from "../../assets/images/teste1.png";
import view from "../../assets/images/view.png";
import hide from "../../assets/images/hide.png";
import DinamicButton from "../../components/DinamicButton";
import AOS from "aos";
import "aos/dist/aos.css"

class Login extends React.Component {

    constructor (props) {
        super (props);

        this.state = {
            email: "",
            password: "",
            shouldValidateCode: false,

            emailErrorMessage: "",
            passwordErrorMessage: "",

            hiddenErrorMessage: "hidden",

            errorMessage: "",

            loading: false,

            showPassword: false,
            showPasswordSrc: hide,
        };

        this.login = this.login.bind (this);
        this.showPassword = this.showPassword.bind (this);
    }

    componentDidMount () {
        AOS.init ({
            duration: 800,
            once: true
        })
    }

    async login (event) {
        event.preventDefault ();

        await setTimeout (() => {}, 10000);

        const isValid = validateLogin (this.state.email, this.state.password, this);

        if (!isValid) return;

        this.setState ({loading: true});

        try {
            const data = await sendLogin (this.state.email, this.state.password);

            if (!data) return;

            window.location.href = "/validate-code?challengeId=" + data.challengeId;
        } catch (error) {
            this.setState ({errorMessage: error.message, hiddenErrorMessage: "show"})
        } finally {
            this.setState ({loading: false});
        }
    }

    showPassword () {
        if (this.state.showPassword) {
            this.setState ({showPassword: false, showPasswordSrc: hide});
        } else {
            this.setState ({showPassword: true, showPasswordSrc: view});
        }
    }

    render () {
        return (
            <div id="main-container">
                <div id="login-error-message" className={this.state.hiddenErrorMessage}><span id="error-icon">⨂</span>{this.state.errorMessage}</div>

                <header id="login-header">
                    <img src={minimalistIcon} alt=""></img>
                    
                    <h2 id="teste">Entrar</h2>
                </header>


                <div id="login-main-container">
                    
                    <div id="login-container" data-aos="fade-up">
                        <h2 id="mobile-heading">Entrar na conta</h2>
                        
                        <button id="back-btn" onClick={() => window.location.href = "/unauthenticated-home"}>Voltar</button>
                        
                        <form id="login-form" onSubmit={this.login}>

                            <span className="error-message">{this.state.emailErrorMessage}</span>
                            <input 
                                type="text" 
                                placeholder="E-mail" 
                                onChange={(e) => {this.setState ({email: e.target.value, hiddenErrorMessage: "hidden"})}}
                                className={this.state.emailErrorMessage !== "" ? "field-has-error" : "field-has-no-error"}>
                            </input>

                            <span className="error-message">{this.state.passwordErrorMessage}</span>
                            <div id="password-container">
                                <input 
                                    type={this.state.showPassword ? "text" : "password"} 
                                    placeholder="Senha" 
                                    onChange={(e) => {this.setState ({password: e.target.value, hiddenErrorMessage: "hidden"})}}
                                    className={this.state.passwordErrorMessage !== "" ? "field-has-error" : "field-has-no-error"}>
                                </input>
                                <img src={this.state.showPasswordSrc} onClick={this.showPassword} alt=""></img>
                            </div>

                            <a href="/forgot-password" target="blank" id="forgot-password-link">Esqueci minha senha</a>

                            <DinamicButton text={this.state.loading ? "Entrando" : "Entrar"} isLoading={this.state.loading} isDisabled={this.state.loading ? true : false}/>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;