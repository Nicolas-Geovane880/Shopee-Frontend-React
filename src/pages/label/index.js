import React from "react";
import "./label.css"
import minimalistIconUltra from "../../assets/images/minimalist-ultra-icon.png";
import uploadIcon from "../../assets/images/upload.png";
import tableIcon from "../../assets/images/table.png";
import labelIcon from "../../assets/images/label.png";
import timeIcon from "../../assets/images/timer.png";
import AOS from "aos";
import "aos/dist/aos.css"

class LabelDrop extends React.Component {

    constructor (props) {
        super (props);

        this.state = {
            files: [],
            isDragging: false,

            fileErrorMessage: "",

            loading: false,
            loadingStatus: "Carregando",
        }

        this.handleFile = this.handleFile.bind (this);
        this.sendFiles = this.sendFiles.bind (this);
        this.validateFiles = this.validateFiles.bind (this);
        this.handleInputFile = this.handleInputFile.bind (this);
    }

    componentDidMount () {
        AOS.init ({
            duration: 800,
            once: true
        })
    }

    handleFile (e) {
        e.preventDefault ();

        const files = Array.from (e.dataTransfer.files).filter (file => file.type === "application/pdf");

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

    validateFiles (files) {
        let fileErrorMessage = ""

        if (files.length === 0) {
            fileErrorMessage = "Exporte pelo menos 1 arquivo PDF";
        }

        this.setState ({fileErrorMessage});

        if (fileErrorMessage !== "") return false;

        return true;
    }

    async sendFiles () {
        const isValid = this.validateFiles (this.state.files);

        if (!isValid) return;

        this.setState ({loading: true});

        const formData = new FormData ();

        this.state.files.forEach (file => formData.append ("files", file));

        try {
                const response = await fetch (`${process.env.REACT_APP_API_URL_SPRING}/api/v1/labels/`, {
                    method: "POST",
                    body: formData,
                }).catch (() => {throw new Error ("acacacacac")});
                
                if (!response.ok) {
                    const data = await response.json ();
                    throw new Error (data.message);
                }
        
                const blob = await response.blob ();
        
                const url = window.URL.createObjectURL (blob);
        
                const a = document.createElement ("a");
                a.href = url;
                a.download = `Relatorio_${new Date (Date.now ()).toISOString ().split ("T")[0]}.pdf`;
        
                a.click ();
        
                window.URL.revokeObjectURL (url);
        } catch (error) {
            this.setState ({fileErrorMessage: error.message});
        } finally {
            this.setState ({loading: false});
        }

    }

    render () {
        return (
            <div id="main-container-label">
                <div id="cards-info" data-aos="fade-down" data-aos-delay="200" data-aos-duration="1000">
                    <div>
                        <h2>Exporte suas etiquetas em .pdf</h2>
                        <img src={labelIcon} alt=""></img>
                    </div>
                    <div>
                        <h2>O download irá começar automaticamente</h2>
                        <img src={tableIcon} alt=""></img>
                    </div>
                    <div>
                        <h2>Processamento imediato</h2>
                        <img src={timeIcon} alt=""></img>
                    </div>
                </div>
                <div id="file-area-ctn" data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
                    <div id="file-with-heading">
                        <h1>Exporte as etiquetas em formato PDF na área abaixo</h1>

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

                    <button onClick={this.sendFiles}
                            disabled={this.state.loading}
                            className={this.state.loading ? "loading" : ""}>
                        <span id="arrow-btn">➜</span>
                        {this.state.loading ? this.state.loadingStatus : "Gerar tabela"}
                        <span
                             id="progress-bar"
                             className={this.state.loading ? "progress-go" : ""}></span>
                    </button>

                    <input type="file" id="open-file-hidden" multiple onChange={this.handleInputFile}/>

                    <label for="open-file-hidden" id="open-file-label">
                        Selecionar Arquivos
                    </label>

                    <label id="remove-files" onClick={() => this.setState ({files: []})}>
                        Remover Arquivos
                    </label>
                </div>
            </div>
        )
    }
}

export default LabelDrop;