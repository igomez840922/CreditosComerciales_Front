import React, { useState } from "react"
import { withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
import * as OPTs from "../../../../helpers/options_helper"
import {
  Button,
  Modal,
} from "reactstrap"
const ModalAdvanceOptions = (props) => {
  return (
    <Modal
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <div className="modal-header">
        <h5 className="modal-title mt-0">{props.t("Advance")}</h5>
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
        <h5 className="font-size-16">{props.t("PleaseSelectOption")}</h5>
      </div>
      <div className="modal-footer">
        <Button color="negative" type="button" style={{ margin: '5px' }} onClick={() => { props.toggle(); props.onSaveProcess(OPTs.OPT_ENVIARCUMPLIMIENTO) }} data-dismiss="modal">
          <i className="mdi mdi-arrow-left-bold-circle-outline mid-12px"></i> {props.t("Compliance")}
        </Button>
        <Button color="success" type="button" onClick={() => { props.toggle(); props.onSaveProcess(OPTs.OPT_LISTAEXCLUSION) }} data-dismiss="modal">
          <i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {props.t("Continue")}
        </Button>
      </div>
    </Modal>
  );
};
ModalAdvanceOptions.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onSaveProcess: PropTypes.func,
};
export default (withTranslation()(ModalAdvanceOptions));