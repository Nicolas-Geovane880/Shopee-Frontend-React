import React from "react";
import "./style.css";
import uploadBlackIcon from "../../assets/images/upload-black.png";
import uploadIcon from "../../assets/images/upload.png";
import tableIcon from "../../assets/images/table.png";
import timeIcon from "../../assets/images/timer.png";
import { createPortal } from "react-dom";

class MetricsTable extends React.Component {

    constructor (props) {
        super (props);

        this.state = {
            files: [],
            isDragging: false,

            fileErrorMessage: "",

            loading: false,
            loadingStatus: "Carregando",

            status: [], 

            showMobileSidebar: false,
        }

        this.handleFile = this.handleFile.bind (this);
        this.validateFile = this.validateFile.bind (this);
        this.handleInputFile = this.handleInputFile.bind (this);
        this.sendFile = this.sendFile.bind (this);
        this.handleStatusCheckbox = this.handleStatusCheckbox.bind (this);
        this.handleAllStatusCheckbox = this.handleAllStatusCheckbox.bind (this);
        this.handleNoneStatusCheckbox = this.handleNoneStatusCheckbox.bind (this);
        this.handleShowStatusMobileSidebar = this.handleShowStatusMobileSidebar.bind (this);
    }

    componentDidMount () {
        
    }

    handleFile (e) {
        e.preventDefault ();

        const files = Array.from (e.dataTransfer.files).filter (file => file.name.toLowerCase().endsWith(".xlsx"));

        this.setState (previousState => ({
            files: [
                ...previousState.files,
                ...files.filter (file =>
                    !previousState.files.some (f => f.name === file.name && f.size === file.size)
                )
            ],
            isDragging: false,
        }));
    }

    handleInputFile (e) {
        const files = Array.from (e.target.files);

        this.setState (previousState => ({
            files: [
                ...previousState.files, 
                ...files.filter (file =>
                    !previousState.files.some (f => f.name === file.name && f.size === file.size)
                )
            ]
        }))
    }

    validateFile (files) {
        let fileErrorMessage = ""

        if (files.length === 0) {
            fileErrorMessage = "Exporte pelo menos 1 arquivo .xlsx";
        }

        if (files.length > 1) {
            fileErrorMessage = "Exporte apenas 1 arquivo .xlsx";
        }

        this.setState ({fileErrorMessage});

        if (fileErrorMessage !== "") return false;

        return true;
    }

    async sendFile () {
        const isValid = this.validateFile (this.state.files);

        if (!isValid) return;

        this.setState ({loading: true});

        const formData = new FormData ();

        this.state.files.forEach (file => formData.append ("file", file));

        try {
            let URL;

            if (this.state.status.length === 0) {
                URL = `${process.env.REACT_APP_API_URL_SPRING}/api/v1/orders/`;
            } else {
                URL = `${process.env.REACT_APP_API_URL_SPRING}/api/v1/orders/?status=${this.state.status.filter (s => s !== "ALL_OPT").join(",")}`
            }

            const response = await fetch (URL, {
                method: "POST",
                body: formData,
            }).catch (() => {throw new Error ("Erro no fetch")});
            
            if (!response.ok) {
                const data = await response.json ();
                throw new Error (data.message);
            }
    
            const blob = await response.blob ();
    
            const url = window.URL.createObjectURL (blob);
    
            const a = document.createElement ("a");
            a.href = url;
            a.download = `Relatorio_Pedidos_${new Date (Date.now ()).toISOString ().split ("T")[0]}.pdf`;
    
            a.click ();
    
            window.URL.revokeObjectURL (url);
        } catch (error) {
            if (error.message.includes ("java.util.Map.get(Object)")) {
                this.setState ({fileErrorMessage: "Provavelmente algum SKU não segue o formato esperado"});
            }
            else {
                this.setState ({fileErrorMessage: error.message});
            }
        } finally {
            this.setState ({loading: false});
        }
    }

    handleStatusCheckbox (event) {
        const {value, checked} = event.target;

        this.setState (previousState => {
            const currentStatus = [...previousState.status];

            if (checked) {
                currentStatus.push (value);
            } else {
                const index = currentStatus.indexOf (value);
                if (index > -1) currentStatus.splice (index, 1);
            }

            return {status: currentStatus}
        })
    }

