import React from "react";
import { fetchUserInfos, sendRefreshToken } from "./fetch";
import "./home.css"
import minimalistIcon from "../../assets/images/teste1.png";
import LabelDrop from "../label";
import MetricsTable from "../metrics-table";
import DinamicButton from "../../components/DinamicButton";

class Home extends React.Component {
    
    constructor (props) {
        super (props);

        this.state = {
            user: {},

            errorMessage: "",

            isFromLogin: false,

            generateTableFromTableOrLabel: "label",
        }

        this.renderTableGeneration = this.renderTableGeneration.bind (this);
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

    async renderTableGeneration (generationType) {
        this.setState ({generateTableFromTableOrLabel: generationType});
    }

    render () {
        return (
            <div id="home-main-container">
                <header id="home-header">
                    <img src={minimalistIcon} alt="" onClick={() => document.getElementById ("home-main-container")
                        .scrollIntoView ({behavior: "smooth"})
                    } title="Home"></img>

                    <h2>Shopee Supplier Calculator</h2>

                    <div id="user-info">
                    <span id="logged-as-info">Logado como <span id="user-name">{this.state.user.name || "Não autenticado"}</span></span>
                    </div>

                    <div id="sign-out-btn">
                        <DinamicButton act={() => {
                            localStorage.removeItem ("accessToken");
                            localStorage.removeItem ("refreshToken");
                            window.location.href = "/unauthenticated-home"
                            }} text="&nbsp; SAIR &nbsp;"/>
                    </div>
                </header>

                <section id="first-section">
                    <h1>Olá{this.state.user ? this.state.user.name : " "}, {this.getWeekDay ()}</h1>

                    <p>Bem-vindo ao Shopee Supplier Calculator, o sistema feito para te auxiliar nas suas finanças</p>

                    <h3>➜ Qual opção deseja?</h3>

                    <div id="opts-cards">
                        <div id="card-one"
                             className={this.state.isFromLogin ? "" : "disabled-auth"}
                             onClick={this.state.isFromLogin ? () => window.location.href = "/list-dashboard" : () => {}}>

                            <span className="arrow">➜</span>
                            <span id="auth-needed" className={this.state.isFromLogin ? "logged" : "not-logged"}>Necessário autenticação</span>
                            Listar pedidos manualmente e ver suas métricas

                        </div>

                        <div id="card-two"
                             onClick={async () => {
                                await this.renderTableGeneration ("label")
                                document.getElementById ("main-container-label")
                                    .scrollIntoView ({behavior: "smooth"})
                             }}>

                            <span className="arrow">➜</span>
                            Gerar tabelas a partir de etiquetas de pedidos

                        </div>
                        <div id="card-three"
                            onClick={async () => {
                                await this.renderTableGeneration ("table")
                                document.getElementById ("metrics-table-main-container")
                                    .scrollIntoView ({behavior: "smooth"})}
                            }>

                            <span className="arrow">➜</span>
                            Gerar tabelas com informações revelantes a partir de tabela de pedidos
                            </div>

                    </div>
                </section>

                    {this.state.generateTableFromTableOrLabel === "label" ? (<LabelDrop />) : (<MetricsTable />)}
                    

            </div>
        );
    }
}

export default Home;