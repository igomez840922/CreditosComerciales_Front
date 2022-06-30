import React from "react"
import PropTypes from 'prop-types';
import { translationHelpers } from "../../helpers";

import {
  Row,
  Col,
  Button,
  Label,
  Input,
  Modal,
} from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"


const ModalAttachments = (props) => {

  const [t, c] = translationHelpers("translation", "common");

  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    props.toggle();
    props.onAttach(values);
  }


  return (
    <Modal
      size="xl"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <div className="modal-header">
        <h5 className="modal-title mt-0">{t("Attach")}</h5>
        <button
          type="button"
          onClick={props.toggle}
          className="close"
          data-dismiss="modal"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <AvForm className="needs-validation" onSubmit={handleSubmit}>
          <Row>
            <Col md="6">
              <div className="mb-3">
                <Label htmlFor="validationAttchFileName">{t("File Name")}</Label>
                <AvField
                  className="form-control"
                  name="filename"
                  type="text"
                  errorMessage={t("Required Field")}
                  validate={{ required: { value: true } }}
                  id="validationAttchFileName" />
              </div>
            </Col>
            <Col md="6">
              <div className="mb-3">
                <Label htmlFor="validationAttchFile">{t("Browse Files")}</Label>
                <Input type="file" className="form-control" id="validationAttchFile"
                  errorMessage={t("Required Field")}
                  validate={{ required: { value: true } }} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <div className="mb-3">
                <Label htmlFor="validationAttchDetail">{t("Details")}</Label>
                <AvField
                  className="form-control"
                  name="details"
                  type="text"
                  id="validationAttchDetail" />
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg="12" style={{ textAlign: "right" }}>
              <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={props.toggle}>
                <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{c("Cancel")}
              </Button>
              <Button color="success" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                {" "}{c("Save")}
              </Button>

            </Col>
          </Row>
        </AvForm>
      </div>
    </Modal>
  );
};

ModalAttachments.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onAttach: PropTypes.func
};

export default ModalAttachments;
