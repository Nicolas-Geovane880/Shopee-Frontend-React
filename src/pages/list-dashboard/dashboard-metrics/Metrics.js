import React from "react";
import "./metrics.css"

class Metrics extends React.Component {

    constructor (props) {
        super (props);

        this.state = {

        }
    }

    render () {
        return (
            <div id="metrics-main-container">
                <div id="in-interval-metrics-ctn">
                    <span className="metric-title">Métricas totais de pedidos não pagos no período selecionado</span>
                    <div id="in-interval-metrics">
                        <div>
                            <span className="metric-name">Total faturado</span>
                            <span className="metric-value">R${Number(this.props.totalRevenueInInterval).toFixed(2)}</span>
                        </div>
                        <div>
                            <span className="metric-name">A pagar (total do fornecedor)</span>
                            <span className="metric-value">R${Number(this.props.totalSupplierPriceInInterval).toFixed(2)}</span>
                        </div>
                        <div>
                            <span className="metric-name">Lucro total</span>
                            <span className="metric-value">R${Number(this.props.totalProfitInInterval).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div id="in-all-time-metrics-cnt">
                    <span className="metric-title">Métricas totais de pedidos pagos ao fornecedor</span>
                    <div id="in-all-interval-metrics">
                        <div>
                            <span className="metric-name">Total faturado</span>
                            <span className="metric-value">R${Number(this.props.totalRevenueAllTime).toFixed (2)}</span>
                        </div>
                        <div>
                            <span className="metric-name">Total pago (fornecedor)</span>
                            <span className="metric-value">R${Number(this.props.totalSupplierPriceAllTime).toFixed (2)}</span>
                        </div>
                        <div>
                            <span className="metric-name">Total lucrado</span>
                            <span className="metric-value">R${Number(this.props.totalProfitAllTime).toFixed (2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Metrics;