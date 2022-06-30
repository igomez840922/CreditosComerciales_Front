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
const ModalMatrizCompetitiva = (props) => {
  const currencyData = new Currency();
  const { t, i18n } = useTranslation();
  // Submitimos formulario para busqueda de clientes
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    values.matrixType = {
      "code": values.description,
      "name": values.description
    }
    let datos = {
      matrixType: {
        "code": values.description,
        "name": values.description
      },
      quantity: Number(currencyData.getRealValue(values?.quantity??0)),
      transactId: 0
    }
    if (props.tipo == "RENTABILIDAD") {
      props.dataManagament(datos, props.tipo);
    } else {
      datos.profitabilityId = props.jsonSow.profitabilityId;
      datos.status = true;
      props.updateDataManagament(datos, props.tipo);
    }
  }
  return (
    <Modal
      size="md"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <div className="modal-header">
        <h5 className="modal-title mt-0">{t("ProfitabilityMatrix")}</h5>
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
                          name="description"
                          id="description"
                          type="textarea"
                          rows="4"
                          validate={{
                            required: { value: true, errorMessage: t("Required Field") },
                          }}
                          value={props.tipo == "RENTABILIDAD" || props.tipo == "ERENTABILIDAD" ? props.jsonSow.matrixType.code : ""}

                        />
                      </div>
                    </Col>
                    <Col md="12">
                      <div className="mb-3">
                        <Label htmlFor="quantity">{t("Amount")}</Label>
                        <AvField
                          className="form-control"
                          name="quantity"
                          id="quantity"
                          type="text"
                          value={props.tipo == "RENTABILIDAD" || props.tipo == "ERENTABILIDAD" ? currencyData.format(props?.jsonSow?.quantity ?? 0) : ""}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
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
                      {" "} {props.tipo == "RENTABILIDAD" ? t("Save") : t("Save")}
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
ModalMatrizCompetitiva.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func
};
export default ModalMatrizCompetitiva;
