import React from "react";
import { fetchUserListDashboard, sendSetOrderAsPaid, fetchOrderInPage, sendFindOrderById } from "./fetch";
import AddOrder from "./add-order/addOrder";
import OrderList from "./order-list/OrderList";
import Metrics from "./dashboard-metrics/Metrics";

class ListDashboard extends React.Component {

    constructor (props) {
        super (props);

        this.state = {
            orders: [],
            pagination: {
                    page: 1,
                    size: 20,
                    ordersCount: 0,
                    totalPages: 0,
                    hasNextPage: false,
                    hasPreviousPage: false,
            },

            dashboardData: {},

            errorMessage: "",
            hiddenErrorMessage: "hidden",
        };

        this.getUserDashboard = this.getUserDashboard.bind (this);
        this.getOrdersInInterval = this.getOrdersInInterval.bind (this);
        this.setOrderAsPaid = this.setOrderAsPaid.bind (this);
        this.findOrderInPageable = this.findOrderInPageable.bind (this);
        this.findOrderById = this.findOrderById.bind (this);
        this.handleError = this.handleError.bind (this);
    }

    componentDidMount () {
        this.getUserDashboard ();
    }

    handleError (errorMessage) {
        this.setState ({errorMessage, hiddenErrorMessage: "show"});

        setTimeout (() => {
            this.setState ({hiddenErrorMessage: "hidden"});
        }, 5000);
    }

    async getUserDashboard () {
        const accessToken = localStorage.getItem ("accessToken");

        try {
            const data = await fetchUserListDashboard (accessToken, "all-time");

            this.setState ({dashboardData: data, orders: data.orders, pagination: data.pagination});

        } catch (error) {
            this.handleError ("Erro ao mostrar dashboard do usuário");
        }   
    }

    async getOrdersInInterval (selectedDate) {
        const accessToken = localStorage.getItem ("accessToken");

        try {
            const data = await fetchUserListDashboard (accessToken, selectedDate);

            this.setState ({dashboardData: data, orders: data.orders, pagination: data.pagination});
        } catch (error) {
            this.handleError ("Erro ao mostrar dashboard no período selecionado");
        }
    }

    async setOrderAsPaid (idSeller) {
        const accessToken = localStorage.getItem ("accessToken");

        try {
            const data = await sendSetOrderAsPaid (accessToken, idSeller);
        } catch (error) {
            this.handleError ("Erro ao marcar pedido como pago");
        }
    }

    async findOrderInPageable (page, date) {
        const accessToken = localStorage.getItem ("accessToken");

        try {
            const data = await fetchOrderInPage (accessToken, page, date);

            this.setState ({orders: data.data, pagination: data.pagination});
        } catch (error) {
            this.handleError ("Erro ao carregar próxima página");
        }
    }

    async findOrderById (idSeller) {
        const accessToken = localStorage.getItem ("accessToken");

        try {
            const data = await sendFindOrderById (accessToken, idSeller);

            return data;
        } catch (error) {
            this.handleError ("Erro ao encontrar pedido")
        }
    }

    render () {
        return (
            <div>
                <div id="error-container" className={this.state.hiddenErrorMessage}>
                    <span>{this.state.errorMessage}</span>
                </div>

                <AddOrder onAddOrder={this.getUserDashboard}
                          onHandleError={this.handleError}/>
                <OrderList orders={this.state.orders} 
                    onGetOrdersInInterval={this.getOrdersInInterval} 
                    onGetOrdersInAllInterval={this.getUserDashboard}
                    onSetOrderAsPaid={this.setOrderAsPaid}
                    pageInfo={this.state.pagination}
                    onGetOrdersInPage={this.findOrderInPageable}
                    onFindOrderById={this.findOrderById}/>
                <Metrics totalRevenueInInterval={this.state.dashboardData.total_revenue_in_interval}
                         totalSupplierPriceInInterval={this.state.dashboardData.total_supplier_price_in_interval}
                         totalProfitInInterval={this.state.dashboardData.total_profit_in_interval}
                         totalRevenueAllTime={this.state.dashboardData.total_revenue_all_time}
                         totalSupplierPriceAllTime={this.state.dashboardData.total_supplier_price_all_time}
                         totalProfitAllTime={this.state.dashboardData.total_profit_all_time}/>
            </div>
        );
    }
}

export default ListDashboard;