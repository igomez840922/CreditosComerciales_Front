import React, { useState } from "react"
import PropTypes from 'prop-types';
import { translationHelpers } from "../../helpers";

import {
    Row,
    Col,
    Button,
    Label,
    Input,
    Modal,
} from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"
import Select from "react-select";

const ModalPolicy = (props) => {
    const [comply, setcomply] = useState(undefined);
    const [campoRequeridoTipo, setcampoRequeridoTipo] = useState(false);

    const [t, c] = translationHelpers("translation", "common");

    const dataPropiedad = [{ label: "N/A", value: "N/A" }, { label: "Si", value: "Si" }, { label: "No", value: "No" }];

    function handleSubmit(event, errors, values) {
        if (comply == undefined) {
            setcampoRequeridoTipo(true);
            return;
        } else {
            setcampoRequeridoTipo(false);
        }
        event.preventDefault();
        if (errors.length > 0) {
            return;
        }
        if (props.actions == 'new') {
            props.DataInsert({ ...values, comply: comply.value })
        } else if (props.actions === 'edit') {
            props.DataUpdate({ ...values, comply: comply.value, debtorId: props.DataSend.debtorId, itemId: props.DataSend.itemId })
        }
        props.toggle();
    }

    React.useEffect(() => {
        // Read Api Service data     
        var defaultVal = null;
        setcomply(undefined)
        try {
            if (dataPropiedad.length > 0 && props.DataSend.compy !== null && comply === undefined) {
                defaultVal = dataPropiedad.find(x => x.value == props.DataSend.comply);
                if (defaultVal !== undefined) {
                    setcomply(defaultVal);
                }
            }

        }
        catch (err) { }
    }, [props]);

    return (
        <Modal
            size="xl"
            isOpen={props.isOpen}
            toggle={props.toggle}
            centered={true}>
            <div className="modal-header">
                <h5 className="modal-title mt-0">{t("add new policy")}</h5>
                <button
                    type="button"
                    onClick={props.toggle}
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <AvForm autocomplete="off" className="needs-validation" onSubmit={handleSubmit}>
                    <Row>
                        <Col md="6">
                            <div className="mb-3">
                                <Label htmlFor="parameter">{t("Parameters")}</Label>
                                <AvField
                                    className="form-control"
                                    name="parameter"
                                    type="text"
                                    errorMessage={t("Required Field")}
                                    validate={{ required: { value: true } }}
                                    value={props.DataSend ? props.DataSend.parameter : null}
                                    id="parameter" />
                            </div>
                        </Col>
                        <Col md="6">
                            <div className="mb-3">
                                <Label htmlFor="condition">{t("Terms")}</Label>
                                <AvField
                                    className="form-control"
                                    name="condition"
                                    type="text"
                                    errorMessage={t("Required Field")}
                                    validate={{ required: { value: true } }}
                                    value={props.DataSend ? props.DataSend.condition : null}
                                    id="condition" />
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col md="6">
                            <div className="mb-3">
                                <Label htmlFor="comply">{t("Comply")}</Label>
                                <Select noOptionsMessage={() => ""} 
                                    onChange={(e) => { setcomply(dataPropiedad.find(x => x.label === e.label)); }}
                                    options={dataPropiedad}
                                    id="comply"
                                    classNamePrefix="select2-selection"
                                    placeholder={t("toselect")}
                                    value={comply}
                                />
                                {campoRequeridoTipo ?
                                    <p className="message-error-parrafo">{t("Required Field")}</p>
                                    : null}
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col md="12">
                            <div className="mb-3">
                                <Label htmlFor="observations">{t("Observations")}</Label>
                                <AvField
                                    className="form-control"
                                    name="observations"
                                    type="textarea"
                                    errorMessage={t("Required Field")}
                                    value={props.DataSend ? props.DataSend.observations : null}
                                    id="observations" />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="12" style={{ textAlign: "right" }}>
                            <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={props.toggle}>
                                <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{c("Cancel")}
                            </Button>
                            <Button color="success" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                                {" "}{c("Save")}
                            </Button>

                        </Col>
                    </Row>
                </AvForm>
            </div>
        </Modal>
    );
};

ModalPolicy.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func,
    onAttach: PropTypes.func
};

export default ModalPolicy;
