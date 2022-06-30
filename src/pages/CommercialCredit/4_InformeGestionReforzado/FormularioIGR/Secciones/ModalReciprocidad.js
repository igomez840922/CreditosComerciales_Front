import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
import * as opt from "../../../../../helpers/options_helper"
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
} from "reactstrap"
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import Select from "react-select";
import Currency from "../../../../../helpers/currency";
import { BackendServices, CoreServices, BpmServices, } from "../../../../../services";
import SessionHelper from "../../../../../helpers/SessionHelper";
import moment from "moment";

import { GetMontNumberByName, GetMontNameByNumber, Capitalize, OnlyNumber } from '../../../../../helpers/commons'

const ModalReciprocidad = (props) => {
  const currencyData = new Currency();
  const { t, i18n } = useTranslation();
  const [campoRequeridoAno, setcampoRequeridoAno] = useState(false);
  const [campoRequeridoMes, setcampoRequeridoMes] = useState(false);
  const [year, setyear] = useState("0000");
  const [month, setmonth] = useState(null);
  const [mesSelect, setmesSelect] = useState(undefined);
  const meses = [{ label: t("January"), value: t("January") }
    , { label: t("February"), value: t("February") },
  { label: t("March"), value: t("March") },
  { label: t("April"), value: t("April") },
  { label: t("May"), value: t("May") },
  { label: t("June"), value: t("June") },
  { label: t("July"), value: t("July") },
  { label: t("August"), value: t("August") },
  { label: t("September"), value: t("September") },
  { label: t("October"), value: t("October") },
  { label: t("November"), value: t("November") },
  { label: t("December"), value: t("December") }];

  const [mainDebtor, setmainDebtor] = useState(null);

  const [coreServices, setcoreServices] = useState(new CoreServices());
  const [backendServices, setbackendServices] = useState(new BackendServices());
  const [sessionHelper, setsessionHelper] = useState(new SessionHelper());

  const [deposits, setdeposits] = useState(null)
  const [averageBalance, setaverageBalance] = useState(null)
  const [debts, setdebts] = useState(null)

  const [reciprocity, setreciprocity] = useState(null)
  const [sow, setsow] = useState(null)
  const [sales, setsales] = useState(null)

  React.useEffect(() => {
    setdeposits(currencyData.format(props?.dataRecipro?.deposits ?? 0))
    setaverageBalance(currencyData.format(props?.dataRecipro?.averageBalance ?? 0))
    setreciprocity(currencyData.format(props?.dataRecipro?.reciprocity ?? 0) + "%")
    setsow((props?.dataRecipro?.sow ?? 0))
    setsales(currencyData.format(props?.dataRecipro?.sales ?? 0))
    var result = sessionHelper.get(opt.VARNAME_LOCATIONDATA);
    if (result !== undefined && result !== null) {
      loadMainDebtor(result.transactionId)
    }
    // Read Api Service data
    var defaultVal = null;
    setmesSelect(undefined)

    setyear(props.dataRecipro?.year ?? "0000")
    try {
      // console.log(meses.length );
      // console.log(props.dataRecipro.month );
      // console.log(mesSelect);
      if (meses.length > 0 && props.dataRecipro.month != null) {
        defaultVal = meses.find(x => (x.value).toUpperCase() == (props.dataRecipro.month).toUpperCase());
        if (defaultVal !== undefined) {
          setmesSelect(defaultVal);
          setmonth(defaultVal.value.toUpperCase())
        }
      }
      else {
        defaultVal = meses[0];
        setmesSelect(defaultVal);
        setmonth(defaultVal.value.toUpperCase());
      }

      getDeposits(props.dataRecipro?.year);

    }
    catch (err) { }
  }, [props.isOpen]);

  React.useEffect(() => {
    getReciprocityT24();
    getDebts();
  }, [year, month, mainDebtor]);

  React.useEffect(() => {
    calculateData()
  }, [sales, deposits, averageBalance, reciprocity, sow, debts]);

  //cargar deudor principal
  async function loadMainDebtor(transactionId) {
    var result = await backendServices.consultPrincipalDebtor(transactionId)
    if (result !== undefined && result !== null) {
      setmainDebtor(result);
    }
  }

  // Submitimos formulario para busqueda de clientes
  function handleSubmit(event, errors, values) {
    values.requestDate = document.getElementById("requestDate").value

    console.log(values, errors, event)
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }

    // values.sales = sales !== null ? sales : props.dataRecipro.sales;
    // values.averageBalance = averageBalance !== null ? averageBalance : props.dataRecipro.averageBalance;
    // values.deposits = deposits !== null ? deposits : props.dataRecipro.deposits;
    // values.reciprocity = reciprocity !== null ? reciprocity : props.dataRecipro.reciprocity;
    // values.sow = sow !== null ? sow : props.dataRecipro.sow;
    // values.year = year !== null ? year : props.dataRecipro.year;
    // values.month = mesSelect?.value ?? "Enero";
    values.sales = Number(currencyData.getRealValue(values?.sales ?? 0));
    // values.averageBalance = averageBalance !== null ? averageBalance : props.dataRecipro.averageBalance;
    values.averageBalance = "";
    values.deposits = Number(currencyData.getRealValue(values?.deposits ?? 0));
    values.reciprocity = reciprocity !== null ? reciprocity.replace("%", "") : props.dataRecipro.reciprocity.replace("%", "");
    values.sow = Number(currencyData.getRealValue((values?.sow.replace("%", "")) ?? 0));
    values.year = year !== null ? year : props.dataRecipro.year;
    values.month = mesSelect?.value ?? "Enero";
    // return
    if (props.tipo == "guardar") {
      props.dataManagament(values, props.tipo);
    } else {
      values.reciprocity_id = props.dataRecipro.reciprocity_id;
      props.dataManagament(values, props.tipo);
    }
    // props.onSubmit(values);
  }

  async function getReciprocityT24() {
    if (mainDebtor !== null && year !== null && year > 1995 && year <= Number(moment().format("YYYY")) && month !== null) {
      var result = sessionHelper.get(opt.VARNAME_LOCATIONDATA);
      var data = await coreServices.getReciprocityByYearByTransaction(result.transactionId, year);//await coreServices.getReciprocity(mainDebtor?.customerNumberT24, year,month);
      if (data !== undefined) {
        // setdeposits(currencyData.formatTable(data.deposits ?? 0))
        setaverageBalance(currencyData.getRealValue(data.averageAmt))
      }
    }
  }

  //carga las deudas 
  async function getDebts() {
    if (mainDebtor !== null && year !== null && year > 1995 && year <= Number(moment().format("YYYY")) && month !== null) {

      var monthNum = GetMontNumberByName(month);
      var date = year + "-" + monthNum;

      var result = sessionHelper.get(opt.VARNAME_LOCATIONDATA);
      if (result !== undefined && result !== null) {
        var shortDebts = await backendServices.consultBankingRelationsDebtsCP(result.transactionId)
        if (shortDebts !== undefined && shortDebts.getBankingRelationCPDTOList.length > 0) {
          shortDebts = shortDebts.getBankingRelationCPDTOList.filter((element) => {
            return (element.status === true);//&& element.date.indexOf(date) >= 0
          })
        }

        var longDebts = await backendServices.consultBankRelationsDebtsLP(result.transactionId)
        if (longDebts !== undefined && longDebts.bankingRelationLPDTOList.length > 0) {
          longDebts = longDebts.bankingRelationLPDTOList.filter((element) => {
            return (element.status === true);//&& element.date.indexOf(date) >= 0
          })
        }


        var sowData = { otherBank: 0, banesco: 0, total: 0, sow: 0 }
        sowData.otherBank = 0;
        sowData.banesco = 0;
        ////////////////////////////////////////////////
        if (shortDebts !== null && Array.isArray(shortDebts)) {
          for (var short of shortDebts) {

            if (short.bank.toLowerCase().indexOf('banesco') >= 0) {

              if (short.facilityType.toLowerCase().indexOf('créd') >= 0 || short.facilityType.toLowerCase().indexOf('cred') >= 0 || short.facilityType.toLowerCase().indexOf('tdc') >= 0 || short.facilityType.toLowerCase().indexOf('tarj') >= 0 || short.facilityType.toLowerCase().indexOf('sobregiro') >= 0 || short.facilityType.toLowerCase().indexOf('sobregiros') >= 0 || short.facilityType.toLowerCase().indexOf('lc') >= 0 || short.facilityType.toLowerCase().indexOf('l.') >= 0 || short.facilityType.toLowerCase().indexOf('linea') >= 0 || short.facilityType.toLowerCase().indexOf('línea') >= 0) {
                console.log("linea short", short.facilityType)
                sowData.banesco += Number(short.amount)
                sowData.banesco += Number(short.amount)
              }
              else if (short.facilityType.toLowerCase().indexOf('nueva') >= 0 || short.facilityType.toLowerCase().indexOf('nuevo') >= 0) {
                sowData.banesco += Number(short.amount)
              }
              else {
                sowData.banesco += Number(short.debitBalance1) + Number(short.debitBalance2) + Number(short.debitBalance3)
                sowData.banesco += Number(short.debitBalance1) + Number(short.debitBalance2) + Number(short.debitBalance3)
              }
            }
            else {
              if (short.facilityType.toLowerCase().indexOf('créd') >= 0 || short.facilityType.toLowerCase().indexOf('cred') >= 0 || short.facilityType.toLowerCase().indexOf('tdc') >= 0 || short.facilityType.toLowerCase().indexOf('tarj') >= 0 || short.facilityType.toLowerCase().indexOf('sobregiro') >= 0 || short.facilityType.toLowerCase().indexOf('sobregiros') >= 0 || short.facilityType.toLowerCase().indexOf('lc') >= 0 || short.facilityType.toLowerCase().indexOf('l.') >= 0 || short.facilityType.toLowerCase().indexOf('linea') >= 0 || short.facilityType.toLowerCase().indexOf('línea') >= 0) {
                sowData.otherBank += Number(short.amount)
                sowData.otherBank += Number(short.amount)
              }
              else if (short.facilityType.toLowerCase().indexOf('nueva') >= 0 || short.facilityType.toLowerCase().indexOf('nuevo') >= 0) {
                sowData.otherBank += Number(short.amount)
              }
              else {
                sowData.otherBank += Number(short.debitBalance1) + Number(short.debitBalance2) + Number(short.debitBalance3)
                sowData.otherBank += Number(short.debitBalance1) + Number(short.debitBalance2) + Number(short.debitBalance3)
              }
              //sowApproved.otherBank += Number(short.amount)
              //sowProposal.otherBank += Number(short.debitBalance1) + Number(short.debitBalance2) + Number(short.debitBalance3)
            }
          }
        }
        if (longDebts !== null && Array.isArray(longDebts)) {
          for (var long of longDebts) {

            if (long.bank.toLowerCase().indexOf('banesco') >= 0) {

              if (long.facilityType.toLowerCase().indexOf('créd') >= 0 || long.facilityType.toLowerCase().indexOf('cred') >= 0 || long.facilityType.toLowerCase().indexOf('tdc') >= 0 || long.facilityType.toLowerCase().indexOf('tarj') >= 0 || long.facilityType.toLowerCase().indexOf('sobregiro') >= 0 || long.facilityType.toLowerCase().indexOf('sobregiros') >= 0 || long.facilityType.toLowerCase().indexOf('lc') >= 0 || long.facilityType.toLowerCase().indexOf('l.') >= 0 || long.facilityType.toLowerCase().indexOf('linea') >= 0 || long.facilityType.toLowerCase().indexOf('línea') >= 0) {
                console.log("linea long", long.facilityType)
                sowData.banesco += Number(long.amount)
                sowData.banesco += Number(long.amount)
              }
              else if (long.facilityType.toLowerCase().indexOf('nueva') >= 0 || long.facilityType.toLowerCase().indexOf('nuevo') >= 0) {
                sowData.banesco += Number(long.amount)
              }
              else {
                sowData.banesco += Number(long.debitBalance1) + Number(long.debitBalance2) + Number(long.debitBalance3)
                sowData.banesco += Number(long.debitBalance1) + Number(long.debitBalance2) + Number(long.debitBalance3)
              }
            }
            else {
              if (long.facilityType.toLowerCase().indexOf('créd') >= 0 || long.facilityType.toLowerCase().indexOf('cred') >= 0 || long.facilityType.toLowerCase().indexOf('tdc') >= 0 || long.facilityType.toLowerCase().indexOf('tarj') >= 0 || long.facilityType.toLowerCase().indexOf('sobregiro') >= 0 || long.facilityType.toLowerCase().indexOf('sobregiros') >= 0 || long.facilityType.toLowerCase().indexOf('lc') >= 0 || long.facilityType.toLowerCase().indexOf('l.') >= 0 || long.facilityType.toLowerCase().indexOf('linea') >= 0 || long.facilityType.toLowerCase().indexOf('línea') >= 0) {
                sowData.otherBank += Number(long.amount)
                sowData.otherBank += Number(long.amount)
              }
              else if (long.facilityType.toLowerCase().indexOf('nueva') >= 0 || long.facilityType.toLowerCase().indexOf('nuevo') >= 0) {
                sowData.otherBank += Number(long.amount)
              }
              else {
                sowData.otherBank += Number(long.debitBalance1) + Number(long.debitBalance2) + Number(long.debitBalance3)
                sowData.otherBank += Number(long.debitBalance1) + Number(long.debitBalance2) + Number(long.debitBalance3)
              }
              //sowApproved.otherBank += Number(short.amount)
              //sowProposal.otherBank += Number(short.debitBalance1) + Number(short.debitBalance2) + Number(short.debitBalance3)
            }
          }
        }


        sowData.total = sowData.banesco + sowData.otherBank;
        sowData.sow = sowData.total > 0 ? Number(sowData.banesco / sowData.total * 100) : 0;

        setdebts(sowData)
      }

    }
  }

  async function calculateData() {

    let year = +document.getElementById("requestDate")?.value.split('-')[0];
    let deposit = await getDeposits(year).then(resp => resp);
    setdeposits(currencyData.format(deposit.toFixed(2) ?? 0));

    if (sales > 0) {
      var recipro = (Number((deposit ?? 0)) / Number(sales)) * 100;
      setreciprocity(currencyData.format(Number(recipro).toFixed(2)) + "%")
    }

    //Calcular SOW
    if (debts !== null) {
      //sowShort,sowLong
      setsow((debts.sow));
    }

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

  function getDeposits(year) {
    return new Promise((resolve) => {
      if (!year)
        resolve(0);
      var result = sessionHelper.get(opt.VARNAME_LOCATIONDATA);
      backendServices.consultMovementsBank(result.transactionId).then(resp => {
        if (resp.bankOthersBank.length > 0 || resp.bankBanesco.length > 0) {
          let totalDepositsBanesco = resp.bankOthersBank.filter(bank => +bank.year === year && bank.status).reduce((acu, crr) => acu + crr.deposits, 0);
          let totalDepositsOthers = resp.bankBanesco.filter(bank => +bank.year === year && bank.status).reduce((acu, crr) => acu + crr.deposits, 0);
          let totalDeposits = +totalDepositsBanesco + +totalDepositsOthers.toFixed(2);
          resolve(totalDeposits);
        } else {
          resolve(0);
        }
      });
    });
  }

  return (
    <Modal
      size="md"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <div className="modal-header">
        <h5 className="modal-title mt-0">{t("Reciprocity")}</h5>
        <button
          type="button"
          onClick={props.toggle}
          data-dismiss="modal"
          className="close"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body" style={{ backgroundColor: "#f3f5f7" }}>
        <Row>
          <Col xl="12">
            <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
              <Card>
                <CardBody>
                  <Row>
                    {/* {mesSelect !== undefined ?mesSelect.value:"01"} */}
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="idYear">{t("Date")}</Label>

                        <input
                          className="form-control"
                          name="requestDate"
                          type="month"
                          id="requestDate"
                          max={moment().format("YYYY-MM")}
                          onKeyDown={(e) => { e.preventDefault(); }}
                          onChange={(e) => {
                            setyear(e.target.value.split("-")[0]);
                            var monthselect = e.target.value.split("-")[1];
                            monthselect = GetMontNameByNumber(Number(monthselect));
                            setmonth(monthselect); monthselect = Capitalize(monthselect);
                            setmesSelect(meses.find(x => x.value === monthselect));
                          }}
                          value={moment(year + "-" + (mesSelect !== undefined ? GetMontNumberByName(mesSelect.value.toUpperCase()) : "01")).format("YYYY-MM")}
                        // validate={{
                        //   max: { value: moment().format("YYYY-MM"), errorMessage: t("InvalidField") },
                        // }}
                        />
                      </div>
                    </Col>

                    {/*
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="idYear">{t("Year")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="year"
                          id="year"
                          onChange={(e) => { setyear(e.target.value);}}
                          value={props.dataRecipro.year}
                          validate={{
                            required: { value: true, errorMessage: t("Required Field") },
                            number: { value: true, errorMessage: t("InvalidField") },
                          }}
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="idMonth">{t("Month")}</Label>
                        <Select noOptionsMessage={() => ""} 
                          onChange={(e) => { setmesSelect(meses.find(x => x.value === e.value)); setmonth(e.value);}}
                          options={meses}
                          id="sustainableCustomer"
                          classNamePrefix="select2-selection"
                          placeholder={t("toselect")}
                          value={mesSelect}
                        // value={props.dataRecipro.mes}
                        />
                        {campoRequeridoMes ?
                          <p className="message-error-parrafo">{t("Required Field")}</p>
                          : null}
                      </div>
                    </Col>
                        */}
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="sales">{t("Sales")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="sales"
                          id="sales"
                          onChange={(e) => { setsales(currencyData.getRealValue(e.target.value)); }}
                          value={currencyData.format(sales ?? 0)}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="deposits">{t("Deposits")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="deposits"
                          onKeyDown={(e) => { e.preventDefault(); }}
                          tabIndex="0"
                          onChange={(e) => { setdeposits(currencyData.getRealValue(e.target.value)); }}
                          value={currencyData.format(parseFloat(currencyData.getRealValue(deposits ?? 0))?.toFixed(2))}
                          id="deposits"
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        />
                      </div>
                    </Col>
                    {/* <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="averagebalance">{t("AverageBalance")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="averageBalance"
                          onChange={(e) => { setaverageBalance(currencyData.getRealValue(e.target.value)); }}
                          value={averageBalance}
                          id="averageBalance"
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        />
                      </div>
                    </Col> */}
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="reciprocity">{t("Reciprocity")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="reciprocity"
                          onChange={(e) => { setreciprocity(currencyData.getRealValue(e.target.value)); }}
                          value={reciprocity}
                          id="reciprocity"
                          onKeyPress={(e) => { }}
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value.replace('%', '')); e.target.value = currencyData.format(x) + "%"; }}
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="sow">{t("ActualSow")}</Label>
                        <AvField
                          className="form-control"
                          // type="number"
                          type="text"
                          min={0}
                          name="sow"
                          onKeyDown={(e) => { e.preventDefault(); }}
                          value={`${parseFloat(sow)?.toFixed(2)}%`}
                          onChange={(e) => { setsow(currencyData.getRealValue(e.target.value.toFixed(2))); }}
                          onKeyPress={(e) => { return OnlyNumber(e) }}
                          id="sow"
                        // pattern="^[0-9,.]*$"
                        // onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        />
                      </div>
                    </Col>
                    <Col md="12">
                      <div className="mb-3">
                        <Label htmlFor="description">{t("Description")}</Label>
                        <AvField
                          type="textarea"
                          name="description"
                          id="description"
                          maxLength="1000"
                          rows="7"
                          value={props.dataRecipro.description}
                        />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter style={{ textAlign: "right" }}>
                  <Button id="btnNew" color="danger" type="button" style={{ margin: '5px' }} onClick={props.toggle} data-dismiss="modal">
                    <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
                  </Button>
                  {props.botones ?
                    <Button id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                      {" "} {props.tipo == "guardar" ? t("Save") : t("Save")}
                    </Button> : null}
                </CardFooter>
              </Card>
            </AvForm>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};
ModalReciprocidad.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  partyId: PropTypes.string
};

export default ModalReciprocidad;
