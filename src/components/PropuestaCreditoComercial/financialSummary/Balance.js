import React, { useState } from "react"
import PropTypes from 'prop-types';
import { translationHelpers } from '../../../helpers/translation-helper';
import { BackendServices } from '../../../services';
import { Link, useLocation } from "react-router-dom"
import SweetAlert from "react-bootstrap-sweetalert"
import {
  Table,
  Card,
  CardBody,
  Button,
  Col
} from "reactstrap"
import ModalAnalisisCredito from "../../../pages/CommercialCredit/6_AnalisisCredito/ModalAnalisisCredito";
import LoadingOverlay from "react-loading-overlay";
import HeaderSections from "../../Common/HeaderSections";
import Currency from "../../../helpers/currency";
const Balance = (props) => {
  const location = useLocation();
  const [dataLocation, setData] = useState(location.data ?? JSON.parse(sessionStorage.getItem('locationData')));

  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [info_dlg, setinfo_dlg] = useState(false)
  const [info_msg, setinfo_msg] = useState("")
  const [dynamic_title, setdynamic_title] = useState("")
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [success_dlg, setsuccess_dlg] = useState(false)
  const [dynamic_description, setdynamic_description] = useState("")
  const [isActiveLoading, setIsActiveLoading] = useState(false);

  const [dataSet, setdataSet] = useState({
    "transactId": 0,
    "itemActive": "",
    "year1": 0,
    "year2": 0,
    "year3": 0,
    "year4": 0,
    "presentYear": 0
  });
  const [dataDelete, setDataDelete] = useState([]);
  const [Type, setType] = useState(null);
  const [items, setitems] = useState(null);
  const api = new BackendServices()
  const [t, c, tr] = translationHelpers('commercial_credit', 'common', 'translation');
  const [dataRows, setdataRows] = useState(null);
  const [showModalAnalisisCredito, setshowModalAnalisisCredito] = useState(false);
  const [botonValidation, setbotonValidation] = useState(true);

  const styleTd = {
    maxWidth: '300px'
  }

  const currencyData = new Currency();

  function loadData() {
    if (props.type == "BalanceActivo") {
      api.checkActiveBalanceAC(dataLocation?.transactionId ?? 0).then(resp => {
        if (resp?.length > 0) {

          setdataRows(resp.map((item, index) => (
            item.status ?
              <tr key={'row-' + index}>
                <td data-label={t("Description")}>{item.itemActive}</td>
                <td data-label={t("CurrentYear")}>{currencyData.format(item.presentYear ?? 0)}</td>
                <td data-label={`1 ${t("YearAgo")}`}>{currencyData.format(item?.year1 ?? 0)}</td>
                <td data-label={`2 ${t("YearAgo")}`}>{currencyData.format(item?.year2 ?? 0)}</td>
                <td data-label={`3 ${t("YearAgo")}`}>{currencyData.format(item?.year3 ?? 0)}</td>
                <td data-label={`4 ${t("YearAgo")}`}>{currencyData.format(item?.year4 ?? 0)}</td>
                {!props.preview && <td data-label={t("Actions")} style={{ textAlign: "right" }}>
                  <Button type="button" color="link" onClick={(resp) => {
                    editData(item, "E" + props.type)
                  }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                  <Button type="button" color="link" onClick={(resp) => {
                    DeleteData(item, "D" + props.type)
                  }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
                </td>}
              </tr> : null))
          );
        } else {
          setdataRows(
            <tr key={1}>
              <td colSpan="6" style={{ textAlign: 'center' }}></td>
            </tr>);
        }
      }).catch(err => {
        setdataRows(
          <tr key={1}>
            <td colSpan="6" style={{ textAlign: 'center' }}></td>
          </tr>);
      });
    }

    if (props.type == "BalancePasivo") {
      api.checkBalancePassiveAC(dataLocation?.transactionId ?? 0).then(resp => {
        if (resp?.length > 0) {
          setdataRows(resp.map((item, index) => (
            item.status ?
              <tr key={'row-' + index}>
                <td data-label={t("Description")} style={styleTd}>{item.itemPassive}</td>
                <td data-label={t("CurrentYear")}>{currencyData.format(item.presentYear ?? 0)}</td>
                <td data-label={`1 ${t("YearAgo")}`}>{currencyData.format(item?.year1 ?? 0)}</td>
                <td data-label={`2 ${t("YearAgo")}`}>{currencyData.format(item?.year2 ?? 0)}</td>
                <td data-label={`3 ${t("YearAgo")}`}>{currencyData.format(item?.year3 ?? 0)}</td>
                <td data-label={`4 ${t("YearAgo")}`}>{currencyData.format(item?.year4 ?? 0)}</td>
                {!props.preview && <td data-label={t("Actions")} style={{ textAlign: "right" }}>
                  <Button type="button" color="link" onClick={(resp) => {
                    editData({
                      "itemPassiveId": item.itemPassiveId,
                      "itemPassive": item.itemPassive,
                      "year1": item.year1,
                      "year2": item.year2,
                      "year3": item.year3,
                      "year4": item.year4,
                      "presentYear": item.presentYear
                    }, "E" + props.type)
                  }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                  <Button type="button" color="link" onClick={(resp) => {
                    DeleteData({
                      "itemPassiveId": item.itemPassiveId,
                      "itemPassive": item.itemPassive,
                      "year1": item.year1,
                      "year2": item.year2,
                      "year3": item.year3,
                      "year4": item.year4,
                      "presentYear": item.presentYear
                    }, "D" + props.type)
                  }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
                </td>}
              </tr> : null))
          );
        } else {
          setdataRows(
            <tr key={1}>
              <td colSpan="6" style={{ textAlign: 'center' }}></td>
            </tr>);
        }
      }).catch(err => {
        setdataRows(
          <tr key={1}>
            <td colSpan="6" style={{ textAlign: 'center' }}></td>
          </tr>);
      });
    }

    if (props.type == "OrigenAplicacionn") {
      api.consultarEstadoOrigenAplicacionesxDeudor(dataLocation?.transactionId ?? 0).then(resp => {
        if (resp?.length > 0) {
          setdataRows(resp.map((item, index) => (
            item.status ?
              <tr key={'row-' + index}>
                <td data-label={t("Description")} style={styleTd}>{item.sourceApplicationItem}</td>
                <td data-label={t("CurrentYear")}>{currencyData.format(item.presentYear ?? 0)}</td>
                <td data-label={`1 ${t("YearAgo")}`}>{currencyData.format(item?.year1 ?? 0)}</td>
                <td data-label={`2 ${t("YearAgo")}`}>{currencyData.format(item?.year2 ?? 0)}</td>
                <td data-label={`3 ${t("YearAgo")}`}>{currencyData.format(item?.year3 ?? 0)}</td>
                <td data-label={`4 ${t("YearAgo")}`}>{currencyData.format(item?.year4 ?? 0)}</td>
                {!props.preview && <td data-label={t("Actions")} style={{ textAlign: "right" }}>
                  <Button type="button" color="link" onClick={(resp) => { editData(item, "E" + props.type) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                  <Button type="button" color="link" onClick={(resp) => { DeleteData(item, "D" + props.type) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
                </td>}
              </tr> : null))
          );
        } else {
          setdataRows(
            <tr key={1}>
              <td colSpan="6" style={{ textAlign: 'center' }}></td>
            </tr>);
        }
      }).catch(err => {
        setdataRows(
          <tr key={1}>
            <td colSpan="6" style={{ textAlign: 'center' }}></td>
          </tr>);
      });
    }

    if (props.type == "indicadores") {
      api.queryACIndicator(dataLocation?.transactionId ?? 0).then(resp => {
        if (resp?.length > 0) {
          setdataRows(resp.map((item, index) => (
            item.status ?
              <tr key={'row-' + index}>
                <td data-label={t("Description")} style={styleTd}>{item.itemIndicators}</td>
                <td data-label={t("CurrentYear")}>{currencyData.format(item.presentYear ?? 0)}</td>
                <td data-label={`1 ${t("YearAgo")}`}>{currencyData.format(item?.year1 ?? 0)}</td>
                <td data-label={`2 ${t("YearAgo")}`}>{currencyData.format(item?.year2 ?? 0)}</td>
                <td data-label={`3 ${t("YearAgo")}`}>{currencyData.format(item?.year3 ?? 0)}</td>
                <td data-label={`4 ${t("YearAgo")}`}>{currencyData.format(item?.year4 ?? 0)}</td>
                {!props.preview && <td data-label={t("Actions")} style={{ textAlign: "right" }}>
                  <Button type="button" color="link" onClick={(resp) => { editData(item, "E" + props.type) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                  <Button type="button" color="link" onClick={(resp) => { DeleteData(item, "D" + props.type) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
                </td>}
              </tr> : null))
          );
        } else {
          setdataRows(
            <tr key={1}>
              <td colSpan="6" style={{ textAlign: 'center' }}></td>
            </tr>);
        }
      }).catch(err => {
        setdataRows(
          <tr key={1}>
            <td colSpan="6" style={{ textAlign: 'center' }}></td>
          </tr>);
      });
    }
  }

  React.useEffect(() => {
    // Read Api Servic e data 
    loadData()
    setType(Type)
  }, [props]);

  function DeleteData(data, typeData) {
    setType(typeData)
    setDataDelete(data)
    setconfirm_alert(true);
  }
  function editData(data, typeData) {
    setType(typeData)
    setdataSet(data)
    setbotonValidation(true);
    toogleModalAnalisisCredito()
  }
  async function dataManagement(data) {
    setIsActiveLoading(true);
    data.transactId = Number(dataLocation?.transactionId ?? 0);
    data.personId = props.debtorId;
    if (Type == "BalanceActivo") {
      await api.newActiveBalanceAC(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          setsuccessSave_dlg(true)
          toogleModalAnalisisCredito();
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (Type == "BalancePasivo") {
      data.itemPassive = data.itemActive;
      await api.nuevoBalancePasivoAC(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          setsuccessSave_dlg(true)
          toogleModalAnalisisCredito();
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (Type == "OrigenAplicacionn") {
      data.sourceApplicationItem = data.itemActive;
      console.log(props);
      await api.guardarEstadoOrigenAplicacionesxDeudor(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          setsuccessSave_dlg(true)
          toogleModalAnalisisCredito();
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (Type == "indicadores") {
      data.itemIndicators = data.itemActive;
      await api.guardarListaIndicadores(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          setsuccessSave_dlg(true)
          toogleModalAnalisisCredito();
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (Type == "EBalanceActivo") {
      data.itemActiveId = dataSet.itemActiveId;
      data.status = true;
      await api.updateActiveBalanceAC(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          setsuccessSave_dlg(true)
          toogleModalAnalisisCredito();
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (Type == "EBalancePasivo") {
      data.itemPassive = data.itemActive;
      data.itemPassiveId = dataSet.itemPassiveId;
      data.status = true;
      await api.actualizarBalancePasivoAC(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          setsuccessSave_dlg(true)
          toogleModalAnalisisCredito();
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (Type == "EOrigenAplicacionn") {
      data.sourceApplicationItem = data.itemActive;
      data.sourceApplicationItemId = dataSet.sourceApplicationItemId;
      data.status = true;
      await api.actualizarEstadoOrigenAplicacionesxDeudor(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          setsuccessSave_dlg(true)
          toogleModalAnalisisCredito();
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    if (Type == "Eindicadores") {
      data.itemIndicatorsId = dataSet.itemIndicatorsId;
      data.itemIndicators = data.itemActive;
      data.status = true;
      await api.actualizarListaIndicadores(data).then(resp => {
        if (resp != undefined) {
          setconfirm_alert(false)
          setsuccessSave_dlg(true)
          toogleModalAnalisisCredito();
        } else {
          setconfirm_alert(false)
          seterror_dlg(false)
        }
      }).catch(err => {
        setconfirm_alert(false)
        seterror_dlg(false)
      });
    }
    setIsActiveLoading(false);
  }
  function toogleModalAnalisisCredito() {
    setshowModalAnalisisCredito(!showModalAnalisisCredito);
    removeBodyCss()
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  return (
    <>
      <HeaderSections title={props.title} t={t}></HeaderSections>
      {/* <p className="card-title-desc"></p> */}
      <div className="table-responsive mt-2">
        <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>
          {!props.preview && <Col md="12" style={{ textAlign: "right" }}>
            <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
              setdataSet({
                "transactId": dataLocation?.transactionId ?? 0,
                "itemActive": "",
                "year1": null,
                "year2": null,
                "year3": null,
                "year4": null,
                "presentYear": null
              }); setType(props.type); toogleModalAnalisisCredito()
            }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
          </Col>}
          <div className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table mb-0">
              <thead>
                <tr>
                  <th>{t("Description")}</th>
                  <th>{t("CurrentYear")}</th>
                  <th className="text-start">1 {t("YearAgo")} </th>
                  <th className="text-start">2 {t("YearAgo")}</th>
                  <th className="text-start">3 {t("YearAgo")}</th>
                  <th className="text-start">4 {t("YearAgo")}</th>
                  {!props.preview && <th></th>}
                </tr>
              </thead>
              <tbody>
                {dataRows}
              </tbody>
            </Table>
          </div>
        </LoadingOverlay >

      </div>
      <ModalAnalisisCredito titulo={props.title} dataSet={dataSet} tipo={Type} dataManagement={dataManagement} botones={botonValidation} isOpen={showModalAnalisisCredito} toggle={() => { toogleModalAnalisisCredito() }} />
      {successSave_dlg ? (
        <SweetAlert
          success
          title={t("SuccessDialog")}
          confirmButtonText={t("Confirm")}
          cancelButtonText={t("Cancel")}
          onConfirm={() => {
            setsuccessSave_dlg(false)
            loadData();
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
            loadData();
          }}
        >
          {error_msg}
        </SweetAlert>
      ) : null}
      {confirm_alert ? (
        <SweetAlert
          title={tr("Areyousure")}
          warning
          showCancel
          confirmButtonText={tr("Yesdeleteit")}
          cancelButtonText={tr("Cancel")}
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          onConfirm={() => {
            const apiBack = new BackendServices();
            if (Type == "DBalanceActivo") {
              console.log(props.debtorId);
              apiBack.eliminarBalanceActivoAC(dataLocation?.transactionId ?? 0, props.debtorId, dataDelete.itemActiveId).then(resp => {
                if (resp.statusCode == "500" || undefined) {
                  setconfirm_alert(false)
                  seterror_dlg(false)
                } else {
                  setconfirm_alert(false)
                  setsuccessSave_dlg(true)
                }
              }).catch(error => {
                setconfirm_alert(false)
                seterror_dlg(false)
              })
            }
            if (Type == "DBalancePasivo") {
              apiBack.eliminarBalancePasivoAC(dataLocation?.transactionId ?? 0, props.debtorId, dataDelete.itemPassiveId).then(resp => {
                if (resp.statusCode == "500" || undefined) {
                  setconfirm_alert(false)
                  seterror_dlg(false)
                } else {
                  setconfirm_alert(false)
                  setsuccessSave_dlg(true)
                }
              }).catch(error => {
                setconfirm_alert(false)
                seterror_dlg(false)
              })
            }
            if (Type == "DOrigenAplicacionn") {
              apiBack.eliminarEstadoOrigenAplicacionesxDeudor(dataLocation?.transactionId ?? 0, props.debtorId, dataDelete.sourceApplicationItemId).then(resp => {
                if (resp.statusCode == "500" || undefined) {
                  setconfirm_alert(false)
                  seterror_dlg(false)
                } else {
                  setconfirm_alert(false)
                  setsuccessSave_dlg(true)
                }
              }).catch(error => {
                setconfirm_alert(false)
                seterror_dlg(false)
              })
            }
            if (Type == "Dindicadores") {
              apiBack.eliminarListaIndicadores(dataLocation?.transactionId ?? 0, props.debtorId, dataDelete.itemIndicatorsId).then(resp => {
                if (resp.statusCode == "500" || undefined) {
                  setconfirm_alert(false)
                  seterror_dlg(false)
                } else {
                  setconfirm_alert(false)
                  setsuccessSave_dlg(true)
                }
              }).catch(error => {
                setconfirm_alert(false)
                seterror_dlg(false)
              })
            }
          }}
          onCancel={() => setconfirm_alert(false)}
        >
          {tr("Youwontbeabletorevertthis")}
        </SweetAlert>
      ) : null}
    </>
  );
};

Balance.propTypes = {
  title: PropTypes.string,
  headers: PropTypes.array.isRequired,
};


export default Balance;
