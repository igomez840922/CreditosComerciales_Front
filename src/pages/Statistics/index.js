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


import ApiServiceBpm from "../../services/BpmServices/Services";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ApiServiceCore from "../../services/CoreServices/Services";
import * as opt from "../../helpers/options_helper"
import { ResultadoChecklistCentroArchivoModel } from "../../models";


import { formatCurrency, translationHelpers } from '../../helpers';
import LoadingOverlay from "react-loading-overlay";
//import ActiveDirectoryService from "../../services/ActiveDirectory";
import TaskStatus from "../../components/ActivityTask/taskStatus";
import SalesAnalytics from "./sales-analytics"
import ScatterChart from "./scatter-analytics"
const { SearchBar } = Search;

const Dashboard = () => {
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const [tc, tr] = translationHelpers('commercial_credit', 'translation');

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
      LoadData();
    }
    else {
      setisActiveLoading(true)
      //getDashBoard();
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

  const [dataRows, setdataRows] = useState(null);
  /* ------------------------------------------------------------------------------------------------------------------ */
  /*                                         Permite cargar los datos a la tabla                                        */
  /* ------------------------------------------------------------------------------------------------------------------ */
  async function getDashBoard() {
    /* ------------------------------------------------------------------------------------------------------------------ */
    /*   Instanciamos la api para el result de la api y asi enviar al modelo para retornar un json armado para la tabla   */
    /* ------------------------------------------------------------------------------------------------------------------ */
    const api = new ApiServiceBpm();
    // api.getLineSerial("asd","asd");
    api.getDashBoard()
      .then((data) => {
        console.log(data);
        setisActiveLoading(false)
        /* ------------------------------------------------------------------------------------------------------------------ */
        /*             Seteamos los valores de las columnas y filas a la variable que va al componene de la tabla             */
        /* ------------------------------------------------------------------------------------------------------------------ */
        setDataBody([...data.results.map($$ => {
          $$.action = (
            <>
              {$$.action}
              <Link onClick={(e) => { setProcessInstanceId($$.instanceId); toggleModalWatchProcess(); }}>
                <i className="mdi mdi-eye mdi-24px"></i>
              </Link>
              <TaskStatus taskStatus={$$.status}
                pathname={$$.pathname}
                data={$$.data}
              />
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
      { text: <strong>{t("Date")}</strong>, dataField: 'date', sort: true },
      { text: <strong>{t("Process")}</strong>, dataField: 'instanceId', sort: true },
      { text: <strong>{t("Procedure")}</strong>, dataField: 'transactionId', sort: true },
      { text: <strong>{t("Request")}</strong>, dataField: 'applicationNumber', sort: true },
      { text: <strong>{t("Client")}</strong>, dataField: 'personName', sort: true },
      { text: <strong>{t("Activity")}</strong>, dataField: 'activity', sort: true },
      { text: <strong>{t("Status")}</strong>, dataField: 'status', sort: true },
      { text: "", dataField: 'action' },
    ];

    setDataHeader(columns);
    setDataOptions(options);
  }



  /* ------------------------------------------------------------------------------------------------------------------ */
  /*                               Funcion temporal para poder navegar entre las pantallas                              */
  /* ------------------------------------------------------------------------------------------------------------------ */
  function LoadData() {
    setisActiveLoading(false)
    let body = [
      {
        date: "25/09/2021 09:12 AM",
        taskId: "00123", // BPM Id de la tarea
        instanceId: "321001",// BPM Id del Proceso
        processNumber: "00123",
        procedureNumber: "321001",
        applicationNumber: "123",
        transactId: 6,
        activityId: 1,
        processId: 1,//value[i]["task-id"],
        activity: "Busqueda y Descarte",
        status: "ok",
        action: (
          <Link
            to={{
              pathname: "/creditocomercial/presolicitud",
              data: { requestId: "", facilityId: "", customerId: "", transactionId: "", processId: opt.PROCESS_BUSQUEDADESCARTE.toString(), activityId: opt.ACT_NONE.toString(), instanceId: 123, taskId: 456, taskStatus: "Ready" },
            }}
          >
            <i className="mdi mdi-file-search-outline mdi-24px"></i>
          </Link>
        ),
      },
      {
        date: "25/09/2021 09:12 AM",
        taskId: "00123", // BPM Id de la tarea
        instanceId: "321001",// BPM Id del Proceso
        processNumber: "00123",
        procedureNumber: "321001",
        applicationNumber: "123",
        transactId: 6,
        activityId: 1,
        processId: 1,//value[i]["task-id"],
        activity: "Cumplimiento",
        status: "ok",
        action: (
          <Link
            to={{
              pathname: "/creditocomercial/descartarcoincidencia",
              data: { requestId: "", facilityId: "", customerId: "", transactionId: "190", processId: opt.PROCESS_CUMPLIMIENTO.toString(), activityId: opt.ACT_NONE.toString(), instanceId: 123, taskId: 456, taskStatus: "InProgress" },
            }}
          >
            <i className="mdi mdi-file-search-outline mdi-24px"></i>
          </Link>
        ),
      },
      {

        date: "25/09/2021 09:12 AM",
        taskId: "00123", // BPM Id de la tarea
        instanceId: "321001",// BPM Id del Proceso
        processNumber: "00123",
        procedureNumber: "321001",
        applicationNumber: "123",
        transactId: 6,
        activityId: 1,
        processId: 1,//value[i]["task-id"],
        activity: "Lista Exclusion",
        status: "ok",
        action: (
          <Link
            to={{
              pathname: "/creditocomercial/listaexclusion",
              data: { requestId: "", facilityId: "", customerId: "", transactionId: "", processId: opt.PROCESS_BUSQUEDADESCARTE.toString(), activityId: opt.ACT_NONE.toString(), instanceId: 123, taskId: 456, taskStatus: "Ready" },
            }}
          >
            <i className="mdi mdi-file-search-outline mdi-24px"></i>
          </Link>
        ),
      },
      {
        date: "25/09/2021 09:12 AM",
        taskId: "00123", // BPM Id de la tarea
        instanceId: "321001",// BPM Id del Proceso
        processNumber: "00123",
        procedureNumber: "321001",
        applicationNumber: "123",
        transactId: 6,
        activityId: 1,
        processId: 1,//value[i]["task-id"],
        activity: "Informe Gestion",
        status: "ok",
        action: (
          <Link
            to={{
              pathname: "/creditocomercial/informegestion",
              data: { requestId: "", facilityId: "", customerId: "", transactionId: "197", processId: opt.PROCESS_BUSQUEDADESCARTE.toString(), activityId: opt.ACT_NONE.toString(), instanceId: 123, taskId: 456, taskStatus: "InProgress" },
            }}
          >
            <i className="mdi mdi-file-search-outline mdi-24px"></i>
          </Link>
        ),

      },
      {
        date: "25/09/2021 09:12 AM",
        taskId: "00123", // BPM Id de la tarea
        instanceId: "321001",// BPM Id del Proceso
        processNumber: "00123",
        procedureNumber: "321001",
        applicationNumber: "123",
        transactId: 6,
        activityId: 1,
        processId: 1,//value[i]["task-id"],
        activity: "Propuesta de Credito",
        status: "ok",
        action: (
          <Link
            to={{
              pathname: "/creditocomercial/propuestacredito",
              data: { requestId: "XYZ432022", facilityId: "", customerId: "68", transactionId: "101", processId: opt.PROCESS_PROPUESTACREDITO.toString(), activityId: opt.ACT_NONE.toString(), instanceId: 123, taskId: 456, taskStatus: "InProgress" },
            }}
          >
            <i className="mdi mdi-file-search-outline mdi-24px"></i>
          </Link>
        ),
      },
      {
        date: "25/09/2021 09:12 AM",
        taskId: "00123", // BPM Id de la tarea
        instanceId: "321001",// BPM Id del Proceso
        processNumber: "00123",
        procedureNumber: "321001",
        applicationNumber: "123",
        transactId: 6,
        activityId: 1,
        processId: 1,//value[i]["task-id"],
        activity: "Analisis de Credito",
        status: "ok",
        action: (
          <Link
            to={{
              pathname: "/creditocomercial/analisiscredito",
              data: { customerId: "", transactionId: "190", processId: opt.PROCESS_BUSQUEDADESCARTE.toString(), activityId: opt.ACT_NONE.toString(), instanceId: 123, taskId: 456, taskStatus: "Ready" },
            }}
          >
            <i className="mdi mdi-file-search-outline mdi-24px"></i>
          </Link>
        ),
      },
      {
        date: "25/09/2021 09:12 AM",
        taskId: "00123", // BPM Id de la tarea
        instanceId: "321001",// BPM Id del Proceso
        processNumber: "00123",
        procedureNumber: "321001",
        applicationNumber: "123",
        transactId: 6,
        activityId: 1,
        processId: 1,//value[i]["task-id"],
        activity: "Riesgo Ambiental",
        status: "ok",
        action: (
          <Link
            to={{
              pathname: "/creditocomercial/riesgoambiental",
              data: { customerId: "", transactionId: "", processId: opt.PROCESS_BUSQUEDADESCARTE.toString(), activityId: opt.ACT_NONE.toString(), instanceId: 123, taskId: 456, taskStatus: "Ready" },
            }}
          >
            <i className="mdi mdi-file-search-outline mdi-24px"></i>
          </Link>
        ),
      },
      {
        date: "25/09/2021 09:12 AM",
        taskId: "00123", // BPM Id de la tarea
        instanceId: "321001",// BPM Id del Proceso
        processNumber: "00123",
        procedureNumber: "321001",
        applicationNumber: "123",
        transactId: 6,
        activityId: 1,
        processId: 1,//value[i]["task-id"],
        activity: "Riesgo Credito",
        status: "ok",
        action: (
          <Link
            to={{
              pathname: "/creditocomercial/riesgocredito",
              data: { customerId: "", transactionId: "", processId: opt.PROCESS_BUSQUEDADESCARTE.toString(), activityId: opt.ACT_NONE.toString(), instanceId: 123, taskId: 456, taskStatus: "Ready" },
            }}
          >
            <i className="mdi mdi-file-search-outline mdi-24px"></i>
          </Link>
        ),
      },
      {
        date: "25/09/2021 09:12 AM",
        taskId: "00123", // BPM Id de la tarea
        instanceId: "321001",// BPM Id del Proceso
        processNumber: "00123",
        procedureNumber: "321001",
        applicationNumber: "123",
        transactId: 6,
        activityId: 1,
        processId: 1,//value[i]["task-id"],
        activity: "Supervisor de Analisis Credito",
        status: "ok",
        action: (
          <Link
            to={{
              pathname: "/creditocomercial/supervisoranalisiscredito",
              data: { customerId: "", transactionId: "", processId: opt.PROCESS_BUSQUEDADESCARTE.toString(), activityId: opt.ACT_NONE.toString(), instanceId: 123, taskId: 456, taskStatus: "Ready" },
            }}
          >
            <i className="mdi mdi-file-search-outline mdi-24px"></i>
          </Link>
        ),
      },
      {
        date: "25/09/2021 09:12 AM",
        taskId: "00123", // BPM Id de la tarea
        instanceId: "321001",// BPM Id del Proceso
        processNumber: "00123",
        procedureNumber: "321001",
        applicationNumber: "123",
        transactId: 6,
        activityId: 1,
        processId: 1,//value[i]["task-id"],
        activity: "Autonomia Credito",
        status: "ok",
        action: (
          <Link
            to={{
              pathname: "/creditocomercial/autonomiacredito",
              data: { customerId: "", transactionId: "", processId: opt.PROCESS_BUSQUEDADESCARTE.toString(), activityId: opt.ACT_NONE.toString(), instanceId: 123, taskId: 456, taskStatus: "Ready" },
            }}
          >
            <i className="mdi mdi-file-search-outline mdi-24px"></i>
          </Link>
        ),
      },
      {
        date: "25/09/2021 09:12 AM",
        taskId: "00123", // BPM Id de la tarea
        instanceId: "321001",// BPM Id del Proceso
        processNumber: "00123",
        procedureNumber: "321001",
        applicationNumber: "123",
        transactId: 6,
        activityId: 1,
        processId: 1,//value[i]["task-id"],
        activity: "Aceptacion Cliente",
        status: "ok",
        action: (
          <Link
            to={{
              pathname: "/creditocomercial/aceptacioncliente",
              data: { customerId: "", transactionId: "", processId: opt.PROCESS_BUSQUEDADESCARTE.toString(), activityId: opt.ACT_NONE.toString(), instanceId: 123, taskId: 456, taskStatus: "Ready" },
            }}
          >
            <i className="mdi mdi-file-search-outline mdi-24px"></i>
          </Link>
        ),
      },
      {
        date: "25/09/2021 09:12 AM",
        taskId: "00123", // BPM Id de la tarea
        instanceId: "321001",// BPM Id del Proceso
        processNumber: "00123",
        procedureNumber: "321001",
        applicationNumber: "123",
        transactId: 6,
        activityId: 1,
        processId: 1,//value[i]["task-id"],
        activity: "Fideicomiso Asignar Numero",
        status: "ok",
        action: (
          <Link
            to={{
              pathname: "/creditocomercial/fideicomiso/asignarnumero",
              data: { customerId: "", transactionId: "", processId: opt.PROCESS_BUSQUEDADESCARTE.toString(), activityId: opt.ACT_NONE.toString(), instanceId: 123, taskId: 456, taskStatus: "Ready" },
            }}
          >
            <i className="mdi mdi-file-search-outline mdi-24px"></i>
          </Link>
        ),
      },
      {
        date: "25/09/2021 09:12 AM",
        taskId: "00123", // BPM Id de la tarea
        instanceId: "321001",// BPM Id del Proceso
        processNumber: "00123",
        procedureNumber: "321001",
        applicationNumber: "123",
        transactId: 6,
        activityId: 1,
        processId: 1,//value[i]["task-id"],
        activity: "Fideicomiso Relacion Fiduciaria",
        status: "ok",
        action: (
          <Link
            to={{
              pathname: "/creditocomercial/fideicomiso/relacionfiduciaria",
              data: { customerId: "", transactionId: "", processId: opt.PROCESS_BUSQUEDADESCARTE.toString(), activityId: opt.ACT_NONE.toString(), instanceId: 123, taskId: 456, taskStatus: "Ready" },
            }}
          >
            <i className="mdi mdi-file-search-outline mdi-24px"></i>
          </Link>
        ),
      },
      {
        date: "25/09/2021 09:12 AM",
        taskId: "00123", // BPM Id de la tarea
        instanceId: "321001",// BPM Id del Proceso
        processNumber: "00123",
        procedureNumber: "321001",
        applicationNumber: "123",
        transactId: 6,
        activityId: 1,
        processId: 1,//value[i]["task-id"],
        activity: "Documentacion Legal",
        status: "ok",
        action: (
          <Link
            to={{
              pathname: "/creditocomercial/documentacionlegal",
              data: { customerId: "", transactionId: "", processId: opt.PROCESS_BUSQUEDADESCARTE.toString(), activityId: opt.ACT_NONE.toString(), instanceId: 123, taskId: 456, taskStatus: "Ready" },
            }}
          >
            <i className="mdi mdi-file-search-outline mdi-24px"></i>
          </Link>
        ),
      },
      {
        date: "25/09/2021 09:12 AM",
        taskId: "00123", // BPM Id de la tarea
        instanceId: "321001",// BPM Id del Proceso
        processNumber: "00123",
        procedureNumber: "321001",
        applicationNumber: "123",
        transactId: 6,
        activityId: 1,
        processId: 1,//value[i]["task-id"],
        activity: "Abogado",
        status: "ok",
        action: (
          <Link
            to={{
              pathname: "/creditocomercial/abogado",
              data: { customerId: "", transactionId: "", processId: opt.PROCESS_BUSQUEDADESCARTE.toString(), activityId: opt.ACT_NONE.toString(), instanceId: 123, taskId: 456, taskStatus: "Ready" },
            }}
          >
            <i className="mdi mdi-file-search-outline mdi-24px"></i>
          </Link>
        ),
      },
      {
        date: "25/09/2021 09:12 AM",
        taskId: "00123", // BPM Id de la tarea
        instanceId: "321001",// BPM Id del Proceso
        processNumber: "00123",
        procedureNumber: "321001",
        applicationNumber: "123",
        transactId: 6,
        activityId: 1,
        processId: 1,//value[i]["task-id"],
        activity: "Firma Contrato",
        status: "ok",
        action: (
          <Link
            to={{
              pathname: "/creditocomercial/firmarcontrato",
              data: { customerId: "", transactionId: "", processId: opt.PROCESS_BUSQUEDADESCARTE.toString(), activityId: opt.ACT_NONE.toString(), instanceId: 123, taskId: 456, taskStatus: "Ready" },
            }}
          >
            <i className="mdi mdi-file-search-outline mdi-24px"></i>
          </Link>
        ),
      },
      {
        date: "25/09/2021 09:12 AM",
        taskId: "00123", // BPM Id de la tarea
        instanceId: "321001",// BPM Id del Proceso
        processNumber: "00123",
        procedureNumber: "321001",
        applicationNumber: "123",
        transactId: 6,
        activityId: 1,
        processId: 1,//value[i]["task-id"],
        activity: "Instructivo de Desembolso",
        status: "ok",
        action: (
          <Link
            to={{
              pathname: "/creditocomercial/instructivodesembolso",
              data: { customerId: "", transactionId: "", processId: opt.PROCESS_BUSQUEDADESCARTE.toString(), activityId: opt.ACT_NONE.toString(), instanceId: 123, taskId: 456, taskStatus: "Ready" },
            }}
          >
            <i className="mdi mdi-file-search-outline mdi-24px"></i>
          </Link>
        ),
      },
      {
        date: "25/09/2021 09:12 AM",
        taskId: "00123", // BPM Id de la tarea
        instanceId: "321001",// BPM Id del Proceso
        processNumber: "00123",
        procedureNumber: "321001",
        applicationNumber: "123",
        transactId: 6,
        activityId: 1,
        processId: 1,//value[i]["task-id"],
        activity: "Administracion",
        status: "ok",
        action: (
          <Link
            to={{
              pathname: "/creditocomercial/administracion",
              data: { customerId: "", transactionId: "", processId: opt.PROCESS_BUSQUEDADESCARTE.toString(), activityId: opt.ACT_NONE.toString(), instanceId: 123, taskId: 456, taskStatus: "Ready" },
            }}
          >
            <i className="mdi mdi-file-search-outline mdi-24px"></i>
          </Link>
        ),
      },
      {
        date: "25/09/2021 09:12 AM",
        taskId: "00123", // BPM Id de la tarea
        instanceId: "321001",// BPM Id del Proceso
        processNumber: "00123",
        procedureNumber: "321001",
        applicationNumber: "123",
        transactId: 6,
        activityId: 1,
        processId: 1,//value[i]["task-id"],
        activity: "Desembolso",
        status: "ok",
        action: (
          <Link
            to={{
              pathname: "/creditocomercial/instructivodesembolso",
              data: { customerId: "", transactionId: "", processId: opt.PROCESS_BUSQUEDADESCARTE.toString(), activityId: opt.ACT_NONE.toString(), instanceId: 123, taskId: 456, taskStatus: "Ready" },
            }}
          >
            <i className="mdi mdi-file-search-outline mdi-24px"></i>
          </Link>
        ),
      },
      {
        date: "25/09/2021 09:12 AM",
        taskId: "00123", // BPM Id de la tarea
        instanceId: "321001",// BPM Id del Proceso
        processNumber: "00123",
        procedureNumber: "321001",
        applicationNumber: "123",
        transactId: 6,
        activityId: 1,
        processId: 1,//value[i]["task-id"],
        activity: "Centro Archivo",
        status: "ok",
        action: (
          <Link
            to={{
              pathname: "/creditocomercial/centroarchivo",
              data: { customerId: "", transactionId: "", processId: opt.PROCESS_BUSQUEDADESCARTE.toString(), activityId: opt.ACT_NONE.toString(), instanceId: 123, taskId: 456, taskStatus: "Ready" },
            }}
          >
            <i className="mdi mdi-file-search-outline mdi-24px"></i>
          </Link>
        ),
      },
      {
        date: "25/09/2021 09:12 AM",
        taskId: "00123", // BPM Id de la tarea
        instanceId: "321001",// BPM Id del Proceso
        processNumber: "00123",
        procedureNumber: "321001",
        applicationNumber: "123",
        transactId: 6,
        activityId: 1,
        processId: 1,//value[i]["task-id"],
        activity: "Colateral Garantias",
        status: "ok",
        action: (
          <Link
            to={{
              pathname: "/creditocomercial/garantias",
              data: { infobpm: "", requestId: "59", facilityId: "59", customerId: "59", transactionId: "59", processId: "59", activityId: "59", instanceId: "459", taskId: "459", taskStatus: "459" }
              // data: { customerId: "", transactionId: "", processId: opt.PROCESS_BUSQUEDADESCARTE.toString(), activityId: opt.ACT_NONE.toString(), instanceId: 123, taskId: 456, taskStatus: "Ready" },
            }}
          >
            <i className="mdi mdi-file-search-outline mdi-24px"></i>
          </Link>
        ),
      },
    ]
    //Header de la Tabla de Bandeja de Entrada
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
      { text: <strong>{t("Date")}</strong>, dataField: 'date', sort: true },
      { text: <strong>{t("ProcessNumber")}</strong>, dataField: 'taskId', sort: true },
      { text: <strong>{t("ProcedureNumber")}</strong>, dataField: 'procedureNumber', sort: true },
      { text: <strong>{t("ApplicationNumber")}</strong>, dataField: 'applicationNumber', sort: true },
      { text: <strong>{t("Activity")}</strong>, dataField: 'activity', sort: true },
      { text: <strong>{t("Status")}</strong>, dataField: 'status', sort: true },
      { text: "", dataField: 'action' },
    ];


    setDataOptions(options);
    setDataHeader(columns);
    setDataBody(body);
  }

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
        <Breadcrumbs title={t("Dashboard")} breadcrumbItem={t("Statistics")} />

        <Card>
          <CardBody>

            <CardTitle className="h4">{t("CommercialCredit")}</CardTitle>
            <p className="card-title-desc">
              {t("Statistics")}
            </p>

          


            <Row>
              <Col lg={6}>
              <ScatterChart />
              </Col>
              <Col lg={6}>
              <SalesAnalytics setdataRows={setdataRows} />
              </Col>
            </Row>


            {dataRows?.detailStatistic && <Card>
              <CardBody>
                <Col sm={12}>
                  <div>
                    <Row>
                      <div className="table-responsive styled-table-div" style={{ maxHeight: '300px' }}>
                        <Table className="table table-striped table-hover styled-table table" id="tableStatistic">
                          <thead>
                            <tr>
                              <th>{t("Procedure")}</th>
                              <th>{t("Process")}</th>
                              <th>{t("Activity")}</th>
                              <th>{t("Debtor")}</th>
                              <th>{t("Date")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dataRows?.dataRows}
                          </tbody>
                        </Table>
                      </div>
                    </Row>
                  </div>
                </Col>
              </CardBody>
            </Card>}
          </CardBody>
        </Card>
      </div>

    </React.Fragment>
  );
}

export default Dashboard
