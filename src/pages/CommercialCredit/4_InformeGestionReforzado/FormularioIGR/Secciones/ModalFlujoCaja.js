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
  InputGroup,
} from "reactstrap"
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import Currency from "../../../../../helpers/currency";
const ModalFlujoCaja = (props) => {
  const { t, i18n } = useTranslation();
  const currencyData = new Currency();
  // Submitimos formulario para busqueda de clientes
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }

    if (props.tipo == "DINERO") {
      props.saveData(values, props.tipo);
    }
    if (props.tipo == "EDINERO") {
      values.cashFlowDolarId = props.jsonSow.cashFlowDolarId;
      values.status = true;
      props.updateData(values, props.tipo);
    }
    if (props.tipo == "DEUDAS") {
      props.saveData(values, props.tipo);
    }
    if (props.tipo == "EDEUDAS") {
      values.cashFlowDebtServiceId = props.jsonSow.cashFlowDebtServiceId;
      values.status = true;
      props.updateData(values, props.tipo);
    }
    if (props.tipo == "INGREFACTURA") {
      values.cashFlowInvoiceId = props.jsonSow.cashFlowInvoiceId;
      values.status = true;
      props.saveData(values, props.tipo);
    }
    if (props.tipo == "EINGREFACTURA") {
      values.cashFlowInvoiceId = props.jsonSow.cashFlowInvoiceId;
      values.status = true;
      props.updateData(values, props.tipo);
    }
    if (props.tipo == "ECOBRANZA") {
      values.cashFlowCollectiond = props.jsonSow.cashFlowCollectiond;
      values.status = true;
      props.updateData(values, props.tipo);
    }
    if (props.tipo == "COBRANZA") {
      values.cashFlowCollectiond = props.jsonSow.cashFlowCollectiond;
      values.status = true;
      props.saveData(values, props.tipo);
    }
    if (props.tipo == "EEGRESO") {
      values.cashFlowOutcomeId = props.jsonSow.cashFlowOutcomeId;
      values.februray = values.february;
      values.status = true;
      props.updateData(values, props.tipo);
    }
    if (props.tipo == "EGRESO") {
      values.cashFlowOutcomeId = props.jsonSow.cashFlowOutcomeId;
      values.februray = values.february;
      values.status = true;
      props.saveData(values, props.tipo);
    }
  }
  return (
    <Modal
      size="lg"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <div className="modal-header">

        <h5 className="modal-title mt-0">{props.titulo}</h5>
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
                    <Col md="12">
                      <div className="mb-3">
                        <Label htmlFor="description">{t("Description")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="description"
                          validate={{
                            required: { value: true, errorMessage: t("Required Field") },
                          }}
                          value={props.jsonSow.description}
                          id="description"
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="january">{t("January")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="january"
                          value={props.jsonSow.january > 0 ? currencyData.format(props?.jsonSow?.january ?? 0) + "" : ""}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          id="january"
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="february">{t("February")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="february"
                          value={props.jsonSow.february > 0 ? currencyData.format(props?.jsonSow?.february ?? 0) + "" : ""}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          id="february"
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="march">{t("March")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="march"
                          value={props.jsonSow.march > 0 ? currencyData.format(props?.jsonSow?.march ?? 0) + "" : ""}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          id="march"
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="april">{t("April")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="april"
                          value={props.jsonSow.april > 0 ? currencyData.format(props?.jsonSow?.april ?? 0) + "" : ""}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          id="april"
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="may">{t("May")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="may"
                          value={props.jsonSow.may > 0 ? currencyData.format(props?.jsonSow?.may ?? 0) + "" : ""}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          id="may"
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="june">{t("June")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="june"
                          value={props.jsonSow.june > 0 ? currencyData.format(props?.jsonSow?.june ?? 0) + "" : ""}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          id="june"
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="july">{t("July")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="july"
                          value={props.jsonSow.july > 0 ? currencyData.format(props?.jsonSow?.july ?? 0) + "" : ""}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          id="july"
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="august">{t("August")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="august"
                          value={props.jsonSow.august > 0 ? currencyData.format(props?.jsonSow?.august ?? 0) + "" : ""}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          id="august"
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="september">{t("September")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="september"
                          value={props.jsonSow.september > 0 ? currencyData.format(props?.jsonSow?.september ?? 0) + "" : ""}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          id="september"
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="october">{t("October")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="october"
                          value={props.jsonSow.october > 0 ? currencyData.format(props?.jsonSow?.october ?? 0) + "" : ""}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          id="october"
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="november">{t("November")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="november"
                          value={props.jsonSow.november > 0 ? currencyData.format(props?.jsonSow?.november ?? 0) + "" : ""}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          id="november"
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="december">{t("December")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="december"
                          value={props.jsonSow.december > 0 ? currencyData.format(props?.jsonSow?.december ?? 0) + "" : ""}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          id="december"
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
                      {" "} {props.tipo == "DINERO" || props.tipo == "DEUDAS" || props.tipo == "INGREFACTURA" || props.tipo == "COBRANZA" || props.tipo == "EGRESO" ? t("Save") : t("Save")}
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

ModalFlujoCaja.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func
};

export default ModalFlujoCaja;