    handleAllStatusCheckbox (event) {
        const {checked} = event.target;

        if (checked) {
            this.setState ({status: ["TO_SEND", "SENT", "DELIVERED", "CONCLUDED", "CANCELLED", "NOT_PAID", "ALL_OPT"]});
        } else {
            this.setState ({status: []});
        }
    }

    handleNoneStatusCheckbox (event) {
        this.setState ({status: []});
    }

    handleShowStatusMobileSidebar () {
        this.setState(prevState => ({
            showMobileSidebar: !prevState.showMobileSidebar
        }));
    }

    render () {
        return (
            <>
                <div id="metrics-table-main-container">
                    

                    <div id="cards-info" data-aos="fade-down">
                        <div>
                            <h2>Exporte a tabela de pedidos em formato .xlsx</h2>
                            <img src={tableIcon} alt=""></img>
                        </div>
                        <div>
                            <h2>O download irá começar automaticamente</h2>
                            <img src={uploadBlackIcon} alt=""></img>
                        </div>
                        <div>
                            <h2>Processamento imediato</h2>
                            <img src={timeIcon} alt=""></img>
                        </div>
                    </div>
                    <div id="file-area-ctn" data-aos="fade-up">
                        <div id="file-with-heading">
                            <h1>Exporte a tabela de pedidos em .xlsx na área abaixo</h1>

                            <div id="file-with-span">
                                <div id="files-area" className={`
                                ${this.state.isDragging ? "over-area" : ""} 
                                ${this.state.files.length === 0 ? "" : "filled"}
                                ${this.state.fileErrorMessage !== "" ? "file-error": ""}`}
                                onDragEnter={() => this.setState ({isDragging: true, fileErrorMessage: ""})}
                                onDragLeave={() => this.setState ({isDragging: false})}
                                onDragOver={(e) => e.preventDefault ()}
                                onDrop={this.handleFile}>

                                    {this.state.files.length === 0 ?
                                    (<img src={uploadIcon} alt=""></img>) : 
                                    (this.state.files.length > 1 ?
                                        `Arquivos exportados (${this.state.files.length})` : 
                                        this.state.files.map (file => file.name).join ())}
                                </div>
                                <span>{this.state.fileErrorMessage}</span>
                            </div>
                        </div>

                        <button onClick={this.sendFile}
                                disabled={this.state.loading}
                                className={this.state.loading ? "loading" : ""}>
                            <span id="arrow-btn">➜</span>
                            {this.state.loading ? this.state.loadingStatus : "Gerar tabela"}
                            <span
                                    id="progress-bar"
                                    className={this.state.loading ? "progress-go" : ""}></span>
                        </button>

                        <input type="file"
                            id="open-file-hidden"
                            onChange={this.handleInputFile}
                            accept=".xlsx"/>

                        <label for="open-file-hidden"
                            id="open-file-label">
                            Selecionar Arquivos
                        </label>

                        <label id="remove-files"
                            onClick={() => this.setState ({files: []})}>
                            Remover Arquivos
                        </label>

                        <div id="status-form">

                            <label htmlFor="to-send">
                                <input
                                    id="to-send"
                                    type="checkbox"
                                    value="TO_SEND"
                                    checked={this.state.status.includes("TO_SEND")}
                                    onChange={this.handleStatusCheckbox}
                                />
                                Para enviar
                            </label>

                            <label htmlFor="sent">
                                <input
                                    id="sent"
                                    type="checkbox"
                                    value="SENT"
                                    checked={this.state.status.includes("SENT")}
                                    onChange={this.handleStatusCheckbox}
                                />
                                Enviado
                            </label>

                            <label htmlFor="delivered">
                                <input
                                    id="delivered"
                                    type="checkbox"
                                    value="DELIVERED"
                                    checked={this.state.status.includes("DELIVERED")}
                                    onChange={this.handleStatusCheckbox}
                                />
                                Entregue
                            </label>

                            <label htmlFor="concluded">
                                <input
                                    id="concluded"
                                    type="checkbox"
                                    value="CONCLUDED"
                                    checked={this.state.status.includes("CONCLUDED")}
                                    onChange={this.handleStatusCheckbox}
                                />
                                Concluído
                            </label>

                            <label htmlFor="cancelled">
                                <input
                                    id="cancelled"
                                    type="checkbox"
                                    value="CANCELLED"
                                    checked={this.state.status.includes("CANCELLED")}
                                    onChange={this.handleStatusCheckbox}
                                />
                                Cancelado
                            </label>

                            <label htmlFor="not-paid">
                                <input
                                    id="not-paid"
                                    type="checkbox"
                                    value="NOT_PAID"
                                    checked={this.state.status.includes("NOT_PAID")}
                                    onChange={this.handleStatusCheckbox}
                                />
                                Não pago
                            </label>

                            <label htmlFor="all-opt">
                                <input
                                    id="all-opt"
                                    type="checkbox"
                                    value="ALL_OPT"
                                    checked={this.state.status.includes("ALL_OPT")}
                                    onChange={this.handleAllStatusCheckbox}
                                />
                                Todos
                            </label>

                            <label htmlFor="none-opt">
                                <input
                                    id="none-opt"
                                    type="checkbox"
                                    value="NONE_OPT"
                                    checked={this.state.status.includes("NONE_OPT")}
                                    onChange={this.handleNoneStatusCheckbox}
                                />
                                Nenhum
                            </label>

                        </div>  
                    </div>
                </div>

                {createPortal(
                <>
                    <div
                        id="mobile-overflow"
                        className={
                            this.state.showMobileSidebar
                                ? "show"
                                : "hidden"
                        }
                        onClick={this.handleShowStatusMobileSidebar}
                    />

                    <div
                        id="mobile-sidebar-ctn"
                        className={
                            this.state.showMobileSidebar
                                ? "show"
                                : "hidden"
                        }
                    >

                        <div id="status-form-mobile">

                            <label htmlFor="to-send">
                                <input
                                    id="to-send"
                                    type="checkbox"
                                    value="TO_SEND"
                                    checked={this.state.status.includes("TO_SEND")}
                                    onChange={this.handleStatusCheckbox}
                                />
                                Para enviar
                            </label>

                            <label htmlFor="sent">
                                <input
                                    id="sent"
                                    type="checkbox"
                                    value="SENT"
                                    checked={this.state.status.includes("SENT")}
                                    onChange={this.handleStatusCheckbox}
                                />
                                Enviado
                            </label>

                            <label htmlFor="delivered">
                                <input
                                    id="delivered"
                                    type="checkbox"
                                    value="DELIVERED"
                                    checked={this.state.status.includes("DELIVERED")}
                                    onChange={this.handleStatusCheckbox}
                                />
                                Entregue
                            </label>

                            <label htmlFor="concluded">
                                <input
                                    id="concluded"
                                    type="checkbox"
                                    value="CONCLUDED"
                                    checked={this.state.status.includes("CONCLUDED")}
                                    onChange={this.handleStatusCheckbox}
                                />
                                Concluído
                            </label>

                            <label htmlFor="cancelled">
                                <input
                                    id="cancelled"
                                    type="checkbox"
                                    value="CANCELLED"
                                    checked={this.state.status.includes("CANCELLED")}
                                    onChange={this.handleStatusCheckbox}
                                />
                                Cancelado
                            </label>

                            <label htmlFor="not-paid">
                                <input
                                    id="not-paid"
                                    type="checkbox"
                                    value="NOT_PAID"
                                    checked={this.state.status.includes("NOT_PAID")}
                                    onChange={this.handleStatusCheckbox}
                                />
                                Não pago
                            </label>

                            <label htmlFor="all-opt">
                                <input
                                    id="all-opt"
                                    type="checkbox"
                                    value="ALL_OPT"
                                    checked={this.state.status.includes("ALL_OPT")}
                                    onChange={this.handleAllStatusCheckbox}
                                />
                                Todos
                            </label>

                            <label htmlFor="none-opt">
                                <input
                                    id="none-opt"
                                    type="checkbox"
                                    value="NONE_OPT"
                                    checked={this.state.status.includes("NONE_OPT")}
                                    onChange={this.handleNoneStatusCheckbox}
                                />
                                Nenhum
                            </label>

                        </div>

                        <button
                            id="mobile-sidebar"
                            onClick={this.handleShowStatusMobileSidebar}
                        >
                            Filtros
                        </button>

                    </div>
                </>,
                document.body
            )}
            </>
            
        )
    }


}

export default MetricsTable;