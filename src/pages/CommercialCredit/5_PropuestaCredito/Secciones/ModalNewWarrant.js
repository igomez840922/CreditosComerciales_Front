import React from "react"
import PropTypes from 'prop-types'
import {
    Modal,
    ModalHeader,
    ModalBody,
    Label,
    Row,
    Col,
    Button
} from "reactstrap"
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { useEffect, useState } from 'react';
import { CoreServices } from '../../../../services';
import Select from "react-select";
import { useTranslation } from "react-i18next";
import Currency from "../../../../helpers/currency";
import * as OPTs from "../../../../helpers/options_helper";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import moment from "moment";

const ModalNewWarrant = (props) => {
    const currencyData = new Currency();
    const { t, i18n } = useTranslation();
    const [tipoGaranteSelect, settipoGaranteSelect] = useState(undefined);
    const [campoRequeridoGarantia, setcampoRequeridoGarantia] = useState(false);
    const [campoRequeridoSubGarantia, setcampoRequeridoSubGarantia] = useState(false);
    const [codigoGarantia, setcodigoGarantia] = useState(null);
    const [tiposGarantia, setTiposGarantia] = useState([]);
    const [subtiposGarantia, setsubtiposGarantia] = useState([]);
    const [subtipoGaranteeSelect, setsubtipoGaranteeSelect] = useState(null);
    const [dataReturn, setdataReturn] = useState(null);
    const coreServices = new CoreServices();

    const [fechaSet, setfechaSet] = useState(null);
    const [campoLTV, setcampoLTV] = useState(false);

    React.useEffect(() => {
        console.log('hola')
        setfechaSet(props.dataSet.appraisalDate ? moment(props.dataSet.appraisalDate).format("DD-MM-YYYY") : " ")

        // Read Api Service data
        var defaultVal = null;
        setdataReturn(props.dataSet)

        settipoGaranteSelect(undefined);
        setcodigoGarantia(null)
        setsubtipoGaranteeSelect(undefined);

        setcampoRequeridoGarantia(false);
        setcampoRequeridoSubGarantia(false);

        try {
            loadCatalogWarrant().then(typeWarrant => {

                if (typeWarrant.length > 0 && props.dataSet.guaranteeTypeName !== null && tipoGaranteSelect === undefined) {
                    defaultVal = typeWarrant.find(x => (x.value).toUpperCase() === (props.dataSet.guaranteeTypeName).toUpperCase());
                    if (defaultVal !== undefined) {
                        settipoGaranteSelect(defaultVal);
                        setcodigoGarantia(defaultVal.value);

                        loadSubCatalogWarrant(defaultVal.value).then((subCatalogWarrant) => {

                            defaultVal = subCatalogWarrant?.find(x => (x.value).toUpperCase() === (props.dataSet.guaranteeSubtypeCode).toUpperCase());
                            setsubtipoGaranteeSelect(defaultVal);

                        }, (reject => {
                            setsubtipoGaranteeSelect(undefined);
                        }));
                    }
                }

            })

        }
        catch (err) { }

    }, [props.isOpen]);

    function loadCatalogWarrant() {
        return new Promise((resolve, reject) => {
            setTiposGarantia(null)
            // getTipoGarantiaCatalogo
            coreServices.getTipoGarantiaCatalogo().then((response) => {
                if (response === null) { return; }
                let json = [];
                for (let i = 0; i < response.Records.length; i++) { json.push({ label: response.Records[i]["Description"], value: response.Records[i]["Code"] }) }
                setTiposGarantia(json);
                resolve(json);
            }).catch(err => {
                reject(undefined);
            });
        })
    }

    function loadSubCatalogWarrant(codeSubWarrant) {
        return new Promise((resolve, reject) => {
            coreServices.getSubTipoGarantiaCatalogo(codeSubWarrant).then(subCatalogWarrant => {
                let subWarrant = subCatalogWarrant?.Records?.map(subWarrant => ({ value: subWarrant.Code, label: subWarrant.Description }))
                setsubtiposGarantia(subWarrant);
                resolve(subWarrant);
            }).catch(err => {
                console.log(err)
                reject(undefined);
            });
        })
    }

    function handleSubmitGarantias() {

        
        if (codigoGarantia == null) {
            setcampoRequeridoGarantia(true);
            return;
        } else {
            setcampoRequeridoGarantia(false);
        }
        if (!subtipoGaranteeSelect) {
            setcampoRequeridoSubGarantia(true);
            return;
        } else {
            setcampoRequeridoSubGarantia(false);
        }
        dataReturn.guaranteeTypeName = codigoGarantia;
        dataReturn.ltv = +currencyData.getRealPercent(dataReturn.ltv ?? 0)
        dataReturn.guaranteeSubtypeCode = subtipoGaranteeSelect?.value ?? ''
        dataReturn.guaranteeSubtypeDesc = subtipoGaranteeSelect?.label ?? ''
        setdataReturn(dataReturn);

        props.saveData(dataReturn, props.tipo);
        props.toggle();
    }
    function handleCancel() {
        props.toggle();
    }

    function check(e) {
        let tecla = (document.all) ? e.keyCode : e.which;
        //Tecla de retroceso para borrar, siempre la permite
        if (tecla === 45) {
            e.preventDefault();
            return true;
        }

        return false;
    }

    return (
        <Modal isOpen={props.isOpen}
            toggle={props.toggle}
            centered={true}
            size="md">
            <ModalHeader toggle={props.toggle} color="primary">{t("Warrants")}</ModalHeader>
            <ModalBody>
                <Row>
                    <Col lg="12">
                        <AvGroup className="mb-3">
                            <Label htmlFor="type">{t("Warrant Type")}</Label>
                            <Select noOptionsMessage={() => ""}
                                onChange={(e) => {
                                    settipoGaranteSelect(tiposGarantia.find(x => x.value === e.value)); setcodigoGarantia(e.value);
                                    loadSubCatalogWarrant(e.value)
                                    setcampoRequeridoGarantia(false)
                                }}
                                options={tiposGarantia}
                                value={tipoGaranteSelect}
                                classNamePrefix="select2-selection"
                                placeholder={t("SelectGroup")}
                            />
                            {campoRequeridoGarantia ?
                                <p className="message-error-parrafo">{t("Required")}</p>
                                : null}
                        </AvGroup>
                    </Col>
                    <Col lg="12">
                        <AvGroup className="mb-3">
                            <Label htmlFor="type">{t("SubWarrantType")}</Label>
                            <Select noOptionsMessage={() => ""}
                                onChange={(e) => {
                                    setsubtipoGaranteeSelect(subtiposGarantia.find(x => x.value === e.value));
                                    setcampoRequeridoSubGarantia(false)
                                }}
                                options={subtiposGarantia}
                                value={subtipoGaranteeSelect}
                                classNamePrefix="select2-selection"
                                placeholder={t("SelectGroup")}
                            />
                            {campoRequeridoSubGarantia ?
                                <p className="message-error-parrafo">{t("Required")}</p>
                                : null}
                        </AvGroup>
                    </Col>
                    <Col lg="6">
                        <AvGroup className="mb-3">
                            <Label htmlFor="commercialValue">{t("Commercial Value")}</Label>
                            <AvField
                                className="form-control"
                                name="commercialValue"
                                type="text"
                                pattern="^[0-9,.]*$"
                                onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                                value={currencyData.format(dataReturn?.commercialValue ?? 0)}
                                onChange={(e) => { dataReturn.commercialValue = e.target.value; setdataReturn(dataReturn); }}
                                id="commercialValue" />
                        </AvGroup>

                    </Col>
                    <Col lg="6">
                        <AvGroup className="mb-3">
                            <Label htmlFor="fastValue">{t("Quick V-Value")}</Label>
                            <AvField
                                className="form-control"
                                name="fastValue"
                                type="text"
                                pattern="^[0-9,.]*$"
                                onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                                value={currencyData.format(dataReturn?.fastValue ?? 0)}
                                onChange={(e) => { dataReturn.fastValue = e.target.value; setdataReturn(dataReturn); }}
                                id="fastValue" />
                        </AvGroup>

                    </Col>
                    <Col lg="12">
                        <AvGroup className="mb-3">
                            <Label htmlFor="observations">{t("Description")}</Label>
                            <AvField
                                className="form-control"
                                name="observations"
                                type="textarea"
                                value={dataReturn?.observations}
                                onChange={(e) => { dataReturn.observations = e.target.value; setdataReturn(dataReturn); }}
                                id="observations"
                                rows="4" />
                        </AvGroup>

                    </Col>
                    <Col lg="6">
                        <AvGroup className="mb-3">
                            <Label htmlFor="ltv">{t("LTV%")}</Label>
                            <AvField
                                className="form-control"
                                name="ltv"
                                type="text"
                                onKeyUp={(e) => { let x = currencyData.getRealPercent(e.target.value); e.target.value = currencyData.formatPercent(x, e); }}
                                onChange={(e) => { let x = currencyData.getRealPercent(e.target.value);  dataReturn.ltv = e.target.value; setdataReturn(dataReturn); }}
                                value={`${dataReturn?.ltv}%`}
                                id="ltv" />
                            {campoLTV ?
                                <p className="message-error-parrafo">{t("Thepercentageexceeds100%")}</p>
                                : null}
                        </AvGroup>

                    </Col>
                    <Col lg="6">
                        <Label htmlFor="appraisalDate">{t("Appraisal Date")}</Label>

                        {fechaSet && (<Flatpickr
                            name="estimatedDate"
                            id="estimatedDate"
                            className="form-control d-block"
                            placeholder={OPTs.FORMAT_DATE_SHOW}
                            options={{
                                dateFormat: OPTs.FORMAT_DATE,
                                defaultDate: fechaSet,//selectClient !== undefined ? moment(selectClient.birthDate) : null
                            }}
                            onChange={(selectedDates, dateStr, instance) => {
                                dataReturn.appraisalDate = moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD"); setdataReturn(dataReturn)

                            }}
                        // onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr,"DD/MM/YYYY").format("YYYY-MM-DD") } }) }}

                        // onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr).format("YYYY-MM-DD") } }) }}
                        />)}
                    </Col>
                </Row>
                <Row className="my-2">
                    <Col xl="12 text-end">
                        <Button id="btnCancel" color="danger" type="button" style={{ margin: '5px' }} onClick={handleCancel}>
                            <i className="mdi mdi-cancel mid-12px"></i> {t("Cancel")}
                        </Button>
                        {props.botones ?
                            <Button id="btnSearch" color="success" type="button" onClick={(e) => { handleSubmitGarantias() }} style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                                {" "} {t("Save")}
                            </Button> : null}
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    )
};
ModalNewWarrant.propTypes = {
    toggle: PropTypes.func,
    isOpen: PropTypes.bool
};
export default ModalNewWarrant;
