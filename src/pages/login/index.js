import React from "react";
import { sendLogin } from "./fetch";
import errorIcon from "../../assets/images/close.png"
import "../../global.css"
import OrangeBigButton from "../../components/OrangeBigButton";
import "./login.css"
import { validateLogin } from "./validateLogin";
import "../../global.css";
import teste from "../../assets/images/teste.png";
import minimalistIconUltra from "../../assets/images/minimalist-ultra-icon.png";
import view from "../../assets/images/view.png";
import hide from "../../assets/images/hide.png";

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

    async login (event) {
        event.preventDefault ();

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
                <div id="login-error-message" className={this.state.hiddenErrorMessage}><img id="error-icon" src={errorIcon}></img>{this.state.errorMessage}</div>

                <header id="login-header">
                    <img src={minimalistIconUltra}></img>
                    
                    <h2 id="teste">Entrar</h2>
                </header>


                <div id="login-main-container">
                    
                    <img id="login-img" src={teste}></img>

                    <div id="login-container">
                        <h2 id="mobile-heading">Entrar na conta</h2>
                        
                        <button id="back-btn" onClick={() => window.location.href = "/"}>VOLTAR</button>
                        
                        <form id="login-form" onSubmit={this.login}>

                            <span>{this.state.emailErrorMessage}</span>
                            <input 
                                type="text" 
                                placeholder="E-mail" 
                                onChange={(e) => {this.setState ({email: e.target.value, hiddenErrorMessage: "hidden"})}}
                                className={this.state.emailErrorMessage !== "" ? "field-has-error" : "field-has-no-error"}>
                            </input>

                            <span>{this.state.passwordErrorMessage}</span>
                            <div id="password-container">
                                <input 
                                    type={this.state.showPassword ? "text" : "password"} 
                                    placeholder="Senha" 
                                    onChange={(e) => {this.setState ({password: e.target.value, hiddenErrorMessage: "hidden"})}}
                                    className={this.state.passwordErrorMessage !== "" ? "field-has-error" : "field-has-no-error"}>
                                </input>
                                <img src={this.state.showPasswordSrc} onClick={this.showPassword}></img>
                            </div>

                            <a href="/forgot-password" target="blank" id="forgot-password-link">Esqueci minha senha</a>

                            <OrangeBigButton text={
                                this.state.loading ? 
                                (
                                    <span className="button-spinner"></span>
                                ) :
                                ("ENTRAR")} disabled={this.state.loading}/>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;