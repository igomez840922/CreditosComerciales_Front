import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import {
  Table,
  Card,
  CardBody,
  Pagination,
  PaginationItem,
  PaginationLink,
  CardFooter,
  Button,
  Row,
  Col,
} from "reactstrap";

const FormResultados = (props) => {
  let dataRows = [];
  if (!props.results || props.results.lenght <= 0) {
    dataRows.push(
      <tr>
        <th scope="row" colSpan={3}>
          {props.t("NoResults")}
        </th>
      </tr>
    );
  } else {
    //{ id: 1, name: 'PABLO EMILIO ESCOBAR GAVIRIA', evaluation: 90 },
    dataRows = props.results.map((data) => (
      <tr key={data.id}>
        <th scope="row">{data.id}</th>
        <td>{data.name}</td>
        <td>{data.evaluation}</td>
      </tr>
    ));
  }

  return (
    <Row>
      <Col lg="12">
        <h4 className="card-title">{props.t("Results")}</h4>
        <div className="table-responsive">
          <Table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>{props.t("Fecha")}</th>
                <th>{props.t("Nombre Cliente")}</th>
                <th>{props.t("Grupo Economico")}</th>
                <th>{props.t("Num Cliente")}</th>
                <th>{props.t("Num OPS")}</th>
                <th>{props.t("Saldo")}</th>
                <th>{props.t("Dias Mora")}</th>
                <th>{props.t("Rango Mora")}</th>
                <th>{props.t("Tipo Garantia1")}</th>
                <th>{props.t("Monto G1")}</th>
                <th>{props.t("Tipo Garantia2")}</th>
                <th>{props.t("Monto G2")}</th>
                <th>{props.t("Tipo Garantia3")}</th>
                <th>{props.t("Monto G3")}</th>
                <th>{props.t("Clasificacion")}</th>
                <th>{props.t("Prov Reg")}</th>
                <th>{props.t("Prov Pais")}</th>
                <th>{props.t("Fecha Reneg")}</th>
                <th>{props.t("Fecha Refin")}</th>
                <th>{props.t("Tasa INT")}</th>
                <th>{props.t("Prov NIIF")}</th>
                <th>{props.t("Fecha Ini")}</th>
                <th>{props.t("Fecha Fin")}</th>
                <th>{props.t("Sector1")}</th>
              </tr>
            </thead>
            <tbody>{dataRows}</tbody>
          </Table>
        </div>
      </Col>
    </Row>
  );


};

FormResultados.propTypes = {
  results: PropTypes.array.isRequired,
};

export default withTranslation()(FormResultados);
