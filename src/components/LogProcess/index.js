//Gestionar Log de los Procesos
import React, { useEffect, useState } from "react"
import PropTypes from 'prop-types';
import { Link, useLocation } from "react-router-dom"
import functionshelper from "../../helpers/functions_helper"
import moment from "moment";

import {
  Table,
  Card, CardHeader,
  CardBody,
  UncontrolledAlert,
  Pagination,
  PaginationItem,
  PaginationLink,
  CardFooter,
  Button,
  Row,
  Col,
} from "reactstrap"

import Alert from 'react-bootstrap/Alert'
//i18n
import { withTranslation } from "react-i18next"
//Import SweetAlert
import SweetAlert from "react-bootstrap-sweetalert"

import ModalNewLog from "./ModalNewLog"
import { BackendServices } from "../../services/index";

import LocalStorageHelper from "../../helpers/LocalStorageHelper";
import * as opt from "../../helpers/options_helper"


import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';

import { useTranslation } from 'react-i18next'
import { uniq_key } from "../../helpers/unq_key";

const { ExportCSVButton } = CSVExport;

const { SearchBar } = Search;

const MyExportCSV = (props) => {
  const handleClick = () => {
    props.onExport();
  };
  return (
    <div>
      <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={handleClick}><i className="fas fa-file-csv"></i> {(" ")}</Button>
    </div>
  );
};


