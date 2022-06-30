import React, { useState } from "react"
import PropTypes from 'prop-types';
import { translationHelpers } from '../../../helpers/translation-helper';

import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Input,
  CardHeader,
  CardTitle,
  InputGroup,
  Table,
  CardFooter
} from "reactstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import { Link, useLocation } from "react-router-dom"
import ModalNewDebt from './ModalNewDebt';
import ModalDeudasCortoPlazo from '../../../pages/CommercialCredit/4_InformeGestionReforzado/FormularioIGR/Secciones/ModalDeudasCortoPlazo';
import ModalDeudasLargoPlazo from '../../../pages/CommercialCredit/4_InformeGestionReforzado/FormularioIGR/Secciones/ModalDeudasLargoPlazo';
import { BackendServices } from '../../../services';
import { AvForm, AvField } from "availity-reactstrap-validation"
import "flatpickr/dist/themes/material_blue.css";
import LoadingOverlay from "react-loading-overlay";
const estiloTotales = { backgroundColor: "lightgrey", color: "black" }
const Debts = (props) => {

  const [displayModalNewDebt, setDisplayModalNewDebt] = useState(false);
  const location = useLocation()
  /* ---------------------------------------------------------------------------------------------- */
  /*                        Variables de estados para los mensajes de alerta                        */
  /* ---------------------------------------------------------------------------------------------- */
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [dataReturn, setdataReturn] = useState(props.dataRelacionesBancarias);
  const [info_dlg, setinfo_dlg] = useState(false)
  const [info_msg, setinfo_msg] = useState("")
  const [dynamic_title, setdynamic_title] = useState("")
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [success_dlg, setsuccess_dlg] = useState(false)
  const [dynamic_description, setdynamic_description] = useState("")
  /* ---------------------------------------------------------------------------------------------- */
  /*                          Variables de estados generales del componente                         */
  /* ---------------------------------------------------------------------------------------------- */
  const [formValid, setFormValid] = useState(false);
  const [dataDelete, setDataDelete] = useState([]);
  const [dataLocation, setData] = useState(location.data);
  const [botonValidation, setbotonValidation] = useState(true);
  const [showModalDeudasCortoPlazo, setShowModalDeudasCortoPlazo] = useState(false);
  const [showModalDeudasLargoPlazo, setShowModalDeudasLargoPlazo] = useState(false);
  const [showModalSow, setShowModalSow] = useState(false);
  const [shorttermdebtsRows, setshorttermdebtsRows] = useState(null);
  const [longtermdebtsRows, setlongtermdebtsRows] = useState(null);
  const [sowactualRows, setsowactualRows] = useState(null);
  const [sowproposedRows, setsowproposedRows] = useState(null);
  const [tipo, setTipo] = useState("");
  const [dataSet, setdataSet] = useState({
    transactId: 0,
    otherBanks: 0,
    banesco: 0,
    total: 0,
    sow: 0
  });

  const [isActiveLoadingCP, setIsActiveLoadingCP] = useState(false);
  const [isActiveLoadingCL, setIsActiveLoadingCL] = useState(false);


  const [t, c, tr] = translationHelpers('commercial_credit', 'common', 'translation');
  const { items } = props;
  React.useEffect(() => {
    initializeData();
  }, []);

  function toggleModalNewDebt() {
    setDisplayModalNewDebt(!displayModalNewDebt);
  }

  function initializeData() {
    cargarTablasCortoPlazo();
    cargarTablasLargoPlazo();
  }
  function cargarTablasCortoPlazo() {
    const api = new BackendServices()
    api.consultBankingRelationsDebtsCP(dataLocation.transactionId).then(resp => {
      dataReturn.dataTablDeudaCorto = resp.getBankingRelationCPDTOList;
      for (let i = 0; i < resp.getBankingRelationCPDTOList.length; i++) {
        dataReturn.sumatoriaDeudaCorto.monto = dataReturn.sumatoriaDeudaCorto.monto + resp.getBankingRelationCPDTOList[i].amount;
        dataReturn.sumatoriaDeudaCorto.saldo1 = dataReturn.sumatoriaDeudaCorto.saldo1 + resp.getBankingRelationCPDTOList[i].debitBalance1;
        dataReturn.sumatoriaDeudaCorto.saldo2 = dataReturn.sumatoriaDeudaCorto.saldo2 + resp.getBankingRelationCPDTOList[i].debitBalance2;
        dataReturn.sumatoriaDeudaCorto.saldo3 = dataReturn.sumatoriaDeudaCorto.saldo3 + resp.getBankingRelationCPDTOList[i].debitBalance3;
      }
      setdataReturn(dataReturn)
      setshorttermdebtsRows(resp.getBankingRelationCPDTOList.map((data) => (
        data.status ?
          <tr key={data.debtId}>
            <td>{data.bank}</td>
            <td>{data?.facilityType ?? data?.facilityTypeId}</td>
            <td>{data.amount}</td>
            <td>{data.date}</td>
            <td>{data.expirationDate}</td>
            <td>{data.debitBalance1}</td>
            <td>{data.debitBalance2}</td>
            <td>{data.debitBalance3}</td>
            <td>{data.paymentHistory}</td>
            <td>{data.rate}</td>
            <td>{data.fee}</td>
            <td>{data.bail}</td>
            <td>{data.fundDestiny}</td>
            <td style={{ textAlign: "right" }}>
              <Button type="button" color="link" onClick={(resp) => { editarCortoPlazo(data) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
              <Button type="button" color="link" onClick={(resp) => { eliminarCortoPlazo(data) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
            </td>
          </tr> : null
      )
      ));
    });
  }

  function cargarTablasLargoPlazo() {
    const api = new BackendServices()
    api.consultBankRelationsDebtsLP(dataLocation.transactionId).then(resp => {
      dataReturn.dataTablDeudaLargo = resp.bankingRelationLPDTOList;
      for (let i = 0; i < resp.bankingRelationLPDTOList.length; i++) {
        dataReturn.sumatoriaDeudaLargo.monto = dataReturn.sumatoriaDeudaLargo.monto + resp.bankingRelationLPDTOList[i].amount;
        dataReturn.sumatoriaDeudaLargo.saldo1 = dataReturn.sumatoriaDeudaLargo.saldo1 + resp.bankingRelationLPDTOList[i].debitBalance1;
        dataReturn.sumatoriaDeudaLargo.saldo2 = dataReturn.sumatoriaDeudaLargo.saldo2 + resp.bankingRelationLPDTOList[i].debitBalance2;
        dataReturn.sumatoriaDeudaLargo.saldo3 = dataReturn.sumatoriaDeudaLargo.saldo3 + resp.bankingRelationLPDTOList[i].debitBalance3;
      }
      setdataReturn(dataReturn)
      setlongtermdebtsRows(resp.bankingRelationLPDTOList.map((data, index) => (
        data.status ?
          <tr key={index}>
            <td>{data.bank}</td>
            <td>{data?.facilityType ?? data?.facilityTypeId}</td>
            <td>{data.amount}</td>
            <td>{data.date}</td>
            <td>{data.expirationDate}</td>
            <td>{data.debitBalance1}</td>
            <td>{data.debitBalance2}</td>
            <td>{data.debitBalance3}</td>
            <td>{data.paymentHistory}</td>
            <td>{data.rate}</td>
            <td>{data.fee}</td>
            <td>{data.bail}</td>
            <td>{data.fundDestiny}</td>
            <td style={{ textAlign: "right" }}>
              <Button type="button" color="link" onClick={(resp) => { editarLargoPlazo(data) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
              <Button type="button" color="link" onClick={(resp) => { eliminarLargoPlazo(data) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
            </td>
          </tr> : null
      )
      ));
    });
  }
  /* ---------------------------------------------------------------------------------------------- */
  /*                           Funciones para los Snow actual y propuesto                           */
  /* ---------------------------------------------------------------------------------------------- */
  function guardarDatos(data, tipo) {
    data.transactId = dataLocation.transactionId;
    const api = new BackendServices()

    if (tipo == "CP") {
      setIsActiveLoadingCP(true);
      let datos = {
        "facilityType": data?.facilityType ?? data?.facilityTypeId,
        "amount": Number(data.amount),
        "date": data.expirationDate,
        "expirationDate": data.expirationDate,
        "debitBalance1": Number(data.debitBalance1),
        "debitBalance2": Number(data.debitBalance2),
        "debitBalance3": Number(data.debitBalance3),
        "paymentHistory": data.paymentHistory,
        "rate": Number(data.rate),
        "fee": Number(data.fee),
        "bail": data.bail,
        "fundDestiny": data.fundDestiny,
        "bank": data.bank,
        "transactId": Number(data.transactId)
      }
      toggleShowModalDeudasCortoPlazo()
      api.newBankingRelationsDebtsCP(datos).then(resp => {
        setIsActiveLoadingCP(false);
        if (resp != undefined) {
          setconfirm_alert(false)
          setsuccessSave_dlg(true)
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "CL") {
      setIsActiveLoadingCL(true);

      let datos = {
        "facilityType": data?.facilityType ?? data?.facilityTypeId,
        "amount": Number(data.amount),
        "date": data.expirationDate,
        "expirationDate": data.expirationDate,
        "debitBalance1": Number(data.debitBalance1),
        "debitBalance2": Number(data.debitBalance2),
        "debitBalance3": Number(data.debitBalance3),
        "paymentHistory": data.paymentHistory,
        "rate": Number(data.rate),
        "fee": Number(data.fee),
        "bail": data.bail,
        "fundDestiny": data.fundDestiny,
        "bank": data.bank,
        "transactId": Number(data.transactId)
      }
      toggleShowModalDeudasLargoPlazo()
      api.newBankingRelationsDebtsLP(datos).then(resp => {
        setIsActiveLoadingCL(false);

        if (resp != undefined) {
          setconfirm_alert(false)
          setsuccessSave_dlg(true)
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
  }
  function actualizarDatos(data, tipo) {
    data.transactId = dataLocation.transactionId;
    const api = new BackendServices()
    if (tipo == "ECP") {
      setIsActiveLoadingCP(true);

      let datos = {
        "facilityType": data?.facilityType ?? data?.facilityTypeId,
        "amount": Number(data.amount),
        "date": data.expirationDate,
        "expirationDate": data.expirationDate,
        "debitBalance1": Number(data.debitBalance1),
        "debitBalance2": Number(data.debitBalance2),
        "debitBalance3": Number(data.debitBalance3),
        "paymentHistory": data.paymentHistory,
        "rate": Number(data.rate),
        "fee": Number(data.fee),
        "bail": data.bail,
        "fundDestiny": data.fundDestiny,
        "bank": data.bank,
        "transactId": Number(data.transactId),
        "debtId": data.debtId,
        "status": true,
      }
      toggleShowModalDeudasCortoPlazo()
      api.updateBankRelationsDebtsCP(datos).then(resp => {
        setIsActiveLoadingCP(false);

        if (resp != undefined) {
          setconfirm_alert(false)
          setsuccessSave_dlg(true)
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (tipo == "ECL") {
      setIsActiveLoadingCL(true);

      let datos = {
        "facilityType": data?.facilityType ?? data?.facilityTypeId,
        "amount": Number(data.amount),
        "date": data.expirationDate,
        "expirationDate": data.expirationDate,
        "debitBalance1": Number(data.debitBalance1),
        "debitBalance2": Number(data.debitBalance2),
        "debitBalance3": Number(data.debitBalance3),
        "paymentHistory": data.paymentHistory,
        "rate": Number(data.rate),
        "fee": Number(data.fee),
        "bail": data.bail,
        "fundDestiny": data.fundDestiny,
        "bank": data.bank,
        "transactId": Number(data.transactId),
        "debtId": data.debtId,
        "status": true,
      }
      toggleShowModalDeudasLargoPlazo()
      api.updateBankRelationsDebtsLP(datos).then(resp => {
        setIsActiveLoadingCL(false);

        if (resp != undefined) {
          setconfirm_alert(false)
          setsuccessSave_dlg(true)
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
  }


  function editarCortoPlazo(data) {
    // setjsonClientes(data)
    setdataSet(data);
    setTipo("ECP");
    setbotonValidation(true);
    toggleShowModalDeudasCortoPlazo();
  }
  function editarLargoPlazo(data) {
    // setjsonClientes(data)
    setdataSet(data);
    setTipo("ECL");
    setbotonValidation(true);
    toggleShowModalDeudasLargoPlazo();
  }

  /* ---------------------------------------------------------------------------------------------- */
  /*                        Funciones para las cuentas a corto y largo plazo                        */
  /* ---------------------------------------------------------------------------------------------- */
  // Ventana de corto plazo validaciones
  function verCortoPlazo(data) {
    // setjsonClientes(data)
    setdataSet(data);
    setTipo("ECP");
    setbotonValidation(false);
    toggleShowModalDeudasCortoPlazo()
  }
  function eliminarCortoPlazo(data) {
    setTipo("DCP");
    setDataDelete(data)
    setconfirm_alert(true);

  }
  // Ventana de largo plazo validaciones
  function verLargoPlazo(data) {
    // setjsonClientes(data)
    setdataSet(data);
    setTipo("ECL");
    setbotonValidation(false);
    toggleShowModalDeudasLargoPlazo()
  }
  function eliminarLargoPlazo(data) {
    setTipo("DCL");
    setDataDelete(data)
    setconfirm_alert(true);
  }

  //abrimos modal para adjunar archivos
  function toggleShowModalDeudasCortoPlazo() {
    setShowModalDeudasCortoPlazo(!showModalDeudasCortoPlazo);
    removeBodyCss()
  }
  function toggleShowModalDeudasLargoPlazo() {
    setShowModalDeudasLargoPlazo(!showModalDeudasLargoPlazo);
    removeBodyCss()
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  return (
    <>
      <h4 className="card-title clearfix">{props.title}
        {props.editable && (
          <Button className="float-end" color="success" style={{ margin: '5px' }}
            onClick={toggleModalNewDebt}>
            {c("New")}
          </Button>
        )}
      </h4>
      <p className="card-title-desc"></p>
      <Row>
        <Col md="12">
          <h6 className="float-start my-1">{t("Short Term Debts")}</h6>
          <Link className="float-end" onClick={() => {
            setTipo("CP"); setbotonValidation(true); setdataSet({
              transactId: 0,
              bank: null,
              facilityType: null,
              amount: 0,
              date: null,
              expirationDate: null,
              debitBalance1: 0,
              debitBalance2: 0,
              debitBalance3: 0,
              paymentHistory:"",
              rate: 0,
              fee: 0,
              bail: null,
              destinationOfFunds: null
            }); toggleShowModalDeudasCortoPlazo()
          }}><i className="mdi mdi-plus-box-multiple-outline mdi-24px"></i></Link>
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <LoadingOverlay active={isActiveLoadingCP} spinner text={t("WaitingPlease")}>
            <Table className="table mt-1" responsive>
              <thead className="table-light">
                <tr>
                  <th>{tr("Bank")}</th>
                  <th>{tr("FacilityType")}</th>
                  <th>{t("Amount")}</th>
                  <th>{tr("GrantDate")}</th>
                  <th>{tr("DueDate")}</th>
                  <th>{t("CurrentYear")}</th>
                  <th>1 {t("YearAgo")}</th>
                  <th>2 {t("YearAgo")}</th>
                  <th>{t("PaymentHistory")}</th>
                  <th>{t("Rate")}</th>
                  <th>{tr("Bond")}</th>
                  <th>{tr("Term")}</th>
                  <th>{tr("DestinationOfFunds")}</th>
                  <th style={{ textAlign: "right" }}></th>
                </tr>
              </thead>
              <tbody>
                {shorttermdebtsRows}
                <tr style={estiloTotales}>
                  <th>{t("Total")}</th>
                  <th></th>
                  <th></th>
                  <th>{dataReturn?.sumatoriaDeudaCorto.monto}</th>
                  <th></th>
                  <th>{dataReturn?.sumatoriaDeudaCorto.saldo1}</th>
                  <th>{dataReturn?.sumatoriaDeudaCorto.saldo2}</th>
                  <th>{dataReturn?.sumatoriaDeudaCorto.saldo3}</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </tbody>
            </Table>
          </LoadingOverlay >

        </Col>
      </Row>
      <div className="my-3"></div>
      <Row>
        <Col md="12">
          <h6 className="float-start my-1">{t("Long Term Debts")}</h6>
          <Link className="float-end" onClick={() => {
            setTipo("CL"); setbotonValidation(true); setdataSet({
              transactId: 0,
              bank: null,
              facilityType: null,
              amount: 0,
              date: null,
              expirationDate: null,
              debitBalance1: 0,
              debitBalance2: 0,
              debitBalance3: 0,
              paymentHistory: "",
              rate: 0,
              fee: 0,
              bail: null,
              destinationOfFunds: null
            }); toggleShowModalDeudasLargoPlazo()
          }}><i className="mdi mdi-plus-box-multiple-outline mdi-24px"></i></Link>
        </Col>
      </Row>

      <Row>
        <Col md="12">
          <LoadingOverlay active={isActiveLoadingCL} spinner text={t("WaitingPlease")}>

            <Table className="table mt-1" responsive>
              <thead className="table-light">
                <tr>
                  <th>{tr("Bank")}</th>
                  <th>{tr("FacilityType")}</th>
                  <th>{t("Amount")}</th>
                  <th>{tr("GrantDate")}</th>
                  <th>{tr("DueDate")}</th>
                  <th>{t("CurrentYear")}</th>
                  <th>1 {t("YearAgo")}</th>
                  <th>2 {t("YearAgo")}</th>
                  <th>{t("PaymentHistory")}</th>
                  <th>{t("Rate")}</th>
                  <th>{tr("Bond")}</th>
                  <th>{tr("Quota")}</th>
                  <th>{tr("DestinationOfFunds")}</th>
                  <th style={{ textAlign: "right" }}></th>
                </tr>
              </thead>
              <tbody>
                {longtermdebtsRows}
                <tr style={estiloTotales}>
                  <th>{t("Total")}</th>
                  <th></th>
                  <th></th>
                  <th>{dataReturn?.sumatoriaDeudaLargo.monto}</th>
                  <th></th>
                  <th>{dataReturn?.sumatoriaDeudaLargo.saldo1}</th>
                  <th>{dataReturn?.sumatoriaDeudaLargo.saldo2}</th>
                  <th>{dataReturn?.sumatoriaDeudaLargo.saldo3}</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </tbody>
            </Table>
          </LoadingOverlay >

        </Col>
      </Row>
      <ModalDeudasCortoPlazo actualizarDatos={actualizarDatos} botones={botonValidation} jsonSow={dataSet} guardarDatos={guardarDatos} tipo={tipo} isOpen={showModalDeudasCortoPlazo} toggle={() => { toggleShowModalDeudasCortoPlazo() }} />
      <ModalDeudasLargoPlazo actualizarDatos={actualizarDatos} botones={botonValidation} jsonSow={dataSet} guardarDatos={guardarDatos} tipo={tipo} isOpen={showModalDeudasLargoPlazo} toggle={() => { toggleShowModalDeudasLargoPlazo() }} />
      <ModalNewDebt isOpen={displayModalNewDebt} toggle={toggleModalNewDebt} onSave={props.addDebt} />
      {
        successSave_dlg ? (
          <SweetAlert
            success
            title={t("SuccessDialog")}
            confirmButtonText={t("Confirm")}
            cancelButtonText={t("Cancel")}
            onConfirm={() => {
              setsuccessSave_dlg(false)
              initializeData();
            }}
          >
            {t("SuccessSaveMessage")}
          </SweetAlert>
        ) : null
      }

      {
        error_dlg ? (
          <SweetAlert
            error
            title={t("ErrorDialog")}
            confirmButtonText={t("Confirm")}
            cancelButtonText={t("Cancel")}
            onConfirm={() => {
              seterror_dlg(false)
              initializeData();
            }}
          >
            {error_msg}
          </SweetAlert>
        ) : null
      }
      {
        confirm_alert ? (
          <SweetAlert
            title={t("Areyousure")}
            warning
            showCancel
            confirmButtonText={t("Yesdeleteit")}
            cancelButtonText={t("Cancel")}
            confirmBtnBsStyle="success"
            cancelBtnBsStyle="danger"
            onConfirm={() => {
              const apiBack = new BackendServices();
              if (tipo == "DCP") {
                setIsActiveLoadingCP(true);

                setconfirm_alert(false)
                apiBack.eliminateBankingRelationshipsDebtsCP({ transactId: dataLocation.transactionId, debtId: dataDelete.debtId, status: false }).then(resp => {
                  setIsActiveLoadingCP(false);

                  if (resp.statusCode == "500") {
                    seterror_dlg(false)
                  } else {
                    setsuccessSave_dlg(true)
                  }
                }).catch(error => {
                  seterror_dlg(false)
                })
              } else if (tipo == "DCL") {
                setIsActiveLoadingCL(true);

                setconfirm_alert(false)
                apiBack.eliminateBankingRelationshipsDebtsLP({ transactId: dataLocation.transactionId, debtId: dataDelete.debtId, status: false }).then(resp => {
                  setIsActiveLoadingCL(false);

                  if (resp.statusCode == "500") {
                    seterror_dlg(false)
                  } else {
                    setsuccessSave_dlg(true)
                  }
                }).catch(error => {
                  seterror_dlg(false)
                })
              }
            }}
            onCancel={() => setconfirm_alert(false)}
          >
            {t("Youwontbeabletorevertthis")}
          </SweetAlert>
        ) : null
      }
    </>
  );
};

Debts.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array.isRequired,
  editable: PropTypes.bool,
  addDebt: PropTypes.func
};

Debts.defaultProps = {
  editable: false
};


export default Debts;
