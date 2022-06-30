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
import Currency from "../../../helpers/currency";


const ModalAnalisisCredito = (props) => {
  const { t, i18n } = useTranslation();
  const currencyData = new Currency();

  // Submitimos formulario para busqueda de clientes
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }

    values.presentYear = currencyData.getRealValue(values.presentYear);
    values.year1 = currencyData.getRealValue(values.year1);
    values.year2 = currencyData.getRealValue(values.year2);
    values.year3 = currencyData.getRealValue(values.year3);
    values.year4 = currencyData.getRealValue(values.year4);
    props.dataManagement(values)
  }


  return (
    <Modal
      size="xl"
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
            <AvForm id="frmSearch" autocomplete="off" className="needs-validation" onSubmit={handleSubmit}>
              <Card>
                <CardBody>
                  <Row>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="itemActive">{t("Description")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="itemActive"
                          validate={{
                            required: { value: true, errorMessage: t("Required") },
                          }}
                          value={props.tipo == "BalanceActivo" || props.tipo == "EBalanceActivo" ? props.dataSet.itemActive : (props.tipo == "BalancePasivo" || props.tipo == "EBalancePasivo" ? props.dataSet.itemPassive : (props.tipo == "OrigenAplicacionn" || props.tipo == "EOrigenAplicacionn" ? props.dataSet.sourceApplicationItem : props.dataSet.itemIndicators))}
                          id="itemActive"
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="presentYear">{t("CurrentYear")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="presentYear"
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          value={currencyData.format(props.tipo == "BalanceActivo" || props.tipo == "EBalanceActivo" ? props.dataSet?.presentYear ?? 0 : props.dataSet?.presentYear ?? 0)}
                          id="presentYear"
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="year1">1 {t("YearAgo")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="year1"
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          value={currencyData.format(props.tipo == "BalanceActivo" || props.tipo == "EBalanceActivo" ? props.dataSet?.year1 ?? 0 : props.dataSet?.year1 ?? 0)}
                          id="year1"
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="year2">2 {t("YearAgo")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="year2"
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          value={currencyData.format(props.tipo == "BalanceActivo" || props.tipo == "EBalanceActivo" ? props.dataSet?.year2 ?? 0 : props.dataSet?.year2 ?? 0)}
                          id="year2"
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="year3">3 {t("YearAgo")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="year3"
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          value={currencyData.format(props.tipo == "BalanceActivo" || props.tipo == "EBalanceActivo" ? props.dataSet?.year3 ?? 0 : props.dataSet?.year3 ?? 0)}
                          id="year3"
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="year4">4 {t("YearAgo")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="year4"
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          value={currencyData.format(props.tipo == "BalanceActivo" || props.tipo == "EBalanceActivo" ? props.dataSet?.year4 ?? 0 : props.dataSet?.year4 ?? 0)}
                          id="year4"
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
                      {/* {" "} {props.tipo == "BalanceActivo" || props.tipo == "BalancePasivo" || props.tipo == "OrigenAplicacionn" || props.tipo == "indicadores" ? t("Save") : t("Edit")} */}
                      {t("Save")}
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

ModalAnalisisCredito.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func
};

export default ModalAnalisisCredito;
