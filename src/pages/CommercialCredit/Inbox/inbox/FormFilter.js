import PropTypes from 'prop-types';
import { withTranslation } from "react-i18next"
import { translationHelpers } from '../../../../helpers';


import {
  Table,
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Label
} from "reactstrap"

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"

import * as OPTs from "../../../../helpers/options_helper";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import moment from "moment";

const FormFilter = (props) => {

  const [t, c] = translationHelpers('commercial_credit', 'common');

  function handleSubmit() {

  }

  return (
    <Card>
      <CardBody>
        <h4 className="card-title">{ c("Filters") }</h4>
        <p className="card-title-desc"></p>
        <AvForm id="frmSearch" className="needs-validation" onSubmit={ handleSubmit }>
        <Row>
          <Col md="3">
            <AvGroup className="mb-3">
              <Label htmlFor="customer">{ t("Client Name / Number") }</Label>
              <AvField
                className="form-control"
                name="customer"
                type="text"
                id="customer" />
            </AvGroup>
          </Col>
          <Col md="3">
            <AvGroup className="mb-3">
              <Label htmlFor="preclassification">{ t("Pre Classification") }</Label>
              <AvField
                className="form-control"
                name="preclassification"
                type="select"
                id="preclassification"
                value="Todos">
                <option>Todos</option>
                <option>Bajo</option>
                <option>Medio</option>
              </AvField>
            </AvGroup>
          </Col>
          <Col md="3">
            <AvGroup className="mb-3">
              <Label htmlFor="classification">{ t("Classification") }</Label>
              <AvField
                className="form-control"
                name="classification"
                type="select"
                id="classification"
                value="Todos">
                <option>Todos</option>
                <option>Bajo</option>
                <option>Medio</option>
              </AvField>
            </AvGroup>
          </Col>
          <Col md="3">
            <AvGroup className="mb-3">
              <Label htmlFor="analyst">{ t("Analyst") }</Label>
              <AvField
                className="form-control"
                name="analyst"
                type="select"
                id="analyst"
                value="Todos">
                <option>Todos</option>
                <option>Cristian</option>
              </AvField>
            </AvGroup>
          </Col>
          <Col md="3">
            <AvGroup className="mb-3">
              <Label htmlFor="startDate">{ t("Start") }</Label>

              <Flatpickr
                            id="startDate"
                            name="startDate"
                            className="form-control d-block"
                            placeholder={OPTs.FORMAT_DATE_SHOW}
                            options={{
                              dateFormat: OPTs.FORMAT_DATE,
                              //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                              defaultDate: new Date()
                            }}
                            //onChange={(selectedDates, dateStr, instance) => { setfechaSet2(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
                          /> 

             
            </AvGroup>
          </Col>
          <Col md="3">
            <AvGroup className="mb-3">
              <Label htmlFor="endDate">{ t("End") }</Label>

              <Flatpickr
                            id="endDate"
                            name="endDate"
                            className="form-control d-block"
                            placeholder={OPTs.FORMAT_DATE_SHOW}
                            options={{
                              dateFormat: OPTs.FORMAT_DATE,
                              //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                              defaultDate: new Date()
                            }}
                            //onChange={(selectedDates, dateStr, instance) => { setfechaSet2(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
                          /> 
             
            </AvGroup>
          </Col>
          <Col md="6 text-end mt-4">
            <Button id="btnSave" color="success" type="submit" style={{ margin: '5px' }}>
              { c("Apply") }
            </Button>
          </Col>
        </Row>
        </AvForm>
      </CardBody>
    </Card>
  );
};

FormFilter.propTypes = {
}

export default (withTranslation(['commercial_credit'])(FormFilter));
