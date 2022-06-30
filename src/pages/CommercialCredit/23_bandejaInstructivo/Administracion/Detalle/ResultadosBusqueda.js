import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react"

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
import ApiServicesDetalleDocumentacion from '../../../../../services/DocumentacionLegal/ApiServicesDetalleDocumentacion';
import { BpmServices, BackendServices } from "../../../../../services";
import { useLocation, useHistory } from "react-router-dom";


const ResultadosBusqueda = (props) => {

  const apiServiceBackend = new BackendServices();
  const location = useLocation()

  /**
   * All useState
   */
  const [dataRows, setdataRows] = useState(null);

  /**
   * End All useSate
   */

  const jsonCond = [
    'rotary',
    'commercialLoan',
    'multipleRotary',
    'rotaryNumber',
    'overdraft',
    'transfer',
    'bail',
    'trust',
    'agroPawn',
    'naturalBail',
    'legalBail',
    'crossedLegalBail',
    'crossedNaturalBail',
    'promiseLetter',
    'privateRecord',
    'trustRecord',
    'loanGuarantees',
    'fiduciaryLine',
    'prefinance',
  ]

  React.useEffect(() => {
    searchData();
  }, []);

  function capitalizarPrimeraLetra(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  function searchData() {
    apiServiceBackend.getLegalDocsFunction().then(docLegal => {
      setdataRows(docLegal.map((data) => (
        <tr key={data.id}>

          <td>{/*JSONCompare[index]*/}{capitalizarPrimeraLetra(data.documentName)}</td>
          <td>
            <Link to={"#"} title={props.t("View")}> <i className="mdi mdi-file-search-outline mdi-24px"></i>  </Link>
          </td>

        </tr>)
      ));
    })
    /*apiServiceBackend.consultarDocumentacionLegal(location.data.transactionId).then(async data => {
      delete data.status;
      delete data.transactId;
      delete data.legalDocumentationId;
      data = Object.entries(data).filter(([key, value]) => value).map(([key, value]) => key);
      let docLegal = await props.results.map(($$, index) => {
        if (data.some($$ => $$ === jsonCond[index]))
          return { ...$$, legal: jsonCond[index] }
      }).filter(Boolean);
      setdataRows(docLegal.map((data) => (
        <tr key={data.id}>

          <td>{data.comment}</td>
          <td>
            <Button color="link" className="btn btn-link" title={props.t("View")}> <i className="mdi mdi-file-search-outline mdi-24px"></i>  </Button>
          </td>

        </tr>)
      ));
    });*/
  }


  return (

    <Card>          
                  <Row>
                    <Col md="6">
                      <h5 className="card-sub-title">{props.t("LegalDocumentation")}</h5>
                    </Col> 
                                        
                  </Row> 
                  
          <CardBody>
          <div className="table-responsive">
          <Table className="table mb-0">
            <thead className="table-light">
             </thead>
            <tbody>
              {dataRows}
            </tbody>
          </Table>

        </div>
          </CardBody>

          </Card>
        

  );
}

/*ResultadosBusqueda.propTypes = {
  results: PropTypes.array.isRequired, //Resultado de la busqueda
}*/

export default (withTranslation()(ResultadosBusqueda));
