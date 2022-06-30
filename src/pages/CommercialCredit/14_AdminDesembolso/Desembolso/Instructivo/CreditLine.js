import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types'
import { Link, useLocation, useHistory } from "react-router-dom"
import {
    Row,
    Col,
    Button,
    Label,
    Table,
    Card,
    CardBody,
    CardFooter,
} from "reactstrap"
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { BackendServices } from "../../../../../services"
import SweetAlert from "react-bootstrap-sweetalert"
import * as url from "../../../../../helpers/url_helper"
import Currency from "../../../../../helpers/currency";
import { uniq_key } from "../../../../../helpers/unq_key"
import ModalHorario from "./horarios/ModalHorarios"
import ModalCreacionLinea from "./modalCreacionLinea"
const CreditLine = (props) => {
    const currencyData = new Currency();
    const { t, i18n } = useTranslation();
    const location = useLocation()
    const history = useHistory();
    /* -------------------------------------------------------- -------------------------------------- */
    /*                        Variables de estados para los mensajes de alerta                        */
    /* ---------------------------------------------------------------------------------------------- */
    const [error_dlg, seterror_dlg] = useState(false);
    const [error_msg, seterror_msg] = useState("");
    const [tableRows, setTableRows] = useState(null);

    const [locationData, setLocationData] = useState(null);
    const [modalCreacionLinea, setmodalCreacionLinea] = useState(false);
    const [dataDelete, setDataDelete] = useState(undefined);
    const [confirm_alert, setconfirm_alert] = useState(false);

    const api = new BackendServices();

    React.useEffect(() => {
        let dataSession;
        if (location.data !== null && location.data !== undefined) {
            if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
                history.push(url.URL_DASHBOARD);
            }
            else {
                sessionStorage.setItem('locationData', JSON.stringify(location.data));
                setLocationData(location.data);
                dataSession = location.data;
            }
        }
        else {
            var result = sessionStorage.getItem('locationData');
            if (result !== undefined && result !== null) {
                result = JSON.parse(result);
                setLocationData(result);
                dataSession = result;
            }
        }
        initializeData(dataSession);
    }, []);

    function initializeData(dataLocation = locationData) {

        api.getCreditLine(dataLocation?.transactionId).then(resp => {
            if (resp.length > 0 && resp != undefined) {
                setTableRows(resp.map((data, index) => (
                    data.status ?
                        <tr key={uniq_key()}>
                            <td>{data.clientNumber}</td>
                            <td>{data.lineId}</td>
                            <td>{data.maxTotal}</td>
                            <td>{data.approvalDate}</td>
                            {/*<td>{data.limitAmtType}</td>*/}
                            <td style={{ textAlign: "right", display: "flex" }}>
                                <Button type="button" color="link" onClick={(resp) => { deleteData(data) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
                            </td>
                        </tr> : null)
                ));
            } else {
                setTableRows(
                    <tr key={uniq_key()}>
                        <td colSpan="9" style={{ textAlign: 'center' }}>{t("NoData")}</td>
                    </tr>);
            }
        });
    }


    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }


    function cerrarModalLinea() {
        initializeData()
        setmodalCreacionLinea(false);
        removeBodyCss()
    }

    function deleteData(data) {
        setDataDelete(data)
        setconfirm_alert(true)
    }

    return (

        <>
            <>
                <Row>
                    <Col md="6"></Col>
                    <Col md="6" style={{ textAlign: "right" }}>
                        <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                            setmodalCreacionLinea(true)
                        }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
                    </Col>
                    <Col md="12" className="table-responsive styled-table-div mb-4">
                        <Table className="table table-striped table-hover styled-table table" >
                            <thead>
                                <tr>
                                    <th>{t("Número del Cliente")}</th>
                                    <th>{t("Número Línea")}</th>
                                    <th>{t("Monto máximo")}</th>
                                    <th>{t("Fecha")}</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableRows}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </>

            {error_dlg ? (
                <SweetAlert
                    error
                    title={t("ErrorDialog")}
                    confirmButtonText={t("Confirm")}
                    cancelButtonText={t("Cancel")}
                    onConfirm={() => {
                        seterror_dlg(false)
                        initializeData();
                    }}
                >
                    {error_msg}
                </SweetAlert>
            ) : null}

            {confirm_alert ? (
                <SweetAlert
                    title={t("Areyousure")}
                    warning
                    showCancel
                    confirmButtonText={t("Yesdeleteit")}
                    cancelButtonText={t("Cancel")}
                    confirmBtnBsStyle="success"
                    cancelBtnBsStyle="danger"
                    onConfirm={() => {
                        const apiBack = new BackendServices();
                        apiBack.deleteCreditLine(locationData?.transactionId, dataDelete.lineId).then(resp => {
                            if (resp.statusCode == "500") {
                                setconfirm_alert(false)
                                seterror_dlg(false)
                            } else {
                                setconfirm_alert(false)
                                initializeData();
                            }
                        }).catch(error => {
                            setconfirm_alert(false)
                            seterror_dlg(false)
                        })
                    }}
                    onCancel={() => setconfirm_alert(false)}
                >
                    {t("Youwontbeabletorevertthis")}
                </SweetAlert>
            ) : null}


            <ModalCreacionLinea facilityType={props?.facilityType} facilityId={props?.facilityId ?? 0} isOpen={modalCreacionLinea} toggle={() => { setmodalCreacionLinea(false) }} cerrarModalLinea={cerrarModalLinea} />

        </>
    );
};
CreditLine.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func
};
export default CreditLine;
