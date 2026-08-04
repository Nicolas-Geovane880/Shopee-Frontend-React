import React from "react";
import "./orderList.css"
import ConfirmOperation from "../../../components/ConfirmOperation";

class OrderList extends React.Component {

    constructor (props) {
        super (props);

        this.state = {
            filteredOrders: [],

            printFilteredOrders: false,

            selectedDate: "all-time",

            needConfirmation: false,

            idSellerToSetAsPaid: "",
        };

        this.handleFilteredOrder = this.handleFilteredOrder.bind (this);
        this.handleGetOrderInAllInterval = this.handleGetOrderInAllInterval.bind (this);
        this.handleFindOrdersInPage = this.handleFindOrdersInPage.bind (this);
        this.handleSetOrderAsPaid = this.handleSetOrderAsPaid.bind (this);
    }

    async handleFilteredOrder (idSeller) {
        if (idSeller === "") {
            this.setState ({printFilteredOrders: false});
        }
        else {
            const filteredOrders = this.props.orders.filter (order => order.id_seller === idSeller || order.id_seller.includes (idSeller));

            if (filteredOrders.length === 0) {
                const order = await this.props.onFindOrderById (idSeller);

                if (order) filteredOrders.push (order);
            }

            this.setState ({printFilteredOrders: true,
                            filteredOrders});
        };
    }

    async handleOrderInInterval (selectedDate) {
        this.setState ({selectedDate: selectedDate, printFilteredOrders: false});

        await this.props.onGetOrdersInInterval (selectedDate);
    } 
    
    async handleSetOrderAsPaid (isConfirmed) {
        if (isConfirmed) {
            await this.setOrderAsPaid (this.state.idSellerToSetAsPaid);
            await this.props.onGetOrdersInInterval (this.state.selectedDate);
        } 
        else {
            window.alert ("NAO SETOU COMO PAGO");
        }
        this.setState ({needConfirmation: false, idSellerToSetAsPaid: ""});
    }
    
    async setOrderAsPaid (idSeller) {
        await this.props.onSetOrderAsPaid(idSeller);

        await this.props.onGetOrdersInPage(
            this.props.pageInfo.page,
            this.state.selectedDate
        );
    }

    async handleGetOrderInAllInterval () {
        this.setState ({selectedDate: "all-time", printFilteredOrders: false})

        await this.props.onGetOrdersInAllInterval ();

    }

    async handleFindOrdersInPage (page) {
        await this.props.onGetOrdersInPage (page, this.state.selectedDate);
    }
  
    render () {
        return (
            <div id="order-list-main-container">

                <div>
                    {this.state.needConfirmation ? 
                    (<ConfirmOperation title="Deseja marcar esse pedido como pago?"
                                       subtitle="Essa ação não pode ser desfeita depois"
                                       onConfirm={this.handleSetOrderAsPaid}/>) : 
                    (<span></span>)}
                </div>

                <div id="order-list-inputs">
                    <input
                        id="search-id"
                        onChange={(e) => this.handleFilteredOrder (e.target.value)}
                        placeholder="ID do pedido"
                    ></input>
                    
                    <input
                        type="date"
                        onChange={(e) => this.handleOrderInInterval (e.target.value)}>
                    </input>

                    <button onClick={this.handleGetOrderInAllInterval}>Todo o período</button>
                </div>

                <div className="order-container" id="orders-column-name">
                    <div className="order-info-ctn">ID</div>
                    <div className="order-info-ctn">Data</div>
                    <div className="order-info-ctn">SKUs</div>
                    <div className="order-info-ctn">Renda</div>
                    <div className="order-info-ctn">A pagar</div>
                    <div className="order-info-ctn">Lucro</div>
                </div>

                <div id="orders-list">

                    {!this.state.printFilteredOrders ? 
                        (this.props.orders.length !== 0 ? 
                            (this.props.orders.map (order => (
                            <div className="order-container" key={order.id_seller}>
                                <span>{order.id_seller}</span>
                                <span>{new Date (order.sold_date).toISOString ().split ("T")[0]}</span>
                                <span>{order.products.map (product => product.sku).join (", ")}</span>
                                <span>R${Number(order.revenue).toFixed (2)}</span>
                                <span>R${Number(order.products.reduce ((acc, product) => {
                                    return acc + product.supplier_price
                                }, 0)).toFixed (2)}</span>
                                <span>R${Number(order.profit).toFixed (2)}</span>
                                <button onClick={() => this.setState ({needConfirmation: true, idSellerToSetAsPaid: order.id_seller})}>PAGO</button>
                            </div>
                            ))) : 
                            (<span id="none-order">Nenhum pedido salvo</span>) )
                    
                    : (this.state.filteredOrders.length !== 0 ? 
                        (this.state.filteredOrders.map (order => (
                        <div className="order-container">
                            <span>{order.id_seller}</span>
                            <span>{new Date (order.sold_date).toISOString ().split ("T")[0]}</span>
                            <span>{order.products.map (product => product.sku).join (", ")}</span>
                            <span>R${order.revenue}</span>
                            <span>R${order.products.reduce ((acc, product) => {
                                return acc + product.supplier_price
                            }, 0)}</span>
                            <span>R${order.profit}</span>
                            <button onClick={() => this.setOrderAsPaid (order.id_seller)}>PAGO</button>
                        </div>
                        ))) : 
                        (<span id="none-order">Nenhum pedido encontrado</span>))}
                </div>

                <div id="page-btns-ctn">
                    <button 
                        disabled={!this.props.pageInfo.hasPreviousPage}
                        onClick={() => this.handleFindOrdersInPage (this.props.pageInfo.page - 1)}
                        > Anterior
                    </button>
                    <span>Página {this.props.pageInfo.page} de {this.props.pageInfo.totalPages}</span>
                    <button 
                        disabled={!this.props.pageInfo.hasNextPage}
                        onClick={() => this.handleFindOrdersInPage (this.props.pageInfo.page + 1)}
                        >Próximo
                    </button>
                </div>
            </div>
        )
    }
}

export default OrderList;