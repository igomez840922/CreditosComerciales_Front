import React, { useState } from "react"
import PropTypes from 'prop-types';
import { useTranslation } from "react-i18next";

import {
  Button,
  Modal,
}
  from "reactstrap"

import ClientForm from "./ClientForm";

const ModalSearchClient = props => {
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
        <h5 className="modal-title mt-0">{t("Client")}</h5>
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

      <ClientForm transactId={props.transactId} clientSelected={props.clientSelected} onCancel={props.onCancel} checkDebtorShareholders={props.checkDebtorShareholders}></ClientForm>
            
      </div>
    </Modal>
</React.Fragment>
  );
};

ModalSearchClient.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onCancel:PropTypes.func,
  transactId: PropTypes.any,
  clientSelected: PropTypes.func, 
  checkDebtorShareholders: PropTypes.func
}

export default ModalSearchClient;
