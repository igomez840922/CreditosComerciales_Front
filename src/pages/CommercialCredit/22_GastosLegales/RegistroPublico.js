import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react"
import { withTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import {
    Table,
    Card,
    CardBody,
    Pagination,
    PaginationItem,
    PaginationLink,
    CardFooter,
    Button,
    Row,
    Col,
} from "reactstrap"
import ApiServicesDetalleDocumentacion from '../../../services/DocumentacionLegal/ApiServicesDetalleDocumentacion';
import { BpmServices, BackendServices, CoreServices } from "../../../services";
import { useLocation, useHistory } from "react-router-dom";
import * as url from "../../../helpers/url_helper"
import SweetAlert from "react-bootstrap-sweetalert"
import { AvField, AvForm, AvGroup } from 'availity-reactstrap-validation';
import Switch from "react-switch";
import { useTranslation } from 'react-i18next';
import Currency from '../../../helpers/currency';
import LoadingOverlay from "react-loading-overlay"

const Offsymbol = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                fontSize: 12,
                color: "#fff",
                paddingRight: 2,
            }}
        >
            {" "}
            No
        </div>
    );
};
const OnSymbol = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                fontSize: 12,
                color: "#fff",
                paddingRight: 2,
            }}
        >
            {" "}
            Si
        </div>
    );
};
const estiloTotales = { backgroundColor: "lightgrey !important", color: "black !important", textAlign: "center" }
const jsonRegistro2 = [
    {
        tipo: "Venta de finca",
        cantidad: 1,
        amount: 0,
        habilita: false,
        id: 1,
        factor: 3
    },
    {
        tipo: "Garantía Hipotecaria sobre Bien Inmueble",
        cantidad: 1,
        amount: 0,
        habilita: false,
        id: 2,
        factor: 3
    },
    {
        tipo: "Fideicomiso de Garantía sobre Bien Inmueble",
        cantidad: 1,
        amount: 0,
        habilita: false,
        id: 3,
        factor: 2.5
    },
    {
        tipo: "Calificación del Contrato de Fideicomiso",
        cantidad: 1,
        amount: 50,
        factor: 0,
        habilita: false,
        id: 4
    },
    {
        tipo: "Calificación del Contrato de Préstamo",
        cantidad: 1,
        amount: 25,
        factor: 0,
        habilita: false,
        id: 5
    },
    {
        tipo: "Calificación de Acta (por cada acta)",
        cantidad: 1,
        amount: 25,
        factor: 0,
        habilita: false,
        id: 6
    },
    {
        tipo: "Marginal de Garantía (por cada finca)",
        cantidad: 1,
        amount: 8,
        factor: 0,
        habilita: false,
        id: 7
    },
    {
        tipo: "Calificación de finca (por cada finca)",
        cantidad: 1,
        amount: 10,
        factor: 0,
        habilita: false,
        id: 8
    },
    {
        tipo: "Anticresis (solo cuando es Garantía Hipotecaria sobre Bien Inmueble y se cobra 1 sola vez por escritura sin importar el número de fincas involucradas en el trámite)",
        cantidad: 1,
        amount: 8,
        factor: 0,
        habilita: false,
        id: 9
    },
    {
        tipo: "Cancelación de Garantía Hipotecaria sobre Bien Inmueble",
        cantidad: 1,
        amount: 31,
        factor: 0,
        habilita: false,
        id: 10
    },
    {
        tipo: "Segregación de finca",
        cantidad: 1,
        amount: 10,
        factor: 0,
        habilita: false,
        id: 11
    },
    {
        tipo: "Desafectación de Fideicomiso de Garantía",
        cantidad: 1,
        amount: 25,
        factor: 0,
        habilita: false,
        id: 12
    },
    {
        tipo: "Modificación de Contrato de Fideicomiso (adendas)",
        cantidad: 1,
        amount: 50,
        factor: 0,
        habilita: false,
        id: 13
    },
    {
        tipo: "Modificación de Contrato de Préstamo que no modifique el monto (adendas)",
        cantidad: 1,
        amount: 35,
        factor: 0,
        habilita: false,
        id: 14
    },
]
const RegistroPublico = (props) => {
    const [isActiveLoading, setIsActiveLoading] = useState(false); //loading de la pagina

    const [tipoDato, settipoDato] = useState("local");
    const [switch2, setswitch2] = useState(false);
    const [switch3, setswitch3] = useState(false);
    const [switch4, setswitch4] = useState(false);
    const [switch5, setswitch5] = useState(false);
    const [switch6, setswitch6] = useState(false);
    const [switch7, setswitch7] = useState(false);
    const [switch8, setswitch8] = useState(false);
    const [switch9, setswitch9] = useState(false);
    const [jsonData, setjsonData] = useState(null);
    const [jsonRegistro, setjsonRegistro] = useState(null);
    const [dataRows, setdataRows] = useState(null);
    const [garantias, setgarantias] = useState(null);
    const [garantiasValue, setgarantiasValue] = useState(0);
    const [total, settotal] = useState(0);
    const { t, i18n } = useTranslation();
    const currencyData = new Currency();
    const coreServices = new CoreServices();
    const apiServiceBackend = new BackendServices();
    const location = useLocation()
    const [dataService, setdataService] = useState(null);

    const [openModalRiesgo, setopenModalRiesgo] = useState(false);
    const [messageNotAvailable, setmessageNotAvailable] = useState(false);
    const [locationData, setLocationData] = useState(location.data);
    const history = useHistory();
    // onClick={() => {
    //     let valor = document.getElementById("valor").value;
    //     document.getElementById("datoooo").innerHTML = (parseFloat(Math.ceil(parseFloat(valor) / 1000)) * 1000)
    // }}
    React.useEffect(() => {
        let dataSession;
        if (location.data !== null && location.data !== undefined) {
            if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
                history.push(url.URL_DASHBOARD);
            } else {
                sessionStorage.setItem('locationData', JSON.stringify(location.data));
                setLocationData(location.data);
                dataSession = location.data;
            }
        } else {
            //chequeamos si tenemos guardado en session
            var result = sessionStorage.getItem('locationData');

            if (result !== undefined && result !== null) {
                result = JSON.parse(result);
                setLocationData(result);
                dataSession = result;
            }
        }
        if (props.activeTab == 4) {
            setIsActiveLoading(true)
            loadData(dataSession)
        }

    }, [props.activeTab == 4]);
    async function loadData(dataSession) {
        await apiServiceBackend.getDocumentationJson(dataSession.transactionId).then(async resp => {
            if (resp.legalDocResults.find(x => x.typeDocument == "registroPublico")) {
                setdataService(resp.legalDocResults.find(x => x.typeDocument == "registroPublico"))
                settotal(resp.legalDocResults.find(x => x.typeDocument == "registroPublico").amount)
                let dato = Object.entries(resp.legalDocResults.find(x => x.typeDocument == "registroPublico")?.dataJson).map(object => object[1]);
                setdataRows(dato.map((resp, i) => (
                    resp.tipo ?
                        <tr>
                            <td>{resp.tipo}</td>
                            <td>
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" ><b>$</b></span>
                                    </div>
                                    <input
                                        style={{ textAlign: "right" }}
                                        className="form-control precios"
                                        type="text"
                                        name={"preciosEs" + resp.id}
                                        id={"preciosEs" + resp.id}
                                        pattern="^[0-9,.]*$"
                                        onChange={(e) => {
                                            check()
                                            let valor = currencyData.getRealValue(document.getElementById("preciosEs" + resp.id).value == "" ? 0 : document.getElementById("preciosEs" + resp.id).value);
                                            if (resp.id == 1 || resp.id == 2 || resp.id == 3) {
                                                let factorEs = document.getElementById("factorEs" + resp.id).value == "" ? 0 : document.getElementById("factorEs" + resp.id).value;
                                                document.getElementById("total" + resp.id).innerHTML = currencyData.format(parseFloat((parseFloat(Math.ceil(parseFloat(valor) / 1000)) * 1000) * parseFloat(factorEs / 1000)).toFixed(2));
                                            } else if (resp.id == 6 || resp.id == 7 || resp.id == 8 || resp.id == 10 || resp.id == 11 || resp.id == 12) {
                                                let cantidadEs = document.getElementById("cantidadEs" + resp.id).value == "" ? 0 : document.getElementById("cantidadEs" + resp.id).value;
                                                document.getElementById("total" + resp.id).innerHTML = currencyData.format(parseFloat(parseFloat(valor) * parseFloat(cantidadEs)).toFixed(2));
                                            } else {
                                                document.getElementById("total" + resp.id).innerHTML = currencyData.format(parseFloat(parseFloat(valor)).toFixed(2));
                                            }
                                        }}
                                        onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                                        defaultValue={currencyData.format(parseFloat(resp.amount).toFixed(2))}
                                        title={t("")}

                                    />
                                </div>
                            </td>
                            <td>{resp.id == 6 || resp.id == 7 || resp.id == 8 || resp.id == 10 || resp.id == 11 || resp.id == 12 ? <input
                                style={{ textAlign: "right" }}
                                className="form-control cantidad"
                                type="number"
                                min="1"
                                name={"cantidadEs" + resp.id}
                                id={"cantidadEs" + resp.id}
                                pattern="^[0-9,.]*$"
                                onChange={(e) => {
                                    check()
                                    let valor = currencyData.getRealValue(document.getElementById("preciosEs" + resp.id).value == "" ? 0 : document.getElementById("preciosEs" + resp.id).value);
                                    let cantidadEs = document.getElementById("cantidadEs" + resp.id).value == "" ? 0 : document.getElementById("cantidadEs" + resp.id).value;
                                    document.getElementById("total" + resp.id).innerHTML = currencyData.format(parseFloat(parseFloat(valor) * parseFloat(cantidadEs)).toFixed(2));
                                }}
                                defaultValue={resp.cantidad}
                                title={t("")}
                            /> : null}</td>
                            <td>{resp.id == 1 || resp.id == 2 || resp.id == 3 ? <input
                                style={{ textAlign: "right" }}
                                className="form-control factor"
                                type="text"
                                name={"factorEs" + resp.id}
                                id={"factorEs" + resp.id}
                                pattern="^[0-9,.]*$"
                                onChange={(e) => {
                                    check()
                                    let valor = currencyData.getRealValue(document.getElementById("preciosEs" + resp.id).value == "" ? 0 : document.getElementById("preciosEs" + resp.id).value);
                                    let factorEs = document.getElementById("factorEs" + resp.id).value == "" ? 0 : document.getElementById("factorEs" + resp.id).value;
                                    document.getElementById("total" + resp.id).innerHTML = currencyData.format(parseFloat((parseFloat(Math.ceil(parseFloat(valor) / 1000)) * 1000) * parseFloat(factorEs / 1000)).toFixed(2));
                                }}
                                defaultValue={resp.factor}
                                title={t("")}
                            /> : null}</td>
                            <td>
                                $<strong id={"total" + resp.id}>{currencyData.format(parseFloat(resp.tipo == "Garantía Hipotecaria sobre Bien Inmueble" || resp.tipo == "Fideicomiso de Garantía sobre Bien Inmueble" ? currencyData.format(parseFloat(parseFloat(resp.amount) * parseFloat(resp.factor / 1000)).toFixed(2)) : resp.amount).toFixed(2))}</strong>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <input className="aplicaReg"
                                    identificador={resp.id}
                                    defaultValue={resp.habilita == "ON" ? true : false}
                                    onChange={(e) => {
                                        check()
                                    }} type="checkbox" id={"checkCAFReg" + resp.id} name={"checkCAFReg" + resp.id} />
                            </td>
                        </tr>
                        : null
                )))
                setjsonRegistro(dato)
                setjsonData(dato)
                settipoDato("base")
                setTimeout(() => {
                    setIsActiveLoading(false)
                    for (let i = 0; i < dato.length; i++) {
                        let valor = dato[i].amount
                        if (dato[i].id == 6 || dato[i].id == 7 || dato[i].id == 8 || dato[i].id == 10 || dato[i].id == 11 || dato[i].id == 12) {
                            let cantidadEs = dato[i].cantidad;
                            document.getElementById("total" + dato[i].id).innerHTML = currencyData.format(parseFloat(parseFloat(valor) * parseFloat(cantidadEs)).toFixed(2));
                        } else if (dato[i].id == 1 || dato[i].id == 2 || dato[i].id == 3) {
                            let factorEs = dato[i].factor;
                            console.log(currencyData.format(parseFloat((parseFloat(Math.ceil(parseFloat(valor) / 1000)) * 1000) * parseFloat(factorEs / 1000)).toFixed(2)));
                            document.getElementById("total" + dato[i].id).innerHTML = currencyData.format(parseFloat((parseFloat(Math.ceil(parseFloat(valor) / 1000)) * 1000) * parseFloat(factorEs / 1000)).toFixed(2));
                        } else {
                            document.getElementById("total" + dato[i].id).innerHTML = currencyData.format(parseFloat(parseFloat(valor??0)).toFixed(2));
                        }
                        document.getElementById("checkCAFReg" + dato[i].id).checked = dato[i].habilita
                    }
                }, 2500);
            } else {
                settipoDato("local")
                setjsonData(jsonRegistro2)
                setjsonRegistro(jsonRegistro2)
                setIsActiveLoading(false)
                initializeData(dataSession);
            }
        }).catch(err => {
            setIsActiveLoading(false)
        })
    }
    async function initializeData(dataSession) {
        await apiServiceBackend.consultGeneralDataPropCred(dataSession?.transactionId ?? dataSession?.transactionId ?? 0)
            .then(async (data) => {
                let requestId = data[0]?.requestId;
                await apiServiceBackend.retrieveProposalType()
                    .then(async (propuesta) => {
                        await apiServiceBackend.retrieveFacilityType()
                            .then(async (facilidad) => {
                                await apiServiceBackend.consultarFacilidades(requestId).then(async resp => {
                                    let jsonGarantias = [];
                                    let total = 0;
                                    let jsonGarantias2 = [];
                                    let total2 = 0;
                                    await coreServices.getTipoGarantiaCatalogo().then(async response => {
                                        for (let i = 0; i < resp.length; i++) {
                                            await apiServiceBackend.consultarGarantiaPropCred(resp[i].facilityId).then(async garantias => {
                                                if (garantias != undefined) {
                                                    for (let j = 0; j < garantias.length; j++) {
                                                        if (garantias[j].guaranteeTypeName == "200") {
                                                            if (resp[i].applyEscrow == false) {
                                                                total = parseFloat(total) + parseFloat(garantias[j].commercialValue);
                                                                jsonGarantias.push({
                                                                    amount: parseFloat(garantias[j].commercialValue),
                                                                    guaranteeId: Number(garantias[j].guaranteeId),
                                                                    fastValue: parseFloat(garantias[j].fastValue),
                                                                    label: response.Records.find(x => x.Code === garantias[j].guaranteeTypeName)?.Description
                                                                })
                                                            } else {
                                                                total2 = parseFloat(total2) + parseFloat(garantias[j].commercialValue);
                                                                jsonGarantias2.push({
                                                                    amount: parseFloat(garantias[j].commercialValue),
                                                                    guaranteeId: Number(garantias[j].guaranteeId),
                                                                    fastValue: parseFloat(garantias[j].fastValue),
                                                                    label: response.Records.find(x => x.Code === garantias[j].guaranteeTypeName)?.Description
                                                                })
                                                            }
                                                        }

                                                    }
                                                }
                                            })
                                        }
                                        let indice = 0;
                                        for (let i = 0; i < jsonRegistro2.length; i++) {
                                            if (jsonRegistro2[i].tipo) {
                                                if (jsonRegistro2[i].tipo == "Garantía Hipotecaria sobre Bien Inmueble") {
                                                    indice = i;
                                                }
                                            }
                                        }
                                        let indice2 = 0;
                                        for (let i = 0; i < jsonRegistro2.length; i++) {
                                            if (jsonRegistro2[i].tipo) {
                                                if (jsonRegistro2[i].tipo == "Fideicomiso de Garantía sobre Bien Inmueble") {
                                                    indice2 = i;
                                                }
                                            }
                                        }

                                        jsonRegistro2[indice].amount = parseFloat((parseFloat(Math.ceil(parseFloat(total) / 1000)) * 1000)).toFixed(2);
                                        jsonRegistro2[indice2].amount = parseFloat((parseFloat(Math.ceil(parseFloat(total2) / 1000)) * 1000)).toFixed(2);
                                        setjsonData(jsonData)
                                        setgarantias(jsonGarantias)
                                        if (tipoDato == "local") {
                                            setdataRows(jsonRegistro2.map((resp, i) => (
                                                resp.tipo ?
                                                    <tr>
                                                        <td>{resp.tipo}</td>
                                                        <td>
                                                            <div class="input-group mb-3">
                                                                <div class="input-group-prepend">
                                                                    <span class="input-group-text" ><b>$</b></span>
                                                                </div>
                                                                <input
                                                                    style={{ textAlign: "right" }}
                                                                    className="form-control precios"
                                                                    type="text"
                                                                    name={"preciosEs" + resp.id}
                                                                    id={"preciosEs" + resp.id}
                                                                    pattern="^[0-9,.]*$"
                                                                    onChange={(e) => {
                                                                        check()
                                                                        let valor = currencyData.getRealValue(document.getElementById("preciosEs" + resp.id).value == "" ? 0 : document.getElementById("preciosEs" + resp.id).value);
                                                                        if (resp.id == 1 || resp.id == 2 || resp.id == 3) {
                                                                            let factorEs = document.getElementById("factorEs" + resp.id).value == "" ? 0 : document.getElementById("factorEs" + resp.id).value;
                                                                            document.getElementById("total" + resp.id).innerHTML = currencyData.format(parseFloat((parseFloat(Math.ceil(parseFloat(valor) / 1000)) * 1000) * parseFloat(factorEs / 1000)).toFixed(2));
                                                                        } else if (resp.id == 6 || resp.id == 7 || resp.id == 8 || resp.id == 10 || resp.id == 11 || resp.id == 12) {
                                                                            let cantidadEs = document.getElementById("cantidadEs" + resp.id).value == "" ? 0 : document.getElementById("cantidadEs" + resp.id).value;
                                                                            document.getElementById("total" + resp.id).innerHTML = currencyData.format(parseFloat(parseFloat(valor) * parseFloat(cantidadEs)).toFixed(2));
                                                                        } else {
                                                                            document.getElementById("total" + resp.id).innerHTML = currencyData.format(parseFloat(parseFloat(valor)).toFixed(2));
                                                                        }
                                                                    }}
                                                                    onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                                                                    defaultValue={currencyData.format(parseFloat(resp.amount).toFixed(2))}
                                                                    title={t("")}

                                                                />
                                                            </div>
                                                        </td>
                                                        <td>{resp.id == 6 || resp.id == 7 || resp.id == 8 || resp.id == 10 || resp.id == 11 || resp.id == 12 ? <input
                                                            style={{ textAlign: "right" }}
                                                            className="form-control cantidad"
                                                            type="number"
                                                            min="1"
                                                            name={"cantidadEs" + resp.id}
                                                            id={"cantidadEs" + resp.id}
                                                            pattern="^[0-9,.]*$"
                                                            onChange={(e) => {
                                                                check()
                                                                let valor = currencyData.getRealValue(document.getElementById("preciosEs" + resp.id).value == "" ? 0 : document.getElementById("preciosEs" + resp.id).value);
                                                                let cantidadEs = document.getElementById("cantidadEs" + resp.id).value == "" ? 0 : document.getElementById("cantidadEs" + resp.id).value;
                                                                document.getElementById("total" + resp.id).innerHTML = currencyData.format(parseFloat(parseFloat(valor) * parseFloat(cantidadEs)).toFixed(2));
                                                            }}
                                                            defaultValue={resp.cantidad}
                                                            title={t("")}
                                                        /> : null}</td>
                                                        <td>{resp.id == 1 || resp.id == 2 || resp.id == 3 ? <input
                                                            style={{ textAlign: "right" }}
                                                            className="form-control factor"
                                                            type="text"
                                                            name={"factorEs" + resp.id}
                                                            id={"factorEs" + resp.id}
                                                            pattern="^[0-9,.]*$"
                                                            onChange={(e) => {
                                                                check()
                                                                let valor = currencyData.getRealValue(document.getElementById("preciosEs" + resp.id).value == "" ? 0 : document.getElementById("preciosEs" + resp.id).value);
                                                                let factorEs = document.getElementById("factorEs" + resp.id).value == "" ? 0 : document.getElementById("factorEs" + resp.id).value;
                                                                document.getElementById("total" + resp.id).innerHTML = currencyData.format(parseFloat((parseFloat(Math.ceil(parseFloat(valor) / 1000)) * 1000) * parseFloat(factorEs / 1000)).toFixed(2));
                                                            }}
                                                            defaultValue={resp.factor}
                                                            title={t("")}
                                                        /> : null}</td>
                                                        <td>
                                                            $<strong id={"total" + resp.id}>{currencyData.format(parseFloat(resp.tipo == "Garantía Hipotecaria sobre Bien Inmueble" || resp.tipo == "Fideicomiso de Garantía sobre Bien Inmueble" ? currencyData.format(parseFloat(parseFloat(resp.amount) * parseFloat(resp.factor / 1000)).toFixed(2)) : resp.amount).toFixed(2))}</strong>
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>
                                                            <input className="aplicaReg"
                                                                identificador={resp.id}
                                                                onChange={(e) => {
                                                                    check()
                                                                }} type="checkbox" id={"checkCAFReg" + resp.id} name={"checkCAFReg" + resp.id} />
                                                        </td>
                                                    </tr>
                                                    : null
                                            )))
                                        } else {
                                            setdataRows(jsonRegistro.map((resp, i) => (
                                                resp.tipo ?
                                                    <tr>
                                                        <td>{resp.tipo}</td>
                                                        <td>
                                                            <div class="input-group mb-3">
                                                                <div class="input-group-prepend">
                                                                    <span class="input-group-text" ><b>$</b></span>
                                                                </div>
                                                                <input
                                                                    style={{ textAlign: "right" }}
                                                                    className="form-control precios"
                                                                    type="text"
                                                                    name={"preciosEs" + resp.id}
                                                                    id={"preciosEs" + resp.id}
                                                                    pattern="^[0-9,.]*$"
                                                                    onChange={(e) => {
                                                                        check()
                                                                        let valor = currencyData.getRealValue(document.getElementById("preciosEs" + resp.id).value == "" ? 0 : document.getElementById("preciosEs" + resp.id).value);
                                                                        if (resp.id == 1 || resp.id == 2 || resp.id == 3) {
                                                                            let factorEs = document.getElementById("factorEs" + resp.id).value == "" ? 0 : document.getElementById("factorEs" + resp.id).value;
                                                                            document.getElementById("total" + resp.id).innerHTML = currencyData.format(parseFloat((parseFloat(Math.ceil(parseFloat(valor) / 1000)) * 1000) * parseFloat(factorEs / 1000)).toFixed(2));
                                                                        } else if (resp.id == 6 || resp.id == 7 || resp.id == 8 || resp.id == 10 || resp.id == 11 || resp.id == 12) {
                                                                            let cantidadEs = document.getElementById("cantidadEs" + resp.id).value == "" ? 0 : document.getElementById("cantidadEs" + resp.id).value;
                                                                            document.getElementById("total" + resp.id).innerHTML = currencyData.format(parseFloat(parseFloat(valor) * parseFloat(cantidadEs)).toFixed(2));
                                                                        } else {
                                                                            document.getElementById("total" + resp.id).innerHTML = currencyData.format(parseFloat(parseFloat(valor)).toFixed(2));
                                                                        }
                                                                    }}
                                                                    onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                                                                    defaultValue={currencyData.format(parseFloat(resp.amount).toFixed(2))}
                                                                    title={t("")}

                                                                />
                                                            </div>
                                                        </td>
                                                        <td>{resp.id == 6 || resp.id == 7 || resp.id == 8 || resp.id == 10 || resp.id == 11 || resp.id == 12 ? <input
                                                            style={{ textAlign: "right" }}
                                                            className="form-control cantidad"
                                                            type="number"
                                                            min="1"
                                                            name={"cantidadEs" + resp.id}
                                                            id={"cantidadEs" + resp.id}
                                                            pattern="^[0-9,.]*$"
                                                            onChange={(e) => {
                                                                check()
                                                                let valor = currencyData.getRealValue(document.getElementById("preciosEs" + resp.id).value == "" ? 0 : document.getElementById("preciosEs" + resp.id).value);
                                                                let cantidadEs = document.getElementById("cantidadEs" + resp.id).value == "" ? 0 : document.getElementById("cantidadEs" + resp.id).value;
                                                                document.getElementById("total" + resp.id).innerHTML = currencyData.format(parseFloat(parseFloat(valor) * parseFloat(cantidadEs)).toFixed(2));
                                                            }}
                                                            defaultValue={resp.cantidad}
                                                            title={t("")}
                                                        /> : null}</td>
                                                        <td>{resp.id == 1 || resp.id == 2 || resp.id == 3 ? <input
                                                            style={{ textAlign: "right" }}
                                                            className="form-control factor"
                                                            type="text"
                                                            name={"factorEs" + resp.id}
                                                            id={"factorEs" + resp.id}
                                                            pattern="^[0-9,.]*$"
                                                            onChange={(e) => {
                                                                check()
                                                                let valor = currencyData.getRealValue(document.getElementById("preciosEs" + resp.id).value == "" ? 0 : document.getElementById("preciosEs" + resp.id).value);
                                                                let factorEs = document.getElementById("factorEs" + resp.id).value == "" ? 0 : document.getElementById("factorEs" + resp.id).value;
                                                                document.getElementById("total" + resp.id).innerHTML = currencyData.format(parseFloat((parseFloat(Math.ceil(parseFloat(valor) / 1000)) * 1000) * parseFloat(factorEs / 1000)).toFixed(2));
                                                            }}
                                                            defaultValue={resp.factor}
                                                            title={t("")}
                                                        /> : null}</td>
                                                        <td>
                                                            $<strong id={"total" + resp.id}>{currencyData.format(parseFloat(resp.tipo == "Garantía Hipotecaria sobre Bien Inmueble" || resp.tipo == "Fideicomiso de Garantía sobre Bien Inmueble" ? currencyData.format(parseFloat(parseFloat(resp.amount) * parseFloat(resp.factor / 1000)).toFixed(2)) : resp.amount).toFixed(2))}</strong>
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>
                                                            <input className="aplicaReg"
                                                                identificador={resp.id}
                                                                defaultValue={resp.habilita == "ON" ? true : false}
                                                                onChange={(e) => {
                                                                    check()
                                                                }} type="checkbox" id={"checkCAFReg" + resp.id} name={"checkCAFReg" + resp.id} />
                                                        </td>
                                                    </tr>
                                                    : null
                                            )))
                                        }

                                    })
                                })
                            });
                    });
            });
    }
    function check() {
        settotal(() => {
            let suma = 0;
            var checkboxes = document.getElementsByClassName("aplicaReg");
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    suma += parseFloat(currencyData.getRealValue(document.getElementById("total" + checkboxes[i].getAttribute("identificador")).innerHTML.replace("$", "") == "" ? 0 : document.getElementById("total" + checkboxes[i].getAttribute("identificador")).innerHTML.replace("$", "")));
                }
            }
            return suma;
        })
    }
    async function saveData() {
        setIsActiveLoading(true)
        for (let i = 0; i < jsonRegistro.length; i++) {
            if (jsonRegistro[i]?.amount) {
                jsonRegistro[i].amount = currencyData.getRealValue(document.getElementById("preciosEs" + jsonRegistro[i].id).value);
                jsonRegistro[i].factor = document.getElementById("factorEs" + jsonRegistro[i].id) ? document.getElementById("factorEs" + jsonRegistro[i].id).value : 0;
                jsonRegistro[i].habilita = document.getElementById("checkCAFReg" + jsonRegistro[i].id).checked;
                jsonRegistro[i].cantidad = document.getElementById("cantidadEs" + jsonRegistro[i].id) ? document.getElementById("cantidadEs" + jsonRegistro[i].id).value : 1;
            }
        }
        jsonRegistro[14] = { transactId: locationData.transactionId, totalValue: (parseFloat(total).toFixed(2) ?? 0) }
        setjsonRegistro(jsonRegistro)
        await apiServiceBackend.getDocumentationJson(locationData.transactionId).then(async resp => {
            if (resp.legalDocResults.find(x => x.typeDocument == "registroPublico")) {
                await apiServiceBackend.updateDocumentationJson(locationData.transactionId, 1, "registroPublico", jsonRegistro, (parseFloat(total).toFixed(2) ?? 0), dataService != null ? dataService.resultId : 0, true).then(resp => {
                    setIsActiveLoading(false)
                }).catch(err => {
                    setIsActiveLoading(false)
                })
            } else {
                await apiServiceBackend.newDocumentationJson(locationData.transactionId, 1, "registroPublico", jsonRegistro, (parseFloat(total).toFixed(2) ?? 0), dataService != null ? dataService.resultId : 0, true).then(resp => {
                    setIsActiveLoading(false)
                }).catch(err => {
                    setIsActiveLoading(false)
                })
            }
        })
    }
    return (
        <React.Fragment>
            <LoadingOverlay active={isActiveLoading} spinner text={t("Processinginformation")}>
                <AvForm>
                    <Row>
                        <Col md="12">
                            <div className="table-responsive styled-table-div">
                                <Table className="table table-striped table-hover styled-table table">
                                    <thead>
                                        <tr style={{ textAlign: "center" }}>
                                            <td>Tipo de trámite</td>
                                            <td>Précio establecido</td>
                                            <td>Cantidad</td>
                                            <td>Factor</td>
                                            <td>Total</td>
                                            <td>Habilita</td>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {dataRows}
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td style={{ textAlign: "right" }}><b>Total registro público</b></td>
                                            <td style={{ textAlign: "right" }}><b>${currencyData.format(parseFloat(total).toFixed(2) ?? 0)}</b></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12" style={{ textAlign: "right" }}>
                            <Button className="btn " color="success" type="button" onClick={() => { saveData() }}><i className="mdi mdi-content-save mdi-12px"></i>{" "}{t("Save")}</Button>
                        </Col>
                    </Row>
                </AvForm>
            </LoadingOverlay>
        </React.Fragment>
    );
}
export default RegistroPublico;
