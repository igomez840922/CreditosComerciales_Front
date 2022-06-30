import React, { useState } from "react"
import PropTypes from 'prop-types';
import { useTranslation } from "react-i18next";

import {
  Button,
  Modal,
}
  from "reactstrap"

import QuoterForm from "./old.QuoterForm";

const ModalQuoterForm = props => {
  const { t, i18n } = useTranslation();
  React.useEffect(() => {

  }, []);

  return (
    <React.Fragment key="mcf1">
    <Modal
      size="xl"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <div className="modal-header">
        <h5 className="modal-title mt-0">{t("Quoter")}</h5>
        <button
          type="button"
          onClick={props.toggle}
          className="close"
          data-dismiss="modal"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div key="ClientForm" className="modal-body" style={{ minHeight: '500px' }}>

      <QuoterForm onCancel={props.onCancel}></QuoterForm>
            
      </div>
    </Modal>
</React.Fragment>
  );
};

ModalQuoterForm.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onCancel:PropTypes.func,
}

export default ModalQuoterForm;
