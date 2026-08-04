import React from "react";
import { sendSaveOrder } from "./fetch";
import "../list-dashboard.css"
import "./addOrder.css";
import { validateOrderInfos, validateProduct } from "./validate";
import ConfirmOperation from "../../../components/ConfirmOperation";

class AddOrder extends React.Component {

    constructor (props) {
        super (props);

        this.state = {
            listToSave: [],

            //new product
            sku: "",
            quantity: "",

            //new order
            idSeller: "",
            revenue: "",
            soldDate: "",

            skuErrorMessage: "",
            quantityErrorMessage: "",
            idSellerErrorMessage: "",
            revenueErrorMessage: "",
            soldDateErrorMessage: "",
            listToSaveErrorMessage: "",

            needConfirmation: false,
        };

        this.addProduct = this.addProduct.bind (this);
        this.removeProduct = this.removeProduct.bind (this);
        this.saveOrder = this.saveOrder.bind (this);
        this.handleSaveOrder = this.handleSaveOrder.bind (this);
    }

    addProduct (event) {
        event.preventDefault ();

        const isValid = validateProduct (this.state.sku, this.state.quantity, this);

        if (!isValid) return;

        const product = {
            uuid: crypto.randomUUID (),
            sku: this.state.sku,
            quantity: Number (this.state.quantity),
        };

        this.state.listToSave.push (product);

        this.setState ({sku: "", quantity: 0});
    }

    removeProduct (uuid) {
        this.setState ({listToSave: this.state.listToSave.filter (product => product.uuid !== uuid)});
    }

    async validateOrder () {
        const isValid = await validateOrderInfos (this, localStorage.getItem ("accessToken"));

        if (!isValid) return;

        this.setState ({needConfirmation: true});
    }

    async handleSaveOrder (isConfirmed) {
        if (isConfirmed) {
            await this.saveOrder ()
        }
        
        this.setState ({needConfirmation: false, sku: "", quantity: "", revenue: "", idSeller: "", soldDate: "", listToSave: []});
    }

    async saveOrder () {
        try {
            await sendSaveOrder (this.state.listToSave, Number (this.state.revenue), this.state.soldDate, this.state.idSeller, localStorage.getItem ("accessToken"));

            this.setState ({sku: "", quantity: 0, revenue: 0, idSeller: "", soldDate: "", listToSave: []});

            this.props.onAddOrder ();
        } catch (error) {
            this.props.onHandleError ("Erro ao salvar pedido")
        }
    }

