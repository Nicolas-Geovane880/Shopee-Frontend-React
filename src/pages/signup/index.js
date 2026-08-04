import React from "react";
import "./signup.css"
import { signup } from "./fetch";
import { validateSignup } from "./validateSignup";
import errorIcon from "../../assets/images/close.png"
import "../../global.css"
import OrangeBigButton from "../../components/OrangeBigButton";
import teste from "../../assets/images/teste.png";
import minimalistIconUltra from "../../assets/images/minimalist-ultra-icon.png";
import view from "../../assets/images/view.png";
import hide from "../../assets/images/hide.png";

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
                <div id="signup-error-message" className={this.state.hiddenErrorMessage}><img id="error-icon" src={errorIcon} alt=""></img>{this.state.errorMessage}</div>

                <header id="signup-header">
                    <img src={minimalistIconUltra} alt=""></img>
                    
                    <h2>Cadastro de usuário</h2>
                </header>


                <div id="signup-main-container">
                    
                    <img id="signup-img" src={teste} alt=""></img>

                    <div id="signup-container">

                        <h2 id="mobile-heading">Cadastro de usuário</h2>

                        <button id="back-btn-signup" onClick={() => window.location.href = "/"}>VOLTAR</button>

                        <form id="signup-form" onSubmit={this.sendSignup}>

                            <span>{this.state.nameErrorMessage}</span>
                            <input
                                type="text"
                                placeholder="Nome"
                                onChange={(e) => {this.setState({name: e.target.value, hiddenErrorMessage: "hidden"})}}
                                className={this.state.nameErrorMessage !== "" ? "field-has-error" : "field-has-no-error"}>
                            </input>

                            <span>{this.state.emailErrorMessage}</span>
                            <input 
                                type="text" 
                                placeholder="E-mail" 
                                onChange={(e) => {this.setState({email: e.target.value, hiddenErrorMessage: "hidden"})}}
                                className={this.state.emailErrorMessage !== "" ? "field-has-error" : "field-has-no-error"}>
                            </input>
 
                            <span>{this.state.passwordErrorMessage}</span>

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

                            <span>{this.state.confirmPasswordErrorMessage}</span>
                            <input 
                                id="confirm-password-input" 
                                type="password" 
                                placeholder="Confirmar senha" 
                                onChange={(e) => {this.setState({confirmPassword: e.target.value, hiddenErrorMessage: "hidden"})}}
                                className={this.state.confirmPasswordErrorMessage !== "" ? "field-has-error" : "field-has-no-error"}>
                            </input>

                            <OrangeBigButton text={
                                this.state.loading ? 
                                (
                                    <span className="button-spinner"></span>
                                ) :
                                ("CADASTRAR-SE")} disabled={this.state.loading}/> 
                        </form>
                    </div>
                </div>

            </div>
        )
    }
}

export default Signup;