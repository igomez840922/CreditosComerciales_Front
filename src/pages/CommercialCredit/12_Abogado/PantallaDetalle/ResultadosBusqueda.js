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
import ApiServicesDetalleDocumentacion from '../../../../services/DocumentacionLegal/ApiServicesDetalleDocumentacion';
import { BpmServices, BackendServices } from "../../../../services";
import { useLocation, useHistory } from "react-router-dom";
import * as url from "../../../../helpers/url_helper"
import ModalComentarioDocumentacion from "./ModalComentario"
import moment from 'moment';
import SweetAlert from "react-bootstrap-sweetalert"

const ResultadosBusqueda = (props) => {

  const apiServiceBackend = new BackendServices();
  const location = useLocation()
  const [openModalRiesgo, setopenModalRiesgo] = useState(false);
  const [dataSet, setdataSet] = useState({
    "processDocumentId": 0,
    "transactId": 0,
    "legalDocumentId": 0,
    "legalDocumentDescription": "",
    "description": "",
    "status": true
  });
  /**
   * All useState
   */
  const [dataRows, setdataRows] = useState(null);

  const [messageNotAvailable, setmessageNotAvailable] = useState(false);
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

  const [locationData, setLocationData] = useState(location.data);
  const history = useHistory();

  React.useEffect(() => {

    let dataSession;

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
    console.log('location');
    locationData && searchData();

  }, [!locationData]);

  function capitalizarPrimeraLetra(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  function actuaizarDocumentacion(data) {
    // let jsonSet = {
    //   "processDocumentId": Number(dataSet?.processDocumentId ?? 0),
    //   "transactId": Number(locationData.transactionId),
    //   "legalDocumentId": Number(dataSet?.legalDocumentId ?? 0),
    //   "legalDocumentDescription": dataSet?.legalDocumentDescription ?? "",
    //   "description": data?.description ?? "",
    //   "status": true
    // }
    dataSet.comments = data?.comments ?? " ";
    dataSet.transactId = Number(locationData.transactionId)
    console.log(dataSet);
    let dato = {
      processDocumentId: dataSet?.processDocumentId ?? 0,
      transactId: dataSet?.transactId ?? 0,
      legalDocumentId: dataSet?.legalDocumentId ?? 0,
      legalDocumentDescription: dataSet?.legalDocumentDescription ?? "",
      date: dataSet?.date ?? moment().format("YYYY-MM-DD"),
      physical: dataSet?.physical ?? false,
      received: dataSet?.received ?? false,
      comments: data?.comments ?? " ",
      status: dataSet?.status ?? true
    }
    apiServiceBackend.updateDocumentation(dato).then(resp => {
      setopenModalRiesgo(false);
      // setmessageNotAvailable(true)
      searchData()
    }).catch(err => {
      setopenModalRiesgo(false);
      // setmessageNotAvailable(true)

    })
  }
  function searchData() {
    Promise.allSettled([
      apiServiceBackend.getLegalDocsFunction(),
      apiServiceBackend.getLegalDocumentation(locationData.transactionId),
    ]).then(resp => {
      const [{ value: LegalDocsFunction }, { value: LegalDocumentation }] = resp;
      setdataRows(drawRows(LegalDocsFunction.filter(docLegalMap => !!LegalDocumentation.find(LegalDocumentationFind => LegalDocumentationFind.legalDocumentId == docLegalMap.id)), LegalDocumentation));

    }).catch(err => {

    });

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

  function drawRows(docLegal, dataAdd) {
    return dataAdd.map((data, index) => (
      <tr key={data.legalDocumentId} >
        <td>{capitalizarPrimeraLetra(data.legalDocumentDescription)}</td>
        <td>{props?.validacion ? data.comments : null}</td>
        <td>
          {props?.validacion ?
            <Link to="#" onClick={(resp) => { setdataSet(dataAdd[index]); setopenModalRiesgo(true) }}><i className="mdi mdi-comment-plus mdi-24px"></i></Link> : null}
          <Link to={"#"} title={props.t("View")} onClick={() => { setmessageNotAvailable(true) }}> <i className="mdi mdi-file-search-outline mdi-24px"></i>  </Link>
        </td>
      </tr >))
  }
  return (
    <React.Fragment>
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
        <Col lg="12">

        </Col>
      </Row>


      {messageNotAvailable ? (
        <SweetAlert
          warning
          title={props.t("Advise")}
          confirmButtonText={props.t("Accept")}
          cancelButtonText={props.t("Cancel")}
          onConfirm={() => {
            setmessageNotAvailable(false)
          }}
        >
          {props.t("ServiceNotavailable")}
        </SweetAlert>
      ) : null}
      <ModalComentarioDocumentacion actuaizarDocumentacion={actuaizarDocumentacion} dataSet={dataSet} isOpen={openModalRiesgo} toggle={() => { setopenModalRiesgo(false) }} />
    </React.Fragment>


  );
}

/*ResultadosBusqueda.propTypes = {
  results: PropTypes.array.isRequired, //Resultado de la busqueda
}*/

export default (withTranslation()(ResultadosBusqueda));
