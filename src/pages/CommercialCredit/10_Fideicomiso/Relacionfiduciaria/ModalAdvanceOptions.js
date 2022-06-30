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
import { BackendServices, CoreServices } from "../../../../services";

import SweetAlert from "react-bootstrap-sweetalert";

const ModalAdvanceOptions = (props) => {

  const apiServiceBackend = new BackendServices();

  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");


  // Submitimos formulario para busqueda de clientes
  async function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }

    let DataG = props.DataGeneral;
    let response = true;
    await apiServiceBackend.guardarSeccionServiciosFiduciario(DataG).then(resp => {
      resp.statusCode != 200 && (response = false);
    });

    DataG.description = DataG.descriptionOtherServiciosFiduciario
    DataG.others = DataG.othersOtherServiciosFiduciario

    await apiServiceBackend.guardarSeccionOtrosServiciosFiduciario(DataG).then(resp => {
      resp.statusCode != 200 && (response = false);
    });

    response && setsuccessSave_dlg(true);
    !response && seterror_dlg(false);
    !response && seterror_msg(props.t("TheProcessCouldNotFinish"))

    //props.onSubmit(values);
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
          <Button color="negative" type="submit" style={{ margin: "5px" }}>
            <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}
            {props.t("Rechazar")}
          </Button>

          <Button color="success" type="submit" style={{ margin: "5px" }}>
            <i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i>{" "}
            {props.t("Guardar")}
          </Button>

          <Button color="success" type="submit" style={{ margin: "5px" }}>
            <i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i>{" "}
            {props.t("GenerateDocument")}
          </Button>
        </div>
      </AvForm>
      {successSave_dlg ? (
        <SweetAlert
          success
          title={props.t("SuccessDialog")}
          confirmButtonText={props.t("Confirm")}
          cancelButtonText={props.t("Cancel")}
          onConfirm={() => {
            setsuccessSave_dlg(false)
            props.toggle();

          }}
        >
          {props.t("SuccessSaveMessage")}
        </SweetAlert>
      ) : null}

      {error_dlg ? (
        <SweetAlert
          error
          title={props.t("ErrorDialog")}
          confirmButtonText={props.t("Confirm")}
          cancelButtonText={props.t("Cancel")}
          onConfirm={() => {
            seterror_dlg(false)
            props.toggle();

          }}
        >
          {error_msg}
        </SweetAlert>
      ) : null}
    </Modal>
  );
};

ModalAdvanceOptions.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onSaveProcess: PropTypes.func,
};

export default withTranslation()(ModalAdvanceOptions);
