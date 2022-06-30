import PropTypes from 'prop-types';
import { translationHelpers } from '../../../helpers/translation-helper';
import AttachmentList from '../../Attachments/AttachmentList';


import {
  Table,
  Card,
  CardBody,
  Row,
  Col
} from "reactstrap"

import AttachmentFileCore from '../../Common/AttachmentFileCore';
import { AttachmentFileInputModel } from "../../../models/Common/AttachmentFileInputModel"
import * as OPTs from "../../../helpers/options_helper"
import React, { useEffect, useState } from "react"
import { useLocation, useHistory } from 'react-router-dom'
import * as url from "../../../helpers/url_helper"


const FinancialStatus = (props) => {

  const [t, c] = translationHelpers('commercial_credit', 'common');

  const { client, data } = props;

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

  if (!data.items) {
    return null;
  }

  return (
    <Col lg="12">
      {/* <AttachmentList editMode={true} /> */}
      <AttachmentFileCore attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.PROCESS_PROPUESTACREDITO, OPTs.ACT_PROPUESTACREDITO)} />
    </Col>
  );
};

FinancialStatus.propTypes = {
  client: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};


export default FinancialStatus;
