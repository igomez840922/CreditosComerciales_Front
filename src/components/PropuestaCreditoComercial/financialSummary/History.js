import React, { useEffect, useState } from "react"
import PropTypes from 'prop-types';
import { translationHelpers } from '../../../helpers/translation-helper';

import {
  Table,
  Card,
  CardBody,
  Button,
  Col
} from "reactstrap"
import { BackendServices } from '../../../services';
import { useLocation, useHistory } from 'react-router-dom'
import ModalNewHistoryDetail from './ModalNewHistoryDetail';
import SweetAlert from "react-bootstrap-sweetalert";
import HeaderSections from "../../Common/HeaderSections";
import { Link } from "react-router-dom";
import Currency from "../../../helpers/currency";


const History = (props) => {
  const location = useLocation();

  const [t, c, tr] = translationHelpers('commercial_credit', 'common', 'translation');

  const api = new BackendServices();


  const { editMode } = props;

  /**
   * All useState
   */
  const [displayModalNewHistoryDetail, setDisplayModalNewHistoryDetail] = useState(false);
  const [dataRows, setDataRows] = useState(null);
  const [totals, setTotals] = useState(null);
  const [totalRow, setTotalRow] = useState(null);
  const [proportions, setProportions] = useState(null);
  const [proportionRow, setProportionRow] = useState(null);
  const [confirm_alert, setconfirm_alert] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [bank, setbank] = useState(null);
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [dataEdit, setDataEdit] = useState(null);
  const [action, setAction] = useState(null);
  const [dataLocation, setdataLocaton] = useState(location.data ?? JSON.parse(sessionStorage.getItem('locationData')));
  /**
   * End All useState
   */

  const currencyData = new Currency();

  const headers = [
    t('# days', { days: 30 }),
    t('# days', { days: 60 }),
    t('# days', { days: 90 }),
    t('# days', { days: 120 }),
    t('# days', { days: 150 }),
    t('# days', { days: 180 }),
    t('# days', { days: 210 }),
    t('# days', { days: 240 }),
    t('# days', { days: 270 }),
    t('# days', { days: 300 }),
    t('# days', { days: 330 }),
    t('+# days', { days: 331 }),
    tr('Totals')
  ]

  !props.preview && headers.push(tr('Actions'));


  React.useEffect(() => {
    getDataHistory();
  }, []);

  function calculateTotals(headers, data) {
    const totals = new Array(headers.length);
    totals.fill(0, 0, headers.length);
    headers.forEach((header, index) => {
      totals[index] = data.reduce((total, current) => {
        return total + current.data[index];
      }, 0);
    });
    return totals.filter(Boolean);
  }

  function calculateProportions(headers, data) {
    const cols = new Array(headers.length);
    cols.fill(0, 0, headers.length);
    return cols;
  }
  const dataHeaders = headers.map((header, index) => (
    <th key={"header-" + index} className="text-start">{header}</th>
  ));

  function getDataHistory() {
    api.consultarDetalleAntiguedad(dataLocation?.transactionId ?? 0, props.debtorId).then((data) => {

      let mapData = data?.map($$ => ({ data: [...Object.entries($$.details).map(([key, value]) => value), $$.total] }));

      setDataRows(data?.map((item, index) => {
        let key = 0;
        return (
          <tr key={'row-' + index}>
            <td data-label={t("Country / Client")} key={index}>{item.bank}{index}</td>
            {Object.entries(item.details).map(([data, col]) => (
              <td key={"col-" + key++} data-label={headers[key]} className="text-end">{currencyData.format(col ?? 0)}</td>
            ))}
            <td data-label={tr('Totals')} className="text-end">{currencyData.format(item.total ?? 0)}</td>
            {!props.preview && <td data-label={t("Actions")} style={{ textAlign: "right" }}>
              <Button type="button" color="link" onClick={(resp) => {
                editData(item)
              }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
              <Button type="button" color="link" onClick={(resp) => {
                deleteData(item.bank)
              }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
            </td>}
          </tr>)
      }
      ));
      // Calculate total
      let totals = (calculateTotals(headers, mapData));
      setTotalRow(
        <tr className="table-info">
          <th>{t("Total").toLocaleUpperCase()}</th>
          {totals.map((val, index) => {
            if (!val)
              return;
            return (
              <th key={index} className="text-start">{currencyData.format(val ?? 0)}</th>
            );
          })}
          {!props.preview && <th></th>}
        </tr>
      );

      // Calculate proportions
      let proportions = (calculateProportions(headers, mapData));
      setProportionRow(
        <tr>
          <td>{t("Proportion").toLocaleUpperCase()}</td>
          {proportions.map((val, index) => (
            <td key={index} className="text-start">{val}</td>
          ))}
        </tr>
      );
    })


  }

  function toggleModalNewHistoryItem() {
    setDisplayModalNewHistoryDetail(!displayModalNewHistoryDetail);
  }

  async function onSave(values) {

    values = { details: values, transactId: dataLocation.transactionId, personId: props.debtorId, total: values.totals, percentage: (values.totals / (headers.length - 2)), bank: values.bank }
    delete values.details.bank
    delete values.details.totals
    action == 'edit' && await api.actualizarDetalleAntiguedad(values).then(resp => {
      if (resp.statusCode == "500" || undefined) {
        seterror_dlg(false)
      } else {
        setsuccessSave_dlg(true)
      }
    }).catch(err => {
      seterror_dlg(false)
    });

    action == 'new' && await api.nuevoDetalleAntiguedad(values).then(resp => {
      if (resp.statusCode == "500" || undefined) {
        seterror_dlg(false)
      } else {
        setsuccessSave_dlg(true)
      }
    }).catch(err => {
      seterror_dlg(false)
    });

    getDataHistory();
  }

  function editData(data) {
    setDataEdit(data);
    toggleModalNewHistoryItem();
    setAction('edit');
  }

  function deleteData(bank) {
    setbank(bank);
    setconfirm_alert(true);
  }
  return (
    <>
      <HeaderSections title="History Details" t={t}></HeaderSections>
      <p className="card-title-desc"></p>
      {!props.preview && <Col md="12" style={{ textAlign: "right" }}>
        <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => { setAction('new'); toggleModalNewHistoryItem(); setDataEdit(null); }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
      </Col>}
      <div className="table-responsive styled-table-div mt-2">
        <Table className="table table-striped table-hover styled-table table mb-0">
          <thead>
            <tr>
              <th>{t("Country / Client")}</th>
              {dataHeaders}
            </tr>
          </thead>
          <tbody>
            {dataRows}
            {dataRows?.length > 0 && totalRow}
            {/* {proportionRow} */}
          </tbody>
        </Table>
      </div>
      <ModalNewHistoryDetail dataEdit={dataEdit} setAction={setAction} isOpen={displayModalNewHistoryDetail} toggle={toggleModalNewHistoryItem} onSave={onSave} />

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
            apiBack.eliminarDetalleAntiguedad(dataLocation.transactionId, props.debtorId, bank).then(resp => {
              if (resp.statusCode == "500" || undefined) {
                setconfirm_alert(false)
                seterror_dlg(false)
              } else {
                setconfirm_alert(false)
                setsuccessSave_dlg(true)
              }
              getDataHistory();
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

      {successSave_dlg ? (
        <SweetAlert
          success
          title={t("SuccessDialog")}
          confirmButtonText={t("Confirm")}
          cancelButtonText={t("Cancel")}
          onConfirm={() => {
            setsuccessSave_dlg(false)
            getDataHistory();
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
            getDataHistory();
          }}
        >
          { }
        </SweetAlert>
      ) : null}
    </>
  );
};

History.propTypes = {
  title: PropTypes.string,
  headers: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  editMode: PropTypes.bool,
  addHistoryDetail: PropTypes.func
};

History.defaultProps = {
  editMode: false
};


export default History;
