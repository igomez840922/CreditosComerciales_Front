import PropTypes from 'prop-types';
import { withTranslation } from "react-i18next"
import {
  Row,
  Col,
  Label,
} from "reactstrap"
import { AvForm, AvField } from "availity-reactstrap-validation"
const FormObservaciones = (props) => {
  const { selectedData } = props;
  //On change Inputs
  function handleChangeInputfrmSearch(e) {
    selectedData[e.target.name] = e.target.value;
    props.updateDataModel(selectedData);
  }
  return (
    <AvForm id="frmObservation" className="needs-validation">
      <Row>
        <Col md="12">
          <div className="mb-3">
            <Label htmlFor="observationsSearchDiscard">{props.t("Observation")}</Label>
            <AvField
              className="form-control"
              name="observationsSearchDiscard" rows={7}
              type="textarea" onChange={handleChangeInputfrmSearch}
              value={selectedData !== undefined ? selectedData.observationsSearchDiscard : ''}
            />
          </div>
        </Col>
      </Row>
    </AvForm>
  );
}
FormObservaciones.propTypes = {
  updateDataModel: PropTypes.func,
  selectedData: PropTypes.any,
}
export default (withTranslation()(FormObservaciones));
