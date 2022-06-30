import React, { useState } from "react"
import { withTranslation } from "react-i18next"
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
} from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"
import { translationHelpers } from "../../helpers";

const ModalEndProcess = (props) => {
  const [t, c] = translationHelpers('translation', 'common');

  // Submitimos formulario para busqueda de clientes
  function handleSubmitEndProcess(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }

    props.toggle();

    props.onSaveEndProcess(values);
  }

  return (
    <Modal
      size="xl"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <div className="modal-header">
        <h5 className="modal-title mt-0">{props.t("EndProcess")}</h5>
        <button
          type="button"
          onClick={props.toggle}
          className="close"
          data-dismiss="modal"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <AvForm id="frmEndProcess" className="needs-validation" onSubmit={handleSubmitEndProcess}>
        <div className="modal-body">
          <Row>
            <Col md="12">
              <div className="mb-3">
                <Label htmlFor="txtComment">{props.t("Comment")}</Label>
                <AvField
                  className="form-control"
                  name="txtComment"
                  type="textarea"
                  rows={7}
                  validate={{
                    required: { value: true, errorMessage: props.t("Required Field") }
                  }}
                />
              </div>
            </Col>
          </Row>


        </div>
        <div className="modal-footer">
          <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { props.toggle() }}>
            <i className="mdi mdi-cancel mid-12px"></i> {t("Cancel")}
          </Button>


          <Button color="success" type="submit" style={{ margin: '5px' }}>
            <i className="mdi mdi-content-save  mid-12px"></i> {t("accept")}
          </Button>
        </div>
      </AvForm>

    </Modal>
  );
};

ModalEndProcess.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onSaveEndProcess: PropTypes.func,
};

export default (withTranslation()(ModalEndProcess));
