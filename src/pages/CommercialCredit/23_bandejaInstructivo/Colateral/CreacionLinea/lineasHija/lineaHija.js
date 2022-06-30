import React, { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import Breadcrumbs from '../../../../../../components/Common/Breadcrumb';
import { useTranslation } from 'react-i18next'
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { Tabs, Tab } from 'react-bootstrap';
import {
    CardTitle, Button,
    Card, CardBody, Label, Col, Table
} from "reactstrap"
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';

import { translationHelpers } from '../../../../../../helpers';
import LoadingOverlay from "react-loading-overlay";
import { BackendServices } from "../../../../../../services";
//import ActiveDirectoryService from "../../services/ActiveDirectory";
import moment from "moment";
import Select from "react-select";
import { Row } from "react-bootstrap";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import ModalLineaHija from "./ModalLineaHija";
import Currency from "../../../../../../helpers/currency";

const LineaHija = (props) => {
    const { dataLinea, dataLineaFunction, dataList } = props;
    const [dataProduct1, setdataProduct1] = useState(dataLinea);
    const [dataSet, setdataSet] = useState(
        {
            linea: { Description: "", Code: "" },
            "monto": 0,
            "numberLine": "",
            estado: true
        }
    );
    const currencyData = new Currency();

    const [dataRows, setdataRows] = useState(null);
    const [indiceData, setindiceData] = useState(0);
    const [type, settype] = useState("new");
    const backendServices = new BackendServices();
    const { t } = useTranslation();
    const history = useHistory();
    const [openModal, setopenModal] = useState(false);
    useEffect(() => {
        loadData()
    }, [dataLinea]);
    function loadData() {
        setdataRows(dataProduct1.map((data, indice) => (
            <>
                <tr>
                    <td>{data.tipoLinea}</td>
                    <td>{data.descTipoLinea}</td>
                    <td>{currencyData.formatTable(data.monto)}</td>
                    <td>{data.numberLine}</td>
                    <td><Link to="#" title={t("View")} onClick={() => {
                        setopenModal(true); setdataSet(
                            {
                                linea: { Description: data.descTipoLinea, Code: data.tipoLinea },
                                monto: data.monto,
                                numberLine: data.numberLine
                            }
                        ); setindiceData(indice); settype("edit");
                    }}><i className="mdi mdi-circle-edit-outline mdi-24px"></i></Link>
                        <Link to="#" onClick={() => {
                            deleteProduct(indice);
                        }}><i className="mdi mdi-trash-can-outline  mdi-24px"></i></Link>
                    </td>
                </tr>
            </>
        )))
    }
    function deleteProduct(index) {
        dataProduct1.splice(index, 1)
        loadData()
        dataLineaFunction(dataProduct1)
    }
    function dataManagament(data) {
        let jsonSet = {
            "tipoLinea": data?.tipoLinea ?? "",
            "descTipoLinea": data?.descTipoLinea ?? "",
            "monto": Number(data?.monto ?? 0),
            "numberLine": data?.numberLine ?? "",
            "idLineasec": dataList?.idLineaSec ?? "",
            estado: true
        }
        if (type == "edit") {
            dataProduct1[indiceData] = jsonSet;
        } else {
            dataProduct1.push(jsonSet);
        }
        setopenModal(false)
        setdataProduct1(dataProduct1);
        dataLineaFunction(dataProduct1);
        loadData();
    }
    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <CardTitle className="h4 d-flex flex-row justify-content-between align-items-center">
                        <div>
                            {t("Líneas hijas")}
                        </div>
                    </CardTitle>
                    <Row>
                        <Col md="6">
                        </Col>
                        <Col md="6" style={{ textAlign: "right" }}>
                            <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                                setopenModal(true); setdataSet({
                                    linea: { Description: "", Code: "" },
                                    "monto": 0,
                                    "numberLine": "",
                                    estado: true
                                }); settype("new")
                            }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12">
                            <Table className="table table-striped table-hover styled-table table" >
                                <thead>
                                    <tr>
                                        <th><strong>{t("Código")}</strong></th>
                                        <th><strong>{t("Descripción")}</strong></th>
                                        <th><strong>{t("Monto")}</strong></th>
                                        <th><strong>{t("Número de línea")}</strong></th>
                                        <th><strong>{t("Actions")}</strong></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataRows}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            <ModalLineaHija dataManagament={dataManagament} dataSet={dataSet} type={type} isOpen={openModal} toggle={() => { setopenModal(false) }} />
        </React.Fragment>
    );
}

export default LineaHija
