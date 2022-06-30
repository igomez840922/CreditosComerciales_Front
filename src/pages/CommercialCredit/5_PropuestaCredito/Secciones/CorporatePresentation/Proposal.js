import PropTypes from 'prop-types';
import { formatCurrency, translationHelpers } from '../../../../../helpers';
import {
    Table,
    Card,
    CardBody,
    Col,
} from "reactstrap"
import { BackendServices, CoreServices, BpmServices, } from "../../../../../services";
import React, { useEffect, useState } from "react"
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory } from 'react-router-dom';
import * as url from "../../../../../helpers/url_helper"
import Currency from '../../../../../helpers/currency';
import HeaderSections from '../../../../../components/Common/HeaderSections';
const estiloTotales = { backgroundColor: "lightgrey", color: "black" }
const Proposal = (props) => {
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

    }, []);

    return (
        <div>
            <HeaderSections title="Facilities" />
            <Col md="12" className="table-responsive styled-table-div mb-3">
                <Table className="table table-striped table-hover styled-table table" >
                    <thead>
                        <tr>
                            <th className="table-right">{t("Debtor")}</th>
                            <th className="table-right">{t("Facility")}</th>
                            <th className="table-right">{t("Amount")}</th>
                            <th className="table-right">{t("Purpose")}</th>
                            <th className="table-right">{t("Rate")}</th>
                            <th className="table-right">{t("Term")}</th>
                            <th className="table-right">{t("Amount Guarantees")}</th>
                            <th className="table-right">{t("Guarantee")}</th>
                            <th className="table-right">{t("LTV")}</th>
                            <th className="table-right">{t("Covenants")}</th>
                            <th className="table-right">{t("Other Observations")}</th>
                            <th className="table-right">{t("Last revision")}</th>
                            <th className="table-right">{t("Next Review")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
        </div>
    );
};
Proposal.propTypes = {
    title: PropTypes.string,
    customerNumberT24: PropTypes.string,
};
export default Proposal;
