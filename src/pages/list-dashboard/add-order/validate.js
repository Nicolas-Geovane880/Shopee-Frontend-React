import { sendFindOrderById } from "../fetch";

export const validateProduct = (sku, quantity, component) => {
    let skuErrorMessage = "";
    let quantityErrorMessage = "";

    if (!sku) {
        skuErrorMessage = "Informe um SKU";
    }

    if (quantity <= 0 || isNaN (quantity)) {
        quantityErrorMessage = "Informe uma quantidade maior que zero";
    }

    component.setState ({skuErrorMessage, quantityErrorMessage});

    if (skuErrorMessage !== "" || quantityErrorMessage !== "") {
        return false;
    }

    return true;
}

export const validateOrderInfos = async (component, token) => {
    let listToSaveErrorMessage = "";
    let idSellerErrorMessage = "";
    let revenueErrorMessage = "";
    let soldDateErrorMessage = "";
    
    if (component.state.listToSave.length === 0) {
        listToSaveErrorMessage = "Adicione pelo menos um produto no pedido";
    }

    if (!component.state.idSeller) {
        idSellerErrorMessage = "Informe o ID do pedido"
    }

    if (component.state.idSeller) {
        const response = await sendFindOrderById (token, component.state.idSeller);

        if (response) idSellerErrorMessage = "ID já em uso"
    }

    if (!component.state.revenue || isNaN (component.state.revenue)) {
        revenueErrorMessage = "Informe uma renda estimada válida";
    }

    if (!component.state.soldDate) {
        soldDateErrorMessage = "Informe a data que o pedido foi feito";
    }

    if (component.state.soldDate) {
        const soldDate = new Date (component.state.soldDate);
    
        if (soldDate > Date.now() || soldDate < new Date ("2000/01/01")) {
            soldDateErrorMessage = "Informe uma data válida";
        }
    }

    component.setState ({idSellerErrorMessage,
                         revenueErrorMessage,
                         soldDateErrorMessage,
                         skuErrorMessage: listToSaveErrorMessage,
                         quantityErrorMessage: listToSaveErrorMessage});

    if (idSellerErrorMessage !== "" || revenueErrorMessage !== "" || soldDateErrorMessage !== "" || listToSaveErrorMessage !== "") {
        return false;
    }

    return true;
}