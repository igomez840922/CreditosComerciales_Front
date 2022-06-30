import PropTypes from 'prop-types';
import { withTranslation } from "react-i18next"
import { Link } from "react-router-dom"

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
} from "reactstrap"

const ResultadosBusqueda = (props) => {

  if (!props.results) {
    return null;
  }

  const dataRows = props.results.map((data) => (
    <tr key={ data.id }>
      <th scope="row">{ data.date }</th>
      <td>{ data.clientnumber }</td>
      <td>{ data.clientname }</td>
      <td>{ data.procedure }</td>
      <td>{ data?.facilityType??data?.facilityTypeId }</td>
      <td>{ data.proposalType }</td>
      <td>
        <Link to={ { pathname: "/creditocomercial/supervisoranalisiscredito/ver", selectedData: data } }>{props.t("Open")}</Link>
        </td>
    </tr>)
  );

  return (

    <Row>
      <Col lg="12">
      <h4 className="card-title">{props.t("Results")}</h4>
      <div className="table-responsive">
          <Table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>{props.t("Date")}</th>
                <th>{props.t("Client Number")}</th>
                <th>{props.t("Client Name")}</th>
                <th>{props.t("Procedure")}</th>
                <th>{props.t("FacilityType")}</th>
                <th>{props.t("ProposalType")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              { dataRows }
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

ResultadosBusqueda.propTypes = {
  results: PropTypes.array.isRequired, //Resultado de la busqueda
}

export default (withTranslation()(ResultadosBusqueda));
