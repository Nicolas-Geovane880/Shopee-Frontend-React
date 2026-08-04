import React from "react";
import { fetchUserInfos, sendRefreshToken } from "./fetch";
import "./home.css"
import errorIcon from "../../assets/images/close.png"
import teste from "../../assets/images/teste.png";
import minimalistIconUltra from "../../assets/images/minimalist-ultra-icon.png";
import view from "../../assets/images/view.png";
import hide from "../../assets/images/hide.png";
import layoutIcon from "../../assets/images/layout-icon-4.png";

class Home extends React.Component {
    
    constructor (props) {
        super (props);

        this.state = {
            user: {},

            errorMessage: "",
        }
    }

    componentDidMount () {
        this.isAuthenticated ();
    }

    async isAuthenticated () {
        const accessToken = localStorage.getItem ("accessToken");

        if (!accessToken) {
            window.location.href = "/unauthenticated-home";
            return;
        }

        try {
            const data = await fetchUserInfos (accessToken);

            this.setState ({user: data});
        } catch (error) {
            const refreshToken = localStorage.getItem ("refreshToken");

            if (error.status === 401 && refreshToken) {
                try {
                    const tokens = await sendRefreshToken (refreshToken);
                    const newAccessToken = tokens.accessToken.code;
                    const newRefreshToken = tokens.accessToken.code;
    
                    localStorage.setItem ("accessToken", newAccessToken);
                    localStorage.setItem ("refreshToken", newRefreshToken);
    
                    const user = await fetchUserInfos (newAccessToken);

                    this.setState ({user});

                } catch (error) {
                    localStorage.removeItem ("accessToken");
                    localStorage.removeItem ("refreshToken");
                    window.location.href = "/unauthenticated-home";
                    return;
                }
            }

            window.location.href = "/unauthenticated-home";
        }
    }

    render () {
        return (
            <div id="home-main-container">
                <header id="home-header">
                    <img src={minimalistIconUltra}></img>

                    <h2>Shopee Supplier Calculator</h2>

                    <div id="user-info">
                        <span id="logged-as-info">Logado como <span id="user-name">{this.state.user.name}</span></span>
                    </div>

                    <button id="sign-out-btn" onClick={() => {
                        localStorage.removeItem ("accessToken");
                        localStorage.removeItem ("refreshToken");
                        window.location.href = "/unauthenticated-home"
                        }}>SAIR</button>
                </header>

                <div id="pages-container">
                    <div id="pages-container-heading"><h2>Escolha uma das opcões abaixo</h2></div>
                    <div id="manuable-list" onClick={() => window.location.href = "/list-dashboard"}>Inserir lista manualmente</div>
                    <div className="in-dev">Gerar tabela a partir de etiquetas - Em desenvolvimento</div>
                    <div className="in-dev">Gerar métricas a partir de tabelas - Em desenvolvimento</div>
                </div>      
            </div>
        );
    }
}

export default Home;