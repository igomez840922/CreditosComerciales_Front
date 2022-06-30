import PropTypes from 'prop-types';
import { translationHelpers } from '../../../../helpers';

import {
  Row,
  Col,
  Button,
  Label
} from "reactstrap"

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import React from 'react';



const FormFilter = (props) => {

  const [t, c] = translationHelpers('credit_analysis', 'common');

  //On Mounting (componentDidMount)
  React.useEffect(() => {
    // Read Api Service data
    props.onSearch(null);
  }, []);

  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    props.onSearch(values);
  }

  return (

      <Row>
        <Col lg="12">
        <h4 className="card-title">{ c("Filters") }</h4>
        <p className="card-title-desc"></p>
        <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
        <Row>
          <Col md="3">
            <AvGroup className="mb-3">
              <Label htmlFor="client">{ t("Client Name") }</Label>
              <AvField
                className="form-control"
                name="client"
                type="text"
                id="client" />
            </AvGroup>
          </Col>
          <Col md="3">
            <AvGroup className="mb-3">
              <Label htmlFor="proposalType">{ t("Proposal Type") }</Label>
              <AvField
                className="form-control"
                name="proposalType"
                type="select"
                id="proposalType"
                value="Todos">
                <option>Todos</option>
                <option>Análisis</option>
              </AvField>
            </AvGroup>
          </Col>
          <Col md="3">
            <AvGroup className="mb-3">
              <Label htmlFor="status">{ t("Application Status") }</Label>
              <AvField
                className="form-control"
                name="classification"
                type="select"
                id="classification"
                value="Todos">
                <option>Todos</option>
                <option>Análisis</option>
                <option>En Aclaratoria</option>
              </AvField>
            </AvGroup>
          </Col>
          <Col md="3">
            <AvGroup className="mb-3">
              <Label htmlFor="sla">{ t("SLA") }</Label>
              <AvField
                className="form-control"
                name="sla"
                type="select"
                id="sla"
                value="Todos">
                <option>Todos</option>
                <option>Atraso</option>
                <option>Por Vencer</option>
                <option>A Tiempo</option>
              </AvField>
            </AvGroup>
          </Col>
          <Col md="12 text-end mt-4">
            <Button id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}>
              { c("Apply") }
            </Button>
          </Col>
        </Row>
        </AvForm>
        </Col>
      </Row>

  );
};


FormFilter.propTypes = {
  onSearch: PropTypes.func
};

export default FormFilter;
