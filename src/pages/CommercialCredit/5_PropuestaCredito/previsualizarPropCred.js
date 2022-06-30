import React, { useEffect, useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import { formatCurrency, translationHelpers } from '../../../helpers';
import * as url from "../../../helpers/url_helper"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Button,
    Label,
    Input,
    Modal,
    Card,
    CardBody,
    CardFooter,
    InputGroup,
    CardHeader,
    Table,
} from "reactstrap"

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { BackendServices, CoreServices } from "../../../services";
import { useHistory, useLocation } from "react-router-dom";
import ExposicionCorportativa from "./Secciones/ExposicionCorporativa";
import ExposicionCorporativaClientes from "./Secciones/ExposicionCorporativaCliente";
import LoadingOverlay from "react-loading-overlay";
import Currency from "../../../helpers/currency";
import { uniq_key } from '../../../helpers/unq_key'
import moment from "moment";
import FacilityHistory from "../../../components/Common/FacilityHistory";
import PreviewFacility from "./Secciones/PreviewFacility";
import LevelAutonomy from "./Secciones/LevelAutonomy";


const ModalPrevisualizarPropCred = (props) => {
    const currencyData = new Currency();

    const { t, i18n } = useTranslation();
    const location = useLocation()
    const [dataRows, setdataRows] = React.useState(null);
    const [dataLocation, setData2] = useState(location.data);
    const [Facilidades, setFacilidades] = useState(null);
    const [dataRows1, setdataRows1] = React.useState(null);
    const [isActiveLoading1, setisActiveLoading1] = React.useState(false);
    const [isActiveLoading2, setisActiveLoading2] = React.useState(false);
    const [CorporateExposure, setCorporateExposure] = useState(null);
    const [data, setData] = useState({
        datosGenerales: {
            customerNumber: "",
            revision: "",
            preapproval: "",
            economicGroupNumber: "",
            economicGroupName: "",
            country: "",
            activityCompany: "",
            riskClassification: "",
            minimumProvisionSIB: "",
            relatedPart: "",
            approvalLevel: "",
            accountExecutive: "",
            responsibleUnit: "",
            countryRisk: "",
            requestDate: "",
            lastRequestDate: "",
            nextRevisionDate: "",
            proposedExpirationDate: "",
            flow: "",
            status: "",
            date: "",
            requestId: 0
        },
        resumenCambios: {
            "requestId": "",
            "increase": "",
            "rate": "",
            "guarantee": "",
            "desbtorsGuarantors": "",
            "terms": "",
            "fees": "",
            "covenats": "",
            "others": "",
            "status": true
        },
        Facilidades: {}
    })
    const [datosUsuario, setdatosUsuario] = useState(null)
    const api = new BackendServices();
    const coreServices = new CoreServices();
    const history = useHistory();
    const [locationData, setLocationData] = useState(null);

    useEffect(() => {


        let dataSession = {};
        console.log(location?.pathname?.split("previsualizarPropCred/")[1])
        if (location?.pathname?.split("previsualizarPropCred/")[1]) {
            dataSession = { transactionId: atob(location?.pathname?.split("previsualizarPropCred/")[1]) };
            sessionStorage.setItem('locationData', JSON.stringify(dataSession));
        }

        if (location.data !== null && location.data !== undefined) {
            if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
                //location.data.transactionId = 0;
                //checkAndCreateProcedure(location.data);
                history.push(url.URL_DASHBOARD);
            }
            else {
                sessionStorage.setItem('locationData', JSON.stringify(location.data));
                setLocationData(location.data);
                dataSession = location.data;
            }
        }
        else {
            //chequeamos si tenemos guardado en session
            var result = sessionStorage.getItem('locationData');
            if (result !== undefined && result !== null) {
                result = JSON.parse(result);
                setLocationData(result);
                dataSession = result;
            }
        }
        // setData(modelo)
        // Read Api Serv ice ddasata
        setLocationData(dataSession)
        initializeData(dataSession);
    }, []);
    function formatDate(date) {
        return !date ? '' : moment(date).format("DD/MM/YYYY");
    }
    function initializeData(dataSession) {
        // consultarDatosGeneralesPropCred
        api.consultGeneralDataPropCred(dataSession?.transactionId).then(resp => {
            if (resp != undefined && resp.length > 0) {
                data.datosGenerales.requestId = resp[0].requestId;
                data.datosGenerales.customerNumber = resp[0].customerNumber;
                data.datosGenerales.revision = resp[0].revision;
                data.datosGenerales.preapproval = resp[0].preapproval;
                data.datosGenerales.economicGroupNumber = resp[0].economicGroupNumber;
                data.datosGenerales.economicGroupName = resp[0].economicGroupName;
                data.datosGenerales.country = resp[0].country;
                data.datosGenerales.activityCompany = resp[0].activityCompany;
                data.datosGenerales.riskClassification = resp[0].riskClassification;
                data.datosGenerales.minimumProvisionSIB = resp[0].minimumProvisionSIB;
                data.datosGenerales.relatedPart = resp[0].relatedPart;
                data.datosGenerales.approvalLevel = resp[0].approvalLevel;
                data.datosGenerales.accountExecutive = resp[0].accountExecutive;
                data.datosGenerales.responsibleUnit = resp[0].responsibleUnit;
                data.datosGenerales.countryRisk = resp[0].countryRisk;
                data.datosGenerales.requestDate = resp[0].requestDate;
                data.datosGenerales.lastRequestDate = resp[0].lastRequestDate;
                data.datosGenerales.nextRevisionDate = resp[0].nextRevisionDate;
                data.datosGenerales.proposedExpirationDate = resp[0].proposedExpirationDate;
                data.datosGenerales.flow = resp[0].flow;
                data.datosGenerales.status = resp[0].status;
                data.datosGenerales.date = resp[0].date;
                setData(data);
                api.consultarResumenCambios(resp[0].requestId).then(resp => {
                    if (resp != undefined) {
                        data.resumenCambios = resp
                        setData(data);
                    }
                })
            }
        })
        // consultarResumenCambios
        api.consultarDeudores(dataSession.transactionId)
            .then((data2) => {
                if (data2 !== null && data2 !== undefined) {
                    let jsonDeudores = [];
                    for (let i = 0; i < data2.length; i++) {
                        jsonDeudores.push({ label: data2[i]["typePerson"] == "2" ? data2[i]["name"] : data2[i]["name"] + " " + data2[i]["name2"] + " " + data2[i]["lastName"] + " " + data2[i]["lastName2"], value: data2[i]["personId"] })
                    }
                    // retrieveProposalType
                    api.retrieveProposalType()
                        .then((propuesta) => {
                            // retrieveFacilityType
                            api.retrieveFacilityType()
                                .then((facilidad) => {
                                    // consultarFacilidades
                                    api.retrieveSubproposalType()
                                        .then((proposalType) => {
                                            api.consultarFacilidades(data.datosGenerales.requestId).then(resp => {
                                                if (resp?.filter(data => data.debtor != "  ").length > 0) {
                                                    resp = currencyData.orderByJSON(resp, 'facilityId', 'asc')
                                                    console.log(resp);
                                                    setFacilidades(resp.map((data, index) => (
                                                        data.debtor != "  " ?
                                                            <tr key={uniq_key()}>
                                                                <td>{index + 1}</td>
                                                                <td>{jsonDeudores.find(x => x.value === Number(data.debtor))?.label}</td>
                                                                <td>{facilidad.find(x => x.id === (data?.facilityType ?? data?.facilityTypeId))?.description}</td>
                                                                <td>{propuesta.find(x => x.id === (data?.proposedType ?? data?.proposalTypeId))?.description}</td>
                                                                <td>{proposalType.find(x => x.id === data?.proposalTypeName)?.description}</td>
                                                                <td>${currencyData.formatTable(data?.amount ?? 0)}</td>
                                                                {/* <td>${currencyData.formatTable(data?.proposalRate ?? 0)}</td> */}
                                                                <td>${currencyData.formatTable(data?.balance ?? 0)}</td>
                                                                <td>{data.termDays} {data.termType}</td>
                                                                <td>{data.purpose}</td>
                                                                <td>{data.sublimits}</td>
                                                                <td>{currencyData.formatTable(data?.proposalRate ?? 0)}%</td>
                                                                <td>{currencyData.formatTable(data?.noSubsidyRate ?? 0)}%</td>
                                                                <td>{currencyData.formatTable(data?.effectiveRate ?? 0)}%</td>
                                                                <td>{data.otherConditions}</td>
                                                                <td>{data.ltv}%</td>
                                                                <td>{data.applyEscrow ? t("Yes") : t("No")}</td>
                                                            </tr> : null)
                                                    ));
                                                } else {
                                                    setFacilidades(
                                                        <tr key={1}>
                                                            <td colSpan="7" style={{ textAlign: 'center' }}></td>
                                                        </tr>);
                                                }
                                            });
                                        });
                                })
                        })
                }
            })
        // consultarDeudorPrincipal
        api.consultPrincipalDebtor(dataSession?.transactionId ?? location.data?.transactionId ?? 0).then(resp => {
            if (resp != undefined) {
                data.datosGenerales.codigoTipoPersona = resp.typePerson
                data.datosGenerales.codigoTipoIdentificacion = resp.idType
                data.datosGenerales.numeroCliente = resp.customerNumberT24
                data.datosGenerales.primerNombre = resp.name
                data.datosGenerales.segundoNombre = resp.name2
                data.datosGenerales.primerApellido = resp.lastName
                data.datosGenerales.segundoApellido = resp.lastName2
                data.datosGenerales.numeroIdentificacion = resp.clientDocId
                data.datosGenerales.customerNumber = resp.customerNumberT24
                data.datosGenerales.nuevoDato = ""
                setData(data);
                setdatosUsuario(resp);
            }
        })
    }
    return (
        <>
            {locationData ?
                <React.Fragment>
                    <div className="page-content">
                        <Breadcrumbs title={t("Commercial Credit")} breadcrumbItem={t("Credit Proposal")} />
                        <Col md={12}>
                            <Row>
                                <Col sm={12} style={{ textAlign: "right" }}>
                                    <h5 className="card-title title-header">{datosUsuario != null ? (datosUsuario.typePerson === "1" ? (datosUsuario.name + " " + datosUsuario.name2 + " " + datosUsuario.lastName + " " + datosUsuario.lastName2) : (datosUsuario.name)) : ""} </h5>
                                </Col>
                                <Col sm={12} style={{ textAlign: "right" }}>
                                    <h5 className="card-title" style={{ textAlign: "right" }}>{t("Tramit")}:{" "}#{locationData?.transactionId}</h5>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={12} className="d-flex flex-column flex-sm-row justify-content-between">
                            <LevelAutonomy />
                        </Col>
                        {/* Previsualizacion de datos generales pantalla 1 */}
                        <Card>
                            <CardHeader>
                                <h5 className="card-title">{t("General Data")}</h5>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md="3">
                                        <strong htmlFor="transactId">{t("Procedure Number")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.datosGenerales.requestId == "" || data.datosGenerales.requestId == null ? t("NoData") : data.datosGenerales.requestId}</Label>
                                    </Col>
                                    <Col md="3">
                                        <strong htmlFor="customerNumber">{t("Customer ID")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.datosGenerales.customerNumber == "" || data.datosGenerales.customerNumber == null ? t("NoData") : data.datosGenerales.customerNumber}</Label>
                                    </Col>
                                    <Col md="3">
                                        <strong htmlFor="revisionType">{t("Revision Type")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.datosGenerales.revision == "" || data.datosGenerales.revision == null ? t("NoData") : data.datosGenerales.revision}</Label>
                                    </Col>
                                    <Col md="3">
                                        <strong htmlFor="preapproval">{t("Pre Approved")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.datosGenerales.preapproval == "" || data.datosGenerales.preapproval == null ? t("NoData") : (data.datosGenerales.preapproval ? t("Yes") : t("No"))}</Label>
                                    </Col>
                                    <Col md="3">
                                        <strong htmlFor="relatedPart">{t("Related Part")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.datosGenerales.relatedPart == "" || data.datosGenerales.relatedPart == null ? t("NoData") : (data.datosGenerales.relatedPart ? t("Yes") : t("No"))}</Label>
                                    </Col>
                                    <Col md="3">
                                        <strong htmlFor="economicGroupName">{t("Economic Group Name")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.datosGenerales.economicGroupName == "" || data.datosGenerales.economicGroupName == null ? t("NoData") : data.datosGenerales.economicGroupName}</Label>
                                    </Col>
                                    <Col md="3">
                                        <strong htmlFor="economicGroupNumber">{t("Economic Group Number")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.datosGenerales.economicGroupNumber == "" || data.datosGenerales.economicGroupNumber == null ? t("NoData") : data.datosGenerales.economicGroupNumber}</Label>
                                    </Col>
                                    <Col md="3">
                                        <strong htmlFor="country">{t("Country Class")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.datosGenerales.country == "" || data.datosGenerales.country == null ? t("NoData") : data.datosGenerales.country}</Label>
                                    </Col>
                                    <Col md="3">
                                        <strong htmlFor="riskClassification">{t("Risk Assesment")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.datosGenerales.riskClassification == "" || data.datosGenerales.riskClassification == null ? t("NoData") : data.datosGenerales.riskClassification}</Label>
                                    </Col>
                                    <Col md="3">
                                        <strong htmlFor="activityCompany">{t("Company Activity")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.datosGenerales.activityCompany == "" || data.datosGenerales.activityCompany == null ? t("NoData") : data.datosGenerales.activityCompany}</Label>
                                    </Col>
                                    <Col md="3">
                                        <strong htmlFor="minimumProvisionSIB">{t("SIB Minimum Provision")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.datosGenerales.minimumProvisionSIB == "" || data.datosGenerales.minimumProvisionSIB == null ? t("NoData") : data.datosGenerales.minimumProvisionSIB}</Label>
                                    </Col>
                                    <Col md="3">
                                        <strong htmlFor="accountExecutive">{t("Account Executive")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.datosGenerales.accountExecutive == "" || data.datosGenerales.accountExecutive == null ? t("NoData") : data.datosGenerales.accountExecutive}</Label>
                                    </Col>
                                    <Col md="3">
                                        <strong htmlFor="flow">{t("Flow Type")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.datosGenerales.flow == "" || data.datosGenerales.flow == null ? t("NoData") : data.datosGenerales.flow}</Label>
                                    </Col>
                                    <Col md="3">
                                        <strong htmlFor="responsibleUnit">{t("Responsible Unit")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.datosGenerales.responsibleUnit == "" || data.datosGenerales.responsibleUnit == null ? t("NoData") : data.datosGenerales.responsibleUnit}</Label>
                                    </Col>
                                    <Col md="3">
                                        <strong htmlFor="countryRisk">{t("Country Risk")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.datosGenerales.countryRisk == "" || data.datosGenerales.countryRisk == null ? t("NoData") : data.datosGenerales.countryRisk}</Label>
                                    </Col>

                                    <Col md="3">
                                        <strong htmlFor="requestDate">{t("Application Date")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.datosGenerales.requestDate == "" || data.datosGenerales.requestDate == null ? t("NoData") : formatDate(data.datosGenerales.requestDate)}</Label>
                                    </Col>
                                    <Col md="3">
                                        <strong htmlFor="lastRequestDate">{t("Last Application Date")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.datosGenerales.lastRequestDate == "" || data.datosGenerales.lastRequestDate == null ? t("NoData") : formatDate(data.datosGenerales.lastRequestDate)}</Label>
                                    </Col>
                                    <Col md="3">
                                        <strong htmlFor="nextRevisionDate">{t("Next Revision Date")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.datosGenerales.nextRevisionDate == "" || data.datosGenerales.nextRevisionDate == null ? t("NoData") : formatDate(data.datosGenerales.nextRevisionDate)}</Label>
                                    </Col>
                                    <Col md="3">
                                        <strong htmlFor="proposedExpirationDate">{t("Expiration Date")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.datosGenerales.proposedExpirationDate == "" || data.datosGenerales.proposedExpirationDate == null ? t("NoData") : formatDate(data.datosGenerales.proposedExpirationDate)}</Label>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                        <ExposicionCorportativa validacion={true} transactionId={locationData?.transactionId ?? 0} dataGlobal={data.datosGenerales.requestId} activeTab={2} title={t("CorporateExhibition")} customerNumberT24={datosUsuario?.customerNumberT24} />
                        <ExposicionCorporativaClientes validacion={true} transactionId={locationData?.transactionId ?? 0} activeTab={2} title={t("CorporateExhibitionClient")} customerNumberT24={datosUsuario?.customerNumberT24} />
                        <Card>
                            <CardHeader>
                                <h5 className="card-title">{t("Change Summary")}</h5>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md="3">
                                        <strong htmlFor="transactId">{t("Increase / Decrease (Exposure)")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.resumenCambios.increase == "" || data.resumenCambios.increase == null ? t("NoData") : data.resumenCambios.increase}</Label>
                                    </Col>
                                    <Col md="3">
                                        <strong htmlFor="customerNumber">{t("Rate")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.resumenCambios.rate == "" || data.resumenCambios.rate == null ? t("NoData") : `${data.resumenCambios.rate}`}</Label>
                                    </Col>
                                    <Col md="3">
                                        <strong htmlFor="revisionType">{t("Guarantee")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.resumenCambios.guarantee == "" || data.resumenCambios.guarantee == null ? t("NoData") : data.resumenCambios.guarantee}</Label>
                                    </Col>
                                    <Col md="3">
                                        <strong htmlFor="preapproval">{t("Guarantors / Co-signers")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.resumenCambios.desbtorsGuarantors == "" || data.resumenCambios.desbtorsGuarantors == null ? t("NoData") : data.resumenCambios.desbtorsGuarantors}</Label>
                                    </Col>

                                    <Col md="3">
                                        <strong htmlFor="transactId">{t("Deadlines")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.resumenCambios.terms == "" || data.resumenCambios.terms == null ? t("NoData") : data.resumenCambios.terms}</Label>
                                    </Col>
                                    <Col md="3">
                                        <strong htmlFor="customerNumber">{t("Dues")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.resumenCambios.fees == "" || data.resumenCambios.fees == null ? t("NoData") : data.resumenCambios.fees}</Label>
                                    </Col>
                                    <Col md="3">
                                        <strong htmlFor="revisionType">{t("Covenats")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.resumenCambios.covenats == "" || data.resumenCambios.covenats == null ? t("NoData") : data.resumenCambios.covenats}</Label>
                                    </Col>
                                    <Col md="3">
                                        <strong htmlFor="preapproval">{t("Other conditions")}</strong>
                                    </Col>
                                    <Col md="3">
                                        <Label>{data.resumenCambios.others == "" || data.resumenCambios.others == null ? t("NoData") : data.resumenCambios.others}</Label>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                        {datosUsuario && locationData && data.datosGenerales.requestId != 0 ?
                            <FacilityHistory requestId={data.datosGenerales.requestId} transactId={locationData.transactionId} validacion={true} mainDebtor={datosUsuario} partyId={datosUsuario.customerNumberT24} />
                            : null}
                        <Card>

                            <CardBody>
                                {/* <h5>{props.title}</h5> */}
                                <p className="card-title-desc"></p>
                                <Col md="12">
                                    <h5 className="card-sub-title">{t("Facility List")}</h5>
                                </Col>
                                <Col md="12" className="table-responsive styled-table-div">
                                    {/* <Table className="table table-striped table-hover styled-table table" >
                                        <thead >
                                            <tr>
                                                <th>{t("Facility")}</th>
                                                <th>{t("Debtor")}</th>
                                                <th>{t("Facility Type")}</th>
                                                <th>{t("Proposal")}</th>
                                                <th>{t("SubProposal Type")}</th>
                                                <th>{t("Approved Risk")}</th>
                                                <th>{t("Balance")}</th>
                                                <th>{t("DaysMonthsYears")}</th>
                                                <th>{t("Purpose")}</th>
                                                <th>{t("Sub Limits")}</th>
                                                <th>{t("Rate")}</th>
                                                <th>{t("Rate without Subsidy")}</th>
                                                <th>{t("Effective Interest Rate")}</th>
                                                <th>{t("OtherConditions")}</th>
                                                <th>{t("LTV")}(%)</th>
                                                <th>{t("Escrow")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Facilidades}
                                        </tbody>
                                    </Table> */}
                                    <PreviewFacility />
                                </Col>
                            </CardBody>
                        </Card>
                    </div>
                </React.Fragment >
                : <React.Fragment>
                    <div className="page-content">
                        <Breadcrumbs title={t("Commercial Credit")} breadcrumbItem={t("Credit Proposal")} />
                    </div>
                </React.Fragment >}
        </>
    );
};
ModalPrevisualizarPropCred.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func
};
export default ModalPrevisualizarPropCred;
