export const sendSaveOrder = async (products, revenue, soldDate, idSeller, token) => {
    const response = await fetch (`${process.env.REACT_APP_API_URL}/orders/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify ({products, idSeller, revenue, soldDate}),
    }).catch (() => {throw new Error ("Erro na requisicao")});

    const data = await response.json ();

    if (!response.ok) {
        throw new Error (data.message);
    }

    return data;
}