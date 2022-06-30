import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types';

import {
    Row,
    Col,
    Button,
    Label,
    Input,
    Modal,
    Card,
    CardBody,
    CardFooter,
} from "reactstrap"

import Select from "react-select";

const ModalFinancialReport = React.forwardRef((props, ref) => {
    const { t, i18n } = useTranslation();


    return (
        <Modal
            size="xl"
            isOpen={props.isOpen}
            toggle={props.toggle}
            centered={true}>
            <div className="modal-header">
                <h5 className="modal-title mt-0">{t("ConsultFinancialReport")}</h5>
                <button
                    type="button"
                    onClick={props.toggle}
                    data-dismiss="modal"
                    className="close"
                    aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

        </Modal>
    );
});

ModalFinancialReport.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func,
    onSelectClient: PropTypes.func.isRequired
};

export default (withTranslation()(ModalFinancialReport));
