import React, { useEffect, useState } from "react"
import { withTranslation } from "react-i18next"
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  Button,
  Label,
  Input,
  Modal,
  Card,
  CardBody,
  CardFooter,
} from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"
import { translationHelpers } from "../../../../helpers";
import { BackendServices, BpmServices, CoreServices } from "../../../../services";
import { useHistory, useLocation } from "react-router-dom";
import * as url from "../../../../helpers/url_helper"
import { LevelAutonomyClass } from "./LevelAutonomy.model";

const LevelAutonomy = (props) => {
  const [t, c] = translationHelpers('translation', 'common');
  const [levelAutonomy, setLevelAutonomy] = useState(0);
  const [levelAutonomyPosition, setLevelAutonomyPosition] = useState('');
  const bpmServices = new BpmServices();
  const backendServices = new BackendServices();
  const coreServices = new CoreServices();

  const location = useLocation();
  const history = useHistory();
  const [locationData, setLocationData] = useState(null);

  useEffect(() => {
    initializeData();
  }, []);

  async function initializeData() {
    let dataSession = { transactionId: atob(location?.pathname?.split("PrevisualizarFideicomiso/")[1] ?? '') };
    let levelAutonomyClass = new LevelAutonomyClass(dataSession ?? {});
    setLevelAutonomyPosition(await levelAutonomyClass.getLevelAutonomy())
  }



  return (
    <React.Fragment>
      {props?.fideicomiso ? <>
        <Col sm="3" className="d-flex flex-column">
          <strong htmlFor="clientNumber">{t("Level of Autonomy")} {t("Creditt")}</strong>
          <label>{levelAutonomyPosition.credit}</label>
        </Col>
        <Col sm="3" className="d-flex flex-column">
          <strong htmlFor="clientNumber">{t("Level of Autonomy")} {t("Banking")}</strong>
          <label>{levelAutonomyPosition.banca}</label>
        </Col>
      </> : <><h5 className="card-title mt-2" style={{ textAlign: "left", fontSize: '21px!important' }}>{t("Level of Autonomy")} {t("Creditt")}: <br />{levelAutonomyPosition.credit}</h5>
        <h5 className="card-title mt-2" style={{ textAlign: "right", fontSize: '21px!important' }}>{t("Level of Autonomy")} {t("Banking")}: <br />{levelAutonomyPosition.banca}</h5></>}
    </React.Fragment>
  );
};

export default (withTranslation()(LevelAutonomy));
