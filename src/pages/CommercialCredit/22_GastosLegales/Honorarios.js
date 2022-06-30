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
import { uniq_key } from '../../../helpers/unq_key';
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
const Honorarios = (props) => {
    const [isActiveLoading, setIsActiveLoading] = useState(false); //loading de la pagina
    const [datosJsonCheck, setdatosJsonCheck] = useState([]);
    const [datosJsonCheck1, setdatosJsonCheck1] = useState(null);
    const [tipo, settipo] = useState("local");
    const [switch1, setswitch1] = useState(false);
    const [switch2, setswitch2] = useState(false);
    const { t, i18n } = useTranslation();
    const currencyData = new Currency();
    const apiServiceBackend = new BackendServices();
    const location = useLocation()
    const [openModalRiesgo, setopenModalRiesgo] = useState(false);
    const [facilidadesData, setfacilidadesData] = useState(null);
    const [recordsFacilidades, setrecordsFacilidades] = useState(0);
    const [dataRows, setdataRows] = useState(null);
    const [dataSuma, setdataSuma] = useState(0);
    const [dataSuma1, setdataSuma1] = useState(0);
    const [locationData, setLocationData] = useState(location.data);
    const [dataService, setdataService] = useState(null);

    const history = useHistory();
    const jsonHonorarios = [
        {
            min: 0.01,
            max: 10000.01,
            amountAdd: 150.00,
            porcent: 7
        },
        {
            min: 10000.00,
            max: 50000.00,
            amountAdd: 200.00,
            porcent: 7
        },
        {
            min: 50000.00,
            max: 100000.00,
            amountAdd: 300.00,
            porcent: 7
        },
        {
            min: 100000.01,
            max: 250000.00,
            amountAdd: 350.00,
            porcent: 7
        },
        {
            min: 250000.01,
            max: 1000000.01,
            amountAdd: 500.00,
            porcent: 7
        },
        {
            min: 1000000.01,
            max: 2000000.00,
            amountAdd: 750.00,
            porcent: 7
        },
        {
            min: 2000000.01,
            max: 3000000.00,
            amountAdd: 1000.00,
            porcent: 7
        },
        {
            min: 3000000.01,
            max: 4000000.00,
            amountAdd: 1500.00,
            porcent: 7
        },
        {
            min: 4000000.01,
            max: 5000000.00,
            amountAdd: 2000.00,
            porcent: 7
        },
        {
            min: 5000000.01,
            max: 6000000.00,
            amountAdd: 2500.00,
            porcent: 7
        },
        {
            min: 6000000.01,
            max: 7000000.00,
            amountAdd: 3000.00,
            porcent: 7
        },
        {
            min: 7000000.01,
            max: 8000000.00,
            amountAdd: 3500.00,
            porcent: 7
        },
        {
            min: 8000000.01,
            max: 9000000.00,
            amountAdd: 4000.00,
            porcent: 7
        },
        {
            min: 9000000.01,
            max: 10000000.00,
            amountAdd: 4500.00,
            porcent: 7
        }
    ]
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
        if (props.activeTab == 5) {
            setIsActiveLoading(true)
            setdatosJsonCheck([])
            loadData(dataSession);
        }

    }, [props.activeTab == 5]);
    async function loadData(dataSession) {
        await apiServiceBackend.getDocumentationJson(dataSession.transactionId).then(async resp => {
            if (resp.legalDocResults.find(x => x.typeDocument == "honorarios")) {
                setdataService(resp.legalDocResults.find(x => x.typeDocument == "honorarios"))
                let dato = Object.entries(resp.legalDocResults.find(x => x.typeDocument == "honorarios")?.dataJson).map(object => object[1]);
                settipo("base")
                setdatosJsonCheck(dato)
                cargarData(dato)
                setTimeout(() => {
                    setIsActiveLoading(false)
                    let total = 0;
                    for (let i = 0; i < dato.length; i++) {
                        if (dato[i].proposalTypeName2) {
                            total += parseFloat(dato[i].proposalTypeName2 == "0" ? dato[i].totalSuma : dato[i].proposalTypeName2 == "1" ? dato[i].adendaH : dato[i].proposalTypeName2 == "2" ? dato[i].adendaF : dato[i].totalSuma);
                            document.getElementById("amount" + i).innerHTML = currencyData.format(parseFloat(dato[i].proposalTypeName2 == "0" ? dato[i].totalSuma : dato[i].proposalTypeName2 == "1" ? dato[i].adendaH : dato[i].proposalTypeName2 == "2" ? dato[i].adendaF : dato[i].totalSuma).toFixed(2))
                        }
                    }
                    document.getElementById("totalFinal").innerHTML = "$" + currencyData.format(parseFloat(total).toFixed(2));
                }, 2000);
            } else {
                settipo("local")
                setIsActiveLoading(false)
                initializeData(dataSession)
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
                                    let jsonSet = [];
                                    let jsonCheck = [];
                                    let totales = 0
                                    let totales2 = 0
                                    for (let i = 0; i < resp.length; i++) {
                                        let jsonAdd = jsonHonorarios.filter(x => resp[i].amount >= x.min && resp[i].amount <= x.max);
                                        // totales.totalMonto = Number(parseFloat(totales.totalMonto)) + Number(resp[i].amount);
                                        totales = Number(parseFloat(totales)) + Number(parseFloat(jsonAdd[0]?.amountAdd + ((jsonAdd[0]?.porcent / 100) * jsonAdd[0]?.amountAdd)).toFixed(2));
                                        totales2 = Number(parseFloat(totales2)) + Number(parseFloat(jsonAdd[0]?.amountAdd + ((jsonAdd[0]?.porcent / 100) * jsonAdd[0]?.amountAdd)).toFixed(2));
                                        jsonSet.push({
                                            amount: Number(resp[i].amount),
                                            facilityTypeId: resp[i].facilityTypeId,
                                            facilityTypeName: facilidad.find(x => x.id === resp[i].facilityTypeId)?.description,
                                            proposalTypeId: resp[i].proposalTypeId,
                                            proposalTypeName: propuesta.find(x => x.id === resp[i].proposalTypeId)?.description,
                                            proposalTypeName2: propuesta.find(x => x.id === resp[i].proposalTypeId)?.description,
                                            debtor: resp[i].debtor,
                                            amountAdd: jsonAdd[0]?.amountAdd ?? 0,
                                            max: jsonAdd[0]?.max ?? 0,
                                            min: jsonAdd[0]?.min ?? 0,
                                            CAH: false,
                                            CAF: false,
                                            CAFval: 0,
                                            CAHval: 0,
                                            totalSuma: Number(parseFloat(jsonAdd[0]?.amountAdd + ((jsonAdd[0]?.porcent / 100) * jsonAdd[0]?.amountAdd)).toFixed(2)),
                                            adendaH: Number(parseFloat(150 + ((jsonAdd[0]?.porcent / 100) * 150)).toFixed(2)),
                                            adendaF: Number(parseFloat(200 + ((jsonAdd[0]?.porcent / 100) * 200)).toFixed(2)),
                                            min: jsonAdd[0]?.min ?? 0,
                                            porcent: jsonAdd[0]?.porcent ?? 0,
                                            totalAmount: parseFloat(jsonAdd[0]?.amountAdd + ((jsonAdd[0]?.porcent / 100) * jsonAdd[0]?.amountAdd)).toFixed(2),
                                        })
                                        datosJsonCheck.push({
                                            amount: Number(resp[i].amount),
                                            facilityTypeId: resp[i].facilityTypeId,
                                            facilityTypeName: facilidad.find(x => x.id === resp[i].facilityTypeId)?.description,
                                            proposalTypeId: resp[i].proposalTypeId,
                                            proposalTypeName: propuesta.find(x => x.id === resp[i].proposalTypeId)?.description,
                                            proposalTypeName2: propuesta.find(x => x.id === resp[i].proposalTypeId)?.description,
                                            debtor: resp[i].debtor,
                                            amountAdd: jsonAdd[0]?.amountAdd ?? 0,
                                            max: jsonAdd[0]?.max ?? 0,
                                            min: jsonAdd[0]?.min ?? 0,
                                            CAH: false,
                                            CAF: false,
                                            CAFval: 0,
                                            CAHval: 0,
                                            totalSuma: Number(parseFloat(jsonAdd[0]?.amountAdd + ((jsonAdd[0]?.porcent / 100) * jsonAdd[0]?.amountAdd)).toFixed(2)),
                                            adendaH: Number(parseFloat(150 + ((jsonAdd[0]?.porcent / 100) * 150)).toFixed(2)),
                                            adendaF: Number(parseFloat(200 + ((jsonAdd[0]?.porcent / 100) * 200)).toFixed(2)),
                                            min: jsonAdd[0]?.min ?? 0,
                                            porcent: jsonAdd[0]?.porcent ?? 0,
                                            totalAmount: parseFloat(jsonAdd[0]?.amountAdd + ((jsonAdd[0]?.porcent / 100) * jsonAdd[0]?.amountAdd)).toFixed(2),
                                        })
                                    }
                                    if (document.getElementById("totalFinal")) {
                                        document.getElementById("totalFinal").innerHTML = "$" + currencyData.format(parseFloat(totales).toFixed(2));
                                    }
                                    setdatosJsonCheck(datosJsonCheck)
                                    setdataSuma1(totales2)
                                    setdataSuma(totales)
                                    cargarData(jsonSet)

                                })
                            });
                    });
            });
    }
    function cargarData(jsonSet) {
        setfacilidadesData(jsonSet.map((data, index) => (data.facilityTypeName ? <>
            <tr key={uniq_key()}>
                <td>{data.facilityTypeName}</td>
                <td>{data.proposalTypeName}</td>
                <td style={{ textAlign: "center" }}>${currencyData.formatTable(data.amount ?? 0)}</td>
                <td>
                    {data.proposalTypeName2 == "NUEVO" ? "NUEVO" :
                        <select onClick={(e) => {
                            if (e.target.value == "0") {
                                datosJsonCheck[index].proposalTypeName2 = "0"
                                document.getElementById("amount" + index).innerHTML = "$" + currencyData.format(parseFloat(data?.totalSuma).toFixed(2) ?? 0);
                            }
                            if (e.target.value == "1") {
                                datosJsonCheck[index].proposalTypeName2 = "1"
                                document.getElementById("amount" + index).innerHTML = "$" + currencyData.format(parseFloat(data?.adendaH).toFixed(2) ?? 0);
                            }
                            if (e.target.value == "2") {
                                datosJsonCheck[index].proposalTypeName2 = "2"
                                document.getElementById("amount" + index).innerHTML = "$" + currencyData.format(parseFloat(data?.adendaF).toFixed(2) ?? 0);
                            }
                            let total = 0;
                            for (let i = 0; i < jsonSet.length; i++) {
                                total += parseFloat(document.getElementById("amount" + i).innerHTML.replace("$", ""));
                            }
                            setdatosJsonCheck(datosJsonCheck);
                            document.getElementById("totalFinal").innerHTML = "$" + currencyData.format(parseFloat(total).toFixed(2));
                        }} className="form-control" defaultValue={data.proposalTypeName2}>
                            <option value="0">Nueva</option>
                            <option value="1">Adenda hipoteca</option>
                            <option value="2">Adenda fideicomiso</option>
                        </select>}
                </td>
                <td style={{ textAlign: "right" }}><b id={"amount" + index}>${currencyData.format(parseFloat(data.proposalTypeName == "0" ? data.totalSuma : data.proposalTypeName == "1" ? data.adendaH : data.proposalTypeName == "2" ? data.adendaF : data.totalSuma).toFixed(2))}</b></td>
            </tr>
        </> : null))
        )

    }
    async function saveData() {
        setIsActiveLoading(true)
        let indice = datosJsonCheck.length
        datosJsonCheck[indice + 1] = {
            transactId: locationData.transactionId, totalValue: document.getElementById("totalFinal").innerHTML.replace("$", "")
        }
        setdatosJsonCheck(datosJsonCheck)
        await apiServiceBackend.getDocumentationJson(locationData.transactionId).then(async resp => {
            if (resp.legalDocResults.find(x => x.typeDocument == "honorarios")) {
                // update
                await apiServiceBackend.updateDocumentationJson(locationData.transactionId, 2, "honorarios", datosJsonCheck, document.getElementById("totalFinal").innerHTML.replace("$", ""), dataService != null ? dataService.resultId : 0, true).then(async resp => {
                    console.log(resp);
                    setIsActiveLoading(false)
                }).catch(err => {
                    setIsActiveLoading(false)
                })
            } else {
                await apiServiceBackend.newDocumentationJson(locationData.transactionId, 2, "honorarios", datosJsonCheck, document.getElementById("totalFinal").innerHTML.replace("$", ""), dataService != null ? dataService.resultId : 0, true).then(async resp => {
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
                                <Table className="table table-striped table-hover styled-table table" border="0">
                                    <thead>
                                        <tr >
                                            <th>{t("Facility Type")}</th>
                                            <th style={{ textAlign: "center" }}>{t("Proposal")}</th>
                                            <th style={{ textAlign: "center" }}>{t("Amount")} Facilidad</th>
                                            <th style={{ textAlign: "center" }}>Tipo de honorario</th>
                                            <th style={{ textAlign: "center" }}>{t("Monto de honorario")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {facilidadesData}

                                        <tr style={estiloTotales}>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><b>Total de honorarios</b></td>
                                            <td style={{ textAlign: "right" }}><b id="totalFinal">$0.00</b></td>
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
export default Honorarios;
