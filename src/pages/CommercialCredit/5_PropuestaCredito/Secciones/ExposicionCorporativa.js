import PropTypes from 'prop-types';
import { formatCurrency, translationHelpers } from '../../../../helpers';
import {
  Table,
  Card,
  CardBody,
  Col,
} from "reactstrap"
import { BackendServices, CoreServices, BpmServices, } from "../../../../services";
import React, { useEffect, useState } from "react"
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory } from 'react-router-dom';
import * as url from "../../../../helpers/url_helper"
import Currency from '../../../../helpers/currency';
const estiloTotales = { backgroundColor: "lightgrey", color: "black" }
const ExposicionCorportativa = (props) => {
  const location = useLocation();
  const history = useHistory();
  const [locationData, setLocationData] = useState(null);
  const coreServices = new CoreServices();
  const { t, i18n } = useTranslation();
  const [dataRows, setdataRows] = React.useState(null);
  const [dataRows2, setdataRows2] = React.useState(null);
  const [dataRows3, setdataRows3] = React.useState(null);
  const [ExposicionCorportativa, setExposicionCorportativa] = useState(null);
  const [ExposicionCorportativaFacilidades, setExposicionCorportativaFacilidades] = useState(null);
  const [customerNumberT24, setcustomerNumberT24] = React.useState(props.customerNumberT24);
  const currencyData = new Currency();

  const backendServices = new BackendServices();

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
    loadFacilities();
  }, [props.activeTab == 2]);
  useEffect(() => {

    setdataRows3(<tr style={estiloTotales}>
      <th scope="row" width="30%">{t("Total")}</th>
      <th scope="row" className="table-right">{currencyData.formatTable(ExposicionCorportativa?.reduce((acu, crr) => (acu + crr.approved), 0) || 0)}</th>
      <th scope="row" className="table-right">0</th>
      <th scope="row" className="table-right">{currencyData.formatTable(ExposicionCorportativa?.reduce((acu, crr) => (acu + crr.currentBalance), 0) || 0 + ExposicionCorportativaFacilidades?.reduce((acu, crr) => (acu + crr.currentBalance), 0) || 0)}</th>
      <th scope="row" className="table-right">{currencyData.formatTable(ExposicionCorportativa?.reduce((acu, crr) => (acu + crr.proposed), 0) || 0 + ExposicionCorportativaFacilidades?.reduce((acu, crr) => (acu + crr.proposed), 0) || 0)}</th>
      <th scope="row" className="table-right">$0.00</th>
      <th scope="row" className="table-right"></th>
    </tr>)
  }, [ExposicionCorportativa, ExposicionCorportativaFacilidades]);

  async function getCoporateExhibition(dataSession) {

    console.log("hello");
    await RecalculatePledges(dataSession.transactionId);

    await backendServices.consultPrincipalDebtor(dataSession.transactionId)
      .then(async (data) => {
        await backendServices.consultGeneralDataPropCred(dataSession.transactionId)
          .then(async (propuesta) => {
            if (data !== undefined) {
              await backendServices.consultarFacilidadesExposicionCorporativa(propuesta[0]?.requestId ?? "").then(async facilidades => {
                 let jsonFacilidades = {
                  CP: facilidades?.CP.reduce((acu, crr) => (acu + crr.requestAmount), 0) || 0,
                  LP: facilidades?.LP.reduce((acu, crr) => (acu + crr.requestAmount), 0) || 0,
                }
                console.log("consultarFacilidadesExposicionCorporativa",jsonFacilidades);
                await backendServices.getExposicionCorporativaBD(dataSession.transactionId).then(async resp => {
                  if (resp.length > 0) {
                    // resp = [
                    //   {
                    //     "transactId": 4891,
                    //     "exhibitionId": 385,
                    //     "description": "EXPOSICION NETA",
                    //     "approved": 10000,
                    //     "currentBalance": 20000,
                    //     "proposed": 30000,
                    //     "ltv": 45,
                    //     "difference": 40000,
                    //     "guarantee": 450,
                    //     "status": true
                    //   },
                    //   {
                    //     "transactId": 4891,
                    //     "exhibitionId": 384,
                    //     "description": "MONTO PIGNORADO",
                    //     "approved": 40000,
                    //     "currentBalance": 40000,
                    //     "proposed": 2000,
                    //     "ltv": 60,
                    //     "difference": 4500,
                    //     "guarantee": 5000,
                    //     "status": true
                    //   },
                    //   {
                    //     "transactId": 4891,
                    //     "exhibitionId": 383,
                    //     "description": "TOTAL DE FACILIDADES",
                    //     "approved": 3000,
                    //     "currentBalance": 46000,
                    //     "proposed": 6000,
                    //     "ltv": 40,
                    //     "difference": 40000,
                    //     "guarantee": 1400,
                    //     "status": true
                    //   },
                    //   {
                    //     "transactId": 4891,
                    //     "exhibitionId": 382,
                    //     "description": "FACILIDADES CORTO PLAZO",
                    //     "approved": 80000,
                    //     "currentBalance": 90000,
                    //     "proposed": 36000,
                    //     "ltv": 6,
                    //     "difference": 95000,
                    //     "guarantee": 14000,
                    //     "status": true
                    //   },
                    //   {
                    //     "transactId": 4891,
                    //     "exhibitionId": 381,
                    //     "description": "FACILIDADES LARGO PLAZO",
                    //     "approved": 59000,
                    //     "currentBalance": 4000,
                    //     "proposed": 60000,
                    //     "ltv": 50,
                    //     "difference": 40000,
                    //     "guarantee": 6500,
                    //     "status": true
                    //   }
                    // ]
                    let dataTotal = []
                    dataTotal.push(resp.find(x => x.description.toUpperCase() == "Facilidades Corto Plazo".toUpperCase()) ?? {
                      "transactId": 0,
                      "exhibitionId": 0,
                      "description": "Facilidades Corto Plazo".toUpperCase(),
                      "approved": 0,
                      "currentBalance": 0,
                      "proposed": 0,
                      "guarantee": 0,
                      "ltv": 0,
                      "difference": 0,
                      "status": true
                    });
                    dataTotal.push(resp.find(x => x.description.toUpperCase() == "Facilidades Largo Plazo".toUpperCase()) ?? {
                      "transactId": 0,
                      "exhibitionId": 0,
                      "description": "Facilidades Largo Plazo".toUpperCase(),
                      "approved": 0,
                      "currentBalance": 0,
                      "proposed": 0,
                      "ltv": 0,
                      "difference": 0,
                      "guarantee": 0,
                      "status": true
                    });
                    dataTotal.push(resp.find(x => x.description.toUpperCase() == "Total de Facilidades".toUpperCase()) ?? {
                      "transactId": 0,
                      "exhibitionId": 0,
                      "description": "Total de Facilidades".toUpperCase(),
                      "approved": 0,
                      "currentBalance": 0,
                      "proposed": 0,
                      "ltv": 0,
                      "difference": 0,
                      "guarantee": 0,
                      "status": true
                    });
                    dataTotal.push(resp.find(x => x.description.toUpperCase() == "Monto Pignorado".toUpperCase()) ?? {
                      "transactId": 0,
                      "exhibitionId": 0,
                      "description": "Monto Pignorado".toUpperCase(),
                      "approved": 0,
                      "currentBalance": 0,
                      "proposed": 0,
                      "ltv": 0,
                      "difference": 0,
                      "guarantee": 0,
                      "status": true
                    });
                    dataTotal.push(resp.find(x => x.description.toUpperCase() == "Exposicion Neta".toUpperCase()) ?? {
                      "transactId": 0,
                      "exhibitionId": 0,
                      "description": "Exposicion Neta".toUpperCase(),
                      "approved": 0,
                      "currentBalance": 0,
                      "proposed": 0,
                      "ltv": 0,
                      "guarantee": 0,
                      "difference": 0,
                      "status": true
                    });

                    dataTotal.push(resp.find(x => x.description.toUpperCase() == "Total de Facilidades consumo".toUpperCase()) ?? {
                      "transactId": 0,
                      "exhibitionId": 0,
                      "description": "Total de Facilidades consumo".toUpperCase(),
                      "approved": 0,
                      "currentBalance": 0,
                      "proposed": 0,
                      "ltv": 0,
                      "guarantee": 0,
                      "difference": 0,
                      "status": true
                    });
                    dataTotal.push(resp.find(x => x.description.toUpperCase() == "Total Prendario consumo".toUpperCase()) ?? {
                      "transactId": 0,
                      "exhibitionId": 0,
                      "description": "Total Prendario consumo".toUpperCase(),
                      "approved": 0,
                      "currentBalance": 0,
                      "proposed": 0,
                      "ltv": 0,
                      "guarantee": 0,
                      "difference": 0,
                      "status": true
                    });
                    dataTotal.push(resp.find(x => x.description.toUpperCase() == "Exposición Neta consumo".toUpperCase()) ?? {
                      "transactId": 0,
                      "exhibitionId": 0,
                      "description": "Exposición Neta consumo".toUpperCase(),
                      "approved": 0,
                      "currentBalance": 0,
                      "proposed": 0,
                      "ltv": 0,
                      "guarantee": 0,
                      "difference": 0,
                      "status": true
                    });
                    dataTotal.push(resp.find(x => x.description.toUpperCase() == "Exposición Neta del Grupo Económico".toUpperCase()) ?? {
                      "transactId": 0,
                      "exhibitionId": 0,
                      "description": "Exposición Neta del Grupo Económico".toUpperCase(),
                      "approved": 0,
                      "currentBalance": 0,
                      "proposed": 0,
                      "ltv": 0,
                      "guarantee": 0,
                      "difference": 0,
                      "status": true
                    });
                    //Propuesta
                    dataTotal[0].proposed = parseFloat(dataTotal[0].approved) + parseFloat(jsonFacilidades.CP);
                    dataTotal[1].proposed = parseFloat(dataTotal[1].currentBalance) + parseFloat(jsonFacilidades.LP);
                    //Diferencias
                    dataTotal[0].difference = parseFloat(dataTotal[0].proposed) - parseFloat(dataTotal[0].approved);
                    dataTotal[1].difference = parseFloat(dataTotal[1].proposed) - parseFloat(dataTotal[1].currentBalance);
                    //LTVs                    
                    dataTotal[0].ltv = dataTotal[0].guarantee > 0 ? parseFloat(dataTotal[0].proposed) / parseFloat(dataTotal[0].guarantee) * 100 : 0;
                    dataTotal[1].ltv = dataTotal[1].guarantee > 0 ? parseFloat(dataTotal[1].proposed) / parseFloat(dataTotal[1].guarantee) * 100 : 0;
                    //Total de Facilidades
                    dataTotal[2].approved = parseFloat(dataTotal[0].approved) + parseFloat(dataTotal[1].approved);
                    dataTotal[2].currentBalance = parseFloat(dataTotal[0].currentBalance) + parseFloat(dataTotal[1].currentBalance);
                    dataTotal[2].proposed = parseFloat(dataTotal[0].proposed) + parseFloat(dataTotal[1].proposed);
                    dataTotal[2].difference = parseFloat(dataTotal[0].difference) + parseFloat(dataTotal[1].difference);
                    dataTotal[2].guarantee = parseFloat(dataTotal[0].guarantee) + parseFloat(dataTotal[1].guarantee);
                    dataTotal[2].ltv = dataTotal[2].guarantee > 0 ? parseFloat(dataTotal[2].proposed) / parseFloat(dataTotal[2].guarantee) * 100 : 0;
                    //Exposicion Neta
                    dataTotal[4].approved = parseFloat(dataTotal[2].approved) - parseFloat(dataTotal[3].approved);
                    dataTotal[4].currentBalance = parseFloat(dataTotal[2].currentBalance) - parseFloat(dataTotal[3].currentBalance);
                    dataTotal[4].proposed = parseFloat(dataTotal[2].proposed) - parseFloat(dataTotal[3].proposed);
                    dataTotal[4].difference = parseFloat(dataTotal[2].difference) - parseFloat(dataTotal[3].difference);
                    dataTotal[4].guarantee = parseFloat(dataTotal[2].guarantee) - parseFloat(dataTotal[3]?.guarantee ?? 0);
                    dataTotal[4].ltv = dataTotal[4].guarantee > 0 ? parseFloat(dataTotal[4].proposed) / parseFloat(dataTotal[4].guarantee) * 100 : 0;


                    console.log(resp);
                    setdataRows(dataTotal.map((item, index) => (
                      <tr key={'row-' + index} style={item.description == "TOTAL DE FACILIDADES" || item.description == "EXPOSICION NETA" ? { fontWeight: "bold" } : {}}>
                        <td scope="row" width="30%">{item.description}</td>
                        <td scope="row" className="table-right">${currencyData.formatTable(item.approved, 0)}</td>
                        <td scope="row" className="table-right">${currencyData.formatTable(item.currentBalance, 0)}</td>
                        <td scope="row" className="table-right">${currencyData.formatTable(item.proposed, 0)}</td>
                        <td scope="row" className="table-right">${currencyData.formatTable(item.difference, 0)}</td>
                        <td scope="row" className="table-right">${currencyData.formatTable(item.guarantee ?? 0, 0)}</td>
                        <td scope="row" className="table-right">{currencyData.formatTable(item.ltv, 0)}%</td>
                      </tr>
                    ))
                    )
                    setExposicionCorportativa(resp.length > 0 ? resp : null);
                    // setdataRows(dataTotal.map((item, index) => (
                    //   item.description.toUpperCase() == "Total de Facilidades".toUpperCase() ?
                    //     <tr style={{ fontWeight: "bold" }} key={'row-' + index}>
                    //       {/* <td scope="row" width="30%">{item.description}</td>
                    //       <td scope="row" className="table-right">${currencyData.formatTable(item.approved, 0)}</td>
                    //       <td scope="row" className="table-right">${currencyData.formatTable(dataTotal.reduce((acu, crr) => (crr.description.toUpperCase() == "Facilidades Corto Plazo".toUpperCase() || crr.description.toUpperCase() == "Facilidades Largo Plazo".toUpperCase() ? acu + crr.currentBalance : acu + 0), 0) || 0, 0)}</td>
                    //       <td scope="row" className="table-right">${currencyData.formatTable((parseFloat(item.approved) + parseFloat(jsonFacilidades.CP)) + (parseFloat(jsonFacilidades.LP)), 0)}</td>
                    //       <td scope="row" className="table-right">${currencyData.formatTable(((parseFloat(item.approved) + parseFloat(jsonFacilidades.CP)) - parseFloat(item.approved)) + ((parseFloat(jsonFacilidades.LP))), 0)}</td>
                    //       <td scope="row" className="table-right">-</td>
                    //       <td scope="row" className="table-right">{currencyData.formatTable(item.ltv, 0)}</td> */}
                    //     </tr>
                    //     : item.description.toUpperCase() == "Exposicion Neta".toUpperCase() ?
                    //       <tr style={{ fontWeight: "bold" }} key={'row-' + index}>
                    //         <td scope="row" width="30%">{item.description}</td>
                    //         <td scope="row" className="table-right">${currencyData.formatTable(dataTotal.reduce(
                    //           (acu, crr) => (crr.description.toUpperCase() == "Facilidades Corto Plazo".toUpperCase() || crr.description.toUpperCase() == "Facilidades Largo Plazo".toUpperCase() ? acu + crr.approved : crr.description.toUpperCase() == "MONTO PIGNORADO".toUpperCase() ? acu - crr.approved : acu + 0), 0) || 0, 0)}</td>
                    //         {/* Sumatria para saldos */}
                    //         <td scope="row" className="table-right">${
                    //           currencyData.formatTable(dataTotal.reduce((acu, crr) =>
                    //           (crr.description.toUpperCase() == "Facilidades Corto Plazo".toUpperCase() || crr.description.toUpperCase() == "Facilidades Largo Plazo".toUpperCase()
                    //             ? acu + crr.currentBalance :
                    //             crr.description.toUpperCase() == "MONTO PIGNORADO".toUpperCase() ?
                    //               acu - crr.currentBalance :
                    //               acu + 0), 0) || 0, 0)}
                    //         </td>
                    //         {/* Sumatria para montos de propuesta */}
                    //         <td scope="row" className="table-right">$
                    //           {currencyData.formatTable(dataTotal.reduce((acu, crr) =>
                    //           (crr.description.toUpperCase() == "Facilidades Corto Plazo".toUpperCase() || crr.description.toUpperCase() == "Facilidades Largo Plazo".toUpperCase() ?
                    //             acu + crr.approved : acu + 0), 0) + jsonFacilidades.CP + jsonFacilidades.LP -
                    //             (dataTotal.find(x => x.description == "MONTO PIGNORADO")?.difference ?? 0)
                    //             || 0)}
                    //         </td>
                    //         {/* Sumatoria para diferencia*/}
                    //         <td scope="row" className="table-right">${currencyData.formatTable(
                    //           dataTotal.reduce((acu, crr) => (
                    //             crr.description.toUpperCase() == "Facilidades Largo Plazo".toUpperCase() ?
                    //               acu + (crr.approved - crr.currentBalance) : acu + 0
                    //           ), 0) + jsonFacilidades.CP + jsonFacilidades.LP -
                    //           (dataTotal.find(x => x.description == "MONTO PIGNORADO")?.difference ?? 0)
                    //           || 0, 0)}
                    //         </td>
                    //         <td scope="row" className="table-right">-</td>
                    //         <td scope="row" className="table-right">{currencyData.formatTable(item.ltv, 0)}</td>
                    //       </tr>
                    //       :
                    //       <tr key={'row-' + index}>
                    //         {/* <td scope="row" width="30%">{item.description}</td>
                    //         <td scope="row" className="table-right">${currencyData.formatTable(item.approved, 0)}</td>
                    //         <td scope="row" className="table-right">${currencyData.formatTable(item.currentBalance, 0)}</td>
                    //         <td scope="row" className="table-right">${
                    //           item.description.toUpperCase() == "Facilidades Corto Plazo".toUpperCase() ?
                    //             currencyData.formatTable(parseFloat(item.approved) + parseFloat(jsonFacilidades.CP), 0)
                    //             :
                    //             item.description.toUpperCase() == "Facilidades Largo Plazo".toUpperCase() ? currencyData.formatTable(parseFloat(item.approved) + parseFloat(jsonFacilidades.LP), 0)
                    //               :
                    //               currencyData.formatTable(parseFloat(item.proposed), 0)
                    //         }</td>
                    //         <td scope="row" className="table-right">${
                    //           item.description.toUpperCase() == "Facilidades Corto Plazo".toUpperCase() ?
                    //             currencyData.formatTable((parseFloat(item.approved) + parseFloat(jsonFacilidades.CP)) - parseFloat(item.approved), 0)
                    //             :
                    //             item.description.toUpperCase() == "Facilidades Largo Plazo".toUpperCase() ? currencyData.formatTable(((parseFloat(item.approved) + parseFloat(jsonFacilidades.LP)) - parseFloat(item.currentBalance)), 0)
                    //               :
                    //               item.description.toUpperCase() == "MONTO PIGNORADO".toUpperCase() ? currencyData.formatTable(((parseFloat(item.difference))), 0)
                    //                 :
                    //                 currencyData.formatTable(parseFloat(item.proposed), 0)
                    //         }</td>
                    //         <td scope="row" className="table-right">-</td>
                    //         <td scope="row" className="table-right">{currencyData.formatTable(item.ltv, 0)}</td> */}
                    //       </tr>
                    // )
                    // ));
                  } else {
                    if (props?.validacion) {
                      return
                    }
                    /*
                    else {
                      // Consultamos T24 para guardar
                      await coreServices.getCorporateExhibition(dataSession.transactionId).then(async resp2 => {
                        if (resp2 != undefined) {
                          for (let i = 0; i < resp2.length; i++) {
                            let datoSent = {
                              "transactId": Number(dataSession.transactionId),
                              "accountNumber": data.name,
                              "t24ClientId": data.customerNumberT24,
                              "description": resp2[i].name,
                              "approved": resp2[i].approved,
                              "currentBalance": resp2[i].balance,
                              "proposed": resp2[i].proposal,
                              "ltv": 0,
                              "difference": 0
                            }
                            backendServices.saveExposicionCorporativaBD(datoSent).then(saveExpo => {
    
                            })
                          }
                        }
                        await backendServices.getExposicionCorporativaBD(dataSession.transactionId).then(async exposision => {
                          setExposicionCorportativa(exposision.length > 0 ? exposision : null);
                          let dataTotal = []
                          dataTotal.push(exposision.find(x => x.description.toUpperCase() == "Facilidades Corto Plazo".toUpperCase()));
                          dataTotal.push(exposision.find(x => x.description.toUpperCase() == "Facilidades Largo Plazo".toUpperCase()));
                          dataTotal.push(exposision.find(x => x.description.toUpperCase() == "Total de Facilidades".toUpperCase()));
                          dataTotal.push(exposision.find(x => x.description.toUpperCase() == "Monto Pignorado".toUpperCase()));
                          dataTotal.push(exposision.find(x => x.description.toUpperCase() == "Exposicion Neta".toUpperCase()));
                          setdataRows(dataTotal.map((item, index) => (
    
                            item.description.toUpperCase() == "Total de Facilidades".toUpperCase() || item.description.toUpperCase() == "Exposicion Neta".toUpperCase() ?
                              <tr style={{ fontWeight: "bold" }} key={'row-' + index}>
                                <td scope="row" width="30%">{item.description}</td>
                                <td scope="row" className="table-right">${currencyData.formatTable(item.approved, 0)}</td>
                                <td scope="row" className="table-right">${currencyData.formatTable(dataTotal.reduce((acu, crr) => (crr.description.toUpperCase() == "Facilidades Corto Plazo".toUpperCase() || crr.description.toUpperCase() == "Facilidades Largo Plazo".toUpperCase() ? acu + crr.currentBalance : acu + 0), 0) || 0, 0)}</td>
                                <td scope="row" className="table-right">${currencyData.formatTable((parseFloat(item.currentBalance) + parseFloat(jsonFacilidades.CP)) + (parseFloat(item.currentBalance) + parseFloat(jsonFacilidades.LP)), 0)}</td>
                                <td scope="row" className="table-right">${
                                  currencyData.formatTable(((parseFloat(item.proposed) + parseFloat(jsonFacilidades.CP)) - parseFloat(item.approved)) + (parseFloat(item.proposed) + parseFloat(jsonFacilidades.LP) - parseFloat(item.currentBalance)), 0)
                                }</td>
                                <td scope="row" className="table-right">-</td>
                                <td scope="row" className="table-right">{currencyData.formatTable(item.ltv, 0)}</td>
                              </tr>
                              : <tr key={'row-' + index}>
                                <td scope="row" width="30%">{item.description}</td>
                                <td scope="row" className="table-right">${currencyData.formatTable(item.approved, 0)}</td>
                                <td scope="row" className="table-right">${currencyData.formatTable(item.currentBalance, 0)}</td>
                                <td scope="row" className="table-right">${
                                  item.description.toUpperCase() == "Facilidades Corto Plazo".toUpperCase() ?
                                    currencyData.formatTable(parseFloat(item.proposed) + parseFloat(jsonFacilidades.CP), 0)
                                    :
                                    item.description.toUpperCase() == "Facilidades Largo Plazo".toUpperCase() ? currencyData.formatTable(parseFloat(item.proposed) + parseFloat(jsonFacilidades.LP), 0)
                                      :
                                      currencyData.formatTable(parseFloat(item.proposed), 0)
                                }</td>
                                
                                <td scope="row" className="table-right">${
                                  item.description.toUpperCase() == "Facilidades Corto Plazo".toUpperCase() ?
                                    currencyData.formatTable((parseFloat(item.proposed) + parseFloat(jsonFacilidades.CP)) - parseFloat(item.approved), 0)
                                    :
                                    item.description.toUpperCase() == "Facilidades Largo Plazo".toUpperCase() ? currencyData.formatTable((parseFloat(item.proposed) + parseFloat(jsonFacilidades.LP) - parseFloat(item.currentBalance)), 0)
                                      :
                                      currencyData.formatTable(parseFloat(item.proposed), 0)
                                }</td>
                                <td scope="row" className="table-right">-</td>
                                <td scope="row" className="table-right">{currencyData.formatTable(item.ltv, 0)}</td>
                              </tr>
                          )
                          ));
                        })
                      });
                    }
                    */
                  }
                })
              })
            }
          });
      });

  }

  function loadFacilities() {
    // backendServices.retrieveFacilityType()
    //   .then((facilidad) => {
    //     backendServices.consultarFacilidades(props.dataGlobal.requestId).then(resp => {
    //       console.log(resp);
    //       if (resp?.filter(data => data.debtor != "  ").length > 0) {
    //       } else {

    //       }
    //     });
    //   })
  }

  async function RecalculatePledges(transactId) {

    await backendServices.recalculateExposicionCorporativa(transactId);

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

              </tbody>
            </Table>
          </Col>
        </CardBody>
      </Card>
    </React.Fragment >
  );
};
ExposicionCorportativa.propTypes = {
  title: PropTypes.string,
  customerNumberT24: PropTypes.string,
};
export default ExposicionCorportativa;
