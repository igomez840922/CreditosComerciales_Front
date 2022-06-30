import React, { useState, useContext, useRef, useEffect } from "react"
import PropTypes from 'prop-types';
import { formatCurrency, translationHelper } from '../../../helpers';

import {
  Table,
} from "reactstrap"
import HeaderSections from '../../Common/HeaderSections';
import { BackendServices } from '../../../services';
import { useLocation, useHistory } from 'react-router-dom';
import * as url from "../../../helpers/url_helper"
import Currency from "../../../helpers/currency";
import { useTranslation } from "react-i18next";


const FacilityDetails = (props) => {

  console.log(props);
  // const t = translationHelper('financial_report');

  const [dataRows, setdataRows] = useState(null);

  const api = new BackendServices();
  const location = useLocation()
  const [locationData, setLocationData] = useState(null);
  const history = useHistory();
  const currencyData = new Currency();
  const { t, i18n } = useTranslation();

  React.useEffect(() => {

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

    // Read Api Service data
    cargarFacilidades(dataSession)
  }, []);


  function cargarFacilidades(dataSession) {
    api.consultarDeudores(dataSession.transactionId)
      .then((data2) => {
        if (data2 !== null && data2 !== undefined) {
          let jsonDeudores = [];
          for (let i = 0; i < data2.length; i++) {
            jsonDeudores.push({ label: data2[i]["name"] + " " + data2[i]["name2"] + " " + data2[i]["lastName"] + " " + data2[i]["lastName2"], value: data2[i]["personId"] })
          }
          api.consultGeneralDataPropCred(dataSession.transactionId).then((data) => {
            if (data !== undefined) {
              var datosgenerales = data.length == 0 ? undefined : data[0].requestId;
              if (datosgenerales === undefined || datosgenerales == null) {
                datosgenerales = data[data.length - 1];
                return;
              }
              api.retrieveProposalType().then((propuesta) => {
                api.retrieveFacilityType().then((facilidad) => {
                  api.consultarFacilidades(datosgenerales).then(resp => {
                    let acu = 0;
                    if (resp?.filter(data => data.debtor != "  ").length > 0) {
                      // initializeData(dataSession);
                      setdataRows(resp.map((data, index) => {
                        acu++;
                        return (
                          <tr key={acu}>
                            <td data-label={t("Facility")}>{acu}</td>
                            {/* <td>{data.debtor}</td> */}
                            <td data-label={t("Debtor")}>{jsonDeudores.find(x => x.value === Number(data.debtor))?.label}</td>
                            <td data-label={t("Facility Type")}>{facilidad.find(x => x.id === data.facilityTypeId)?.description}</td>
                            <td data-label={t("Proposal")}>{propuesta.find(x => x.id === data.proposalTypeId)?.description}</td>
                            <td data-label={t("Approved Risk")}>{currencyData.format(data.amount ?? 0)}</td>
                            <td data-label={t("Amount") + " " + t("Rate")}>{data.proposalRate}%</td>
                          </tr>)
                      }
                      ));
                    } else {
                      setdataRows(
                        <tr key={1}>
                          <td colSpan="7" style={{ textAlign: 'center' }}></td>
                        </tr>);
                    }
                  });
                })
              })
            }
            else {
            }
          });

        }

      })
      .catch((error) => {
        console.error('api error: ', error);
      });
  }

  return (
    <div className="table-responsive">
      {/* <h5>{t("FacilityDetails.Title")}</h5> */}
      <HeaderSections title="Facility details" t={t}></HeaderSections>

      <div className="table-responsive styled-table-div">
        <Table className="table table-striped table-hover styled-table table" >
          <thead>
            <tr>
              <th>{t("Facility")}</th>
              <th>{t("Debtor")}</th>
              <th>{t("Facility Type")}</th>
              <th>{t("Proposal")}</th>
              <th>{t("Approved Risk")}</th>
              <th>{t("Amount") + " " + t("Rate")}</th>
            </tr>
          </thead>
          <tbody>
            {dataRows}
          </tbody>
        </Table>
      </div>
    </div>
  );

};


export default FacilityDetails;
