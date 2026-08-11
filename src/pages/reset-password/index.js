import React from "react";
import { sendResetPassword } from "./fetch";
import minimalistIconUltra from "../../assets/images/minimalist-ultra-icon.png";
import errorIcon from "../../assets/images/close.png"
import "./reset-password.css"
import view from "../../assets/images/view.png";
import hide from "../../assets/images/hide.png";

class ResetPassword extends React.Component {

    constructor (props) {
        super (props);

        this.state = {
            token: "",
            newPassword: "",
            confirmNewPassword: "",

            newPasswordErrorMessage: "",
            confirmNewPasswordErrorMessage: "",

            isRequestSuccess: true,

            errorMessage: "",
            hiddenErrorMessage: "hidden",

            showPassword: false,
            
            loading: false,

            showPasswordSrc: hide,
        };

        this.resetPassword = this.resetPassword.bind (this);
        this.showPassword = this.showPassword.bind (this);
    }

    componentDidMount () {
        const params = new URLSearchParams (window.location.search);
        const token = params.get ("token");

        this.setState ({token});
    }

    async resetPassword (event) {
        event.preventDefault ();

        let newPasswordHasError = ""
        let confirmNewPasswordHasError = ""
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)\S{8,}$/;

        if (!passwordRegex.test (this.state.newPassword)) {
            newPasswordHasError = "Mínimo 8 dígitos, pelo menos 1 número, sem espaços"
        }
        if (this.state.newPassword !== this.state.confirmNewPassword) {
            confirmNewPasswordHasError= "As senhas devem ser iguais";
        }
        
        this.setState ({newPasswordErrorMessage: newPasswordHasError, confirmNewPasswordErrorMessage: confirmNewPasswordHasError});

        if (newPasswordHasError !== "" || confirmNewPasswordHasError !== "") return;

        const isSuccess = await sendResetPassword (this.state.newPassword, this.state.token);

        if (isSuccess) this.setState ({isRequestSuccess: true});
        else this.setState ({isRequestSuccess: false});
    }

    showPassword () {
        if (this.state.showPassword) {
            this.setState ({showPassword: false, showPasswordSrc: hide});
        } else {
            this.setState ({showPassword: true, showPasswordSrc: view});
        }
    }

    render () {
        if (this.state.isRequestSuccess) {
            return (
                <div>
                    <header id="this-home-header">
                        <img src={minimalistIconUltra} alt=""></img>
                        
                        <h2>Alterar senha</h2>
                    </header>
                    <div id="reset-password-success">
                        <h2>Senha alterada com sucesso, você pode voltar para o login.</h2>

                        <button className="reset-password-btn" onClick={() => window.location.href = "/login"}>VOLTAR PARA O LOGIN</button>
                    </div>
                </div>
            );
        }

        return (
            <div id="main-container">
                <div id="signup-error-message" className={this.state.hiddenErrorMessage}><img id="error-icon" src={errorIcon} alt=""></img>{this.state.errorMessage}</div>
                <header id="this-home-header">
                    <img src={minimalistIconUltra} alt=""></img>
                    
                    <h2>Alterar senha</h2>
                </header>

                <div id="reset-password-container">
                    <h2>Nova senha</h2>

                    <form onSubmit={this.resetPassword}>
                        <span id="new-password-span">{this.state.newPasswordErrorMessage}</span>

                        <div>
                            <input
                                type={this.state.showPassword ? "text" : "password"} 
                                placeholder="Nova senha" 
                                onChange={(e) => this.setState ({newPassword: e.target.value})}
                                className={this.state.newPasswordErrorMessage !== "" ? "field-has-error" : "field-has-no-error"}>
                            </input>

                            <img src={this.state.showPasswordSrc} onClick={this.showPassword} alt=""></img>
                        </div>

                        <span>{this.state.confirmNewPasswordErrorMessage}</span>

                        <input 
                            type="password"
                            placeholder="Confirmar nova senha" 
                            onChange={(e) => this.setState ({confirmNewPassword: e.target.value})}
                            className={this.state.confirmNewPasswordErrorMessage !== "" ? "field-has-error" : "field-has-no-error"}>
                        </input>

                        <button className="reset-password-btn">ALTERAR SENHA</button>
                    </form>   
                </div>
            </div>
        )
    }
}

export default ResetPassword;
