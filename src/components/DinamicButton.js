import React from "react";

const DinamicButton = (props) => {
    return (
        <button onClick={props.act}
                className="dinamic-button">
            <span className="arrow-btn">➜</span>
            {props.text}
        </button>
    )
}

export default DinamicButton;
