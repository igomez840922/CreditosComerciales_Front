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

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import Currency from "../../../../../helpers/currency";

const ModalCapex2 = (props) => {

  const { t, i18n } = useTranslation();
  const currencyData = new Currency();


  // Submitimos formulario para busqueda de clientes
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }

    values.amount = currencyData.getRealValue(values?.amount ?? 0);
    // values.budget = currencyData.getRealValue(values?.budget ?? 0);
    //console.log(values)

    if (props.tipo == "ECAPEX2") {
      values.capexId = props.dataCapex2.capexId;
      props.UpdateData(values, props.tipo);
    } else {
      props.SaveData(values, props.tipo);
    }
  }


  function check(e) {
    let tecla = (document.all) ? e.keyCode : e.which;
    //Tecla de retroceso para borrar, siempre la permite
    if (tecla == 45) {
      e.preventDefault();
      return true;
    }

    return false;
  }


  return (
    <Modal
      size="md"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <div className="modal-header">
        <h5 className="modal-title mt-0">{t("Budget")}</h5>
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
                        <Label htmlFor="budget">{t("Budget")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="budget"
                          // pattern="^[0-9,.]*$"
                          // onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          // value={currencyData.format(props.dataCapex2.budget ?? 0)}
                          value={props.dataCapex2.budget ?? ''}
                          id="budget"
                        />
                      </div>
                    </Col>
                    <Col md="12">
                      <div className="mb-3">
                        <Label htmlFor="amount">{t("Amount")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="amount"
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          value={currencyData.format(props.dataCapex2.amount ?? 0)}
                          onKeyPress={(e) => { return check(e); }}
                          id="amount"
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
                      {" "} {props.tipo == "CAPEX2" ? t("Save") : t("Save")}
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
ModalCapex2.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func
};
export default ModalCapex2;
