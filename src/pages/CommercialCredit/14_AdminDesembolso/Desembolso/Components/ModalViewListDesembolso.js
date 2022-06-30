import PropTypes from 'prop-types'
import {
    Modal,
    ModalHeader,
    ModalBody,
    Label,
    Row,
    Col,
    Button,
    Card,
    CardBody,
    CardHeader
} from "reactstrap"
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
const ModalListaDesembolso = (props) => {
    const { t, i18n } = useTranslation();
    function handleCancel() {
        props.toggle();
    }
    React.useEffect(() => {
        // Read Api Service data
        console.log(props.dataSet);
    }, [props]);
    return (
        <Modal isOpen={props.isOpen}
            toggle={props.toggle}
            centered={true}
            size="xl">
            <ModalHeader toggle={props.toggle} color="primary">
                <h4 className="card-title title-header">{props.usuarioProspecto != null ? props.usuarioProspecto.name + " " + props.usuarioProspecto.name2 + " " + props.usuarioProspecto.lastName + " " + props.usuarioProspecto.lastName2 : ""}</h4>
                {/* <h4 className="card-title">{t("Facility List")}</h4> */}
            </ModalHeader>
            <ModalBody>
                <Card>
                    <CardHeader>
                        <h5>Datos de la facilidad</h5>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md="3">
                                <strong>{t("Facility")} {t(" ")} {t("Number")}</strong>
                            </Col>
                            <Col md="3">
                                <Label>{props.dataSet.facilityId}</Label>
                            </Col>
                            <Col md="3">
                                <strong>{t("CR")}</strong>
                            </Col>
                            <Col md="3">
                                <Label>{props.dataSet.cr}</Label>
                            </Col>
                            {/*     */}
                            <Col md="3">
                                <strong>{t("Amount")}</strong>
                            </Col>
                            <Col md="3">
                                <Label>{props.dataSet.amount}</Label>
                            </Col>
                            <Col md="3">
                                <strong>{t("Debtors")}</strong>
                            </Col>
                            <Col md="3">
                                <Label>{props.dataSet.debtor}</Label>
                            </Col>
                            {/*     */}
                            <Col md="3">
                                <strong>{t("Balance")}</strong>
                            </Col>
                            <Col md="3">
                                <Label>{props.dataSet.balance}</Label>
                            </Col>
                            <Col md="3">
                                <strong>{t("Proposal Type")}</strong>
                            </Col>
                            <Col md="3">
                                <Label>{props.dataSet.proposedType}</Label>
                            </Col>
                            {/*     */}
                            <Col md="3">
                                <strong>{t("SubProposal Type")}</strong>
                            </Col>
                            <Col md="3">
                                <Label>{props.dataSet.subproposalType}</Label>
                            </Col>
                            <Col md="3">
                                <strong>{t("Facility Type")}</strong>
                            </Col>
                            <Col md="3">
                                <Label>{props.dataSet.facilityType}</Label>
                            </Col>
                            {/*     */}
                        </Row>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <h5>Lista de desembolsos</h5>
                    </CardHeader>
                    <CardBody>
                        Aqui la lista
                    </CardBody>
                </Card>
                <Row className="my-2">
                    <Col xl="12 text-end">
                        <Button id="btnCancel" color="danger" type="button" style={{ margin: '5px' }} onClick={handleCancel}>
                            {t("Cancel")}
                        </Button>
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    )
};
ModalListaDesembolso.propTypes = {
    toggle: PropTypes.func,
    isOpen: PropTypes.bool
};
export default ModalListaDesembolso;
