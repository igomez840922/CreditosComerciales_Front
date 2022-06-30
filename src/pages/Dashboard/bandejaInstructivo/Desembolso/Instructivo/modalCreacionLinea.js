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
    InputGroup,
} from "reactstrap"
import Currency from "../../../../../helpers/currency";
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { Select } from 'antd';
import Formulario from "../../../../CommercialCredit/14_AdminDesembolso/Colateral/CreacionLinea/Formulario";
const { Option } = Select;
const ModalCreacionLinea = (props) => {
    const currencyData = new Currency();
    const { t, i18n } = useTranslation();
    

    return (
        <Modal
            size="xl"
            isOpen={props.isOpen}
            toggle={props.toggle}
            centered={true}>
            <div className="modal-header">
                {/* <h5 className="modal-title mt-0">{t("Workload")}</h5> */}
                <button
                    type="button"
                    onClick={props.toggle}
                    data-dismiss="modal"
                    className="close"
                    aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body" style={{ backgroundColor: "#f3f5f7" }}>
                <Formulario facilityType={props?.facilityType} facilityId={props?.facilityId} toggle={props?.toggle} />
            </div>
        </Modal>
    );
};

ModalCreacionLinea.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func
};

export default ModalCreacionLinea;
