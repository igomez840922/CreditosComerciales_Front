import React, { useState, useContext, useRef, useEffect } from "react"
import PropTypes from 'prop-types';
import { Link } from "react-router-dom"
import SweetAlert from "react-bootstrap-sweetalert"
import {
  Table,
  Card,
  CardBody,
  Button,
  Row,
  Col,
  Label,
  Alert
} from "reactstrap"
import { AvForm, AvGroup, AvField, AvInput } from "availity-reactstrap-validation"
import listaFacilidades from "../../../../api/bpm/propuestacredito/facilidades";
import { Facilidad } from "../../../../models/PropuestaCredito";
import { BackendServices, CoreServices } from "../../../../services";
import Select from "react-select";
import ComisionSeccion from "./Comision";
import DisbursementSection from "./DisturbementSeccion";
import WarrantsSection from "./WarrantsSection";
import SuretiesSection from "./SuretiesSection";
import Switch from "react-switch";
import { useLocation, useHistory } from 'react-router-dom';
import * as url from "../../../../helpers/url_helper"
import Currency from "../../../../helpers/currency"
import { useTranslation } from "react-i18next/";
import FacilityHistory from "../../../../components/Common/FacilityHistory";
import LoadingOverlay from "react-loading-overlay";
import AttachmentFileCore from "../../../../components/Common/AttachmentFileCore";
import { AttachmentFileInputModel } from "../../../../models/Common/AttachmentFileInputModel";
import * as OPTs from "../../../../helpers/options_helper";
import TreasuryCurve from "./treasuryCurve.model";

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
const ListaFacilidad = React.forwardRef((props, ref) => {
  const location = useLocation()
  const { t, i18n } = useTranslation();
  const [dataSet, setdataSet] = useState({
    "requestId": "",
    "cr": "",
    "amount": 0,
    "debtor": "",
    "clientTypeId": 0,
    "balance": 0,
    "proposalTypeId": "",
    "proposalTypeName": "",
    "facilityTypeId": "",
    "purpose": "",
    "sublimits": "",
    "proposalRate": 0,
    "noSubsidyRate": 0,
    "effectiveRate": 0,
    "feci": true,
    "termDays": 0,
    "termDescription": "",
    "ltv": 0,
    "finantialConditions": "",
    "environmentRiskCategory": 0,
    "covenant": "",
    "environmentRiskOpinion": "",
    "finantialCovenant": "",
    "legalDocumentation": "",
    "creditRiskOpinion": "",
    "provision": "",
    "numero": "",
    "otherConditions": "",
    "facilityId": 0,
  });
  const [datosUsuario, setdatosUsuario] = useState(null)
  const [dataValidation, setdataValidation] = useState({
    tipoPropuestaRequerido: false,
    subPropuestaRequerido: false,
    tipoFacilidadRequerido: false,
  });
  const [context, setcontext] = useState(location.data)
  const propostalSectionRef = useRef();
  const [formValid, setFormValid] = useState(false);
  const [dataLocation, setData] = useState(location.data);
  const [commissions, setCommissions] = useState([]);
  const [disbursementTerms, setDisbursementTerms] = useState([]);
  const [paymentPrograms, setPaymentPrograms] = useState([]);
  const [disbursementMethods, setDisbursementMethods] = useState([]);
  const [warrants, setWarrants] = useState([]);
  const [sureties, setSureties] = useState([]);
  const [garantiaET, setgarantiaET] = useState([]);
  const [ViewSeccion, setViewSeccion] = useState(false);
  const backendServices = new BackendServices();
  // Variables para alertas
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [info_dlg, setinfo_dlg] = useState(false)
  const [info_msg, setinfo_msg] = useState("")
  const [dynamic_title, setdynamic_title] = useState("")
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [confirm_alertDelete, setconfirm_alertDelete] = useState(false)
  const [success_dlg, setsuccess_dlg] = useState(false)
  const [applyEscrow, setapplyEscrow] = useState(false)
  const [isActiveLoading, setIsActiveLoading] = useState(false);
  const history = useHistory();
  const currencyData = new Currency();
  const [locationData, setLocationData] = useState(null);
  const [checkSubProp, setcheckSubProp] = useState(false);

  const [campoTasa, setcampoTasa] = useState(false);
  const [campoTasa2, setcampoTasa2] = useState(false);
  const [campoTasa3, setcampoTasa3] = useState(false);
  const [campoTasa4, setcampoTasa4] = useState(false);
  const [PropotalRate, setPropotalRate] = useState(0);
  const [TotalPropotalRate, setTotalPropotalRate] = useState(0);

  const [historyDetails, setHistoryDetails] = useState(undefined);

  const termOptions = [{ label: `${t("ShortTerm")}`, value: "CP" }, { label: `${t("LongTerm")}`, value: "LP" }];
  const [term, setTerm] = useState(null);

  const [isActiveLoadingFacilities, setIsActiveLoadingFacilities] = useState(false);
  const [treasuryCurveClass, setTreasuryCurveClass] = useState();
  const [treasuryCurveMessage, setTreasuryCurveMessage] = useState(false);

  React.useImperativeHandle(ref, () => ({
    submit: (validate = true) => {
      const form = document.getElementById('formNewFacility');
      if (validate) {
        if (formValid) {
          form.requestSubmit();
          return true;
        }
        return false;
      }
      else {
        form.requestSubmit();
        return true;
      }
    },
    getFormValidation: () => {
      return formValid;
    }
  }));
  // services
  useEffect(() => {
    setTerm(undefined);

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

    // Read Api Service  ata
    // consultarDeudorPrincipal
    backendServices.consultPrincipalDebtor(dataSession.transactionId).then(resp => {
      dataSet.numero = resp.clientDocId
      setdataSet(dataSet);
      setdatosUsuario(resp)
    })
    backendServices.consultEnvironmentalAspectsIGR(dataSession.transactionId).then(dataAsp => {
      setgarantiaET(dataAsp?.environmentalAspectsDTO?.riskClassificationConfirmation ?? "");
    })



  }, []);


  async function handleSubmitFacilidad(event, errors, values) {

    // console.log("termOptions", term.value)
    if (!propuestaSet || !tipoFacilidadSet) {
      return
    }
    if (+document?.getElementById("amount")?.value < 0) {
      return;
    }
    if (campoTasa) {
      return;
    }
    if (campoTasa2) {
      return;
    }
    if (campoTasa3) {
      return;
    }
    // if (campoTasa4) {
    //   return;
    // }
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    setIsActiveLoading(true);
    console.log(values?.amount);
    values.amount = Number(currencyData.getRealValue(values?.amount ?? 0));
    values.clientTypeId = Number(1);
    values.balance = Number(currencyData.getRealValue(values?.balance ?? 0));
    values.proposalRate = Number(currencyData.getRealPercent(values?.proposalRate ?? 0));
    values.noSubsidyRate = Number(currencyData.getRealPercent(values?.noSubsidyRate ?? 0));
    values.effectiveRate = Number(currencyData.getRealPercent(values?.effectiveRate ?? 0));
    values.feci = values.feci == "true" ? true : false;
    values.termDays = (values.termDays === '' ? 0 : values.termDays);
    values.ltv = Number(currencyData.getRealPercent(values?.ltv ?? 0));
    values.environmentRiskCategory = values.environmentRiskCategory;
    values.proposalTypeId = tipoPropuestaSelect == undefined ? " " : tipoPropuestaSelect.value;
    values.proposalTypeName = subPropuestaSelect == undefined ? " " : subPropuestaSelect.value;
    values.facilityTypeId = tipoFacilidadSelect == undefined ? " " : tipoFacilidadSelect.value;
    values.termType = terminosSelect == undefined ? " " : terminosSelect.value;
    values.facilityId = dataSet.facilityId;
    values.requestId = dataGlobalReq ?? 0;
    values.applyEscrow = applyEscrow ?? false;
    values.startingAmount = currencyData.getRealValue(values?.startingAmount ?? 0);
    values.term = !term ? " " : term.value;

    props.setViewAutonomy(false);

    saveNewFacility(values)
      .then((result) => {
        // props.onSave(values);
        // props.onDismiss();
        props.setViewAutonomy(true);
      }).catch(err => {
        console.log(err);
        props.setViewAutonomy(true);
      });
  }

  async function newFacility(data = {
    "facilityNumber": "0",
    "cr": "0",
    "amount": 0,
    "debtor": "  ",
    "clientTypeId": 1,
    "customer": {
      "id": "469303-1-434018"
    },
    "balance": 0,
    "purpose": "",
    "sublimits": "",
    "proposalRate": 0,
    "noSubsidyRate": 0,
    "effectiveRate": 0,
    "feci": false,
    "termDays": 0,
    "termDescription": "",
    "ltv": 0,
    "finantialConditions": " ",
    "environmentRiskCategory": 0,
    "covenant": " ",
    "environmentRiskOpinion": " ",
    "finantialCovenant": " ",
    "legalDocumentation": "  ",
    "otherConditions": " ",
    "creditRiskOpinion": " ",
    "provision": " ",
    "proposalTypeId": "",
    "proposalTypeName": "",
    "facilityTypeId": "",
    "termType": "",
    "origin": "MVP",
    "applyEscrow": false,
    facilityId: 0,
    "requestId": dataGlobalReq ?? 0,
    startingAmount: 0,
    t24:false,
    term: ''
  }) {

    let modelTreasuryCurve = new TreasuryCurve();

    await modelTreasuryCurve.initial()
    setTreasuryCurveClass(modelTreasuryCurve);
    setTreasuryCurveMessage(modelTreasuryCurve.treasuryCurve?.length === 0)


    // nuevoFacilidadPropCred
    backendServices.newFacilityPropCred(data).then(async resp => {
      await backendServices.consultarFacilidades2(dataGlobalReq ?? 0).then(async resp2 => {

        resp2 = (resp2.find(facilities => facilities.facilityId == Math.max(...resp2.map(arr => arr.facilityId))));
        data.facilityId = resp;

        setViewSeccion(!ViewSeccion);
        setHistoryDetails(false)

        // setapplyEscrow(locationData)

        setIsActiveLoading(true);

        await Promise.allSettled([
          backendServices.consultarFacilidades(dataGlobalReq ?? 0),
          backendServices.consultarDetalleOpinionRiesgoCredito(locationData.transactionId),
          backendServices.getEnvironmentalRiskInfo(locationData.transactionId)
        ]).then(response => {
          const [{ value: Facilidades }, { value: DetalleOpinionRiesgoCredito }, { value: EnvironmentalRiskInfo }] = response;

          data.covenant = EnvironmentalRiskInfo?.detail ?? "";
          data.environmentRiskOpinion = EnvironmentalRiskInfo?.recommendations ?? "";

          data.opinionRiskCredit = DetalleOpinionRiesgoCredito.length > 0 ? DetalleOpinionRiesgoCredito[0].opinion : "";

          data.facilityIdVisible = (Facilidades?.filter($$ => $$.debtor != "  ").length + 1) || 1;

          data.facilityId = resp;
          console.log(data)

          setIsActiveLoading(false);

          setTerm(null);

          setpropuestaSet(null);
          settipoFacilidadSet(null);
          setcheckSubProp(false);
          setsubPropuestaSet(null);

          settipoPropuestaSelect(data?.proposalTypeId ?? undefined);
          setsubPropuestaSelect(undefined);
          settipoFacilidadSelect(undefined);

          setdataSet(data)
          cargarDataSelect(data)

        }).catch(err => {
          setIsActiveLoading(false);
          console.log(err)
          dataSet.facilityId = resp;
          setdataSet(dataSet)

          setTerm(null);
          setpropuestaSet(null);
          settipoFacilidadSet(null);
          setcheckSubProp(false);
          setsubPropuestaSet(null);

          settipoPropuestaSelect(undefined);
          setsubPropuestaSelect(undefined);
          settipoFacilidadSelect(undefined);
        });

      })

    });
  }
  function saveNewFacility(values) {
    return new Promise((resolve, reject) => {
      const datos = {
        "requestId": values.requestId,
        "facilityId": dataSet.facilityId,
        "cr": values.cr,
        "amount": values.amount,
        "debtor": deudoresListSelect.value,
        "clientTypeId": deudoresListSelect.value,
        "balance": values.balance,
        "proposalTypeId": values.proposalTypeId,
        "proposalTypeName": values.proposalTypeName,
        // "facilityTypeId": values.facilityTypeId,
        "facilityTypeId": values.facilityTypeId,
        "purpose": values.purpose,
        "sublimits": values.sublimits,
        "proposalRate": values.proposalRate,
        "noSubsidyRate": values.noSubsidyRate,
        "effectiveRate": values.effectiveRate,
        "feci": values.feci,
        "termDays": values.termDays,
        "termDescription": values.termDescription,
        "ltv": values.ltv,
        "finantialConditions": values.finantialConditions,
        "environmentRiskCategory": 0,
        "covenant": values.covenant,
        "environmentRiskOpinion": values.environmentRiskOpinion,
        "finantialCovenant": values.finantialCovenant,
        "legalDocumentation": values.legalDocumentation,
        "creditRiskOpinion": values.creditRiskOpinion,
        "otherConditions": values.otherConditions,
        "provision": values.provision,
        "applyEscrow": values.applyEscrow,
        "termType": values.termType,
        "startingAmount": +values.startingAmount,
        "term": values.term,
        t24: false,
        "origin": "MVP"
      }
      console.log(datos)
      props.setLevelAutonomy(levelAutonomy => levelAutonomy + +datos.amount)
      // actualizarFacilidadPropCred
      backendServices.updateFacilityPropCred(datos).then(resp => {
        console.log("🚀 ~ file: FacilidadesSeccion.js ~ line 399 ~ backendServices.updateFacilityPropCred ~ resp", resp)
        if (resp !== null && resp !== undefined) {
          setViewSeccion(!ViewSeccion);
          setsuccessSave_dlg(true);
        } else {
          seterror_dlg(false);
        }
        cargarFacilidades(locationData)
        setIsActiveLoading(false);
        resetData();
        resolve();
      }).catch(err => {
        console.log(err)
        seterror_dlg(false);
        setIsActiveLoading(false)
        resetData();
        resolve();
      })
    });
  }
  function handleNewCommission(newItem) {
    const newCommissions = [...commissions, newItem];
    setCommissions(newCommissions);
  }

  function handleDeleteCommission(item) {
    const itemIndex = commissions.indexOf(item);
    if (itemIndex === -1) {
      return;
    }
    const newCommissions = [...commissions];
    newCommissions.splice(itemIndex, 1);
    setCommissions(newCommissions);
  }

  function handleNewDisbursementTerm(newItem) {
    const newDisbursementTerms = [...disbursementTerms, newItem];
    setDisbursementTerms(newDisbursementTerms);
  }

  function handleDeleteDisbursementTerm(item) {
    const itemIndex = disbursementTerms.indexOf(item);
    if (itemIndex === -1) {
      return;
    }
    const newDisbursementTerms = [...disbursementTerms];
    newDisbursementTerms.splice(itemIndex, 1);
    setDisbursementTerms(newDisbursementTerms);
  }

  function handleNewPaymentProgram(newItem) {
    const newPaymentPrograms = [...paymentPrograms, newItem];
    setPaymentPrograms(newPaymentPrograms);
  }

  function handleDeletePaymentProgram(item) {
    const itemIndex = paymentPrograms.indexOf(item);
    if (itemIndex === -1) {
      return;
    }
    const newPaymentPrograms = [...paymentPrograms];
    newPaymentPrograms.splice(itemIndex, 1);
    setPaymentPrograms(newPaymentPrograms);
  }

  function handleNewDisbursementMethod(newItem) {
    const newDisbursementMethods = [...disbursementMethods, newItem];
    setDisbursementMethods(newDisbursementMethods);
  }
  function handleDeleteDisbursementMethod(item) {
    const itemIndex = disbursementMethods.indexOf(item);
    if (itemIndex === -1) {
      return;
    }
    const newDisbursementMethods = [...disbursementMethods];
    newDisbursementMethods.splice(itemIndex, 1);
    setDisbursementMethods(newDisbursementMethods);
  }
  function handleNewWarrant(newItem) {
    const newWarrants = [...warrants, newItem];
    setWarrants(newWarrants);
  }
  function handleDeleteWarrant(item) {
    const itemIndex = warrants.indexOf(item);
    if (itemIndex === -1) {
      return;
    }
    const newWarrants = [...warrants];
    newWarrants.splice(itemIndex, 1);
    setWarrants(newWarrants);
  }
  function handleNewSurety(newItem) {
    const newSureties = [...sureties, newItem];
    setSureties(newSureties);
  }
  function handleDeleteSurety(item) {
    const itemIndex = sureties.indexOf(item);
    if (itemIndex === -1) {
      return;
    }
    const newSureties = [...sureties];
    newSureties.splice(itemIndex, 1);
    setSureties(newSureties);
  }
  // FUNCIONES PARA PROPOSTALSECTION
  const api = new BackendServices();
  const apiCoreServices = new CoreServices();
  const [dataReturn, setdataReturn] = useState({
    proposalTypeId: null,
    proposalTypeName: null,
    facilityTypeId: null,
  });
  const [tipoPropuesta, settipoPropuesta] = useState(null);
  const [tipoPropuestaSelect, settipoPropuestaSelect] = useState(undefined);
  const [propuestaSet, setpropuestaSet] = useState(null);
  const [tipoPropuestaRequerido, settipoPropuestaRequerido] = useState(false);
  const [subPropuesta, setsubPropuesta] = useState(null);
  const [subPropuestaSelect, setsubPropuestaSelect] = useState(undefined);
  const [subPropuestaSet, setsubPropuestaSet] = useState(null);
  const [subPropuestaRequerido, setsubPropuestaRequerido] = useState(false);
  const [tipoFacilidad, settipoFacilidad] = useState(null);
  const [tipoFacilidadSelect, settipoFacilidadSelect] = useState(undefined);
  const [deudoresListSelect, setdeudoresListSelect] = useState(undefined);
  const [terminosSelect, setterminosSelect] = useState(undefined);
  const [tipoFacilidadSet, settipoFacilidadSet] = useState(null);
  const [deudoresList, setdeudoresList] = useState(null);
  const [tipo, settipo] = useState("guardar");
  const [dataRows, setdataRows] = useState(null);
  const [dataEdit, setdataEdit] = useState(null);
  const [campoRequeridoDeudores, setcampoRequeridoDeudores] = useState(false);
  const [MontoFacilidad, setMontoFacilidad] = useState(0);
  const [dataGlobalReq, setdataGlobalReq] = useState(0);
  let listaIdentificacion = props.identificationList;
  const [tipoFacilidadRequerido, settipoFacilidadRequerido] = useState(false);
  const [facilityNumber, setfacilityNumber] = useState(1);
  const typeTerms = [{ label: t("Days"), value: "DÍAS" }, { label: t("Months"), value: "MESES" }, { label: t("Years"), value: "AÑOS" }]
  const [proposalRate, setProposalRate] = useState(0);
  const [rateTreasuryCurve, setRateTreasuryCurve] = useState(false);
  const [rateProposalTreasuryCurve, setRateProposalTreasuryCurve] = useState({ Description: "", Code: "" });

  React.useEffect(() => {
    setterminosSelect(typeTerms[0])
    // Read Api Service data
    // initializeData();
  }, []);

  React.useEffect(() => {

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
    if (props.activeTab == 3) {
      const backendServicesAll = new BackendServices();
      backendServicesAll.consultGeneralDataPropCred(dataSession?.transactionId ?? dataSession?.transactionId ?? 0)
        .then((data) => {
          console.log("🚀 ~ file: FacilidadesSeccion.js ~ line 576 ~ .then ~ data", data)
          if (data !== undefined) {
            setdataGlobalReq(data[0]?.requestId);
          }
          cargarFacilidades(dataSession, data[0]?.requestId)
          initializeData(dataSession);
        });
    }

    // Read Api Service data
  }, [props.activeTab == 3]);
  function cargarFacilidades(dataSession, requestId = dataGlobalReq) {
    setIsActiveLoadingFacilities(true);
    api.consultarDeudores(dataSession.transactionId)
      .then((data2) => {
        if (data2 !== null && data2 !== undefined) {
          let jsonDeudores = [];
          for (let i = 0; i < data2.length; i++) {
            jsonDeudores.push({ label: data2[i]["typePerson"] == 2 ? data2[i]["name"] : (data2[i]["name"] + " " + data2[i]["name2"] + " " + data2[i]["lastName"] + " " + data2[i]["lastName2"]), value: data2[i]["personId"] })
            // jsonDeudores.push({ label: data2[i]["name"] + " " + data2[i]["name2"] + " " + data2[i]["lastName"] + " " + data2[i]["lastName2"], value: data2[i]["personId"] })
          }

          api.retrieveProposalType()
            .then((propuesta) => {
              api.retrieveFacilityType()
                .then((facilidad) => {
                  api.consultarFacilidades(requestId).then(resp => {
                    let acu = 0;
                    if (resp?.filter(data => data.debtor != "  ").length > 0) {
                      resp = currencyData.orderByJSON(resp, 'facilityId', 'asc');
                      setdataRows(resp.map((data, index) => {
                        acu++;
                        return (
                          <tr key={acu}>
                            <td data-label={t("Facility")}>{acu}</td>
                            <td data-label={t("Debtor")}>{jsonDeudores.find(x => x.value === Number(data.debtor))?.label}</td>
                            <td data-label={t("Facility Type")}>{facilidad.find(x => x.id === data.facilityTypeId)?.description}</td>
                            <td data-label={t("Proposal")}>{propuesta.find(x => x.id === data.proposalTypeId)?.description}</td>
                            <td data-label={t("Amount")}>${currencyData.formatTable(data.amount ?? 0)}</td>
                            <td data-label={t("Amount") + " " + t("Rate")}>{currencyData.formatTable(data.proposalRate ?? 0)}%</td>
                            <td data-label={t("Actions")} style={{ textAlign: "right" }}>
                              <Button type="button" color="link" onClick={(resp) => {
                                update(data, index)
                              }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                              <Button type="button" color="link" onClick={(resp) => { setdataSet(data); eliminarFacilidades(); }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
                            </td>
                          </tr>)
                      }
                      ));
                      setIsActiveLoadingFacilities(false);
                    } else {
                      setdataRows(
                        <tr key={1}>
                          <td colSpan="7" style={{ textAlign: 'center' }}></td>
                        </tr>);
                      setIsActiveLoadingFacilities(false);
                    }
                  }).catch(err => {
                  });
                })
            })
        }

      })
      .catch((error) => {
        console.error('api error: ', error);
      });
  }
  async function update(data, index) {

    let modelTreasuryCurve = new TreasuryCurve();

    await modelTreasuryCurve.initial()
    setTreasuryCurveClass(modelTreasuryCurve);
    setTreasuryCurveMessage(modelTreasuryCurve.treasuryCurve?.length === 0)


    data.facilityIdVisible = index + 1;

    setdataSet(data); cargarDataSelect(data); settipo("editar"); setViewSeccion(true);
    changeRateProposal(data.proposalRate ?? 0, data.termType ?? 'DÍAS', modelTreasuryCurve)
    dataReturn.termType = data.termType;
    setdataReturn(dataReturn);
    setPropotalRate(data.proposalRate);
    setTotalPropotalRate(+data.proposalRate - +data.noSubsidyRate)
  }


  function eliminarFacilidades() {
    settipo("eliminar");
    setconfirm_alertDelete(true);
  }
  React.useEffect(() => {
    // Read Api Service data
    settipoPropuestaRequerido(dataValidation.tipoPropuestaRequerido);
    setsubPropuestaRequerido(dataValidation.subPropuestaRequerido);
    settipoFacilidadRequerido(dataValidation.tipoFacilidadRequerido);
  }, [dataValidation]);
  function cargarDataSelect(data) {
    var defaultVal = null;
    setapplyEscrow(data?.applyEscrow);
    console.log(termOptions, data)
    try {
      if (termOptions.length > 0 && data.term) {
        defaultVal = termOptions.find(x => (x.value).toUpperCase() === (data.term).toUpperCase());
        if (defaultVal !== undefined) {
          setTerm(defaultVal);
        }
      }
      if (tipoPropuesta.length > 0 && data.proposalTypeId !== null) {
        defaultVal = tipoPropuesta.find(x => (x.value).toUpperCase() === (data.proposalTypeId).toUpperCase());
        if (defaultVal !== undefined) {
          settipoPropuestaSelect(defaultVal);
          setpropuestaSet(defaultVal)
        }
      }
      if (subPropuesta.length > 0 && data.proposalTypeName !== null) {
        defaultVal = subPropuesta.find(x => (x.value).toUpperCase() === (data.proposalTypeName).toUpperCase());
        if (defaultVal !== undefined) {
          setsubPropuestaSelect(defaultVal);
          setsubPropuestaSet(defaultVal)
        }
      }
      if (tipoFacilidad.length > 0 && data.facilityTypeId !== null) {
        defaultVal = tipoFacilidad.find(x => (x.value).toUpperCase() === (data.facilityTypeId).toUpperCase());
        if (defaultVal !== undefined) {
          settipoFacilidadSelect(defaultVal);
          settipoFacilidadSet(defaultVal)
        }
      }
      console.log(deudoresList)
      if (deudoresList.length > 0 && data.debtor !== null) {
        defaultVal = deudoresList.find(x => (x.value) === (data.debtor));
        if (defaultVal !== undefined) {
          setdeudoresListSelect(defaultVal);
        }
      }
      if (typeTerms.length > 0 && data.termType) {
        defaultVal = typeTerms.find(x => (x.value).toUpperCase() === (data.termType).toUpperCase());
        if (defaultVal !== undefined) {
          setterminosSelect(defaultVal);
        }
      }


    }

    catch (err) {
      console.log(console.error(err))
    }
  }
  React.useEffect(() => {
    cargarDataSelect(dataSet)
    // Read Api Service data
    setMontoFacilidad(dataSet.amount)

  }, [dataSet, ViewSeccion, subPropuesta]);

  var treasuryCurveCat0;
  function initializeData(dataLocation) {

    // consultarDeudores
    api.consultarDeudores(dataLocation.transactionId)
      .then((data) => {
        if (data !== null && data !== undefined) {
          let json = [];
          console.log(data)
          for (let i = 0; i < data.length; i++) {
            // json.push({ label: data[i]["name"] + " " + data[i]["name2"] + " " + data[i]["lastName"] + " " + data[i]["lastName2"], value: data[i]["personId"] })
            json.push({ label: data[i]["typePerson"] == 2 ? data[i]["name"] : (data[i]["name"] + " " + data[i]["name2"] + " " + data[i]["lastName"] + " " + data[i]["lastName2"]), value: data[i]["personId"] })
          }
          console.log("initializeData", json);
          setdeudoresListSelect(json[0])
          setdeudoresList(json)
        }
      })
      .catch((error) => {
        console.error('api error: ', error);
      });
    api.retrieveProposalType()
      .then((response) => {
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response.length; i++) {
          json.push({ label: response[i]["description"], value: response[i]["id"] })
        }
        console.log("retrieveProposalType", response)
        settipoPropuesta(json);
      })
      .catch((error) => {
        console.error('api error: ', error);
      });
    api.retrieveFacilityType()
      .then((response) => {
        console.log("retrieveFacilityType", response)
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response.length; i++) {
          if (response[i]["id"] !== "TDC") {
            json.push({ label: response[i]["description"], value: response[i]["id"] })
          }
        }
        settipoFacilidad(json);
        console.log("retrieveFacilityType", response)
      })
      .catch((error) => {
        console.error('api error: ', error);
      });
    api.retrieveSubproposalType()
      .then((response) => {
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response.length; i++) {
          json.push({ label: response[i]["description"], value: response[i]["id"] })
        }
        console.log("retrieveSubproposalType", response)
        setsubPropuesta(json);
      })
      .catch((error) => {
        console.error('api error: ', error);
      });
  }
  function soloNumeros(e, dato) {
    var teclaPulsada = window.event ? window.event.keyCode : e.which;
    var valor = document.getElementById(dato).value;
    if (teclaPulsada === 45 && valor.indexOf("-") === -1) {
      document.getElementById(dato).value = "-" + valor;
    }
    if (teclaPulsada === 13 || (teclaPulsada === 46 && valor.indexOf(".") === -1)) {
      return true;
    }
    console.log(valor);
    return /\d/.test(String.fromCharCode(teclaPulsada));

  }
  //   function handleChangeInputfrmSearch(e) {
  //     values[e.target.name] = e.target.value;
  // }


  function resetData() {
    let data = {
      "facilityNumber": "0",
      "cr": "0",
      "amount": 0,
      "debtor": "  ",
      "clientTypeId": 1,
      "customer": {
        "id": "469303-1-434018"
      },
      "balance": 0,
      "purpose": "",
      "sublimits": "",
      "proposalRate": 0,
      "noSubsidyRate": 0,
      "effectiveRate": 0,
      "feci": false,
      "termDays": 0,
      "termDescription": "",
      "ltv": 0,
      "finantialConditions": " ",
      "environmentRiskCategory": 0,
      "covenant": " ",
      "environmentRiskOpinion": " ",
      "finantialCovenant": " ",
      "legalDocumentation": "  ",
      "otherConditions": " ",
      "creditRiskOpinion": " ",
      "provision": " ",
      "proposalTypeId": "",
      "proposalTypeName": "",
      "facilityTypeId": "",
      "termType": "",
      "applyEscrow": false,
      facilityId: 0,
      t24: false,
      "requestId": dataGlobalReq ?? 0,
      "term": ""
    }
    setdataSet(data);


    setTerm(null);
    setpropuestaSet(null);
    settipoFacilidadSet(null);
    setcheckSubProp(false);
    setsubPropuestaSet(null);

    settipoPropuestaSelect(undefined);
    setsubPropuestaSelect(undefined);
    settipoFacilidadSelect(undefined);

    setPropotalRate(0)
    setTotalPropotalRate(0)


    setRateProposalTreasuryCurve({ Description: "", Code: "" })

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
  function editFacilitiesT24(data) {
    console.log("editFacilitiesT24", data);
    setIsActiveLoadingFacilities(true)
    // AA19214M07G3
    api.consultGeneralDataPropCred(locationData?.transactionId).then((resp2) => {
      if (resp2 != undefined && data !== undefined) {
        if (data.cr !== null && data.cr !== undefined && data.cr.length > 0) {
          apiCoreServices.getFacilityInfo(data.cr).then(resp => {
            setIsActiveLoadingFacilities(false)

            console.log("Data facilities", resp);
            let tmpdata = {
              "facilityNumber": "0",
              "cr": "0",
              "amount": 0,
              // "debtor": datosUsuario.personId,
              "debtor": " ",
              "clientTypeId": 1,
              "customer": {
                "id": "469303-1-434018"
              },
              "balance": data.balance,
              "purpose": "",
              "sublimits": "",
              "proposalRate": 0,
              "noSubsidyRate": 0,
              "effectiveRate": 0,
              "feci": false,
              "termDays": 0,
              "termDescription": "",
              "ltv": 0,
              "finantialConditions": " ",
              "environmentRiskCategory": 0,
              "covenant": " ",
              "environmentRiskOpinion": " ",
              "finantialCovenant": " ",
              "legalDocumentation": "  ",
              "otherConditions": " ",
              "creditRiskOpinion": " ",
              "provision": " ",
              "proposalTypeId": "MEN",
              "proposalTypeName": "",
              "facilityTypeId": "",
              "termType": "",
              "applyEscrow": false,
              facilityId: 0,
              "requestId": resp2[0]?.requestId ?? 0,
              startingAmount: data.amount,
              term: '',
              origin: "MVP"
            }
            if (resp != null || resp != undefined) {
              //data.amount = resp?.AcctBal[1]?.CurAmt?.Amt ?? 0;
              tmpdata.proposalRate = resp?.IntRateData?.IntRate ?? 0;
              tmpdata.feci = resp?.CreditAcctData?.FeciProperty ?? false;
              tmpdata.termDays = resp?.CreditAcctData?.Term?.ProposedTerm ?? "0";
              tmpdata.termDays = Number(tmpdata.termDays.length > 1 ? tmpdata.termDays.substring(0, tmpdata.termDays.length - 1) : tmpdata.termDays);
              // creamos una nueva facilidad
              console.log("tmpdata", tmpdata);
              newFacility(tmpdata);
            } else {
              setHistoryDetails(true)
              //newFacility(data)
            }
          }).catch(err => {
            console.log(err)
            setIsActiveLoadingFacilities(false)
          });
        }
        else {
          let tmpdata = {
            "facilityNumber": "0",
            "cr": "0",
            "amount": 0,
            // "debtor": datosUsuario.personId,
            "debtor": " ",
            "clientTypeId": 1,
            "customer": {
              "id": "469303-1-434018"
            },
            "balance": data.balance,
            "purpose": "",
            "sublimits": "",
            "proposalRate": 0,
            "noSubsidyRate": 0,
            "effectiveRate": 0,
            "feci": false,
            "termDays": 0,
            "termDescription": "",
            "ltv": 0,
            "finantialConditions": " ",
            "environmentRiskCategory": 0,
            "covenant": " ",
            "environmentRiskOpinion": " ",
            "finantialCovenant": " ",
            "legalDocumentation": "  ",
            "otherConditions": " ",
            "creditRiskOpinion": " ",
            "provision": " ",
            "proposalTypeId": "MEN",
            "proposalTypeName": "",
            "facilityTypeId": "",
            "termType": "",
            t24: false,
            origin: "MVP",
            "applyEscrow": false,
            facilityId: 0,
            "requestId": resp2[0]?.requestId ?? 0,
            startingAmount: data.amount,
            term: ''
          }

          /*data.amount = resp?.AcctBal[1]?.CurAmt?.Amt ?? 0;
              data.proposalRate = resp?.IntRateData?.IntRate ?? 0;
              data.feci = resp?.CreditAcctData?.FeciProperty ?? false;
              data.requestId = resp?.AcctKey?.AcctId ?? '';
              data.termDays = resp?.CreditAcctData?.Term?.ProposedTerm ?? 0;*/
          // creamos una nueva facilidad
          newFacility(tmpdata);

        }
      }

    }).catch(err => {
      console.log(err)
      setIsActiveLoadingFacilities(false)
    });

  }

  function changeRateProposal(proposalRate, termType, modelTreasuryCurve = treasuryCurveClass) {

    let treasury = modelTreasuryCurve.showTreasuryCurve({ proposalRate, termType });
    rateProposalTreasuryCurve.Description = treasury?.Description ?? 0
    rateProposalTreasuryCurve.Code = treasury?.Code ?? 0
    setRateProposalTreasuryCurve(rateProposalTreasuryCurve);
    dataReturn.proposalRate = treasury?.Description ?? 0;
    setdataReturn(dataReturn);

    // setPropotalRate(treasury?.Description ?? 0)

    setTotalPropotalRate((+currencyData.getRealPercent(document.getElementById('proposalRate')?.value ?? dataSet?.noSubsidyRate)) - (+currencyData.getRealPercent(document.getElementById('noSubsidyRate')?.value ?? dataSet?.noSubsidyRate)))
  }
  function test(x) {
    dataSet.proposalRate = x;
    setdataSet(dataSet);
    setPropotalRate(x)
  }
  return (
    <React.Fragment>
      <AvForm id="formFacilidades" className="needs-validation" onSubmit={handleSubmitFacilidad}>
        {!ViewSeccion ?
          <React.Fragment>
            {datosUsuario && locationData && dataGlobalReq != 0 ?
              <FacilityHistory setLevelAutonomy={props.setLevelAutonomy} requestId={dataGlobalReq} transactId={locationData.transactionId} editFacilitiesT24={editFacilitiesT24} mainDebtor={datosUsuario} partyId={datosUsuario.customerNumberT24} historyDetails={historyDetails} />
              : null}
            <LoadingOverlay active={isActiveLoadingFacilities} spinner text={t("WaitingPlease")}>

              <Card>
                <h5 className="card-sub-title">{t("ActualFacilityList")}</h5>
                <CardBody>
                  <Col md="12" style={{ textAlign: "right" }}>
                    <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                      newFacility();
                    }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
                  </Col>
                  <Col md="12" className="table-responsive styled-table-div">
                    <Table className="table table-striped table-hover styled-table table" >
                      <thead>
                        <tr>
                          <th>{t("Facility")}</th>
                          <th>{t("Debtor")}</th>
                          <th>{t("Facility Type")}</th>
                          <th>{t("Proposal")}</th>
                          <th>{t("ProposalRisk")}</th>
                          <th>{t("Rate")}</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataRows}
                      </tbody>
                    </Table>
                  </Col>
                </CardBody>
              </Card>
            </LoadingOverlay>
          </React.Fragment>
          : null}
        {ViewSeccion ?
          <Card>
            <CardBody>
              <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>
                <h5>{t("Facility")}</h5>
                <p className="card-title-desc"></p>
                {/* CustomerSeccion */}
                <Row className="mb-3">
                  <Col md="12">
                    <h5>{t("General Data")}</h5>
                    <Row>
                      <Col lg="4">
                        <AvGroup className="mb-3">
                          <Label htmlFor="facilityNumber">{t("Facility")} {t(" ")} {t("Number")}</Label>
                          <AvField
                            className="form-control"
                            name="facilityNumber"
                            type="text"
                            validate={{
                              number: { value: true, errorMessage: t("InvalidField") },
                            }}
                            value={dataSet.facilityIdVisible}
                            id="facilityNumber" />
                        </AvGroup>
                      </Col>
                      <Col lg="4">
                        <AvGroup className="mb-3">
                          <Label htmlFor="cr">{t("CR")}</Label>
                          <AvField
                            className="form-control"
                            name="cr"
                            value={dataSet.cr}
                            type="text"
                            id="cr" />
                        </AvGroup>
                      </Col>
                      <Col lg="4">
                        <AvGroup className="mb-3">
                          <Label htmlFor="amount">{t("Amount")}</Label>
                          {/* <CurrencyInput
                            className="form-control"
                            name="amount"
                            id="amount"
                            onChange={(event) => { setMontoFacilidad(event.value) }}
                            value={dataSet.amount} /> */}
                          <AvField
                            className="form-control"
                            name="amount"
                            type="text"
                            pattern="^[0-9,.]*$"
                            onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                            onChange={(e) => { setMontoFacilidad(e.target.value); }}
                            value={currencyData.format(dataSet?.amount ?? 1)}
                            id="amount" />
                          {+document.getElementById("amount")?.value < 0 ?
                            <p className="message-error-parrafo">{t("The amount entered must be greater than or equal to $0")}</p>
                            : null}
                        </AvGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="8">
                        <Label htmlFor="Term Type">{t("Term Type")}</Label>
                        <Select noOptionsMessage={() => ""}
                          onChange={(e) => {
                            setTerm(termOptions.find(x => x.value === e.value))
                          }}
                          options={termOptions}
                          classNamePrefix="select2-selection"
                          placeholder={t("Select")}
                          value={term}
                        />
                        {/* {campoRequeridoDeudores ?
                          <p className="message-error-parrafo">{t("Required Field")}</p>
                          : null} */}
                      </Col>
                      <Col md="4">
                        <AvGroup className="mb-3">
                          <Label htmlFor="Initial Amount">{t("Initial Amount")}</Label>
                          <AvField
                            className="form-control"
                            name="startingAmount"
                            value={currencyData.format(dataSet?.startingAmount ?? 0)}
                            pattern="^[0-9,.-]*$"
                            onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                            type="text"
                            id="startingAmount" />
                        </AvGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="8">
                        <Label htmlFor="amount">{t("Debtors")}</Label>
                        <Select noOptionsMessage={() => ""}
                          onChange={(e) => {
                            setdeudoresListSelect(deudoresList.find(x => x.value === e.value))
                          }}
                          options={deudoresList}
                          classNamePrefix="select2-selection"
                          placeholder={t("Select")}
                          value={deudoresListSelect}
                        />
                        {campoRequeridoDeudores ?
                          <p className="message-error-parrafo">{t("Required Field")}</p>
                          : null}
                      </Col>
                      <Col md="4">
                        <AvGroup className="mb-3">
                          <Label htmlFor="balance">{t("Balance")}</Label>
                          <AvField
                            className="form-control"
                            name="balance"
                            value={currencyData.format(dataSet?.balance ?? 0)}
                            pattern="^[0-9,.-]*$"
                            onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                            type="text"
                            id="balance" />
                        </AvGroup>
                      </Col>

                    </Row>
                  </Col>
                </Row>
                {/* ProposalSection */}
                <Row className="mb-3">
                  <Col md="12">
                    <h5>{t("Proposal")}</h5>
                    {/* <AvForm id="frmFacilidades" className="needs-validation" onSubmit={handleSubmitFacilidad}> */}
                    <Row>
                      <Col md="4">
                        <Label htmlFor="proposalType">{t("Proposal Type")}</Label>
                        <Select noOptionsMessage={() => ""}
                          onChange={(e) => {
                            let facilities = tipoPropuesta.find(x => x.value === e.value)
                            settipoPropuestaSelect(facilities)

                            if (facilities.value === 'RES' || facilities.value === 'REF') {
                              setcheckSubProp(true);
                            } else {
                              setcheckSubProp(false);
                            }

                            setpropuestaSet(e.value);
                            dataReturn.proposalTypeId = e.value;
                            setdataReturn(dataReturn);
                          }}
                          options={tipoPropuesta}
                          placeholder={t("Select")}
                          value={tipoPropuestaSelect}
                        />
                        {!propuestaSet ?
                          <p className="message-error-parrafo">{t("Required")}</p>
                          : null}
                      </Col>
                      <Col md="4">
                        <Label htmlFor="subproposalType">{t("SubProposal Type")}</Label>
                        <Select noOptionsMessage={() => ""}
                          onChange={(e) => {
                            setsubPropuestaSelect(subPropuesta.find(x => x.value === e.value))
                            setsubPropuestaSet(e.value);
                            dataReturn.proposalTypeName = e.value;
                            setdataReturn(dataReturn);
                          }}
                          options={subPropuesta}
                          placeholder={t("Select")}
                          value={subPropuestaSelect}
                        />
                        {/* {checkSubProp && (!subPropuestaSet ?
                          <p className="message-error-parrafo">{t("Required")}</p>
                          : null)} */}

                      </Col>
                      <Col md="4">
                        <Label htmlFor="facilityType">{t("Facility Type")}</Label>
                        <Select noOptionsMessage={() => ""}
                          onChange={(e) => {
                            settipoFacilidadSelect(tipoFacilidad.find(x => x.value === e.value))
                            settipoFacilidadSet(e.value);
                            dataReturn.facilityTypeId = e.value;
                            setdataReturn(dataReturn);
                          }}
                          options={tipoFacilidad}
                          placeholder={t("Select")}
                          value={tipoFacilidadSelect}
                        />
                        {!tipoFacilidadSet ?
                          <p className="message-error-parrafo">{t("Required")}</p>
                          : null}
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <AvGroup className="mb-3">
                          <Label htmlFor="purpose">{t("Purpose")}</Label>
                          <AvField
                            className="form-control"
                            name="purpose"
                            id="purpose"
                            // validate={{
                            //   required: { value: true, errorMessage: t("Required") }
                            // }}
                            type="textarea"
                            value={dataSet.purpose}
                            rows="4" />
                        </AvGroup>
                      </Col>
                      <Col md="6">
                        <AvGroup className="mb-3">
                          <Label htmlFor="sublimits">{t("Sub Limits")}</Label>
                          <AvField
                            className="form-control"
                            name="sublimits"
                            id="sublimits"
                            value={dataSet.sublimits}
                            type="textarea"
                            rows="4" />
                        </AvGroup></Col>
                    </Row>
                  </Col>
                </Row>
                {/* InterestRateSection */}
                <Row className="mb-3">
                  <Col md="12">
                    {/* <h5>{t("Proposed Interest Rate")}</h5> */}
                    <Row>
                      <Col md="3">
                        <AvGroup className="mb-3">
                          <Label htmlFor="proposalRate">{t("Proposed Interest Rate")}</Label>
                          <AvField
                            className="form-control"
                            name="proposalRate"
                            type="text"
                            onKeyUp={(e) => {
                              let x = currencyData.getRealPercent(e.target.value);
                              test(x);
                              e.target.value = currencyData.formatPercent(x, e);
                              setTotalPropotalRate(x - (+currencyData.getRealPercent(document.getElementById('noSubsidyRate').value)))
                            }}
                            onChange={(e) => { let x = currencyData.getRealPercent(e.target.value); parseFloat(x) > 100 ? setcampoTasa(true) : setcampoTasa(false); }}
                            id="proposalRate"
                            value={`${dataSet?.proposalRate ?? 0}%`} />
                          {campoTasa ?
                            <p className="message-error-parrafo">{t("Thepercentageexceeds100%")}</p>
                            : null}
                        </AvGroup>
                      </Col>
                      <Col md="3">
                        <AvGroup className="mb-3">
                          <Label htmlFor="noSubsidyRate">{t("Subsidy Rate")}</Label>
                          <AvField
                            className="form-control"
                            name="noSubsidyRate"
                            type="text"
                            id="noSubsidyRate"
                            value={`${currencyData.format(dataSet?.noSubsidyRate ?? 0)}%`}
                            onKeyUp={(e) => {
                              let x = currencyData.getRealPercent(e.target.value); e.target.value = currencyData.formatPercent(x, e);
                              setTotalPropotalRate(PropotalRate - x)
                            }}
                            onChange={(e) => { let x = currencyData.getRealPercent(e.target.value); parseFloat(x) > 100 ? setcampoTasa2(true) : setcampoTasa2(false); }}
                          />
                          {campoTasa2 ?
                            <p className="message-error-parrafo">{t("Thepercentageexceeds100%")}</p>
                            : null}
                        </AvGroup>
                      </Col>
                      <Col md="3">
                        <AvGroup className="mb-3">
                          <Label htmlFor="effectiveRate">{t("Total Rate")}</Label>
                          <AvField
                            className="form-control"
                            name="effectiveRate"
                            value={`${currencyData.format((parseFloat(TotalPropotalRate.toFixed(2))) ?? 0)}%`}
                            type="text"
                            id="effectiveRate"
                            onKeyUp={(e) => { let x = currencyData.getRealPercent(e.target.value); e.target.value = currencyData.formatPercent(x, e); }}
                            onChange={(e) => { let x = currencyData.getRealPercent(e.target.value); parseFloat(x) > 100 ? setcampoTasa3(true) : setcampoTasa3(false); }}
                          />
                          {campoTasa3 ?
                            <p className="message-error-parrafo">{t("Thepercentageexceeds100%")}</p>
                            : null}
                        </AvGroup>
                      </Col>
                      <Col md="3">
                        <AvGroup className="mb-3">
                          <Label htmlFor="feci">{t("FECI")}</Label>
                          <AvField id="feci"
                            className="form-control"
                            name="feci"
                            type="select"
                            value={dataSet.feci ? "true" : "false"}
                            required>
                            <option value="true">Si</option>
                            <option value="false">No</option>
                          </AvField>
                        </AvGroup>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                {/* Treasury Curve */}
                {/*
                <Row className="mb-3">
                  <Col md="12">
                    <h5>{t("Minimum Rate value according to Treasury Curve")} {rateProposalTreasuryCurve?.Description ? `${rateProposalTreasuryCurve?.Description}%` : ''}</h5>
                    {treasuryCurveMessage && <div className="text-danger">{t("For this Bank does not apply Treasury Curve")}</div>}
                    {+PropotalRate < +(rateProposalTreasuryCurve?.Description ?? 0) && <div className="text-danger">{t("Lower Proposal Rate than Treasury Curve")}</div>}
                    <Row>
                      <Col md="12">
                        <AvGroup check className="my-2">
                          <AvInput type="checkbox" defaultChecked={rateTreasuryCurve} name="rateTreasuryCurve" onChange={() => { setRateTreasuryCurve(!rateTreasuryCurve) }} />
                          <Label htmlFor="rateTreasuryCurve"> {t("Rate according to the price of the Treasury Curve")}</Label>
                        </AvGroup>
                      </Col>
                    </Row>
                    {+PropotalRate < +(rateProposalTreasuryCurve?.Description ?? 0) && <>
                      <Row>
                        <Col md="12">
                          <AvGroup className="mb-3">
                            <Label htmlFor="opinion">{t("Comment")}</Label>
                            <AvField
                              className="form-control"
                              name="treasuryCurveComment"
                              type="textarea"
                              value={dataSet?.treasuryCurveComment}
                              id="treasuryCurveComment"
                              rows="4" />
                          </AvGroup>
                        </Col>
                      </Row>
                      <AttachmentFileCore attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.PROCESS_PROPUESTACREDITO, OPTs.ACT_PROPUESTACREDITO)} />
                    </>}

                  </Col>
                </Row>
        */}
                {/* CommissionSection */}
                <Row className="mb-3">
                  <Col md="12">
                    <ComisionSeccion MontoFacilidad={MontoFacilidad} validation={dataValidation} dataSet={dataSet} items={commissions}
                      onSaveItem={handleNewCommission}
                      onDeleteItem={handleDeleteCommission} />
                  </Col>
                </Row>
                {/* TermsSection */}
                <h5>{t("Terms")}</h5>
                <Row>
                  <Col md="4">
                    <AvGroup className="mb-3">
                      <Label htmlFor="termDays">{t("Quantity")}</Label>
                      <AvField
                        className="form-control"
                        name="termDays"
                        value={dataSet.termDays}
                        onKeyUp={(e) => {
                          setProposalRate(e.target.value)
                          test(+currencyData.getRealPercent(document.getElementById('proposalRate').value));
                          changeRateProposal(e.target.value, dataSet.termType || 'DÍAS')
                        }}
                        type="text"
                        validate={{
                          number: { value: true, errorMessage: t("InvalidField") },
                        }}
                        id="termDays" />
                    </AvGroup>
                  </Col>
                  <Col md="4">
                    <AvGroup className="mb-3">
                      <Label>{t("DaysMonthsYears")}</Label>
                      <Select noOptionsMessage={() => ""}
                        onChange={(e) => {
                          setterminosSelect(typeTerms.find(x => x.value === e.value))
                          dataReturn.termType = e.value;
                          setdataReturn(dataReturn);
                          changeRateProposal(proposalRate, e.value)
                        }}
                        options={typeTerms}
                        placeholder={t("Select")}
                        value={terminosSelect}
                      />
                    </AvGroup>
                  </Col>

                  {/* <Col md="4">
                    <AvGroup className="mb-3">
                      <Label htmlFor="termDays">{t("Terms in Days/Month/Year")}</Label>
                      <AvField
                        className="form-control"
                        name="termDays"
                        value={dataSet.deadlinesDays}
                        type="text"
                        validate={{
                          number: { value: true, errorMessage: t("InvalidField") },
                        }}
                        id="termDays" />
                    </AvGroup>
                  </Col> */}
                  <Col md="12">
                    <AvGroup className="mb-3">
                      <Label htmlFor="termsDescription">{t("Terms Description")}</Label>
                      <AvField
                        className="form-control"
                        name="termDescription"
                        type="textarea"
                        id="termDescription"
                        value={dataSet.termDescription}
                        rows="4" />
                    </AvGroup>
                  </Col>
                </Row>
                {/* DisbursementSection */}
                <DisbursementSection validation={dataValidation} dataSet={dataSet} disbursementTerms={disbursementTerms}
                  onSaveDisbursementTerm={handleNewDisbursementTerm}
                  onDeleteDisbursementTerm={handleDeleteDisbursementTerm}
                  paymentPrograms={paymentPrograms}
                  onSavePaymentProgram={handleNewPaymentProgram}
                  onDeletePaymentProgram={handleDeletePaymentProgram}
                  disbursementMethods={disbursementMethods}
                  onSaveDisbursementMethod={handleNewDisbursementMethod}
                  onDeleteDisbursementMethod={handleDeleteDisbursementMethod} />
                {/* WarrantsSection */}
                <WarrantsSection ViewSeccion={ViewSeccion} validation={dataValidation} dataSet={dataSet} warrants={warrants}
                  onSaveItem={handleNewWarrant}
                  onDeleteItem={handleDeleteWarrant} />
                {/* LTV */}
                <Row>
                  <Col md="12">
                    <Row>
                      <Col md="4">
                        <Label htmlFor="relatedPart">{t("LTV")}(%)</Label>
                        <AvGroup className="mb-3">
                          <AvField
                            className="form-control"
                            name="ltv"
                            value={`${dataSet.ltv}%`}
                            type="text"
                            onKeyUp={(e) => { let x = currencyData.getRealPercent(e.target.value); e.target.value = currencyData.formatPercent(x, e); }}
                            // onChange={(e) => { let x = currencyData.getRealPercent(e.target.value); parseFloat(x) > 100 ? setcampoTasa4(true) : setcampoTasa4(false); }}
                            id="ltv" />
                          {campoTasa4 ?
                            <p className="message-error-parrafo">{t("Thepercentageexceeds100%")}</p>
                            : null}
                        </AvGroup>
                      </Col>
                      <Col md="4">
                        <Label htmlFor="relatedPart">{t("Escrow")}</Label>
                        <AvGroup check className="mb-3">
                          <Switch name="fd"
                            uncheckedIcon={<Offsymbol />}
                            checkedIcon={<OnSymbol />}
                            onColor="#007943"
                            id="check1"
                            className="form-label"
                            onChange={() => {
                              setapplyEscrow(!applyEscrow);
                            }}
                            checked={applyEscrow}
                          />
                        </AvGroup>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                {/* SuretiesSection */}
                <SuretiesSection validation={dataValidation} dataSet={dataSet} sureties={sureties}
                  onSaveItem={handleNewSurety}
                  onDeleteItem={handleDeleteSurety} />
                {/* FinancialConditionsSection */}
                <Row className="mb-3">
                  <Col md="12">
                    <h5>{t("FinancialConditions")}</h5>
                    <Row>
                      <Col md="12">
                        <AvGroup className="mb-3">

                          <AvField
                            className="form-control"
                            name="finantialConditions"
                            type="textarea"
                            value={dataSet.finantialConditions}
                            id="finantialConditions"
                            rows="4" />
                        </AvGroup>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                {/* AmbientalRiskSection */}
                <Row className="mb-3">
                  <Col md="12">
                    <h5>{t("AmbientalRisk")}</h5>
                    <Row>
                      <Col md="6">
                        <AvGroup className="mb-3">
                          <Label htmlFor="category">{t("Category")}</Label>
                          <AvField
                            className="form-control"
                            name="environmentRiskCategory"
                            type="text"
                            value={garantiaET}
                            id="environmentRiskCategory" />
                        </AvGroup>
                      </Col>
                      <Col md="6">
                        <AvGroup className="mb-3">
                          <Label htmlFor="covenant">{t("Covenant")}</Label>
                          <AvField
                            className="form-control"
                            name="covenant"
                            type="text"
                            value={dataSet.covenant}
                            id="covenant" />
                        </AvGroup>
                      </Col>
                      <Col md="12">
                        <AvGroup className="mb-3">
                          <Label htmlFor="opinion">{t("Opinion")}</Label>
                          <AvField
                            className="form-control"
                            name="environmentRiskOpinion"
                            type="textarea"
                            value={dataSet?.environmentRiskOpinion}
                            id="environmentRiskOpinion"
                            rows="4" />
                        </AvGroup>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                {/* FinantialCovenantSection */}
                <Row className="mb-3">
                  <Col md="12">
                    <h5>{t("FinantialCovenant")}</h5>
                    <Row>
                      <Col md="12">
                        <AvGroup className="mb-3">
                          <AvField
                            className="form-control"
                            name="finantialCovenant"
                            value={dataSet.finantialCovenant}
                            type="textarea"
                            id="finantialCovenant"
                            rows="4" />
                        </AvGroup>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                {/* LegalDocumentationSection */}
                <Row>
                  <Col>
                    <h5>{t("Status of Legal Documentation")}</h5>
                    <Row>
                      <Col md="12">
                        <AvGroup className="mb-3">

                          <AvField
                            className="form-control"
                            name="legalDocumentation"
                            value={dataSet.legalDocumentation}
                            type="textarea"
                            id="legalDocumentation"
                            rows="4" />
                        </AvGroup>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                {/* OtherConditionsSection */}
                <Row>
                  <Col>
                    <h5>{t("OtherConditions")}</h5>
                    <Row>
                      <Col md="12">
                        <AvGroup className="mb-3">
                          <AvField
                            className="form-control"
                            name="otherConditions"
                            value={dataSet.otherConditions}
                            type="textarea"
                            id="otherConditions"
                            rows="4" />
                        </AvGroup>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                {/* CreditRiskSection */}
                <Row>
                  <Col>
                    <h5>{t("CreditRisk")}</h5>
                    <Row>
                      <Col md="12">
                        <AvGroup className="mb-3">
                          <Label htmlFor="creditrisk">{t("Opinion")}</Label>
                          <AvField
                            className="form-control"
                            name="creditRiskOpinion"
                            type="textarea"
                            value={dataSet?.creditRiskOpinion ?? ""}
                            id="creditRiskOpinion"
                            rows="4" />
                        </AvGroup>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                {/* ProvisionSection */}
                <Row>
                  <Col>
                    <h5>{t("Provision")}</h5>
                    <Row>
                      <Col md="12">
                        <AvGroup className="mb-3">

                          <AvField
                            className="form-control"
                            name="provision"
                            value={dataSet.provision}
                            type="textarea"
                            id="provision"
                            rows="4" />
                        </AvGroup>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="my-2">
                  <Col xl="12 text-end">
                    <Button color="danger"
                      onClick={(e) => {
                        setViewSeccion(!ViewSeccion);
                        cargarFacilidades(locationData);

                        resetData()

                      }} style={{ margin: '5px' }}>
                      <i className="mdi mdi-cancel mid-12px"></i> {t("Cancel")}
                    </Button>
                    <Button className="btn btn-primary" type="submit" color="success" style={{ margin: '5px' }}>
                      {t("Save")}
                    </Button>
                  </Col>
                </Row>
              </LoadingOverlay>
            </CardBody>
          </Card>
          : null}
      </AvForm>
      {successSave_dlg ? (
        <SweetAlert
          success
          title={t("SuccessDialog")}
          confirmButtonText={t("Confirm")}
          cancelButtonText={t("Cancel")}
          onConfirm={() => {
            setsuccessSave_dlg(false);
            cargarFacilidades(locationData)
          }}
        >
          {t("SuccessSaveMessage")}
        </SweetAlert>
      ) : null}

      {error_dlg ? (
        <SweetAlert
          error
          title={t("ErrorDialog")}
          confirmButtonText={t("Confirm")}
          cancelButtonText={t("Cancel")}
          onConfirm={() => {
            seterror_dlg(false)
          }}
        >
          {error_msg}
        </SweetAlert>
      ) : null}
      {confirm_alert ? (
        <SweetAlert
          title={t("Areyousure")}
          warning
          showCancel
          confirmButtonText={t("Yesdeleteit")}
          cancelButtonText={t("Cancel")}
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          onConfirm={() => {
            setViewSeccion(!ViewSeccion);
          }}
          onCancel={() => setconfirm_alert(false)}
        >
          {t("Youwontbeabletorevertthis")}
        </SweetAlert>
      ) : null}
      {confirm_alertDelete ? (
        <SweetAlert
          title={t("Areyousure")}
          warning
          showCancel
          confirmButtonText={t("Yesdeleteit")}
          cancelButtonText={t("Cancel")}
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          onConfirm={() => {
            if (tipo == "eliminar") {
              props.setViewAutonomy(false);
              backendServices.deleteFacility(dataSet?.facilityId ?? "", dataSet?.requestId ?? "").then(resp => {
                if (resp.statusCode == "500") {
                  seterror_dlg(false)
                  setconfirm_alertDelete(false)
                } else {
                  setconfirm_alertDelete(false)
                  resetData()
                  setsuccessSave_dlg(true)
                  // props.setLevelAutonomy(levelAutonomy => levelAutonomy - (+dataSet?.amount))
                  // cargarFacilidades(locationData)
                }
                props.setViewAutonomy(true);
              }).catch(err => {
                props.setViewAutonomy(true);
              })
            }
          }
          }
          onCancel={() => setconfirm_alertDelete(false)}
        >
          {t("Youwontbeabletorevertthis")}
        </SweetAlert>
      ) : null}
    </React.Fragment>

  );
});
ListaFacilidad.propTypes = {
  items: PropTypes.array.isRequired,
  editMode: PropTypes.bool,
  onSaveFacility: PropTypes.func
};
ListaFacilidad.defaultProps = {
  items: [],
  editMode: false
};
export default ListaFacilidad;
