import React, { useState } from "react"
import { Link } from "react-router-dom"
import PropTypes from 'prop-types';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { useTranslation } from 'react-i18next'
import { useLocation, useHistory } from 'react-router-dom'
import {
  Button,
  Label,
  Input,
  CardHeader,
  CardTitle,
  InputGroup,
  Table,
  CardFooter,
  Row, Col, Card, CardBody
} from "reactstrap"
import { Accordion } from 'react-bootstrap';
import SalesAnalytics from "./sales-analytics"
import ScatterChart from "./scatter-analytics"
import CreditProposalPage from '../CommercialCredit/5_PropuestaCredito/CreditProposalPage'
import ApiServiceBpm from "../../services/BpmServices/Services";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ApiServiceCore from "../../services/CoreServices/Services";
import * as opt from "../../helpers/options_helper"
import { ResultadoChecklistCentroArchivoModel } from "../../models";

import ModalWatchProces from "./ModalWacthProcess";
import { formatCurrency, translationHelpers } from '../../helpers';
import LoadingOverlay from "react-loading-overlay";
//import ActiveDirectoryService from "../../services/ActiveDirectory";
import TaskStatus from "../../components/ActivityTask/taskStatus";
import Currency from "../../helpers/currency";
import ModalTransferProcess from "./ModalTransferProcess";
import LocalStorageHelper from "../../helpers/LocalStorageHelper";

const { SearchBar } = Search;

