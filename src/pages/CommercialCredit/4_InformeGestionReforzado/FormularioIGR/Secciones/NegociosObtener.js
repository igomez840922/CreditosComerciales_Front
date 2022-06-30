import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Label,
} from "reactstrap"
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
const NegociosObtener = React.forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const [formValid, setFormValid] = useState(false);
  const [dataReturn, setDataReturn] = useState(props.dataNegociosObtener);
  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmNegocioObtener');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }, dataReturn
  }));
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  // Form Submission
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    setFormValid(true)
  }
  return (
    <React.Fragment>
      <h5>
        {t("BusinessObtain")}
      </h5>
      <p className="card-title-desc"></p>
      <AvForm id="frmNegocioObtener" className="needs-validation" onSubmit={handleSubmit}>
        <Row>
          <Col md="12">
            <div className="mb-3">
              <Label htmlFor="description">{t("Description")}</Label>
              <AvField
                type="textarea"
                name="observations"
                id="observations"
                maxLength="1000"
                rows="10"                
                value={props.dataNegociosObtener.observations}
                onChange={(e) => { dataReturn.observations = e.target.value; setDataReturn(dataReturn); }}
              />
            </div>
          </Col>
        </Row>
      </AvForm>
    </React.Fragment>
  );
});
NegociosObtener.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}
export default NegociosObtener;
