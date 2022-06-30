import React, { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import { useTranslation } from 'react-i18next'
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import * as OPTs from "../../../helpers/options_helper"
import { Tabs, Tab } from 'react-bootstrap';
import {
    CardTitle, Button,
    Card, CardBody, Label, Col, Table
} from "reactstrap"
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import InstructivoNuevo from "../../CommercialCredit/23_bandejaInstructivo/Desembolso/Instructivo/index.js"
import PantallaBusqueda from "../../CommercialCredit/14_AdminDesembolso/Colateral/CreacionLinea/Formulario"
import ModalWatchProces from "../ModalWacthProcess";
import { translationHelpers } from '../../../helpers';
import LoadingOverlay from "react-loading-overlay";
import { BackendServices } from "../../../services";
//import ActiveDirectoryService from "../../services/ActiveDirectory";
import moment from "moment";
import Select from "react-select";
import { Row } from "react-bootstrap";
import ModalPreviewHistorical from "../modal/ModalPreviewHistorical";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

const InstructivoDesembolsoNew = () => {
    const { t } = useTranslation();
    const [tr] = translationHelpers('commercial_credit', 'translation');
    const history = useHistory();
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
        values.idType = IdentificationTypeSelected?.value ?? '';

        backendServices.getHistoricalSearches(values.transactId, values.idType, values.clientDocId).then(response => {
            console.log("getHistoricalSearches", response);

            if (response.status == 200) {
                setDataBody(
                    response.result.summaryProcess.map(($$, index) => {
                        $$.creationDate = formatDate($$.creationDate);
                        $$.activityDate = formatDate($$.activityDate);
                        $$.names = `${$$.name} ${$$.secondName}`;
                        $$.surnames = `${$$.lastName} ${$$.secondLastName}`;
                        $$.action = (
                            <>
                                <Link key={index} onClick={(e) => { setInstanceId($$.instanceId); setTransactId($$.transactId); toggleModalWatchPreview(); }}>
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
        formRef.reset();
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Breadcrumbs title={t("Dashboard")} breadcrumbItem={t("DisbursementInstructions")} />

                <Card>
                    <CardBody>

                        <CardTitle className="h4 d-flex flex-row justify-content-between align-items-center">
                            <div>
                                {t("CommercialCredit")}
                                <p className="card-title-desc">
                                    {t("DisbursementInstructions")}
                                </p>
                            </div>
                        </CardTitle>
                        <Row>
                            <Col md="6">
                            </Col>
                            <Col md="6" style={{ textAlign: "right" }}>
                                <Button className="btn" color="danger" type="button" style={{ margin: '5px' }} onClick={() => {
                                    history.push({
                                        pathname: '/DashboardInstructivo',
                                        data: {},
                                    });
                                }} title={t("Return")}><i className="mdi mdi-cancel mid-12px"></i> {(" Retornar a la bandeja")}</Button>
                            </Col>
                        </Row>
                        <LoadingOverlay active={isActiveLoading} spinner text={t("Processinginformation")}>

                            {/* <SearchBar className="custome-search-field float-end" delay={1000} placeholder={t("Search")} {...props.searchProps} /> */}
                            <Tabs defaultActiveKey="0" id="uncontrolled-tab-example" className="mb-3">
                                <Tab className="m-4" key={0} eventKey={0} title="Línea de créditos">
                                    <PantallaBusqueda />
                                </Tab>
                                <Tab className="m-4" key={1} eventKey={1} title="Instructivo de desembolso">
                                    <InstructivoNuevo adminDesembolso={false} ejecutarDesembolso={false}/>
                                </Tab>
                            </Tabs>
                        </LoadingOverlay>
                    </CardBody>
                </Card>

            </div>
            {processInstanceId && (<ModalWatchProces isOpen={ShowDisplayModal} toggle={() => { toggleModalWatchProcess() }} processInstanceId={processInstanceId} t={tr} />)}
            <ModalPreviewHistorical isOpen={ShowDisplayModalPreview} toggle={() => { toggleModalWatchPreview() }} transactId={transactId} instanceId={instanceId} />
        </React.Fragment >
    );
}

export default InstructivoDesembolsoNew