const Dashboard = () => {
  const history = useHistory();
  const ordernar = new Currency()
  const { t, i18n } = useTranslation();
  const [tc, tr] = translationHelpers('commercial_credit', 'translation');
  const localStorageHelper = new LocalStorageHelper();

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      {t('Showing')} {from} {t('to')} {to} {t('of')} {size} {t('Results')}
    </span>
  );
  React.useEffect(() => {
    /* ------------------------------------------------------------------------------------------------------------------ */
    /*                       Llamamos a la funcion para que se pueda renderizar y llenar la tabla                      */
    /* ------------------------------------------------------------------------------------------------------------------ */

    const fixedDashboard = process.env.REACT_APP_FIXED_DASHBOARD;
    if (fixedDashboard) {
      // If .env has REACT_APP_FIXED_DASHBOARD, load fixed data
      // LoadData();
    }
    else {
      getDashBoard();
    }
    //LoadData();
  }, []);
  /* ------------------------------------------------------------------------------------------------------------------ */
  /*                                                Variables de estados                                                */
  /* ------------------------------------------------------------------------------------------------------------------ */
  const [showResults, setShowResults] = useState(false);
  const [dataList, setDataLista] = useState([]);
  const [dataOptions, setDataOptions] = useState([]);

  const [dataHeader, setDataHeader] = useState([]);
  const [dataBody, setDataBody] = useState([]);
  const [ShowDisplayModal, setShowDisplayModal] = useState(false);
  const [processInstanceId, setProcessInstanceId] = useState(null);
  const [isActiveLoading, setisActiveLoading] = useState(false);
  const [svg, setSvg] = useState(null);

  const [ShowModalTransfer, setShowModalTransfer] = useState(false);
  const [transferData, settransferData] = useState(null);

  const jsonPrioridad = [
    { value: "1", label: "Muy Urgente" },
    { value: "2", label: "Urgencia Moderada" },
    { value: "3", label: "Importante" },
    { value: "4", label: "Baja Urgencia" },
    { value: "5", label: " Sin Urgencia" }]
  const [dataRows, setdataRows] = useState(null);
  /* ------------------------------------------------------------------------------------------------------------------ */
  /*                                         Permite cargar los datos a la tabla                                        */
  /* ------------------------------------------------------------------------------------------------------------------ */
  async function getDashBoard() {

    setisActiveLoading(true)
    /* ------------------------------------------------------------------------------------------------------------------ */
    /*   Instanciamos la api para el result de la api y asi enviar al modelo para retornar un json armado para la tabla   */
    /* ------------------------------------------------------------------------------------------------------------------ */
    const api = new ApiServiceBpm();
    //api.getLineSerial("asd","asd");

    api.getDashBoard()
      .then((result) => {
        setisActiveLoading(false)
        /* ------------------------------------------------------------------------------------------------------------------ */
        /*             Seteamos los valores de las columnas y filas a la variable que va al componene de la tabla             */
        /* ------------------------------------------------------------------------------------------------------------------ */
        var credentials = localStorageHelper.get(opt.VARNAME_USRCREDENTIAL);

        result = [...ordernar.orderByJSON(result.filter(x => (+x.priority) > 0), "priority", "asc"), ...result.filter(x => (+x.priority) == 0)]
        setDataBody([...result.map($$ => {
          $$.action = (
            <>
              {$$.action}

              {
                $$.data.grupoldap !==undefined && $$.data.grupoldap !==null && (credentials.isAnalysisSupervisor || credentials.isAdmin)  ?
                  <Link to="#" onClick={(e) => { settransferData($$); setShowModalTransfer(true) }}>
                    <i className="mdi mdi-transit-transfer mdi-24px"></i>
                  </Link>
                  : null
              }

              <Link to="#" onClick={(e) => { setProcessInstanceId($$.instanceId); toggleModalWatchProcess(); }}>
                <i className="mdi mdi-eye mdi-24px"></i>
              </Link>
            
              {
                credentials.isAnalysisSupervisor?null:
                <TaskStatus taskStatus={$$.status}
                  pathname={$$.pathname}
                  data={$$.data}
                />
              }
              
            </>
          )
          return $$;
        })]);


      })
      .catch((error) => {
        setisActiveLoading(false)
        console.error(error);
      });

    /* ------------------------------------------------------------------------------------------------------------------ */
    /*        Creamos un json con los datos que va a tener la tabla en general para mostrar resultados o paginacion       */
    /* ------------------------------------------------------------------------------------------------------------------ */
    let options = {
      textLabels: {
        body: {
          noMatch: t("SorryNoMatchingRecordsWereFfound"),
          toolTip: t("Order"),
          columnHeaderTooltip: (column) => `${t("OrderBy")} ${column.label}`,
        },
        pagination: {
          next: t("Next"),
          previous: t("Prev"),
          rowsPerPage: t("RowsPerPage"),
          displayRows: t("From"),
          sizePerPage: 5,
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
      //  { text: "ID", dataField: 'uniqueData' },
      { text: t("Date"), dataField: 'date', sort: true },
      { text: t("Process"), dataField: 'instanceId', sort: true },
      { text: t("Procedure"), dataField: 'transactionId', sort: true },
      { text: t("AssignedTo"), dataField: 'asignedTo', sort: true },
      { text: t("Client"), dataField: 'personName', sort: true },
      { text: t("FacilityType"), dataField: 'facilityTypeId', sort: true },
      { text: t("Activity"), dataField: 'activity', sort: true },
      { text: t("Sla"), dataField: 'sla', sort: true },
      { text: t("Status"), dataField: 'status', sort: true },
      { text: t("Prioridad"), dataField: 'priorityName', sort: true },
      { text: "", dataField: 'action' }
    ];
    setDataHeader(columns);
    setDataOptions(options);
  }



  /* ------------------------------------------------------------------------------------------------------------------ */
  /*                               Funcion temporal para poder navegar entre las pantallas                              */
  /* ------------------------------------------------------------------------------------------------------------------ */

  function NewInstance() {

    //creamos un nueva instancia de proceso en BPM...
    const apiServiceBPM = new ApiServiceBpm();
    apiServiceBPM.startProcess()
      .then((number) => {

        if (number !== null && number !== undefined && number > 0) {
          //buscamos la tarea que crea el nuevo proceso
          apiServiceBPM.getTasksByPrcess(number)
            .then((result) => {
              if (result !== undefined) {

                //Inicializamos la nueva tarea en BPM
                apiServiceBPM.startedStatusTask(result.taskId)
                  .then((iniresult) => {
                    if (iniresult !== undefined) {
                      //datos que le enviamos a la pantalla de busqueda y descarte
                      history.push({
                        pathname: '/creditocomercial/busquedadescarte',
                        data: { customerId: "", transactionId: "", processId: opt.PROCESS_BUSQUEDADESCARTE.toString(), activityId: opt.ACT_NONE.toString(), instanceId: result.instanceId, taskId: result.taskId, taskStatus: result.status },
                      });
                    }
                  })
              }
            })
        }
      })
      .catch((error) => {

        //Mostrar Mensaje Proceso no instanciado
        console.error('api error: ', error);
      });
  }

  function toggleModalWatchProcess() {
    setShowDisplayModal(!ShowDisplayModal)
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title={t("Dashboard")} breadcrumbItem={t("Inbox")} />

        <Card>
          <CardBody>

            <CardTitle className="h4">{t("Management")}</CardTitle>
            <p className="card-title-desc">
              {t("Inboxofthecommercialcreditprocess")}
            </p>

            <LoadingOverlay active={isActiveLoading} spinner text={t("Processinginformation")}>
              {dataHeader.length > 0 ?
                <ToolkitProvider
                  keyField="uniqueData"
                  data={dataBody}
                  columns={dataHeader}
                  search
                >
                  {
                    props => (
                      <div className="">

                        <SearchBar className="custome-search-field float-end" delay={1000} placeholder={t("Search")} {...props.searchProps} />
                        <BootstrapTable
                          keyField="uniqueData"
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
            </LoadingOverlay>
            {showResults && <CreditProposalPage />}


          </CardBody>
        </Card>
      </div>
      {processInstanceId && (<ModalWatchProces isOpen={ShowDisplayModal} toggle={() => { toggleModalWatchProcess() }} svg={svg} processInstanceId={processInstanceId} t={tr} />)}

      <ModalTransferProcess isOpen={ShowModalTransfer} toggle={() => { setShowModalTransfer(!ShowModalTransfer) }} data={transferData}
        updateData={() => {
          console.log("updateData");
          let timer = setTimeout(() => { getDashBoard(); }, 1000);
          return () => clearTimeout(timer);
        }
        } />
    </React.Fragment>
  );
}

export default Dashboard
