import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";

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
} from "reactstrap";

import { AvForm, AvField } from "availity-reactstrap-validation";

const ModalAdvanceOptions = (props) => {
  // Submitimos formulario para busqueda de clientes
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    props.onSaveProcess(4, values);
  }

  return (
    <Modal
      size="xl"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}
    >
      <div className="modal-header">
        <h5 className="modal-title mt-0">{props.t("Continue")}</h5>
        <button
          type="button"
          onClick={props.toggle}
          className="close"
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <AvForm
        id="frmSearch"
        className="needs-validation"
        onSubmit={handleSubmit}
      >
        <div className="modal-body">
          <Row>
            <Col md="12">
              <div className="mb-3">
                <Label htmlFor="companyHistoryDescription">
                  {props.t("Description")}
                </Label>
                <AvField
                  className="form-control"
                  name="modalAdvanceOptionDescription"
                  type="textarea"
                  id="modalAdvanceOptionDescription"
                  rows={7}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: props.t("Required Field"),
                    },
                  }}
                />
              </div>
            </Col>
          </Row>
        </div>
        <div className="modal-footer">
          <Button color="negative" type="submit" onClick={() => { props.onSaveProcess(3) }} style={{ margin: "5px" }}>
            <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}
            {props.t("Rechazar")}
          </Button>

          <Button color="success" type="submit" style={{ margin: "5px" }}>
            <i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i>{" "}
            {props.t("Guardar")}
          </Button>


        </div>
      </AvForm>
    </Modal>
  );
};

ModalAdvanceOptions.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onSaveProcess: PropTypes.func,
};

export default withTranslation()(ModalAdvanceOptions);
