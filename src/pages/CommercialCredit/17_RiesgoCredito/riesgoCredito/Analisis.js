import PropTypes from 'prop-types';
import { translationHelpers } from "../../../../helpers"
import { Link } from "react-router-dom"

import {
  Table,
  Card,
  CardBody,
  Row,
  Col
} from "reactstrap"


const Analisis = (props) => {

  const [t, c] = translationHelpers('environmental_risk', 'common');

  const items = [
    'Número de Cliente',
    'Nombre Cliente',
    'Safi Rating',
    'Saldo Total',
    'Saldo Neto de DPF',
    'Valor Garantía Total',
    'Saldo Expuesto Bruto',
    'Valor Garantía Acotada',
    'Saldo Expuesto Neto',
    'Riesgo País',
    'Actividad CINU',
    'Tipo Relación',
    'Saldo Con Garantía Real',
    'Saldo Sin Garantía',
    'Fecha de Último Refinanciamiento',
    'Veces Refinanciadas en 1 año',
    'Fecha de Última Renegociación',
    'Veces Renegociadas en 1 año',
    'Máx Clasificación Regulatoria',
    'Máx Categoría de Cambio',
    'Provisión Niif Actual',
    'Provisión Específica Actual'
  ];

  const customerDataRows = items.map((item, index) => (
    <tr key={ 'row-'+index }>
      <td>{ item }</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  ));

  return (
    <Card>
      <CardBody>
        <h4 className="card-title">{ c("Analisis") }</h4>
        <p className="card-title-desc"></p>
        <Row className="mb-3">
          <Col lg="12">
            <div className="table-responsive">
              <Table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th></th>
                    <th>{ t("Grupo Economico") }</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Tipo Revisión</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Grupo Económico</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Autonomía</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Banca</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Saldo Neto de DPF (Grupo)</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Saldo Neto de Garantías (Grupo)</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Saldo Con Garantía Real (Grupo)</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Saldo Sin Garantía (Grupo)</td>
                    <td></td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xl="12">
            <div className="table-responsive">
              <Table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th>&nbsp;</th>
                    <th>Cliente 1</th>
                    <th>Cliente 2</th>
                    <th>Cliente 3</th>
                  </tr>
                </thead>
                <tbody>
                  { customerDataRows }
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xl="12">
            <div className="table-responsive">
              <Table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Tipo de Facilidad</th>
                    <th>Límite</th>
                    <th>Saldo</th>
                    <th>Garantía</th>
                    <th>Tipo Garantía</th>
                    <th>Tipo Propuesta</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>PRÉSTAMOS DECRECIENTE</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};


Analisis.propTypes = {
}

export default Analisis;
