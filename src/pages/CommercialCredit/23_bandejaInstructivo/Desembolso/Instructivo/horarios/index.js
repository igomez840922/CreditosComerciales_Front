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
import { BackendServices } from "../../../../../../services"
import SweetAlert from "react-bootstrap-sweetalert"
import * as url from "../../../../../../helpers/url_helper"
import Currency from "../../../../../../helpers/currency";
import { uniq_key } from "../../../../../../helpers/unq_key"
import ModalHorario from "./ModalHorarios"
const Horarios = (props) => {
    const currencyData = new Currency();
    const { t, i18n } = useTranslation();
    const location = useLocation()
    const history = useHistory();
    const [dataReturn, setdataReturn] = useState(props.dataReciprocidad);
    /* -------------------------------------------------------- -------------------------------------- */
    /*                        Variables de estados para los mensajes de alerta                        */
    /* ---------------------------------------------------------------------------------------------- */
    const [error_dlg, seterror_dlg] = useState(false);
    const [tipo, setTipo] = useState("")
    const [error_msg, seterror_msg] = useState("");
    const [confirm_alert, setconfirm_alert] = useState(false)
    const [botonValidation, setbotonValidation] = useState(true);
    const [dataDelete, setDataDelete] = useState([]);
    const [dataReciprocityRows, setdataReciprocityRows] = useState(null);
    const [dataRecipro, setdataRecipro] = useState({
        transactId: null,
        year: null,
        month: null,
        sales: null,
        deposits: null,
        averageBalance: null,
        reciprocity: null,
        sow: null
    });
    const [locationData, setLocationData] = useState(null);
    const [showModalReciprocidad, setShowModalReciprocidad] = useState(false);
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
    }, [props.facilityNumber]);
    function cerrarModal() {
        setShowModalReciprocidad(false);
        removeBodyCss()
    }
    function abrirModal() {
        setShowModalReciprocidad(true);
        removeBodyCss()
    }
    function initializeData(dataLocation) {
        const api = new BackendServices();
        // consultarListaReciprocidadIGR
        // PropertyType, Invoices
        api.getDisbursementSchedule(props?.facilityNumber ?? 0).then(resp => {
            if (resp.length > 0 && resp != undefined) {
                setdataReciprocityRows(resp.map((data, index) => (
                    data.status ?
                        <tr key={uniq_key()}>
                            <td>{data.scheduleTypeDesc}</td>
                            <td>{data.methodDesc}</td>
                            <td>{data.freqDesc}</td>
                            <td>{data.sendEach}</td>
                            <td>{data.propertyDesc}</td>
                            <td>{data.iniDate}</td>
                            <td>{currencyData.formatTable(data.percent)}%</td>
                            <td>${currencyData.formatTable(data.amount)}</td>
                            <td>{data.invoiceDesc}</td>
                            <td style={{ textAlign: "right", display: "flex" }}>
                                <Button type="button" color="link" onClick={(resp) => { updateData(data) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
                                <Button type="button" color="link" onClick={(resp) => { deleteData(data) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
                            </td>
                        </tr> : null)
                ));
            } else {
                setdataReciprocityRows(
                    <tr key={uniq_key()}>
                        <td colSpan="9" style={{ textAlign: 'center' }}>{t("NoData")}</td>
                    </tr>);
            }
        });
    }
    // guardar y editar datos
    function dataManagament(data, tipo) {
        const api = new BackendServices()
        data.transactId = locationData.transactionId;
        let datos = {
            "scheduleId": 0,
            "instructionalId": props?.facilityNumber ?? 0,
            "scheduleTypeCode": data?.scheduleTypeCode ?? "",
            "scheduleTypeDesc": data?.scheduleTypeDesc ?? "",
            "methodCode": data?.methodCode ?? "",
            "methodDesc": data?.methodDesc ?? "",
            "freqCode": data?.freqCode ?? "",
            "freqDesc": data?.freqDesc ?? "",
            "sendEach": Number(currencyData.getRealValue(data?.sendEach ?? 0)),//number
            "propertyCode": data?.propertyCode ?? "",
            "propertyDesc": data?.propertyDesc ?? "",
            "percent": Number(currencyData.getRealValue(data?.percent ?? 0)),//number
            "iniDate": "2025-02-21",
            "amount": Number(currencyData.getRealValue(data?.amount ?? 0)),//number
            "invoiceCode": data?.invoiceCode ?? "",
            "invoiceDesc": data?.invoiceDesc ?? "",
            "status": true
        }
        if (tipo == "guardar") {
            // nuevoReciprocidadIGR
            api.saveDisbursementSchedule(datos).then(resp => {
                if (resp !== null && resp !== undefined) {
                    initializeData(locationData);
                    cerrarModal();
                } else {
                    cerrarModal();
                    seterror_dlg(false);
                }
            }).catch(err => {
                seterror_dlg(false);
            })
        } else {
            datos.scheduleId = dataRecipro.scheduleId;
            // actualizarReciprocidadIGR
            api.updateDisbursementSchedule(datos).then(resp => {
                if (resp !== null && resp !== undefined) {
                    initializeData(locationData);
                    cerrarModal();
                } else {
                    cerrarModal();
                    seterror_dlg(false);
                }
            }).catch(err => {
                seterror_dlg(false);
            })
        }
    }
    //abrimos modal para adjunar archivos
    function toggleShowModelAttachment() {
        setShowModalReciprocidad(!showModalReciprocidad);
        removeBodyCss()
    }
    function updateData(data) {
        setdataRecipro(data);
        setTipo("editar");
        setbotonValidation(true);
        abrirModal();
    }
    function deleteData(data) {
        setDataDelete(data)
        setconfirm_alert(true);
    }
    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }
    return (

        <>
            <>
                <Row>
                    <Col md="6"></Col>
                    <Col md="6" style={{ textAlign: "right" }}>
                        <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
                            setbotonValidation(true); setdataRecipro({
                                transactId: null,
                                year: null,
                                month: null,
                                sales: null,
                                deposits: null,
                                averageBalance: null,
                                reciprocity: null,
                                sow: null
                            }); setTipo("guardar"); abrirModal();
                        }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
                    </Col>
                    <Col md="12" className="table-responsive styled-table-div">
                        <Table className="table table-striped table-hover styled-table table" >
                            <thead>
                                <tr>
                                    <th>{t("ScheduleType")}</th>
                                    <th>{t("Method")}</th>
                                    <th>{t("Frequency")}</th>
                                    <th>{t("Send Each")}</th>
                                    <th>{t("PropertyType")}</th>
                                    <th>{t("EstimatedDate")}</th>
                                    <th>{t("Percent")}</th>
                                    <th>{t("Amount")}</th>
                                    <th>{t("Invoices")}</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataReciprocityRows}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </>
            <ModalHorario tipo={tipo} botones={botonValidation} dataRecipro={dataRecipro} dataManagament={dataManagament} isOpen={showModalReciprocidad} toggle={() => { cerrarModal() }} />

            {error_dlg ? (
                <SweetAlert
                    error
                    title={t("ErrorDialog")}
                    confirmButtonText={t("Confirm")}
                    cancelButtonText={t("Cancel")}
                    onConfirm={() => {
                        seterror_dlg(false)
                        initializeData(locationData);
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
                        apiBack.deleteDisbursementSchedule(dataDelete).then(resp => {
                            if (resp.statusCode == "500") {
                                setconfirm_alert(false)
                                seterror_dlg(false)
                            } else {
                                setconfirm_alert(false)
                                initializeData(locationData);
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
        </>
    );
};
Horarios.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func
};
export default Horarios;
