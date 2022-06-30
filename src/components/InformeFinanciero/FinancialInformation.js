import PropTypes from 'prop-types';
import { translationHelpers } from '../../helpers/translation-helper';

import {
  Table,
  Card,
  CardBody,
  Row,
  Col,
  Button
} from "reactstrap"
import React, { useState } from 'react';
import { BackendServices } from "../../services";
import ModalFinancialInformation from "../../pages/CommercialCredit/6_AnalisisCredito/ModalFinancialInformation"
import SweetAlert from "react-bootstrap-sweetalert"
import HeaderSections from '../Common/HeaderSections';
import { Link } from "react-router-dom";
import * as url from "../../helpers/url_helper"
import { useLocation, useHistory } from 'react-router-dom'
import Currency from '../../helpers/currency';

const FinancialInformation = (props) => {
  const location = useLocation()
  const [locationData, setLocationData] = useState(location.data ?? JSON.parse(sessionStorage.getItem('locationData')));
  const history = useHistory();


  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [info_dlg, setinfo_dlg] = useState(false)
  const [info_msg, setinfo_msg] = useState("")
  const [dynamic_title, setdynamic_title] = useState("")
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [success_dlg, setsuccess_dlg] = useState(false)
  const [dynamic_description, setdynamic_description] = useState("")


  const [financialInformation, setFinancialInformation] = useState(null);
  const [ShowModelFinancialInformation, setShowModelFinancialInformation] = useState(false);
  const [DataUpdate, setDataUpdate] = useState(null);
  const [tipo, setTipo] = useState('guardar');

  var aligCell = { verticalAlign: "middle", textAlign: "center" };

  // setFinancialInformation({
  //   headers: ['Yarly Reyes (sep-19)', 'Yarly Reyes (sep-20)'],
  //   data: [
  //     { key: 'Participación', values: ['50%', '50%'] },
  //     { key: '- ACTIVOS', values: null },
  //     { key: 'Efectivos', values: ['$2400', '$3000'] },
  //     { key: 'Acciones', values: ['$10000', '$10000'] },
  //     { key: 'TOTAL ACTIVOS', values: ['$12400', '$13000'] },
  //     { key: '- PASIVOS', values: null },
  //     { key: 'Prestamos', values: ['$2800', '$2800'] },
  //     { key: '- PATRIMONIO', values: null },
  //     { key: 'Patrimonio Personal', values: ['$10000', '$10000'] },
  //     { key: '- TOTAL PASIVO Y PATRIMONIO', values: ['$12800', '$12800'] }
  //   ]
  // });

  const [t, c, tr] = translationHelpers('commercial_credit', 'common', 'translation');

  // const { headers, data } = financialInformation.data;


  // const dataRows = data.map((item, index) => (
  //   <tr key={'row-' + index}>
  //     <td>{item.key}</td>
  //     {item.values ? item.values.map(col => (
  //       <td>{col}</td>
  //     )) : <td colSpan="2">&nbsp;</td>}
  //   </tr>)
  // );

  const currencyData = new Currency();


  React.useEffect(() => {
    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
        //location.data.transactionId = 0;
        //checkAndCreateProcedure(location.data);
        history.push(url.URL_DASHBOARD);
      }
      else {
        sessionStorage.setItem('locationData', JSON.stringify(location.data));
        setLocationData(location.data);
        LoadFinancialInformation();
      }
    }
    else {
      //chequeamos si tenemos guardado en session
      var result = sessionStorage.getItem('locationData');
      if (result !== undefined && result !== null) {
        result = JSON.parse(result);
        setLocationData(result);
        LoadFinancialInformation();
      }
    }
  }, []);


  function LoadFinancialInformation() {
    const api = new BackendServices()
    api.consultarInformiacionFinancieraFiadores(locationData.transactionId).then(data => {
      data && DrawInformation(data)
    }).catch(err => {
      setFinancialInformation(
        (<tr key={1}>
          <td colSpan="10" style={{ textAlign: 'center' }}></td>
        </tr>));
    });
  }

  function toggleShowModel() {
    setShowModelFinancialInformation(!ShowModelFinancialInformation);
  }

  function SendDataToServer(data) {
    data = { transactId: locationData.transactionId, debtorId: 2, ...data };
    if (tipo == 'guardar') {
      InserData(data);
    } else {
      UpdateData(data);
    }
  }

  function InserData(data) {
    const api = new BackendServices()
    let jsonSet = {
      "transactId": Number(locationData.transactionId),
      "debtorId": Number(data?.debtorId ?? 0),
      "personType": data?.personType ?? "",
      "identificationType": data?.identificationType ?? "",
      "identificationNumber": data?.identificationNumber ?? "",
      "firstName": data?.firstName ?? "",
      "secondName": data?.secondName ?? "",
      "firstLastName": data?.firstLastName ?? "",
      "secondLastName": data?.secondLastName ?? "",
      "share": Number(data?.share ?? 0),
      "activeCash": Number(data?.activeCash ?? 0),
      "activeShares": Number(data?.activeShares ?? 0),
      "passiveLoan": Number(data?.passiveLoan ?? 0),
      "personalWealth": Number(data?.personalWealth ?? 0),
    }
    api.nuevoInformacionFinancieraFiadores(jsonSet).then(resp => {
      LoadFinancialInformation();
      if (resp.statusCode == 200) {
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

  function UpdateData(data) {
    const api = new BackendServices()
    let jsonSet = {
      "transactId": Number(locationData.transactionId),
      "debtorId": Number(data?.debtorId ?? 0),
      "guarantorId": Number(data?.guarantorId ?? 0),
      "personType": data?.personType ?? "",
      "identificationType": data?.identificationType ?? "",
      "identificationNumber": data?.identificationNumber ?? "",
      "firstName": data?.firstName ?? "",
      "secondName": data?.secondName ?? "",
      "firstLastName": data?.firstLastName ?? "",
      "secondLastName": data?.secondLastName ?? "",
      "share": Number(data?.share ?? 0),
      "activeCash": Number(data?.activeCash ?? 0),
      "activeShares": Number(data?.activeShares ?? 0),
      "passiveLoan": Number(data?.passiveLoan ?? 0),
      "personalWealth": Number(data?.personalWealth ?? 0),
      status: true
    }
    api.actualizarInformacionFinancieraFiadores(jsonSet).then(resp => {
      LoadFinancialInformation();
      if (resp.statusCode == 200) {
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

  function EditDataFiadores(data) {
    setDataUpdate(data);
    toggleShowModel()
  }

  function DeleteDataFiadores(data) {
    setDataUpdate(data);
    setconfirm_alert(true);
  }

  function DrawInformation(data) {
    setTipo('editar');
    let Cells = data?.map((item, index) => (
      <tr key={'row-' + index}>
        <td style={{ textAlign: "center" }}>{item.secondName} {item.firstName}</td>
        <td style={{ textAlign: "center" }}>{item.personType}</td>
        <td style={{ textAlign: "center" }}>{currencyData.format(item.activeCash ?? 0)}</td>
        <td style={{ textAlign: "center" }}>{currencyData.format(item.activeShares ?? 0)}</td>
        <td style={{ textAlign: "center" }}>{(currencyData.format(((item.activeCash ?? 0) + (item.activeShares ?? 0))))}</td>
        <td style={{ textAlign: "center" }}>{currencyData.format(item.passiveLoan ?? 0)}</td>
        <td style={{ textAlign: "center" }}>{currencyData.format(item.passiveLoan ?? 0)}</td>
        <td style={{ textAlign: "center" }}>{currencyData.format(item.personalWealth ?? 0)}</td>
        <td style={{ textAlign: "center" }}>{(currencyData.format((item.passiveLoan ?? 0) + (item.personalWealth ?? 0)))}</td>
        {!props.preview && <td style={{ textAlign: "right" }}>
          <Button type="button" color="link" onClick={(resp) => { EditDataFiadores(item) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
          <Button type="button" color="link" onClick={(resp) => { DeleteDataFiadores(item) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
        </td>}
      </tr>
    ))

    setFinancialInformation(Cells.length > 0 ? Cells :
      (<tr key={1}>
        <td colSpan="10" style={{ textAlign: 'center' }}></td>
      </tr>));
  }

  return (
    <>

      <HeaderSections title="Guarantors Financial Information" t={tr} descri="Natural and Legal Person"></HeaderSections>

      <Row>
        {!props.preview && <Col md="12" style={{ textAlign: "right" }}>
          <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => { setDataUpdate(null); setTipo('guardar'); toggleShowModel() }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
        </Col>}
        <Col lg="12">
          <div className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table mb-0">
              <thead>
                <tr>
                  {/* <th>&nbsp;</th>
                    <th>{headres}</th> */}
                  <th rowSpan="2" style={aligCell}>{tr("Client")}</th>
                  <th rowSpan="2" style={aligCell}>{tr("PersonType")}</th>
                  <th colSpan="2" style={aligCell}>{tr("ASSETS")}</th>
                  <th rowSpan="2" style={aligCell}><b>{tr("TOTALASSETS")}</b></th>
                  <th style={aligCell}>{tr("PASSIVE")}</th>
                  <th rowSpan="2" style={aligCell}><b>{tr("TOTALLIABILITIES")}</b></th>
                  <th style={aligCell}>{tr("HERITAGE")}</th>
                  <th rowSpan="2" style={aligCell}><b>{tr("TOTALLIABILITIESANDEQUITY")}</b></th>
                  {!props.preview && <th rowSpan="2" style={aligCell}>{tr("Actions")}</th>}
                </tr>
                <tr style={{ borderRadius: '0px !important' }}>
                  <th style={aligCell}>{tr("Cash")}</th>
                  <th style={aligCell}>{tr("Actions")}</th>
                  <th style={aligCell}>{tr("Loans")}</th>
                  <th style={aligCell}>{tr("PersonalPatrimony")}</th>
                </tr>
              </thead>
              <tbody>
                {financialInformation}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      <ModalFinancialInformation isOpen={ShowModelFinancialInformation} toggle={() => { toggleShowModel() }} tipo={tipo} SendDataToServer={SendDataToServer} DataUpdate={DataUpdate} />
      {successSave_dlg ? (
        <SweetAlert
          success
          title={t("SuccessDialog")}
          confirmButtonText={t("Confirm")}
          cancelButtonText={t("Cancel")}
          onConfirm={() => {
            setsuccessSave_dlg(false)
            LoadFinancialInformation();
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
            LoadFinancialInformation();
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
            apiBack.eliminarInformacionFinancieraFiadores(locationData.transactionId, DataUpdate.debtorId, DataUpdate.guarantorId).then(resp => {
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
          }}
          onCancel={() => setconfirm_alert(false)}
        >
          {tr("Youwontbeabletorevertthis")}
        </SweetAlert>
      ) : null}
    </>
  );
};

FinancialInformation.propTypes = {
  products: PropTypes.array
};

export default FinancialInformation;
