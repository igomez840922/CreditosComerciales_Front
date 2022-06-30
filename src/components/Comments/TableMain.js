import React from 'react'
import { useTranslation } from "react-i18next";
import {
    Button,
    Card, Col, Row,
} from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

const TableMain = (props) => {
    const { t, i18n } = useTranslation();
    const cardTitle = props.cardTitle;
    const columnsName = props.columnsName;
    const dataTable = props.dataTable;

    const paginationOptions = {
        paginationSize: 5,
        sizePerPageList: [
            { text: '5', value: 5 }
        ],
    }

    return (
        <>
            <Card>
                <Card.Title>
                    <Row style={{ marginTop: "5px", marginLeft: "10px" }}>
                        <Col md={9}>
                            <h4 className='card-title'>{cardTitle}</h4>
                        </Col>
                        <Col md={3}>
                            <Button
                                className="btn float-end me-4"
                                color="success"
                                type="button"
                                title={t("Add")}>
                                <i className="fas fa-lg fa-plus-circle"></i> {(" ")}
                            </Button>
                        </Col>
                    </Row>
                </Card.Title>
                <Card.Body>
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
                </Card.Body>
            </Card>
        </>
    )
}

export default TableMain;