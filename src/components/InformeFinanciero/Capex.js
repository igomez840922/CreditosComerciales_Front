import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types'
import { Link, useLocation } from "react-router-dom"

import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Input,
  CardHeader,
  Table,
  CardFooter
} from "reactstrap"

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import AvInput from 'availity-reactstrap-validation/lib/AvInput'

import * as OPTs from "../../helpers/options_helper"

import SweetAlert from "react-bootstrap-sweetalert"
import { BackendServices } from "../../services/index.js"
import ModalCapex1 from "../../pages/CommercialCredit/4_InformeGestionReforzado/FormularioIGR/Secciones/ModalCapex1"
import ModalCapex2 from "../../pages/CommercialCredit/4_InformeGestionReforzado/FormularioIGR/Secciones/ModalCapex2"
import ModalCapex3 from "../../pages/CommercialCredit/4_InformeGestionReforzado/FormularioIGR/Secciones/ModalCapex3"
import AttachmentFileCore from "../Common/AttachmentFileCore"
import LoadingOverlay from "react-loading-overlay"



const Capex = (props) => {

  const { t, i18n } = useTranslation();

  const { locationData } = props;

  const location = useLocation()
  /* ---------------------------------------------------------------------------------------------- */
  /*                        Variables de estados para los mensajes de alerta                        */
  /* ---------------------------------------------------------------------------------------------- */
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [info_dlg, setinfo_dlg] = useState(false)
  const [info_msg, setinfo_msg] = useState("")
  const [dynamic_title, setdynamic_title] = useState("")
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [success_dlg, setsuccess_dlg] = useState(false)
  const [dynamic_description, setdynamic_description] = useState("")
  const [dataDelete, setDataDelete] = useState([]);
  const [dataLocation, setData] = useState(location.data);
  const [botonValidation, setbotonValidation] = useState(true);

  const [dataCapex1, setdataCapex1] = useState({
    "transactId": 0,
    "description": "",
    "useInMiles": 0,
    "shareholder": "",
    "bank": ""
  });
  const [dataCapex2, setdataCapex2] = useState({
    "transactId": 0,
    "capexId": 0,
    "budget": "",
    "amount": 0,
    "status": true
  });
  const [dataCapex3, setdataCapex3] = useState({
    "transactId": 0,
    "capexDetailsId": 0,
    "observations": "",
    "amount": 0,
    "status": true
  });
  const [tipo, setTipo] = useState(null);

  const [formValid, setFormValid] = useState(false);
  const [dataCapex1Rows, setdataCapex1Rows] = useState(null);
  const [dataCapex2Rows, setdataCapex2Rows] = useState(null);
  const [dataCapex3Rows, setdataCapex3Rows] = useState(null);



  const [showModalCapex1, setShowModalCapex1] = useState(false);
  const [showModalCapex2, setShowModalCapex2] = useState(false);
  const [showModalCapex3, setShowModalCapex3] = useState(false);
  const [isActiveLoadingCapex1, setIsActiveLoadingCapex1] = useState(false);
  const [isActiveLoadingCapex2, setIsActiveLoadingCapex2] = useState(false);
  const [isActiveLoadingCapex3, setIsActiveLoadingCapex3] = useState(false);

  React.useEffect(() => {
    // Read Api Service data
    initializeData();
  }, []);

  const api = new BackendServices();

  function initializeData() {
    api.consultCapexIGR(dataLocation.transactionId).then(resp => {
      if (resp != undefined && resp.capex.filter($$ => $$.status == true).length >= 1) {
        setdataCapex1Rows(resp.capex.map((data) => (
          data.status ?
            <tr key={data.id}>
              <td>{data.description}</td>
              <td>{data.useInMiles}</td>
              <td>{data.shareholder}</td>
              <td>{data.bank}</td>
              <td style={{ textAlign: "right" }}>
                <Button type="button" color="link" onClick={(resp) => { ShowData(data, "CAPEX1") }} className="btn btn-link" ><i className="mdi mdi-eye mdi-24px"></i></Button>
                <Button type="button" color="link" onClick={(resp) => { EditData(data, "ECAPEX1") }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                <Button type="button" color="link" onClick={(resp) => { DeleteData(data, "DCAPEX1") }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
              </td>
            </tr> : null)
        ));
      } else {
        setdataCapex1Rows(
          <tr key={1}>
            <td colSpan="4" style={{ textAlign: 'center' }}></td>
          </tr>);
      }
    });
    api.consultCapexBudgetIGR(dataLocation.transactionId).then(resp => {
      if (resp != undefined) {
        setdataCapex2Rows(resp.capexBudget.map((data) => (
          <tr key={data.capexId}>
            <td>{data.budget}</td>
            <td>{data.amount}</td>
            <td style={{ textAlign: "right" }}>
              <Button type="button" color="link" onClick={(resp) => { ShowData(data, "CAPEX2") }} className="btn btn-link" ><i className="mdi mdi-eye mdi-24px"></i></Button>
              <Button type="button" color="link" onClick={(resp) => { EditData(data, "ECAPEX2") }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
              <Button type="button" color="link" onClick={(resp) => { DeleteData(data, "DCAPEX2") }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
            </td>
          </tr>)
        ));
      } else {
        setdataCapex2Rows(
          <tr key={1}>
            <td colSpan="2" style={{ textAlign: 'center' }}></td>
          </tr>);
      }
    });
    api.consultCapexDetailProjectIGR(dataLocation.transactionId).then(resp => {
      if (resp != undefined) {
        setdataCapex3Rows(resp.capexProjectDetail.map((data) => (
          <tr key={data.capexDetailsId}>
            <td>{data.budget}</td>
            <td>{data.amount}</td>
            <td style={{ textAlign: "right" }}>
              <Button type="button" color="link" onClick={(resp) => { ShowData(data, "CAPEX3") }} className="btn btn-link" ><i className="mdi mdi-eye mdi-24px"></i></Button>
              <Button type="button" color="link" onClick={(resp) => { EditData(data, "ECAPEX3") }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
              <Button type="button" color="link" onClick={(resp) => { DeleteData(data, "DCAPEX3") }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
            </td>
          </tr>)
        ));
      } else {
        setdataCapex3Rows(
          <tr key={1}>
            <td colSpan="2" style={{ textAlign: 'center' }}></td>
          </tr>);
      }
    });

  }
  function ShowData(data, tipo2) {
    setTipo(tipo2);
    if (tipo2 == "CAPEX1") {
      setdataCapex1(data);
      toggleShowModalCapex1()
    }
    if (tipo2 == "CAPEX2") {
      setdataCapex2(data);
      toggleShowModalCapex2()
    }
    if (tipo2 == "CAPEX3") {
      setdataCapex3(data);
      toggleShowModalCapex3()
    }
    setbotonValidation(false);
  }
  function EditData(data, tipo2) {
    setTipo(tipo2);
    if (tipo2 == "ECAPEX1") {
      setdataCapex1(data);
      toggleShowModalCapex1()
    }
    if (tipo2 == "ECAPEX2") {
      setdataCapex2(data);
      toggleShowModalCapex2()
    }
    if (tipo2 == "ECAPEX3") {
      setdataCapex3(data);
      toggleShowModalCapex3()
    }
    setbotonValidation(true);
  }
  function DeleteData(data, tipo2) {
    setTipo(tipo2);
    if (tipo2 == "ECAPEX1") {
      setdataCapex1(data);
    }
    if (tipo2 == "ECAPEX2") {
      setdataCapex2(data);
    }
    if (tipo2 == "ECAPEX3") {
      setdataCapex3(data);
    }
    setconfirm_alert(true);
  }
  async function SaveData(data, tipo) {
    data.transactId = Number(dataLocation.transactionId);
    /* ---------------------------------------------------------------------------------------------- */
    /*                                  Guardamos los datos del cash                                  */
    /* ---------------------------------------------------------------------------------------------- */

    if (tipo == "CAPEX1") {
      setIsActiveLoadingCapex1(true);
      toggleShowModalCapex1();
      api.newCapexIGR(data).then(resp => {
        setIsActiveLoadingCapex1(false);
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
    if (tipo == "CAPEX2") {
      setIsActiveLoadingCapex2(true);
      toggleShowModalCapex2();
      api.newCapexBudgetIGR(data).then(resp => {
        setIsActiveLoadingCapex2(false);
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
    if (tipo == "CAPEX3") {
      setIsActiveLoadingCapex3(true);
      toggleShowModalCapex3();
      api.newCapexDetailProjectIGR(data).then(resp => {
        setIsActiveLoadingCapex3(false);
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
  function UpdateData(data, tipo) {
    data.transactId = dataLocation.transactionId;
    /* ---------------------------------------------------------------------------------------------- */
    /*                                    Editita el flujo de caja                                    */
    /* ---------------------------------------------------------------------------------------------- */
    if (tipo == "ECAPEX1") {
      setIsActiveLoadingCapex1(true);
      toggleShowModalCapex1();
      api.updateCapexIGR(data).then(resp => {
        setIsActiveLoadingCapex1(false);
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
    if (tipo == "ECAPEX2") {
      setIsActiveLoadingCapex2(true);
      toggleShowModalCapex2();
      api.updateCapexBudgetIGR(data).then(resp => {
        setIsActiveLoadingCapex2(false);
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
    if (tipo == "ECAPEX3") {
      setIsActiveLoadingCapex3(true);
      toggleShowModalCapex3();
      api.updateCapexDetailProjectIGR(data).then(resp => {
        setIsActiveLoadingCapex3(false);
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

  //abrimos modal para adjunar archivos
  function toggleShowModalCapex1() {
    setShowModalCapex1(!showModalCapex1);
    removeBodyCss()
  }

  //abrimos modal para adjunar archivos
  function toggleShowModalCapex2() {
    setShowModalCapex2(!showModalCapex2);
    removeBodyCss()
  }

  //abrimos modal para adjunar archivos
  function toggleShowModalCapex3() {
    setShowModalCapex3(!showModalCapex3);
    removeBodyCss()
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  // Form Submission
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    //props.onSubmit(values);
  }

  return (
    <>
      <h4 className="card-title">{t("Capex")}</h4>
      <p className="card-title-desc"></p>

      <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
        <Row>
          <Col md="12">
            <LoadingOverlay active={isActiveLoadingCapex1} spinner text={t("WaitingPlease")}>

              <Table className="table mt-1" responsive>
                <thead className="table-light">
                  <tr>
                    <th>{t("Description")}</th>
                    <th>{t("UsesInMiles")}</th>
                    {/* <th>{t("SourcesThousands")}</th> */}
                    <th>{t("Shareholder")}</th>
                    <th>{t("Bank")}</th>
                    <th><Link className="float-end" onClick={() => {
                      setbotonValidation(true); setdataCapex1({
                        "transactId": 0,
                        "description": "",
                        "useInMiles": 0,
                        "shareholder": "",
                        "bank": ""
                      }); setTipo("CAPEX1"); toggleShowModalCapex1()
                    }}><i className="mdi mdi-plus-box-multiple-outline mdi-24px"></i></Link></th>
                  </tr>
                </thead>
                <tbody>
                  {dataCapex1Rows}
                </tbody>
              </Table>
            </LoadingOverlay>
          </Col>
        </Row>

        <Row>
          <Col md="12">
            <LoadingOverlay active={isActiveLoadingCapex2} spinner text={t("WaitingPlease")}>

              <Table className="table mt-1" responsive>
                <thead className="table-light">
                  <tr>
                    <th>{t("Budget")}</th>
                    <th>{t("Amount")}</th>
                    <th><Link className="float-end" onClick={() => {
                      setbotonValidation(true); setdataCapex2({
                        "transactId": 0,
                        "capexId": 0,
                        "budget": "",
                        "amount": 0,
                        "status": true
                      }); setTipo("CAPEX2"); toggleShowModalCapex2()
                    }}><i className="mdi mdi-plus-box-multiple-outline mdi-24px"></i></Link></th>
                  </tr>
                </thead>
                <tbody>
                  {dataCapex2Rows}
                </tbody>
              </Table>
            </LoadingOverlay>

          </Col>
        </Row>

        <Row>
          <Col md="12">
            <LoadingOverlay active={isActiveLoadingCapex3} spinner text={t("WaitingPlease")}>

              <Table className="table mt-1" responsive>
                <thead className="table-light">
                  <tr>
                    <th>{t("ProjectDetails")}</th>
                    <th>{t("Amount")}</th>
                    <th> <Link className="float-end" onClick={() => {
                      setbotonValidation(true); setdataCapex3({
                        "transactId": 0,
                        "capexDetailsId": 0,
                        "observations": "",
                        "amount": 0,
                        "status": true
                      }); setTipo("CAPEX3"); toggleShowModalCapex3()
                    }}><i className="mdi mdi-plus-box-multiple-outline mdi-24px"></i></Link></th>
                  </tr>
                </thead>
                <tbody>
                  {dataCapex3Rows}
                </tbody>
              </Table>
            </LoadingOverlay>

          </Col>
        </Row>
        <AttachmentFileCore attachmentFileInputModel={{ instanceId: locationData.instanceId, processId: OPTs.PROCESS_INFORMEFINANCIERO, activityId: OPTs.ACT_CAPEX, personId: 0 }} />
      </AvForm>
      <ModalCapex1 SaveData={SaveData} botones={botonValidation} tipo={tipo} UpdateData={UpdateData} dataCapex1={dataCapex1} isOpen={showModalCapex1} toggle={() => { toggleShowModalCapex1() }} />
      <ModalCapex2 SaveData={SaveData} botones={botonValidation} tipo={tipo} UpdateData={UpdateData} dataCapex2={dataCapex2} isOpen={showModalCapex2} toggle={() => { toggleShowModalCapex2() }} />
      <ModalCapex3 SaveData={SaveData} botones={botonValidation} tipo={tipo} UpdateData={UpdateData} dataCapex3={dataCapex3} isOpen={showModalCapex3} toggle={() => { toggleShowModalCapex3() }} />
      {successSave_dlg ? (
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
      ) : null}

      {error_dlg ? (
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
            const apiBack = new BackendServices();
            if (tipo == "DCAPEX1") {
              apiBack.deleteCapexIGR({ transactId: dataLocation.transactionId, capexsId: dataCapex1.capexId }).then(resp => {
                if (resp.statusCode == "500") {
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
            if (tipo == "DCAPEX2") {
              apiBack.removeCapexBudgetIGR({ transactId: dataLocation.transactionId, capexId: dataCapex2.capexId }).then(resp => {
                if (resp.statusCode == "500") {
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
            if (tipo == "DCAPEX3") {
              apiBack.removeCapexDetailProjectIGR({ transactId: dataLocation.transactionId, capexDetailsId: dataCapex3.capexId }).then(resp => {
                if (resp.statusCode == "500") {
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
          {t("Youwontbeabletorevertthis")}
        </SweetAlert>
      ) : null}
    </>
  );
};

Capex.propTypes = {
  sources: PropTypes.array,
  budgets: PropTypes.array,
  projects: PropTypes.array,
};

Capex.defaultProps = {
  sources: [],
  budgets: [],
  projects: []
};

export default Capex;
