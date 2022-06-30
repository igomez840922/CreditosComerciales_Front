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
import { withTranslation } from "react-i18next"
import { useLocation, useHistory } from "react-router-dom";
import { BackendServices } from "../../../../services";
import * as url from "../../../../helpers/url_helper"

const Fideicomiso = (props) => {
  const location = useLocation()
  const apiBack = new BackendServices();
  const [dataLocation, setData] = useState(location.data);
  const [dataTrust, setdataTrust] = useState({ name: "", number: 0 });
  const [locationData, setLocationData] = useState(null);
  const history = useHistory();

  React.useEffect(() => {

    let dataSession;

    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
        //location.data.transactionId = 0;
        //checkAndCreateProcedure(location.data);
        history.push(url.URL_DASHBOARD);
      }
      else {
        sessionStorage.setItem('locationData', JSON.stringify(location.data));
        setLocationData(location.data);
        dataSession = location.data;
      }
    }
    else {
      //chequeamos si tenemos guardado en session
      var result = sessionStorage.getItem('locationData');
      if (result !== undefined && result !== null) {
        result = JSON.parse(result);
        setLocationData(result);
        dataSession = result;
      }
    }


    // Read Api Service data
    initializeData(dataSession);
  }, [props.facilityId]);
  function initializeData(dataLocation) {
    apiBack.consultarNumeroFideicomiso(dataLocation.transactionId).then(resp => {
      if (resp === undefined || resp?.filter(trustInfo => trustInfo.facilityId === props.facilityId)?.length === 0) {
        apiBack.guardarNumeroFideicomiso({
          "transactId": Number(dataLocation.transactionId),
          facilityId: props.facilityId,
          "conclusions": " "
        }).then(response => {
          let trustName = response.trustName.split(' ');
          trustName.splice(trustName.length - 1, 1);
          trustName = trustName.join(' ');
          setdataTrust({ name: trustName, number: response.trustNumber })
        })
      } else {
        let trustInfo = resp.find(trustInfo => trustInfo.facilityId === props.facilityId)
        let trustName = trustInfo.trustName.split(' ');
        trustName.splice(trustName.length - 1, 1);
        trustName = trustName.join(' ');
        setdataTrust({ name: trustName, number: trustInfo.trustNumber })

      }
    })
  }
  function handleSubmit(event, errors, values) {
    event.preventDefaulprops.t();
    if (errors.length > 0) {
      return;
    }
  }

  function check(e) {
    let tecla = (document.all) ? e.keyCode : e.which;
    //Tecla de retroceso para borrar, siempre la permite
    if (tecla === 45) {
      e.preventDefault();
      return true;
    }

    return false;
  }

  return (
    <React.Fragment>
      <Row>
        <Col lg="12">
          <h4 className="card-title">{props.t("Escrow")}</h4>
          <p className="card-title-desc"></p>
          <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <Label htmlFor="fideicomisoName">{props.t("Escrowname")}</Label>
                  <AvField
                    className="form-control"
                    name="fideicomisoName"
                    type="text"
                    readOnly={true}
                    id="fideicomisoName" value={dataTrust.name} />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="fideicomisoNumber">{props.t("Escrownumber")}</Label>
                  <AvField
                    className="form-control"
                    name="fideicomisoNumber"
                    min={0}
                    type="number"
                    onKeyPress={(e) => { return check(e) }}
                    readOnly={true}
                    id="fideicomisoNumber" value={dataTrust.number} />
                </div>
              </Col>
            </Row>
          </AvForm>
        </Col>
      </Row>
    </React.Fragment>
  );
}
export default (withTranslation()(Fideicomiso))
