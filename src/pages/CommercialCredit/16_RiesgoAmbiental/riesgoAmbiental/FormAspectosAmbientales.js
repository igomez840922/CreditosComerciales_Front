import PropTypes from 'prop-types';
import { useState, useContext, useEffect, useImperativeHandle, forwardRef } from 'react';
import RiesgoAmbientalContext from '../RiesgoAmbientalContext';

import {
  Card,
  CardBody,
  Row,
  Col,
  Label
} from "reactstrap"

import { AvForm, AvField, AvGroup, AvInput, AvCheckbox } from "availity-reactstrap-validation"
import AttachmentList from '../../../../components/Attachments/AttachmentList';



//i18n
import { useTranslation } from 'react-i18next'
import ServicioRiesgoAmbiental from '../../../../services/RiesgoAmbiental/RiesgoAmbiental';


const SimpleChekQuestion = props => {
  return (
    <AvGroup check className="my-2">
      <AvInput id={props.name} type="checkbox" name={props.name} checked={props.value} />
      <Label check htmlFor={props.name}> {props.question}</Label>
    </AvGroup>
  );
};

SimpleChekQuestion.propTypes = {
  name: PropTypes.string,
  question: PropTypes.string,
  value: PropTypes.bool
};

const ComposedQuestion = props => {
  return (
    <AvGroup check className="my-2">
      <AvInput id={props.name} type="checkbox" name={props.value} />
      <Label check htmlFor={props.name}> {props.question}</Label>
      <AvInput type="textarea" name={props.name + 'Comments'} />
    </AvGroup>
  );
};

ComposedQuestion.propTypes = {
  name: PropTypes.string,
  question: PropTypes.string
};

const FormAspectosAmbientales = forwardRef((props, ref) => {

  const { t, i18n } = useTranslation();
  const [formValid, setFormValid] = useState(false);
  const [questions, setQuestions] = useState({});
  const [riskPreClassification, setRiskPreClassification] = useState('Medio');
  const [riskClassificationConfirmation, setRiskClassificationConfirmation] = useState('Medio');


  // services
  const context = useContext(RiesgoAmbientalContext);
  const servicioRiesgoAmbiental = new ServicioRiesgoAmbiental();

  const simpleQuestions = [
    { name: 'natureLocationProject', question: '¿El proyecto está ubicado o es colindante a un área natural protegida?' },
    { name: 'physicalResettlement', question: '¿El proyecto involucra reasentamiento físico y/o económico de más de 100 personas?' },
    { name: 'environmentalPermits', question: '¿Se necesita la presentación de permisos ambientales para la ejecución del proyecto?' },
    { name: 'newProject', question: '¿El proyecto es nuevo e involucra el uso de más de 35 Hectáreas de terreno?' },
    { name: 'workersContractors', question: '¿La actividad emplea más de 50 trabajadores y manejan más de 15 contratistas?' },
  ];

  useEffect(() => {
    // load data
    if (!context.transactionId) {
      return;
    }
    console.log('load aspectos ambientales', context.transactionId);
    const { transactionId } = context;
    servicioRiesgoAmbiental.consultarAspectosAmbientales(transactionId)
      .then((info) => {
        console.log('fetch aspectos ambientales', info);
        setRiskPreClassification(info.riskPreClassification || 'Medio');
        setRiskClassificationConfirmation(info.riskClassificationConfirmation || 'Medio');
        setQuestions({
          newProject: info.newProject,
          physicalResettlement: info.physicalResettlement,
          natureLocationProject: info.natureLocationProject,
          environmentalPermits: info.environmentalPermits
        });
      })
      .catch((error) => {
        console.error('error fetch aspectos ambientales', error);
      });
  }, [context]);

  useImperativeHandle(ref, () => ({
    submit: (validate = true) => {
      const form = document.getElementById('formAspectosAmbientales');
      form.requestSubmit();
      return formValid;
    },
    getFormValidation: () => {
      return formValid;
    }
  }));

  function handleSubmit(event, errors, values) {
    event.preventDefault();
    const isValid = errors.length === 0;
    setFormValid(isValid);
    if (isValid) {
      console.log('submit', values, errors);
      const { transactionId } = context;
      servicioRiesgoAmbiental.guardarAspectosAmbientales(transactionId, values)
        .then((result) => {
          console.log('save success', result);
        })
        .catch((error) => {
          console.error('Error guardando', error);
        });
    }
  }

  return (
    <Card>

      <CardBody>

        <AvForm id="formAspectosAmbientales" className="needs-validation" onSubmit={handleSubmit}>

          <h4 className="card-title">{t("EnvironmentalAspects")}</h4>
          <p className="card-title-desc"></p>

          <AvField type="hidden" name="sustainableCreditRating" value="" />

          <Row className="my-2">
            <Col md="6">
              <AvGroup className="mb-3">
                <Label htmlFor="riskPreClassification">{t("PreClassificationRisk")}</Label>
                <AvField
                  className="form-control"
                  name="riskPreClassification"
                  type="text"
                  id="riskPreClassification"
                  value={riskPreClassification}
                  disabled={true}></AvField>
              </AvGroup>
            </Col>
            <Col md="6">
              <AvGroup className="mb-3">
                <Label htmlFor="riskClassificationConfirmation">{t("EnvironmentalRiskclassification")}</Label>
                <AvField
                  className="form-control"
                  name="riskClassificationConfirmation"
                  type="select"
                  id="riskClassificationConfirmation"
                  value={riskClassificationConfirmation}>
                  <option value="Bajo">Bajo</option>
                  <option value="Medio">Medio</option>
                  <option value="MedioAlto">Medio Alto</option>
                  <option value="Alto">Alto</option>
                </AvField>
              </AvGroup>
            </Col>
            <Col md="12">

              {simpleQuestions.map(item => (
                <SimpleChekQuestion key={item.name}
                  name={item.name}
                  question={item.question}
                  value={questions[item.name] || false} />
              ))
              }

              {/*
            { composedQuestions.map(item => (
              <ComposedQuestion key={ item.name } name={ item.name } question={ item.question } />
            ))}
 */}
            </Col>

          </Row>

          <Row className="my-4">
            <Col md="12">
              <AttachmentList editMode={true} attachments={[]} />
            </Col>
          </Row>

        </AvForm>

      </CardBody>

    </Card>
  );

});


FormAspectosAmbientales.propTypes = {
};

export default FormAspectosAmbientales;
