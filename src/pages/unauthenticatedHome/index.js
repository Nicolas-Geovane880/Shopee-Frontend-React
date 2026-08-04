import React from "react";
import errorIcon from "../../assets/images/close.png"
import "./unauthenticatedHome.css"
import OrangeBigButton from "../../components/OrangeBigButton";
import "../../global.css";
import calculatorBlueIcon from "../../assets/images/calculator-big-icon.png";
import teste from "../../assets/images/teste.png";
import minimalistIconUltra from "../../assets/images/minimalist-ultra-icon.png";
import mobileIcon from "../../assets/images/mobile-icon.png";

class UnauthenticatedHome extends React.Component {

    constructor (props) {
        super (props);

        this.state = {};
    }
    
    render () {
        return (
            <div id="main-container">
                <header id="this-home-header">
                    <img src={minimalistIconUltra}></img>
                    
                    <h2>Entrar ou cadastrar</h2>
                </header>

                <div id="this-home-main-container">
                    
                    <img id="this-home-img" src={teste}></img>

                    <div id="this-home-container">

                        <h2 id="mobile-heading">Entrar ou cadastrar</h2>
                        <div id="redirect-btns-container">
                            <span>É novo por aqui?</span>
                            <OrangeBigButton text="CADASTRAR-SE | É GRÁTIS" act={() => window.location.href = "/signup"}/>

                            <div id="or-container">
                                <hr></hr>
                                <span>Ou</span>
                                <hr></hr>
                            </div>

                            <OrangeBigButton text="ENTRAR" act={() => window.location.href = "/login"}/>
                        </div>
                    </div>
                    {/* <img id="mobile-icon" src={mobileIcon}></img> */}
                </div>
            </div>
        )
    }
}

export default UnauthenticatedHome;