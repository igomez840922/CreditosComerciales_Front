import React, { useState } from "react"
import PropTypes from 'prop-types';
import { useTranslation } from "react-i18next";

import {
  Button,
  Modal,
}
  from "reactstrap"

import SearchClientCore from "../../../components/Common/SearchClientCore";

const ModalSearchClient = props => {
  const { t, i18n } = useTranslation();
  React.useEffect(() => {

  }, []);

  return (
    <Modal
      size="xl"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <div className="modal-header">
        <h5 className="modal-title mt-0">{t("SearchClient")}</h5>
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

        <SearchClientCore onClientSelect={props.onClientSelect} onNewClientSelect={props.onNewClientSelect} />
 
      </div>
      <div className="modal-footer">
        <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={props.toggle}>
          <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
        </Button>
      </div>
    </Modal>

  );
};

ModalSearchClient.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onClientSelect: PropTypes.func,
  onOpenNewClient: PropTypes.func,
}

export default ModalSearchClient;
