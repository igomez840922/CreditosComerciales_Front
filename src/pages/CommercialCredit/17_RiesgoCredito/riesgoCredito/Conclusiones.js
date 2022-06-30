import { useState, useEffect, useContext, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation, withTranslation } from "react-i18next"
import { useLocation, useHistory } from 'react-router-dom'


import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Label
} from "reactstrap"

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import RiesgoCreditoContext from '../RiesgoCreditoContext';
import ServicioRiesgoCredito from '../../../../services/RiesgoCredito/RiesgoCredito';

const FormConclusiones = forwardRef((props, ref) => {
  const history = useHistory();
  const location = useLocation()
  const { t, i18n } = useTranslation();

  const [formValid, setFormValid] = useState(false);
  const [conclusions, setConclusions] = useState('');
  const [isUpdatingRecord, setIsUpdatingRecord] = useState(false);
  const [locationData, setLocationData] = useState(null);

  // services
  const context = useContext(RiesgoCreditoContext);
  const servicioRiesgoCredito = new ServicioRiesgoCredito();


  useImperativeHandle(ref, () => ({
    submit: () => {
      const form = document.getElementById('formRiesgoCreditoConclusiones');
      form.requestSubmit();
      return formValid;
    },
    getFormValidation: () => {
      return formValid;
    }
  }));

  useEffect(() => {
    let dataSession=null;
    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
        //location.data.transactionId = 0;
        //checkAndCreateProcedure(location.data);
      }
      else {
        sessionStorage.setItem('locationData', JSON.stringify(location.data));
        setLocationData(location.data);
        dataSession=location.data;
      }
    }
    else {
      //chequeamos si tenemos guardado en session
      var result = sessionStorage.getItem('locationData');
      if (result !== undefined && result !== null) {
        result = JSON.parse(result);
        setLocationData(result);
        dataSession=result
      }
    }
    // load data
    servicioRiesgoCredito.consultarRiesgoCreditoComercial(dataSession.transactionId)
      .then((info) => {

        console.log("riesgo", info);
        if (info.transactId) {
          setIsUpdatingRecord(true);
        }
        setConclusions(info.conclusions);
      })
      .catch((error) => {
        console.error('error fetch riesgo credito', error);
      });
  }, []);

  function handleSubmit(event, errors, values) {
    event.preventDefault();
    const isValid = errors.length === 0;
    setFormValid(isValid);
    if (isValid) {
      servicioRiesgoCredito.guardarInformacionRiesgoCredito(locationData.transactionId, values, isUpdatingRecord)
        .then((result) => {
          props.onSaveSuccess();
        })
        .catch((error) => {
          console.error('save error', error);
        });
    }
  }


  return (
    <Card>
      <h5 className="card-sub-title">{t("ConclusionsAndRecomendations")}</h5>

      <CardBody>
        <AvForm id="formRiesgoCreditoConclusiones" className="needs-validation" onSubmit={handleSubmit}>
          <Row className="my-3">
            <Col md="12">
              <AvGroup>
                <Label htmlFor="conclusions"></Label>
                <AvField className="form-control"
                  name="conclusions"
                  type="textarea"
                  disabled={props?.validacion ? true : false}
                  id="conclusions"
                  value={conclusions}
                  rows="7" />
              </AvGroup>
            </Col>
          </Row>
        </AvForm>
      </CardBody>
    </Card>
  );
});


FormConclusiones.propTypes = {
  onSaveSuccess: PropTypes.func
};

export default FormConclusiones;
