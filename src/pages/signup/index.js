import React from "react";
import "./signup.css"
import { signup } from "./fetch";
import { validateSignup } from "./validateSignup";
import "../../global.css"
import minimalistIcon from "../../assets/images/teste1.png";
import view from "../../assets/images/view.png";
import hide from "../../assets/images/hide.png";
import DinamicButton from "../../components/DinamicButton";
import AOS from "aos";
import "aos/dist/aos.css"

class Signup extends React.Component {

    constructor (props) {
        super (props);

        this.state = {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",

            errorMessage: "",
            hiddenErrorMessage: "hidden",

            nameErrorMessage: "",
            emailErrorMessage: "",
            passwordErrorMessage: "",
            confirmPasswordErrorMessage: "",

            showPassword: false,

            loading: false,

            showPasswordSrc: hide,
        };

        this.sendSignup = this.sendSignup.bind (this);
        this.showPassword = this.showPassword.bind (this);
    }

    componentDidMount () {
        AOS.init ({
            duration: 800,
            once: true
        })
    }

    async sendSignup(event) {
        const isValid = await validateSignup (event, this);

        if (!isValid) return;
            
        await signup (this);
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
                <div id="signup-error-message" className={this.state.hiddenErrorMessage}><span id="error-icon">⨂</span>{this.state.errorMessage}</div>

                <header id="signup-header">
                    <img src={minimalistIcon} alt=""></img>
                    
                    <h2>Cadastro de usuário</h2>
                </header>


                <div id="signup-main-container">
                    
                    <div id="signup-container" data-aos="fade-up">

                        <h2 id="mobile-heading">Cadastro de usuário</h2>

                        <button id="back-btn-signup" onClick={() => window.location.href = "/unauthenticated-home"}>Voltar</button>

                        <form id="signup-form" onSubmit={this.sendSignup}>

                            <span className="error-message-sgn">{this.state.nameErrorMessage}</span>
                            <input
                                type="text"
                                placeholder="Nome"
                                onChange={(e) => {this.setState({name: e.target.value, hiddenErrorMessage: "hidden"})}}
                                className={this.state.nameErrorMessage !== "" ? "field-has-error" : "field-has-no-error"}>
                            </input>

                            <span className="error-message-sgn">{this.state.emailErrorMessage}</span>
                            <input 
                                type="text" 
                                placeholder="E-mail" 
                                onChange={(e) => {this.setState({email: e.target.value, hiddenErrorMessage: "hidden"})}}
                                className={this.state.emailErrorMessage !== "" ? "field-has-error" : "field-has-no-error"}>
                            </input>
 
                            <span className="error-message-sgn">{this.state.passwordErrorMessage}</span>
                            <div id="first-password-container">
                                <input
                                    id="first-password" 
                                    type={this.state.showPassword ? "text" : "password"} 
                                    placeholder="Senha" 
                                    onChange={(e) => {this.setState({password: e.target.value, hiddenErrorMessage: "hidden"})}}
                                    className={this.state.passwordErrorMessage !== "" ? "field-has-error" : "field-has-no-error"}>
                                </input>
                                <img src={this.state.showPasswordSrc} onClick={this.showPassword} alt=""></img>
                            </div>

                            <span className="error-message-sgn">{this.state.confirmPasswordErrorMessage}</span>
                            <input 
                                id="confirm-password-input" 
                                type="password" 
                                placeholder="Confirmar senha" 
                                onChange={(e) => {this.setState({confirmPassword: e.target.value, hiddenErrorMessage: "hidden"})}}
                                className={this.state.confirmPasswordErrorMessage !== "" ? "field-has-error" : "field-has-no-error"}>
                            </input>

                            <DinamicButton text={this.state.loading ? "Cadastrando" : "Cadastrar-se"} isLoading={this.state.loading} isDisabled={this.state.loading ? true : false}/> 
                        </form>
                    </div>
                </div>

            </div>
        )
    }
}

export default Signup;