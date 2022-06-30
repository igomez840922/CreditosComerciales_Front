/*ReinforcedManagementReport = Lista de Informe Reforzado*/
import React, { useState } from "react"
import PropTypes from 'prop-types';
import moment from "moment";
import * as OPTs from "../../../../../helpers/options_helper"
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  CardFooter,
} from "reactstrap"


import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import Switch from "react-switch";

//i18n
import { withTranslation } from "react-i18next"
import { BackendServices, CoreServices, BpmServices, } from "../../../../../services";
import { useLocation, useHistory } from 'react-router-dom'
import { Select } from 'antd';
import { useTranslation } from "react-i18next"
import LoadingOverlay from "react-loading-overlay"
import { Tabs, Tab } from 'react-bootstrap';
import Currency from "../../../../../helpers/currency";
import ModalCreacionLinea from "./modalCreacionLinea";
import instructiveClass from './model-instructive'
import { OnlyNumber } from "../../../../../helpers/commons";
import Horarios from "./horarios";

const Offsymbol = () => {
  const { Option } = Select;
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

const S_seccions = {
  "backgroundColor": "#eee",
  "color": '#187055',
  "padding": '2px',
  "borderRadius": '2px',
  "fontSize": '18px',
  "display": 'flex',
  "justifyContent": 'center',
};

const DatosGenerales = (props) => {

  const apiServiceBackend = new BackendServices();
  const apiServiceCore = new CoreServices();
  const location = useLocation()

  const { t, i18n } = useTranslation();

  const [dataLocation, setdataLocation] = useState(location.data);
  // Variables de nuevos campos
  const [catalogoDestino, setCatalogoDestino] = useState(undefined)
  const CatalogoMetodoPago = [{ Code: "DC", Description: "Descuento directo" }, { Code: "PV", Description: "Escritura" }]


  const [subProductCatalogue, setsubProductCatalogue] = useState(undefined);
  const [branchCatalogue, setbranchCatalogue] = useState(undefined);
  const [interestPaymentCycleCatalogue, setinterestPaymentCycleCatalogue] = useState(undefined);
  const [capitalPaymentCycleCatalogue, setcapitalPaymentCycleCatalogue] = useState(undefined);
  const [destinyCountryCatalogue, setdestinyCountryCatalogue] = useState(undefined);
  const [provinceCatalogue, setprovinceCatalogue] = useState([]);
  const [activityTypeCatalogue, setactivityTypeCatalogue] = useState(undefined);
  //const [cinuActivityCatalogue, setcinuActivityCatalogue] = useState(undefined);

  const [creditAccount, setcreditAccount] = useState(false);
  const [checker, setchecker] = useState(false);
  const [transfer, settransfer] = useState(false);
  const [others, setothers] = useState(false);

  const [province, setprovince] = useState(null);

  const [othersAmount, setothersAmount] = useState(0);
  const [transferAmount, settransferAmount] = useState(0);
  const [checkAmount, setcheckAmount] = useState(0);
  const [creditAccountAmount, setcreditAccountAmount] = useState(0);
  const [disbursementTotalAmount, setdisbursementTotalAmount] = useState(0);

  const [modalCreacionLinea, setmodalCreacionLinea] = useState(false);


  const [DataGeneral, setDataGeneral] = useState(undefined);

  const [isActiveLoading, setIsActiveLoading] = useState(false);

  const currencyData = new Currency();


  const [catalogoTipoDesembolso, setCatalogoTipoDesembolso] = useState(undefined)

  const [proposalType, setProposalType] = useState(undefined)
  const [facilityType, setFacilityType] = useState(undefined);
  const [products, setProducts] = useState(undefined);
  const [typeTerms, setTypeTerms] = useState(undefined);
  const [sourceSales, setSourceSales] = useState(undefined)
  const [autonomy, setAutonomy] = useState(undefined)
  const [masterLine, setmasterLine] = useState(null)
  const [masterLineSelect, setmasterLineSelect] = useState(null)
  const [authorityType, setAuthorityType] = useState(undefined)

  const [dpfRate, setDpfRate] = useState(false);
  const [spreadRate, setSpreadRate] = useState(false);
  const [totalRate, setTotalRate] = useState(false);
  const [interestRate, setInterestRate] = useState(false);
  const [action, setAction] = useState(undefined);
  const [validationSelects, setvalidationSelects] = useState(false);
  const [disabledmonthlyLetterAmount, setdisabledmonthlyLetterAmount] = useState(false);
  const [subactividadEconomicaSet, setsubactividadEconomicaSet] = useState({ Description: "", Code: "" });
  const [subactivityTypeCatalogue, setsubactivityTypeCatalogue] = useState(undefined);
  React.useEffect(() => {
    setvalidationSelects(false)
    setDataGeneral(undefined);
    setsubactivityTypeCatalogue(undefined)
    setCatalogoTipoDesembolso(undefined)
    setFacilityType(undefined)
    setProposalType(undefined)
    setbranchCatalogue(undefined)
    setProducts(undefined)
    setsubProductCatalogue(undefined)
    setTypeTerms(undefined)
    setinterestPaymentCycleCatalogue(undefined)
    setcapitalPaymentCycleCatalogue(undefined)
    setcapitalPaymentCycleCatalogue(undefined)
    setprovinceCatalogue(undefined)
    //setcinuActivityCatalogue(undefined)
    setactivityTypeCatalogue(undefined)
    setSourceSales(undefined)
    setCatalogoDestino(undefined)
    setAutonomy(undefined)
    setAuthorityType(undefined)

    setdestinyCountryCatalogue(undefined)
    setactivityTypeCatalogue(undefined)

    setothersAmount(0)
    settransferAmount(0)
    setcheckAmount(0)
    setcreditAccountAmount(0)

    setcreditAccount(creditAccount);
    setchecker(checker);
    settransfer(transfer);
    setothers(others);

    setIsActiveLoading(true);


    let dataSession;
    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
        location.data.transactionId = 0;
      }
      else {
        sessionStorage.setItem('locationData', JSON.stringify(location.data));
        setdataLocation(location.data);
        dataSession = location.data
      }
    }
    else {
      //chequeamos si tenemos guardado en session
      var result = sessionStorage.getItem('locationData');
      if (result !== undefined && result !== null) {
        result = JSON.parse(result);
        setdataLocation(result);
        dataSession = result
      }
    }
    apiServiceBackend.getCreditLine(dataSession?.transactionId, dataSession?.facilityId ?? 0).then(lineasCredito=>{
      if (lineasCredito!=undefined) {
        lineasCredito.creditLine.push({ numeroLinea: "Ninguna", idLineaSec: "" })
      } else {
        let lineasCredito1 = { creditLine: [{ numeroLinea: "Ninguna", idLineaSec: "" }] };
        lineasCredito=lineasCredito1
      }
      setmasterLine(lineasCredito.creditLine)
    })

    Promise.allSettled([
      apiServiceBackend.getDisbursementInstructiveByFacility(dataSession.transactionId, props.facilityId),
      loadDestinyCountry(dataSession),
      loadEconomicActivity(),
      loadInterestPayment(),
      loadCapitalPaymentCycle(),
      apiServiceBackend.retrieveProposalType(),
      apiServiceBackend.retrieveFacilityType(),
      loadProduct(),
      apiServiceBackend.consultarDeudores(dataSession?.transactionId),
      apiServiceBackend.consultGeneralDataPropCred(dataSession?.transactionId ?? 0),
      apiServiceBackend.consultGeneralDataIGR(dataSession.transactionId),
      apiServiceCore.getSucursalesCatalogo(),
      apiServiceCore.getSourceSalesCatalogo(),
      apiServiceCore.getAutonomiaCatalogo(),
      apiServiceCore.getAuthorityTypeCatalogo(),
      loadSubProduct(),
    ]).then(async resp => {
      const [
        { value: Instructive },
        { value: destinyCountryCatalogue },
        { value: activityTypeCatalogue },
        { value: interestPaymentCycleCatalogue },
        { value: capitalPaymentCycleCatalogue },
        { value: tipoPropuestaService },
        { value: tipoFacilidadService },
        { value: productsService },
        { value: allDebtors },
        { value: proposalDetail },
        { value: igrDetail },
        { value: branch },
        { value: sourceSales },
        { value: allAutonomy },
        { value: allAuthorityType },
        { value: allSubProducts },
      ] = resp;
      

      let instructiveService = Instructive ?? {};
      let instructiveProps = props.facilityType;
      let instructiveReal = { ...instructiveService, ...instructiveProps }
      let debtor = allDebtors?.find(debtor => +debtor.personId === +instructiveProps.debtor)
      let porposal = proposalDetail[0];

      instructiveReal = {
        ...instructiveReal,
        clientNumber: debtor.customerNumberT24,
        clientName: debtor.typePerson === '2' ? debtor.name : `${debtor.name} ${debtor.name2} ${debtor.lastName} ${debtor.lastName2}`,
        countryDesc: porposal.countryRisk,
        economicActivityTypeCode: igrDetail.economicActivity.code,
        economicActivityTypeDesc: igrDetail.economicActivity.name,
        transactId: dataSession?.transactionId,
        // feci: instructiveService?.feci,
        pawn: instructiveService?.pawn,
      }
      if (instructiveReal.provinceDesc?.split("*")) {
        setsubactividadEconomicaSet({ Code: instructiveReal.provinceDesc?.split("*")[1] ?? "", Description: instructiveReal.provinceDesc?.split("*")[2] ?? "" })
        instructiveReal.provinceDesc = instructiveReal.provinceDesc?.split("*")[0]
      }
      instructiveReal.countryDesc && loadProvince(destinyCountryCatalogue?.find(country => country.Description === instructiveReal.countryDesc).Code);
      props.setDisbursementInstructionNumber(instructiveReal.disbursementInstructionNumber)
      console.log("🚀 ~ file: DatosGenerales.js ~ line 266 ~ React.useEffect ~ instructiveReal", instructiveReal)
      setDataGeneral(new instructiveClass(instructiveReal));
      if (tipoPropuestaService != null) {
        let json = [];
        for (let i = 0; i < tipoPropuestaService.length; i++) {
          json.push({ Description: tipoPropuestaService[i]["description"], Code: tipoPropuestaService[i]["id"] })
        }
        setProposalType(json);
      }
      if (tipoFacilidadService != null) {
        let json = [];
        for (let i = 0; i < tipoFacilidadService.length; i++) {
          json.push({ Description: tipoFacilidadService[i]["description"], Code: tipoFacilidadService[i]["id"] })
        }
        setFacilityType(json);
      }

      setAuthorityType(allAuthorityType?.Records);
      setAutonomy(allAutonomy?.Records);
      setSourceSales(sourceSales?.Records)
      setbranchCatalogue(branch?.Records)
      setProducts(productsService?.map(products => ({ Description: products.DESCRIPCION, Code: products.CODIGO })));
      setdestinyCountryCatalogue(destinyCountryCatalogue);
      setactivityTypeCatalogue(activityTypeCatalogue)
      setinterestPaymentCycleCatalogue(interestPaymentCycleCatalogue);
      setcapitalPaymentCycleCatalogue(capitalPaymentCycleCatalogue);
      setsubProductCatalogue(allSubProducts);

      setcreditAccount(Instructive?.disbursementFormAccountAmount != 0 || Instructive?.disbursementFormAccountAmount != "" ? true : false)
      setchecker(Instructive?.disbursementFormCheckAmount != 0 || Instructive?.disbursementFormCheckAmount != "" ? true : false)
      settransfer(Instructive?.disbursementFormTransferAmount != 0 || Instructive?.disbursementFormTransferAmount != "" ? true : false)
      setothers(Instructive?.disbursementFormOtherAmount != 0 || Instructive?.disbursementFormOtherAmount != "" ? true : false)
      setmasterLineSelect(Instructive?.masterLineNumber)
      setTypeTerms([{ Code: t("Days"), Description: t("Days") }, { Code: t("Month"), Description: t("Months") }, { Code: t("Year"), Description: t("Years") }])
      setCatalogoTipoDesembolso([{ Code: "100", Description: "Comercial" }, { Code: "200", Description: "Bajo Linea" }])
      //setcinuActivityCatalogue([{ Code: 'Si', Description: 'Si' }, { Code: 'No', Description: 'No' }])
      setCatalogoDestino([{ Code: "LOCAL", Description: "LOCAL" }, { Code: "EXTRANJERO", Description: "EXTRANJERO" }])
      loadSubActivity(instructiveReal.economicActivityTypeCode)
      setvalidationSelects(true)

      setIsActiveLoading(false);
    }).catch(err => {
      alert()

      setvalidationSelects(true)
      setIsActiveLoading(false);
    });

    // setErrorValidate({
    //   campoRequeridoSubcursal,
    // });
  }, [props.facilityId]);


  React.useEffect(() => {
    sumdisbursementTotalAmount()
  }, [othersAmount, transferAmount, checkAmount, creditAccountAmount, creditAccount, checker, transfer, others]);

  React.useEffect(() => {
    loadProvince(province);
  }, [province]);

  React.useEffect(() => {
    parseFloat(DataGeneral?.spreadRate + DataGeneral?.dpfRate) > 100 ? setTotalRate(true) : setTotalRate(false);
    setDataGeneral({ ...DataGeneral, totalRate: DataGeneral?.spreadRate + DataGeneral?.dpfRate })
  }, [DataGeneral?.spreadRate, DataGeneral?.dpfRate]);

  React.useEffect(() => {
    props.disbursementInstructionNumber && setDataGeneral({ ...DataGeneral, disbursementInstructionNumber: props.disbursementInstructionNumber })
  }, [props.disbursementInstructionNumber]);

  function loadProduct() {
    return new Promise((resolve, reject) => {
      apiServiceCore.getProductCatalog().then(data => {
        resolve(data?.records)
      }).catch((error) => {
        resolve()
      });
    });
  }
  function loadSubProduct() {
    return new Promise((resolve, reject) => {
      apiServiceCore.getSubProductCatalog().then(data => {
        resolve(data?.Records)
      }).catch((error) => {
        resolve()
      });
    });
  }
  function loadSubActivity(codActividad) {
    apiServiceCore.getSubActividadEconomicaCatalogo(codActividad).then(response => {
      setsubactivityTypeCatalogue(response?.Records);
    })
  }
  function loadEconomicActivity() {
    return new Promise((resolve, reject) => {
      const api = new CoreServices();
      api.getActividadEconomicaCatalogo().then(data => {
        resolve(data?.Records);
      }).catch(err => {
        resolve();
      });
    })
  }

  function loadDestinyCountry(dataSession) {
    return new Promise(async (resolve, reject) => {
      DataGeneral?.destinyCountry && await loadProvince(DataGeneral?.destinyCountry);
      apiServiceCore.getPaisesCatalogo(dataSession.transactionId).then(data => {
        resolve(data?.Records);
      }).catch((error) => {
        resolve();
      });
    })
  }

  function loadProvince(code, province2 = "") {
    return new Promise((resolve, reject) => {
      apiServiceCore.getProvinciasCatalogo(code).then(data => {
        resolve(data?.Records);
        setprovinceCatalogue(data?.Records);
      }).catch((error) => {
        resolve();
      });
    })
  }

  function loadInterestPayment() {
    return new Promise((resolve, reject) => {
      apiServiceBackend.retrieveInterestPaymentCycle().then(data => {
        data = data?.map(InterestPaymentCycle => ({ Code: InterestPaymentCycle.id, Description: InterestPaymentCycle.description }))
        resolve(data);
      }).catch((error) => {
        resolve();
      });
    })
  }

  function loadCapitalPaymentCycle() {
    return new Promise((resolve, reject) => {
      apiServiceBackend.retrieveCapitalPaymentCycle().then(data => {
        data = data?.map(CapitalPaymentCycle => ({ Code: CapitalPaymentCycle.id, Description: CapitalPaymentCycle.description }))
        resolve(data);
      }).catch((error) => {
        resolve();
      });
    })
  }

  function sumdisbursementTotalAmount() {
    let othersAmount1 = parseFloat(document.getElementById("disbursementFormOtherAmount") ? currencyData.getRealValue(document.getElementById("disbursementFormOtherAmount").value) : 0);
    let transferAmount1 = parseFloat(document.getElementById("disbursementFormTransferAmount") ? currencyData.getRealValue(document.getElementById("disbursementFormTransferAmount").value) : 0);
    let checkAmount1 = parseFloat(document.getElementById("disbursementFormCheckAmount") ? currencyData.getRealValue(document.getElementById("disbursementFormCheckAmount").value) : 0);
    let creditAccountAmount1 = parseFloat(document.getElementById("disbursementFormAccountAmount") ? currencyData.getRealValue(document.getElementById("disbursementFormAccountAmount").value) : 0);
    setdisbursementTotalAmount(currencyData.format(((isNaN(+othersAmount1) || !others ? 0 : +othersAmount1) ?? 0) + ((isNaN(+transferAmount1) || !transfer ? 0 : +transferAmount1) ?? 0) + ((isNaN(+checkAmount1) || !checker ? 0 : +checkAmount1) ?? 0) + ((isNaN(+creditAccountAmount1) || !creditAccount ? 0 : +creditAccountAmount1) ?? 0)));
  }

  async function handleSubmit(event, errors, values) {
    event.preventDefault();
    let datos = { ...DataGeneral };
    datos.disbursementComisionDesc = values.disbursementComisionDesc ?? ' ';
    datos.dpfSavingsCheckingAccount = values.dpfSavingsCheckingAccount ?? ' ';
    datos.debitAccountClientNumber = values.debitAccountClientNumber ?? ' ';
    datos.disbursementFormAccountNumber = values.disbursementFormAccountNumber ?? ' ';
    datos.disbursementFormAccountName = values.disbursementFormAccountName ?? ' ';
    datos.disbursementFormCheckNumber = values.disbursementFormCheckNumber ?? ' ';
    datos.disbursementFormCheckName = values.disbursementFormCheckName ?? ' ';
    datos.disbursementFormTransferNumber = values.disbursementFormTransferNumber ?? ' ';
    datos.disbursementFormTransferName = values.disbursementFormTransferName ?? ' ';
    datos.disbursementFormOtherNumber = values.disbursementFormOtherNumber ?? ' ';
    datos.disbursementFormOtherName = values.disbursementFormOtherName ?? ' ';
    datos.cppNumber = values.cppNumber ?? ' ';
    datos.cppBeneficiary = values.cppBeneficiary ?? ' ';
    datos.disbursementDetailDescription = values.disbursementDetailDescription ?? ' ';
    datos.bankEspecialInstructions = values.bankEspecialInstructions ?? ' ';
    datos.adminAditionalComments = values.adminAditionalComments ?? ' ';
    datos.operationalLeasNumber = values.operationalLeasNumber ?? ' ';
    datos.checkNumber = values.checkNumber ?? ' ';
    datos.originationRef = values.originationRef ?? ' ';
    datos.an = values.an ?? ' '
    datos.saleChannel = values.saleChannel ?? ' '
    datos.masterLineNumber = masterLineSelect
    datos.cinuActivityTypeCode = values.cinuActivityTypeCode ?? ' '
    datos.cinuActivityTypeDesc = values.cinuActivityTypeDesc ?? ' '
    datos.provinceDesc = datos.provinceDesc + "*" + subactividadEconomicaSet.Code + "*" + subactividadEconomicaSet.Description
    datos.subctivityCode = subactividadEconomicaSet.Code
    // datos.totalLetterIncludingfiduciaryCommission = values.totalLetterIncludingfiduciaryCommission ?? 0
    datos.disbursementTerm = values.disbursementTerm ?? 0

    // return;
    if (errors.length > 0 || dpfRate || totalRate || interestRate || spreadRate) {
      return;
    }

    setIsActiveLoading(true);
    props.onSaveProcess(4, datos).then(resp => {
      setIsActiveLoading(false);
    });

    //onSubmit(values);
  }

  function check(e) {
    let tecla = (document.all) ? e.keyCode : e.which;
    //Tecla de retroceso para borrar, siempre la permite
    if (tecla == 45) {
      e.preventDefault();
      return true;
    }

    return false;
  }
  function cerrarModalLinea() {
    setmodalCreacionLinea(false);
    removeBodyCss()
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  return (

    <React.Fragment>


      <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit} autoComplete="off">
        <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>

          <Row>
            <Col md="12">
              {/* <span className="mb-3" style={S_seccions}>{t("GeneralData")}</span> */}

              <Row>
                <Col md="4">
                  <div className="mb-4">
                    <Label>{t("Tipo de Prestamo Comercial")}</Label>

                    {validationSelects && <Select disabled={props.adminDesembolso} noOptionsMessage={() => ""}
                      style={{ width: "100%" }}
                      optionFilterProp="children"
                      defaultValue={JSON.stringify(catalogoTipoDesembolso?.find(tipoDesembolso => +tipoDesembolso.Code === +DataGeneral?.loandTypeCode))}
                      onChange={(e) => {
                        let loan = JSON.parse(e);
                        setDataGeneral({ ...DataGeneral, loandTypeCode: loan.Code, loandTypeDesc: loan.Description })
                      }}
                      filterOption={(input, option) =>
                        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {catalogoTipoDesembolso?.length > 0 ?
                        catalogoTipoDesembolso?.map((item, index) => (
                          <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                        ))
                        : null}
                    </Select>}
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-4">
                    <Label htmlFor="masterLineNumber">{t("Numero de Linea Master")}</Label>
                    {/* <AvField disabled={props.adminDesembolso}
                      style={{ width: "100%" }}
                      className="form-control"
                      name="masterLineNumber"
                      type="text"
                      id="masterLineNumber"
                      value={DataGeneral?.masterLineNumber}
                    /> */}
                    {validationSelects && <Select disabled={props.adminDesembolso} noOptionsMessage={() => ""}
                      style={{ width: "100%" }}
                      optionFilterProp="children"
                      defaultValue={masterLineSelect}
                      onChange={(e) => {
                        setmasterLineSelect(e)
                      }}
                      filterOption={(input, option) =>
                        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {masterLine?.length > 0 ?
                        masterLine?.map((item, index) => (
                          <Option key={index} value={item.idLineaSec}>{item.numeroLinea}</Option>
                        ))
                        : null}
                    </Select>}
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="disbursementInstructionNumber">{t("Número del Instructivo")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="disbursementInstructionNumber"
                      type="text"
                      id="disbursementInstructionNumber"
                      value={DataGeneral?.disbursementInstructionNumber} />
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="disbursementDate">{t("Fecha del Instructivo")}</Label>
                    <Flatpickr disabled={props.adminDesembolso}
                      id="disbursementDate"
                      name="disbursementDate"
                      className="form-control d-block"
                      placeholder={OPTs.FORMAT_DATE_SHOW}
                      options={{
                        dateFormat: OPTs.FORMAT_DATE,
                        //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                        defaultDate: DataGeneral !== undefined && DataGeneral !== null ? new Date(moment(DataGeneral?.disbursementDate, 'YYYY-MM-DD').format()) : new Date()
                      }}
                      onChange={(selectedDates, dateStr, instance) => {
                        setDataGeneral({ ...DataGeneral, disbursementDate: moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD") })
                      }
                      }
                    />
                  </div>
                </Col>

                <Col md="4">
                  <Row>
                    <Col md="12">
                      <Label htmlFor="transactId ">{t("Número de Trámite de Desembolso")}</Label>
                      <AvField disabled={props.adminDesembolso}
                        className="form-control"
                        name="transactId "
                        type="text"
                        value={DataGeneral?.transactId}
                      />

                    </Col>
                  </Row>
                </Col>

                <Col md="4">
                  <Row>
                    <Col md="12">
                      <Label htmlFor="facilityNumber ">{t("Número de la Facilidad")}</Label>
                      <AvField disabled={props.adminDesembolso}
                        className="form-control"
                        name="facilityNumber "
                        type="text"
                        readOnly={true}
                        value={DataGeneral?.facilityNumber}
                      />

                    </Col>
                  </Row>
                </Col>


                <Col md="4">
                  <div className="mb-4">
                    <Label htmlFor="clientNumber ">{t("Numero Cliente")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="clientNumber "
                      type="text"
                      value={DataGeneral?.clientNumber}
                    />
                  </div>

                </Col>

                <Col md="4">
                  <div className="mb-4">
                    <Label htmlFor="clientName ">{t("Nombre del Cliente Deudor")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="clientName "
                      type="text"
                      readOnly={true}
                      value={DataGeneral?.clientName}
                    />
                  </div>

                </Col>
                <Col md="4">
                  <div className="mb-4">
                  </div>

                </Col>

                <Col md="4">
                  <div className="mb-4">
                    <Label htmlFor="facilityType">{t("Facility Type")}</Label>

                    {facilityType != null ?
                      <Select disabled={props.adminDesembolso} noOptionsMessage={() => ""}
                        style={{ width: "100%" }}
                        placeholder={t("Select")}
                        optionFilterProp="children"
                        defaultValue={JSON.stringify(facilityType?.find(facility => facility.Code === DataGeneral?.facilityTypeCode))}
                        onChange={(e) => {
                          let facility = JSON.parse(e)
                          setDataGeneral({ ...DataGeneral, facilityTypeCode: facility.Code, facilityTypeDesc: facility.Description })
                        }}
                        filterOption={(input, option) =>
                          option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {facilityType?.length > 0 ?

                          facilityType?.map((item, index) => (
                            <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                          ))
                          : null}
                      </Select>
                      : null}
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-4">
                    <Label htmlFor="proposalType">{t("Proposal Type")}</Label>
                    {proposalType != null ?
                      <Select disabled={props.adminDesembolso} noOptionsMessage={() => ""}
                        style={{ width: "100%" }}
                        placeholder={t("Select")}
                        optionFilterProp="children"
                        defaultValue={JSON.stringify(proposalType?.find(porposal => porposal.Code === DataGeneral?.proposalTypeCode))}
                        onChange={(e) => {
                          let porposal = JSON.parse(e);
                          setDataGeneral({ ...DataGeneral, proposalTypeCode: porposal.Code, proposalTypeDesc: porposal.Description })
                        }}
                        filterOption={(input, option) =>
                          option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {proposalType?.length > 0 ?

                          proposalType?.map((item, index) => (
                            <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                          ))
                          : null}
                      </Select>
                      : null}
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-4">
                    <Label>{t("Sucursal")}</Label>
                    {branchCatalogue != null ? <Select disabled={props.adminDesembolso} noOptionsMessage={() => ""}
                      style={{ width: "100%" }}
                      placeholder={t("Select")}
                      optionFilterProp="children"
                      defaultValue={DataGeneral?.branchDesc}
                      onChange={(e) => {
                        let branch = JSON.parse(e)
                        setDataGeneral({ ...DataGeneral, branchCode: branch.Code, branchDesc: branch.Description })
                      }}
                      filterOption={(input, option) =>
                        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {branchCatalogue && branchCatalogue?.length > 0 ?

                        branchCatalogue?.map((item, index) => (
                          <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                        ))
                        : null}
                    </Select> : null}
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="saleChannel">{t("Canal de Venta")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="saleChannel"
                      type="text"
                      id="saleChannel"
                      value={DataGeneral?.saleChannel} />
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="dutyFree">{t("Destino Final del Desembolso Zona Libre?")}</Label>
                    <AvGroup check className="">
                      <Switch name="preapproval" disabled={props.adminDesembolso}
                        uncheckedIcon={<Offsymbol />}
                        checkedIcon={<OnSymbol />}
                        onColor="#007943"
                        className="form-label"
                        onChange={(e) => {
                          setDataGeneral({ ...DataGeneral, disbursementFinalDestinyFreeZone: !DataGeneral?.disbursementFinalDestinyFreeZone })
                        }}
                        checked={DataGeneral?.disbursementFinalDestinyFreeZone}
                      />
                    </AvGroup>
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="disbursementApprovedAmount">{t("Monto a Desembolsar")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="disbursementApprovedAmount"
                      type="text"
                      id="disbursementApprovedAmount"
                      onChange={(e) => { return check(e) }}
                      pattern="^[0-9,.]*$"
                      onKeyUp={(e) => {
                        let x = currencyData.getRealValue(e.target.value);
                        e.target.value = currencyData.format(x);
                        setDataGeneral({ ...DataGeneral, disbursementApprovedAmount: x || 0 })
                      }}
                      value={currencyData.format(DataGeneral?.disbursementApprovedAmount ?? 0)}
                    />
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="authType">{t("Tiene Adelanto")}</Label>
                    <AvGroup check className="">
                      <Switch name="preapproval" disabled={props.adminDesembolso}
                        uncheckedIcon={<Offsymbol />}
                        checkedIcon={<OnSymbol />}
                        onColor="#007943"
                        className="form-label"
                        onChange={(e) => {
                          setDataGeneral({ ...DataGeneral, advancement: !DataGeneral?.advancement })
                        }}
                        checked={DataGeneral?.advancement}
                      />
                    </AvGroup>
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="advancementAmount">{t("Monto del Adelanto")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="advancementAmount"
                      type="text"
                      id="advancementAmount"
                      onChange={(e) => { return check(e) }}
                      pattern="^[0-9,.]*$"
                      onKeyUp={(e) => {
                        let x = currencyData.getRealValue(e.target.value);
                        e.target.value = currencyData.format(x);
                        setDataGeneral({ ...DataGeneral, advancementAmount: x || 0 })
                      }}
                      value={currencyData.format(DataGeneral?.advancementAmount ?? 0)} />
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-4">
                    <Label>{t("Producto")}</Label>

                    {validationSelects && <Select disabled={props.adminDesembolso} noOptionsMessage={() => ""}
                      style={{ width: "100%" }}
                      optionFilterProp="children"
                      defaultValue={JSON.stringify(products?.find(product => product.Code === DataGeneral?.productTypeCode))}
                      onChange={(e) => {
                        let products = JSON.parse(e);
                        setDataGeneral({ ...DataGeneral, productTypeCode: products.Code, productTypeDesc: products.Description })
                      }}
                      filterOption={(input, option) =>
                        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {products?.length > 0 ?

                        products?.map((item, index) => (
                          <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                        ))
                        : null}
                    </Select>}
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-4">
                    <Label>{t("SubProducto")}</Label>
                    {subProductCatalogue != null ?
                      <Select disabled={props.adminDesembolso} noOptionsMessage={() => ""}
                        style={{ width: "100%" }}
                        optionFilterProp="children"
                        defaultValue={DataGeneral?.subProductTypeDesc}
                        onChange={(e) => {
                          let subProduct = JSON.parse(e)
                          setDataGeneral({ ...DataGeneral, subProductTypeCode: subProduct.Code, subProductTypeDesc: subProduct.Description });
                        }}
                        filterOption={(input, option) =>
                          option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {subProductCatalogue && subProductCatalogue?.length > 0 ?

                          subProductCatalogue?.map((item, index) => (
                            <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                          ))
                          : null}
                      </Select> : null}
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="disbursementComisionDesc">{t("Comisión del Desembolso")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="disbursementComisionDesc"
                      type="text"
                      id="disbursementComisionDesc"
                      value={DataGeneral?.disbursementComisionDesc} />
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="disbursementComisionAmount">{t("Monto de Comisión del Desembolso")}</Label>
                    <AvField disabled={!props.adminDesembolso || props?.ejecutivoDesembolso == true}
                      className="form-control"
                      name="disbursementComisionAmount"
                      type="text"
                      onChange={(e) => { return check(e) }}
                      pattern="^[0-9,.]*$"
                      onKeyUp={(e) => {
                        let x = currencyData.getRealValue(e.target.value);
                        e.target.value = currencyData.format(x);
                        setDataGeneral({ ...DataGeneral, disbursementComisionAmount: x || 0 })
                      }}
                      value={currencyData.format(DataGeneral?.disbursementComisionAmount ?? 0)} />
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="disbursementItbms">{t("ITBMS")}</Label>
                    <AvField disabled={!props.adminDesembolso || props?.ejecutivoDesembolso == true}
                      className="form-control"
                      name="disbursementItbms"
                      type="text"
                      onChange={(e) => { return check(e) }}
                      pattern="^[0-9,.]*$"
                      onKeyUp={(e) => {
                        let x = currencyData.getRealValue(e.target.value);
                        e.target.value = currencyData.format(x);
                        setDataGeneral({ ...DataGeneral, disbursementItbms: x || 0 })
                      }}
                      value={currencyData.format(DataGeneral?.disbursementItbms ?? 0)} />
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="authType">{t("Diferir")}</Label>
                    <AvGroup check className="">
                      <Switch name="preapproval" disabled={!props.adminDesembolso || props?.ejecutivoDesembolso == true}
                        uncheckedIcon={<Offsymbol />}
                        checkedIcon={<OnSymbol />}
                        onColor="#007943"
                        className="form-label"
                        onChange={(e) => {
                          setDataGeneral({ ...DataGeneral, differ: !DataGeneral?.differ })
                        }}
                        checked={DataGeneral?.differ}
                      />
                    </AvGroup>
                  </div>
                </Col>

              </Row>
              <Row>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="authType">{t("Prendario")}</Label>
                    <AvGroup check className="">
                      <Switch name="preapproval" disabled={props.adminDesembolso}
                        uncheckedIcon={<Offsymbol />}
                        checkedIcon={<OnSymbol />}
                        onColor="#007943"
                        className="form-label"
                        onChange={(e) => {
                          setDataGeneral({ ...DataGeneral, pawn: !DataGeneral?.pawn })
                        }}
                        checked={DataGeneral?.pawn}
                      />
                    </AvGroup>
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="dpfSavingsCheckingAccount">{t("DPF/Ahorro/# Cta Corriente")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="dpfSavingsCheckingAccount"
                      type="text"
                      value={DataGeneral?.dpfSavingsCheckingAccount} />
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="an">{t("A/N")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="an"
                      type="text"
                      value={DataGeneral?.an} />
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="pledgeAmount">{t("Monto a Pignorar")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="pledgeAmount"
                      type="text"
                      onChange={(e) => { return check(e) }}
                      pattern="^[0-9,.]*$"
                      onKeyUp={(e) => {
                        let x = currencyData.getRealValue(e.target.value);
                        e.target.value = currencyData.format(x);
                        setDataGeneral({ ...DataGeneral, pledgeAmount: x || 0 })
                      }}
                      value={currencyData.format(DataGeneral?.pledgeAmount ?? 0)} />
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="authType">{t("Tasa Indexada")}</Label>
                    <AvGroup check className="">
                      <Switch name="preapproval" disabled={props.adminDesembolso}
                        uncheckedIcon={<Offsymbol />}
                        checkedIcon={<OnSymbol />}
                        onColor="#007943"
                        className="form-label"
                        onChange={(e) => {
                          setDataGeneral({ ...DataGeneral, indexRate: !DataGeneral?.indexRate })
                        }}
                        checked={DataGeneral?.indexRate}
                      />
                    </AvGroup>
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="dpfRate">{t("Tasa del DPF")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="dpfRate"
                      type="text"
                      onKeyUp={(e) => {
                        let x = currencyData.getRealPercent(e.target.value);
                        e.target.value = currencyData.formatPercent(x || 0, e);
                      }}
                      onChange={(e) => {
                        let dpfRate = +currencyData.getRealPercent(e.target.value || 0);
                        parseFloat(dpfRate) > 100 ? setDpfRate(true) : setDpfRate(false);
                        setDataGeneral({ ...DataGeneral, dpfRate });
                      }}
                      value={`${DataGeneral?.dpfRate ?? 0}%`} />
                    {dpfRate ?
                      <p className="message-error-parrafo">{t("Thepercentageexceeds100%")}</p>
                      : null}
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="spreadRate">{t("Tasa Spread")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="spreadRate"
                      type="text"
                      onKeyUp={(e) => {
                        let x = currencyData.getRealPercent(e.target.value);
                        e.target.value = currencyData.formatPercent(x || 0, e);
                      }}
                      onChange={(e) => {
                        let spreadRate = +currencyData.getRealPercent(e.target.value || 0);
                        parseFloat(spreadRate) > 100 ? setSpreadRate(true) : setSpreadRate(false);
                        setDataGeneral({ ...DataGeneral, spreadRate });
                      }}
                      value={`${DataGeneral?.spreadRate}%`} />
                    {spreadRate ?
                      <p className="message-error-parrafo">{t("Thepercentageexceeds100%")}</p>
                      : null}
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="totalRate">{t("Tasa Total")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="totalRate"
                      type="text"
                      onKeyUp={(e) => {
                        let x = currencyData.getRealPercent(e.target.value);
                        e.target.value = currencyData.formatPercent(x || 0, e);
                      }}
                      onChange={(e) => {
                        let totalRate = +currencyData.getRealPercent(e.target.value || 0);
                        parseFloat(totalRate) > 100 ? setTotalRate(true) : setTotalRate(false);
                        setDataGeneral({ ...DataGeneral, totalRate });
                      }}
                      value={`${DataGeneral?.totalRate ?? 0}%`} />
                    {totalRate ?
                      <p className="message-error-parrafo">{t("Thepercentageexceeds100%")}</p>
                      : null}
                  </div>
                </Col>

              </Row>

              <Row>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="disbursementTerm">{t("Término/Plazo del desembolso")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="disbursementTerm"
                      type="text"
                      onKeyPress={(e) => { return OnlyNumber(e) }}
                      value={DataGeneral?.disbursementTerm} />
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-4">
                    <Label>{t("Tipo Término/Plazo")}</Label>

                    {validationSelects && <Select disabled={props.adminDesembolso} noOptionsMessage={() => ""}
                      style={{ width: "100%" }}
                      optionFilterProp="children"
                      defaultValue={DataGeneral?.disbursementTermType}
                      onChange={(e) => {
                        setDataGeneral({ ...DataGeneral, disbursementTermType: e })
                      }}
                      filterOption={(input, option) =>
                        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {typeTerms?.length > 0 ?

                        typeTerms?.map((item, index) => (
                          <Option key={index} value={item.Code.toUpperCase()}>{item.Description.toUpperCase()}</Option>
                        ))
                        : null}
                    </Select>}
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="debitAccountClientNumber">{t("Cuenta del cliente, a debitar")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="debitAccountClientNumber"
                      type="text"
                      value={DataGeneral?.debitAccountClientNumber} />
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="interestRate">{t("Tasa de Interes")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="interestRate"
                      type="text"
                      onKeyUp={(e) => {
                        let x = currencyData.getRealPercent(e.target.value);
                        e.target.value = currencyData.formatPercent(x || 0, e);
                      }}
                      onChange={(e) => {
                        let interestRate = +currencyData.getRealPercent(e.target.value || 0);
                        parseFloat(interestRate) > 100 ? setInterestRate(true) : setInterestRate(false);
                        setDataGeneral({ ...DataGeneral, interestRate });
                      }}
                      value={`${DataGeneral?.interestRate ?? 0}%`} />
                    {interestRate ?
                      <p className="message-error-parrafo">{t("Thepercentageexceeds100%")}</p>
                      : null}
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="authType">{t("FECI")}</Label>
                    <AvGroup check className="">
                      <Switch name="preapproval" disabled={props.adminDesembolso}
                        uncheckedIcon={<Offsymbol />}
                        checkedIcon={<OnSymbol />}
                        onColor="#007943"
                        className="form-label"
                        onChange={(e) => {
                          setDataGeneral({ ...DataGeneral, feci: !DataGeneral?.feci })
                        }}
                        checked={DataGeneral?.feci}
                      />
                    </AvGroup>
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-4">
                    <Label>{t("Ciclo de Pago de Interés")}</Label>

                    {validationSelects && <Select disabled={props.adminDesembolso} noOptionsMessage={() => ""}
                      style={{ width: "100%" }}
                      optionFilterProp="children"
                      defaultValue={JSON.stringify(interestPaymentCycleCatalogue?.find(interest => interest.Code === DataGeneral?.interestPaymentCycleCode))}
                      onChange={(e) => {
                        let interestPaymentCycle = JSON.parse(e)
                        setDataGeneral({ ...DataGeneral, interestPaymentCycleCode: interestPaymentCycle.Code, interestPaymentCycleDesc: interestPaymentCycle.Description })
                      }}
                      filterOption={(input, option) =>
                        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {interestPaymentCycleCatalogue?.length > 0 ?

                        interestPaymentCycleCatalogue?.map((item, index) => (
                          <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                        ))
                        : null}
                    </Select>}
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-4">
                    <Label>{t("Ciclo de Pago Capital")}</Label>

                    {validationSelects && <Select disabled={props.adminDesembolso} noOptionsMessage={() => ""}
                      style={{ width: "100%" }}
                      optionFilterProp="children"
                      defaultValue={JSON.stringify(capitalPaymentCycleCatalogue?.find(capital => capital.Code === DataGeneral?.capitalPaymentCycleCod))}
                      onChange={(e) => {
                        let capitalPaymentCycle = JSON.parse(e)

                        setdisabledmonthlyLetterAmount(true)
                        setDataGeneral({ ...DataGeneral, capitalPaymentCycleCod: capitalPaymentCycle.Code, capitalPaymentCycleDesc: capitalPaymentCycle.Description })
                      }}
                      filterOption={(input, option) =>
                        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {capitalPaymentCycleCatalogue?.length > 0 ?

                        capitalPaymentCycleCatalogue?.map((item, index) => (
                          <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                        ))
                        : null}
                    </Select>}
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="monthlyLetterIncludesIntsandFeci">{t("Letra Mensual incluye Ints y Feci USD")}</Label>
                    <AvGroup check className="">
                      <Switch name="monthlyLetterIncludesIntsandFeci" disabled={props.adminDesembolso}
                        uncheckedIcon={<Offsymbol />}
                        checkedIcon={<OnSymbol />}
                        onColor="#007943"
                        className="form-label"
                        onChange={(e) => {
                          setDataGeneral({ ...DataGeneral, monthlyLetterIncludesIntsandFeci: !DataGeneral?.monthlyLetterIncludesIntsandFeci })
                        }}
                        checked={DataGeneral?.monthlyLetterIncludesIntsandFeci}
                      />
                    </AvGroup>
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="monthlyLetterAmount">{t("Monto Letra Mensual USD")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="monthlyLetterAmount"
                      type="text"
                      onChange={(e) => { return check(e) }}
                      pattern="^[0-9,.]*$"
                      onKeyUp={(e) => {
                        let x = currencyData.getRealValue(e.target.value);
                        e.target.value = currencyData.format(x);
                        setDataGeneral({ ...DataGeneral, monthlyLetterAmount: x || 0 })
                      }}
                      value={currencyData.format(DataGeneral?.monthlyLetterAmount ?? 0)} />
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="fidBanescoCommissionAmount">{t("Monto Comision Fid.Banesco (FDB) USD")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="fidBanescoCommissionAmount"
                      type="text"
                      onChange={(e) => { return check(e) }}
                      pattern="^[0-9,.]*$"
                      onKeyUp={(e) => {
                        let x = currencyData.getRealValue(e.target.value);
                        e.target.value = currencyData.format(x);
                        setDataGeneral({ ...DataGeneral, fidBanescoCommissionAmount: x || 0 })
                      }}
                      value={currencyData.format(DataGeneral?.fidBanescoCommissionAmount ?? 0)} />
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="ITBMS">{t(" ITBMSFID USD")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="ITBMS"
                      type="text"
                      onChange={(e) => { return check(e) }}
                      pattern="^[0-9,.]*$"
                      onKeyUp={(e) => {
                        let x = currencyData.getRealValue(e.target.value);
                        e.target.value = currencyData.format(x);
                        setDataGeneral({ ...DataGeneral, itbmFidAmount: x || 0 })
                      }}
                      value={currencyData.format(DataGeneral?.itbmFidAmount ?? 0)} />
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="none">{t("Letra Mensual total incluyendo comisión fiduciaria USD")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="totalLetterIncludingfiduciaryCommission"
                      id="totalLetterIncludingfiduciaryCommission"
                      type="text"
                      value={DataGeneral?.totalLetterIncludingfiduciaryCommission} />
                  </div>
                </Col>
              </Row>
              {
                /* -------------------------------------------------------------------------- */
                /*                        Instrucciones para Desembolso                       */
                /* -------------------------------------------------------------------------- */
              }
              <Row>
                <Col md="12">
                  <span className="mb-3" style={S_seccions}>{t("Instrucciones para Desembolso")}</span>
                </Col>
              </Row>

              <Row>
                <Col md="4">
                  <div className="mb-3">
                    <div className="kt-checkbox-list">
                      <label className="kt-checkbox d-flex flex-row justify-content-between align-items-center">
                        <span>{t("Crédito a Cuenta")}</span>
                        <AvGroup check className="">
                          <Switch name="preapproval" disabled={props.adminDesembolso}
                            uncheckedIcon={<Offsymbol />}
                            checkedIcon={<OnSymbol />}
                            onColor="#007943"
                            className="form-label"
                            onChange={(e) => { setcreditAccount(!creditAccount) }}
                            checked={creditAccount}
                          />
                        </AvGroup>
                      </label>
                      <label className="kt-checkbox d-flex flex-row justify-content-between align-items-center">
                        <span>{t("Cheque de gerencia")}</span>
                        <AvGroup check className="">
                          <Switch name="preapproval" disabled={props.adminDesembolso}
                            uncheckedIcon={<Offsymbol />}
                            checkedIcon={<OnSymbol />}
                            onColor="#007943"
                            className="form-label"
                            onChange={(e) => { setchecker(!checker) }}
                            checked={checker}
                          />
                        </AvGroup>
                      </label>
                      <label className="kt-checkbox d-flex flex-row justify-content-between align-items-center">
                        <span>{t("Transferencia")}</span>
                        <AvGroup check className="">
                          <Switch name="preapproval" disabled={props.adminDesembolso}
                            uncheckedIcon={<Offsymbol />}
                            checkedIcon={<OnSymbol />}
                            onColor="#007943"
                            className="form-label"
                            onChange={(e) => { settransfer(!transfer) }}
                            checked={transfer}
                          />
                        </AvGroup>
                      </label>
                      <label className="kt-checkbox d-flex flex-row justify-content-between align-items-baseline mt-4">
                        <div className="d-flex flex-row align-items-baseline">
                          <span style={{ marginRight: "10px" }}>{t("Otro")}</span>
                        </div>
                        <AvGroup check className="">
                          <Switch name="preapproval" disabled={props.adminDesembolso}
                            uncheckedIcon={<Offsymbol />}
                            checkedIcon={<OnSymbol />}
                            onColor="#007943"
                            className="form-label"
                            onChange={(e) => { setothers(!others) }}
                            checked={others}
                          />
                        </AvGroup>
                      </label>
                    </div>
                  </div>
                </Col>
              </Row>

              {creditAccount && (<Row>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="disbursementFormAccountNumber">{t("Cuenta No.")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="disbursementFormAccountNumber"
                      type="text"
                      onKeyPress={(e) => { return OnlyNumber(e) }}
                      min={0}
                      id="disbursementFormAccountNumber"
                      value={DataGeneral?.disbursementFormAccountNumber} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="disbursementFormAccountName">{t("A nombre")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="disbursementFormAccountName"
                      type="text"
                      id="disbursementFormAccountName"
                      value={DataGeneral?.disbursementFormAccountName} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="disbursementFormAccountAmount">{t("Amount")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="disbursementFormAccountAmount"
                      id="disbursementFormAccountAmount"
                      onKeyUp={(e) => {
                        let x = currencyData.getRealValue(e.target.value);
                        e.target.value = currencyData.format(x);
                        setDataGeneral({ ...DataGeneral, disbursementFormAccountAmount: x || 0 });
                      }}
                      onChange={(e) => { sumdisbursementTotalAmount(); }}
                      onKeyPress={(e) => { return check(e) }}
                      pattern="^[0-9,.]*$"
                      type="text"
                      value={currencyData.format(DataGeneral?.disbursementFormAccountAmount ?? 0)} />
                  </div>
                </Col>
              </Row>)}

              {checker && (<Row>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="disbursementFormCheckNumber">{t("Cheque No.")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="disbursementFormCheckNumber"
                      min={0}
                      type="number"
                      onKeyPress={(e) => { return OnlyNumber(e) }}
                      id="disbursementFormCheckNumber"
                      value={DataGeneral?.disbursementFormCheckNumber} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="disbursementFormCheckName">{t("Cheque a Nombre de")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="disbursementFormCheckName"
                      type="text"
                      id="disbursementFormCheckName"
                      value={DataGeneral?.disbursementFormCheckName} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="disbursementFormCheckAmount">{t("Amount")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="disbursementFormCheckAmount"
                      id="disbursementFormCheckAmount"
                      onKeyUp={(e) => {
                        let x = currencyData.getRealValue(e.target.value);
                        e.target.value = currencyData.format(x);
                        setDataGeneral({ ...DataGeneral, disbursementFormCheckAmount: x || 0 });
                      }}
                      onChange={(e) => { sumdisbursementTotalAmount(); }}
                      onKeyPress={(e) => { return check(e) }}
                      pattern="^[0-9,.]*$"
                      type="text"
                      value={currencyData.format(DataGeneral?.disbursementFormCheckAmount ?? 0)} />
                  </div>
                </Col>
              </Row>)}

              {transfer && (<Row>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="disbursementFormTransferNumber">{t("Transferencia No.")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="disbursementFormTransferNumber"
                      type="text"
                      id="disbursementFormTransferNumber"
                      value={DataGeneral?.disbursementFormTransferNumber} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="disbursementFormTransferName">{t("A Nombre de")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="disbursementFormTransferName"
                      type="text"
                      id="disbursementFormTransferName"
                      value={DataGeneral?.disbursementFormTransferName} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="disbursementFormTransferAmount">{t("Amount")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="disbursementFormTransferAmount"
                      id="disbursementFormTransferAmount"
                      onKeyUp={(e) => {
                        let x = currencyData.getRealValue(e.target.value);
                        e.target.value = currencyData.format(x);
                        setDataGeneral({ ...DataGeneral, disbursementFormTransferAmount: x || 0 });
                      }}
                      onChange={(e) => { sumdisbursementTotalAmount(); }}
                      onKeyPress={(e) => { return OnlyNumber(e) }}
                      pattern="^[0-9,.]*$"
                      type="text"
                      value={currencyData.format(DataGeneral?.disbursementFormTransferAmount ?? 0)} />
                  </div>
                </Col>
              </Row>)}

              {others && (<Row>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="disbursementFormOtherNumber">{t("Others")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="disbursementFormOtherNumber"
                      type="text"
                      id="disbursementFormOtherNumber"
                      value={DataGeneral?.disbursementFormOtherNumber} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="disbursementFormOtherName">{t("Description")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="disbursementFormOtherName"
                      type="text"
                      id="disbursementFormOtherName"
                      value={DataGeneral?.disbursementFormOtherName ?? ''} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="disbursementFormOtherAmount">{t("Amount")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="disbursementFormOtherAmount"
                      id="disbursementFormOtherAmount"
                      onKeyUp={(e) => {
                        let x = currencyData.getRealValue(e.target.value);
                        e.target.value = currencyData.format(x);
                        setDataGeneral({ ...DataGeneral, disbursementFormOtherAmount: x || 0 });
                      }}
                      onChange={(e) => { sumdisbursementTotalAmount(); }}
                      onKeyPress={(e) => { return check(e) }}
                      pattern="^[0-9,.]*$"
                      type="text"
                      value={currencyData.format(DataGeneral?.disbursementFormOtherAmount ?? 0)} />
                  </div>
                </Col>
              </Row>)}
              {(creditAccount || checker || transfer || others) && <Row>
                <Col md="12">
                  <Row>
                    <Col md="4">

                    </Col>
                    <Col md="4">

                    </Col>
                    <Col md="4">
                      <div className="mb-3">
                        <Label htmlFor="disbursementTotalAmount">{t("Total")}</Label>
                        <AvField disabled={props.adminDesembolso}
                          className="form-control"
                          name="disbursementTotalAmount"
                          type="text"
                          id="disbursementTotalAmount"
                          value={disbursementTotalAmount} />
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>}
              <Row>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="cppNumber">{t("No. De CPP")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="cppNumber"
                      type="text"
                      id="cppNumber"
                      value={DataGeneral?.cppNumber} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="cppBeneficiary">{t("Beneficiario")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="cppBeneficiary"
                      type="text"
                      id="cppBeneficiary"
                      value={DataGeneral?.cppBeneficiary} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="cppAmount">{t("Amount")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="cppAmount"
                      id="cppAmount"
                      onKeyUp={(e) => {
                        let x = currencyData.getRealValue(e.target.value);
                        e.target.value = currencyData.format(x);
                        setDataGeneral({ ...DataGeneral, cppAmount: x || 0 });
                      }}
                      onChange={(e) => { sumdisbursementTotalAmount(); }}
                      onKeyPress={(e) => { return OnlyNumber(e) }}
                      pattern="^[0-9,.]*$"
                      type="text"
                      value={currencyData.format(DataGeneral?.cppAmount ?? 0)} />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md="4">
                  <div className="mb-4">
                    <Label>{t("Pais de Riesgo")}</Label>

                    {validationSelects && <Select noOptionsMessage={() => ""} disabled={props.adminDesembolso}
                      style={{ width: "100%" }}
                      optionFilterProp="children"
                      defaultValue={JSON.stringify(destinyCountryCatalogue?.find(country => country.Description === DataGeneral?.countryDesc))}
                      onChange={(e) => {
                        let country = JSON.parse(e);
                        setDataGeneral({ ...DataGeneral, countryCode: country.Code, countryDesc: country.Description });
                        loadProvince(country.Code)
                      }}
                      filterOption={(input, option) =>
                        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {destinyCountryCatalogue?.length > 0 ?

                        destinyCountryCatalogue?.map((item, index) => (
                          <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                        ))
                        : null}
                    </Select>}
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-4">
                    <Label>{t("Provincia")}</Label>

                    {validationSelects && <Select disabled={props.adminDesembolso} noOptionsMessage={() => ""}
                      style={{ width: "100%" }}
                      optionFilterProp="children"
                      defaultValue={provinceCatalogue?.find(province => province.Code == DataGeneral?.provinceCode)?.Description}
                      onChange={(e) => {
                        let province = JSON.parse(e);
                        setDataGeneral({ ...DataGeneral, provinceCode: province.Code, provinceDesc: province?.Description });
                      }}
                      filterOption={(input, option) =>
                        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {provinceCatalogue?.length > 0 ?

                        provinceCatalogue?.map((item, index) => (
                          <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                        ))
                        : null}
                    </Select>}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <div className="mb-4">
                    <Label>{t("Actividad Econommica")}</Label>

                    {activityTypeCatalogue != null ? <Select noOptionsMessage={() => ""} disabled={props.adminDesembolso}
                      style={{ width: "100%" }}
                      optionFilterProp="children"
                      defaultValue={JSON.stringify(activityTypeCatalogue?.find(activityType => activityType.Code === DataGeneral?.economicActivityTypeCode))}
                      onChange={(e) => {
                        let economicActivityType = JSON.parse(e)
                        setDataGeneral({ ...DataGeneral, economicActivityTypeCode: economicActivityType.Code, economicActivityTypeDesc: economicActivityType.Description });
                      }}
                      filterOption={(input, option) =>
                        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {activityTypeCatalogue && activityTypeCatalogue?.length > 0 ?

                        activityTypeCatalogue?.map((item, index) => (
                          <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                        ))
                        : null}
                    </Select> : null}
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-4">
                    <Label>Sub{t("Actividad Econommica")}</Label>
                    {activityTypeCatalogue && <Select noOptionsMessage={() => ""}
                      style={{ width: "100%" }}
                      optionFilterProp="children"
                      defaultValue={subactividadEconomicaSet?.Description ?? ""}
                      onChange={(e) => {
                        let economicActivityType = JSON.parse(e)
                        setsubactividadEconomicaSet(economicActivityType)
                        // setDataGeneral({ ...DataGeneral, economicActivityTypeCode: economicActivityType.Code, economicActivityTypeDesc: economicActivityType.Description });
                      }}
                      filterOption={(input, option) =>
                        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {subactivityTypeCatalogue && subactivityTypeCatalogue?.length > 0 ?
                        subactivityTypeCatalogue?.map((item, index) => (
                          <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                        ))
                        : null}
                    </Select>
                    }
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-4">
                    <Label>{t("Actividad CINU")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="cinuActivityTypeCode"
                      type="text"
                      id="cinuActivityTypeCode"
                      value={DataGeneral?.cinuActivityTypeCode} />

                    {/*validationSelects && <Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
                      style={{ width: "100%" }}
                      optionFilterProp="children"
                      defaultValue={DataGeneral?.cinuActivityTypeCode}
                      onChange={(e) => {
                        let cinuActivityType = JSON.parse(e)
                        setDataGeneral({ ...DataGeneral, cinuActivityTypeCode: cinuActivityType.Code, cinuActivityTypeDesc: cinuActivityType.Description })
                      }}
                      filterOption={(input, option) =>
                        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {cinuActivityCatalogue?.length > 0 ?

                        cinuActivityCatalogue?.map((item, index) => (
                          <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                        ))
                        : null}
                        </Select>*/}
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="cinuActivityTypeDesc">{t("Descripción")}</Label>
                    <AvField disabled={props.adminDesembolso}
                      className="form-control"
                      name="cinuActivityTypeDesc"
                      type="text"
                      id="cinuActivityTypeDesc"
                      value={DataGeneral?.cinuActivityTypeDesc} />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <div className="mb-3">
                    <Label htmlFor="disbursementDetailDescription">{t("Detalle ampliamente para que se utilizara este desembolso")}</Label>                            {/**No Item */}
                    <AvField disabled={!props.adminDesembolso || props?.ejecutivoDesembolso == true}
                      className="form-control"
                      name="disbursementDetailDescription"
                      type="textarea" rows={7}
                      id="disbursementDetailDescription"
                      value={DataGeneral?.disbursementDetailDescription} />
                  </div>
                </Col>

                <Col md="12">
                  <div className="mb-3">
                    <Label htmlFor="bankEspecialInstructions">{t("Instrucciones Especiales de la Banca")}</Label>                            {/**No Item */}
                    <AvField disabled={!props.adminDesembolso || props?.ejecutivoDesembolso == true}
                      className="form-control"
                      name="bankEspecialInstructions"
                      type="textarea" rows={7}
                      id="bankEspecialInstructions"
                      value={DataGeneral?.bankEspecialInstructions} />
                  </div>
                </Col>
              </Row>

            </Col>
          </Row >


          {
            /* -------------------------------------------------------------------------- */
            /*                               Administracion                               */
            /* -------------------------------------------------------------------------- */
          }
          <Row>
            <Col md="12">
              <span className="mb-3" style={S_seccions}>{t("Administración")}</span>
            </Col>
          </Row>
          <Row>

            <Col md="4">
              <div className="mb-3">
                <Label htmlFor="adminNotaryFees">{t("Notarias")}</Label>
                <AvField disabled={!props.adminDesembolso || props?.ejecutivoDesembolso == true}
                  className="form-control"
                  name="adminNotaryFees"
                  type="text"
                  id="adminNotaryFees"
                  onKeyUp={(e) => {
                    let x = currencyData.getRealValue(e.target.value);
                    e.target.value = currencyData.format(x);
                    setDataGeneral({ ...DataGeneral, adminNotaryFees: x || 0 });
                  }}
                  onChange={(e) => { sumdisbursementTotalAmount(); }}
                  onKeyPress={(e) => { return OnlyNumber(e) }}
                  pattern="^[0-9,.]*$"
                  value={currencyData.format(DataGeneral?.adminNotaryFees ?? 0)} />
              </div>
            </Col>

            <Col md="4">
              <div className="mb-3">
                <Label htmlFor="adminSealFees">{t("Timbres")}</Label>
                <AvField disabled={!props.adminDesembolso || props?.ejecutivoDesembolso == true}
                  className="form-control"
                  name="adminSealFees"
                  type="text"
                  id="adminSealFees"
                  onKeyUp={(e) => {
                    let x = currencyData.getRealValue(e.target.value);
                    e.target.value = currencyData.format(x);
                    setDataGeneral({ ...DataGeneral, adminSealFees: x || 0 });
                  }}
                  onChange={(e) => { sumdisbursementTotalAmount(); }}
                  onKeyPress={(e) => { return OnlyNumber(e) }}
                  pattern="^[0-9,.]*$"
                  value={currencyData.format(DataGeneral?.adminSealFees ?? 0)} />
              </div>
            </Col>

            <Col md="12">
              <div className="mb-3">
                <Label htmlFor="adminAditionalComments">{t("Comentarios adicionales de ADMCRED")}</Label>                            {/**No Item */}
                <AvField disabled={!props.adminDesembolso || props?.ejecutivoDesembolso == true}
                  className="form-control"
                  name="adminAditionalComments"
                  type="textarea" rows={7}
                  id="adminAditionalComments"
                  value={DataGeneral?.adminAditionalComments} />
              </div>
            </Col>
          </Row>


          {props !== undefined && props.firmarcontrato !== undefined && props.firmarcontrato === true ? null : <>
            <Row>
              <Col md="12">
                <span className="mb-3" style={S_seccions}>{t("Operaciones")}</span>
              </Col>
            </Row>
            <Row>

              <Col md="4">
                <div className="mb-3">
                  <Label htmlFor="operationalLeasNumber">{t("No. Préstamo")}</Label>
                  <AvField disabled={!props.ejecutarDesembolso}
                    className="form-control"
                    name="operationalLeasNumber"
                    type="text"
                    id="operationalLeasNumber"
                    value={DataGeneral?.operationalLeasNumber} />
                </div>
              </Col>

              <Col md="4">
                <div className="mb-3">
                  <Label htmlFor="operationalDueDate">{t("Fecha de Vencimmiento")}</Label>
                  {DataGeneral?.operationalDueDate && <Flatpickr disabled={!props.ejecutarDesembolso}
                    name="operationalDueDate"
                    className="form-control d-block"
                    placeholder={OPTs.FORMAT_DATE_SHOW}
                    options={{
                      dateFormat: OPTs.FORMAT_DATE,
                      //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                      defaultDate: DataGeneral?.operationalDueDate || DataGeneral?.operationalDueDate !== ' ' ? new Date(moment(DataGeneral?.operationalDueDate, 'YYYY-MM-DD').format()) : new Date()
                    }}
                    onChange={(selectedDates, dateStr, instance) => {
                      setDataGeneral({ ...DataGeneral, operationalDueDate: moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD") })
                    }}
                  />}
                </div>
              </Col>

              <Col md="4">
                <div className="mb-3">
                  <Label htmlFor="operationalNextPaymentDate">{t("Fecha de Próximo Pago")}</Label>
                  {DataGeneral?.operationalNextPaymentDate && <Flatpickr disabled={!props.ejecutarDesembolso}
                    name="operationalNextPaymentDate"
                    className="form-control d-block"
                    placeholder={OPTs.FORMAT_DATE_SHOW}
                    options={{
                      dateFormat: OPTs.FORMAT_DATE,
                      //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                      defaultDate: DataGeneral?.operationalNextPaymentDate || DataGeneral?.operationalNextPaymentDate !== ' ' ? new Date(moment(DataGeneral?.operationalNextPaymentDate, 'YYYY-MM-DD').format()) : new Date()
                    }}
                    onChange={(selectedDates, dateStr, instance) => {
                      setDataGeneral({ ...DataGeneral, operationalNextPaymentDate: moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD") })
                    }} />}
                </div>
              </Col>

              <Col md="4">
                <div className="mb-4">
                  <Label>{t("Forma de Pago")}</Label>

                  {validationSelects && <Select disabled={!props.ejecutarDesembolso} noOptionsMessage={() => ""}
                    style={{ width: "100%" }}
                    optionFilterProp="children"
                    defaultValue={DataGeneral?.paymentMethod}
                    onChange={(e) => {
                      let paymentMethod = e
                      setDataGeneral({ ...DataGeneral, paymentMethod })
                    }}
                    filterOption={(input, option) =>
                      option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {CatalogoMetodoPago?.length > 0 ?

                      CatalogoMetodoPago?.map((item, index) => (
                        <Option key={index} value={item.Code}>{item.Description}</Option>
                      ))
                      : null}
                  </Select>}
                </div>
              </Col>

              <Col md="4">
                <div className="mb-3">
                  <Label htmlFor="authType">{t("Fuente de Información de Venta")}</Label>
                  {validationSelects && <Select disabled={!props.ejecutarDesembolso} noOptionsMessage={() => ""}
                    showSearch
                    style={{ width: "100%" }}
                    placeholder={t("SearchtoSelect")}
                    optionFilterProp="children"
                    defaultValue={JSON.stringify(sourceSales?.find(source => source.Code === DataGeneral?.sourceSalesCod))}
                    onChange={(e) => {
                      let sourceSales = JSON.parse(e)
                      setDataGeneral({ ...DataGeneral, sourceSalesCod: sourceSales.Code, sourceSalesDesc: sourceSales.Description })
                    }}
                    filterOption={(input, option) =>
                      option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {sourceSales?.length > 0 ?

                      sourceSales?.map((item, index) => (
                        <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                      ))
                      : null}
                  </Select>}
                </div>
              </Col>

              <Col md="4">
                <div className="mb-3">
                  <Label htmlFor="authType">{t("Destino del Crédito")}</Label>
                  {validationSelects && <Select disabled={!props.ejecutarDesembolso} noOptionsMessage={() => ""}
                    showSearch
                    style={{ width: "100%" }}
                    placeholder={t("SearchtoSelect")}
                    optionFilterProp="children"
                    defaultValue={DataGeneral?.creditDestination}
                    onChange={(e) => {
                      setDataGeneral({ ...DataGeneral, creditDestination: e });
                    }}
                    filterOption={(input, option) =>
                      option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {catalogoDestino?.length > 0 ?

                      catalogoDestino?.map((item, index) => (
                        <Option key={index} value={item.Code}>{item.Description}</Option>
                      ))
                      : null}
                  </Select>}
                </div>
              </Col>

              <Col md="4">
                <div className="mb-3">
                  <Label htmlFor="authType">{t("Destino de los Fondos")}</Label>
                  {validationSelects && <Select disabled={!props.ejecutarDesembolso} noOptionsMessage={() => ""}
                    showSearch
                    style={{ width: "100%" }}
                    placeholder={t("SearchtoSelect")}
                    optionFilterProp="children"
                    defaultValue={DataGeneral?.fundsDestination}
                    onChange={(e) => {
                      setDataGeneral({ ...DataGeneral, fundsDestination: e });
                    }}
                    filterOption={(input, option) =>
                      option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {catalogoDestino?.length > 0 ?

                      catalogoDestino?.map((item, index) => (
                        <Option key={index} value={item.Code}>{item.Description}</Option>
                      ))
                      : null}
                  </Select>}
                </div>
              </Col>

              <Col md="4">
                <div className="mb-3">
                  <Label htmlFor="authType">{t("Propósito de los Fondos")}</Label>
                  <AvField disabled={!props.ejecutarDesembolso}
                    className="form-control"
                    name="fundsPurposeCode"
                    type="text"
                    id="fundsPurposeCode"
                    value={DataGeneral?.fundsPurposeCode} />

                  {/*validationSelects && <Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
                    showSearch
                    style={{ width: "100%" }}
                    placeholder={t("SearchtoSelect")}
                    optionFilterProp="children"
                    defaultValue={DataGeneral?.fundsPurposeCode}
                    onChange={(e) => {
                      setDataGeneral({ ...DataGeneral, fundsPurposeCode: e });
                    }}
                    filterOption={(input, option) =>
                      option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {catalogoDestino?.length > 0 ?

                      catalogoDestino?.map((item, index) => (
                        <Option key={index} value={item.Code}>{item.Description}</Option>
                      ))
                      : null}
                  </Select>*/}
                </div>
              </Col>

              <Col md="4">
                <div className="mb-3">
                  <Label htmlFor="checkNumber">{t("No. Cheque")}</Label>
                  <AvField disabled={!props.ejecutarDesembolso}
                    className="form-control"
                    name="checkNumber"
                    type="text"
                    id="checkNumber"
                    value={DataGeneral?.checkNumber} />
                </div>
              </Col>

            </Row>
            <Row>
              {/*Aqui viene una parte solo visible en la segunda parte 
                Calendario...va agregando schedule
                saveDisbursementSchedule
                getDisbursementSchedule
                deleteDisbursementSchedule
                */}

              <Col md="4">
                <div className="mb-3">
                  <Label htmlFor="originationRef">{t("Referencia de Orientacion")}</Label>
                  <AvField disabled={!props.ejecutarDesembolso}
                    className="form-control"
                    name="originationRef"
                    type="text"
                    id="originationRef"
                    value={DataGeneral?.originationRef} />
                </div>
              </Col>

              <Col md="4">
                <div className="mb-3">
                  <Label htmlFor="billsCombined">{t("Capital de Interes")}</Label>
                  <AvGroup check className="">
                    <Switch name="billsCombined" disabled={!props.ejecutarDesembolso}
                      uncheckedIcon={<Offsymbol />}
                      checkedIcon={<OnSymbol />}
                      onColor="#007943"
                      className="form-label"
                      onChange={(e) => {
                        setDataGeneral({ ...DataGeneral, billsCombined: !DataGeneral?.billsCombined })
                      }}
                      checked={DataGeneral?.billsCombined}
                    />
                  </AvGroup>
                </div>
              </Col>

              <Col md="4">
                <div className="mb-3">
                  <Label htmlFor="settlement">{t("Desembolso en cuenta")}</Label>
                  <AvGroup check className="">
                    <Switch name="settlement" disabled={!props.ejecutarDesembolso}
                      uncheckedIcon={<Offsymbol />}
                      checkedIcon={<OnSymbol />}
                      onColor="#007943"
                      className="form-label"
                      onChange={(e) => {
                        setDataGeneral({ ...DataGeneral, settlement: !DataGeneral?.settlement })
                      }}
                      checked={DataGeneral?.settlement}
                    />
                  </AvGroup>
                </div>
              </Col>

              <Col md="4">
                <div className="mb-3">
                  <Label htmlFor="autonomy">{t("Autonomia")}</Label>
                  {validationSelects && <Select disabled={!props.ejecutarDesembolso} noOptionsMessage={() => ""}
                    showSearch
                    style={{ width: "100%" }}
                    placeholder={t("SearchtoSelect")}
                    optionFilterProp="children"
                    defaultValue={JSON.stringify(autonomy?.find(aut => aut.Code === DataGeneral?.autonomyCode))}
                    onChange={(e) => {
                      let autonomy = JSON.parse(e)
                      setDataGeneral({ ...DataGeneral, autonomyCode: autonomy.Code, autonomyUser: autonomy.Description })
                    }}
                    filterOption={(input, option) =>
                      option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {autonomy?.length > 0 ?

                      autonomy?.map((item, index) => (
                        <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                      ))
                      : null}
                  </Select>}
                </div>
              </Col>
              <Col md="4">
                <div className="mb-3">
                  <Label htmlFor="autonomy">{t("Tipo de Autorizacion")}</Label>
                  {validationSelects && <Select disabled={!props.ejecutarDesembolso} noOptionsMessage={() => ""}
                    showSearch
                    style={{ width: "100%" }}
                    placeholder={t("SearchtoSelect")}
                    optionFilterProp="children"
                    defaultValue={JSON.stringify(authorityType?.find(aut => aut.Code === DataGeneral?.authType))}
                    onChange={(e) => {
                      let authorityType = JSON.parse(e)
                      setDataGeneral({ ...DataGeneral, authType: authorityType.Code })
                    }}
                    filterOption={(input, option) =>
                      option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {authorityType?.length > 0 ?
                      authorityType?.map((item, index) => (
                        <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                      ))
                      : null}
                  </Select>}
                </div>
              </Col>

            </Row>
          </>}

          {props.ejecutarDesembolso === false ? null :
            <AvForm>
              {
                /* -------------------------------------------------------------------------- */
                /*                                 Squedules                                 */
                /* -------------------------------------------------------------------------- */
              }
              <Row>
                <Col md="12">
                  <span className="mb-3" style={S_seccions}>{t("Calendario")}</span>
                </Col>
              </Row>
              <Horarios facilityNumber={props.disbursementInstructionNumber} />
            </AvForm>
          }
        </LoadingOverlay >
        <CardFooter style={{ textAlign: "right" }}>
          {props?.ejecutivoDesembolso ? <Button color="success" type="submit" disabled={props?.DeshabilitarSelect ?? false} style={{ margin: '5px' }}>
            <i className="mdi mdi-content-save-outline mid-12px"></i>{" "} {t("Generar")}
          </Button> : <Button color="primary" type="submit" disabled={props?.DeshabilitarSelect ?? false} style={{ margin: '5px' }}>
            <i className="mdi mdi-content-save-outline mid-12px"></i>{" "} {t("Save")}
          </Button>}

          {/* <Button color="success" type="button" onClick={() => { props.onSaveProcess(1); }} style={{ margin: '5px' }}>
              <i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i>{" "} {t("GenerateDocument")}
            </Button> */}
        </CardFooter>
      </AvForm >
      {
        /* -------------------------------------------------------------------------- */
        /*                                 operaciones                                */
        /* -------------------------------------------------------------------------- */
      }


    </React.Fragment >


  );

}

export default (withTranslation()(DatosGenerales))
