/*ReinforcedManagementReport = Lista de Informe Reforzado*/
import React, { useState } from "react"
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  Label,
  Table
} from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"

//i18n
import { useTranslation, withTranslation } from "react-i18next"


const Conslusiones = React.forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const [FormValid, setFormValid] = useState(false);

  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('formConclusiones');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return FormValid;
    }
  }))
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    setFormValid(true)
  }

  //Actualizar valores de Cliente cada vez que se actualiza un campo
  function handleChangeInputFormClient(e) {
    //dataTrust[e.target.name] = e.target.value;
    props.onSubmit(e.target.value);
  }
  

  return (
    <React.Fragment>
      <Row>
        <Col lg="12">
          <p className="card-title-desc"></p>
          <h4 className="card-title"></h4>
          <p className="card-title-desc"></p>
          <AvForm id="formConclusiones" className="needs-validation" onSubmit={handleSubmit}>
            <Row>
              <Col md="12">
                <div className="mb-3">
                  <Label htmlFor="conclusiones">{t("Conclusions")}</Label>
                  <AvField
                    className="form-control"
                    name="conclusions"
                    type="textarea" rows={7}
                    value={props.conslusions}
                    onChange={handleChangeInputFormClient} />
                </div>
              </Col>
            </Row>
          </AvForm>
        </Col>
      </Row>
    </React.Fragment>
  );
});
Conslusiones.propTypes = {
  onSubmit: PropTypes.func,
  conslusions:PropTypes.string
}
export default Conslusiones
