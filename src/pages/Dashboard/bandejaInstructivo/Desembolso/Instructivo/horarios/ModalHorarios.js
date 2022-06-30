import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Button,
    Label,
    Input,
    Modal,
    Card,
    CardBody,
    CardFooter,
} from "reactstrap"
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { Select } from 'antd';
import { BackendServices, CoreServices } from "../../../../../../services";
import * as OPTs from "../../../../../../helpers/options_helper"
import moment from "moment";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import Currency from "../../../../../../helpers/currency";
const ModalHorario = (props) => {
    const { Option } = Select;
    const currencyData = new Currency();
    const [fechaSet, setfechaSet] = useState("");
    const { t, i18n } = useTranslation();
    const [campoRequeridoSeguro, setcampoRequeridoSeguro] = useState(false);
    const [TipoHorarioSet, setTipoHorarioSet] = useState(null);
    const [tipoHorario, settipoHorario] = useState(null);
    const [tipoMetodo, settipoMetodo] = useState(null);
    const [tipoMetodoSet, settipoMetodoSet] = useState(null);
    const [tipoFrecuenciaSet, settipoFrecuenciaSet] = useState(null);
    const [tipoFrecuencia, settipoFrecuencia] = useState(null);
    const [tPropiedad, settPropiedad] = useState(null);
    const [tPropiedadSet, settPropiedadSet] = useState(null);
    const [tFactura, settFactura] = useState(null);
    const [tFacturaSet, settFacturaSet] = useState(null);
    const [campoTasa, setcampoTasa] = useState(false);
    const [tipoSeguro, settipoSeguro] = useState(undefined);
    const [coreServices, setcoreServices] = useState(new CoreServices())
    const [backendServices, setbackendServices] = useState(new BackendServices())
    // Submitimos formulario para busqueda de clientes
    const [fechaSet2, setfechaSet2] = useState(null);
    const [dataTipoSeguro, setdataTipoSeguro] = useState(null)
    function handleSubmit(event, errors, values) {
        if (campoTasa) {
            return;
        }
        let datosJson = {
            "scheduleTypeCode": TipoHorarioSet?.value ?? "",
            "scheduleTypeDesc": TipoHorarioSet?.label ?? "",
            "methodCode": tipoMetodoSet?.value ?? "",
            "methodDesc": tipoMetodoSet?.label ?? "",
            "freqCode": tipoFrecuenciaSet?.value ?? "",
            "freqDesc": tipoFrecuenciaSet?.label ?? "",
            "sendEach": Number(currencyData.getRealValue(values?.sendEach ?? 0)),//number
            "propertyCode": tPropiedadSet?.value ?? "",
            "propertyDesc": tPropiedadSet?.label ?? "",
            "percent": Number(currencyData.getRealPercent(values?.percent ?? 0)),//number
            "iniDate": moment(fechaSet2, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet2 : (moment(fechaSet2, "DD/MM/YYYY").format("YYYY-MM-DD")),
            "amount": Number(currencyData.getRealValue(values?.amount ?? 0)),//number
            "invoiceCode": tFacturaSet?.value ?? "",
            "invoiceDesc": tFacturaSet?.label ?? "",
            "status": true
        }
        event.preventDefault();
        if (errors.length > 0) {
            return;
        }
        props.dataManagament(datosJson, props.tipo);
    }
    React.useEffect(() => {
        // Read Api Service data     
        initializeData()
        var defaultVal = null;
        if (props.tipo == "guardar") {
            setfechaSet2(moment().format("DD-MM-YYYY"))
        } else {
            setfechaSet2(moment(props.dataRecipro.dueDate).format("DD-MM-YYYY"))
        }
    }, [props.isOpen]);

    function initializeData() {
        backendServices.getInstructivoDesembolsoTipoPago().then(resp => {
            settipoHorario(resp?.map(schedule => ({ value: schedule.code, label: schedule.value })))
        }).catch(err => {
            console.log(err)
        });
        backendServices.getInstructivoDesembolsoMetodos().then(resp => {
            settipoMetodo(resp?.map(method => ({ value: method.code, label: method.value })))
        }).catch(err => {
            console.log(err)
        });
        backendServices.getCatalogoInstructivoDesembolsoFrecuencia().then(resp => {
            settipoFrecuencia(resp?.map(frequency => ({ value: frequency.code, label: frequency.value })))
        }).catch(err => {
            console.log(err)
        });
        backendServices.getInstructivoDesembolsoPropiedade().then(resp => {
            settPropiedad(resp?.map(property => ({ value: property.code, label: property.value })))
        }).catch(err => {
            console.log(err)
        });
        backendServices.getInstructivoDesembolsoTipoFact().then(resp => {
            settFactura(resp?.map(invoice => ({ value: invoice.code, label: invoice.value })))
        }).catch(err => {
            console.log(err)
        });
    }
    return (
        <Modal
            size="lg"
            isOpen={props.isOpen}
            toggle={props.toggle}
            centered={true}>
            <div className="modal-header">
                <h5 className="modal-title mt-0">{t("Squedules")}</h5>
                <button
                    type="button"
                    onClick={props.toggle}
                    data-dismiss="modal"
                    className="close"
                    aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body" style={{ backgroundColor: "#f3f5f7" }}>
                <Row>
                    <Col xl="12">
                        <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
                            <Card>
                                <CardBody>
                                    <Row>


                                        <Col md="4">
                                            <Label>{t("Type")}</Label>
                                            <Select noOptionsMessage={() => ""}
                                                style={{ width: "100%" }}
                                                optionFilterProp="children"
                                                defaultValue={props?.dataRecipro?.scheduleTypeCode}
                                                onChange={(e) => {
                                                    setTipoHorarioSet(tipoHorario.find(x => x.value == e))
                                                }}
                                                filterOption={(input, option) =>
                                                    option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {tipoHorario?.length > 0 ?
                                                    tipoHorario?.map((item, index) => (
                                                        <Option key={index} value={item.value}>{item.label}</Option>
                                                    ))
                                                    : null}
                                            </Select>
                                        </Col>
                                        <Col md="4">
                                            <Label>{t("Method")}</Label>
                                            <Select noOptionsMessage={() => ""}
                                                style={{ width: "100%" }}
                                                optionFilterProp="children"
                                                defaultValue={props?.dataRecipro?.methodCode}
                                                onChange={(e) => {
                                                    settipoMetodoSet(tipoMetodo.find(x => x.value == e))
                                                }}
                                                filterOption={(input, option) =>
                                                    option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {tipoMetodo?.length > 0 ?
                                                    tipoMetodo?.map((item, index) => (
                                                        <Option key={index} value={item.value}>{item.label}</Option>
                                                    ))
                                                    : null}
                                            </Select>
                                        </Col>
                                        <Col md="4">
                                            <Label>{t("Frequency")}</Label>
                                            <Select noOptionsMessage={() => ""}
                                                style={{ width: "100%" }}
                                                optionFilterProp="children"
                                                defaultValue={props?.dataRecipro?.freqCode}
                                                onChange={(e) => {
                                                    settipoFrecuenciaSet(tipoFrecuencia.find(x => x.value == e))
                                                }}
                                                filterOption={(input, option) =>
                                                    option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {tipoFrecuencia?.length > 0 ?
                                                    tipoFrecuencia?.map((item, index) => (
                                                        <Option key={index} value={item.value}>{item.label}</Option>
                                                    ))
                                                    : null}
                                            </Select>
                                        </Col>
                                        <Col md="4">
                                            <Label>{t("Enviar/Cada")}</Label>
                                            <AvField
                                                id="sendEach"
                                                name="sendEach"
                                                className="form-control"
                                                type="text"
                                                pattern="^[0-9,.]*$"
                                                onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                                                value={currencyData.format(props?.dataRecipro?.sendEach ?? 0)}
                                            />
                                        </Col>
                                        <Col md="4">
                                            <Label>{t("Tipo")}</Label>
                                            <Select noOptionsMessage={() => ""}
                                                style={{ width: "100%" }}
                                                optionFilterProp="children"
                                                defaultValue={props?.dataRecipro?.propertyCode}
                                                onChange={(e) => {
                                                    settPropiedadSet(tPropiedad.find(x => x.value == e))
                                                }}
                                                filterOption={(input, option) =>
                                                    option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {tPropiedad?.length > 0 ?
                                                    tPropiedad?.map((item, index) => (
                                                        <Option key={index} value={item.value}>{item.label}</Option>
                                                    ))
                                                    : null}
                                            </Select>
                                        </Col>
                                        <Col md="4">
                                            <Label>{t("EstimatedDate")}</Label>
                                            <Flatpickr
                                                name="date"
                                                id="date"
                                                className="form-control d-block"
                                                placeholder={OPTs.FORMAT_DATE_SHOW}
                                                options={{
                                                    dateFormat: OPTs.FORMAT_DATE,
                                                    defaultDate: fechaSet2,//selectClient !== undefined ? moment(selectClient.birthDate) : null
                                                }}
                                                onChange={(selectedDates, dateStr, instance) => { setfechaSet2(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")); }}
                                            />
                                        </Col>
                                        <Col md="4">
                                            <Label>{t("Percent")}</Label>
                                            <AvField
                                                id="percent"
                                                name="percent"
                                                className="form-control"
                                                type="text"
                                                onKeyUp={(e) => { let x = currencyData.getRealPercent(e.target.value); e.target.value = currencyData.formatPercent(x, e); }}
                                                value={props?.dataRecipro?.percent ?? 0}
                                                onChange={(e) => { let x = currencyData.getRealPercent(e.target.value); parseFloat(x) > 100 ? setcampoTasa(true) : setcampoTasa(false); }}
                                            />
                                            {campoTasa ?
                                                <p className="message-error-parrafo">{t("Thepercentageexceeds100%")}</p>
                                                : null}
                                        </Col>
                                        <Col md="4">
                                            <Label>{t("Amount")}</Label>
                                            <AvField
                                                id="amount"
                                                name="amount"
                                                className="form-control"
                                                type="text"
                                                pattern="^[0-9,.]*$"
                                                onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                                                value={currencyData.format(props?.dataRecipro?.sendEach ?? 0)}
                                            />
                                        </Col>
                                        <Col md="4">
                                            <Label>{t("Invoices")}</Label>
                                            <Select noOptionsMessage={() => ""}
                                                style={{ width: "100%" }}
                                                optionFilterProp="children"
                                                defaultValue={props?.dataRecipro?.invoiceCode}
                                                onChange={(e) => {
                                                    settFacturaSet(tFactura.find(x => x.value == e))
                                                }}
                                                filterOption={(input, option) =>
                                                    option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {tFactura?.length > 0 ?
                                                    tFactura?.map((item, index) => (
                                                        <Option key={index} value={item.value}>{item.label}</Option>
                                                    ))
                                                    : null}
                                            </Select>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter style={{ textAlign: "right" }}>

                                    <Button id="btnNew" color="danger" type="button" style={{ margin: '5px' }} onClick={props.toggle} data-dismiss="modal">
                                        <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
                                    </Button>
                                    {props.botones ?
                                        <Button id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                                            {" "} {props.tipo == "guardar" ? t("Save") : t("Save")}
                                        </Button> : null}
                                </CardFooter>
                            </Card>
                        </AvForm>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};
ModalHorario.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func,
};
export default ModalHorario;
