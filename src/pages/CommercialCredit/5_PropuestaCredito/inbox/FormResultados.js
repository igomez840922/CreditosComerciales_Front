import PropTypes from 'prop-types';
import { withTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { formatDate } from '../../../../helpers';
import {
  Table,
  Col,
  Row,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap"
const IgrFormularioBusquedaResultados = (props) => {
  if (!props.results) {
    return null;
  }
  const dataRows = props.results.map((data) => (
    <tr key={data.id}>
      <th scope="row">{formatDate(data.date, "dd-mmm-yyyy")}</th>
      <td>{data.id}</td>
      <td>{data.cliente.id}</td>
      <td>{data.cliente.nombre}</td>
      <td>{data.tipoFacilidad}</td>
      <td>{data.tipoPropuesta}</td>
      <td className="text-end">
        <Link to={{ pathname: "/creditocomercial/propuestacredito/ver", selectedData: data }} title={props.t("Verify")}>
          <i className="mdi mdi-file-search-outline mdi-24px"></i>
        </Link>
        <Link to={{ pathname: "/creditocomercial/informegestion/ver", selectedData: data }} title={props.t("ManagementReport")}>
          <i className="mdi mdi-file-search-outline mdi-24px"></i>
        </Link>
      </td>
    </tr>)
  );
  return (
    <Row>
      <Col lg="12">
        <h4 className="card-title">{props.t("Results")}</h4>
        <p className="card-title-desc"></p>
        <div className="table-responsive">
          <Table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>{props.t("Date")}</th>
                <th>{props.t("ProcedureNumber")}</th>
                <th>{props.t("Client Number")}</th>
                <th>{props.t("Client Name")}</th>
                <th>{props.t("FacilityType")}</th>
                <th>{props.t("ProposalType")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dataRows}
            </tbody>
          </Table>
        </div>
      </Col>
      <Col lg="12">
        <Pagination aria-label="Page navigation example"
          listClassName="justify-content-end">
          <PaginationItem disabled>
            <PaginationLink>
              <i className="mdi mdi-chevron-left" />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem active>
            <PaginationLink>
              2<span className="sr-only">(current)</span>
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">
              <i className="mdi mdi-chevron-right" />
            </PaginationLink>
          </PaginationItem>
        </Pagination>
      </Col>
    </Row>
  );
}

IgrFormularioBusquedaResultados.propTypes = {
  results: PropTypes.array.isRequired, //Resultado de la busqueda
}

export default (withTranslation()(IgrFormularioBusquedaResultados));
