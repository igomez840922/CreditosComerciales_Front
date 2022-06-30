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

import checkNumber from "../../../../helpers/checkNumber";

const ModalFideicomitente = (props) => {
  const { t, i18n } = useTranslation();

  // Submitimos formulario para busqueda de clientes
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    props.gestionDatos(values, props.tipo);
  }


  return (
    <Modal
      size="xl"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <div className="modal-header">
        <h5 className="modal-title mt-0">{props.t("Fideicomitente")}</h5>
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
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="name">{props.t("Name")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="name"
                          value={props.dataSet.name}
                          id="name"
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="address">{props.t("Address")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="address"
                          value={props.dataSet.address}
                          id="address"
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="email">{props.t("Email")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="email"
                          value={props.dataSet.email}
                          id="email"
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="telephone">{props.t("Phone")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          onKeyPress={(e) => { return checkNumber(e) }}
                          name="telephone"
                          value={props.dataSet.telephone}
                          id="telephone"
                        />
                      </div>
                    </Col>
                  </Row>

                </CardBody>
                <CardFooter style={{ textAlign: "right" }}>

                  <Button id="btnNew" color="danger" type="button" style={{ margin: '5px' }} onClick={props.toggle} data-dismiss="modal">
                    <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{props.t("Cancel")}
                  </Button>
                  {props.botones ?
                    <Button id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                      {" "} {props.tipo == "guardar" ? t("Save") : t("Edit")}
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

ModalFideicomitente.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func
};

export default (withTranslation()(ModalFideicomitente));
