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
import ModalProducto from "./ModalProducto";

const Productos = (props) => {
    const { dataProduct, dataProductFunction, dataList } = props;
    const [dataProduct1, setdataProduct1] = useState(dataProduct);
    const [dataSet, setdataSet] = useState({
        producto: { Description: "", Code: "" },
        subproducto: { Description: "", Code: "" },
    });
    const [dataRows, setdataRows] = useState(null);
    const [indiceData, setindiceData] = useState(0);
    const [type, settype] = useState("new");
    const backendServices = new BackendServices();
    const { t } = useTranslation();
    const history = useHistory();
    const [openModal, setopenModal] = useState(false);
    useEffect(() => {
        console.log(dataProduct);
        loadData()
    }, [dataProduct]);
    function loadData() {
        setdataRows(dataProduct1.map((data, indice) => (
            <>
                <tr>
                    <td>{data.tipoProducto}</td>
                    <td>{data.descTipoProducto}</td>
                    <td>{data.descTipoSubproducto}</td>
                    <td>{data.descTipoSubproducto}</td>
                    <td><Link to="#" title={t("View")} onClick={() => {
                        setopenModal(true); setdataSet(
                            {
                                producto: { Description: data.descTipoProducto, Code: data.tipoProducto },
                                subproducto: { Description: data.descTipoSubproducto, Code: data.tipoSubProducto },
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
        dataProductFunction(dataProduct1)
    }
    function dataManagament(data) {
        let jsonSet = {
            "tipoProducto": data?.tipoProducto ?? "",
            "descTipoProducto": data?.descTipoProducto ?? "",
            "tipoSubProducto": data?.tipoSubProducto ?? "",
            "descTipoSubproducto": data?.descTipoSubproducto ?? "",
            "idLineasec": dataList?.idLineaSec ?? ""
        }
        if (type == "edit") {
            dataProduct1[indiceData] = jsonSet;
        } else {
            dataProduct1.push(jsonSet);
        }
        setopenModal(false)
        setdataProduct1(dataProduct1);
        dataProductFunction(dataProduct1);
        loadData();
    }
    return (
        <React.Fragment>
            <Card>
                <CardBody>

                    <CardTitle className="h4 d-flex flex-row justify-content-between align-items-center">
                        <div>
                            {t("Productos")}
                        </div>
                    </CardTitle>
                    <Row>
                        <Col md="6">
                        </Col>
                        <Col md="6" style={{ textAlign: "right" }}>
                            <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                                setopenModal(true); setdataSet({
                                    producto: { Description: "", Code: "" },
                                    subproducto: { Description: "", Code: "" },
                                }); settype("new")
                            }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12">
                            <Table className="table table-striped table-hover styled-table table" >
                                <thead>
                                    <tr>
                                        <th><strong>{t("Código de producto")}</strong></th>
                                        <th><strong>{t("Descripción de producto")}</strong></th>
                                        <th><strong>{t("Código subproducto")}</strong></th>
                                        <th><strong>{t("Descripción subproducto")}</strong></th>
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
            <ModalProducto dataManagament={dataManagament} dataSet={dataSet} type={type} isOpen={openModal} toggle={() => { setopenModal(false) }} />
        </React.Fragment>
    );
}

export default Productos
