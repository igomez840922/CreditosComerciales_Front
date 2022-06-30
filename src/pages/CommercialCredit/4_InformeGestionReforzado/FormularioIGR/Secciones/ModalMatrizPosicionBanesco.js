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
import Currency from "../../../../../helpers/currency";
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { OnlyNumber } from "../../../../../helpers/commons";
const ModalMatrizCompetitivaPosicionBanesco = (props) => {
    const currencyData = new Currency();
    const { t, i18n } = useTranslation();
    const [campoTasa3, setcampoTasa3] = useState(false);
    const [participacion, setparticipacion] = useState("");
    React.useEffect(() => {
        if (props.tipo == "posicionBanesco" || props.tipo == "EposicionBanesco" || props.tipo == "productosTransaccionales" || props.tipo == "EproductosTransaccionales") {
            setparticipacion(() => { return props.jsonSow.participation })
        } else {
            setparticipacion("")
        }
    }, [props.isOpen])
    // Submitimos formulario para busqueda de clientes
    function handleSubmit(event, errors, values) {

        if (campoTasa3) {
            return;
        }

        event.preventDefault();
        if (errors.length > 0) {
            return;
        }
        values.closeVol = Number(currencyData.getRealValue(values?.closeVol ?? 0))
        values.participation = currencyData.getRealPercent(values?.participation ?? 0)
        if (props.tipo == "posicionBanesco" || props.tipo == "productosTransaccionales") {
            props.dataManagament(values, props.tipo);
        } else {
            props.updateDataManagament(values, props.tipo);
        }
    }
    return (
        <Modal
            size="md"
            isOpen={props.isOpen}
            toggle={props.toggle}
            centered={true}>
            <div className="modal-header">
                <h5 className="modal-title mt-0">{props.tipo == "posicionBanesco" || props.tipo == "EposicionBanesco" ? t("BanescoPosition") : t("BanescoTransactionalProducts")}</h5>
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
                                        <Col md="6">
                                            <div className="mb-3">
                                                <Label htmlFor="quantity">{t("Amount")}</Label>
                                                <AvField
                                                    className="form-control"
                                                    name="closeVol"
                                                    id="closeVol"
                                                    type="text"
                                                    pattern="^[0-9,.]*$"
                                                    onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                                                    value={props.tipo == "posicionBanesco" || props.tipo == "EposicionBanesco" || props.tipo == "productosTransaccionales" || props.tipo == "EproductosTransaccionales" ? currencyData.format(props?.jsonSow?.closeVol ?? 0) : ""}
                                                    validate={{
                                                        required: { value: true, errorMessage: t("Required Field") },
                                                    }}
                                                />
                                            </div>
                                        </Col>
                                        <Col md="6">
                                            <div className="mb-3">
                                                <Label htmlFor="quantity">{t("ParticipationBanesco")}</Label>
                                                <AvField
                                                    className="form-control"
                                                    name="participation"
                                                    id="participation"
                                                    type="text"
                                                    onKeyUp={(e) => { let x = currencyData.getRealPercent(e.target.value); e.target.value = currencyData.formatPercent(x, e); }}
                                                    onChange={(e) => { let x = currencyData.getRealPercent(e.target.value); parseFloat(x) > 100 ? setcampoTasa3(true) : setcampoTasa3(false); }}
                                                    value={participacion}
                                                // validate={{
                                                //     number: { value: true, errorMessage: t("InvalidField") },
                                                // }}
                                                />
                                                {campoTasa3 ?
                                                    <p className="message-error-parrafo">{t("Thepercentageexceeds100%")}</p>
                                                    : null}
                                            </div>
                                        </Col>
                                        <Col md="12">
                                            <div className="mb-3">
                                                <Label htmlFor="description">{t("Producto")}</Label>
                                                <AvField
                                                    className="form-control"
                                                    name="product"
                                                    id="product"
                                                    type="textarea"
                                                    rows="7"
                                                    value={props.tipo == "posicionBanesco" || props.tipo == "EposicionBanesco" || props.tipo == "productosTransaccionales" || props.tipo == "EproductosTransaccionales" ? props.jsonSow.product : ""}

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
                                            {" "} {props.tipo == "posicionBanesco" || props.tipo == "productosTransaccionales" ? t("Save") : t("Save")}
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

ModalMatrizCompetitivaPosicionBanesco.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func
};

export default ModalMatrizCompetitivaPosicionBanesco;
