import React, { useEffect, useState } from "react"
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
import { Select } from 'antd';
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"

import { BackendServices, CoreServices, BpmServices, } from "../../../services";
const ModalRiesgoCredito = (props) => {
    const { Option } = Select;
    const [datoSeleccionado, setdatoSeleccionado] = useState("")
    const { t, i18n } = useTranslation();
    const [jsonPrioridad, setJsonPrioridad] = useState([])

    const backendServices = new BackendServices();

    useEffect(() => {
        // setdatoSeleccionado(jsonPrioridad[0])
        backendServices.getCreditRiskOpinionCatalog().then(creditRiskOpinions => {
            console.log(creditRiskOpinions)
            setJsonPrioridad(creditRiskOpinions?.map(creditRiskOpinion => ({ value: creditRiskOpinion.id, label: creditRiskOpinion.description })))
        }).catch(err => { console.log(err) });
    }, [])
    function handleSubmit(event, errors, values) {
        event.preventDefault();
        if (errors.length > 0) {
            return;
        }
        props.askRiskOpinion(datoSeleccionado)
    }
    return (
        <Modal
            size="sm"
            isOpen={props.isOpen}
            toggle={props.toggle}
            centered={true}>
            <div className="modal-header">
                <h5 className="modal-title mt-0">{"Asignación de prioridad"}</h5>
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

                <Row>
                    <Col xl="12">
                        <AvForm id="frmSearch" autocomplete="off" className="needs-validation" onSubmit={handleSubmit}>
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col md="12">
                                            <div className="mb-3">
                                                <Label htmlFor="itemActive">{t("Prioridad")}</Label>
                                                <Select noOptionsMessage={() => ""}
                                                    showSearch
                                                    style={{ width: "100%" }}
                                                    placeholder={t("SearchtoSelect")}
                                                    optionFilterProp="children"
                                                    defaultValue={datoSeleccionado}
                                                    onChange={(e) => {
                                                        let data = JSON.parse(e);
                                                        setdatoSeleccionado(data)
                                                    }}
                                                    filterOption={(input, option) =>
                                                        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                >
                                                    {jsonPrioridad != null ?

                                                        jsonPrioridad.map((item, index) => (
                                                            <Option key={index} value={JSON.stringify(item)}>{item.label}</Option>
                                                        ))
                                                        : null}
                                                </Select>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter style={{ textAlign: "right" }}>
                                    <Button id="btnNew" color="danger" type="button" style={{ margin: '5px' }} onClick={props.toggle} data-dismiss="modal">
                                        <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
                                    </Button>
                                    <Button id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                                        {t("Continue")}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </AvForm>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};

ModalRiesgoCredito.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func
};

export default ModalRiesgoCredito;
