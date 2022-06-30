import { useState } from 'react';
import PropTypes from 'prop-types';
import { translationHelpers } from '../../helpers';

import {
  Table,
  Card,
  CardBody,
  Row,
  Col,
  Label,
  Button
} from "reactstrap"

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import ModalReportingServices from './ModalReportingServices';
import HeaderSections from '../Common/HeaderSections';


const FormCreditRisk = (props) => {

  const [t, tr] = translationHelpers('financial_report', 'translation');

  const [displayModalReportingServices, setDisplayModalReportingServices] = useState(false);

  function toggleReportingServices() {
    setDisplayModalReportingServices(!displayModalReportingServices);
  }

  const noData = {
    minHeig: '50px',
    // border: '1px solid #bbb',
    borderRadius: '4px',
    padding: '12px',
    textAlign: 'justify',
  }

  return (
    <>
      <HeaderSections title="CreditRiskOpinion" t={t}></HeaderSections>

      {!props.preview && <Row className="mb-3">
        <Col md="12">
          <Button id="btnReportingServices" color="success" type="button"
            className="float-end" style={{ margin: '5px' }}
            onClick={toggleReportingServices}>
            {t("Reporting Services")}
          </Button>
          
        </Col>
      </Row>}
      <Row>
        <Col md="12">
          {!props.preview && <AvGroup className="mb-3">
            <AvField
              className="form-control"
              name="opinion"
              type="textarea"
              id="opinion"
              value={props.Opinion ?? ''}
              rows="8" />
          </AvGroup>}
          {props.preview &&
            <div style={noData}>
              {props.Opinion ?? <h5>{tr("NoData")}</h5>}
            </div>
          }
        </Col>
      </Row>
      {!props.preview && <ModalReportingServices isOpen={displayModalReportingServices} toggle={toggleReportingServices} hasChangeCategory={()=> props.hasChangeCategory()} />}
    </>
  );
};

FormCreditRisk.propTypes = {
  hasChangeCategory: PropTypes.func,
};

FormCreditRisk.defaultProps = {
};

export default FormCreditRisk;
