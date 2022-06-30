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

const DatosGeneralesBL = (props) => {

  const apiServiceBackend = new BackendServices();
  const apiServiceCore = new CoreServices();
  const location = useLocation()

  const { t, i18n } = useTranslation();

  const [dataLocation, setdataLocation] = useState(location.data);


  // Variables de nuevos campos
  const [billsCombined, setbillsCombined] = useState(false);//Capital de Interes
  const catalogoDestino = [{ Code: "LOCAL", Description: "LOCAL" }, { Code: "EXTRANJERO", Description: "EXTRANJERO" }]
  const CatalogoPrueba = [{ Code: "Test", Description: "Test" }, { Code: "Test2", Description: "Test2" }]
  const CatalogoEscritura = [{ Code: "PAG", Description: "Pagaré" }, { Code: "WRT", Description: "Escritura" }]
  const CatalogoTerminos = [{ Code: "D", Description: "D" }, { Code: "M", Description: "M" }, { Code: "A", Description: "A" }]
  const CatalogoMetodoPago = [{ Code: "DC", Description: "Descuento Directo" }, { Code: "PV", Description: "Pago Voluntario" }]
  const [catalogoDestinoSet, setcatalogoDestinoSet] = useState(null);
  const [fundsDestinationSet, setfundsDestinationSet] = useState(null);
  const [fundsPurposeCodeSet, setfundsPurposeCodeSet] = useState(null);
  const [originationRefSet, setoriginationRefSet] = useState(null);
  const [sourceSalesSet, setsourceSalesSet] = useState(null);
  const [writingTypeSet, setwritingTypeSet] = useState(null);
  const [disbursementTermTypeSet, setdisbursementTermTypeSet] = useState(null);
  const [settlementSet, setsettlementSet] = useState(false);
  const [pmtMethodSet, setpmtMethodSet] = useState(null);
  const [selectsData, setselectsData] = useState(null);

  /**
   *    Start state select
   */

  const [productCatalogue, setproductCatalogue] = useState([{ label: t("CommercialType"), value: t("CommercialType") }]);
  const [subProductCatalogue, setsubProductCatalogue] = useState(undefined);
  const [loanTypeCatalogue, setloanTypeCatalogue] = useState(undefined);
  const [tipoAccion, settipoAccion] = useState("nuevo");
  const [indexedRateCatalogue, setindexedRateCatalogue] = useState([{ label: 'Si', value: true }, { label: 'No', value: false }]);
  const [feciCatalogue, setfeciCatalogue] = useState([{ label: 'Si', value: true }, { label: 'No', value: false }]);
  const [branchCatalogue, setbranchCatalogue] = useState(undefined);
  const [monthlyLetterFeciCatalogue, setmonthlyLetterFeciCatalogue] = useState([{ label: 'Si', value: true }, { label: 'No', value: false }]);
  const [interestPaymentCycleCatalogue, setinterestPaymentCycleCatalogue] = useState(undefined);
  const [capitalPaymentCycleCatalogue, setcapitalPaymentCycleCatalogue] = useState(undefined);
  const [destinyCountryCatalogue, setdestinyCountryCatalogue] = useState(undefined);
  const [provinceCatalogue, setprovinceCatalogue] = useState(undefined);
  const [activityTypeCatalogue, setactivityTypeCatalogue] = useState(undefined);
  const [cinuActivityCatalogue, setcinuActivityCatalogue] = useState([{ label: 'Si', value: true }, { label: 'No', value: false }]);
  const [dutyFreeCatalogue, setdutyFreeCatalogue] = useState([{ label: 'Si', value: true }, { label: 'No', value: false }]);
  const [saleChannelCatalogue, setsaleChannelCatalogue] = useState([{ label: 'Si', value: true }, { label: 'No', value: false }]);
  const [toDifferIopCatalogue, settoDifferIopCatalogue] = useState([{ label: 'Si', value: true }, { label: 'No', value: false }]);
  const [pawnIopCatalogue, setpawnIopCatalogue] = useState([{ label: 'Si', value: true }, { label: 'No', value: false }]);
  const [modalCreacionLinea, setmodalCreacionLinea] = useState(false);
  /**
   *    End state select
   */

  /**
   *    Start state check
   */
  function cerrarModalLinea() {
    setmodalCreacionLinea(false);
    removeBodyCss()
    consultarLinea()
  }
  function consultarLinea(data = dataLocation) {
    const backendServices = new BackendServices();
    backendServices.getCreditLine(data?.transactionId ?? 0).then(resp => {
      if (resp.length > 0 && resp != undefined) {
        setnumeroLineaMaster(resp[0].lineId)
      }
    })
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  const [numeroLineaMaster, setnumeroLineaMaster] = useState(null);
  const [creditAccount, setcreditAccount] = useState(false);
  const [checker, setchecker] = useState(false);
  const [transfer, settransfer] = useState(false);
  const [others, setothers] = useState(false);

  /**
   *    End state check
   */



  /**
   * Start state selects
   */
  const [product, setproduct] = useState(null);
  const [subProduct, setsubProduct] = useState(null);
  const [loanType, setloanType] = useState(null);
  const [indexedRate, setindexedRate] = useState(null);
  const [feci, setfeci] = useState(null);
  const [branch, setbranch] = useState(null);
  const [monthlyLetterFeci, setmonthlyLetterFeci] = useState(null);
  const [interestPaymentCycle, setinterestPaymentCycle] = useState(null);
  const [capitalPaymentCycle, setcapitalPaymentCycle] = useState(null);
  const [destinyCountry, setdestinyCountry] = useState(null);
  const [province, setprovince] = useState(null);
  const [activityType, setactivityType] = useState(null);
  const [cinuActivity, setcinuActivity] = useState(null);
  const [dutyFree, setdutyFree] = useState(null);
  const [saleChannel, setsaleChannel] = useState(null);
  const [toDifferIop, settoDifferIop] = useState(null);
  const [pawnIop, setpawnIop] = useState(null);
  /**
   * End state selects
   */


  const [othersAmount, setothersAmount] = useState(0);
  const [transferAmount, settransferAmount] = useState(0);
  const [checkAmount, setcheckAmount] = useState(0);
  const [creditAccountAmount, setcreditAccountAmount] = useState(0);
  const [disbursementTotalAmount, setdisbursementTotalAmount] = useState(0);

  const [customerNameT24, setcustomerNameT24] = useState(null);

  const history = useHistory();

  const { selectedData } = location;

  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");

  const [DataGeneral, setDataGeneral] = useState(null);

  const [dataFacilidad, setdataFacilidad] = useState(null);
  const [dataFacilidadSet, setdataFacilidadSet] = useState(null);
  const [idFacilidad, setidFacilidad] = useState(null);
  const [dataLinea, setdataLinea] = useState(null);
  const [dataGlobal, setdataGlobal] = useState(null);

  const [ErrorValidate, setErrorValidate] = useState(null);
  const [isActiveLoading, setIsActiveLoading] = useState(false);
  const [Instructive, setInstructive] = useState(null);
  const [customerT24, setcustomerT24] = useState(null);

  const [productRender, setproductRender] = useState(null);
  const [subProductRender, setsubProductRender] = useState(null);
  const [loanTypeRender, setloanTypeRender] = useState(null);
  const [indexedRateRender, setindexedRateRender] = useState(null);
  const [feciRender, setfeciRender] = useState(null);
  const [branchRender, setbranchRender] = useState(null);
  const [monthlyLetterFeciRender, setmonthlyLetterFeciRender] = useState(null);
  const [interestPaymentCycleRender, setinterestPaymentCycleRender] = useState(null);
  const [capitalPaymentCycleRender, setcapitalPaymentCycleRender] = useState(null);
  const [destinyCountryRender, setdestinyCountryRender] = useState(null);
  const [provinceRender, setprovinceRender] = useState(null);
  const [activityTypeRender, setactivityTypeRender] = useState(null);
  const [cinuActivityRender, setcinuActivityRender] = useState(null);
  const [dutyFreeRender, setdutyFreeRender] = useState(null);
  const [saleChannelRender, setsaleChannelRender] = useState(null);
  const [toDifferIopRender, settoDifferIopRender] = useState(null);
  const [pawnIopRender, setpawnIopRender] = useState(null);
  const [numberLine, setnumberLine] = useState(null);
  const [numeroLineaSelect, setnumeroLineaSelect] = useState(null);

  const currencyData = new Currency();

  const [campoTasa, setcampoTasa] = useState(false);

  React.useEffect(async () => {

    setIsActiveLoading(true);

    setcreditAccount(creditAccount);
    setchecker(checker);
    settransfer(transfer);
    setothers(others);

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

    consultarLinea(dataSession);
    Promise.allSettled([
      apiServiceBackend.getDisbursementInstructiveByFacility(dataSession.transactionId, props.facilityId),
      apiServiceBackend.consultarDeudores(dataSession.transactionId),
      apiServiceBackend.consultPrincipalDebtor(dataSession.transactionId),
      loadSubProduct(),
      loadLoanType(),
      loadBranch(),
      loadDestinyCountry(dataSession),
      loadEconomicActivity(),
      loadInterestPayment(),
      loadCapitalPaymentCycle(),

    ]).then(async resp => {
      const [
        { value: Instructive },
        { value: consultDebtors },
        { value: consultPrincipalDebtor },
        { value: subProductCatalogue },
        { value: loanTypeCatalogue },
        { value: branchCatalogue },
        { value: destinyCountryCatalogue },
        { value: activityTypeCatalogue },
        { value: interestPaymentCycleCatalogue },
        { value: capitalPaymentCycleCatalogue },] = resp;

      setDataGeneral(Instructive);

      // let customerT24 = DataGeneral.customerT24 ?? consultPrincipalDebtor.customerNumberT24;

      let customerT24 = consultPrincipalDebtor.customerNumberT24;
      let dataDebtor = consultDebtors.find($$ => $$.customerNumberT24 == customerT24);
      setcustomerNameT24(dataDebtor.name)
      setcustomerT24(customerT24)
      if (Instructive?.product != "" || Instructive?.product != null) {
        settipoAccion("editar");
      }
      lineCreditSelect();
      productRenderF(Instructive?.product ?? '', productCatalogue);
      subProductRenderF(Instructive?.subProduct ?? '', subProductCatalogue);
      loanTypeRenderF(Instructive?.loanType ?? '', loanTypeCatalogue);
      indexedRateRenderF(Instructive?.indexedRate ?? '', indexedRateCatalogue);
      feciRenderF(Instructive?.feci ?? '', feciCatalogue);
      branchRenderF(Instructive?.branch ?? '', branchCatalogue);
      monthlyLetterFeciRenderF(Instructive?.monthlyLetterFeci ?? '', monthlyLetterFeciCatalogue);
      interestPaymentCycleRenderF(Instructive?.interestPaymentCycle ?? '', interestPaymentCycleCatalogue);
      capitalPaymentCycleRenderF(Instructive?.capitalPaymentCycle ?? '', capitalPaymentCycleCatalogue);
      destinyCountryRenderF(Instructive?.destinyCountry ?? '', destinyCountryCatalogue);
      loadProvince(Instructive?.destinyCountry ?? '', Instructive?.province ?? '')
      // provinceRenderF(Instructive?.province ?? '', provinceCatalogue);
      activityTypeRenderF(Instructive?.activityType ?? '', activityTypeCatalogue);
      cinuActivityRenderF(Instructive?.cinuActivity ?? '', cinuActivityCatalogue);
      dutyFreeRenderF(Instructive?.dutyFree ?? '', dutyFreeCatalogue);
      saleChannelRenderF(Instructive?.saleChannel ?? '', saleChannelCatalogue);
      toDifferIopRenderF(Instructive?.toDifferIop ?? '', toDifferIopCatalogue);
      pawnIopRenderF(Instructive?.pawnIop ?? '', pawnIopCatalogue);

      setproduct(Instructive?.product ?? '');
      setsubProduct(Instructive?.subProduct ?? '');
      setloanType(Instructive?.loanType ?? '');
      setindexedRate(Instructive?.indexedRate ?? false);
      setfeci(Instructive?.feci ?? false);
      setbranch(Instructive?.branch ?? '');
      setmonthlyLetterFeci(Instructive?.monthlyLetterFeci ?? false);
      setinterestPaymentCycle(Instructive?.interestPaymentCycle ?? '');
      setcapitalPaymentCycle(Instructive?.capitalPaymentCycle ?? '');
      setdestinyCountry(Instructive?.destinyCountry ?? '');
      setprovince(Instructive?.province ?? '');
      setactivityType(Instructive?.activityType ?? '');
      setcinuActivity(Instructive?.cinuActivity ?? '');
      setdutyFree(Instructive?.dutyFree ?? false);
      setsaleChannel(Instructive?.saleChannel ?? '');
      settoDifferIop(Instructive?.toDifferIop ?? false);
      setpawnIop(Instructive?.pawnIop ?? false);

      setcreditAccount(Instructive?.creditAccount ?? false);
      setchecker(Instructive?.checker ?? false);
      settransfer(Instructive?.transfer ?? false);
      setothers(Instructive?.others ?? false);

      setothersAmount(Instructive?.othersAmount);
      settransferAmount(Instructive?.transferAmount);
      setcheckAmount(Instructive?.checkAmount);
      setcreditAccountAmount(Instructive?.creditAccountAmount);


      selectsNewData(Instructive)
      setcatalogoDestinoSet(Instructive?.creditDestination)
      setfundsDestinationSet(Instructive?.fundsDestination)
      setfundsPurposeCodeSet(Instructive?.fundsPurposeCode)
      setoriginationRefSet(Instructive?.originationRef)
      setsourceSalesSet(Instructive?.sourceSalesCod)
      setwritingTypeSet(Instructive?.writingType)
      setdisbursementTermTypeSet(Instructive?.disbursementTermType)
      setsettlementSet(Instructive?.settlement)
      setpmtMethodSet(Instructive?.pmtMethod)
      setbillsCombined(Instructive?.billsCombined)
      setIsActiveLoading(false);
    }).catch(err => {
      console.log(err);
      setIsActiveLoading(false);
    });

    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
        location.data.transactionId = 0;
      }
      else {
        sessionStorage.setItem('locationData', JSON.stringify(location.data));
        setdataLocation(location.data);
      }
    }
    else {
      //chequeamos si tenemos guardado en session
      var result = sessionStorage.getItem('locationData');
      if (result !== undefined && result !== null) {
        result = JSON.parse(result);
        setdataLocation(result);
      }
    }


    // setErrorValidate({
    //   campoRequeridoSubcursal,
    // });
  }, []);

  function selectsNewData(data) {
    // setfundsDestinationSet(data?.fundsDestination)
    // setfundsPurposeCodeSet(data?.fundsPurposeCode)
    // setoriginationRefSet(data?.originationRef)
    // setsourceSalesSet(data?.sourceSales)
    // setwritingTypeSet(data?.writingType)
    // setdisbursementTermTypeSet(data?.disbursementTermType)
    // setsettlementSet(data?.settlement)
    // setpmtMethodSet(data?.pmtMethod)
    // setbillsCombined(data?.billsCombined)
    setselectsData(<><Col md="4">
      <div className="mb-3">
        <Label htmlFor="authType">{t("Credit Destination")}</Label>
        <Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
          showSearch
          style={{ width: "100%" }}
          placeholder={t("SearchtoSelect")}
          optionFilterProp="children"
          defaultValue={data?.creditDestination}
          onChange={(e) => { setcatalogoDestinoSet(e) }}
          filterOption={(input, option) =>
            option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {catalogoDestino?.length > 0 ?

            catalogoDestino?.map((item, index) => (
              <Option key={index} value={item.Code}>{item.Description}</Option>
            ))
            : null}
        </Select>
      </div>
    </Col>
      <Col md="4">
        <div className="mb-3">
          <Label htmlFor="authType">{t("DestinationOfFunds")}</Label>
          <Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
            showSearch
            style={{ width: "100%" }}
            placeholder={t("SearchtoSelect")}
            optionFilterProp="children"
            defaultValue={data?.fundsDestination}
            onChange={(e) => { setfundsDestinationSet(e) }}
            filterOption={(input, option) =>
              option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {catalogoDestino?.length > 0 ?

              catalogoDestino?.map((item, index) => (
                <Option key={index} value={item.Code}>{item.Description}</Option>
              ))
              : null}
          </Select>
        </div>
      </Col>
      <Col md="4">
        <div className="mb-3">
          <Label htmlFor="authType">{t("Purpose of Funds")}</Label>
          <Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
            showSearch
            style={{ width: "100%" }}
            placeholder={t("SearchtoSelect")}
            optionFilterProp="children"
            defaultValue={data?.fundsPurposeCode}
            onChange={(e) => { setfundsPurposeCodeSet(e) }}
            filterOption={(input, option) =>
              option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {CatalogoPrueba?.length > 0 ?

              CatalogoPrueba?.map((item, index) => (
                <Option key={index} value={item.Code}>{item.Description}</Option>
              ))
              : null}
          </Select>
        </div>
      </Col>
      <Col md="4">
        <div className="mb-3">
          <Label htmlFor="authType">{t("Orientation Reference")}</Label>
          <Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
            showSearch
            style={{ width: "100%" }}
            placeholder={t("SearchtoSelect")}
            optionFilterProp="children"
            defaultValue={data?.originationRef}
            onChange={(e) => { setoriginationRefSet(e) }}
            filterOption={(input, option) =>
              option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {CatalogoPrueba?.length > 0 ?

              CatalogoPrueba?.map((item, index) => (
                <Option key={index} value={item.Code}>{item.Description}</Option>
              ))
              : null}
          </Select>
        </div>
      </Col>
      <Col md="4">
        <div className="mb-3">
          <Label htmlFor="authType">{t("Sales Source Code")}</Label>
          <Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
            showSearch
            style={{ width: "100%" }}
            placeholder={t("SearchtoSelect")}
            optionFilterProp="children"
            defaultValue={data?.sourceSalesCod}
            onChange={(e) => { setsourceSalesSet(e) }}
            filterOption={(input, option) =>
              option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {CatalogoPrueba?.length > 0 ?

              CatalogoPrueba?.map((item, index) => (
                <Option key={index} value={item.Code}>{item.Description}</Option>
              ))
              : null}
          </Select>
        </div>
      </Col>
      <Col md="4">
        <div className="mb-3">
          <Label htmlFor="authType">{t("Writing Type")}</Label>
          <Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
            showSearch
            style={{ width: "100%" }}
            placeholder={t("SearchtoSelect")}
            optionFilterProp="children"
            defaultValue={data?.writingType}
            onChange={(e) => { setwritingTypeSet(e) }}
            filterOption={(input, option) =>
              option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {CatalogoEscritura?.length > 0 ?

              CatalogoEscritura?.map((item, index) => (
                <Option key={index} value={item.Code}>{item.Description}</Option>
              ))
              : null}
          </Select>
        </div>
      </Col>

      <Col md="4">
        <div className="mb-3">
          <Label htmlFor="authType">{t("Type of term or disbursement term D/M/Y")}</Label>
          <Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
            showSearch
            style={{ width: "100%" }}
            placeholder={t("SearchtoSelect")}
            optionFilterProp="children"
            defaultValue={data?.disbursementTermType}
            onChange={(e) => { setdisbursementTermTypeSet(e) }}
            filterOption={(input, option) =>
              option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {CatalogoTerminos?.length > 0 ?

              CatalogoTerminos?.map((item, index) => (
                <Option key={index} value={item.Code}>{item.Description}</Option>
              ))
              : null}
          </Select>
        </div>
      </Col>
      <Col md="4">
        <div className="mb-3">
          <Label htmlFor="authType">{t("DC/PV Payment Method")}</Label>
          <Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
            showSearch
            style={{ width: "100%" }}
            placeholder={t("SearchtoSelect")}
            optionFilterProp="children"
            defaultValue={data?.pmtMethod}
            onChange={(e) => { setpmtMethodSet(e) }}
            filterOption={(input, option) =>
              option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {CatalogoMetodoPago?.length > 0 ?

              CatalogoMetodoPago?.map((item, index) => (
                <Option key={index} value={item.Code}>{item.Description}</Option>
              ))
              : null}
          </Select>
        </div>
      </Col></>)
  }
  React.useEffect(() => {
    sumdisbursementTotalAmount()
  }, [othersAmount, transferAmount, checkAmount, creditAccountAmount, creditAccount, checker, transfer, others]);

  function loadSubProduct() {
    return new Promise((resolve, reject) => {
      apiServiceCore.getSubProductCatalog().then(data => {
        resolve(data?.Records)
        setsubProductCatalogue(data?.Records);
      }).catch((error) => {
        resolve()
      });
    });
  }

  function loadLoanType() {
    return new Promise((resolve, reject) => {
      apiServiceBackend.retrieveLoanType().then(data => {
        resolve(data);
        setloanTypeCatalogue(data)
      }).catch((error) => {
        resolve();
      });
    })
  }

  function loadBranch() {
    return new Promise((resolve, reject) => {
      apiServiceCore.getSucursalesCatalogo().then(data => {
        resolve(data?.Records);
        setbranchCatalogue(data?.Records);
      }).catch((error) => {
        resolve();
      });
    })
  }

  function loadEconomicActivity() {
    return new Promise((resolve, reject) => {
      const api = new CoreServices();
      api.getActividadEconomicaCatalogo().then(data => {
        resolve(data?.Records);
        setactivityTypeCatalogue(data?.Records)
      }).catch(err => {
        resolve();
      });
    })
  }

  function loadDestinyCountry(dataSession) {
    return new Promise((resolve, reject) => {

      apiServiceCore.getPaisesCatalogo(dataSession.transactionId).then(data => {
        resolve(data?.Records);
        setdestinyCountryCatalogue(data?.Records);
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
        provinceRenderF(province2, data?.Records)
      }).catch((error) => {
        resolve();
      });
    })
  }

  function loadInterestPayment() {
    return new Promise((resolve, reject) => {
      apiServiceBackend.retrieveInterestPaymentCycle().then(data => {
        resolve(data);
        setinterestPaymentCycleCatalogue(data);
      }).catch((error) => {
        resolve();
      });
    })
  }

  function loadCapitalPaymentCycle() {
    return new Promise((resolve, reject) => {
      apiServiceBackend.retrieveCapitalPaymentCycle().then(data => {
        resolve(data);
        setcapitalPaymentCycleCatalogue(data);
      }).catch((error) => {
        resolve();
      });
    })
  }

  /**
   * Selects
   * subProduct
   * loanType
   * indexedRate
   * feci
   * branch
   * interestPaymentCycle
   * capitalPaymentCycle
   * destinyCountry
   * province
   * activityType
   * cinuActivity
   * dutyFree
   * saleChannel
   * toDifferIop
   * pawnIop
   */

  /**Checked
   * creditAccount
   * checker
   * transfer
   * others
   * 
   */

  function sumdisbursementTotalAmount() {
    let othersAmount1 = parseFloat(document.getElementById("othersAmount") ? currencyData.getRealValue(document.getElementById("othersAmount").value) : 0);
    let transferAmount1 = parseFloat(document.getElementById("transferAmount") ? currencyData.getRealValue(document.getElementById("transferAmount").value) : 0);
    let checkAmount1 = parseFloat(document.getElementById("checkAmount") ? currencyData.getRealValue(document.getElementById("checkAmount").value) : 0);
    let creditAccountAmount1 = parseFloat(document.getElementById("creditAccountAmount") ? currencyData.getRealValue(document.getElementById("creditAccountAmount").value) : 0);
    setdisbursementTotalAmount(currencyData.format(((isNaN(+othersAmount1) || !others ? 0 : +othersAmount1) ?? 0) + ((isNaN(+transferAmount1) || !transfer ? 0 : +transferAmount1) ?? 0) + ((isNaN(+checkAmount1) || !checker ? 0 : +checkAmount1) ?? 0) + ((isNaN(+creditAccountAmount1) || !creditAccount ? 0 : +creditAccountAmount1) ?? 0)));
  }

  async function handleSubmit(event, errors, values) {
    event.preventDefault();

    if (errors.length > 0 || campoTasa) {
      return;
    }

    let instructive = {
      transactId: 0,
      facilityId: 0,
      instructiveType: "",
      instructiveDate: "",
      loan: "",
      customerT24: "",
      disbursementTransact: "",
      product: "",
      subProduct: "",
      loanType: "",
      line: "",
      masterLine: "",
      masterCustomer: "",
      afiRequest: "",
      disbursementAmount: 0,
      interestRate: 0,
      indexedRate: false,
      pdfRate: "",
      spread: "",
      totalRate: 0,
      dpnfbSaving: "",
      an: "",
      feci: false,
      branch: "",
      disbursementPeriod: "",
      disbursementTerm: "",
      termType: "",
      debitAccount: "",
      toName: "",
      monthlyLetterFeci: false,
      amountLetter: 0,
      commissionFid: 0,
      itbmsFid: 0,
      commissionFwla: 0,
      itbmsFwla: 0,
      amountTotalLetter: 0,
      interestPaymentCycle: "",
      capitalPaymentCycle: "",
      nextPaymentDate: "",
      destinyCountry: "",
      province: "",
      activityType: "",
      cinuActivity: "",
      dutyFree: false,
      detail: "",
      creditAccount: false,
      checker: false,
      transfer: false,
      others: false,
      creditAccountNumber: "",
      accountName: "",
      creditAccountAmount: 0,
      checkNumber: "",
      beneficiary: "",
      checkAmount: 0,
      transferenceNumber: "",
      transferenceBeneficiary: "",
      transferAmount: 0,
      othersItem: "",
      othersDescription: "",
      othersAmount: 0,
      cppNumber: "",
      disbursementTotalAmount: 0,
      specialInstructions: "",
      invoiceIop: "",
      checkIop: "",
      accountNumberIop: "",
      commissionIop: "",
      commissionAmountIop: 0,
      itbmsIop: "",
      toDifferIop: true,
      pawnIop: false,
      dpfSavingsIop: "",
      anIop: "",
      pawnAmountIop: 0,
      notaryIop: "",
      stampsIop: "",
      instructionsIop: "",

      autonomyCode: "",
      autonomyUser: "",
      subCategoryCode: "",
      authType: "",
      billsCombined: true,
      creditDestination: "",
      fundsDestination: "",
      fundsPurposeCode: "",
      originationRef: "",
      sourceSalesCod: "",
      sourceSalesDesc: "",
      writingType: "",
      termAmt: 0,
      disbursementTermType: "",
      saleChannel: "",
      settlement: false,
      pmtMethod: ""
    }

    values.product = product;
    values.subProduct = subProduct;
    values.loanType = loanType;
    values.indexedRate = indexedRate;
    values.feci = feci;
    values.branch = branch;
    values.monthlyLetterFeci = monthlyLetterFeci;
    values.interestPaymentCycle = interestPaymentCycle;
    values.capitalPaymentCycle = capitalPaymentCycle;
    values.destinyCountry = destinyCountry;
    values.province = province;
    values.activityType = activityType;
    values.cinuActivity = cinuActivity;
    values.dutyFree = dutyFree;
    // values.saleChannel = saleChannel;
    values.toDifferIop = toDifferIop;
    values.pawnIop = pawnIop;
    values.creditAccount = creditAccount;
    values.checker = checker;
    values.transfer = transfer;
    values.others = others;
    values.disbursementPeriod = "";
    values.termType = "";

    values.disbursementAmount = values.disbursementAmount || 0;
    values.interestRate = values.interestRate || 0;
    values.totalRate = values.totalRate || 0;
    values.amountLetter = values.amountLetter || 0;
    values.commissionFid = values.commissionFid || 0;
    values.itbmsFid = values.itbmsFid || 0;
    values.commissionFwla = values.commissionFwla || 0;
    values.itbmsFwla = values.itbmsFwla || 0;
    values.amountTotalLetter = values.amountTotalLetter || 0;
    values.creditAccountAmount = values.creditAccountAmount || 0;
    values.checkAmount = values.checkAmount || 0;
    values.transferAmount = values.transferAmount || 0;
    values.othersAmount = values.othersAmount || 0;
    values.disbursementTotalAmount = values.disbursementTotalAmount || 0;
    values.commissionAmountIop = values.commissionAmountIop || 0;
    values.pawnAmountIop = values.pawnAmountIop || 0;

    values.instructiveDate = values.instructiveDate || new Date();
    values.nextPaymentDate = values.nextPaymentDate || new Date();

    values.transactId = dataLocation.transactionId;
    values.facilityId = props.facilityId;
    values.instructiveType = props.instructiveType;

    values.disbursementAmount = currencyData.getRealValue(values.disbursementAmount);
    // values.interestRate = currencyData.getRealValue(values.interestRate);
    values.interestRate = +currencyData.getRealPercent(values?.interestRate ?? 0);
    values.itbmsIop = currencyData.getRealValue(values.itbmsIop);

    values.creditAccountAmount = currencyData.getRealValue(values.creditAccountAmount);
    values.checkAmount = currencyData.getRealValue(values.checkAmount);
    values.transferAmount = currencyData.getRealValue(values.transferAmount);
    values.othersAmount = currencyData.getRealValue(values.othersAmount);
    values.disbursementTotalAmount = currencyData.getRealValue(values.disbursementTotalAmount);

    values.commissionAmountIop = currencyData.getRealValue(values.commissionAmountIop);
    values.notaryIop = currencyData.getRealValue(values.notaryIop);
    values.stampsIop = currencyData.getRealValue(values.stampsIop);


    values.autonomyCode = values?.autonomyCode ?? "";
    values.autonomyUser = values?.autonomyUser ?? "";
    values.subCategoryCode = values?.subCategoryCode ?? "";
    values.authType = values?.authType ?? "";
    values.billsCombined = billsCombined;
    values.creditDestination = catalogoDestinoSet ?? "";
    values.fundsDestination = fundsDestinationSet ?? "";
    values.fundsPurposeCode = fundsPurposeCodeSet ?? "";
    values.originationRef = originationRefSet ?? "";
    values.sourceSalesCod = sourceSalesSet ?? "";
    values.sourceSalesDesc = sourceSalesSet ?? "";
    values.writingType = writingTypeSet ?? "";
    values.termAmt = Number(values?.termAmt ?? 0);
    values.disbursementTermType = disbursementTermTypeSet ?? "";
    values.settlement = settlementSet ?? "";
    values.pmtMethod = pmtMethodSet ?? "";
    setIsActiveLoading(true);
    props.onSaveProcess(4, {
      ...instructive, ...values
    }).then(resp => {
      setIsActiveLoading(false);
    });

    //onSubmit(values);
  }

  function productRenderF(data) {
    setproductRender(<Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
      showSearch
      style={{ width: "100%" }}
      placeholder={t("SearchtoSelect")}
      optionFilterProp="children"
      defaultValue={data}
      onChange={(e) => { setproduct(e) }}
      filterOption={(input, option) =>
        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {productCatalogue?.length > 0 ?

        productCatalogue?.map((item, index) => (
          <Option key={index} value={item.value}>{item.label}</Option>
        ))
        : null}
    </Select>)
  }
  function lineCreditSelect(data = "") {
    console.log(numeroLineaMaster);
    // Queda pendiente auto cargar el dato porque aun no se sabe el nombre del servicio
    setnumberLine(<Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
      showSearch
      style={{ width: "100%" }}
      placeholder={t("SearchtoSelect")}
      optionFilterProp="children"
      defaultValue={data}
      onChange={(e) => { setnumeroLineaSelect(e) }}
      filterOption={(input, option) =>
        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {numeroLineaMaster?.length > 0 ?

        numeroLineaMaster?.map((item, index) => (
          <Option key={index} value={item.lineId}>{item.lineId}</Option>
        ))
        : null}
    </Select>)
  }
  function subProductRenderF(data, subProductCatalogue) {
    setsubProductRender(<Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
      showSearch
      style={{ width: "100%" }}
      placeholder={t("SearchtoSelect")}
      optionFilterProp="children"
      defaultValue={data}
      onChange={(e) => { setsubProduct(e) }}
      filterOption={(input, option) =>
        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {subProductCatalogue?.length > 0 ?

        subProductCatalogue?.map((item, index) => (
          <Option key={index} value={item.Code}>{item.Description}</Option>
        ))
        : null}
    </Select>)
  }
  function loanTypeRenderF(data, loanTypeCatalogue) {
    setloanTypeRender(<Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
      showSearch
      style={{ width: "100%" }}
      placeholder={t("SearchtoSelect")}
      optionFilterProp="children"
      defaultValue={data}
      onChange={(e) => { setloanType(e) }}
      filterOption={(input, option) =>
        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {loanTypeCatalogue?.length > 0 ?

        loanTypeCatalogue?.map((item, index) => (
          <Option key={index} value={item.id}>{item.description}</Option>
        ))
        : null}
    </Select>)
  }
  function feciRenderF(data, feciCatalogue) {
    setfeciRender(<Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
      showSearch
      style={{ width: "100%" }}
      placeholder={t("SearchtoSelect")}
      optionFilterProp="children"
      defaultValue={data}
      onChange={(e) => { setfeci(e) }}
      filterOption={(input, option) =>
        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {feciCatalogue?.length > 0 ?

        feciCatalogue?.map((item, index) => (
          <Option key={index} value={item.value}>{item.label}</Option>
        ))
        : null}
    </Select>);
  }
  function branchRenderF(data, branchCatalogue) {
    setbranchRender(<Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
      showSearch
      style={{ width: "100%" }}
      placeholder={t("SearchtoSelect")}
      optionFilterProp="children"
      defaultValue={data}
      onChange={(e) => { setbranch(e) }}
      filterOption={(input, option) =>
        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {branchCatalogue?.length > 0 ?

        branchCatalogue?.map((item, index) => (
          <Option key={index} value={item.Code}>{item.Description}</Option>
        ))
        : null}
    </Select>)
  }
  function monthlyLetterFeciRenderF(data, monthlyLetterFeciCatalogue) {
    setmonthlyLetterFeciRender(<Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
      showSearch
      style={{ width: "100%" }}
      placeholder={t("SearchtoSelect")}
      optionFilterProp="children"
      defaultValue={data}
      onChange={(e) => { setmonthlyLetterFeci(e) }}
      filterOption={(input, option) =>
        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {monthlyLetterFeciCatalogue?.length > 0 ?

        monthlyLetterFeciCatalogue?.map((item, index) => (
          <Option key={index} value={item.value}>{item.label}</Option>
        ))
        : null}
    </Select>)
  }
  function interestPaymentCycleRenderF(data, interestPaymentCycleCatalogue) {
    setinterestPaymentCycleRender(<Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
      showSearch
      style={{ width: "100%" }}
      placeholder={t("SearchtoSelect")}
      optionFilterProp="children"
      defaultValue={data}
      onChange={(e) => { setinterestPaymentCycle(e) }}
      filterOption={(input, option) =>
        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {interestPaymentCycleCatalogue?.length > 0 ?

        interestPaymentCycleCatalogue?.map((item, index) => (
          <Option key={index} value={item.id}>{item.description}</Option>
        ))
        : null}
    </Select>);
  }
  function capitalPaymentCycleRenderF(data, capitalPaymentCycleCatalogue) {
    setcapitalPaymentCycleRender(<Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
      showSearch
      style={{ width: "100%" }}
      placeholder={t("SearchtoSelect")}
      optionFilterProp="children"
      defaultValue={data}
      onChange={(e) => { setcapitalPaymentCycle(e) }}
      filterOption={(input, option) =>
        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {capitalPaymentCycleCatalogue?.length > 0 ?

        capitalPaymentCycleCatalogue?.map((item, index) => (
          <Option key={index} value={item.id}>{item.description}</Option>
        ))
        : null}
    </Select>)
  }
  function destinyCountryRenderF(data, destinyCountryCatalogue) {
    setdestinyCountryRender(<Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
      showSearch
      style={{ width: "100%" }}
      placeholder={t("SearchtoSelect")}
      optionFilterProp="children"
      defaultValue={data}
      onChange={(e) => { loadProvince(e); setdestinyCountry(e) }}
      filterOption={(input, option) =>
        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {destinyCountryCatalogue?.length > 0 ?

        destinyCountryCatalogue?.map((item, index) => (
          <Option key={index} value={item.Code}>{item.Description}</Option>
        ))
        : null}
    </Select>)
  }
  function provinceRenderF(data, provinceCatalogue) {
    setprovinceRender(<Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
      showSearch
      style={{ width: "100%" }}
      placeholder={t("SearchtoSelect")}
      optionFilterProp="children"
      defaultValue={data}
      onChange={(e) => { setprovince(e) }}
      filterOption={(input, option) =>
        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {provinceCatalogue?.length > 0 ?

        provinceCatalogue?.map((item, index) => (
          <Option key={index} value={item.Code}>{item.Description}</Option>
        ))
        : null}
    </Select>);
  }
  function activityTypeRenderF(data, activityTypeCatalogue) {
    setactivityTypeRender(<Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
      showSearch
      style={{ width: "100%" }}
      placeholder={t("SearchtoSelect")}
      optionFilterProp="children"
      defaultValue={data}
      onChange={(e) => { setactivityType(e) }}
      filterOption={(input, option) =>
        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {activityTypeCatalogue?.length > 0 ?

        activityTypeCatalogue?.map((item, index) => (
          <Option key={index} value={item.Code}>{item.Description}</Option>
        ))
        : null}
    </Select>)
  }
  function cinuActivityRenderF(data, cinuActivityCatalogue) {
    setcinuActivityRender(<Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
      showSearch
      style={{ width: "100%" }}
      placeholder={t("SearchtoSelect")}
      optionFilterProp="children"
      defaultValue={Boolean(data)}
      onChange={(e) => { setcinuActivity(e) }}
      filterOption={(input, option) =>
        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {cinuActivityCatalogue?.length > 0 ?

        cinuActivityCatalogue?.map((item, index) => (
          <Option key={index} value={item.value}>{item.label}</Option>
        ))
        : null}
    </Select>)
  }
  function dutyFreeRenderF(data, dutyFreeCatalogue) {
    setdutyFreeRender(<Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
      showSearch
      style={{ width: "100%" }}
      placeholder={t("SearchtoSelect")}
      optionFilterProp="children"
      defaultValue={data}
      onChange={(e) => { setdutyFree(e) }}
      filterOption={(input, option) =>
        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {dutyFreeCatalogue?.length > 0 ?

        dutyFreeCatalogue?.map((item, index) => (
          <Option key={index} value={item.value}>{item.label}</Option>
        ))
        : null}
    </Select>);
  }
  function saleChannelRenderF(data, saleChannelCatalogue) {
    setsaleChannelRender(<Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
      showSearch
      style={{ width: "100%" }}
      placeholder={t("SearchtoSelect")}
      optionFilterProp="children"
      defaultValue={Boolean(data)}
      onChange={(e) => { setsaleChannel(e) }}
      filterOption={(input, option) =>
        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {saleChannelCatalogue?.length > 0 ?

        saleChannelCatalogue?.map((item, index) => (
          <Option key={index} value={item.value}>{item.label}</Option>
        ))
        : null}
    </Select>)
  }
  function toDifferIopRenderF(data, toDifferIopCatalogue) {
    settoDifferIopRender(<Select disabled={props?.DeshabilitarSelect ?? false} noOptionsMessage={() => ""}
      showSearch
      style={{ width: "100%" }}
      placeholder={t("SearchtoSelect")}
      optionFilterProp="children"
      defaultValue={data}
      onChange={(e) => { settoDifferIop(e) }}
      filterOption={(input, option) =>
        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {toDifferIopCatalogue?.length > 0 ?

        toDifferIopCatalogue?.map((item, index) => (
          <Option key={index} value={item.value}>{item.label}</Option>
        ))
        : null}
    </Select>);
  }
  function indexedRateRenderF() { }
  function pawnIopRenderF() { }

  function check(e) {
    let tecla = (document.all) ? e.keyCode : e.which;
    //Tecla de retroceso para borrar, siempre la permite
    if (tecla == 45) {
      e.preventDefault();
      return true;
    }

    return false;
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
  // function consultarLinea(data = dataLocation) {
  //   const backendServices = new BackendServices();
  //   backendServices.getCreditLine(data?.transactionId ?? 0).then(resp => {
  //     if (resp.length > 0 && resp != undefined) {
  //       setsetnumeroLineaMaster(resp)
  //     }
  //   })
  // }
  return (

    <React.Fragment>

      <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit} autoComplete="off">

        <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>


          <Row>
            <Col md="12">
              <Row>
                <Col md="12">
                  <h4 className="card-title mb-3">{t("Disbursement Instructions - Below Line")}</h4>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <span className="mb-3" style={S_seccions}>{t("General Data")}</span>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="field58">{t("InstructiveDate")}</Label>                     {/*No Item*/}

                    <Flatpickr
                      id="instructiveDate"
                      name="instructiveDate"
                      className="form-control d-block"
                      placeholder={OPTs.FORMAT_DATE_SHOW}
                      options={{
                        dateFormat: OPTs.FORMAT_DATE,
                        //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                        defaultDate: DataGeneral !== undefined && DataGeneral !== null ? new Date(moment(DataGeneral.instructiveDate, 'YYYY-MM-DD').format()) : new Date()
                      }}
                    //onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr,"DD/MM/YYYY").format("YYYY-MM-DD") } }) }}
                    />

                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="loannumber">{t("Loan number")}</Label>                     {/*No Item*/}
                    <AvField
                      className="form-control"
                      name="loannumber"
                      type="text"
                      // validate={{
                      //   required: { value: true, errorMessage: t("Required Field") },
                      // }}
                      value={DataGeneral?.loan ?? ''} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="field58">{t("Credit Proposal No")} {dataLocation?.transactionId ?? 0}</Label>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="field58">{t("Customer ID")}</Label>                     {/*No Item*/}
                    <AvField
                      className="form-control"
                      name="customerT24"
                      type="text"
                      // disabled={true}
                      id="customerT24"
                      validate={{
                        required: { value: true, errorMessage: t("Required Field") },
                      }}
                      value={DataGeneral?.customerT24 ?? customerT24}>
                    </AvField>
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="field58">{t("Name of the Client (Debtor)")}</Label>                     {/*No Item*/}
                    <AvField
                      className="form-control"
                      name="product"
                      type="text"
                      disabled={true}
                      id="product"
                      value={customerNameT24}>
                      <option value="3200">{ }</option>

                    </AvField>
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="field58">{t("Tramit number")}</Label>                     {/*No Item*/}
                    <AvField
                      className="form-control"
                      name="disbursementTransact"
                      type="text"
                      id="disbursementTransact"
                      value={DataGeneral?.disbursementTransact ?? ''}>

                    </AvField>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="product">{t("product")}</Label>
                    {productRender}
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="subproduct">{t("subproduct")}</Label>
                    {subProductRender}
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="field-5">{t("LoanType")}</Label>                 {/**NoItem*/}
                    {loanTypeRender}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="5">
                  <div className="mb-3">
                    <Label htmlFor="field58">{t("Credit Line Number - Analyst")}</Label>                     {/*No Item*/}
                    <AvField
                      className="form-control"
                      name="line"
                      type="text"
                      id="line"
                      value={DataGeneral?.line ?? ''} />
                  </div>
                </Col>
                <Col md="4">
                  <Row>
                    <Col md="10">
                      <Label htmlFor="masterLine">{t("Master line number (if applicable)")}</Label>
                      <AvField
                        className="form-control"
                        name="masterLine"
                        type="text"
                        id="masterLine"
                        readOnly={true}
                        value={numeroLineaMaster ?? ''} />

                    </Col>
                    <Col md="2" style={{ marginTop: "auto" }}>
                      <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                        // <Button className="btn" color="success" disabled={numeroLineaMaster==null?false:true} type="button" style={{ margin: '5px' }} onClick={() => {
                        setmodalCreacionLinea(true)
                      }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
                    </Col>
                  </Row>
                </Col>
                {/* <Col md="5">
                  <div className="mb-3">
                    <Label htmlFor="field58">{t("Master line number (if applicable)")}</Label>                    
                    {numberLine}
                  </div>
                </Col> */}
              </Row>
              {/* Nuevos campos */}
              <Row>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="autonomyCode">{t("Cutonomy code")}</Label>
                    <AvField
                      className="form-control"
                      name="autonomyCode"
                      type="text"
                      id="autonomyCode"
                      value={DataGeneral?.autonomyCode ?? ''} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="autonomyUser">{t("Autonomy User")}</Label>
                    <AvField
                      className="form-control"
                      name="autonomyUser"
                      type="text"
                      id="autonomyUser"
                      value={DataGeneral?.autonomyUser ?? ''} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="subCategoryCode">{t("Subcategory Code")}</Label>
                    <AvField
                      className="form-control"
                      name="subCategoryCode"
                      type="text"
                      id="subCategoryCode"
                      value={DataGeneral?.subCategoryCode ?? ""} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="saleChannel">{t("SalesChannel")}</Label>
                    <AvField
                      className="form-control"
                      name="saleChannel"
                      type="text"
                      id="saleChannel"
                      value={DataGeneral?.saleChannel ?? ''} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="authType">{t("Authorization type")}</Label>
                    <AvField
                      className="form-control"
                      name="authType"
                      type="text"
                      id="authType"
                      value={DataGeneral?.authType ?? ''} />
                  </div>
                </Col>
                <Col md="2">
                  <div className="mb-3">
                    <Label htmlFor="authType">{t("Principal Interest")}</Label>
                    <AvGroup check className="">
                      <Switch name="preapproval"
                        uncheckedIcon={<Offsymbol />}
                        checkedIcon={<OnSymbol />}
                        onColor="#007943"
                        className="form-label"
                        onChange={(e) => { setbillsCombined(!billsCombined) }}
                        checked={billsCombined}
                      />
                    </AvGroup>
                  </div>
                </Col>
                <Col md="2">
                  <div className="mb-3">
                    <Label htmlFor="authType">{t("Disbursement into account")}</Label>
                    <AvGroup check className="">
                      <Switch name="preapproval"
                        uncheckedIcon={<Offsymbol />}
                        checkedIcon={<OnSymbol />}
                        onColor="#007943"
                        className="form-label"
                        onChange={(e) => { setsettlementSet(!settlementSet) }}
                        checked={settlementSet}
                      />
                    </AvGroup>
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="termAmt">{t("Amount Term or disbursement term")}</Label>
                    <AvField
                      className="form-control"
                      name="termAmt"
                      type="number"
                      id="termAmt"
                      value={DataGeneral?.termAmt ?? ''} />
                  </div>
                </Col>
                {selectsData}
              </Row>
              <Row>
                <Col md="12">
                  <span className="mb-3" style={S_seccions}>{t("Loan Data")}</span>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="afiRequest">{t("SAFI Application Number")}</Label>                     {/*No Item*/}
                    <AvField
                      className="form-control"
                      name="afiRequest"
                      type="text"
                      id="afiRequest"
                      validation={{ required: true }}
                      value={DataGeneral?.afiRequest ?? ''} />
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="disbursementAmount">{t("Amount")}</Label>                     {/*No Item*/}
                    <AvField
                      className="form-control"
                      name="disbursementAmount"
                      type="text"
                      id="disbursementAmount"
                      onKeyPress={(e) => { return check(e) }}
                      pattern="^[0-9,.]*$"
                      onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                      validation={{ required: true }}
                      value={currencyData.format(DataGeneral?.disbursementAmount ?? 0)} />
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="field58">{t("Interest Rate")}</Label>                     {/*No Item*/}
                    <AvField
                      className="form-control"
                      name="interestRate"
                      type="text"
                      id="interestRate"
                      onKeyUp={(e) => { let x = currencyData.getRealPercent(e.target.value); e.target.value = currencyData.formatPercent(x, e); }}
                      onChange={(e) => { let x = currencyData.getRealPercent(e.target.value); parseFloat(x) > 100 ? setcampoTasa(true) : setcampoTasa(false); }}
                      value={`${DataGeneral?.interestRate ?? 0}%`} />
                    {campoTasa ?
                      <p className="message-error-parrafo">{t("Thepercentageexceeds100%")}</p>
                      : null}
                  </div>
                </Col>

              </Row>
              <Row>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="field58">{t("FECI")}</Label>                     {/*No Item*/}
                    {feciRender}
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="field58">{t("branchoffice")}</Label>                     {/*No Item*/}
                    {branchRender}
                  </div>
                </Col>

                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="disbursementTerm">{t("Disbursement Term/Deadline")}</Label>                     {/*No Item*/}
                    <AvField
                      className="form-control"
                      name="disbursementTerm"
                      onKeyPress={(e) => { return check(e) }}
                      min={0}
                      type="number"
                      id="disbursementTerm"
                      validation={{ required: true }}
                      value={DataGeneral?.disbursementTerm ?? ''} />
                  </div>
                </Col>

              </Row>
              <Row>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="debitAccount">{t("debitaccountnumber")}</Label>                     {/*No Item*/}
                    <AvField
                      className="form-control"
                      name="debitAccount"
                      onKeyPress={(e) => { return check(e) }}
                      min={0}
                      type="number"
                      id="debitAccount"
                      validation={{ required: true }}
                      value={DataGeneral?.debitAccount ?? ''} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="toName">{t("A/N")}</Label>                     {/*No Item*/}
                    <AvField
                      className="form-control"
                      name="toName"
                      type="text"
                      id="toName"
                      validation={{ required: true }}
                      value={DataGeneral?.toName ?? ''} />
                  </div>
                </Col>

              </Row>
              <Row>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="field01">{t("MonthlyBil")}</Label>                           {/**NoItem */}
                    {monthlyLetterFeciRender}
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="interestPaymentCycle">{t("InterestPaymentCycle")}</Label>
                    {interestPaymentCycleRender}
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="capitalPaymentCycle">{t("Payment Cycle at Maturity Capital")}</Label>
                    {capitalPaymentCycleRender}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="nextPaymentDate">{t("Next payment date")}</Label>                     {/*No Item*/}

                    <Flatpickr
                      id="nextPaymentDate"
                      name="nextPaymentDate"
                      className="form-control d-block"
                      placeholder={OPTs.FORMAT_DATE_SHOW}
                      options={{
                        dateFormat: OPTs.FORMAT_DATE,
                        //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                        defaultDate: DataGeneral !== undefined && DataGeneral !== null ? new Date(moment(DataGeneral.nextPaymentDate, 'YYYY-MM-DD').format()) : new Date()
                      }}
                    //onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr,"DD/MM/YYYY").format("YYYY-MM-DD") } }) }}
                    />

                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="destinyCountry">{t("Destinationcountry")}</Label>
                    {destinyCountryRender}
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="province">{t("Province")}</Label>
                    {provinceRender}
                  </div>
                </Col>
              </Row>
              <Row>

                <Col md="3">
                  <div className="mb-3">
                    <Label htmlFor="activityType">{t("Typeofactivity")}</Label>
                    {activityTypeRender}
                  </div>
                </Col>

                <Col md="3">
                  <div className="mb-3">
                    <Label htmlFor="province">{t("CINU Activity")}</Label>
                    {cinuActivityRender}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <div className="mb-3">
                    <Label htmlFor="detail">{t("DetailWidely")}</Label>                            {/**No Item */}
                    <AvField
                      className="form-control"
                      name="detail"
                      validation={{ required: true }}
                      type="textarea"
                      rows={7}
                      id="detail"
                      value={DataGeneral?.detail ?? ''} />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="5">
                  <div className="mb-3">
                    <Label htmlFor="province">{t("Final destination of the disbursement is for Free Zone")}</Label>
                    {dutyFreeRender}
                  </div>
                </Col>
                {/* <Col md="3">
                  <div className="mb-3">
                    <Label htmlFor="field59">{t("SalesChannel")}</Label>
                    {saleChannelRender}
                  </div>
                </Col> */}
              </Row>

              <Row>
                <Col md="12">
                  <span className="mb-3" style={S_seccions}>{t("Disbursement Instructions")}</span>
                </Col>
              </Row>

              <Row>
                <Col md="4">
                  <div className="mb-3">
                    <div className="kt-checkbox-list">
                      <label className="kt-checkbox d-flex flex-row justify-content-between align-items-center">
                        <span>{t("Crédito a Cuenta")}</span>
                        <AvGroup check className="">
                          <Switch name="preapproval"
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
                          <Switch name="preapproval"
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
                          <Switch name="preapproval"
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
                          <Switch name="preapproval"
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
                    <Label htmlFor="creditAccountNumber">{t("Credit to account Number")}</Label>
                    <AvField
                      className="form-control"
                      name="creditAccountNumber"
                      min={0}
                      type="number"
                      onKeyPress={(e) => { return check(e) }}
                      id="creditAccountNumber"
                      value={DataGeneral?.creditAccountNumber ?? ''} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="accountName">{t("Account name")}</Label>
                    <AvField
                      className="form-control"
                      name="accountName"
                      type="text"
                      id="accountName"
                      value={DataGeneral?.accountName ?? ''} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="creditAccountAmount">{t("Amount")}</Label>
                    <AvField
                      className="form-control"
                      name="creditAccountAmount"
                      type="text"
                      id="creditAccountAmount"
                      onKeyUp={(e) => {
                        let x = currencyData.getRealValue(e.target.value);
                        e.target.value = currencyData.format(x);
                      }}
                      onChange={(e) => { sumdisbursementTotalAmount(); }}
                      onKeyPress={(e) => { return check(e) }}
                      pattern="^[0-9,.]*$"
                      value={currencyData.format(DataGeneral?.creditAccountAmount ?? 0)} />
                  </div>
                </Col>
              </Row>)}

              {checker && (<Row>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="checkNumber">{t("Cashier's Check No")}</Label>
                    <AvField
                      className="form-control"
                      name="checkNumber"
                      min={0}
                      type="number"
                      onKeyPress={(e) => { return check(e) }}
                      id="checkNumber"
                      value={DataGeneral?.checkNumber ?? ''} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="beneficiary">{t("Beneficiary")}</Label>
                    <AvField
                      className="form-control"
                      name="beneficiary"
                      type="text"
                      id="beneficiary"
                      value={DataGeneral?.beneficiary ?? ''} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="checkAmount">{t("Amount")}</Label>
                    <AvField
                      className="form-control"
                      name="checkAmount"
                      type="text"
                      id="checkAmount"
                      onKeyUp={(e) => {
                        let x = currencyData.getRealValue(e.target.value);
                        e.target.value = currencyData.format(x);
                      }}
                      onChange={(e) => { sumdisbursementTotalAmount(); }}
                      onKeyPress={(e) => { return check(e) }}
                      pattern="^[0-9,.]*$"
                      value={currencyData.format(DataGeneral?.checkAmount ?? 0)} />
                  </div>
                </Col>
              </Row>)}

              {transfer && (<Row>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="transferenceNumber">{t("No Transferencia")}</Label>
                    <AvField
                      className="form-control"
                      name="transferenceNumber"
                      type="text"
                      id="transferenceNumber"
                      value={DataGeneral?.transferenceNumber ?? ''} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="transferenceBeneficiary">{t("Beneficiary")}</Label>
                    <AvField
                      className="form-control"
                      name="transferenceBeneficiary"
                      type="text"
                      id="transferenceBeneficiary"
                      value={DataGeneral?.transferenceBeneficiary ?? ''} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="transferAmount">{t("Amount")}</Label>
                    <AvField
                      className="form-control"
                      name="transferAmount"
                      type="text"
                      id="transferAmount"
                      onKeyUp={(e) => {
                        let x = currencyData.getRealValue(e.target.value);
                        e.target.value = currencyData.format(x);
                      }}
                      onChange={(e) => { sumdisbursementTotalAmount(); }}
                      onKeyPress={(e) => { return check(e) }}
                      pattern="^[0-9,.]*$"
                      value={currencyData.format(DataGeneral?.transferAmount ?? 0)} />
                  </div>
                </Col>
              </Row>)}

              {others && (<Row>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="othersItem">{t("Others")}</Label>
                    <AvField
                      className="form-control"
                      name="othersItem"
                      min={0}
                      type="number"
                      onKeyPress={(e) => { return check(e) }}
                      id="othersItem"
                      value={DataGeneral?.othersItem ?? ''} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="othersDescription">{t("Description")}</Label>
                    <AvField
                      className="form-control"
                      name="othersDescription"
                      type="text"
                      id="othersDescription"
                      value={DataGeneral?.othersDescription ?? ''} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="othersAmount">{t("Amount")}</Label>
                    <AvField
                      className="form-control"
                      name="othersAmount"
                      type="text"
                      id="othersAmount"
                      onKeyUp={(e) => {
                        let x = currencyData.getRealValue(e.target.value);
                        e.target.value = currencyData.format(x);
                      }}
                      onChange={(e) => {
                        sumdisbursementTotalAmount();
                      }}
                      onKeyPress={(e) => { return check(e) }}
                      pattern="^[0-9,.]*$"
                      value={currencyData.format(DataGeneral?.othersAmount ?? 0)} />
                  </div>
                </Col>
              </Row>)}

              <Row>
                <Col md="12" className="d-flex flex-row justify-content-between">
                  <Col md="3">
                    <div className="mb-3">
                      <Label htmlFor="cppNumber">{t("No. CPP")}</Label>
                      <AvField
                        className="form-control"
                        name="cppNumber"
                        type="text"
                        id="cppNumber"
                        value={DataGeneral?.cppNumber ?? ''} />
                    </div>
                  </Col>
                  <Col md="3">
                    <div className="mb-3">
                      <Label htmlFor="disbursementTotalAmount">{t("Total amount")}</Label>
                      <AvField
                        className="form-control"
                        name="disbursementTotalAmount"
                        type="text"
                        disabled={true}
                        onChange={(e) => { return check(e) }}
                        pattern="^[0-9,.]*$"
                        onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        id="disbursementTotalAmount"
                        value={disbursementTotalAmount} />
                    </div>
                  </Col>
                </Col>
              </Row>


              <Row>
                <Col md="12">
                  <div className="mb-3">
                    <Label htmlFor="specialInstructions">{t("Specialinstructions")}</Label>
                    <AvField
                      className="form-control"
                      name="specialInstructions"
                      validation={{ required: true }}
                      type="textarea" rows={7}
                      id="specialInstructions"
                      value={DataGeneral?.specialInstructions ?? ''} />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md="12">
                  <span className="mb-3" style={S_seccions}>{t("Operating Instructions")}</span>
                </Col>
              </Row>

              <Row>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="commissionAmountIop">{t("Commission amount")}</Label>
                    <AvField
                      className="form-control"
                      name="commissionAmountIop"
                      type="text"
                      id="commissionAmountIop"
                      validation={{ required: true }}
                      onKeyPress={(e) => { return check(e) }}
                      pattern="^[0-9,.]*$"
                      onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                      value={currencyData.format(DataGeneral?.commissionAmountIop ?? 0)} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="itbmsIop">{t("ITBM")}</Label>
                    <AvField
                      className="form-control"
                      name="itbmsIop"
                      type="text"
                      id="itbmsIop"
                      pattern="^[0-9,.]*$"
                      onKeyPress={(e) => { return check(e) }}
                      onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                      validation={{ required: true }}
                      value={currencyData.format(DataGeneral?.itbmsIop ?? 0)} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="field59">{t("To differ")}</Label>
                    {toDifferIopRender}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="notaryIop">{t("Notary")}</Label>                     {/*No Item*/}
                    <AvField
                      className="form-control"
                      name="notaryIop"
                      type="text"
                      id="notaryIop"
                      onKeyPress={(e) => { return check(e) }}
                      pattern="^[0-9,.]*$"
                      onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                      validation={{ required: true }}
                      value={currencyData.format(DataGeneral?.notaryIop ?? 0)} />
                  </div>
                </Col>
                <Col md="4">
                  <div className="mb-3">
                    <Label htmlFor="stampsIop">{t("Stamps")}</Label>                     {/*No Item*/}
                    <AvField
                      className="form-control"
                      name="stampsIop"
                      type="text"
                      pattern="^[0-9,.]*$"
                      onKeyPress={(e) => { return check(e) }}
                      onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                      id="stampsIop"
                      validation={{ required: true }}
                      value={currencyData.format(DataGeneral?.stampsIop ?? 0)} />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <div className="mb-3">
                    <Label htmlFor="instructionsIop">{t("Special instructions Administration review")}</Label>                            {/**No Item */}
                    <AvField
                      className="form-control"
                      name="instructionsIop"
                      validation={{ required: true }}
                      type="textarea" rows={7}
                      id="instructionsIop"
                      value={DataGeneral?.instructionsIop ?? ''} />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row >

        </LoadingOverlay >

        <Row style={{ textAlign: "right" }}>
          <Col md={12}>

            <Button color="primary" type="submit" disabled={props?.DeshabilitarSelect ?? false} style={{ margin: '5px' }}>
              <i className="mdi mdi-content-save-outline mid-12px"></i>{" "} {t("Save")}
            </Button>
            {/* <Button color="success" type="button" onClick={() => { props.onSaveProcess(1); }} style={{ margin: '5px' }}>
              <i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i>{" "} {t("GenerateDocument")}
            </Button> */}

          </Col>
        </Row>
      </AvForm>
      <ModalCreacionLinea facilityType={props?.facilityType} facilityId={props?.facilityId ?? 0} isOpen={modalCreacionLinea} toggle={() => { setmodalCreacionLinea(false) }} cerrarModalLinea={cerrarModalLinea} />
    </React.Fragment >


  );

}

export default (withTranslation()(DatosGeneralesBL))
