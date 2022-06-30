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
import ModalInstructivo from "./ModalInstructivo";

const DashboardInstructivo = () => {
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

    const [openModal, setopenModal] = useState(false);
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
                <Breadcrumbs title={t("Dashboard")} breadcrumbItem={t("Inbox Tutorial")} />

                <Card>
                    <CardBody>
                        <AvForm autoComplete="off" className="needs-validation" onSubmit={searchHistorical} ref={ref => (setFormRef(ref))}>

                            <CardTitle className="h4 d-flex flex-row justify-content-between align-items-center">
                                <div>
                                    {t("CommercialCredit")}
                                    <p className="card-title-desc">
                                        {t("Inbox Tutorial")}
                                    </p>
                                </div>
                            </CardTitle>
                            <LoadingOverlay active={isActiveLoading} spinner text={t("Processinginformation")}>
                                <Row>
                                    <Col md="6">
                                    </Col>
                                    <Col md="6" style={{ textAlign: "right" }}>
                                        <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                                            setopenModal(true)
                                        }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="12">
                                        <Table className="table table-striped table-hover styled-table table" >
                                            <thead>
                                                <tr>
                                                    <th><strong>{t("Date")}</strong></th>
                                                    <th><strong>{t("Tramit number")}</strong></th>
                                                    <th><strong>{t("Process")}</strong></th>
                                                    <th><strong>{t("FacilityType")}</strong></th>
                                                    <th><strong>{t("Client")}</strong></th>
                                                    <th><strong>{t("Status")}</strong></th>
                                                </tr>
                                            </thead>
                                            <tr style={{ textAlign: "center" }}><td colSpan="6"><h2>Sin Datos</h2></td></tr>
                                            <tbody>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </LoadingOverlay>
                        </AvForm>
                    </CardBody>
                </Card>

            </div>
            <ModalInstructivo isOpen={openModal} toggle={() => { setopenModal(false) }} />
        </React.Fragment>
    );
}

export default DashboardInstructivo
