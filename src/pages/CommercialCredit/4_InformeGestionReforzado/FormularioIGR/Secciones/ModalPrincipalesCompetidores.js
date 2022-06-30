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
const ModalPrincipalesCompetidores = (props) => {
  const { t, i18n } = useTranslation();
  // Submitimos formulario para busqueda de clientes
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    props.dataManagament(values, props.tipo);
  }
  return (
    <Modal
      size="md"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
      <div className="modal-header">
        <h5 className="modal-title mt-0">{t("CompetitorInfo")}</h5>
        <button
          type="button"
          onClick={props.toggle}
          data-dismiss="modal"
          className="close"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">

                  <Row>
                    <Col md="12">
                      <div className="mb-3">
                        <Label htmlFor="name">{t("FullName")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="name"
                          value={props.jsonCompetidores.name}
                          id="name"
                          errorMessage={t("Required Field")}
                          validate={{ required: { value: true } }}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <div className="mb-3">
                        <Label htmlFor="specialTradingConditions">{t("Description")}</Label>
                        <AvField
                          type="textarea"
                          name="description"
                          value={props.jsonCompetidores.description}
                          id="description"
                          maxLength="1000"
                          rows="7"
                        />
                      </div>
                    </Col>
                  </Row>
       
      </div>
      <div className="modal-footer">
        <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={props.toggle}>
          <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
        </Button>
        {props.botones ?
                    <Button id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}>
                      <i className="mdi mdi-content-save mdi-12px"></i>
                      {" "} {props.tipo == "guardar" ? t("Save") : t("Save")}
                    </Button>
                    : null}
      </div>
      </AvForm>
    </Modal>
  );
};
ModalPrincipalesCompetidores.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};
export default ModalPrincipalesCompetidores;
