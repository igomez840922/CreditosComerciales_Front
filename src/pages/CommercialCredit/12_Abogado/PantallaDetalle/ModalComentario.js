import React, { useEffect, useState } from "react"
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
    InputGroup,
} from "reactstrap"
import { Select } from 'antd';
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
const ModalComentarioDocumentacion = (props) => {
    const { Option } = Select;
    const [datoSeleccionado, setdatoSeleccionado] = useState("")
    const { t, i18n } = useTranslation();
    const [jsonPrioridad, setJsonPrioridad] = useState()
    useEffect(() => {
        // setdatoSeleccionado(jsonPrioridad[0])
        load()
    }, [])
    async function load() {
        let catalogue = await this.backendServices.getCreditRiskOpinionCatalog();
        let jsonPrioridad = (catalogue?.map(creditRiskOpinion => ({ value: creditRiskOpinion.id, label: creditRiskOpinion.description })))
        setJsonPrioridad(jsonPrioridad)
    }
    function handleSubmit(event, errors, values) {
        event.preventDefault();
        if (errors.length > 0) {
            return;
        }
        props.actuaizarDocumentacion(values)
    }
    return (
        <Modal
            size="md"
            isOpen={props.isOpen}
            toggle={props.toggle}
            centered={true}>
            <div className="modal-header">
                <h5 className="modal-title mt-0">{"Comentario adicional para el documento"}</h5>
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
                        <AvForm id="frmSearch" autocomplete="off" className="needs-validation" onSubmit={handleSubmit}>
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col md="12">
                                            <div className="mb-3">
                                                <Label htmlFor="itemActive">{t("Comentario")}</Label>
                                                <AvField
                                                    className="form-control"
                                                    name="comments"
                                                    type="textarea"
                                                    placeholder="Esperando su comentario..."
                                                    value={props.dataSet?.comments ?? ''}
                                                    rows="7"
                                                    id="comments"
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter style={{ textAlign: "right" }}>
                                    <Button id="btnNew" color="danger" type="button" style={{ margin: '5px' }} onClick={props.toggle} data-dismiss="modal">
                                        <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
                                    </Button>
                                    <Button id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                                        {t("Save")}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </AvForm>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};

ModalComentarioDocumentacion.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func
};

export default ModalComentarioDocumentacion;
