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

const FacilityListCore = (props) => {

  const { t, i18n } = useTranslation();
  const [dataReturn, setdataReturn] = useState(null);

  //Servicios
  const [coreServices, setcoreServices] = useState(new CoreServices());

  useEffect(() => {
    if (props.customerNumberT24 != null) {
      initializeData();
    }
  }, [props.customerNumberT24,props.transactId]);

  function initializeData() {
    // consultar Lista facilidades Core
    coreServices.getFacilitiesByTransaction(props.transactId).then((resp) => {
      if (resp !== undefined) {
        // consultarResumenCambios
        setdataReturn(resp)
      }
    });
  }

  return (

    <React.Fragment>
      <>
        <CardBody>
          <HeaderSections title={"FacilityHistory"} t={t}></HeaderSections>
          <p className="card-title-desc">
          </p>
          <Table className="table mt-1" responsive>
            <thead className="table-light">
              <tr>
                <th>{t("Debtor")}</th>
                <th>{t("Facility Type")}</th>
                <th>{t("Proposal")}</th>
                <th className="text-end">{t("Approved Risk")}</th>
                <th className="text-end">{t("Balance / Usage")}</th>
                <th className="text-end">{t("Proposed Risk")}</th>
                <th className="text-end">{t("Variation")}</th>
              </tr>
            </thead>
            <tbody>
              {dataReturn ?
                dataReturn.map((item, index) => (
                  <tr key={'row-' + index}>
                    <td>{item?.AcctMember != null && item?.AcctMember != undefined ? item?.AcctMember[0]?.PartyName?.ShortName ?? "" : ""}</td>
                    <td>{item?.ProductDesc ?? ""}</td>
                    <td>{item?.AcctBal != null && item?.AcctBal != undefined ? item?.AcctBal[0].BalType ?? 0 : 0}</td>
                    <td className="text-end">${item?.AcctOpeningInfo?.InitialAmt?.Amt ?? 0}</td>
                    <td className="text-end">{0.00}</td>
                    <td className="text-end">${item?.AcctBal != null && item?.AcctBal != undefined ? item?.AcctBal[0].CurAmt?.Amt ?? 0 : 0}</td>
                    <td className="text-end">${Number(item?.AcctOpeningInfo?.InitialAmt?.Amt ?? 0) - Number(item?.AcctBal != null && item?.AcctBal != undefined ? item?.AcctBal[0].CurAmt?.Amt ?? 0 : 0)}</td>
                  </tr>)
                )
                : null}
            </tbody>
          </Table>
        </CardBody>
      </>
    </React.Fragment >

  );
};
FacilityListCore.propTypes = {
  customerNumberT24: PropTypes.string,
  transactId: PropTypes.any,
};
export default FacilityListCore;
