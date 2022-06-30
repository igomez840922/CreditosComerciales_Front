import React, { useState, useEffect, useContext } from "react";
import { PropTypes } from 'prop-types';
import Select from "react-select";
import {
    Row,
    Col,
    Label,
} from "reactstrap"
import moment from "moment";
import { AvForm, AvGroup, AvField, AvFeedback } from "availity-reactstrap-validation"
import { BackendServices, CoreServices } from "../../../../services";
import Switch from "react-switch";
import { useLocation, useHistory } from "react-router-dom";
import { translationHelpers } from "../../../../helpers";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { useTranslation } from "react-i18next/";
import * as url from "../../../../helpers/url_helper"
import Currency from "../../../../helpers/currency";
import * as OPTs from "../../../../helpers/options_helper"
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
const DatosGeneralesPropuesta = React.forwardRef((props, ref) => {
    const currencyData = new Currency();
    const location = useLocation();
    const history = useHistory();
    const [fechaSet, setfechaSet] = useState(null);
    const [fechaSet2, setfechaSet2] = useState(null);
    const [fechaSet3, setfechaSet3] = useState(null);
    const [fechaSet4, setfechaSet4] = useState(null);
    const [CambioDatos, setCambioDatos] = useState(false);

    const [locationData, setLocationData] = useState(location.data);
    const [context, setcontext] = useState(location.data);
    const [formValid, setFormValid] = useState(false);
    const [gruposEconomicos, setGruposEconomicos] = useState([]);
    const [actividadEmpresa, setActividadEmpresa] = useState([]);
    const [actividadEmpresaSet, setActividadEmpresaSet] = useState(null);
    const [actividadEmpresaSelect, setActividadEmpresaSelect] = useState(undefined);
    const [paises, setPais] = useState([]);
    const [paisesRiesgo, setPaisRiesgo] = useState([]);
    const [listaRevisionSet, setlistaRevisionSet] = useState(null);
    const [listaRevision, setlistaRevision] = useState(null);
    const [datosIGR, setdatosIGR] = useState(null);
    const [datosAmbientales, setdatosAmbientales] = useState(null);
    const [listaRevisionSelect, setlistaRevisionSelect] = useState(undefined);
    const [listaRevisionRequerido, setlistaRevisionRequerido] = useState(null);
    const [preapprovalSwitch, setpreapprovalSwitch] = useState(false);
    const [relatedPartSwitch, setrelatedPartSwitch] = useState(false);
    const [transactId, setTransactId] = useState('');
    const [customerNumber, setCustomerNumber] = useState('');
    const [revisionType, setRevisionType] = useState('');
    const [preapproval, setPreapproval] = useState(false);
    const [economicGroupSelect, seteconomicGroupSelect] = useState(undefined);
    const [economicGroup, setEconomicGroup] = useState(null);
    const [country, setCountry] = useState(null);
    const [countrySelect, setCountrySelect] = useState(undefined);
    const [activityCompany, setActivityCompany] = useState('');
    const [riskClassification, setRiskClassification] = useState('');
    const [minimumProvisionSIB, setMinimunProvisionSIB] = useState('');
    const [relatedPart, setRelatedPart] = useState(false);
    const [accountExecutive, setAccountExecutive] = useState('');
    const [approvalLevel, setApprovalLevel] = useState('');
    const [responsibleUnit, setResponsibleUnit] = useState('');
    const [countryRisk, setCountryRisk] = useState(null);
    const [dataReturn, setdataReturn] = useState(null);
    const [countryRiskSelect, setCountryRiskSelect] = useState(undefined);
    const [datosDeudorPrincipal, setdatosDeudorPrincipal] = useState(null);
    const [requestDate, setRequestDate] = useState('');
    const [lastRequestDate, setLastRequestDate] = useState('');
    const [proposedExpirationDate, setProposedExpirationDate] = useState('');
    const [nextRevisionDate, setNextRevisionDate] = useState('');
    const [dataRequest, setdataRequest] = useState('');
    const [flow, setFlow] = useState('');
    //const [t, c] = translationHelpers('commercial_credit', 'common');    
    const { t, i18n } = useTranslation();

    React.useImperativeHandle(ref, () => ({
        validateForm: () => {
            const form = document.getElementById('frmDatosGeneralesPropuesta');
            form.requestSubmit();
        },
        getFormValidation: () => {
            return formValid;
        },
        dataReturn
    }));
    useEffect(() => {
        let dataSession;
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
        loadListCountry();
        loadListGroupEconomic();
        loadActivityEconomic();
        loadDataRisk();
    }, []);

    useEffect(() => {
        const backendServices = new BackendServices();
        backendServices.consultGeneralDataPropCred(location?.data?.transactionId ?? locationData?.transactionId ?? 0)
            .then((data) => {
                if (data !== undefined) {
                    setdataRequest(data[0].requestId);
                }
            });
    }, [props]);


    useEffect(() => {
        let dataSession;
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

        if (gruposEconomicos?.length > 0 && actividadEmpresa?.length > 0)
            loadDataGeneral(dataSession);

    }, [gruposEconomicos, actividadEmpresa]);

    useEffect(() => {

        let dataSession;
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
        // if (props?.dataGlobal?.requestId != null&&props?.values!={}) {
        // setfechaSet(() => { return null })
        // setfechaSet2(() => { return null })
        // setfechaSet3(() => { return null })
        // setfechaSet4(() => { return null })
        updateDefaults(dataSession);
        // }
    }, [props.values]);
    useEffect(() => {
        cargarCatalogos()
    }, [paises, gruposEconomicos, actividadEmpresa]);
    function cargarCatalogos() {
        try {
            var defaultVal = null;
            if (listaRevision.length > 0 && props.values.revision !== null && listaRevisionSelect === undefined) {
                defaultVal = listaRevision.find(x => (x.label).toUpperCase() === (props.values.revision).toUpperCase());
                if (defaultVal !== undefined) {
                    setlistaRevisionSelect(defaultVal);
                    setlistaRevisionSet(defaultVal)
                }
            }
            if (paises.length > 0 && props.values.country !== null && countrySelect === undefined) {
                defaultVal = paises.find(x => (x.label).toUpperCase() === (props.values.country).toUpperCase());
                if (defaultVal !== undefined) {
                    setCountrySelect(defaultVal);
                }
            }
            if (paises.length > 0 && props.values.countryRisk !== null && countryRiskSelect === undefined) {
                defaultVal = paises.find(x => (x.label).toUpperCase() === (props.values.countryRisk).toUpperCase());
                if (defaultVal !== undefined) {
                    setCountryRiskSelect(defaultVal);
                }
            }
        }
        catch (err) { }
        if (props.values.transactId != undefined) setCambioDatos(() => { return true });
    }
    function updateDefaults(context) {
        setTransactId(props.values.transactId ?? context.transactionId);
        setCustomerNumber(props.values.customerNumber || context.customerId);
        setRevisionType(props.values.revisionType || 'Bimensual');
        setPreapproval(props.values.preapproval || false);
        setMinimunProvisionSIB(props.values.minimumProvisionSIB || '');
        setRelatedPart(props.values.relatedPart || false);
        setAccountExecutive(props.values.accountExecutive || '');
        setApprovalLevel(props.values.approvalLevel || '');
        setResponsibleUnit(props.values.responsibleUnit || '');
        setRequestDate(props.values.requestDate || '');
        setLastRequestDate(props.values.lastRequestDate || '');
        setNextRevisionDate(props.values.nextRevisionDate || '');
        setProposedExpirationDate(props.values.proposedExpirationDate || '');
        setFlow(props.values.flow || '');
        setfechaSet(props.values.requestDate == "" || props.values.requestDate == null || props.values.requestDate == undefined ? moment().format("DD-MM-YYYY") : moment(props.values.requestDate).format("DD-MM-YYYY"))
        setfechaSet2(props.values.lastRequestDate == "" || props.values.lastRequestDate == null || props.values.lastRequestDate == undefined ? moment().format("DD-MM-YYYY") : moment(props.values.lastRequestDate).format("DD-MM-YYYY"))
        setfechaSet3(props.values.nextRevisionDate == "" || props.values.nextRevisionDate == null || props.values.nextRevisionDate == undefined ? moment().add(1, 'years').format("DD-MM-YYYY") : moment(props.values.nextRevisionDate).format("DD-MM-YYYY"))
        setfechaSet4(props.values.proposedExpirationDate == "" || props.values.proposedExpirationDate == null || props.values.proposedExpirationDate == undefined ? moment().add(6, 'months').format("DD-MM-YYYY") : moment(props.values.proposedExpirationDate).format("DD-MM-YYYY"))
        // loadDataGeneral(context);
        setrelatedPartSwitch(props.values.relatedPart)
        setpreapprovalSwitch(props.values.preapproval)


    }
    // cargarListaPaises
    async function loadListCountry() {
        const api = new CoreServices();
        // getPaisesCatalogo
        await api.getPaisesCatalogo().then(response => {
            if (response === null) { return; }
            const json = response.Records ? response.Records.map(item => ({
                label: item["Description"],
                value: item["Code"]
            })) : [];
            setPais(json);
            setPaisRiesgo(json);
        }).catch(err => {
            console.log(err);
        });

    }
    // cargarActividadEconomica
    function loadActivityEconomic() {
        const api = new CoreServices();
        // getActividadEconomicaCatalogo
        api.getActividadEconomicaCatalogo()
            .then(response => {
                if (response === null) { return; }
                let json = [];
                for (let i = 0; i < response.Records.length; i++) {
                    //json.push({ label: response.Records[i]["Description"], value: response.Records[i]["Code"] })
                    json.push({ label2: response.Records[i]["Description"], value: response.Records[i]["Code"], label: response.Records[i]["Code"] + " - "+ response.Records[i]["Description"] })
                }
                setActividadEmpresa(json);
            });
    }
    // cargarListaGrupoEconomico
    function loadListGroupEconomic() {
        const api = new CoreServices();
        // getGrupoEconomicoCatalogo
        api.getGrupoEconomicoCatalogo()
            .then(response => {
                if (response === null) { return; }
                let json = [];
                for (let i = 0; i < response.Records.length; i++) {
                    json.push({ label: response.Records[i]["Description"], value: response.Records[i]["Code"] })
                }
                setGruposEconomicos(json);
            });
    }
    // cargarListaRevision
    function loadDataRisk() {
        const api = new BackendServices();
        api.retrieveRevisionType()
            .then(response => {
                if (response === null) { return; }
                let json = [];
                for (let i = 0; i < response.length; i++) {
                    json.push({ label: response[i]["description"], value: response[i]["id"] })
                }
                setlistaRevision(json);
            });
    }
    // Cargar datos generales
    function loadDataGeneral(locationData) {

        const apiBack = new BackendServices();
        // consultarDeudorPrincipal
        apiBack.consultPrincipalDebtor(locationData.transactionId).then(resp => {
            if (resp != undefined) {
                setdatosDeudorPrincipal(resp);
            }
        })
        apiBack.consultGeneralDataIGR(locationData.transactionId).then(resp => {
            setdatosIGR(resp);
            try {
                var defaultVal = null;
                // seteconomicGroupSelect(undefined);

                if (gruposEconomicos.length > 0 && resp.economicGroup !== null && economicGroupSelect === undefined) {
                    defaultVal = gruposEconomicos.find(x => (x.label).toUpperCase() === (resp.economicGroup.name).toUpperCase());
                    if (defaultVal !== undefined) {
                        seteconomicGroupSelect(defaultVal);
                    }
                }
                console.log("setActividadEmpresaSet",resp.economicActivity,actividadEmpresa);
                
                setActividadEmpresaSet(resp.economicActivity);
                if (actividadEmpresa.length > 0 && resp.economicActivity !== null && actividadEmpresaSelect === undefined) {
                    defaultVal = actividadEmpresa.find(x => (x.value).toUpperCase() === (resp.economicActivity.code).toUpperCase());
                    if (defaultVal !== undefined) {
                        setActividadEmpresaSelect(defaultVal);
                    }
                }
            }
            catch (err) { }
        }).catch((error) => {
            console.log(error);
        });
        apiBack.consultEnvironmentalAspectsIGR(locationData.transactionId).then(resp => {
            setdatosAmbientales(resp.environmentalAspectsDTO)
        }).catch((error) => {

        });
    }
    function handleSubmit(event, errors, values) {
        event.preventDefault();
        // if (errors.length > 0) {
        //     values.status = true;
        // }
        // if (event.target.id !== 'DatosGeneralesPropuesta') {
        //     return;
        // }
        if (listaRevisionSelect == undefined) {
            setFormValid(false);
            values.status = true;
            return
        }
        if (countrySelect == undefined) {
            setFormValid(false);
            values.status = true;
            return
        }
        if (countryRiskSelect == undefined) {
            setFormValid(false);
            values.status = true;
            return
        }
        values.minimumProvisionSIB = Number(currencyData.getRealValue(values.minimumProvisionSIB));
        values.requestDate = moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet : (moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD"));
        values.lastRequestDate = moment(fechaSet2, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet2 : (moment(fechaSet2, "DD/MM/YYYY").format("YYYY-MM-DD"));
        values.nextRevisionDate = moment(fechaSet3, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet3 : (moment(fechaSet3, "DD/MM/YYYY").format("YYYY-MM-DD"));
        values.proposedExpirationDate = moment(fechaSet4, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet4 : (moment(fechaSet4, "DD/MM/YYYY").format("YYYY-MM-DD"));
        const data = Object.assign({
            country: countrySelect != undefined ? countrySelect.label : '',
            countryRisk: countryRiskSelect != undefined ? countryRiskSelect.label : '',
            economicGroupName: economicGroupSelect != undefined ? economicGroupSelect.label : '',
            activityCompany: actividadEmpresaSelect != undefined ? actividadEmpresaSelect.label : '',
            revision: listaRevisionSet ? listaRevisionSet.label : '',
            preapproval: preapprovalSwitch,
            relatedPart: relatedPartSwitch,
            transactId: Number(locationData.transactionId),
            approvalLevel: "",
            requestId: props.dataGlobal != null ? props.dataGlobal.requestId : ""
        }, values);
        setdataReturn(data)
        setFormValid(true);
        // props.saveDataCreditProposal(true,props.activeTab);

    }
    function handleDropdownChange(name, event) {
        switch (name) {
            case 'country':
                setCountry(event);
                break;
            case 'countryRisk':
                setCountryRisk(event);
                break;
            case 'economicGroupName':
                setEconomicGroup(event);
                break;
            case 'activityCompany':
                setActivityCompany(event);
                break;
            default:
        }
    }

    function check(e) {
        let tecla = (document.all) ? e.keyCode : e.which;
        //Tecla de retroceso para borrar, siempre la permite
        if (tecla === 45) {
            e.preventDefault();
            return true;
        }

        return false;
    }

    return (
        <AvForm id="frmDatosGeneralesPropuesta" className="needs-validation" onSubmit={handleSubmit}>
            <h5>{props.title}</h5>
            <p className="card-title-desc"></p>
            <Row>
                <Col md="3">
                    <AvGroup>
                        <Label htmlFor="transactId">{t("RequestNumber")}</Label>
                        <AvField
                            className="form-control"
                            name="requestId"
                            type="text"
                            id="requestId"
                            value={dataRequest}
                            readOnly />
                    </AvGroup>
                </Col>
                <Col md="3">
                    <AvGroup>
                        <Label htmlFor="customerNumber">{t("Customer ID")}</Label>
                        <AvField
                            className="form-control"
                            name="customerNumber"
                            min={0}
                            type="number"
                            onKeyPress={(e) => { return check(e) }}
                            readOnly
                            id="customerNumber"
                            value={datosDeudorPrincipal != null && datosDeudorPrincipal != "" && datosDeudorPrincipal != undefined ? datosDeudorPrincipal.customerNumberT24 : "0"}
                        />
                    </AvGroup>
                </Col>
                <Col md="4">
                    <Label htmlFor="revisionType">{t("Revision Type")}</Label>
                    <Select noOptionsMessage={() => ""}
                        onChange={(e) => { setlistaRevisionSelect(listaRevision.find(x => x.label === e.label)); setlistaRevisionSet(e); }}
                        options={listaRevision}
                        id="revision"
                        classNamePrefix="select2-selection"
                        placeholder={t("Select")}
                        value={listaRevisionSelect}
                    />
                    {listaRevisionSelect == undefined ?
                        <p className="message-error-parrafo">{t("Required")}</p>
                        : null}
                </Col>

            </Row>
            <Row>
                <Col md="2">
                    <Label htmlFor="preapproval">{t("Pre Approved")}</Label>
                    <AvGroup check className="mb-3">
                        <Switch name="preapproval"
                            uncheckedIcon={<Offsymbol />}
                            checkedIcon={<OnSymbol />}
                            onColor="#007943"
                            className="form-label"
                            onChange={() => {
                                setpreapprovalSwitch(!preapprovalSwitch)
                            }}
                            checked={preapprovalSwitch ?? false}
                        />
                    </AvGroup>
                </Col>
                <Col md="2">
                    <Label htmlFor="relatedPart">{t("Related Part")}</Label>
                    <AvGroup check className="mb-3">
                        <Switch name="relatedPart"
                            uncheckedIcon={<Offsymbol />}
                            checkedIcon={<OnSymbol />}
                            onColor="#007943"
                            className="form-label"
                            onChange={() => {
                                setrelatedPartSwitch(!relatedPartSwitch)
                            }}
                            checked={relatedPartSwitch ?? false}
                        />
                    </AvGroup>
                </Col>
            </Row>
            <Row>
                <Col md="6">
                    <Label htmlFor="economicGroupName">{t("Economic Group Name")}</Label>
                    <Select noOptionsMessage={() => ""}
                        id="economicGroupName"
                        name="economicGroupName"
                        onChange={(e) => { seteconomicGroupSelect(gruposEconomicos.find(x => x.label === e.label)); handleDropdownChange('economicGroupName', e); }}
                        options={gruposEconomicos}
                        classNamePrefix="select2-selection"
                        isDisabled={true}
                        value={economicGroupSelect} />
                </Col>
                <Col md="6">
                    <AvGroup>
                        <Label htmlFor="economicGroupNumber">{t("Economic Group Number")}</Label>
                        <AvField
                            className="form-control"
                            name="economicGroupNumber"
                            type="text"
                            disabled={true}
                            id="economicGroupNumber"
                            value={economicGroupSelect != undefined ? economicGroupSelect.value : ''}

                        />
                    </AvGroup>
                </Col>
                <Col md="6">
                    <Label htmlFor="country">{t("Country Class")}</Label>
                    <Select noOptionsMessage={() => ""}
                        id="country"
                        name="country"
                        onChange={(e) => { setCountrySelect(paises.find(x => x.label === e.label)); handleDropdownChange('country', e) }}
                        placeholder={t("Select")}
                        options={paises}
                        classNamePrefix="select2-selection"
                        value={countrySelect}
                    />
                    {countrySelect == undefined ?
                        <p className="message-error-parrafo">{t("Required")}</p>
                        : null}

                </Col>
                <Col md="6">
                    <AvGroup>
                        <Label htmlFor="riskClassification">{t("Risk Assesment")}</Label>
                        <AvField
                            className="form-control"
                            name="riskClassification"
                            type="text"
                            readOnly
                            id="riskClassification"
                            value={datosAmbientales != null ? datosAmbientales.riskPreClassification : "1"}
                        />


                    </AvGroup>
                </Col>
                <Col md="6">
                    <Label htmlFor="activityCompany">{t("Company Activity")}</Label>
                    <Select noOptionsMessage={() => ""}
                        name="activityCompany"
                        onChange={(e) => { setActividadEmpresaSelect(actividadEmpresa.find(x => x.label === e.label)); setActividadEmpresaSet(e); }}
                        placeholder={t("Selectcompanyactivity")}
                        options={actividadEmpresa}
                        classNamePrefix="select2-selection"
                        value={actividadEmpresaSelect}
                        isDisabled={true} />
                </Col>
                <Col md="6">
                    <AvGroup>
                        <Label htmlFor="minimumProvisionSIB">{t("SIB Minimum Provision")}</Label>
                        <AvField
                            className="form-control"
                            name="minimumProvisionSIB"
                            type="text"
                            id="minimumProvisionSIB"
                            pattern="^[0-9,.]*$"
                            onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                            value={currencyData.format(minimumProvisionSIB ?? 0)} />
                    </AvGroup>
                </Col>
                {/* <Col md="3">
                    <AvGroup>
                        <Label htmlFor="approvalLevel">{t("Approval Level")}</Label>
                        <AvField
                            className="form-control"
                            name="approvalLevel"
                            type="select"
                            id="approvalLevel"
                            value={approvalLevel}>
                            <option value="1">Nivel 1</option>
                            <option value="2">Nivel 2</option>
                            <option value="3">Nivel 3</option>
                        </AvField>
                    </AvGroup>
                </Col> */}

                <Col md="9">

                    <Label htmlFor="accountExecutive">{t("Account Executive")}</Label>
                    <AvField
                        className="form-control"
                        name="accountExecutive"
                        type="text"
                        id="accountExecutive"
                        value={accountExecutive}
                        validate={{
                            required: { value: true, errorMessage: t("Required Field") }
                        }} />
                </Col>
                <Col md="3">
                    <AvGroup>
                        <Label htmlFor="flow">{t("Flow Type")}</Label>
                        <AvField
                            className="form-control"
                            name="flow"
                            type="select"
                            id="flow"
                            value={flow}>
                            {/* <option value="1">Muy Urgente</option>
                            <option value="2">Urgencia Moderada</option>
                            <option value="3">Normal</option>
                            <option value="4">Importante</option>
                            <option value="5">Baja Urgencia</option>
                            <option value="6"> Sin Urgencia</option> */}
                            <option value="1">Normal</option>
                            <option value="2">Urgente</option> 
                        </AvField>
                    </AvGroup>
                </Col>
                <Col md="6">
                    <AvGroup>
                        <Label htmlFor="responsibleUnit">{t("Responsible Unit")}</Label>
                        <AvField
                            className="form-control"
                            name="responsibleUnit"
                            type="text"
                            id="responsibleUnit"
                            value={responsibleUnit}
                            validate={{
                                required: { value: true, errorMessage: t("Required Field") }
                            }} />
                    </AvGroup>
                </Col>
                <Col md="6">
                    <Label htmlFor="countryRisk">{t("Country Risk")}</Label>
                    <Select noOptionsMessage={() => ""} required
                        onChange={(e) => { setCountryRiskSelect(paises.find(x => x.label === e.label)); handleDropdownChange('countryRisk', e) }}
                        defaultValue={paisesRiesgo.label}
                        placeholder={t("Selectacountry")}
                        options={paisesRiesgo}
                        classNamePrefix="select2-selection"
                        value={countryRiskSelect} />
                    {countryRiskSelect == undefined ?
                        <p className="message-error-parrafo">{t("Required")}</p>
                        : null}
                </Col>

            </Row>
            {/* {CambioDatos ? */}
            <Row>
                <Col md="3">
                    <Label htmlFor="requestDate">{t("Application Date")}</Label>

                    {fechaSet && (<Flatpickr
                        name="requestDate"
                        id="requestDate"
                        className="form-control d-block"
                        placeholder={OPTs.FORMAT_DATE_SHOW}
                        options={{
                            dateFormat: OPTs.FORMAT_DATE,
                            defaultDate: fechaSet,//selectClient !== undefined ? moment(selectClient.birthDate) : null
                        }}
                        onChange={(selectedDates, dateStr, instance) => {
                            setfechaSet(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD"))
                        }}
                    // onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD") } }) }}
                    />)}
                </Col>
                <Col md="3">
                    <Label htmlFor="lastRequestDate">{t("Last Application Date")}</Label>

                    {fechaSet2 && (<Flatpickr
                        name="lastRequestDate"
                        id="lastRequestDate"
                        className="form-control d-block"
                        placeholder={OPTs.FORMAT_DATE_SHOW}
                        options={{
                            dateFormat: OPTs.FORMAT_DATE,
                            defaultDate: fechaSet2,//selectClient !== undefined ? moment(selectClient.birthDate) : null
                        }}
                        onChange={(selectedDates, dateStr, instance) => {
                            setfechaSet2(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD"))
                        }}
                    // onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD") } }) }}
                    />)}
                </Col>
                <Col md="3">
                    <Label htmlFor="nextRevisionDate">{t("Next Revision Date")}</Label>

                    {fechaSet3 && (<Flatpickr
                        name="nextRevisionDate"
                        id="nextRevisionDate"
                        className="form-control d-block"
                        placeholder={OPTs.FORMAT_DATE_SHOW}
                        options={{
                            dateFormat: OPTs.FORMAT_DATE,
                            defaultDate: fechaSet3,//selectClient !== undefined ? moment(selectClient.birthDate) : null
                        }}
                        onChange={(selectedDates, dateStr, instance) => {
                            setfechaSet3(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD"))
                        }}
                    // onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD") } }) }}
                    />)}
                </Col>
                <Col md="3">
                    <Label htmlFor="proposedExpirationDate">{t("Expiration Date")}</Label>

                    {fechaSet4 && (<Flatpickr
                        name="proposedExpirationDate"
                        id="proposedExpirationDate"
                        className="form-control d-block"
                        placeholder={OPTs.FORMAT_DATE_SHOW}
                        options={{
                            dateFormat: OPTs.FORMAT_DATE,
                            defaultDate: fechaSet4,//selectClient !== undefined ? moment(selectClient.birthDate) : null
                        }}
                        onChange={(selectedDates, dateStr, instance) => {
                            setfechaSet4(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD"))
                        }}
                    // onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD") } }) }}
                    />)}
                </Col>
            </Row>
        </AvForm>
    );
});


DatosGeneralesPropuesta.propTypes = {
    values: PropTypes.object
};

DatosGeneralesPropuesta.defaultProps = {
    values: {}
};


export default DatosGeneralesPropuesta;
