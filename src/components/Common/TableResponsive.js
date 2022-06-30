import React from 'react'
import { useTranslation } from "react-i18next";
import {
    Button,
    Card,
    Col,
    Row,
    InputGroup,
    Table,
} from "react-bootstrap";
import ModalSearchClient from '../../pages/CommercialCredit/20_Cotizador/ModalSearchClient';
import { useManagementModal } from '../../pages/CommercialCredit/20_Cotizador/Hooks/useManagementModal';
import CardSearchClient from '../../pages/CommercialCredit/20_Cotizador/CardSearchClient';

const TableResponsive = (props) => {
    const { t, i18n } = useTranslation();
    const {
        showModalQuoter,
        hdlCkShowModalQuoter,
        hdlCkCloseModalQuoter,
    } = useManagementModal()

    const {
        nameTable,
        columnHeaders,
        rowsData,
        nameBtn,
        iconBtn,
    } = props

    return (
        <>
            <Card>
                <Card.Title>
                    <Row style={{ marginTop: "10px", marginLeft: "10px" }}>
                        <Col md={9}>
                            <h4 className='card-title'>{nameTable}</h4>
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
                                onClick={hdlCkShowModalQuoter}
                            >
                                <i className={`${iconBtn} me-2`}></i>
                                {nameBtn}
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="table-responsive styled-table-div">
                                <Table className="table table-striped table-hover styled-table">
                                    <thead>
                                        <tr>
                                            {
                                                columnHeaders.map((header, key) => (
                                                    <th key={key}>{header}</th>
                                                ))
                                            }
                                        </tr>
                                    </thead>
                                    {/* <tbody>
                                    {
                                        rowsData.map((row, key) => (
                                            <tr key={key}>
                                                <td>{row.period}</td>
                                                <td>{row.payment}</td>
                                                <td>{row.interest}</td>
                                                <td>{row.feci}</td>
                                                <td>{row.capital}</td>
                                                <td>{row.balance}</td>
                                                <td>{row.totalInterest}</td>
                                                <td>{row.totalFeci}</td>
                                                <td>{row.totalCapital}</td>
                                                <td>{row.totalPayment}</td>
                                            </tr>
                                        ))

                                    }
                                </tbody> */}
                                </Table>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <ModalSearchClient
                titleModal={t("SearchClient")}
                content={<CardSearchClient />}
                show={showModalQuoter}
                toggle={hdlCkCloseModalQuoter}
            />
        </>
    )
}

export default TableResponsive