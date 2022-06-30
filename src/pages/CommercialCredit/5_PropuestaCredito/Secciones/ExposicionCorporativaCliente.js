import PropTypes from 'prop-types';
import { formatCurrency, translationHelpers } from '../../../../helpers';
import {
  Table,
  Card,
  CardBody,
  Col,
} from "reactstrap"
import React, { useEffect, useState } from "react"
import { BackendServices, CoreServices, BpmServices, } from "../../../../services";
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory } from 'react-router-dom';
import * as url from "../../../../helpers/url_helper"
import Currency from '../../../../helpers/currency';

import { uniq_key } from '../../../../helpers/unq_key'

const estiloTotales = { backgroundColor: "lightgrey !important", color: "black !important" }

const ExposicionCorporativaClientes = (props) => {
  const location = useLocation();
  const history = useHistory();
  const [locationData, setLocationData] = useState(null);
  const coreServices = new CoreServices();
  const backendServices = new BackendServices();
  const { t, i18n } = useTranslation();
  const [dataRows, setdataRows] = React.useState(null);
  const currencyData = new Currency();
  const [dataRows2, setdataRows2] = React.useState(null);
  const [dataRows3, setdataRows3] = React.useState(null);
  const [ExposicionCorportativa, setExposicionCorportativa] = useState(null);
  const [ExposicionCorportativaFacilidades, setExposicionCorportativaFacilidades] = useState(null);
  const [CorporateExposure, setCorporateExposure] = useState(null);
  const [customerNumberT24, setcustomerNumberT24] = React.useState(props.customerNumberT24);
  useEffect(() => {

    let dataSession;
    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
        //location.data.transactionId = 0;
        //checkAndCreateProcedure(location.data);
        history.push(url.URL_DASHBOARD);
      }
      else {
        sessionStorage.setItem('locationData', JSON.stringify(location.data));
        setLocationData(location.data);
        dataSession = location.data;
      }
    }
    else {
      //chequeamos si tenemos guardado en session
      var result = sessionStorage.getItem('locationData');
      if (result !== undefined && result !== null) {
        result = JSON.parse(result);
        setLocationData(result);
        dataSession = result;
      }
    }

    getCoporateExhibition(dataSession);
  }, [props.activeTab == 2]);

  function groupBy(collection, property) {
    var i = 0, val, index,
      values = [], result = [];
    for (; i < collection.length; i++) {
      val = collection[i][property];
      index = values.indexOf(val);
      if (index > -1)
        result[index].push(collection[i]);
      else {
        values.push(val);
        result.push([collection[i]]);
      }
    }
    return result;
  }
  /*
  async function getCoporateExhibitionClient(dataSession) {
    // getCorporateExhibitionByClients
     await backendServices.consultPrincipalDebtor(dataSession.transactionId)
      .then(async (data) => {
        if (data !== undefined) {
          await backendServices.getExposicionCorporativaClienteBD(dataSession.transactionId).then(async resp => {

            if (resp.length > 0) {
              let datosGenerales = []
              let datosLista = groupBy(resp, "t24ClientId");
              for (let i = 0; i < datosLista.length; i++) {
                let dataTotal = []
                dataTotal.push(datosLista[i].find(x => x.description == "Facilidades Corto Plazo") ?? {
                  "transactId": 0,
                  "exhibitionId": 0,
                  "description": "Facilidades Corto Plazo",
                  "approved": 0,
                  "currentBalance": 0,
                  "proposed": 0,
                  "ltv": 0,
                  "difference": 0,
                  "status": true
                });
                dataTotal.push(datosLista[i].find(x => x.description == "Facilidades Largo Plazo") ?? {
                  "transactId": 0,
                  "exhibitionId": 0,
                  "description": "Facilidades Largo Plazo",
                  "approved": 0,
                  "currentBalance": 0,
                  "proposed": 0,
                  "ltv": 0,
                  "difference": 0,
                  "status": true
                });
                setExposicionCorportativa(resp.length > 0 ? resp : null);
                datosGenerales = [...datosGenerales, (
                  <tr key={uniq_key()} style={{ fontWeight: "bold" }}>
                    <td >{datosLista[i][0].t24ClientId}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ), ...(dataTotal.map((item, index) => (
                  <tr key={uniq_key()}>
                    <td scope="row" width="30%">{item.description}</td>
                    <td scope="row" className="table-right">${currencyData.formatTable(item.approved, 0)}</td>
                    <td scope="row" className="table-right">${currencyData.formatTable(item.currentBalance, 0)}</td>
                    <td scope="row" className="table-right">${currencyData.formatTable(item.proposed, 0)}</td>
                    <td scope="row" className="table-right">$0.00</td>
                    <td scope="row" className="table-right">-</td>
                    <td scope="row" className="table-right">N/A</td>
                  </tr>
                )))]

              }
              datosGenerales = [...datosGenerales, (<tr key={uniq_key()} style={{ backgroundColor: "lightgrey !important", color: "black !important" }}>
                <th style={{ backgroundColor: "lightgrey !important", color: "black !important" }} scope="row" width="30%">{t("Commercial Gross Exposure")}</th>
                <th style={{ backgroundColor: "lightgrey !important", color: "black !important" }} scope="row" className="table-right">${currencyData.formatTable(resp?.reduce((acu, crr) => (crr.description == "Facilidades Corto Plazo" || crr.description == "Facilidades Largo Plazo" ? acu + crr.approved : acu + 0), 0) || 0)}</th>
                <th style={{ backgroundColor: "lightgrey !important", color: "black !important" }} scope="row" className="table-right">${currencyData.formatTable(resp?.reduce((acu, crr) => (crr.description == "Facilidades Corto Plazo" || crr.description == "Facilidades Largo Plazo" ? acu + crr.currentBalance : acu + 0), 0) || 0)}</th>
                <th style={{ backgroundColor: "lightgrey !important", color: "black !important" }} scope="row" className="table-right">${currencyData.formatTable(resp?.reduce((acu, crr) => (crr.description == "Facilidades Corto Plazo" || crr.description == "Facilidades Largo Plazo" ? acu + crr.proposed : acu + 0), 0) || 0)}</th>
                <th style={{ backgroundColor: "lightgrey !important", color: "black !important" }} scope="row" className="table-right">$0.00</th>
                <th style={{ backgroundColor: "lightgrey !important", color: "black !important" }} scope="row" className="table-right">$0.00</th>
                <th style={{ backgroundColor: "lightgrey !important", color: "black !important" }} scope="row" className="table-right"></th>
              </tr>)]
              setdataRows(datosGenerales)
            } 
          })
        }
      });
  }
*/

  async function getCoporateExhibition(dataSession) {

    console.log("hello");
    //await RecalculatePledges(dataSession.transactionId);

    await backendServices.consultPrincipalDebtor(dataSession.transactionId)
      .then(async (data) => {
        await backendServices.consultGeneralDataPropCred(dataSession.transactionId)
          .then(async (propuesta) => {
            if (data !== undefined) {
              await backendServices.getExposicionCorporativaClienteBD(dataSession.transactionId).then(async resp => {
                if (resp.length > 0) {

                  let allDataTotal = []

                  /* Section Comercial Exposure */
                  let datosLista = groupBy(resp, "t24ClientId");
                  for (let i = 0; i < datosLista.length; i++) {
                    let dataTotal = []

                    console.log("getExposicionCorporativaClienteBD123", datosLista[i]);

                    dataTotal.push(datosLista[i].find(x => x.description.toUpperCase() === "Facilidades Corto Plazo".toUpperCase()) ?? {
                      "transactId": 0,
                      "exhibitionId": 0,
                      "description": "Facilidades Corto Plazo".toUpperCase(),
                      "approved": 0,
                      "currentBalance": 0,
                      "proposed": 0,
                      "guarantee": 0,
                      "ltv": 0,
                      "difference": 0,
                      "status": true,
                      "IsName": false
                    });
                    dataTotal.push(datosLista[i].find(x => x.description.toUpperCase() == "Facilidades Largo Plazo".toUpperCase()) ?? {
                      "transactId": 0,
                      "exhibitionId": 0,
                      "description": "Facilidades Largo Plazo".toUpperCase(),
                      "approved": 0,
                      "currentBalance": 0,
                      "proposed": 0,
                      "ltv": 0,
                      "difference": 0,
                      "guarantee": 0,
                      "status": true,
                      "IsName": false

                    });

                    //Propuesta
                    dataTotal[0].proposed = parseFloat(dataTotal[0].approved);// + parseFloat(jsonFacilidades.CP);
                    dataTotal[1].proposed = parseFloat(dataTotal[1].currentBalance);// + parseFloat(jsonFacilidades.LP);
                    //Diferencias
                    dataTotal[0].difference = parseFloat(dataTotal[0].proposed) - parseFloat(dataTotal[0].approved);
                    dataTotal[1].difference = parseFloat(dataTotal[1].proposed) - parseFloat(dataTotal[1].currentBalance);
                    //LTVs                    
                    dataTotal[0].ltv = dataTotal[0].guarantee > 0 ? parseFloat(dataTotal[0].proposed) / parseFloat(dataTotal[0].guarantee) * 100 : 0;
                    dataTotal[1].ltv = dataTotal[1].guarantee > 0 ? parseFloat(dataTotal[1].proposed) / parseFloat(dataTotal[1].guarantee) * 100 : 0;

                    /* Debtor Comercial Exposure */
                    allDataTotal.push({
                      "transactId": 0,
                      "exhibitionId": 0,
                      "description": datosLista[i][0].accountNumber.toUpperCase(),
                      "approved": dataTotal[0].approved + dataTotal[1].approved,
                      "currentBalance": dataTotal[0].currentBalance + dataTotal[1].currentBalance,
                      "proposed": dataTotal[0].proposed + dataTotal[1].proposed,
                      "ltv": dataTotal[0].ltv + dataTotal[1].ltv,
                      "difference": dataTotal[0].difference + dataTotal[1].difference,
                      "guarantee": dataTotal[0].guarantee + dataTotal[1].guarantee,
                      "status": true,
                      "IsName": true,
                      type: 'ComercialExposure',
                      nameType: t("Commercial Gross Exposure").toUpperCase()
                    });

                    allDataTotal.push(dataTotal[0]);
                    allDataTotal.push(dataTotal[1]);

                  }

                  /* Total Comercial Exposure */
                  allDataTotal.push({
                    "description": t("Commercial Gross Exposure").toUpperCase(),
                    "approved": allDataTotal.reduce((acu, crr) => acu + ('ComercialExposure' === crr.type ? crr.approved ?? 0 : 0), 0),
                    "currentBalance": allDataTotal.reduce((acu, crr) => acu + ('ComercialExposure' === crr.type ? crr.currentBalance ?? 0 : 0), 0),
                    "proposed": allDataTotal.reduce((acu, crr) => acu + ('ComercialExposure' === crr.type ? crr.proposed ?? 0 : 0), 0),
                    "ltv": allDataTotal.reduce((acu, crr) => acu + ('ComercialExposure' === crr.type ? crr.ltv ?? 0 : 0), 0),
                    "difference": allDataTotal.reduce((acu, crr) => acu + ('ComercialExposure' === crr.type ? crr.difference ?? 0 : 0), 0) ?? 0,
                    "guarantee": allDataTotal.reduce((acu, crr) => acu + ('ComercialExposure' === crr.type ? crr.guarantee ?? 0 : 0), 0),
                    "status": true,
                    "IsName": false,
                    IsTotal: true,
                    type: 'ComercialExposure'
                  });

                  /* Section Exposure Consumption */
                  for (let i = 0; i < datosLista.length; i++) {
                    let dataTotal = []

                    /* Exposure Consumption */
                    dataTotal.push(datosLista[i].find(x => x.description.toUpperCase() == "Facilidades de Consumo".toUpperCase()) ?? {
                      "transactId": 0,
                      "exhibitionId": 0,
                      "description": "Facilidades de Consumo".toUpperCase(),
                      "approved": 0,
                      "currentBalance": 0,
                      "proposed": 0,
                      "ltv": 0,
                      "difference": 0,
                      "guarantee": 0,
                      "status": true,
                      "IsName": false,
                      type: 'ExposureConsumption',

                    });
                    dataTotal.push(datosLista[i].find(x => x.description.toUpperCase() == "Prendario de Consumo".toUpperCase()) ?? {
                      "transactId": 0,
                      "exhibitionId": 0,
                      "description": "Prendario de Consumo".toUpperCase(),
                      "approved": 0,
                      "currentBalance": 0,
                      "proposed": 0,
                      "ltv": 0,
                      "difference": 0,
                      "guarantee": 0,
                      "status": true,
                      "IsName": false,
                      type: 'ExposureConsumption',

                    });
                    /* End Exposure Consumption */


                    /* Debtor Exposure Consumption */
                    allDataTotal.push({
                      "transactId": 0,
                      "exhibitionId": 0,
                      "description": datosLista[i][0].accountNumber.toUpperCase(),
                      "approved": dataTotal[0].approved + dataTotal[1].approved,
                      "currentBalance": dataTotal[0].currentBalance + dataTotal[1].currentBalance,
                      "proposed": dataTotal[0].proposed + dataTotal[1].proposed,
                      "ltv": dataTotal[0].ltv + dataTotal[1].ltv,
                      "difference": dataTotal[0].difference + dataTotal[1].difference,
                      "guarantee": dataTotal[0].guarantee + dataTotal[1].guarantee,
                      "status": true,
                      "IsName": true,
                      type: 'ExposureConsumption',
                      nameType: t("Gross Exposure Consumption").toUpperCase()
                    });

                    allDataTotal.push(dataTotal[0]);
                    allDataTotal.push(dataTotal[1]);
                  }

                  /* Total Comercial Exposure */
                  allDataTotal.push({
                    "description": t("Gross Exposure Consumption").toUpperCase(),
                    "approved": allDataTotal.reduce((acu, crr) => acu + ('ExposureConsumption' === crr.type ? crr.approved ?? 0 : 0), 0),
                    "currentBalance": allDataTotal.reduce((acu, crr) => acu + ('ExposureConsumption' === crr.type ? crr.currentBalance ?? 0 : 0), 0),
                    "proposed": allDataTotal.reduce((acu, crr) => acu + ('ExposureConsumption' === crr.type ? crr.proposed ?? 0 : 0), 0),
                    "ltv": allDataTotal.reduce((acu, crr) => acu + ('ExposureConsumption' === crr.type ? crr.ltv ?? 0 : 0), 0),
                    "difference": allDataTotal.reduce((acu, crr) => acu + ('ExposureConsumption' === crr.type ? crr.difference ?? 0 : 0), 0) ?? 0,
                    "guarantee": allDataTotal.reduce((acu, crr) => acu + ('ExposureConsumption' === crr.type ? crr.guarantee ?? 0 : 0), 0),
                    "status": true,
                    "IsName": false,
                    IsTotal: true,
                    type: 'ExposureConsumption'
                  });

                  /* Total Group Economic */
                  allDataTotal.push({
                    "description": t("Gross Exposure of the Economic Group").toUpperCase(),
                    "approved": 0,
                    "currentBalance": 0,
                    "proposed": 0,
                    "ltv": 0,
                    "difference": 0,
                    "guarantee": 0,
                    "status": true,
                    "IsName": false,
                    IsTotal: true,
                  });


                  console.log(allDataTotal)


                  setdataRows(allDataTotal.map((item, index) => {
                    if (item.IsName) {
                      return <tr key={'row-' + index} style={{ fontWeight: "bold" }}>
                        <td scope="row" width="30%">{item.description}</td>
                        <td scope="row" className="table-right">${currencyData.formatTable(item.approved, 0)}</td>
                        <td scope="row" className="table-right">${currencyData.formatTable(item.currentBalance, 0)}</td>
                        <td scope="row" className="table-right">${currencyData.formatTable(item.proposed, 0)}</td>
                        <td scope="row" className="table-right">${currencyData.formatTable(item.difference, 0)}</td>
                        <td scope="row" className="table-right">${currencyData.formatTable(item.guarantee ?? 0, 0)}</td>
                        <td scope="row" className="table-right">{currencyData.formatTable(item.ltv, 0)}%</td>
                      </tr>
                    }
                    return <tr key={'row-' + index} style={item.description == "TOTAL DE FACILIDADES" || item.description == "EXPOSICION NETA" || item.IsTotal ? { fontWeight: "bold" } : {}}>
                      <td scope="row" width="30%">{item.description}</td>
                      <td scope="row" className="table-right">${currencyData.formatTable(item.approved, 0)}</td>
                      <td scope="row" className="table-right">${currencyData.formatTable(item.currentBalance, 0)}</td>
                      <td scope="row" className="table-right">${currencyData.formatTable(item.proposed, 0)}</td>
                      <td scope="row" className="table-right">${currencyData.formatTable(item.difference, 0)}</td>
                      <td scope="row" className="table-right">${currencyData.formatTable(item.guarantee ?? 0, 0)}</td>
                      <td scope="row" className="table-right">{currencyData.formatTable(item.ltv, 0)}%</td>
                    </tr>
                  })
                  )


                  //setExposicionCorportativa(resp.length > 0 ? resp : null);

                }
              })
            }
          });
      });

  }


  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <h5 className="card-title">{props.title}</h5>
          <p className="card-title-desc">
          </p>
          <Col md="12" className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table" >
              <thead>
                <tr>
                  <th className="table-right"></th>
                  <th className="table-right">{t("Approved Amount")}</th>
                  <th className="table-right">{t("Debit")}</th>
                  <th className="table-right">{t("Proposal")}</th>
                  <th className="table-right">{t("Difference")}</th>
                  <th className="table-right">{t("Garantía")}</th>
                  <th className="table-right">{t("LTV")}</th>
                </tr>
              </thead>
              <tbody>
                {dataRows}
                {dataRows2}
                {/* <tr>
                  <th scope="row" width="30%">{t("Total")}</th>
                  <th scope="row" className="table-right">{currencyData.formatTable(CorporateExposure?.reduce((acu, crr) => {
                    let data1 = (acu.data?.reduce((acu2, crr2) => ((acu2.approvalRisk ?? acu2) + crr2.approvalRisk)) ?? acu);
                    let data2 = crr.data?.reduce((acu2, crr2) => ((acu2.approvalRisk ?? acu2) + crr2.approvalRisk));
                    return (data1 + data2)
                  }), 0)}</th>
                  <th scope="row" className="table-right">{currencyData.formatTable(CorporateExposure?.reduce((acu, crr) => {
                    let data1 = (acu.data?.reduce((acu2, crr2) => ((acu2.variationRisk ?? acu2) + crr2.variationRisk)) ?? acu);
                    let data2 = crr.data?.reduce((acu2, crr2) => ((acu2.variationRisk ?? acu2) + crr2.variationRisk));
                    return (data1 + data2)
                  }), 0)}</th>
                  <th scope="row" className="table-right">{currencyData.formatTable(CorporateExposure?.reduce((acu, crr) => {
                    let data1 = (acu.data?.reduce((acu2, crr2) => ((acu2.proposalRisk ?? acu2) + crr2.proposalRisk)) ?? acu);
                    let data2 = crr.data?.reduce((acu2, crr2) => ((acu2.proposalRisk ?? acu2) + crr2.proposalRisk));
                    return (data1 + data2)
                  }), 0)}</th>
                </tr> */}
              </tbody>
            </Table>
          </Col>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};
ExposicionCorporativaClientes.propTypes = {
  title: PropTypes.string,
  customerNumberT24: PropTypes.string,
};
export default ExposicionCorporativaClientes;
