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
import { BackendServices, CoreServices, BpmServices, } from "../../../../services";
import moment from "moment";
import * as url from "../../../../helpers/url_helper"
import { useLocation, useHistory } from 'react-router-dom'
import LoadingOverlay from 'react-loading-overlay';
import { translationHelpers } from "../../../../helpers"
import { uniqueId } from 'lodash';


const ResultadosBusquedaPrendaria = (props) => {

  const history = useHistory();
  const location = useLocation()
  const [locationData, setLocationData] = useState(location.data);

  const [comment, setcomment] = useState(null);
  const [dataRows, setdataRows] = useState(null);
  const [isActiveLoading, setIsActiveLoading] = useState(false);
  const [LegalDocsFunction, setLegalDocsFunction] = useState(null);
  const [LegalDocumentation, setLegalDocumentation] = useState(null);

  const [t, c, tr] = translationHelpers('translation', 'common', 'translation');

  const apiServiceBackend = new BackendServices();

  let dataSession;

  const DATA_FAKE = [
    "Acta de la empresa deudora que autoriza el crédito",
    "Acta de la empresa garante que autoriza la garantía prendaria",
    "Acta de la empresa deudaora y garante que autoriza el crédito y la garantia prendaria",
    "Pagaré Prendario",
    "Contrato de Prenda Mercantil Persona Judírica",
    "Contrato de Prenda Mercantil Persona Natural",
    "Contrato de Prenda Mercantil Fundación de interés Privado",
    "Contrato de Prenda Mercantil Persona Judírica Sociedad Extranjera",
    "Contrato de Prenda Mercantil Persona Natural Extrankera",
  ]

  React.useEffect(() => {

    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
        //location.data.transactionId = 0;
        //checkAndCreateProcedure(location.data);
        history.push(url.URL_DASHBOARD);
      } else {
        sessionStorage.setItem('locationData', JSON.stringify(location.data));
        setLocationData(location.data);
        dataSession = location.data;
      }
    } else {
      //chequeamos si tenemos guardado en session
      var result = sessionStorage.getItem('locationData');

      if (result !== undefined && result !== null) {
        result = JSON.parse(result);
        setLocationData(result);
        dataSession = result;
      }
    }

    locationData && loadLegalDocs(dataSession);

  }, [!locationData]);

  function capitalizarPrimeraLetra(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function loadLegalDocs(dataSession) {
    Promise.allSettled([
      apiServiceBackend.getLegalDocsFunction(),
      apiServiceBackend.getLegalDocumentation(dataSession.transactionId),
    ]).then(resp => {
      const [{ value: LegalDocsFunction }, { value: LegalDocumentation }] = resp;

      setLegalDocsFunction(LegalDocsFunction);
      setLegalDocumentation(LegalDocumentation);


      setdataRows(drawRows(DATA_FAKE));

      for (const iterator of LegalDocsFunction) {
        document.getElementById(iterator.id).checked = LegalDocumentation.find(legal => legal.legalDocumentId == iterator.id)?.status ?? false
      }
    }).catch(err => {

    });
  }

  async function SenData(status, data, legal) {

    legal && (data = legal)

    !legal && (data = {
      transactId: dataSession.transactionId,
      legalDocumentId: data.id,
      processDocumentId: 0,
      legalDocumentDescription: data.documentName,
      status: true,
      received: true,
      physical: true,
      date: moment().format("YYYY-MM-DD"),
      comments: " "
    })

    status && await apiServiceBackend.saveLegalDocumentation(data)
    !status && await apiServiceBackend.deleteLegalDocumentation(data)

  }

  function drawRows(LegalPrendaria) {
    return LegalPrendaria?.map((data, index) => (
      <tr key={uniqueId() + index}>
        <th scope="row"><input type="checkbox" /></th>
        <td>{/*JSONCompare[index]*/}{capitalizarPrimeraLetra(data)}</td>
      </tr>)
    );
  }

  return (
    <React.Fragment>
      <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}></LoadingOverlay>
      <Row>
        <Col lg="12">
          <div className="table-responsive">
            <Table className="table mb-0">
              <thead className="table-light">
              </thead>
              <tbody>
                {dataRows}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
}

ResultadosBusquedaPrendaria.propTypes = {
  // results: PropTypes.array.isRequired, //Resultado de la busqueda
}

export default (withTranslation()(ResultadosBusquedaPrendaria));
