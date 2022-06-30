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
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
const ModalNewDisbursementTerm = (props) => {
    const { t, i18n } = useTranslation();
    const [dataReturn, setdataReturn] = useState(null);
    const [requerido, setrequerido] = useState(false);
    React.useEffect(() => {
        setdataReturn(props.dataSet)
    }, [props.isOpen]);
    function handleSubmit() {
        if (dataReturn?.disbursementTypeId == "") {
            setrequerido(true)
            return;
        } else {
            setrequerido(false)
        }
        props.saveData(dataReturn, props.tipo);
        props.toggle();
    }
    function handleCancel() {
        props.toggle();
    }
    return (
        <Modal isOpen={props.isOpen}
            toggle={props.toggle}
            centered={true}
            size="md">
            <ModalHeader toggle={props.toggle} color="primary">{t("Disbursement Type")}</ModalHeader>
            <ModalBody>
                <AvGroup className="mb-3">
                    <Label htmlFor="disbursementTypeId">{t("Disbursement Type")}</Label>
                    <AvField
                        className="form-control"
                        name="disbursementTypeId"
                        type="text"
                        validate={{
                            required: { value: true, errorMessage: t("Required Field") },
                        }}
                        value={dataReturn?.disbursementTypeId}
                        onChange={(e) => { dataReturn.disbursementTypeId = e.target.value; setdataReturn(dataReturn); }}
                        id="disbursementTypeId" />
                    {requerido ?
                        <p className="message-error-parrafo">{t("Required Field")}</p>
                        : null}
                </AvGroup>
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
                <Row className="my-2">
                    <Col xl="12 text-end">
                        <Button id="btnCancel" color="danger" type="button" style={{ margin: '5px' }} onClick={handleCancel}>
                            <i className="mdi mdi-cancel mid-12px"></i> {t("Cancel")}
                        </Button>
                        {props.botones ?
                            <Button id="btnSearch" color="success" type="button" onClick={(e) => { handleSubmit() }} style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                                {" "} {t("Save")}
                            </Button> : null}
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    )
};
ModalNewDisbursementTerm.propTypes = {
    onSave: PropTypes.func.isRequired,
    toggle: PropTypes.func,
    isOpen: PropTypes.bool
};
export default ModalNewDisbursementTerm;