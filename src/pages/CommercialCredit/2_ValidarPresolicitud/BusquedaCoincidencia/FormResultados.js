import PropTypes from 'prop-types';
import { withTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import {
  Table,
  Row,
  Col,
} from "reactstrap"
const FormResultados = (props) => {
  let dataRows = [];
  if (!props.results || props.results.lenght <= 0) {
    dataRows.push(
      <tr>
        <th scope="row" colSpan={3}>{props.t("NoResults")}</th>
      </tr>
    );
  }
  else {
    dataRows = props.results.map((data) => (
      <tr key={data.id}>
        <th scope="row">{data.id}</th>
        <td>{data.name}</td>
        <td>{data.evaluation}</td>
      </tr>)
    );
  }
  return (
    <Row>
      <Col lg="12">
        <h4 className="card-title">{props.t("Results")}</h4>
        <div className="table-responsive">
          <Table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>{props.t("#")}</th>
                <th>{props.t("Name")}</th>
                <th>{props.t("Evaluation")}</th>
              </tr>
            </thead>
            <tbody>
              {dataRows}
            </tbody>
          </Table>
        </div>
      </Col>
    </Row>
  );
}
FormResultados.propTypes = {
  results: PropTypes.array.isRequired,
}
export default (withTranslation()(FormResultados));
