import PropTypes from 'prop-types';
import React from 'react';
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

const FormResultados = (props) => {
  let dataRows = [];
  let estado=false;
  dataRows = props.results.map((data, index) => (

      <tr key={index}>
        <th scope="row">
        
        <input className='listaExclusion' type="checkbox" onChange={(resp=>{props.onSelectOption(data)})}   id={data.exclusionId}/>
        
          </th>
        <td>{data.observations}</td>
      </tr> 
  )
  );

return (

  <Row>
    <Col lg="12">
      {/*<h4 className="card-title">{props.t("Results")}</h4>*/}
      <div className="table-responsive">
        <Table className="table styled-table mb-0">
          <thead className="">
            <tr>
              <th>{props.t("Select")}</th>
              <th>{props.t("Description")}</th>
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
  onSelectOption: PropTypes.func,
}

export default (withTranslation()(FormResultados));
