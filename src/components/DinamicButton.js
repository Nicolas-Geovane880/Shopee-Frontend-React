import React from "react";

const DinamicButton = (props) => {
    return (
        // <button onClick={props.act}
        //         className="dinamic-button">
        //     <span className="arrow-btn">➜</span>
        //     {props.text}
        // </button>
        <button 
                id="dinamic-button"
                onClick={props.act}
                disabled={props.isDisabled}
                className={props.isLoading ? "loading" : "not-loading"}>
            <span id="arrow-btn">➜</span>
            <span id="btn-text">{props.text}</span>
            <span
                id="progress-bar"
                className={props.isLoading ? "progress-go" : ""}></span>
        </button>
    )
}

export default DinamicButton;
