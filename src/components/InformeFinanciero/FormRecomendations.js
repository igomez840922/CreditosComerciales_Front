import PropTypes from 'prop-types';
import { translationHelpers } from '../../helpers';

import {
  Table,
  Card,
  CardBody,
  Row,
  Col,
  Label
} from "reactstrap"

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import HeaderSections from '../Common/HeaderSections';


const FormCreditRisk = (props) => {
  const [t, c, tr] = translationHelpers('financial_report', 'common', 'translation');

  const noData = {
    minHeig: '50px',
    // border: '1px solid #bbb',
    borderRadius: '4px',
    padding: '12px',
    marginBottom: '20px',
    textAlign: 'justify',
  }
  return (
    <>
      <HeaderSections title="Conclusions" t={t}></HeaderSections>

      <Row>
        <Col md="12">
          <Label htmlFor="strengths">{t("Strengths")}</Label>
          {!props.preview && <AvGroup className="mb-3">
            <AvField
              className="form-control"
              name="strengths"
              type="textarea"
              id="strengths"
              value={props.strengths ?? ''}
              rows="8" />
          </AvGroup>}
          {props.preview &&
            <div style={noData}>
              {props.strengths ?? <h5>{tr("NoData")}</h5>}
            </div>
          }
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <Label htmlFor="weakness">{t("Weakness")}</Label>
          {!props.preview && <AvGroup className="mb-3">
            <AvField
              className="form-control"
              name="weakness"
              type="textarea"
              id="weakness"
              value={props.weakness ?? ''}
              rows="8" />
          </AvGroup>}
          {props.preview &&
            <div style={noData}>
              {props.weakness ?? <h5>{tr("NoData")}</h5>}
            </div>
          }
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <Label htmlFor="conclusion">{t("Recommendations")}</Label>
          {!props.preview && <AvGroup className="mb-3">
            <AvField
              className="form-control"
              name="conclusion"
              type="textarea"
              id="conclusion"
              value={props.conclusion ?? ''}
              rows="8" />
          </AvGroup>}
          {props.preview &&
            <div style={noData}>
              {props.conclusion ?? <h5>{tr("NoData")}</h5>}
            </div>
          }
        </Col>
      </Row>
    </>
  );
};

FormCreditRisk.propTypes = {
};

FormCreditRisk.defaultProps = {
};

export default FormCreditRisk;
