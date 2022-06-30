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
    Table,
} from "reactstrap"
import { Select } from 'antd';
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { Link, useHistory } from "react-router-dom";
const ModalInstructivo = (props) => {
    const { Option } = Select;
    const history = useHistory();
    const [datoSeleccionado, setdatoSeleccionado] = useState(null)
    const { t, i18n } = useTranslation();
    // const jsonPrioridad = [
    //     { value: "1", label: "Muy Urgente" },
    //     { value: "2", label: "Urgencia Moderada" },
    //     { value: "3", label: "Importante" },
    //     { value: "4", label: "Baja Urgencia" },
    //     { value: "5", label: " Sin Urgencia" }]
    useEffect(() => {
        // setdatoSeleccionado(jsonPrioridad[0])
    }, [])
    function handleSubmit(event, errors, values) {
        event.preventDefault();
        if (errors.length > 0) {
            return;
        }
        props.actuaizarDocumentacion(values)
    }
    return (
        <Modal
            size="xl"
            isOpen={props.isOpen}
            toggle={props.toggle}
            centered={true}>
            <div className="modal-header">
                <h5 className="modal-title mt-0">{"Buscar Desembolso"}</h5>
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

                                        <Col md="5">
                                            <div className="mb-3">
                                                <Label>{t("Tramit number")}</Label>
                                                <AvField
                                                    className="form-control"
                                                    type="text"
                                                    name="PartyId"
                                                    validate={{ required: { value: true, errorMessage: t("Required Field") } }}
                                                />
                                            </div>
                                        </Col>
                                        <Col md="4" style={{ textAlign: "left" }}>
                                            <div className="mb-3">
                                                <Label>&nbsp;</Label><br></br>
                                                <Button color="success" type="submit"><i className="mdi mdi-file-find mdi-12px"></i> {t("Search")}</Button>
                                            </div>

                                        </Col>

                                        <Col md="3" style={{ textAlign: "right" }}>
                                            <div className="mb-3">
                                                <Label>&nbsp;</Label><br></br>
                                                <Button color="primary" type="button" onClick={() => { }}><i className="mdi fa-plus-circle mdi-12px"></i> {t("Nuevo Desembolso")}</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Table className="table table-striped table-hover styled-table table" >
                                            <thead>
                                                <tr>
                                                    <th><strong>{t("Tramit number")}</strong></th>
                                                    <th><strong># {t("Process")}</strong></th>
                                                    <th><strong>{t("FacilityType")}</strong></th>
                                                    <th><strong>{t("Client")}</strong></th>
                                                    <th><strong>{t("Status")}</strong></th>
                                                    <th><strong>{t("Actions")}</strong></th>
                                                </tr>
                                            </thead>
                                            <tr>
                                                <th>4128</th>
                                                <th>154900</th>
                                                <th>Prestamo comercial</th>
                                                <th>Soaint Client</th>
                                                <th>En proceso</th>
                                                <th>
                                                    <Link to="#" title={t("View")} onClick={() => {
                                                        history.push({
                                                            pathname: '/InstructivoDesembolsoNew',
                                                            data: { transactId: 4128 },
                                                        });
                                                    }}><i className="mdi mdi-circle-edit-outline mdi-24px"></i></Link></th>
                                            </tr>
                                            <tbody>
                                            </tbody>
                                        </Table>
                                    </Row>
                                </CardBody>
                                <CardFooter style={{ textAlign: "right" }}>
                                    <Button id="btnNew" color="danger" type="button" style={{ margin: '5px' }} onClick={props.toggle} data-dismiss="modal">
                                        <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
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


export default ModalInstructivo;
