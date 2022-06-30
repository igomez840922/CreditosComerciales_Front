import React, { useState } from 'react'
import { useTranslation } from "react-i18next";
import {
    Button,
    Card,
    Col,
    Row,
    InputGroup,
} from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ModalData from './ModalData';
import ModalSearchClient from '../../pages/CommercialCredit/20_Cotizador/ModalSearchClient';
import CardSearchClient from '../../pages/CommercialCredit/20_Cotizador/CardSearchClient';

const LookupTable = (props) => {
    const { t, i18n } = useTranslation();
    const cardTitle = props.cardTitle;
    const columnsName = props.columnsName;
    const dataTable = props.dataTable;
    const nameBtn = props.nameBtn;
    const iconBtn = props.iconBtn;

    const [showModal, setShowModal] = useState(false);

    const paginationOptions = {
        paginationSize: 5,
        sizePerPageList: [
            { text: '5', value: 5 }
        ],
    }

    const handleClickShowModal = () => {
        setShowModal(true)
    }

    const handleClickCloseModal = () => {
        setShowModal(false)
    }

    return (
        <>
            <Card>
                <Card.Title>
                    <Row style={{ marginTop: "10px", marginLeft: "10px" }}>
                        <Col md={9}>
                            <h4 className='card-title'>{cardTitle}</h4>
                        </Col>
                    </Row>
                </Card.Title>
                <Card.Body>
                    <Row>
                        <Col md={6} style={{ textAlign: "left", }}>
                            <div className="mb-3">
                                {/* <Label htmlFor="idnumber">Número, Nombre, Identificación</Label> */}
                                <InputGroup>
                                    <input typeof='text' className="form-control"
                                        name="clientDocumentId" type="text" />
                                    <div className="input-group-append">
                                        <button
                                            type="button" color="success"
                                            className="btn btn-outline-secondary"
                                        >
                                            <i
                                                className="fa fa-search"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </InputGroup>
                            </div>
                        </Col>
                        <Col md={6}>
                            <Button
                                className="btn float-end"
                                color="success"
                                type="button"
                                title={t("Add")}
                                onClick={handleClickShowModal}
                            >
                                <i className={`${iconBtn} me-2`}></i>
                                {nameBtn}
                            </Button>
                            {/* <Button
                                className="btn float-end me-2"
                                color="success"
                                type="button"
                                title={t("Add")}
                                onClick={handleClickShowModal}
                            >
                                <i className={"mdi mdi-account-plus mdi-12px me-2"}></i>
                                {"Cotizar 2"}
                            </Button> */}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} lg={10}>
                            <BootstrapTable
                                keyField='date'
                                bootstrap4
                                bordered={false}
                                striped
                                hover
                                condensed
                                classes='styled-table'
                                style={{ cursor: 'pointer' }}
                                data={dataTable}
                                columns={columnsName}
                                pagination={paginationFactory(paginationOptions)}
                            />
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            {/* <ModalData
                titleModal={t("Quoter")}
                show={showModal}
                toggle={handleClickCloseModal}
            /> */}
            <ModalSearchClient
                titleModal={t("SearchClient")}
                content={<CardSearchClient showModal={showModal} />}
                show={showModal}
                toggle={handleClickCloseModal}
            />
        </>
    )
}

export default LookupTable;