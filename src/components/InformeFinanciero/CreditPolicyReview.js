import React, { useEffect, useState } from "react"

import PropTypes from 'prop-types';
import { translationHelpers } from '../../helpers/translation-helper';

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

import AvField from 'availity-reactstrap-validation/lib/AvField';
import AvForm from 'availity-reactstrap-validation/lib/AvForm';
import { Link } from "react-router-dom";
import ModalPolicy from "../Attachments/ModalPolicy";
import SweetAlert from "react-bootstrap-sweetalert"
import { BackendServices, CoreServices, BpmServices, } from "../../services";
import LoadingOverlay from "react-loading-overlay";
import HeaderSections from "../Common/HeaderSections";
import { useLocation, useHistory } from 'react-router-dom'
import * as url from "../../helpers/url_helper"

const CreditPolicyReview = (props) => {

  const location = useLocation()

  const [displayModal, setDisplayModal] = useState(false);
  const [actions, setActions] = useState('');
  const [SusscessDialog, setSusscessDialog] = useState(false);
  const [dataRows, setdataRows] = useState(null);
  const [DataSend, setDataSend] = useState(null);
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [dataLocation, setData] = useState(location.data);
  const [dataDelete, setDataDelete] = useState([]);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [isActiveLoading, setIsActiveLoading] = useState(false);

  const history = useHistory();
  const [locationData, setLocationData] = useState(null);

  const [t, c, tr] = translationHelpers('commercial_credit', 'common', 'translation');

  let dataStorage;
  React.useEffect(() => {
    // Read Api Service data
    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
        //location.data.transactionId = 0;
        //checkAndCreateProcedure(location.data);
        history.push(url.URL_DASHBOARD);
        return;
      } else {
        sessionStorage.setItem('locationData', JSON.stringify(location.data));
        setLocationData(location.data);
        dataStorage = location.data;
      }
    } else {
      //chequeamos si tenemos guardado en session
      var result = sessionStorage.getItem('locationData');
      if (result !== undefined && result !== null) {
        result = JSON.parse(result);
        setLocationData(result);
        dataStorage = result;
      }
    }

    LoadData(dataStorage);
  }, []);

  if (!props.policies) {
    return null;
  }



  function LoadData(dataLocation) {
    const backendServices = new BackendServices();
    backendServices.consultarPoliticaCredito(dataLocation?.transactionId ?? 0).then(resp => {
      console.log(resp);
      console.log(resp.map((policy, index) =>
      (
        <tr key={'row-' + policy.id + '-' + index}>
          <th data-label={t("Parameters")}>{policy.parameter}</th>
          <td data-label={t("Conditions")}>{policy.condition}</td>
          <td data-label={t("Comply")}>
            {policy.comply ? 'Si' : 'No'}
          </td>
          <td data-label={t("Observations")}>{policy.observations}</td>
          {!props.preview && <td data-label={t("Actions")} style={{ textAlign: "right" }}>
            <Button type="button" color="link" onClick={(resp) => { editarSowActual(policy) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
            <Button type="button" color="link" onClick={(resp) => { eliminarSowActual(policy) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
          </td>}
        </tr>
      )
      ));
      setdataRows(resp.map((policy, index) =>
      (
        <tr key={'row-' + policy.id + '-' + index}>
          <th data-label={t("Parameters")}>{policy.parameter}</th>
          <td data-label={t("Conditions")}>{policy.condition}</td>
          <td data-label={t("Comply")}>
            {policy.comply ? 'Si' : 'No'}
          </td>
          <td data-label={t("Observations")}>{policy.observations}</td>
          {!props.preview && <td data-label={t("Actions")} style={{ textAlign: "right" }}>
            <Button type="button" color="link" onClick={(resp) => { editarSowActual(policy) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
            <Button type="button" color="link" onClick={(resp) => { eliminarSowActual(policy) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
          </td>}
        </tr>
      )
      ));
    });

  }

  // setdataRows(props.policies.map((policy) => {
  //   return policy.conditions.map((condition, index) => (
  //     <tr key={'row-' + policy.id + '-' + index}>
  //       <th>{index === 0 ? policy.parameter : ''}</th>
  //       <td>{condition.title}</td>
  //       <td>
  //         <AvField
  //           className="form-control"
  //           name={"comply[" + index + "]"}
  //           type="select"
  //           id={"comply-" + index}
  //           value="N/A">
  //           <option>{c("Yes")}</option>
  //           <option>{c("No")}</option>
  //           <option>{c("N/A")}</option>
  //         </AvField>
  //       </td>
  //       <td>{condition.observations[0]}</td>
  //     </tr>
  //   )
  //   )
  // }
  // ));

  function toggleModal() {
    setDisplayModal(!displayModal);
  }

  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    // props.onSubmit(values);
  }

  function DataUpdate(values) {
    setIsActiveLoading(true);
    let datos = { ...values, transactId: locationData.transactionId };
    const backendServices = new BackendServices();

    backendServices.actualizarPoliticaCredito(datos).then(resp => {
      if (resp.statusCode == "200") {
        setSusscessDialog(true);
      } else {
        seterror_dlg(false)
        seterror_msg(props.t("TheProcessCouldNotFinish"))
      }
      setIsActiveLoading(false);
    }).catch(err => {
      seterror_dlg(false)
      setIsActiveLoading(false);
    });
  }

  function DataInsert(values) {
    setIsActiveLoading(true);
    let datos = { ...values, transactId: +locationData.transactionId, debtorId: props.debtorId };
    const backendServices = new BackendServices();

    backendServices.nuevoPoliticaCredito(datos).then(resp => {
      if (resp.statusCode == "200") {
        setSusscessDialog(true);
        // LoadData();
      } else {
        seterror_dlg(false);
        seterror_msg(props.t("TheProcessCouldNotFinish"))
      }
      setIsActiveLoading(false);
    }).catch(err => {
      setIsActiveLoading(false);
    });
  }

  function editarSowActual(data) {
    toggleModal();
    setActions('edit');
    setDataSend(data);
  }

  function eliminarSowActual(data) {
    setDataDelete(data)
    setconfirm_alert(true);
  }

  function InsertShowCurrent() {
    setActions('new');
    setDataSend(null);
  }

  const styleHead = {
    background: '#f8f9fa',
    color: '#556176',
  },
    styleTrStart = {
      borderRadius: '17px 0 0 0'
    },
    styleTrEnd = {
      borderRadius: '0 17px 0 0'
    },
    styleRow = {
      borderRadius: '17px',
      background: '#fcfcfc'
    }

  return (
    <>
      {/* <Card> */}
      {/* <CardBody> */}
      <div className="d-flex flex-row justify-content-between">
        {/* <h4 className="card-title">{t("Credit Policy Review")}</h4> */}
        <HeaderSections title="Credit Policy Review" t={t}></HeaderSections>

      </div>
      {/* <p className="card-title-desc"></p> */}
      <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
        <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>
          <Row>
            {!props.preview && <Col md="12" style={{ textAlign: "right" }}>
              <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toggleModal(); InsertShowCurrent() }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
            </Col>}
            <Col lg="12">
              <div className="table-responsive styled-table-div">
                <Table className="table table-striped table-hover styled-table table">
                  <thead>
                    <tr>
                      <th style={styleTrStart}>{t("Parameters")}</th>
                      <th>{t("Conditions")}</th>
                      <th>{t("Comply")}</th>
                      <th>{t("Observations")}</th>
                      {!props.preview && <th></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </LoadingOverlay>
      </AvForm>
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
      {/* </CardBody> */}
      {displayModal &&
        <ModalPolicy
          isOpen={displayModal}
          toggle={toggleModal}
          DataUpdate={DataUpdate}
          DataInsert={DataInsert}
          actions={actions}
          DataSend={DataSend}
        />}

      {
        SusscessDialog ? (
          <SweetAlert
            success
            title={t("SuccessDialog")}
            confirmButtonText={t("Confirm")}
            cancelButtonText={t("Cancel")}
            onConfirm={() => {
              setSusscessDialog(false)
              LoadData(locationData);
            }}
          >
            {t("SuccessSaveMessage")}
          </SweetAlert>
        ) : null
      }

      {
        confirm_alert ? (
          <SweetAlert
            title={tr("Areyousure")}
            warning
            showCancel
            confirmButtonText={t("Yesdeleteit")}
            cancelButtonText={t("Cancel")}
            confirmBtnBsStyle="success"
            cancelBtnBsStyle="danger"
            onConfirm={() => {
              // setconfirm_alert(false)
              // setIsActiveLoading(true);
              const backendServices = new BackendServices();
              backendServices.eliminarPoliticaCredit(locationData.transactionId, dataDelete.debtorId, dataDelete.itemId).then(resp => {
                setIsActiveLoading(false);
                if (resp === null && resp === undefined) {
                  setconfirm_alert(false)
                  seterror_dlg(false)
                } else {
                  setconfirm_alert(false)
                  setSusscessDialog(true)
                }
              }).catch(error => {
                // setIsActiveLoading(false);
                setconfirm_alert(false)
                seterror_dlg(false)
              })
            }}
            onCancel={() => setconfirm_alert(false)}
          >
            {tr("Youwontbeabletorevertthis")}
          </SweetAlert>
        ) : null
      }
      {/* </Card> */}
    </>
  );
};

CreditPolicyReview.propTypes = {
  policies: PropTypes.array
};

export default CreditPolicyReview;
