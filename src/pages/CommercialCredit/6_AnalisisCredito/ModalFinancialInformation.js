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
import { CoreServices } from "../../../services";
import ApiServiceBackend from "../../../services/BackendServices/Services";
import Select from "react-select";
import Currency from "../../../helpers/currency";

const ModalFinancialInformation = React.forwardRef((props, ref) => {
    const { t, i18n } = useTranslation();
    const [identificationType, setidentificationType] = useState("1");//1-Juridico, 2-Persona
    const [campoRequeridoTipo, setcampoRequeridoTipo] = useState(false);
    const [campoRequeridoNacionalidad, setcampoRequeridoNacionalidad] = useState(false);
    const [tipo, setTipo] = useState('guardar');
    const [tipoPersona, settipoPersona] = useState(undefined);
    const [dataReturn, setDataReturn] = useState(props.jsonAccionistas);
    const [cambio, setcambio] = useState(1);
    const [identificationTypeList, setIdentificationTypeList] = useState([]);
    const [identificationTypeSelected, setIdentificationTypeSelected] = useState(undefined);
    const [personTypeSelect, setpersonTypeSelect] = useState(undefined);
    const [TypeIdentification, setTypeIdentification] = useState(null);
    const [campoRequeridoIdentificacion, setcampoRequeridoIdentificacion] = useState(false);
    const currencyData = new Currency();

    // Submitimos formulario para busqueda de clientes
    const personTypeData = [{ label: t("Legal"), value: "1" }, { label: t("Natural"), value: "2" }]
    function handleSubmit(event, errors, values) {
        if (tipo == null) {
            setcampoRequeridoTipo(true);
            return;
        } else {
            setcampoRequeridoTipo(false);
        }

        if (TypeIdentification == null) {
            setcampoRequeridoIdentificacion(true);
            return;
        } else {
            setcampoRequeridoIdentificacion(false);
        }

        event.preventDefault();
        if (errors.length > 0) {
            return;
        }

        values.identificationType = TypeIdentification;
        values.personType = tipo.label;

        values.share = currencyData.getRealValue(values.share);
        values.activeCash = currencyData.getRealValue(values.activeCash);
        values.activeShares = currencyData.getRealValue(values.activeShares);
        values.passiveLoan = currencyData.getRealValue(values.passiveLoan);
        values.personalWealth = currencyData.getRealValue(values.personalWealth);
        
        props.SendDataToServer({ ...values, guarantorId: props.DataUpdate?.guarantorId, status: props.DataUpdate?.status ?? true });
        props.toggle();
    }
    React.useEffect(() => {

        LoadIdentification();

        if (props.tipo != "guardar") {
            setidentificationType(props.DataUpdate?.personType ?? 'RUC')
        }

    }, [props]);
    React.useEffect(() => {
        // Read Api Service data
        var defaultVal = null;
        try {
            if (identificationTypeList.length > 0 && props.DataUpdate.identificationType !== null && identificationTypeSelected === undefined) {
                defaultVal = identificationTypeList.find(x => (x.value).toUpperCase() === (props.DataUpdate.identificationType).toUpperCase());
                if (defaultVal !== undefined) {
                    setIdentificationTypeSelected(defaultVal);
                }
            }
        }
        catch (err) { }
    }, [props]);
    React.useEffect(() => {
        // Read Api Service data
        var defaultVal = null;

        setIdentificationTypeSelected(undefined)
        setpersonTypeSelect(undefined)
        try {

            if (personTypeData.length > 0 && props.DataUpdate.personType !== null && personTypeSelect === undefined) {
                defaultVal = personTypeData.find(x => (x.label).toUpperCase() === (props.DataUpdate.personType).toUpperCase());
                if (defaultVal !== undefined) {
                    setTipo(defaultVal)
                    setpersonTypeSelect(defaultVal);
                }
            }
            if (identificationTypeList.length > 0 && props.DataUpdate.identificationType !== null && identificationTypeSelected === undefined) {
                defaultVal = identificationTypeList.find(x => (x.label).toUpperCase() === (props.DataUpdate.identificationType).toUpperCase());
                if (defaultVal !== undefined) {
                    setidentificationType(defaultVal.label)
                    setTypeIdentification(defaultVal.label)
                    setIdentificationTypeSelected(defaultVal);
                }
            }
        }
        catch (err) { }

    }, [props]);

    function changeTipo(event) {
        setTipo(event);
        setidentificationType(event.value);
    }

    //On change Inputs
    function handleChangeInputfrmSearch(e) {
        //selectedData[e.target.name] = e.target.value;
        //props.updateDataModel(selectedData);    

        switch (e.target.name) {
            case "identificationType": {
                setidentificationType(e.target.value);
                break;
            }
        }
    }
    function LoadIdentification() {
        const apiServiceBackend = new ApiServiceBackend();
        apiServiceBackend.consultarCatalogoTipoIdentificacion()
            .then((data) => {
                if (data !== null && data !== undefined) {
                    let json = [];
                    for (let i = 0; i < data.length; i++) {
                        json.push({ label: t(data[i]["description"]), value: data[i]["id"] })
                    }
                    /*const optionGroup1 = [
                      {
                        label: t("ID Type"),
                        options: json,
                      },
                    ];*/
                    setIdentificationTypeList(json)
                }
            })
            .catch((error) => {
                console.error('api error: ', error);
            });
    }
    function getSearchForm(tipo) {
        //segun tipo de identiicación
        switch (tipo != undefined && tipo.value) {
            case "RUC": { //Juridico
                return (
                    <Col md="8">
                        <div className="mb-3">
                            <Label htmlFor="firstName">{t("SocialReason")}</Label>
                            <AvField
                                className="form-control"
                                name="firstName"
                                type="text" onChange={handleChangeInputfrmSearch}
                                value={props.DataUpdate?.firstName ?? ''}
                                errorMessage={t("Required Field")}
                                validate={{ required: { value: true } }} />
                        </div>
                    </Col>
                )
            }
            default: { //Cedula o Pasaporte 
                return (
                    <React.Fragment>
                        <Col md="4">
                            <div className="mb-3">
                                <Label htmlFor="firstName">{t("First Name")}</Label>
                                <AvField
                                    className="form-control"
                                    name="firstName"
                                    value={props.DataUpdate?.firstName ?? ''}
                                    type="text" onChange={handleChangeInputfrmSearch}
                                    errorMessage={t("Required Field")}
                                    validate={{ required: { value: true } }} />
                            </div>
                        </Col>
                        <Col md="4">
                            <div className="mb-3">
                                <Label htmlFor="secondName">{t("SecondName")}</Label>
                                <AvField
                                    name="secondName"
                                    value={props.DataUpdate?.secondName ?? ''}
                                    type="text" onChange={handleChangeInputfrmSearch}
                                    className="form-control" />
                            </div>
                        </Col>
                        <Col md="4">
                            <div className="mb-3">
                                <Label htmlFor="firstLastName">{t("FirstLastName")}</Label>
                                <AvField
                                    name="firstLastName"
                                    value={props.DataUpdate?.firstLastName ?? ''}
                                    type="text" onChange={handleChangeInputfrmSearch}
                                    errorMessage={t("Required Field")}
                                    className="form-control" />
                            </div>
                        </Col>
                        <Col md="4">
                            <div className="mb-3">
                                <Label htmlFor="secondLastName">{t("SecondLastName")}</Label>
                                <AvField
                                    name="secondLastName"
                                    value={props.DataUpdate?.secondLastName ?? ''}
                                    type="text" onChange={handleChangeInputfrmSearch}
                                    className="form-control" />
                            </div>
                        </Col>
                    </React.Fragment>
                )
            }
        }
    }

    return (
        <Modal
            size="xl"
            isOpen={props.isOpen}
            toggle={props.toggle}
            centered={true}>
            <div className="modal-header">
                <h5 className="modal-title mt-0">{t("Guarantors Financial Information")}</h5>
                <button
                    type="button"
                    onClick={props.toggle}
                    data-dismiss="modal"
                    className="close"
                    aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
                <div className="modal-body" style={{ backgroundColor: "#f3f5f7" }}>
                    <Row>
                        <Col xl="12">
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col xl="4">
                                            <div className="mb-3">
                                                <Label>{t("ID Type")}</Label>
                                                <Select noOptionsMessage={() => ""} 
                                                    onChange={(e) => {
                                                        setIdentificationTypeSelected(identificationTypeList.find(x => x.value === e.value))
                                                        setTypeIdentification(e.label);
                                                    }}
                                                    options={identificationTypeList}
                                                    placeholder={t("SelectType")}
                                                    value={identificationTypeSelected}
                                                />
                                                {campoRequeridoIdentificacion ?
                                                    <p className="message-error-parrafo">{t("Required Field")}</p>
                                                    : null}
                                            </div>
                                        </Col>

                                        <Col xl="4">
                                            <div className="mb-3">
                                                <Label htmlFor="idnumber">{t("ID Number")}</Label>
                                                <AvField
                                                    className="form-control"
                                                    name="identificationNumber"
                                                    type="text"
                                                    id="identificationNumber"
                                                    value={props.DataUpdate?.identificationNumber ?? ''}
                                                    validate={{
                                                        required: { value: true, errorMessage: t("Required Field") },
                                                        // number: { value: true, errorMessage: t("InvalidField") },
                                                    }}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="4">
                                            <div className="mb-3">
                                                <Label htmlFor="identificationType">{t("PersonType")}</Label>
                                                <Select noOptionsMessage={() => ""} 
                                                    onChange={(e) => { setpersonTypeSelect(personTypeData.find(x => x.value === e.value)); changeTipo(e) }}
                                                    options={personTypeData}
                                                    id="sustainableCustomer"
                                                    classNamePrefix="select2-selection"
                                                    placeholder={t("toselect")}
                                                    value={personTypeSelect}
                                                // value={props.DataUpdate.shareholderName}
                                                />
                                                {campoRequeridoTipo ?
                                                    <p className="message-error-parrafo">{t("Required Field")}</p>
                                                    : null}

                                            </div>
                                        </Col>
                                        {getSearchForm(identificationTypeSelected)}
                                    </Row>

                                    <Row>
                                        <Col md="4">
                                            <div className="mb-3">
                                                <Label htmlFor="share">{t("Share")}</Label>
                                                <AvField
                                                    name="share"
                                                    value={currencyData.format(props.DataUpdate?.share ?? 0)}
                                                    type="text"
                                                    pattern="^[0-9,.]*$"
                                                    onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                                                    onChange={handleChangeInputfrmSearch}
                                                    className="form-control" />
                                            </div>
                                        </Col>
                                        <Col md="4">
                                            <div className="mb-3">
                                                <Label htmlFor="activeCash">{t("ActiveCash")}</Label>
                                                <AvField
                                                    name="activeCash"
                                                    value={currencyData.format(props.DataUpdate?.activeCash ?? 0)}
                                                    type="text"
                                                    pattern="^[0-9,.]*$"
                                                    onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                                                    onChange={handleChangeInputfrmSearch}
                                                    className="form-control" />
                                            </div>
                                        </Col>
                                        <Col md="4">
                                            <div className="mb-3">
                                                <Label htmlFor="activeShares">{t("ActiveShares")}</Label>
                                                <AvField
                                                    name="activeShares"
                                                    value={currencyData.format(props.DataUpdate?.activeShares ?? 0)}
                                                    type="text"
                                                    pattern="^[0-9,.]*$"
                                                    onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                                                    onChange={handleChangeInputfrmSearch}
                                                    className="form-control" />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="4">
                                            <div className="mb-3">
                                                <Label htmlFor="passiveLoan">{t("PassiveLoan")}</Label>
                                                <AvField
                                                    name="passiveLoan"
                                                    value={currencyData.format(props.DataUpdate?.passiveLoan ?? 0)}
                                                    type="text"
                                                    pattern="^[0-9,.]*$"
                                                    onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                                                    onChange={handleChangeInputfrmSearch}
                                                    className="form-control" />
                                            </div>
                                        </Col>
                                        <Col md="4">
                                            <div className="mb-3">
                                                <Label htmlFor="personalWealth">{t("PersonalWealth")}</Label>
                                                <AvField
                                                    name="personalWealth"
                                                    value={currencyData.format(props.DataUpdate?.personalWealth ?? 0)}
                                                    type="text"
                                                    pattern="^[0-9,.]*$"
                                                    onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                                                    onChange={handleChangeInputfrmSearch}
                                                    className="form-control" />
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter style={{ textAlign: "right" }}>
                                    <Button id="btnNew" color="danger" type="button" style={{ margin: '5px' }} onClick={props.toggle} data-dismiss="modal">
                                        <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
                                    </Button>
                                    {
                                        <Button id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                                            {" "} {t("Save")}
                                        </Button>}
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </AvForm>
        </Modal>
    );
});

ModalFinancialInformation.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func,
    // onSelectClient: PropTypes.func.isRequired
};

export default (withTranslation()(ModalFinancialInformation));
