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
const MatrixBanks = (props) => {
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
            <HeaderSections title="BanescoPosition" />
            <Col md="12" className="table-responsive styled-table-div mb-3">
                <Table className="table table-striped table-hover styled-table table" >
                    <thead>
                        <tr>
                            <th className="table-right">{t("Product/Service")}</th>
                            <th className="table-right">{`VOL (${t('Year Closing')} ${2002})`}</th>
                            <th className="table-right">{t("%ParticipationOfBanesco")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{t("Current account")}</td>
                            <td>{currencyData.format(85460)}</td>
                            <td>{currencyData.formatPercent(9)}</td>
                        </tr>
                        <tr>
                            <td>{t("Savings Account")}</td>
                            <td>{currencyData.format(0)}</td>
                            <td>{currencyData.formatPercent(0)}</td>
                        </tr>
                        <tr>
                            <td>DPF</td>
                            <td>{currencyData.format(1000000)}</td>
                            <td>{currencyData.formatPercent(22.60)}</td>
                        </tr>
                        <tr style={estiloTotales}>
                            <td><strong>{t("TOTALLIABILITIES")}</strong></td>
                            <td><strong>{currencyData.format(1085459.98)}</strong></td>
                            <td><strong>{currencyData.formatPercent(13)}</strong></td>
                        </tr>
                        <tr>
                            <td>{t("Lines of Credit / Overdraft")}</td>
                            <td>{currencyData.format(11000000)}</td>
                            <td>{currencyData.formatPercent(11)}</td>
                        </tr>
                        <tr>
                            <td>{t("Long Term Loans")}</td>
                            <td>{currencyData.format(0)}</td>
                            <td>{currencyData.formatPercent(0)}</td>
                        </tr>
                        <tr style={estiloTotales}>
                            <td><strong>{t("TOTALASSETS")}</strong></td>
                            <td><strong>{currencyData.format(11000000)}</strong></td>
                            <td><strong>{currencyData.formatPercent(14)}</strong></td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
            <HeaderSections title="BanescoTransactionalProducts" />
            <Col md="12" className="table-responsive styled-table-div mb-3">
                <Table className="table table-striped table-hover styled-table table" >
                    <tbody>
                        <tr>
                            <td>{t("Transfer")}</td>
                            <td>{currencyData.format(1000000)}</td>
                            <td>{currencyData.formatPercent(5)}</td>
                        </tr>
                        <tr>
                            <td>{t("Billing POS /MPOS")}</td>
                            <td>{currencyData.format(3530308)}</td>
                            <td>{currencyData.formatPercent(90)}</td>
                        </tr>
                        <tr>
                            <td>{t("No. of POS/MPOS")}</td>
                            <td>{currencyData.format(12)}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>{t("Spreadsheet")}</td>
                            <td>NO</td>
                            <td>N/A</td>
                        </tr>
                        <tr>
                            <td>{t("No de Colaboradores")}</td>
                            <td>{currencyData.format(80)}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>{t("E-Commerce")}</td>
                            <td>NO</td>
                            <td>N/A</td>
                        </tr>
                        <tr>
                            <td>{t("Cash Collection / Smart Chests / Night Bags")}</td>
                            <td>{currencyData.format(2000000)}</td>
                            <td>{currencyData.formatPercent(100)}</td>
                        </tr>
                        <tr>
                            <td>{t("Insurance")}</td>
                            <td>{currencyData.format(0)}</td>
                            <td>N/A</td>
                        </tr>
                        <tr>
                            <td>{t("Reciprocity (Deposits/Sales)")}</td>
                            <td>{currencyData.format(9093509)}</td>
                            <td><strong>{currencyData.formatPercent(19)}</strong></td>
                        </tr>
                        <tr>
                            <td>{t("Corp Credit Cards")}</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>{t("Personal Credit Card")}</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
            <HeaderSections title="Profitability Matrix" />
            <Col md="12" className="table-responsive styled-table-div mb-3">
                <Table className="table table-striped table-hover styled-table table" >
                    <tbody>
                        <tr>
                            <td>{t("Profit Before Tax")} (USD)</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>{t("Profit After Tax")} (USD)</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>{t("Return on Business Volume")} (%)</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>{t("Return On Loan")} (%)</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>{t("Patrimonial Adequacy")} (USD)</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
            <HeaderSections title="Other Banks / Liabilities and Assets" />
            <Col md="12" className="table-responsive styled-table-div mb-3">
                <Table className="table table-striped table-hover styled-table table" >
                    <thead>
                        <tr>
                            <th className="table-right">{t("Bank")}</th>
                            <th className="table-right">{t("Passives")}</th>
                            <th className="table-right">{t("%Participation")}</th>
                            <th className="table-right">{t("LongTerm")}</th>
                            <th className="table-right">{t("ShortTerm")}</th>
                            <th className="table-right">{t("% Total")}</th>
                            <th className="table-right">{t("%Participation")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>MMG Bank</td>
                            <td>{currencyData.format(0)}</td>
                            <td>{currencyData.formatPercent(0)}</td>
                            <td>{currencyData.format(0)}</td>
                            <td>{currencyData.format(0)}</td>
                            <td>{currencyData.format(0)}</td>
                            <td>{currencyData.formatPercent(0)}</td>
                        </tr>
                        <tr style={estiloTotales}>
                            <td><strong>Total</strong></td>
                            <td><strong>{currencyData.format(0)}</strong></td>
                            <td><strong>{currencyData.formatPercent(0)}</strong></td>
                            <td><strong>{currencyData.format(0)}</strong></td>
                            <td><strong>{currencyData.format(0)}</strong></td>
                            <td><strong>{currencyData.format(0)}</strong></td>
                            <td><strong>{currencyData.formatPercent(0)}</strong></td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
            <HeaderSections title="New commitments and Business" />
            <Col md="12" className="table-responsive styled-table-div mb-3">
                <Table className="table table-striped table-hover styled-table table" >
                    <thead>
                        <tr>
                            <th className="table-right">{t("Type")}</th>
                            <th className="table-right">Estatus</th>
                            <th className="table-right">{t("Observation")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>TDC</strong></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
            <HeaderSections title="Files and Others" />
            <Col md="12" className="table-responsive styled-table-div mb-3">
                <Table className="table table-striped table-hover styled-table table" >
                    <thead>
                        <tr>
                            <th className="table-right">{t("Type")}</th>
                            <th className="table-right">Estatus</th>
                            <th className="table-right">{t("Observation")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>{t("ASSETS")}</strong></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><strong>{t("PASSIVE")}</strong></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><strong>{t("APC")}</strong></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><strong>{t("LAST VISIT")}</strong></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><strong>{t("WATCH LISTS")}</strong></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
        </div>
    );
};
MatrixBanks.propTypes = {
    title: PropTypes.string,
    customerNumberT24: PropTypes.string,
};
export default MatrixBanks;
