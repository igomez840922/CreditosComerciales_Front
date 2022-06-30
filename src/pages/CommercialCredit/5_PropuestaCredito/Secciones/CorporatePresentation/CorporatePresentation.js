import PropTypes from 'prop-types';
import { formatCurrency, translationHelpers } from '../../../../../helpers';
import {
    Table,
    Card,
    CardBody,
    Col,
    Row,
} from "reactstrap"
import React, { useEffect, useState } from "react"
import MatrixBanks from './MatrixBanks';
import ValueChain from './ValueChain';
import Proposal from './Proposal';
import { Tabs, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const CorporatePresentation = (props) => {
    const [t] = translationHelpers('translation')
    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <Tabs defaultActiveKey="0" id="uncontrolled-tab-example" className="mb-4" onSelect={(e) => { }}>
                        <Tab className="m-0" key={0} eventKey={0} title={t("Matrix Banks")}>
                            <Row className="my-3">
                                <MatrixBanks />
                            </Row>
                        </Tab>
                        <Tab className="m-0" key={1} eventKey={1} title={t("Proposal")}>
                            <Row className="my-3">
                                <Proposal />
                            </Row>
                        </Tab>
                        <Tab className="m-0" key={2} eventKey={2} title={t("ValueChain")}>
                            <Row className="my-3">
                                <ValueChain />
                            </Row>
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>
        </React.Fragment >
    );
};
CorporatePresentation.propTypes = {
    title: PropTypes.string,
    customerNumberT24: PropTypes.string,
};
export default CorporatePresentation;
