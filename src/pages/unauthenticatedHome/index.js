import React from "react";
import "./unauthenticatedHome.css"
import "../../global.css";
import minimalistIcon from "../../assets/images/teste1.png";
import icon from "../../assets/images/icon.png";
import DinamicButton from "../../components/DinamicButton";

class UnauthenticatedHome extends React.Component {

    constructor (props) {
        super (props);

        this.state = {};
    }
    
    render () {
        return (
            <div id="main-container">
                <header id="this-home-header">
                    <img src={minimalistIcon} alt=""></img>
                    
                    <h2>Entrar ou cadastrar</h2>
                </header>

                <div id="this-home-main-container">
                    
                    <div id="this-home-container">

                        <h2 id="mobile-heading">Entrar ou cadastrar</h2>
                        <div id="redirect-btns-container">
                            <img src={icon} alt=""></img>
                            <span className="is-new-user">É novo por aqui?</span>

                            <DinamicButton act={() => window.location.href = "/signup"} text="Cadastrar-se | É GRATIS"/>

                            <div id="or-container">
                                <hr></hr>
                                <span className="is-new-user">Ou</span>
                                <hr></hr>
                            </div>

                            <a href="/login">Entrar</a>
                            {/* <DinamicButton act={() => window.location.href = "/login"} text="Entrar"/> */}
                        </div>

                        {/* <DinamicButton act={() => window.location.href = "/?is_from_login=false"} text="Usar recursos sem autenticar"/> */}


                        <button id="go-in-unauth" onClick={() => window.location.href = "/?is_from_login=false"}>Usar recursos sem autenticação</button>

                    </div>
                </div>
            </div>
        )
    }
}

export default UnauthenticatedHome;