export const fetchUserListDashboard = async (token, selectedDate) => {
    const response = await fetch (`${process.env.REACT_APP_API_URL}/home/list-dashboard/${selectedDate}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    }).catch (() => { throw new Error ("Erro ao extrair informações de dashboard")});

    const data = await response.json ();

    if (!response.ok) {
        throw new Error (data.message);
    }

    return data;
} 

export const sendSetOrderAsPaid = async (token, idSeller) => {
    const response = await fetch (`${process.env.REACT_APP_API_URL}/orders/paid/${idSeller}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    });

    const data = await response.json ();

    if (!response.ok) {
        throw new Error (data.message);
    }

    return data;
}

export const fetchOrderInPage = async (token, page, date) => {
    const response = await fetch (`${process.env.REACT_APP_API_URL}/orders/${page}/${date}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    });

    const data = await response.json ();

    if (!response.ok) {
        throw new Error (data.message);
    }

    return data;
}

export const sendFindOrderById = async (token, idSeller) => {
    const response = await fetch (`${process.env.REACT_APP_API_URL}/orders/find/${idSeller}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    });

    const data = await response.json ();

    if (!response.ok) {
        throw new Error (data.message);
    }

    return data;
}