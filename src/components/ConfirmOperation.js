import React from "react";

class ConfirmOperation extends React.Component {

    constructor (props) {
        super (props);

        this.state = {}
    };

    render () {
        return (
            <div>
                <div id="overflow"></div>

                <div id="confirm-ctn">
                    <h2>{this.props.title}</h2>
                    <p>{this.props.subtitle}</p>
                    <div id="confirm-btn-ctn">
                        <button onClick={() => this.props.onConfirm (true)}>Confirmar</button>
                        <button onClick={() => this.props.onConfirm (false)}>Cancelar</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ConfirmOperation;