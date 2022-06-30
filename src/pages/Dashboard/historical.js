import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { useTranslation } from 'react-i18next'
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"


import {
  CardTitle, Button,
  Card, CardBody, Label, Col, Progress
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
import * as OPTs from "../../helpers/options_helper"

import Switch from "react-switch";
import Currency from "../../helpers/currency";
import ReactApexChart from "react-apexcharts";

const Offsymbol = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2,
      }}
    >
      {" "}
      No
    </div>
  );
};

const OnSymbol = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2,
      }}
    >
      {" "}
      Si
    </div>
  );
};


const Historical = () => {
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
    { text: <strong>{t("Category")} RAS</strong>, dataField: 'ras', sort: true },
    { text: <strong>{t("Customer ID")}</strong>, dataField: 'nroClientT24', sort: true },
    // { text: <strong>{t("Proposed amount")}</strong>, dataField: 'val3', sort: true },
    { text: <strong>{t("Type Bank")}</strong>, dataField: 'bank', sort: true },
    // { text: <strong>{t("Economic Activity")}</strong>, dataField: 'val5', sort: true },
    { text: <strong>Covenants</strong>, dataField: 'covenantEnvironmental', sort: true },
    { text: <strong>{t("Compliance Date")} Covenants</strong>, dataField: 'complianceDate', sort: true },
    { text: <strong>{t("CreditAutonomy")}</strong>, dataField: 'autonomyCredit', sort: true },
    { text: <strong>{t("BankAutonomy")}</strong>, dataField: 'autonomyBank', sort: true },
    { text: <strong>{t("Approval of Autonomy Credit")}</strong>, dataField: 'decAutonomyCredit', sort: true },
    { text: <strong>{t("Approval of Banking Autonomy")}</strong>, dataField: 'decAutonomyBank', sort: true },
    { text: <strong>{t("Sustainability Marking")}</strong>, dataField: 'sustainable', sort: true },
    { text: <strong>{t("Sustainable Project")}</strong>, dataField: 'sustainableProjects', sort: true },
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
  const [idTypeValidate, setIdTypeValidate] = useState(false);
  const [formRef, setFormRef] = useState(false);
  const [transactId, setTransactId] = useState(undefined);
  const [instanceId, setInstanceId] = useState(undefined);

  const [fechas, setfechas] = useState("");

  const [applyCovenant, setApplyCovenant] = useState([{ value: null, label: t('All') }, { value: true, label: t('With Covenant') }, { value: false, label: t('Without Covenant') }]);
  const [applyCovenantSelect, setApplyCovenantSelect] = useState(undefined);

  const [closing, setclosing] = useState([{ value: null, label: t('All') }, { value: true, label: t('With Closing') }, { value: false, label: t('Without Closing') }]);
  const [closingSelect, setclosingSelect] = useState(undefined);

  const [closingPreview, setClosingPreview] = useState(false);
  const [generalSelected, setGeneralSelected] = useState(true);
  const [environmentsRiskSelected, setEnvironmentsRiskSelected] = useState(false);
  const [filterTypeSelected, setFilterTypeSelected] = useState('general');
  const [onlyEnvironmentRisk, setOnlyEnvironmentRisk] = useState(false);
  const [approvalAutonomy, setApprovalAutonomy] = useState(false);
  const [clientDocIdG, setClientDocIdG] = useState('');
  const [clientDocIdER, setClientDocIdER] = useState('');

  const currencyData = new Currency();

  const [series, setSeries] = useState([70])

  const [options, setOptions] = useState({
    plotOptions: {
      radialBar: {
        offsetY: -12,
        hollow: {
          margin: 5, size: '60%', background: 'rgba(59, 93, 231, .25)',
        }
        ,
        dataLabels: {
          name: {
            show: false,
          }
          ,
          value: {
            show: true, fontSize: '12px', offsetY: 5,
          }
          ,
          style: {
            colors: ['#fff']
          }
        }
      }
      ,
    }
    ,
    colors: ['#3b5de7'],
  })

  useEffect(() => {
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
    let startDate, endDate;

    if (fechas) {
      [startDate, endDate] = fechas;
      startDate = moment(startDate, "DD/MM/YYYY").format("YYYY-MM-DD");
      endDate = moment(endDate, "DD/MM/YYYY").format("YYYY-MM-DD");
    }

    let dataHistorical = {
      transactId: values.transactIdG ?? "",
      clientDocId: values.clientDocIdG ?? "",
      idType: values.idTypeG ?? (IdentificationTypeSelected?.value ?? ''),
      check: onlyEnvironmentRisk,
      applyCovenant: applyCovenantSelect?.value ?? null,
      applyClosing: closingSelect?.value ?? null,
      descAutonomy: approvalAutonomy,
      startDate,
      endDate
    }
    console.log(fechas)

    backendServices.getHistoricalSearches(dataHistorical).then(response => {

      if (response.status == 200) {
        setDataBody(
          response.result.summaryProcess.map(($$, index) => {
            $$.creationDate = formatDate($$.creationDate);
            $$.activityDate = formatDate($$.activityDate);
            $$.names = `${$$.name} ${$$.secondName}`;
            $$.surnames = `${$$.lastName} ${$$.secondLastName}`;
            $$.closingCompliance = false;

            $$.covenantEnvironmental = $$.covenantEnvironmental ? 'Si' : 'No';
            $$.decAutonomyCredit = $$.decAutonomyCredit ? 'Si' : 'No';
            $$.decAutonomyBank = $$.decAutonomyBank ? 'Si' : 'No';

            $$.sustainable = $$.sustainable ? 'Si' : 'No';
            $$.action = (
              <>
                <Link key={index} onClick={(e) => { showModal($$) }}>
                  <i className="mdi mdi-file-eye-outline mdi-24px"></i>
                </Link>
                <Link key={index} onClick={(e) => { setProcessInstanceId($$.instanceId); toggleModalWatchProcess(); }}>
                  <i className="mdi mdi-eye mdi-24px"></i>
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

  function showModal($$) {
    setClosingPreview($$.closingCompliance);
    setInstanceId($$.instanceId);
    setTransactId($$.transactId);
    toggleModalWatchPreview();
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
    setIsActiveLoading(false);
    setDataBody([]);
    setGeneralSelected(false)
    setEnvironmentsRiskSelected(false)
    setClientDocIdG('')
    setClientDocIdER('')
    setfechas('')
    setOnlyEnvironmentRisk(false);
    setclosingSelect('');
    setApplyCovenantSelect('');
    setIsActiveLoading(true)
    setTimeout(() => {
      setIsActiveLoading(false)
    }, 1);
    formRef.reset();
  }

  function handleSelect(e) {
    e = +e;
    switch (e) {
      case 0:
        setGeneralSelected(true)
        setEnvironmentsRiskSelected(false)
        setFilterTypeSelected('general')
        break;
      case 1:
        setEnvironmentsRiskSelected(true)
        setGeneralSelected(false)
        setFilterTypeSelected('environmentsRisk')
        break;

      default:
        setGeneralSelected(true)
        break;
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title={t("Dashboard")} breadcrumbItem={t("Historical")} />

        <Card>
          <CardBody>
            <AvForm autoComplete="off" className="needs-validation" onSubmit={searchHistorical} ref={ref => (setFormRef(ref))}>

              <CardTitle className="h4 d-flex flex-row justify-content-between align-items-center">
                <div>
                  {t("CommercialCredit")}
                  <p className="card-title-desc">
                    {t("Historicalofthecommercialcreditprocess")}
                  </p>
                </div>

                <div>
                  <Button color="warning" type="button" onClick={() => { clearForm(); }} style={{ margin: '5px' }}><i className="mdi mdi-notification-clear-all mdi-12px"></i>
                    {" "}{t("Clear")}
                  </Button>
                  <Button color="success" type="submit" style={{ margin: '5px' }}>
                    <i className="mdi mdi-content-save mid-12px"></i> {t("Search")}
                  </Button>
                </div>
              </CardTitle>

              <LoadingOverlay active={isActiveLoading} spinner text={t("Processinginformation")}>

                <ToolkitProvider
                  keyField="id"
                  data={dataBody}
                  columns={COLUMNS_HEADERS}
                  search
                >
                  {
                    props => (
                      <div className="m-4">
                        <div className="d-flex flex-column flex-md-row">

                          <Card className="col-12 col-sm-6 col-md-3">
                            <CardBody>
                              <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between">
                                <div className="avatar-sm me-3">
                                  <span className="avatar-title bg-white text-success rounded">
                                    <i className="mdi mdi-file-document" style={{ fontSize: '45px' }}></i>
                                  </span>
                                </div>

                                <div className="d-flex flex-column">
                                  <h3 className="d-flex justify-content-end">
                                    {currencyData.format(dataBody?.length || '-')}</h3>
                                  <div className="font-size-14">{t("Filtered procedures")}</div>

                                </div>
                              </div>

                            </CardBody>
                          </Card>

                        </div>

                        {/* <SearchBar className="custome-search-field float-end" delay={1000} placeholder={t("Search")} {...props.searchProps} /> */}
                        <Row>
                          <AvGroup check className="col-12 col-md-3 form-group d-flex align-items-center justify-content-between">
                            <Label>{t("Only Environmental Risk")}</Label>
                            <Switch name="preapproval"
                              uncheckedIcon={<Offsymbol />}
                              checkedIcon={<OnSymbol />}
                              onColor="#007943"
                              className="form-label"
                              onChange={(e) => {
                                if (e) {
                                  setClientDocIdG('')
                                } else {
                                  setClientDocIdER('')
                                  setApprovalAutonomy(false)
                                  setfechas('')
                                  setIsActiveLoading(true)
                                  setTimeout(() => {
                                    setIsActiveLoading(false)
                                  }, 1);
                                }
                                setOnlyEnvironmentRisk(!onlyEnvironmentRisk);
                                setclosingSelect('');
                                setApplyCovenantSelect('');
                              }}
                              checked={onlyEnvironmentRisk}
                            />
                            {'   '}
                            {/* <Label className="form-check-label" htmlFor="isProjectLocatedProtectedNaturalArea"> {t("Is the project located or adjacent to a protected natural area")}</Label> */}
                          </AvGroup>
                          <AvGroup check className="col-12 col-md-3 form-group d-flex align-items-center justify-content-between">
                            <Label>{t("Approval Autonomy")}</Label>
                            <Switch name="preapproval"
                              uncheckedIcon={<Offsymbol />}
                              checkedIcon={<OnSymbol />}
                              onColor="#007943"
                              className="form-label"
                              disabled={!onlyEnvironmentRisk}
                              onChange={(e) => {
                                setApprovalAutonomy(!approvalAutonomy);
                              }}
                              checked={approvalAutonomy}
                            />
                            {'   '}
                            {/* <Label className="form-check-label" htmlFor="isProjectLocatedProtectedNaturalArea"> {t("Is the project located or adjacent to a protected natural area")}</Label> */}
                          </AvGroup>

                        </Row>


                        <Col className="mb-4">
                          <Row className="d-flex flex-column flex-md-row align-items-center mb-4">
                            <AvGroup className="col-12 col-md-3">
                              <Label htmlFor="client">{t("Procedure")}</Label>
                              <AvField
                                className="form-control"
                                name="transactIdG"
                                id="transactIdG"
                                type="text"
                                value=""
                                validate={{
                                  required: { value: !onlyEnvironmentRisk && !idTypeValidate, errorMessage: t("Required Field") },
                                }}
                              />
                            </AvGroup>
                            <AvGroup className="col-12 col-md-3">
                              <Label htmlFor="client">{t("Date")}</Label>
                              {isActiveLoading == false ?
                                <Flatpickr
                                  name="date"
                                  id="date"
                                  disabled={!onlyEnvironmentRisk}
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
                              <Label htmlFor="client">{t("ID Type")} / {t("ClientType")}</Label>
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
                              <Label htmlFor="client">{t("ID Number")}</Label>
                              <AvField
                                className="form-control"
                                name="clientDocIdG"
                                id="clientDocIdG"
                                type="text"
                                disabled={onlyEnvironmentRisk}
                                value={clientDocIdG}
                                onKeyPress={(event) => {
                                  setClientDocIdG(event.target.value)
                                }}
                                validate={{
                                  required: { value: !onlyEnvironmentRisk && idTypeValidate, errorMessage: t("Required Field") },
                                }}
                              />
                            </AvGroup>
                          </Row>
                          <Row>
                            <AvGroup className="col-12 col-md-3">
                              <Label htmlFor="client">{t("Customer ID")}</Label>
                              <AvField
                                className="form-control"
                                name="clientDocIdER"
                                id="clientDocIdER"
                                type="text"
                                value={clientDocIdER}
                                onKeyPress={(event) => {
                                  setClientDocIdER(event.target.value)
                                }}
                                validate={{
                                  required: { value: onlyEnvironmentRisk && idTypeValidate, errorMessage: t("Required Field") },
                                }}
                              />
                            </AvGroup>
                            <AvGroup className="col-12 col-md-3">
                              <Label htmlFor="client">{t("Apply")} Covenants ({t("AmbientalRisk")})</Label>
                              <Select noOptionsMessage={() => ""}
                                onChange={(e) => {
                                  setApplyCovenantSelect(applyCovenant.find(x => x.value === e.value));

                                }}
                                options={applyCovenant}
                                classNamePrefix="select2-selection"
                                className="w-100"
                                isDisabled={!onlyEnvironmentRisk}
                                value={applyCovenantSelect}
                                name="idType"
                              />
                            </AvGroup>
                            <AvGroup className="col-12 col-md-3">
                              <Label htmlFor="client">{t("Apply")} {t("Closing")} ({t("AmbientalRisk")})</Label>
                              <Select noOptionsMessage={() => ""}
                                onChange={(e) => {
                                  setclosingSelect(closing.find(x => x.value === e.value));

                                }}
                                options={closing}
                                classNamePrefix="select2-selection"
                                className="w-100"
                                isDisabled={!onlyEnvironmentRisk}
                                value={closingSelect}
                                name="idType"
                              />
                            </AvGroup>
                          </Row>
                        </Col>


                        <div className="table-responsive">
                          <BootstrapTable
                            bootstrap4
                            keyField='creationDate'
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
              </LoadingOverlay>
            </AvForm>
          </CardBody>
        </Card>

      </div>
      {processInstanceId && (<ModalWatchProces isOpen={ShowDisplayModal} toggle={() => { toggleModalWatchProcess() }} processInstanceId={processInstanceId} t={tr} />)}
      <ModalPreviewHistorical title={onlyEnvironmentRisk ? 'Previsualización' : 'Historical Preview'} isOpen={ShowDisplayModalPreview} toggle={() => { toggleModalWatchPreview() }} transactId={transactId} instanceId={instanceId} closingPreview={closingPreview} />
    </React.Fragment>
  );
}

export default Historical
