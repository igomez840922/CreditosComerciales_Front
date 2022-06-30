import React from 'react'
import { useTranslation } from "react-i18next";

// custom imports
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableLoanQuoter from "./TableLoanQuoter";

const LoanQuoterCalulator = () => {
    const { t, i18n } = useTranslation();

    return (
        <div className='page-content'>
            <Breadcrumbs 
                title={t("Process")} 
                breadcrumbItem={t("Quoter")}
            />
            <TableLoanQuoter />
        </div>
    )
}

export default LoanQuoterCalulator