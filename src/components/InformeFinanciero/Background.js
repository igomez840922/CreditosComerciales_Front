import PropTypes from 'prop-types';
import { translationHelper } from '../../helpers';

import {
  Table,
  Card,
  CardBody,
  Row,
  Col,
} from "reactstrap"


import BackgroundList from './background/BackgroundList';
import FacilityDetails from './background/FacilityDetails';
import AttachmentList from '../Attachments/AttachmentList';
import RestructuringDetails from './background/RestructuringDetails';
import Guarantees from './background/Guarantees';
import HeaderSections from '../Common/HeaderSections';
import React, { useEffect, useState } from "react"
import { useLocation, useHistory } from 'react-router-dom'
import * as url from "../../helpers/url_helper"
import { AttachmentFileInputModel } from "../../models/Common/AttachmentFileInputModel"
import * as OPTs from "../../helpers/options_helper"
import AttachmentFileCore from '../Common/AttachmentFileCore';

const Background = (props) => {

  const t = translationHelper('financial_report');

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


  function handleNewAttachment(attachment) {

  }


  return (
    <>
      {/* <HeaderSections title="Background.Title" t={t}></HeaderSections>
      <Row className="mb-4">
        <Col lg="12">
          <BackgroundList items={props.items} />
        </Col>
      </Row> */}

      <Row className="mb-4">
        <Col lg="12">
          <FacilityDetails preview={props.preview} />
        </Col>
      </Row>

      {/* <Row className="mb-4">
          <Col lg="12">
            <RestructuringDetails headers={ props.restructuring.headers } data={ props.restructuring.data } />
          </Col>
        </Row> */}
      {/* 
        <Row className="mb-4">
          <Col lg="12">
            <Guarantees headers={ props.guarantees.headers } data={ props.guarantees.data } />
          </Col>
        </Row> */}

      <Row className="">
        <Col lg="12">
          {/* <AttachmentList preview={props.preview} editMode={true} attachments={props.attachments} onAttach={handleNewAttachment} /> */}
          <AttachmentFileCore preview={props.preview} attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.PROCESS_INFORMEFINANCIERO, OPTs.ACT_INFORMEFINANCIERO_4)} />
        </Col>
      </Row>
    </>
  );
};

Background.propTypes = {
  items: PropTypes.object,
  facilities: PropTypes.array,
  restructuring: PropTypes.object,
  guarantees: PropTypes.object
};

Background.defaultProps = {
  items: {},
  facilities: [],
  restructuring: {
    headers: [],
    data: []
  },
  guarantees: {
    headers: [],
    data: []
  }
};

export default Background;
