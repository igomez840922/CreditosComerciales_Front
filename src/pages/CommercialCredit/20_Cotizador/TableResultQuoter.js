import React from 'react'
import { useTranslation } from "react-i18next";
import {
    Col,
    Row,
    Card,
    Table
} from 'react-bootstrap'
import TableSimple from '../../../components/Common/TableSimple';
import quoterCompuesto from "./dummy/quoterCompuesto";

const TableResultQuoter = (props) => {
    // props
    const { paymentPlan } = props
    // hooks
    const { t, i18n } = useTranslation();
    // console.log("dummy data:", quoterCompuesto);
    // console.log("data:", paymentPlan);
    // 
    // const rowsDummyData = quoterCompuesto.payments;

    const headers = [
        t("Period"),
        t("Credit"),
        t("Interest"),
        t("Feci"),
        t("Principal"),
        t("Balance"),
        t("Total int."),
        t("Total feci"),
        t("Total ppal"),
        t("Total paid"),
    ]

    return (
        <TableSimple
            titleTable={t("Payment plan")}
            headersTable={headers}
            rowsData={paymentPlan}
        />
    )
}

export default TableResultQuoter