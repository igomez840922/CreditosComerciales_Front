import React, { useState } from "react"
import * as OPTs from "../../../../helpers/options_helper"
import PropTypes from 'prop-types';
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next";
import { formatDate } from '../../../../helpers';
import {
  Table,
} from "reactstrap"

import ModalNewAttachment from "./ModalNewCheckListItem";

import CheckListComponent from '../../../../components/Common/CheckList';
import { AttachmentFileInputModel } from "../../../../models/Common/AttachmentFileInputModel"

const CheckList = (props) => {
  const { t, i18n } = useTranslation();
  const {locationData}= props;

  const [displayModal, setDisplayModal] = useState(false);

  
  function toggleModal() {
    setDisplayModal(!displayModal);
  }
  
  return (
    <React.Fragment>      
      {locationData?
        <CheckListComponent attachmentFileInputModel={ new AttachmentFileInputModel(locationData.transactionId,OPTs.CHECKLIST_PROCESS_SOLICITUD,OPTs.ACT_NONE)} />
      :null}  

    </React.Fragment>
  );
};
CheckList.propTypes = {
  locationData: PropTypes.any,
  title:PropTypes.string
};
export default CheckList;
