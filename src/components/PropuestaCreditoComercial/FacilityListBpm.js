import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { translationHelper } from '../../helpers';
import { AvForm, AvGroup, AvField, AvFeedback } from "availity-reactstrap-validation"
import {
  Table,
  Card,
  CardBody,
  Row,
  Col,
  Label,
} from "reactstrap"

import HeaderSections from '../Common/HeaderSections';
import { useTranslation } from "react-i18next";
import { BackendServices, CoreServices } from "../../services";
import Currency from '../../helpers/currency';

const FacilityListBpm = (props) => {

  const { t, i18n } = useTranslation();
  const [dataReturn, setdataReturn] = useState(null);
  const [debtorList, setdebtorList] = useState([]);
  const [daudorList, setdaudorList] = useState([]);
  const [facilityTypeList, setfacilityTypeList] = useState([]);
  const [proposalTypeList, setproposalTypeList] = useState([]);
  const currencyData = new Currency();
  //Servicios
  const [coreServices, setcoreServices] = useState(new CoreServices());
  const [backendServices, setbackendServices] = useState(new BackendServices());

  useEffect(() => {
    if (props.transactionId != null) {
      initializeData();
    }
  }, []);

  async function initializeData() {

    //los deudores
    var result = await backendServices.consultarDeudores(props.transactionId);
    if (result !== undefined) {
      setdebtorList(result);
    }

    //catalogo de facilidades
    result = await backendServices.retrieveFacilityType();
    if (result !== undefined) {
      setfacilityTypeList(result);
    }

    //catalogo de Propuestas
    result = await backendServices.retrieveProposalType();
    if (result !== undefined) {
      setproposalTypeList(result);
    }

    // consultarPropuesta de Credito
    backendServices.consultGeneralDataPropCred(props.transactionId).then((resp) => {
      if (resp !== undefined || resp?.length > 0) {
        backendServices.consultarDeudores(props.transactionId).then((data2) => {
          if (data2 !== null && data2 !== undefined) {
            let jsonDeudores = [];
            for (let i = 0; i < data2.length; i++) {
              jsonDeudores.push({ label: data2[i]["name"] + " " + data2[i]["name2"] + " " + data2[i]["lastName"] + " " + data2[i]["lastName2"], value: data2[i]["personId"] })
            }
            setdaudorList(jsonDeudores)
          }
          //Consultar Lista de Facilidades
        });
        backendServices.consultarFacilidades(resp[0].requestId).then((resp) => {
          console.log("🚀 ~ file: FacilityListBpm.js ~ line 72 ~ backendServices.consultarFacilidades ~ resp", resp)
          setdataReturn(resp)
        });
      }
    });
  }

  return (

    <React.Fragment>
      <>
        <CardBody>
          <HeaderSections title={"FacilityActual"} t={t}></HeaderSections>
          <p className="card-title-desc">
          </p>
          <Col md="12" className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table" >
              <thead>
                <tr>
                  <th>{t("Debtor")}</th>
                  <th>{t("Facility Type")}</th>
                  <th>{t("Proposal")}</th>
                  <th className="text-end">{t("ProposedRisk")}</th>
                  <th className="text-end">{t("ProposedRate")}</th>
                </tr>
              </thead>
              <tbody>
                {dataReturn ?
                  dataReturn.filter(item => item.facilityType !== "1").map((item, index) => (
                    item.debtor != "  " ?
                      <tr key={'row-' + index}>
                        <td>
                          {
                            daudorList.find(x => x.value === Number(item.debtor))?.label
                          }
                        </td>
                        <td>
                          {
                            facilityTypeList.find(x => x.id === item.facilityTypeId)?.description
                          }
                        </td>
                        <td>
                          {
                            proposalTypeList.find(x => x.id === item.proposalTypeId)?.description
                          }
                        </td>
                        <td className="text-end">${currencyData.formatTable(item?.amount ?? 0)}</td>
                        <td className="text-end">{(item?.proposalRate ?? 0)}%</td>
                      </tr> : null
                  ))
                  : null}
              </tbody>
            </Table>
          </Col>
        </CardBody>
      </>
    </React.Fragment >

  );
};
FacilityListBpm.propTypes = {
  transactionId: PropTypes.string,
};
export default FacilityListBpm;
