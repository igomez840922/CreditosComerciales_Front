import { useTranslation } from "react-i18next";

import LookupTable from "../../../components/Common/LookupTable";
import { d, m, y } from "../../../components/Comments/DummyDataTable";
import TableResponsive from "../../../components/Common/TableResponsive";

const TableLoanQuoter = () => {
    const { t, i18n } = useTranslation();

    const handleClickShowModal = () => { }

    const columns = [
        {
            dataField: 'number',
            text: t('Number'),
        },
        {
            dataField: 'name',
            text: t('Name')
        },
        {
            dataField: 'identificationType',
            text: t('Tipo identificación')
            // text: t('Identification Type')
        },
        {
            dataField: 'idIdentification',
            text: t('# Ident.')
            // text: t('# Ident.')
        },
        {
            dataField: 'amountDebt',
            text: t('Monto préstamo')
            // text: t('Amount debt')
        },
        {
            dataField: 'anualRate',
            text: t('Tasa anual')
            // text: t('Anual rate')
        },
        {
            dataField: 'feci',
            text: t('Feci')
        },
        // {
        //     dataField: 'monthlyTerm',
        //     text: t('Monthly Term')
        //     // text: t('Monthly Term')
        // },
        {
            dataField: 'amount',
            text: t('Monto financiado')
            // text: t('Amount financed')
        },
        {
            dataField: 'monthlyRate',
            text: t('Abono mensual')
            // text: t('Monthly rate')
        },
        {
            dataField: 'actions',
            // text: <i className="mdi mdi-eye mdi-24px" style={{cursor: "pointer"}}></i>
            text: t('Action')
        }
    ];

    const records = [
        {
            date: `${d}-${m}-${y}`,
            comment: 'Comment',
            process: 'process',
            activity: 'activity',
            estatus: 'estatus',
            user: 'user',
            actions: <i
                className="mdi mdi-eye mdi-24px"
                style={{ cursor: "pointer" }}
                onClick={handleClickShowModal}
            >
            </i>
        },
        {
            date: `${d + 1}-${m}-${y}`,
            comment: 'Comment',
            process: 'process',
            activity: 'activity',
            estatus: 'estatus',
            user: 'user',
            actions: <i
                className="mdi mdi-eye mdi-24px"
                style={{ cursor: "pointer" }}
                onClick={handleClickShowModal}
            >
            </i>
        },
        {
            date: `${d + 2}-${m}-${y}`,
            comment: 'Comment',
            process: 'process',
            activity: 'activity',
            estatus: 'estatus',
            user: 'user',
            actions: <i
                className="mdi mdi-eye mdi-24px"
                style={{ cursor: "pointer" }}
                onClick={handleClickShowModal}
            >
            </i>
        },
        {
            date: `${d + 3}-${m}-${y}`,
            comment: 'Comment',
            process: 'process',
            activity: 'activity',
            estatus: 'estatus',
            user: 'user',
            actions: <i
                className="mdi mdi-eye mdi-24px"
                style={{ cursor: "pointer" }}
                onClick={handleClickShowModal}
            >
            </i>
        },
        {
            date: `${d + 4}-${m}-${y}`,
            comment: 'Comment',
            process: 'process',
            activity: 'activity',
            estatus: 'estatus',
            user: 'user',
            actions: <i
                className="mdi mdi-eye mdi-24px"
                style={{ cursor: "pointer" }}
                onClick={handleClickShowModal}
            >
            </i>
        },
        {
            date: `${d + 5}-${m}-${y}`,
            comment: 'Comment',
            process: 'process',
            activity: 'activity',
            estatus: 'estatus',
            user: 'user',
            actions: <i
                className="mdi mdi-eye mdi-24px"
                style={{ cursor: "pointer" }}
                onClick={handleClickShowModal}
            >
            </i>
        },
    ]

    const colHeaders = [
        t('Number'),
        t('Name'),
        t('Tipo identificación'),
        t('# Ident.'),
        t('Monto préstamo'),
        t('Tasa anual'),
        t('Feci'),
        t('Monto financiado'),
        t('Abono mensual'),
        t('Action')
    ]

    return (
        <>
            <TableResponsive
                nameTable={t("Quoter")}
                columnHeaders={colHeaders}
                dataTable={records}
                nameBtn={t("Quote")}
                iconBtn={"mdi mdi-calculator"}
            />
        </>
    )
}

export default TableLoanQuoter