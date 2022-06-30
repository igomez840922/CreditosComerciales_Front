import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Label,
} from "reactstrap"
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import SessionHelper from "../../../../../helpers/SessionHelper";

const RecomendacionesOtros = React.forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const [formValid, setFormValid] = useState(false);
  const [dataReturn, setDataReturn] = useState(false);
  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmReomendaciones');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }, dataReturn
  }));
  React.useEffect(() => {
    // Read Api Servi
    setDataReturn(props.dataRecomendacionesOtros)
    // onSaveTemp()
  }, [props.activeTab==27]);

  function onSaveTemp() {
    let instance = new SessionHelper();
    instance.save('prueba', 'test')
  }
  // Form Submission
  function handleSubmit(event, errors, values) {
    //console.log("recomendaciones", values);
    setDataReturn(values)
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    setFormValid(true)
  }
  return (
    <React.Fragment>
      <h5>{t("RecomendationsAndOthers")}</h5>
      <p className="card-title-desc"></p>
      <AvForm
        id="frmReomendaciones"
        className="needs-validation"
        onSubmit={handleSubmit}
      >
        <Row>
          <Col md="12">
            <div className="mb-3">
              <Label htmlFor="recommendations">{t("Recomendations")}</Label>
              <AvField
                type="textarea"
                name="recommendations"
                value={props.dataRecomendacionesOtros.recommendations}
                id="recommendations"
                maxLength="10000000000"
                rows="7"
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <div className="mb-3">
              <Label htmlFor="valueChain">{t("ValueChain")}</Label>
              <AvField
                type="textarea"
                name="valueChain"
                value={props.dataRecomendacionesOtros.valueChain}
                id="valueChain"
                maxLength="10000000000"
                rows="7"
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <div className="mb-3">
              <Label htmlFor="background">{t("Background")}</Label>
              <AvField
                type="textarea"
                name="background"
                value={props.dataRecomendacionesOtros.background}
                id="background"
                maxLength="10000000000"
                rows="7"
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <div className="mb-3">
              <Label htmlFor="refinancingLog">{t("RefinancingLog")}</Label>
              <AvField
                type="textarea"
                name="refinancingLog"
                value={props.dataRecomendacionesOtros.refinancingLog}
                id="refinancingLog"
                maxLength="10000000000"
                rows="7"
              />
            </div>
          </Col>
        </Row>
      </AvForm>
    </React.Fragment>
  );
});
RecomendacionesOtros.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}
export default RecomendacionesOtros;
