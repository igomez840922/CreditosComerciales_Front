import React, { useState } from "react"
import { withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
import * as OPTs from "../../../helpers/options_helper"

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


const ModalCloseOptions = (props) => {

  return (
    <Modal
      isOpen={ props.isOpen }
      toggle={ props.toggle }
      centered={true}>
      <div className="modal-header">
        <h5 className="modal-title mt-0">{props.t("Exit")}</h5>
        <button
          type="button"
          onClick={ props.toggle }
          className="close"
          data-dismiss="modal"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <h5 className="font-size-16">{props.t("PleaseSelectOption")}</h5>

      </div>
      <div className="modal-footer">
            <Button color="negative" type="button" style={{ margin: '5px' }} onClick={ () => {props.toggle(); props.onSaveProcess(OPTs.OPT_PREFINALIZARPROCESO) } }>
            <i className="mdi mdi mdi-cancel mid-12px"></i> {props.t("FinishProcess")}
              </Button>

              <Button color="success" type="button"  onClick={ () => {props.toggle(); props.onSaveProcess(OPTs.OPT_SALVAPARCIAL) } }>
              <i className="mdi mdi-content-save mid-12px"></i> {props.t("Save")}
              </Button>
      </div>
    </Modal>
  );
};

ModalCloseOptions.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onSaveProcess: PropTypes.func,
};

export default (withTranslation()(ModalCloseOptions));
