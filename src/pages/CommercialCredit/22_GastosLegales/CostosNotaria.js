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
import { BpmServices, BackendServices } from "../../../services";
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
const jsonNotaria2 = [
    {
        label: "Caso escritura sencilla con fideicomiso", cod: 1, data: [
            { tipo: "Caso escritura sencilla con fideicomiso #1", contiene: "Cancelación, confección de 1 hasta 3 facilidades, contrato de fideicomiso, confeccion de 1 hasta 3 actas de sociedad", amount: 545.00, aplica: false, id: 1 },
            { tipo: "Caso escritura sencilla con fideicomiso #2", contiene: "Venta, confección de 1 hasta 3 facilidades, contrato de fideicomiso, confección de 1 hasta 3 actas de sociedad", amount: 580.00, aplica: false, id: 2 },
            { tipo: "Caso escritura sencilla con fideicomiso #3", contiene: "Confección de 1 hasta 3 facilidades, contrato de fideicomiso y confección de 1 hasta 3 actas de sociedad", amount: 498.00, aplica: false, id: 3 },
            { tipo: "Caso escritura sencilla con fideicomiso #4", contiene: "Confección de 1 hasta 3 facilidades, contrato de fideicomiso y confección de 1 hasta 3 actas de sociedad", amount: 680.00, aplica: false, id: 4 },
        ]
    },
    {
        label: "Caso escritura compleja con fideicomiso", cod: 2, data: [
            { tipo: "Caso escritura compleja con fideicomiso #1", contiene: "Cancelación o desafectación de fincas, venta de fincas, confección de hasta 5 facilidades, contrato de fideicomiso y confección de 1 hasta 3 actas de sociedad", amount: 890.00, aplica: false, id: 5 },
            { tipo: "Caso de escritura con modificación a fideicomiso", contiene: "Adenda al contrato de fideicomiso", amount: 400.00, aplica: false, id: 6 },
        ]
    },
    {
        label: "Caso escritura sencilla con hipoteca", cod: 3, data: [
            { tipo: "Caso escritura sencilla con hipoteca #1", contiene: "Cancelación, confección de 1 hasta 3 facilidades y confección de 1 hasta 3 actas de sociedad", amount: 460.00, aplica: false, id: 7 },
            { tipo: "Caso escritura sencilla con hipoteca #2", contiene: "Venta, confección de 1 hasta 3 facilidades, confección de 1 hasta 3 actas de sociedad", amount: 420.00, aplica: false, id: 8 },
            { tipo: "Caso escritura sencilla con hipoteca #3", contiene: "Cancelación o desafectación, venta de fincas, confección de 1 hasta 3 y confección de 1 hasta 3 actas de sociedad", amount: 450.00, aplica: false, id: 9 },
            { tipo: "Caso escritura sencilla con hipoteca #4", contiene: "Confección de 1 hasta 3 facilidades y confección de 1 hasta 3 actas de sociedad", amount: 370.00, aplica: false, id: 10 },
        ]
    },
    {
        label: "Caso escritura compleja con Hipoteca", cod: 4, data: [
            { tipo: "Caso escritura compleja con hipoteca #1", contiene: "Cancelación o desafectación de fincas, venta de fincas, hasta 5 facilidades, contrato de fideicomiso y confección de 1 a 3 actas de sociedad", amount: 625.00, aplica: false, id: 11 },
            { tipo: "Caso de escritura con modificación a hipoteca (adenda)", contiene: "Adenda al contrato de hipoteca", amount: 375.00, aplica: false, id: 12 },
        ]
    },
    { transactId: 0, totalValue: 0 }
]
const estiloTotales = { backgroundColor: "lightgrey !important", color: "black !important", textAlign: "center" }
const CostosNotaria = (props) => {
    const [isActiveLoading, setIsActiveLoading] = useState(false); //loading de la pagina

    const [switch1, setswitch1] = useState(false);
    const [switch2, setswitch2] = useState(false);
    const [switch3, setswitch3] = useState(false);
    const [switch4, setswitch4] = useState(false);
    const [switch5, setswitch5] = useState(false);
    const [switch6, setswitch6] = useState(false);
    const [switch7, setswitch7] = useState(false);
    const [switch8, setswitch8] = useState(false);
    const [switch9, setswitch9] = useState(false);
    const [switch10, setswitch10] = useState(false);
    const [jsonNotaria, setjsonNotaria] = useState(null);
    const [switch11, setswitch11] = useState(false);
    const [switch12, setswitch12] = useState(false);
    const [total, settotal] = useState(0);
    const { t, i18n } = useTranslation();
    const currencyData = new Currency();
    const apiServiceBackend = new BackendServices();
    const location = useLocation()
    const [openModalRiesgo, setopenModalRiesgo] = useState(false);
    const [dataRows, setdataRows] = useState(null);
    const [dataService, setdataService] = useState(null);
    const [locationData, setLocationData] = useState(location.data);
    const history = useHistory();
    React.useEffect(() => {
        let dataSession;
        if (location.data !== null && location.data !== undefined) {
            if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
                history.push(url.URL_DASHBOARD);
            } else {
                sessionStorage.setItem('locationData', JSON.stringify(location.data));
                setLocationData(location.data);
                dataSession = location.data;
                loadData(dataSession)

            }
        } else {
            //chequeamos si tenemos guardado en session
            var result = sessionStorage.getItem('locationData');

            if (result !== undefined && result !== null) {
                setIsActiveLoading(true)
                result = JSON.parse(result);
                setLocationData(result);
                dataSession = result;
                loadData(dataSession)
            }
        }

    }, [!locationData]);
    async function loadData(dataSession) {
        await apiServiceBackend.getDocumentationJson(dataSession.transactionId).then(async resp => {
            if (resp.legalDocResults.find(x => x.typeDocument == "costosNotaria")) {
                setdataService(resp.legalDocResults.find(x => x.typeDocument == "costosNotaria"))
                let dato = Object.entries(resp.legalDocResults.find(x => x.typeDocument == "costosNotaria")?.dataJson).map(object => object[1]);
                setjsonNotaria(dato)
                setTimeout(() => {
                    setIsActiveLoading(false)
                    for (let i = 0; i < dato.length; i++) {
                        if (dato[i]?.data) {
                            for (let j = 0; j < dato[i]?.data.length; j++) {
                                document.getElementById("precios" + dato[i]?.data[j].id).checked = currencyData.format(parseFloat(dato[i]?.data[j].amount).toFixed(2))
                                if (dato[i]?.data[j].aplica) {
                                    document.getElementById("checkCAF" + dato[i]?.data[j].id).checked = dato[i]?.data[j].aplica
                                    check(dato[i]?.data[j].id, dato[i]?.cod)
                                }
                            }
                        }
                    }
                }, 1500);
            } else {
                setjsonNotaria(jsonNotaria2)
                setIsActiveLoading(false)
            }
        }).catch(err => {
            setIsActiveLoading(false)
        })
    }
    function check(cod = 0, id = 0) {
        settotal(() => {
            let suma = 0;
            var checkboxes = document.getElementsByClassName("aplica");
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    let jsonValidador = []
                    let jsonValidador2 = []
                    for (let j = 0; j < checkboxes.length; j++) {
                        if (id == checkboxes[j].getAttribute("codigo")) {
                            if (checkboxes[j].checked) {
                                jsonValidador.push({
                                    id: checkboxes[j].getAttribute("id"),
                                    cod: checkboxes[j].getAttribute("codigo"),
                                    checked: document.getElementById(checkboxes[j].getAttribute("id")).checked,
                                })
                            } else {
                                jsonValidador2.push({
                                    id: checkboxes[j].getAttribute("id"),
                                    cod: checkboxes[j].getAttribute("codigo"),
                                    checked: document.getElementById(checkboxes[j].getAttribute("id")).checked,
                                })

                            }
                        }

                    }
                    for (let j = 0; j < jsonValidador.length; j++) {
                        document.getElementById(jsonValidador[j].id).disabled = true;
                    }
                    if (jsonValidador.length == 0) {
                        for (let j = 0; j < jsonValidador2.length; j++) {
                            document.getElementById(jsonValidador2[j].id).disabled = false;
                        }
                    } else {
                        for (let j = 0; j < jsonValidador2.length; j++) {
                            document.getElementById(jsonValidador2[j].id).disabled = true;
                        }
                    }
                    if (document.getElementById("checkCAF" + cod)) {
                        document.getElementById("checkCAF" + cod).disabled = false;
                    }
                    // console.log("-----------------------------------");
                    // console.log("code:", checkboxes[i].getAttribute("codigo"));
                    // console.log("id:",);
                    // console.log("codigo:", cod);
                    suma += parseFloat(currencyData.getRealValue(document.getElementById("precios" + checkboxes[i].getAttribute("identificador")).value == "" ? 0 : document.getElementById("precios" + checkboxes[i].getAttribute("identificador")).value));
                } else {
                    let jsonValidador = []
                    let jsonValidador2 = []
                    for (let j = 0; j < checkboxes.length; j++) {
                        if (id == checkboxes[j].getAttribute("codigo")) {
                            if (checkboxes[j].checked) {
                                jsonValidador.push({
                                    id: checkboxes[j].getAttribute("id"),
                                    cod: checkboxes[j].getAttribute("codigo"),
                                    checked: document.getElementById(checkboxes[j].getAttribute("id")).checked,
                                })
                            } else {
                                jsonValidador2.push({
                                    id: checkboxes[j].getAttribute("id"),
                                    cod: checkboxes[j].getAttribute("codigo"),
                                    checked: document.getElementById(checkboxes[j].getAttribute("id")).checked,
                                })

                            }
                        }

                    }
                    for (let j = 0; j < jsonValidador.length; j++) {
                        document.getElementById(jsonValidador[j].id).disabled = true;
                    }
                    if (jsonValidador.length == 0) {
                        for (let j = 0; j < jsonValidador2.length; j++) {
                            document.getElementById(jsonValidador2[j].id).disabled = false;
                        }
                    } else {
                        for (let j = 0; j < jsonValidador2.length; j++) {
                            document.getElementById(jsonValidador2[j].id).disabled = true;
                        }
                    }
                    if (document.getElementById("checkCAF" + cod)) {
                        document.getElementById("checkCAF" + cod).disabled = false;
                    }
                }
            }
            return suma;
        })
    }
    async function saveData() {
        setIsActiveLoading(true)
        for (let i = 0; i < jsonNotaria.length; i++) {
            if (jsonNotaria[i]?.data) {
                for (let j = 0; j < jsonNotaria[i].data.length; j++) {
                    jsonNotaria[i].data[j].aplica = document.getElementById("checkCAF" + jsonNotaria[i].data[j].id).checked;
                    jsonNotaria[i].data[j].amount = +currencyData.getRealValue(document.getElementById("precios" + jsonNotaria[i].data[j].id).value);
                }
            }
        }
        jsonNotaria[4] = { transactId: locationData.transactionId, totalValue: (parseFloat(total).toFixed(2) ?? 0) }
        setIsActiveLoading(false)
        setjsonNotaria(jsonNotaria)
        await apiServiceBackend.getDocumentationJson(locationData.transactionId).then(async resp => {
            if (resp.legalDocResults.find(x => x.typeDocument == "costosNotaria")) {
                // update
                await apiServiceBackend.updateDocumentationJson(locationData.transactionId, 0, "costosNotaria", jsonNotaria, (parseFloat(total).toFixed(2) ?? 0), dataService != null ? dataService.resultId : 0, true).then(resp => {
                    console.log(resp);
                    setIsActiveLoading(false)
                }).catch(err => {
                    setIsActiveLoading(false)
                })
            } else {
                await apiServiceBackend.newDocumentationJson(locationData.transactionId, 0, "costosNotaria", jsonNotaria, (parseFloat(total).toFixed(2) ?? 0), dataService != null ? dataService.resultId : 0, true).then(resp => {
                    console.log(resp);
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
                                <Table className="table table-striped table-hover styled-table table ">
                                    <thead>
                                        <tr style={{ textAlign: "center" }}>
                                            <td>Tipo de caso</td>
                                            <td>Contiene</td>
                                            <td>Precio aproximado</td>
                                            {/* <td>Monto</td> */}
                                            <td>Aplica línea</td>
                                        </tr>
                                    </thead>
                                    <tbody style={{ textAlign: "justify" }}>
                                        {jsonNotaria && jsonNotaria.map((data, index) => (
                                            data?.data ?
                                                <React.Fragment>
                                                    <tr style={{ textAlign: "center" }}>
                                                        <td colSpan="4" ><b>{data.label}</b></td>
                                                    </tr>
                                                    {data.data.map((resp, i) => (
                                                        <tr>
                                                            <td>{resp.tipo}</td>
                                                            <td>{resp.contiene}</td>
                                                            <td>
                                                                <div class="input-group mb-3">
                                                                    <div class="input-group-prepend">
                                                                        <span class="input-group-text" ><b>$</b></span>
                                                                    </div>
                                                                    <input
                                                                        style={{ textAlign: "right" }}
                                                                        className="form-control precios"
                                                                        type="text"
                                                                        codigo={data.cod}
                                                                        name={"precios" + resp.id}
                                                                        id={"precios" + resp.id}
                                                                        pattern="^[0-9,.]*$"
                                                                        onChange={(e) => {
                                                                            check()
                                                                        }}
                                                                        // onKeyPress={(e) => { return check(e) }}
                                                                        onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                                                                        defaultValue={currencyData.format(parseFloat(resp.amount).toFixed(2))}
                                                                        title={t("")}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td style={{ textAlign: "center" }}>
                                                                <input className="aplica"
                                                                    identificador={resp.id}
                                                                    codigo={data.cod}
                                                                    onChange={(e) => {
                                                                        check(resp.id, data.cod)
                                                                    }} type="checkbox" id={"checkCAF" + resp.id} name={"checkCAF" + resp.id} />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </React.Fragment> : null
                                        ))}
                                        <tr>
                                            <td></td>
                                            <td style={{ textAlign: "right" }}><b>Total cósto de notaria</b></td>
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
        </React.Fragment >
    );
}
export default CostosNotaria;
