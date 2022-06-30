import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { useTranslation } from 'react-i18next'
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import * as OPTs from "../../helpers/options_helper"

import {
  CardTitle, Button,
  Card, CardBody, Label, Col
} from "reactstrap"
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';

import ModalWatchProces from "./ModalWacthProcess";
import { translationHelpers } from '../../helpers';
import LoadingOverlay from "react-loading-overlay";
import { BackendServices } from "../../services";
//import ActiveDirectoryService from "../../services/ActiveDirectory";
import moment from "moment";
import Select from "react-select";
import { Row, Tab, Tabs } from "react-bootstrap";
import ModalPreviewHistorical from "./modal/ModalPreviewHistorical";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import ScatterChartEnvironments from "./modal/scatter-analytics-environments";
import SalesAnalyticsEnvironments from "./modal/sales-analytics-environments";
const { SearchBar } = Search;
const RiesgoAmbientalHistorico = () => {
  const { t } = useTranslation();
  const [tr] = translationHelpers('commercial_credit', 'translation');

  let COLUMNS_HEADERS = [
    { text: <strong>{t("Procedure")}</strong>, dataField: 'transactId', sort: true },
    { text: <strong>{t("Creation Date")}</strong>, dataField: 'creationDate', sort: true },
    { text: <strong>{t("Process")}</strong>, dataField: 'bpmProcessDescription', sort: true },
    { text: <strong>{t("Activity")}</strong>, dataField: 'bpmActivityDescription', sort: true },
    { text: <strong>{t("Fecha de Actividad")}</strong>, dataField: 'activityDate', sort: true },
    { text: <strong>{t("IdType")}</strong>, dataField: 'idType', sort: true },
    { text: <strong>{t("IdNumber")}</strong>, dataField: 'clientDocId', sort: true },
    { text: <strong>{t("Responsible")}</strong>, dataField: 'responsible', sort: true },
    { text: <strong>{t("Names")}</strong>, dataField: 'names', sort: true },
    { text: <strong>{t("Surnames")}</strong>, dataField: 'surnames', sort: true },
    { text: <strong>{t("Status")}</strong>, dataField: 'stateDescription', sort: true },
    { text: <strong>{t("Covenant")}</strong>, dataField: 'covenantDescription', sort: true },
    { text: <strong>{t("Closing")}</strong>, dataField: 'closingDescription', sort: true },
    { text: "", dataField: 'action' },
  ];


  const [dataBody, setDataBody] = useState([]);
  const [ShowDisplayModal, setShowDisplayModal] = useState(false);
  const [ShowDisplayModalPreview, setShowDisplayModalPreview] = useState(false);
  const [processInstanceId, setProcessInstanceId] = useState(null);
  const [isActiveLoading, setIsActiveLoading] = useState(false);

  const backendServices = new BackendServices();

  const [IdentificationTypeList, setIdentificationTypeList] = useState([]);
  const [IdentificationTypeSelected, setIdentificationTypeSelected] = useState("");
  const [formRef, setFormRef] = useState(false);
  const [idTypeValidate, setIdTypeValidate] = useState(false);
  const [fechaValidation, setfechaValidation] = useState(false);
  const [transactId, setTransactId] = useState(undefined);
  const [instanceId, setInstanceId] = useState(undefined);
  const [fechas, setfechas] = useState("");

  const [applyCovenant, setApplyCovenant] = useState([{ value: '', label: t('All') }, { value: 'si', label: t('With Covenant') }, { value: 'no', label: t('Without Covenant') }]);
  const [applyCovenantSelect, setApplyCovenantSelect] = useState(undefined);

  const [closing, setclosing] = useState([{ value: '', label: t('All') }, { value: 'si', label: t('With Closing') }, { value: 'no', label: t('Without Closing') }]);
  const [closingSelect, setclosingSelect] = useState(undefined);

  const [closingPreview, setClosingPreview] = useState(false);

  useEffect(() => {
    load()
    loadIdentificationTypes();
    return () => {
    };
  }, []);

  /**
   * *Busca las coincidencias para históricos
   * @param {object} event
   * @param {object} errors
   * @param {object} values
   * @return {void}
   */
  function searchHistorical(event, errors, values) {

    event.preventDefault();
    if (errors.length > 0) {
      return;
    }

    setIsActiveLoading(true);
    values.idType = IdentificationTypeSelected?.value ?? '';
    let rangos = {
      inicio: "",
      fin: "",
    }
    if (fechas != "") {
      if (fechas.length > 1) {
        rangos.inicio = moment(fechas[0], "DD/MM/YYYY").format("YYYY-MM-DD");
        rangos.fin = moment(fechas[1], "DD/MM/YYYY").format("YYYY-MM-DD");
      } else {
        rangos.inicio = moment(fechas[0], "DD/MM/YYYY").format("YYYY-MM-DD");
        rangos.fin = moment(fechas[0], "DD/MM/YYYY").format("YYYY-MM-DD");
      }
    }
    backendServices.getEnviromentHistory(values.transactId, values.idType, values.clientDocId, rangos.inicio, rangos.fin).then(response => {
      console.log("getHistoricalSearches", response);

      if (response.status == 200) {
        setfechas("")
        setDataBody(
          response.result.summaryProcess.map(($$, index) => {
            $$.creationDate = formatDate($$.creationDate);
            $$.activityDate = formatDate($$.activityDate);
            $$.names = `${$$.name} ${$$.secondName}`;
            $$.surnames = `${$$.lastName} ${$$.secondLastName}`;
            $$.closing = true;
            $$.closingDescription = $$.closure == 1 ? 'Si' : 'No'
            $$.covenantDescription = $$.covenantEnvironmental ? 'Si' : 'No'
            $$.action = (
              <>
                <Link key={index} onClick={(e) => { setClosingPreview($$.closingCompliance); setInstanceId($$.instanceId); setTransactId($$.transactId); toggleModalWatchPreview(); }}>
                  <i className="mdi mdi-file-eye-outline mdi-24px"></i>
                </Link>
                {/* <Link key={index} onClick={(e) => { setProcessInstanceId($$.instanceId); toggleModalWatchProcess(); }}>
                  <i className="mdi mdi-eye mdi-24px"></i>
                </Link> */}
              </>
            )
            return $$;
          }));
      } else {

      }

      setIsActiveLoading(false);
    }).catch(err => {
      setIsActiveLoading(false);
      console.log(err);
    })
  }
  function load() {
    setIsActiveLoading(true);
    backendServices.getEnviromentHistory(null, null, null, null).then(response => {
      console.log("getHistoricalSearches", response);

      setIsActiveLoading(false);
      if (response.status == 200) {
        setfechas("")
        setDataBody(
          response.result.summaryProcess.map(($$, index) => {
            $$.creationDate = formatDate($$.creationDate);
            $$.activityDate = formatDate($$.activityDate);
            $$.names = `${$$.name} ${$$.secondName}`;
            $$.surnames = `${$$.lastName} ${$$.secondLastName}`;
            $$.closingCompliance = false;
            $$.closingDescription = $$.closure == 1 ? 'Si' : 'No'
            $$.covenantDescription = $$.covenantEnvironmental ? 'Si' : 'No'
            $$.action = (
              <>
                <Link key={index} onClick={(e) => { setClosingPreview($$.closingCompliance); setInstanceId($$.instanceId); setTransactId($$.transactId); toggleModalWatchPreview(); }}>
                  <i className="mdi mdi-file-eye-outline mdi-24px"></i>
                </Link>
              </>
            )
            return $$;
          }));
      } else {

      }

      setIsActiveLoading(false);
    }).catch(err => {
      setIsActiveLoading(false);
      console.log(err);
    })
  }
  /**
   * *Obtiene catálogo de tipo de identificación
   * @param {}
   * @return {void}
   */
  function loadIdentificationTypes() {
    backendServices.consultarCatalogoTipoIdentificacion().then((data) => {
      if (data !== null && data !== undefined) {
        let json = [{ label: t("None"), value: "" }];
        for (let i = 0; i < data.length; i++) {
          json.push({ label: t(data[i]["description"]), value: data[i]["id"] })
        }
        setIdentificationTypeList(json)
      }
    }).catch((error) => {
      console.log(error)
    });
  }


  function formatDate(date) {
    return moment(date).format("DD/MM/YYYY HH:mm:ss");
  }

  function toggleModalWatchProcess() {
    setShowDisplayModal(!ShowDisplayModal)
  }

  function toggleModalWatchPreview() {
    setShowDisplayModalPreview(!ShowDisplayModalPreview)
  }

  function clearForm() {
    setIdentificationTypeSelected("");
    setIdTypeValidate(false);
    setDataBody([]);
    setApplyCovenantSelect("");
    setclosingSelect("");
    setfechas("")
    // setIsActiveLoading(false);
    formRef.reset();
    load()
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title={t("Dashboard")} breadcrumbItem={t("Historical Environmental Risk")} />

        <Card>
          <CardBody>
            <AvForm autoComplete="off" className="needs-validation" onSubmit={searchHistorical} ref={ref => (setFormRef(ref))}>

              <CardTitle className="h4 d-flex flex-row justify-content-between align-items-center">
                <div>
                  {t("CommercialCredit")}
                  <p className="card-title-desc">
                    {t("Historical Environmental Risk")}
                  </p>
                </div>

                <div>
                  <Button color="warning" type="button" onClick={() => {
                    setIsActiveLoading(true);
                    setTimeout(() => {
                      clearForm();
                    }, 1);
                  }} style={{ margin: '5px' }}><i className="mdi mdi-notification-clear-all mdi-12px"></i>
                    {" "}{t("Clear")}
                  </Button>
                  <Button color="success" type="submit" style={{ margin: '5px' }}>
                    <i className="mdi mdi-content-save mid-12px"></i> {t("Search")}
                  </Button>
                </div>
              </CardTitle>

              <LoadingOverlay active={isActiveLoading} spinner text={t("Processinginformation")}>

                <Col className="mb-4">
                  <Row className="d-flex flex-column flex-md-row align-items-center mb-4">
                    <AvGroup className="col-12 col-md-3">
                      <Label htmlFor="client">{t("Procedure")}</Label>
                      <AvField
                        className="form-control"
                        name="transactId"
                        id="transactId"
                        type="text"
                        value=""
                      />
                    </AvGroup>
                    <AvGroup className="col-12 col-md-3">
                      <Label htmlFor="client">{t("Date")}</Label>
                      {isActiveLoading === false ?
                        <Flatpickr
                          name="date"
                          id="date"

                          className="form-control d-block"
                          placeholder={OPTs.FORMAT_DATE_SHOW}
                          options={{
                            // enableTime: true,
                            dateFormat: "d/m/Y",
                            // dateFormat: "d/m/Y H:i",
                            mode: "range",
                            defaultDate: fechas,//selectClient !== undefined ? moment(selectClient.birthDate) : null
                          }}
                          onChange={(selectedDates, dateStr, instance) => {
                            // setfechaSet2(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD"));

                            setfechas(dateStr.split('to'))
                          }}
                        /> : null}
                    </AvGroup>
                    <AvGroup className="col-12 col-md-3">
                      <Label htmlFor="client">{t("ClientType")}</Label>
                      <Select noOptionsMessage={() => ""}
                        onChange={(e) => {
                          setIdentificationTypeSelected(IdentificationTypeList.find(x => x.value === e.value));
                          if (e.value === '') {
                            setIdTypeValidate(false);
                          } else {
                            setIdTypeValidate(true);
                          }
                        }}
                        options={IdentificationTypeList}
                        classNamePrefix="select2-selection"
                        className="w-100"
                        value={IdentificationTypeSelected}
                        name="idType"
                      />
                    </AvGroup>
                    <AvGroup className="col-12 col-md-3">
                      <Label htmlFor="client">{t("Customer ID")}</Label>
                      <AvField
                        className="form-control"
                        name="clientDocId"
                        id="clientDocId"
                        type="text"
                        value=""
                        validate={{
                          required: { value: idTypeValidate, errorMessage: t("Required Field") },
                        }}
                      />
                    </AvGroup>
                  </Row>
                  <Row>
                    <AvGroup className="col-12 col-md-3">
                      <Label htmlFor="client">{t("Apply")} Covenants</Label>
                      <Select noOptionsMessage={() => ""}
                        onChange={(e) => {
                          setApplyCovenantSelect(applyCovenant.find(x => x.value === e.value));
                          if (e.value === '') {
                            setIdTypeValidate(false);
                          } else {
                            setIdTypeValidate(true);
                          }
                        }}
                        options={applyCovenant}
                        classNamePrefix="select2-selection"
                        className="w-100"
                        value={applyCovenantSelect}
                        name="idType"
                      />
                    </AvGroup>
                    <AvGroup className="col-12 col-md-3">
                      <Label htmlFor="client">{t("Apply")} {t("Closing")}</Label>
                      <Select noOptionsMessage={() => ""}
                        onChange={(e) => {
                          setclosingSelect(closing.find(x => x.value === e.value));
                          if (e.value === '') {
                            setIdTypeValidate(false);
                          } else {
                            setIdTypeValidate(true);
                          }
                        }}
                        options={closing}
                        classNamePrefix="select2-selection"
                        className="w-100"
                        value={closingSelect}
                        name="idType"
                      />
                    </AvGroup>
                  </Row>
                </Col>

                <Tabs defaultActiveKey="0" id="uncontrolled-tab-example" className="mb-4" onSelect={(e) => { /*code here...*/ }}>

                  <Tab className="m-0" key={0} eventKey={0} title={t("ReportAS")}>
                    <ToolkitProvider
                      keyField="creationDate"
                      data={dataBody}
                      columns={COLUMNS_HEADERS}
                      search
                    >
                      {
                        props => (
                          <div className="m-3">

                            <SearchBar className="custome-search-field float-end" delay={1000} placeholder={t("Buscar en la tabla")} {...props.searchProps} />


                            <div className="table-responsive">
                              <BootstrapTable
                                bootstrap4
                                bordered={false}
                                striped
                                hover
                                condensed
                                classes='styled-table'
                                style={{ cursor: "pointer" }}
                                data={dataBody} columns={COLUMNS_HEADERS}
                                {...props.baseProps}
                                pagination={paginationFactory({
                                  sizePerPage: 30,
                                  sizePerPageList: [30]
                                })}
                              />
                            </div>
                            {dataBody?.length === 0 &&
                              <div className="d-flex justify-content-center m-3">
                                <b><h4>{t("NoData")}</h4></b>
                              </div>
                            }
                          </div>
                        )
                      }
                    </ToolkitProvider>
                  </Tab>

                  <Tab className="m-0" key={1} eventKey={1} title={t("Statistics")}>
                    <ScatterChartEnvironments />
                    <SalesAnalyticsEnvironments />
                  </Tab>

                </Tabs>


              </LoadingOverlay>
            </AvForm>
          </CardBody>
        </Card>

      </div>
      {processInstanceId && (<ModalWatchProces isOpen={ShowDisplayModal} toggle={() => { toggleModalWatchProcess() }} processInstanceId={processInstanceId} t={tr} />)}
      <ModalPreviewHistorical title="Previsualización" isOpen={ShowDisplayModalPreview} toggle={() => { toggleModalWatchPreview() }} transactId={transactId} instanceId={instanceId} closingPreview={closingPreview} />
    </React.Fragment>
  );
}

export default RiesgoAmbientalHistorico
