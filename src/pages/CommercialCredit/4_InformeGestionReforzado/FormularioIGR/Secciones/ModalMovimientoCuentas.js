import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Button,
    Label,
    Modal,
    Card,
    CardBody,
    CardFooter,
} from "reactstrap"
import Select from "react-select";
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import Currency from "../../../../../helpers/currency";
const ModalMovimientoCuenta = (props) => {
    const currencyData = new Currency();
    const { t, i18n } = useTranslation();
    const [dato, setdato] = useState(null);
    const [campoRequeridoTipo, setcampoRequeridoTipo] = useState(false);
    const [mesSelect, setmesSelect] = useState(undefined);
    const meses = [{ label: t("January"), value: t("January") }
        , { label: t("February"), value: t("February") },
    { label: t("March"), value: t("March") },
    { label: t("April"), value: t("April") },
    { label: t("May"), value: t("May") },
    { label: t("June"), value: t("June") },
    { label: t("July"), value: t("July") },
    { label: t("August"), value: t("August") },
    { label: t("September"), value: t("September") },
    { label: t("October"), value: t("October") },
    { label: t("November"), value: t("November") },
    { label: t("December"), value: t("December") }];
    React.useEffect(() => {
        // Read Api Service data
        var defaultVal = null;
        setmesSelect(undefined)
        try {
            if (meses.length > 0 && props.dataAcciones.month !== null && mesSelect === undefined) {
                defaultVal = meses.find(x => (x.value).toUpperCase() === (props.dataAcciones.month).toUpperCase());
                if (defaultVal !== undefined) {
                    setmesSelect(defaultVal);
                } else {
                    defaultVal = meses.find(x => (x.value).toUpperCase() === (props.dataAcciones.month).toUpperCase());
                    if (defaultVal !== undefined) {
                        setmesSelect(defaultVal);
                    }
                }
            }
        }
        catch (err) { }

    }, [props.isOpen]);
    // Submitimos formulario para busqueda de clientes
    function handleSubmit(event, errors, values) {
        if (dato == null) {
            setcampoRequeridoTipo(true);
            return;
        } else {
            setcampoRequeridoTipo(false);
        }
        event.preventDefault();
        if (errors.length > 0) {
            return;
        }
        values.year = Number(values.year);
        // values.month = "2001-01-01";
        values.month = dato;
        // values.deposits = Number(values.deposits);
        // values.averageBalance = Number(values.averageBalance);
        values.averageBalance = Number(currencyData.getRealValue(values?.averageBalance ?? 0));
        values.deposits = Number(currencyData.getRealValue(values?.deposits ?? 0));
        if (props.tipo == "guardar") {
            props.dataManagament(values, props.tipo);
        } else {
            values.movementId = props.dataAcciones.movementId
            props.dataManagament(values, props.tipo);
        }
    }
    return (
        <Modal
            size="xl"
            isOpen={props.isOpen}
            toggle={props.toggle}
            centered={true}>
            <div className="modal-header">
                <h5 className="modal-title mt-0">{t("AccountMovements")}</h5>
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
                                        <Col md="3">
                                            <div className="mb-3">
                                                <Label htmlFor="year">{t("Year")}</Label>
                                                <AvField
                                                    className="form-control"
                                                    type="text"
                                                    name="year"
                                                    validate={{
                                                        required: { value: true, errorMessage: t("Required Field") },
                                                    }}
                                                    value={props.dataAcciones.year}
                                                    id="year"
                                                />
                                            </div>
                                        </Col>
                                        <Col md="3">
                                            <div className="mb-3">
                                                <Label htmlFor="month">{t("Month")}</Label>
                                                <Select noOptionsMessage={() => ""}
                                                    onChange={(e) => { setmesSelect(meses.find(x => x.value === e.value)); setdato(e.value); }}
                                                    options={meses}
                                                    id="sustainableCustomer"
                                                    classNamePrefix="select2-selection"
                                                    placeholder={t("toselect")}
                                                    value={mesSelect}
                                                />
                                                {campoRequeridoTipo ?
                                                    <p className="message-error-parrafo">{t("Required Field")}</p>
                                                    : null}
                                            </div>
                                        </Col>
                                        <Col md="3">
                                            <div className="mb-3">
                                                <Label htmlFor="deposits">{t("Deposits")}</Label>
                                                <AvField
                                                    className="form-control"
                                                    type="text"
                                                    name="deposits"
                                                    pattern="^[0-9,.]*$"
                                                    onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                                                    value={props?.dataAcciones?.deposits != null ? currencyData.format(props?.dataAcciones?.deposits ?? 0) : ""}
                                                    id="deposits"
                                                />
                                            </div>
                                        </Col>
                                        <Col md="3">
                                            <div className="mb-3">
                                                <Label htmlFor="averageBalance">{t("AverageBalance")}</Label>
                                                <AvField
                                                    className="form-control"
                                                    type="text"
                                                    name="averageBalance"
                                                    value={props?.dataAcciones?.averageBalance != null ? currencyData.format(props?.dataAcciones?.averageBalance ?? 0) : ""}
                                                    pattern="^[0-9,.]*$"
                                                    onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                                                    id="averageBalance"
                                                />
                                            </div>
                                        </Col>
                                        <Col md="12">
                                            <div className="mb-3">
                                                <Label htmlFor="observations">{t("Observation")}</Label>
                                                <AvField
                                                    className="form-control"
                                                    type="textarea"
                                                    name="observations"
                                                    rows="7"

                                                    value={props.dataAcciones.observations}
                                                    id="observations"
                                                />
                                            </div>
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
ModalMovimientoCuenta.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func
};
export default ModalMovimientoCuenta;
