import React from 'react'
import { useTranslation } from "react-i18next";
import {
    Col,
    Row,
    Card,
    Table,
    Button
} from 'react-bootstrap'

const TableSimple = (props) => {
    // props
    const { titleTable, headersTable, rowsData } = props

    // hooks
    const { t, i18n } = useTranslation();

    return (
        <Card>
            <Card.Body>
                <Card.Title className='mb-4'>
                    {titleTable}
                </Card.Title>
                <Row>
                    <Col lg={12}>
                        <div className="table-responsive styled-table-div">
                            <Table className="table table-striped table-hover styled-table">
                                <thead>
                                    <tr>
                                        {
                                            headersTable.map((header, key) => (
                                                <th key={key}>{header}</th>
                                            ))
                                        }
                                    </tr>
                                </thead>
                                <tbody>
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
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
                {/* <Card.Footer style={{ textAlign: "right" }}>
                    <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={props.onCancel}>
                        <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
                    </Button>
                    <Button color="info" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-printer mdi-12px"></i>
                        {" "}{t("Print")}
                    </Button>
                    <Button color="success" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                        {" "}{t("Save")}
                    </Button>
                </Card.Footer> */}
            </Card.Body>
            {/* <Card.Footer style={{ textAlign: "right" }}>
                <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={props.onCancel}>
                    <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
                </Button>
                <Button color="info" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-printer mdi-12px"></i>
                    {" "}{t("Print")}
                </Button>
                <Button color="success" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                    {" "}{t("Save")}
                </Button>
            </Card.Footer> */}

        </Card>
    )
}

export default TableSimple