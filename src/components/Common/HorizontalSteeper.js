import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'
import { useLocation, useHistory } from 'react-router-dom'
import Stepper from 'react-stepper-horizontal';


const HorizontalTimeLine = (props) => {
  const { t, i18n } = useTranslation();
  const [values, setvalues] = useState(props.values);
  const [activeStep, setactiveStep] = useState(props.activeStep);
  let valuesStep = [{ title: t("Etapa1_Proceso1") }, { title: t("Etapa2_Proceso1") }, { title: t("Etapa3_Proceso1") }, { title: t("Etapa4_Proceso1") }, { title: t("Etapa5_Proceso1") }, { title: t("Etapa6_Proceso1") }];

  let valuesStep2 = [{ title: t("Etapa1_Proceso2") }, { title: t("Etapa2_Proceso2") }, { title: t("Etapa3_Proceso2") }, { title: t("Etapa4_Proceso2") }, { title: t("Etapa5_Proceso2") }];

  // let valuesStep3=[{title: t("Etapa1_Proceso3")}, {title: t("Etapa2_Proceso2")}, {title: t("Etapa3_Proceso2")}, {title: t("Etapa4_Proceso2")}, {title: t("Etapa5_Proceso2")}];
  let valuesStep3 = [{ title: t("Etapa1_Proceso3") }, { title: t("Etapa2_Proceso3") }, { title: t("Etapa3_Proceso3") }, { title: t("Etapa4_Proceso3") }, { title: t("Etapa5_Proceso3") }];

  let valuesStep4 = [{ title: t("Etapa1_Proceso2") }, { title: t("Etapa2_Proceso4") }, { title: t("Etapa5_Proceso2") }];
  //On Mounting (componentDidMount) if selectedData has changes
  React.useEffect(() => {
    //loadData();
  }, []);

  switch (props.processNumber) {
    case 1:
      return (
        <React.Fragment>
          <div>
            <Stepper activeColor={"#166a50"} completeColor={"#187055"} steps={valuesStep} activeStep={activeStep} />

          </div>
        </React.Fragment>
      )
    case 2:
      return (
        <React.Fragment>
          <div>
            <Stepper activeColor={"#166a50"} completeColor={"#187055"} steps={valuesStep2} activeStep={activeStep} />
          </div>
        </React.Fragment>
      )
    case 3:
      return (
        <React.Fragment>
          <div>
            <Stepper activeColor={"#166a50"} completeColor={"#187055"} steps={valuesStep3} activeStep={activeStep} />
          </div>
        </React.Fragment>
      )
    case 4:
      return (
        <React.Fragment>
          <div>
            <Stepper activeColor={"#166a50"} completeColor={"#187055"} steps={valuesStep4} activeStep={activeStep} />
          </div>
        </React.Fragment>
      )
    default:
      break;
  }

}

HorizontalTimeLine.propTypes = {
  activeStep: PropTypes.any,
  values: PropTypes.any,
  processNumber: PropTypes.any
}
//{title: 'Step Four'}
//export default (withTranslation()(DatosGenerales));
export default HorizontalTimeLine;

