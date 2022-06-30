import React, { useEffect, useState } from "react"
import { Link, useHistory, useLocation } from "react-router-dom"
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import { useTranslation } from 'react-i18next'
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { Tabs, Tab } from 'react-bootstrap';
import PantallaBusqueda from "../../CommercialCredit/14_AdminDesembolso/Colateral/CreacionLinea/Formulario"
import {
    CardTitle, Button,
    Card, CardBody, Label, Col, Table, CardHeader
} from "reactstrap"
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import LoadingOverlay from "react-loading-overlay";
import InstructivoNuevo from "../23_bandejaInstructivo/Desembolso/Instructivo/index";
//import ActiveDirectoryService from "../../services/ActiveDirectory";
import moment from "moment";
import Select from "react-select";
import { Row } from "react-bootstrap";
import { BackendServices } from "../../../services";
import HorizontalSteeper from "../../../components/Common/HorizontalSteeper";

const EjecutarInstructivoDesembolso = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();
    const [dataLocation, setdataLocation] = useState(null);
    const [dataUsuario, setdataUsuario] = useState(null);
    const backendServices = new BackendServices();
    useEffect(() => {
        if (location.data !== null && location.data !== undefined) {
            if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
                location.data.transactionId = 0;
            }
            else {
                sessionStorage.setItem('locationData', JSON.stringify(location.data));
                setdataLocation(location.data);
                loadData(location.data)
            }
        }
        else {
            //chequeamos si tenemos guardado en session
            var result = sessionStorage.getItem('locationData');
            if (result !== undefined && result !== null) {
                result = JSON.parse(result);
                setdataLocation(result);
                loadData(result)
            }
        }
    }, []);
    function loadData(data) {
        backendServices.consultPrincipalDebtor(data.transactionId)
            .then((data) => {
                if (data !== undefined) {
                    setdataUsuario(data);
                }
            });
    }
    return (
        <React.Fragment>
            <div className="page-content">
                <Breadcrumbs title={t("Credito comercial")} breadcrumbItem={t("Ejecutar Instructivo")} />

                <HorizontalSteeper processNumber={3} activeStep={2}></HorizontalSteeper>


                <Card>
                    <CardHeader>
                        <Row>
                            <Col md={6}>
                                <h4 className="card-title">{t("Ejecutar Instructivo")}</h4>
                            </Col>
                            <Col md={6}>
                                <Row>
                                    <Col sm={12} style={{ textAlign: "right" }}>
                                        <h5 className="card-title title-header">{dataUsuario != null ? (dataUsuario.typePerson === "1" ? (dataUsuario.name + " " + dataUsuario.name2 + " " + dataUsuario.lastName + " " + dataUsuario.lastName2) : (dataUsuario.name)) : ""} </h5>
                                    </Col>
                                    <Col sm={12} style={{ textAlign: "right" }}>
                                        <h5 className="card-title" style={{ textAlign: "right" }}>{t("Tramit")}:{" "}#{dataLocation?.transactionId ?? 0}</h5>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Tabs defaultActiveKey="0" id="uncontrolled-tab-example" className="mb-3">
                            <Tab className="m-4" key={0} eventKey={0} title="Línea de créditos">
                                <PantallaBusqueda administracion={true} />
                            </Tab>
                            <Tab className="m-4" key={1} eventKey={1} title="Instructivo de desembolso">
                                <InstructivoNuevo adminDesembolso={true} ejecutarDesembolso={false} ejecutivoDesembolso={true} />
                            </Tab>
                        </Tabs>
                    </CardBody>
                </Card>
            </div>

        </React.Fragment >
    );
}

export default EjecutarInstructivoDesembolso
