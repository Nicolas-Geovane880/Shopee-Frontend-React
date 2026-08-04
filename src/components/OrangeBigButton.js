import React from "react";

const OrangeBigButton = (props) => {
    return (
        <button className="orange-big-button" onClick={props.act} disabled={props.disabled}>{props.text}</button>
    );
}

export default OrangeBigButton;