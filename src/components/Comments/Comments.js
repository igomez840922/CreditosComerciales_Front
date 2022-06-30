import React, { useState } from 'react'
import { useTranslation } from "react-i18next";

import Breadcrumbs from "../Common/Breadcrumb";
import { d, m, y } from "./DummyDataTable";
import ModalComment from './ModalComment';
import TableMain from './TableMain';

const Comments = () => {
    const { t, i18n } = useTranslation();
    const [displayModal, setDisplayModal] = useState(false);

    const handleClickShowModal = () => {
        setDisplayModal(true);
    }

    const handleClickCloseModal = () => {
        setDisplayModal(false);
    }

    const columns = [
        {
            dataField: 'date',
            text: t('Date')
        },
        {
            dataField: 'comment',
            text: t('Comment')
        },
        {
            dataField: 'process',
            text: t('Process')
        },
        {
            dataField: 'activity',
            text: t('Activity')
        },
        {
            dataField: 'estatus',
            text: t('Status')
        },
        {
            dataField: 'user',
            text: t('User')
        },
        {
            dataField: 'actions',
            // text: <i className="mdi mdi-eye mdi-24px" style={{cursor: "pointer"}}></i>
            text: t('Action')
        }
    ];

    const dataTable = [
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

    return (
        <>
            <div className="page-content">
                <Breadcrumbs title={t("CommercialCredit")} breadcrumbItem={t("ClientAcceptance")} />
            </div>
            <TableMain
                cardTitle={t("QuestionsAndAnswers")}
                dataTable={dataTable}
                columnsName={columns}
            />
            <ModalComment
                titleModal={t("QuestionsAndAnswers")}
                show={displayModal}
                toggle={handleClickCloseModal}
            />
        </>
    )
}

export default Comments;