const LogProcess = props => {

  const { t, i18n } = useTranslation();
  const [logProcessModel, setlogProcessModel] = useState(props.logProcessModel);

  const [dataList, setDataList] = useState([]);
  const [displayNewLogModal, setDisplayNewLogModal] = useState(false);

  const [mainDebtor, setmainDebtor] = useState(null);
  const [backendServices, setbackendServices] = useState(new BackendServices());

  const [msgData, setmsgData] = useState({ show: false, msg: "", isError: false });

  const [localStorageHelper, setlocalStorageHelper] = useState(new LocalStorageHelper());

  const [dataOptions, setDataOptions] = useState([]);
  const [dataHeader, setDataHeader] = useState([]);
  const [dataBody, setDataBody] = useState([]);


  useEffect(() => {
    if (logProcessModel !== undefined && logProcessModel !== null) {
      loadMainDebtor(logProcessModel.transactId);
      searchData(logProcessModel.transactId)
    }
  }, []);

  useEffect(() => {
    if (logProcessModel !== undefined && logProcessModel !== null) {
      loadMainDebtor(logProcessModel.transactId);
      searchData(logProcessModel.transactId)
    }
  }, [props.updatedata]);

  //nuevo log
  function toggleDisplayNewLogModal() {
    setDisplayNewLogModal(!displayNewLogModal);
    removeBodyCss()
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  function loadMainDebtor(transactionId) {
    // consultarDeudorPrincipal
    backendServices.consultPrincipalDebtor(transactionId)
      .then((data) => {
        if (data !== undefined) {
          setmainDebtor(data);
        }
      });
  }

  //buscamos las Propuestas de Credito
  function searchData(transactId) {

    loadTableData(transactId);
    /*backendServices.getHistorical(transactId)
      .then(resp => {
        const dataRows = resp.map((dt, idx) => (
          <tr key={idx}>
            <td scope="row">{moment(dt.date).format("YYYY-MM-DD HH:mm:ss")}</td>
            <td>{dt.observations}</td>
            <td>{dt.processBpmName }</td>
            <td>{dt.activityBpmName }</td>
            <td>{dt.statusDescription}</td>
            <td>{dt.responsible}</td>
          </tr>)
        );
        setDataList(dataRows);
      }).catch(err => {console.log(err);});*/
  }

  async function loadTableData(transactId) {

    var result = await backendServices.getHistorical(transactId)
    console.log("logProcessModelResult",result);

    if (result !== undefined) {
      for (var dt of result) {
        dt.date = moment(dt.date).format("DD-MM-YYYY HH:mm:ss")
      }
      setDataBody(result);
    }


    let options = {
      textLabels: {
        body: {
          noMatch: t("NoData"),
          toolTip: t("Order"),
          key: uniq_key(),
          columnHeaderTooltip: (column) => `${t("OrderBy")} ${column.label}`,
        },
        pagination: {
          next: t("Next"),
          previous: t("Prev"),
          rowsPerPage: t("RowsPerPage"),
          displayRows: t("From"),
          sizePerPage: 5,
          key: uniq_key(),
          sizePerPageList: [{
            text: '5th', value: 5
          }, {
            text: '10th', value: 10
          }, {
            text: 'All', value: 20
          }]
        },
        toolbar: {
          search: t("Search"),
          downloadCsv: t("DownloadCSV"),
          print: t("Print"),
          viewColumns: t("ViewColumns"),
          filterTable: t("FilterTable"),
        },
        filter: {
          all: t("All"),
          title: t("Filter"),
          reset: t("Restore"),
        },
        viewColumns: {
          title: t("ShowColumns"),
          titleAria: t("ShowHideColumns"),
        },
        selectedRows: {
          text: t("SelectedRows"),
          delete: t("Delete"),
          deleteAria: t("DeleteSelectedRows"),
        },
      },
    };

    //Header de la Tabla de Bandeja de Entrada
    const columns = [
      { text: t("Date"), dataField: 'date', sort: true },
      { text: t("Comment"), dataField: 'observations', sort: true },
      { text: t("Process"), dataField: 'processBpmName', sort: true },
      { text: t("Activity"), dataField: 'activityBpmName', sort: true },
      { text: t("Status"), dataField: 'statusDescription', sort: true },
      { text: t("Return Description"), dataField: 'devolutionDesc', sort: true },
      { text: t("User"), dataField: 'responsible', sort: true }
    ];

    setDataHeader(columns);
    setDataOptions(options);
  }

  function onSaveLogProcess(observations) {

    var credentials = localStorageHelper.get(opt.VARNAME_USRCREDENTIAL);

    logProcessModel.responsible = credentials?.usr ?? "admin"
    logProcessModel.clientId = mainDebtor?.personId ?? logProcessModel.clientId;
    logProcessModel.observations = observations;
    console.log("logProcessModel",logProcessModel)
    backendServices.saveHistorical(logProcessModel)
      .then(resp => {
        if (resp !== undefined) {
          searchData(logProcessModel.transactId);
        }
        else {
          //Mensaje ERROR
          showMessage(t("ErrorSaveMessage"), true);
        }
      }).catch(err => {
        console.log(err);
      });
  }

  //mostrar mensaje 
  function showMessage(message, isError = false) {
    setmsgData({ show: true, msg: message, isError: isError })
  }


  return (
    <React.Fragment>
      <Card>

        <CardHeader>
          <Row>
            <Col md={6}>
              <h4 className="card-title">{t("Binnacle")}</h4>
            </Col>
            {!props?.preview && <Col md={6} style={{ textAlign: "right" }}>
              <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toggleDisplayNewLogModal() }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>

            </Col>}
          </Row>
        </CardHeader>
        {/*<CardBody>
              <Row>
                  <Col md="12">
                    <Alert show={msgData.show} variant={msgData.isError ? "danger" : "success"} dismissible onClose={() => { setmsgData({ show: false, msg: "", isError: false }) }}>
                      {msgData.msg}
                    </Alert>
                  </Col>
                </Row>
        <Row>
          <Col md={12}>
            <div className="table-responsive styled-table-div">
              <Table className="table table-striped table-hover styled-table">
                <thead className="">
                  <tr>
                    <th>{t("Date")}</th>
                    <th>{t("Comment")}</th>
                    <th>{t("Process")}</th>
                    <th>{t("Activity")}</th>
                    <th>{t("Status")}</th>
                    <th>{t("User")}</th>
                  </tr>
                </thead>
                <tbody>
                  {dataList!==undefined && dataList.length>0?
                    dataList:
                  <td colspan="7"><div className="alert alert-info" style={{ textAlign: "center" }}>{t("NoData")}</div></td> }
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
        
      </CardBody>*/}

        <CardBody>
          {dataHeader.length > 0 ?
            <ToolkitProvider
              keyField={"pooo"}
              data={dataBody}
              columns={dataHeader}
              search
              exportCSV
            >
              {
                props => (
                  <div className="">
                    <Row>
                      <Col md={4}>
                        <SearchBar className="custome-search-field float-end" delay={1000} placeholder={t("Search")} {...props.searchProps} />
                      </Col>
                      <Col md={8} style={{ textAlign: "right" }}>
                        {/*<MyExportCSV { ...props.csvProps } />*/}
                      </Col>
                    </Row>
                    <BootstrapTable
                      keyField="date"
                      bootstrap4
                      bordered={false}
                      striped
                      hover
                      condensed
                      classes='styled-table'
                      style={{ cursor: "pointer" }}
                      data={dataBody} columns={dataHeader}
                      {...props.baseProps}
                      pagination={paginationFactory({
                        sizePerPage: 30,
                        sizePerPageList: [30]
                      })}
                    />
                  </div>
                )
              }
            </ToolkitProvider>
            : null}
        </CardBody>
      </Card>
      <ModalNewLog onSaveLogProcess={(observations) => { onSaveLogProcess(observations) }} isOpen={displayNewLogModal} toggle={() => { toggleDisplayNewLogModal() }} />


    </React.Fragment>
  );
}
LogProcess.propTypes = {
  logProcessModel: PropTypes.any, //LogProcessModel
  updatedata: PropTypes.bool,
};
export default (withTranslation()(LogProcess))
