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
import { useLocation } from "react-router-dom";
import { BackendServices } from "../../../../services";
import Select from "react-select";


const ComisioinesFiduciarias = React.forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const location = useLocation()
  const apiBack = new BackendServices();
  const [FormValid, setFormValid] = useState(false);
  const [dataLocation, setData] = useState(location.data);
  const [datoFacilidad, setdatoFacilidad] = useState(null);
  const [dataReturn, setdataReturn] = useState(null);
  const [listaRevision, setlistaRevision] = useState(null);
  const [listaRevisionSelect, setlistaRevisionSelect] = useState(undefined);
  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmInformacionCliente');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return FormValid;
    }, dataReturn
  }))
  React.useEffect(() => {
    // Read Api Service data

    initializeData();
  }, []);
  React.useEffect(() => {
    // Read Api Service data 
    var defaultVal = null;
    setlistaRevisionSelect(undefined);
    try {
      if (listaRevision.length > 0 && props.dataFeduciario.structuring !== null && listaRevisionSelect === undefined) {
        defaultVal = listaRevision.find(x => (x.value).toUpperCase() === (props.dataFeduciario.structuring).toUpperCase());
        if (defaultVal !== undefined) {
          setlistaRevisionSelect(defaultVal);
        }
      }
    }
    catch (err) { }
  }, [props.dataFeduciario, listaRevision]);
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    values.listaRevisionSelect = listaRevisionSelect.value;
    console.log(values);
    setdataReturn(values)
    setFormValid(true)
  }
  function initializeData() {
    apiBack.consultFacilidadPropCred(12, "XYZ892022").then(resp => {
      setdatoFacilidad(resp)
    })
    apiBack.retrieveRevisionType()
      .then(response => {
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response.length; i++) {
          json.push({ label: response[i]["description"], value: response[i]["id"] })
        }
        setlistaRevision(json);
      });
  }
  return (
    <React.Fragment>
      <AvForm id="frmInformacionCliente" className="needs-validation" onSubmit={handleSubmit}>
        <Row>
          <Col lg="12">
            <p className="card-title-desc"></p>
            <h4 className="card-title">{t("TrustCommissions")}</h4>
            <p className="card-title-desc"></p>
            <Row>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="structuring">{t("Structuring")}</Label>
                  <Select noOptionsMessage={() => ""} 
                    onChange={(e) => { setlistaRevisionSelect(listaRevision.find(x => x.value === e.value)); }}
                    options={listaRevision}
                    id="structuring"
                    classNamePrefix="select2-selection"
                    placeholder={t("Select")}
                    value={listaRevisionSelect}
                  />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="facilityType">{t("FacilityType")}</Label>
                  <AvField
                    className="form-control"
                    name="facilityType"
                    type="text"
                    value={props.dataFeduciario.facilityType}
                    id="facilityType"
                    // value={datoFacilidad != null ? datoFacilidad.facilityType : "Sin dato"} 
                    readOnly={true}
                    />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="creditLineRot">{t("RevolvingLineofCredit")}</Label>
                  <AvField
                    className="form-control"
                    name="creditLineRot"
                    type="text"
                    validate={{
                      required: { value: true, errorMessage: t("Required Field") },
                    }}
                    value={props.dataFeduciario.creditLineRot}
                    id="creditLineRot" />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="creditLineNoRot">{t("NonrevolvingLineofCredit")}</Label>
                  <AvField
                    className="form-control"
                    name="creditLineNoRot"
                    type="text"
                    validate={{
                      required: { value: true, errorMessage: t("Required Field") },
                    }}
                    value={props.dataFeduciario.creditLineNoRot}
                    id="creditLineNoRot" />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="declineLoan">{t("DecreasingLoan")}</Label>
                  <AvField
                    className="form-control"
                    name="declineLoan"
                    type="text"
                    validate={{
                      required: { value: true, errorMessage: t("Required Field") },
                    }}
                    value={props.dataFeduciario.declineLoan}
                    id="declineLoan" />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </AvForm>
    </React.Fragment>
  );
});
ComisioinesFiduciarias.propTypes = {
  onSubmit: PropTypes.func,
}
export default ComisioinesFiduciarias
