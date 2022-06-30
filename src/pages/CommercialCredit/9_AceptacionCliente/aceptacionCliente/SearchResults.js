import PropTypes from 'prop-types';
import { withTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import {
  Table,
  Card,
  CardBody,
  Row,
  Col,
  Button
} from "reactstrap"


const SearchResults = (props) => {

//  if (!props.items) {
  //  return null;
 // }
       

  const dataRows = props.results.map((data) => (
    <tr key={data.id}>
              <th scope="row">{ data.date }</th>
              <td>{ data.procedure }</td>
            <td>{ data.client.clientnumber }</td> 
             <td>{ data.client.Clientname }</td>
      <td></td>
      <td>{ data?.facilityType??data?.facilityTypeId }</td>
      <td>{ data.proposalType }</td>
      <td style={{textAlign:"right"}}>
        <Link to={ { pathname: "", selectedData: data } } title={props.t("accept")}>  <i className="mdi mdi-account-check-outline mdi-24px"></i>  </Link> | <Link to={ { pathname: "", selectedData: data } }  title={props.t("reject")}> <i className="mdi mdi-account-remove-outline mdi-24px"></i> </Link>
        </td>
    </tr>)
  );

  return (
    <Row>
      <Col lg="12">
        <h4 className="card-title">{ props.t("Results") }</h4>
        <p className="card-title-desc"></p>
        <div className="table-responsive">
              <Table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th>{ props.t("Date") }</th>
                    <th>{ props.t("Procedure") }</th>
                    <th>{ props.t("Client Number") }</th>
                    <th>{ props.t("Client Name") }</th>
                    <th>{ props.t("Grupo Economico") }</th>
                    <th>{ props.t("FacilityType") }</th>
                    <th>{ props.t("ProposalType") }</th>               
                    <th></th>
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
};

SearchResults.propTypes = {
 // items: PropTypes.array.isRequired,
}

export default (withTranslation()(SearchResults));
