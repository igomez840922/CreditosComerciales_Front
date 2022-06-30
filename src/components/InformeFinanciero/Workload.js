import PropTypes from 'prop-types';
import { translationHelper } from '../../helpers';

import {
  Table,
  Card,
  CardBody,
  Row,
  Col,
} from "reactstrap"

import AttachmentList from '../Attachments/AttachmentList';
import HeaderSections from '../Common/HeaderSections';

import { AttachmentFileInputModel } from "../../models/Common/AttachmentFileInputModel"
import * as OPTs from "../../helpers/options_helper"
import React, { useEffect, useState } from "react"
import { useLocation, useHistory } from 'react-router-dom'
import * as url from "../../helpers/url_helper"
import AttachmentFileCore from '../Common/AttachmentFileCore';

const Workload = (props) => {

  const t = translationHelper('financial_report');

  function handleNewAttachment(attachment) {

  }

  const history = useHistory();
  const location = useLocation();

  const [locationData, setLocationData] = useState(location.data ?? JSON.parse(sessionStorage.getItem('locationData')));

  let dataSession;
  useEffect(() => {
    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
        //location.data.transactionId = 0;
        //checkAndCreateProcedure(location.data);
        history.push(url.URL_DASHBOARD);
      }
      else {
        sessionStorage.setItem('locationData', JSON.stringify(location.data));
        dataSession = location.data
        setLocationData(location.data);
      }
    }
    else {
      //chequeamos si tenemos guardado en session
      var result = sessionStorage.getItem('locationData');
      if (result !== undefined && result !== null) {
        result = JSON.parse(result);
        dataSession = result
        setLocationData(result);
      }
    }

  }, []);

  return (
    <>
      <HeaderSections title="Workload.Title" descri="Workload.Subtitle" t={t}></HeaderSections>
      <Row className="">
        <Col lg="12">
          {/* <AttachmentList preview={props.preview} editMode={true} attachments={props.attachments} onAttach={handleNewAttachment} /> */}
          <AttachmentFileCore preview={props.preview} attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.PROCESS_INFORMEFINANCIERO, OPTs.ACT_INFORMEFINANCIERO_2)} />
        </Col>
      </Row>
    </>
  );
};

Workload.propTypes = {
};

Workload.defaultProps = {
};

export default Workload;
