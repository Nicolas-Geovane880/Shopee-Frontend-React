import React from "react";
import { fetchUserInfos, sendRefreshToken } from "./fetch";
import "./home.css"
import minimalistIconUltra from "../../assets/images/minimalist-ultra-icon.png";
import LabelDrop from "../label";

class Home extends React.Component {
    
    constructor (props) {
        super (props);

        this.state = {
            user: {},

            errorMessage: "",

            isFromLogin: false,
        }
    }

    componentDidMount () {
        const params = new URLSearchParams (window.location.search);
        const isFromLogin = params.get ("is_from_login");

        this.setState ({isFromLogin: isFromLogin === "true" ? true : false});

        if (isFromLogin === "true" || isFromLogin === null) {
            this.isAuthenticated ();
        }
    }

    async isAuthenticated () {
        const accessToken = localStorage.getItem ("accessToken");

        if (!accessToken) {
            window.location.href = "/unauthenticated-home";
            return;
        }

        try {
            const data = await fetchUserInfos (accessToken);

            this.setState ({user: data, isFromLogin: true});
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

                    this.setState ({user, isFromLogin: true});

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

    getWeekDay () {
        const days = [
            "ótimo domingo",
            "ótima segunda-feira",
            "ótima terça-feira",
            "ótima quarta-feira",
            "ótima quinta-feira",
            "ótima sexta-feira",
            "ótimo sábado"];

        const now = new Date ();

        const day = now.getDay ();

        return days[day];
    }

    render () {
        return (
            <div id="home-main-container">
                <header id="home-header">
                    <img src={minimalistIconUltra} alt=""></img>

                    <h2>Shopee Supplier Calculator</h2>

                    <div id="user-info">
                    <span id="logged-as-info">Logado como <span id="user-name">{this.state.user.name || "Não autenticado"}</span></span>
                    </div>

                    <button id="sign-out-btn" onClick={() => {
                        localStorage.removeItem ("accessToken");
                        localStorage.removeItem ("refreshToken");
                        window.location.href = "/unauthenticated-home"
                        }}>SAIR</button>
                </header>

                <section id="first-section">
                    <h1>Olá{this.state.user ? this.state.user.name : " "}, {this.getWeekDay ()}</h1>

                    <p>Bem-vindo ao Shopee Supplier Calculator, o sistema feito para te auxiliar nas suas finanças</p>

                    <h3>➜ Qual opção deseja?</h3>

                    <div id="opts-cards"
                         onClick={this.state.isFromLogin ? () => window.location.href = "/list-dashboard" : () => {}}>
                        <div id="card-one"
                             className={this.state.isFromLogin ? "" : "disabled-auth"}>
                            <span>➜</span>
                            <span id="auth-needed" className={this.state.isFromLogin ? "" : "not-logged"}>Necessário autenticação</span>
                            Listar pedidos manualmente e ver suas métricas
                            </div>
                        <div id="card-two"
                             onClick={() => document.getElementById ("main-container-label")
                                .scrollIntoView ({behavior: "smooth"})
                             }>
                            <span>➜</span>
                            Gerar tabelas a partir de etiquetas de pedidos
                            </div>
                        <div id="card-three">
                            <span>➜</span>
                            Gerar tabelas com informações revelantes a partir de tabela de pedidos
                            </div>
                    </div>


                    {/* <div id="cards">
                        <div id="card-1">
                            <h4>listar e ver métricas dos pedidos manualmente</h4>
                            <img src={cardOne}></img>
                        </div>
                        <div id="card-2">
                            <h4>Gerar tabelas a partir de etiquetas de pedidos</h4>
                        </div>
                        <div id="card-3">
                            <h4>Gerar tabelas e métricas a partir de uma tabela de pedidos (exportados pela Shopee)</h4>
                        </div>
                    </div> */}
                </section>

                {/* <div id="pages-container">
                    {this.state.isFromLogin ? (<></>) : (<span id="auth-required">Necessário autenticação</span>)}
                    
                    <div id="pages-container-heading"><h2>Escolha uma das opcões abaixo</h2></div>
                    <div 
                        id="manuable-list" 
                        onClick={() => this.state.isFromLogin ? window.location.href = "/list-dashboard" : null}
                        className={this.state.isFromLogin ? "enabled" : "disabled"}>
                        Inserir lista manualmente</div>

                    <div
                        id="table-from-label"
                        onClick={() => window.location.href = "/label"} 
                        className="in-dev">Gerar tabela a partir de etiquetas</div>
                    <div className="in-dev">Gerar métricas a partir de tabelas - Em desenvolvimento</div>
                </div>       */}
                    <LabelDrop />

            </div>
        );
    }
}

export default Home;