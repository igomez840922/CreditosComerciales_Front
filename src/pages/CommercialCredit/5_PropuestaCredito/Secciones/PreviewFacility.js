import React, { useEffect, useState } from "react"
import PropTypes from 'prop-types';
import { translationHelpers } from '../../../../helpers';
import { Link, useHistory, useLocation } from "react-router-dom"
import SweetAlert from "react-bootstrap-sweetalert"
import {
    Row,
    Col,
    Table,
    Button,
} from "reactstrap"
import ModalNuevaComision from "./ModalNuevaComision";
import { BackendServices, CoreServices } from "../../../../services";
import { useTranslation } from "react-i18next";
import Currency from "../../../../helpers/currency"
import { uniq_key } from "../../../../helpers/unq_key";
import * as url from "../../../../helpers/url_helper"
import TreasuryCurve from "./treasuryCurve.model";


const PreviewFacility = (props) => {
    const { t, i18n } = useTranslation();

    const api = new BackendServices();
    const coreServices = new CoreServices();
    const currencyData = new Currency();

    const [Facilidades, setFacilidades] = useState(null);
    const termOptions = [{ label: `${t("ShortTerm")}`, value: "CP" }, { label: `${t("LongTerm")}`, value: "LP" }];


    const location = useLocation()
    const history = useHistory();

    useEffect(() => {
        let dataSession = {};
        console.log(location?.pathname?.split("previsualizarPropCred/")[1])
        if (location?.pathname?.split("previsualizarPropCred/")[1]) {
            dataSession = { transactionId: atob(location?.pathname?.split("previsualizarPropCred/")[1]) };
            sessionStorage.setItem('locationData', JSON.stringify(dataSession));
        }

        if (location.data !== null && location.data !== undefined) {
            if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
                //location.data.transactionId = 0;
                //checkAndCreateProcedure(location.data);
                history.push(url.URL_DASHBOARD);
            }
            else {
                sessionStorage.setItem('locationData', JSON.stringify(location.data));
                dataSession = location.data;
            }
        }
        else {
            //chequeamos si tenemos guardado en session
            var result = sessionStorage.getItem('locationData');
            if (result !== undefined && result !== null) {
                result = JSON.parse(result);
                dataSession = result;
            }
        }
        loadFacilities(dataSession)
    }, [])
    function loadFacilities(dataSession) {
        api.consultarDeudores(dataSession.transactionId)
            .then((data2) => {
                if (data2 !== null && data2 !== undefined) {
                    let jsonDeudores = [];
                    for (let i = 0; i < data2.length; i++) {
                        jsonDeudores.push({ label: data2[i]["typePerson"] == "2" ? data2[i]["name"] : data2[i]["name"] + " " + data2[i]["name2"] + " " + data2[i]["lastName"] + " " + data2[i]["lastName2"], value: data2[i]["personId"] })
                    }
                    // retrieveProposalType
                    api.retrieveProposalType()
                        .then((propuesta) => {
                            // retrieveFacilityType
                            api.retrieveFacilityType()
                                .then((facilidad) => {
                                    // consultarFacilidades
                                    api.retrieveSubproposalType()
                                        .then(async (proposalType) => {
                                            let debtors = await api.consultarDeudores(dataSession.transactionId);
                                            // let typeIdent = await api.consultarCatalogoTipoIdentificacion();
                                            let environmentalRisk = await api.consultEnvironmentalAspectsIGR(dataSession.transactionId)
                                            let guarantees = await coreServices.getTipoGarantiaCatalogo();
                                            let sureties = await api.retrieveBailType();
                                            let requestId = await api.consultGeneralDataPropCred(dataSession?.transactionId)
                                            requestId = requestId[0].requestId;
                                            api.consultarFacilidades(requestId).then(async resp => {
                                                if (resp?.filter(data => data.debtor != "  ").length > 0) {
                                                    resp = currencyData.orderByJSON(resp, 'facilityId', 'asc')
                                                    console.log(resp)

                                                    let rows = [];
                                                    let index = 1;

                                                    let treasuryCurve = new TreasuryCurve();
                                                    await treasuryCurve.initial(dataSession)

                                                    for (const data of resp) {
                                                        console.log(debtors, data)
                                                        let debtor = debtors.find(debtr => debtr.personId === (+data.debtor));

                                                        let guaranteesFacility = await api.consultarGarantiaPropCred(data.facilityId);

                                                        let guaranteesRows = [];

                                                        for (const guarantee of guaranteesFacility) {

                                                            guaranteesRows.push(
                                                                <>
                                                                    <tr>
                                                                        <td>{t("Warrant Type")}</td>
                                                                        <td>
                                                                            {guarantees?.Records.find(x => x.Code === guarantee.guaranteeTypeName)?.Description}
                                                                        </td>
                                                                        <td>
                                                                            {guarantee.guaranteeSubtypeDesc}
                                                                        </td>
                                                                        <td colSpan="12">
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>{t("CommercialValue")}</td>
                                                                        <td colSpan="14">
                                                                            ${currencyData.formatTable(guarantee.commercialValue ?? 0)}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>{t("QuickSaleValue")}</td>
                                                                        <td colSpan="14">
                                                                            ${currencyData.formatTable(guarantee.fastValue ?? 0)}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>LTV %</td>
                                                                        <td colSpan="14">
                                                                            {currencyData.formatTable(guarantee.ltv)}%
                                                                        </td>
                                                                    </tr>
                                                                </>
                                                            )
                                                        }

                                                        let paymentProgramRows = await api.consultListProgramPagoPropCred(data.facilityId);
                                                        paymentProgramRows = paymentProgramRows?.length > 0 ? paymentProgramRows.map(payments => (<tr key={uniq_key()}>
                                                            <td>{t("PaymentProgram")}</td>
                                                            <td>{payments.paymentProgram}</td>
                                                            <td>{payments.observations}</td>
                                                            <td colSpan="12">
                                                            </td>
                                                        </tr>)) : <tr key={uniq_key()}>
                                                            <td>{t("PaymentProgram")}</td>
                                                            <td colSpan="14">
                                                            </td>
                                                        </tr>;
                                                        let disbursementFormRows = await api.consultDisbursementListPropCred(data.facilityId);
                                                        disbursementFormRows = disbursementFormRows?.length > 0 ? disbursementFormRows.map(disbursement => (<tr key={uniq_key()}>
                                                            <td>{t("DisbursementForm")}</td>
                                                            <td>{disbursement.disbursementTypeId}</td>
                                                            <td>{disbursement.observations}</td>
                                                            <td colSpan="12">
                                                            </td>
                                                        </tr>)) : <tr key={uniq_key()}>
                                                            <td>{t("DisbursementForm")}</td>
                                                            <td colSpan="14">
                                                            </td>
                                                        </tr>;

                                                        let suretiesRows = await api.consultarFianzaPropCred(data.facilityId);
                                                        suretiesRows = suretiesRows?.length > 0 ? suretiesRows.map(suretie => suretie.status && (<tr key={uniq_key()}>
                                                            <td>{t("Sureties")}</td>
                                                            <td>{sureties.find(x => x.id === suretie.typeBail)?.description}</td>
                                                            <td>{suretie.observations}</td>
                                                            <td colSpan="12">
                                                            </td>
                                                        </tr>)) : <tr key={uniq_key()}>
                                                            <td>{t("Sureties")}</td>
                                                            <td colSpan="14">
                                                            </td>
                                                        </tr>;

                                                        let commissionRows = await api.consultCommissionPropCred(data.facilityId);
                                                        commissionRows = commissionRows.commissions;
                                                        console.log(commissionRows)
                                                        commissionRows = commissionRows?.length > 0 ? commissionRows.map(commission => (<tr key={uniq_key()}>
                                                            <td>{t("Commission")}</td>
                                                            <td>{commission.comisionType.code}</td>
                                                            <td>${currencyData.format(commission.amount)}</td>
                                                            <td colSpan="12">
                                                            </td>
                                                        </tr>)) : <tr key={uniq_key()}>
                                                            <td>{t("Commission")}</td>
                                                            <td colSpan="14">
                                                            </td>
                                                        </tr>;


                                                        rows.push((
                                                            data.debtor != "  " ?
                                                                <>
                                                                    <thead >
                                                                        <tr>
                                                                            <th>{t("Number of facilities")}</th>
                                                                            <th>{t("C.R")}</th>
                                                                            <th>{t("Amount")}</th>
                                                                            <th>{t("Debtor")}</th>
                                                                            <th>{t("Balance")}</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr key={uniq_key()}>
                                                                            <td>{index++}</td>
                                                                            <td>{data.cr}</td>
                                                                            <td>${currencyData.formatTable(data?.amount ?? 0)}</td>
                                                                            <td>{`${debtor?.name ?? ''} ${debtor?.name2 ?? ''} ${debtor?.lastName ?? ''} ${debtor?.lastName2 ?? ''}`}</td>
                                                                            <td>${currencyData.formatTable(data?.balance ?? 0)}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>{t("Proposal")}</td>
                                                                            <td colSpan="14">{propuesta.find(x => x.id === (data?.proposedType ?? data?.proposalTypeId))?.description}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>{t("FacilityType")}</td>
                                                                            <td colSpan="14">{facilidad.find(x => x.id === (data?.facilityType ?? data?.facilityTypeId))?.description}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>{t("ProposalSubType")}</td>
                                                                            <td colSpan="14">{proposalType.find(x => x.id === data?.proposalTypeName)?.description}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>{t("Purpose")}</td>
                                                                            <td colSpan="14">{data.purpose ?? ''}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>{t("Sublimit")}</td>
                                                                            <td colSpan="14">{data.sublimits ?? ''}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>{t("Proposed Interest Rate")}</td>
                                                                            <td >{currencyData.formatTable(data?.proposalRate ?? 0)}%</td>
                                                                            <td colSpan="13">
                                                                                {/*+data?.proposalRate < +(treasuryCurve.showTreasuryCurve({ proposalRate: data?.proposalRate, termType: data?.termType })?.Description ?? 0) && <div className="text-danger">{t("Lower Proposal Rate than Treasury Curve")}</div>*/}
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>{t("Subsidy Rate")}</td>
                                                                            <td colSpan="14">{currencyData.formatTable(data?.noSubsidyRate ?? 0)}%</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>{t("Total Rate")}</td>
                                                                            <td colSpan="14">{currencyData.formatTable(data?.effectiveRate ?? 0)}%</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>FECI</td>
                                                                            <td colSpan="14">
                                                                                {data.feci ? t("Yes") : t("No")}
                                                                            </td>
                                                                        </tr>

                                                                        {commissionRows}

                                                                        <tr>
                                                                            <td>{t("Term")}</td>
                                                                            <td>{`${data.termDays} ${data.termType}`}</td>
                                                                            <td colSpan="14">{data.termDescription}</td>
                                                                        </tr>

                                                                        {paymentProgramRows}

                                                                        {disbursementFormRows}

                                                                        <tr>
                                                                            <td><b>{t("Guarantee")}</b></td>
                                                                            <td colSpan="14">

                                                                            </td>
                                                                        </tr>

                                                                        {guaranteesRows}

                                                                        <tr>
                                                                            <td>LTV % TOTAL</td>
                                                                            <td colSpan="14">
                                                                                {currencyData.formatTable(guaranteesFacility.reduce((acu, crr) => acu + crr.ltv, 0) ?? 0)}%
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>{t("Escrow")}</td>
                                                                            <td colSpan="14">
                                                                                {data.applyEscrow ? t("Yes") : t("No")}
                                                                            </td>
                                                                        </tr>

                                                                        {suretiesRows}

                                                                        <tr>
                                                                            <td>{t("FinancialConditions")}</td>
                                                                            <td colSpan="14">
                                                                                {data?.finantialConditions ?? ""}
                                                                            </td>
                                                                        </tr>

                                                                        <tr>
                                                                            <td>{t("Environmental and social risk category")}</td>
                                                                            <td colSpan="14">
                                                                                {environmentalRisk?.environmentalAspectsDTO?.riskClassificationConfirmation ?? ""}
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>{t("Status of Legal Documentation")}</td>
                                                                            <td colSpan="14">
                                                                                {data?.legalDocumentation ?? ""}
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>{t("OtherConditions")}</td>
                                                                            <td colSpan="14">
                                                                                {data?.otherConditions ?? ''}
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </>
                                                                : null))
                                                    }
                                                    setFacilidades(rows);

                                                } else {
                                                    setFacilidades(
                                                        <tr key={1}>
                                                            <td colSpan="7" style={{ textAlign: 'center' }}></td>
                                                        </tr>);
                                                }
                                            });
                                        });
                                })
                        })
                }
            })
    }
    return (
        <React.Fragment>
            <Table className="table table-striped table-hover styled-table table" >
                {Facilidades}
            </Table>
        </React.Fragment>
    );
};

export default PreviewFacility;
