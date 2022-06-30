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
const ModalNegociosCompromisos = (props) => {
  const { t, i18n } = useTranslation();
  // Submitimos formulario para busqueda de clientes
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    values.businessType = {
      "code": "Papeleria",
      "name": ""
    }
    values.businessStatus = "";
    if (props.tipo == "NUEVONEGOCIO") {
      props.dataManagament(values, props.tipo);
    } else {
      values.newBusinessId = props.jsonSow.newBusinessId;
      values.status = true;
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
        <h5 className="modal-title mt-0">{t("NewBusinessesCommitments")}</h5>
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
                        <Label htmlFor="observation">{t("Observation")}</Label>
                        <AvField
                          className="form-control"
                          name="observations"
                          id="observations"
                          type="textarea"
                          rows="4"
                          value={props.tipo == "NUEVONEGOCIO" || props.tipo == "ENUEVONEGOCIO" ? props.jsonSow.observations : ""}
                          errorMessage={t("Required Field")}
                          validate={{ required: { value: true } }}
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
                      {" "} {props.tipo == "NUEVONEGOCIO" ? t("Save") : t("Save")}
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
ModalNegociosCompromisos.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func
};
export default ModalNegociosCompromisos;