    render () {
        return (
            <div id="add-product-main-container">

                <div>
                    {this.state.needConfirmation ? 
                    (<ConfirmOperation title="Deseja salvar o pedido?"
                                       subtitle="Essa ação não pode ser desfeita depois." 
                                       onConfirm={this.handleSaveOrder}/>) : 
                    (<span></span>)}
                </div>

                <form onSubmit={this.addProduct} id="add-product-container">
                    <span>{this.state.skuErrorMessage}</span>
                    <select 
                        onChange={(e) => this.setState ({sku: e.target.value})} 
                        value={this.state.sku}
                        placeholder="SKU">
                        <option value="" selected>SKU</option>

                        <option value="CERVICAL">CERVICAL</option>
                        <option value="ENCOSTO-ESPUMA">ENCOSTO-ESPUMA</option>
                        <option value="ENCOSTO">ENCOSTO</option>
                        <option value="CAPA ENCOSTO">CAPA ENCOSTO</option>
                        <option value="PROMO">PROMO</option>
                        <option value="QUADRADINHO">QUADRADINHO</option>
                        <option value="XUXAO-MAG">XUXAO-MAG</option>
                        <option value="XUXAO-FLOC">XUXAO-FLOC</option>
                        <option value="FRONHA-XUXA">FRONHA-XUXA</option>
                        <option value="MATELADO-BRANCO">MATELADO-BRANCO</option>
                        <option value="MATELADO-ESCURO">MATELADO-ESCURO</option>
                        <option value="RAMPA">RAMPA</option>
                        <option value="RAMPA-BB">RAMPA-BB</option>
                        <option value="CAMADAS">CAMADAS</option>

                        <option value="D23-88X12-BRANCO">D23-88X12-BRANCO</option>
                        <option value="D23-88X12-PRETO">D23-88X12-PRETO</option>
                        <option value="D33-88X12-BRANCO">D33-88X12-BRANCO</option>
                        <option value="D33-88X12-PRETO">D33-88X12-PRETO</option>

                        <option value="BABY-80X40X6">BABY-80X40X6</option>
                        <option value="BABY-80X60X6">BABY-80X60X6</option>
                        <option value="BABY-90X60X7">BABY-90X60X7</option>
                        <option value="BABY-100X70X4">BABY-100X70X4</option>

                        <option value="PILLOW-78-4">PILLOW-78-4</option>
                        <option value="PILLOW-88-4">PILLOW-88-4</option>
                        <option value="PILLOW-138-4">PILLOW-138-4</option>
                        <option value="PILLOW-158-4">PILLOW-158-4</option>

                        <option value="PILLOW-78-6">PILLOW-78-6</option>
                        <option value="PILLOW-88-6">PILLOW-88-6</option>
                        <option value="PILLOW-138-6">PILLOW-138-6</option>
                        <option value="PILLOW-158-6">PILLOW-158-6</option>

                        <option value="MANTA-1CM">MANTA-1CM</option>
                        <option value="MANTA-2CM">MANTA-2CM</option>
                        <option value="MANTA-3CM">MANTA-3CM</option>
                        <option value="MANTA-4CM">MANTA-4CM</option>
                        <option value="MANTA-5CM">MANTA-5CM</option>

                        <option value="KIT04-20-ACUSTICO">KIT04-20-ACUSTICO</option>
                        <option value="KIT06-20-ACUSTICO">KIT06-20-ACUSTICO</option>

                        <option value="KIT02-100-ACUSTICO">KIT02-100-ACUSTICO</option>
                        <option value="KIT02-80-ACUSTICO">KIT02-80-ACUSTICO</option>
                        <option value="KIT02-40-ACUSTICO">KIT02-40-ACUSTICO</option>
                        <option value="KIT02-20-ACUSTICO">KIT02-20-ACUSTICO</option>
                        <option value="KIT02-12-ACUSTICO">KIT02-12-ACUSTICO</option>
                        <option value="KIT02-10-ACUSTICO">KIT02-10-ACUSTICO</option>
                    </select>

                    <span>{this.state.quantityErrorMessage}</span>
                    <input 
                        value={this.state.quantity}
                        placeholder="Quantidade" 
                        onChange={(e) => this.setState ({quantity: e.target.value})}>
                    </input>

                    <button>INCLUIR PRODUTO</button>
                </form>

                <span id="products-heading">Produtos</span>
                <div id="products-list-container">
                    {this.state.listToSave.map (product => (
                        <div className="product-container">
                            <span>{product.sku}</span>
                            <hr></hr>
                            <span>*{product.quantity}</span>
                            <button onClick={() => this.removeProduct (product.uuid)}>x</button>
                        </div>
                    ))}
                </div>

                {/* aaa */}

                <form id="order-infos-container">
                    <span>{this.state.idSellerErrorMessage}</span>
                    <input 
                        value={this.state.idSeller}
                        placeholder="ID do pedido" 
                        onChange={(e) => this.setState ({idSeller: e.target.value})}>
                    </input>

                    <span>{this.state.revenueErrorMessage}</span>
                    <input
                        value={this.state.revenue} 
                        placeholder="Renda estimada" 
                        onChange={(e) => this.setState ({revenue: e.target.value.replace (",", ".")})}>
                    </input>
                    
                    <span>{this.state.soldDateErrorMessage}</span>
                    
                    <div id="sold-date-container">
                        <span id="sold-date-spn">Data do pedido </span>
                        <input 
                            value={this.state.soldDate}
                            id="sold-date-input"
                            type="date" 
                            onChange={(e) => this.setState ({soldDate: e.target.value})}>
                        </input>
                        <button type="button" onClick={() => this.setState ({soldDate: new Date (Date.now() - 1000 * 60 * 180).toISOString().split("T")[0]})}>HOJE</button>
                    </div>

                    <button type="button" id="save-order-btn" onClick={() => this.validateOrder ()}>SALVAR PEDIDO</button>
                </form> 

            </div>
        )
    }
}

export default AddOrder;