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
    Table,
} from "reactstrap"
import { Select } from 'antd';
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { Link, useHistory } from "react-router-dom";
import { CoreServices } from "../../../../../../services";
import Currency from "../../../../../../helpers/currency";
const ModalLineaHija = (props) => {
    const { Option } = Select;
    const currencyData = new Currency();

    const history = useHistory();
    const [typeLine, settypeLine] = useState(null);
    const apiServiceCore = new CoreServices();
    const [lineaSelect, setlineaSelect] = useState(props?.dataSet?.linea ?? { Description: "", Code: "" })
    const { t, i18n } = useTranslation();
    useEffect(() => {
        // setdatoSeleccionado(jsonPrioridad[0])
        setlineaSelect(props?.dataSet?.linea)
        apiServiceCore.getTypeOfCreditLimitsCatalog().then(resp => {
            settypeLine(resp.Records)
        });
    }, [props.isOpen])
    function handleSubmit() {
        props.dataManagament({
            "tipoLinea": lineaSelect?.Code ?? "",
            "descTipoLinea": lineaSelect?.Description ?? "",
            "monto": currencyData.getRealValue(document.getElementById("montoLineM").value ?? 0),
            "idLineaT24": document.getElementById("numberLineM").value,
            estado: true
        })
    }
    function check(e) {
        let tecla = (document.all) ? e.keyCode : e.which;
        //Tecla de retroceso para borrar, siempre la permite
        if (tecla == 45) {
          e.preventDefault();
          return true;
        }
    
        return false;
      }
    return (
        <Modal
            size="md"
            isOpen={props.isOpen}
            toggle={props.toggle}
            centered={true}>
            <div className="modal-header">
                <h5 className="modal-title mt-0">{"Nueva línea hija"}</h5>
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
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col md="4">
                                        <div className="mb-2">
                                            <Label>{t("Type of line")}</Label>
                                            <Select noOptionsMessage={() => ""}
                                                showSearch
                                                style={{ width: "100%" }}
                                                placeholder={t("SearchtoSelect")}
                                                optionFilterProp="children"
                                                defaultValue={props.dataSet.linea.Description}
                                                onChange={(e) => {
                                                    let subProduct = JSON.parse(e)
                                                    setlineaSelect(subProduct)
                                                }}
                                                filterOption={(input, option) =>
                                                    option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {typeLine != null ?

                                                    typeLine.map((item, index) => (
                                                        <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                                                    ))
                                                    : null}
                                            </Select>

                                        </div>
                                    </Col>
                                    <Col md="4">
                                        <div className="mb-3">
                                            <Label>{t("Monto de la línea")}</Label>
                                            <AvField
                                                className="form-control"
                                                type="text"
                                                name="montoLineM"
                                                onChange={(e) => { return check(e) }}
                                                pattern="^[0-9,.]*$"
                                                onKeyUp={(e) => {
                                                    let x = currencyData.getRealValue(e.target.value);
                                                    e.target.value = currencyData.format(x);
                                                }}
                                                value={currencyData.format(props.dataSet?.monto ?? 0)}
                                                validate={{ required: { value: true, errorMessage: t("Required Field") } }}
                                            />
                                        </div>
                                    </Col>
                                    <Col md="4">
                                        <div className="mb-3">
                                            <Label>{t("Número de línea")}</Label>
                                            <AvField
                                                className="form-control"
                                                type="text"
                                                name="numberLineM"
                                                value={props.dataSet?.idLineaT24 ?? ""}
                                                validate={{ required: { value: true, errorMessage: t("Required Field") } }}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter style={{ textAlign: "right" }}>
                                <Button id="btnNew" color="danger" type="button" style={{ margin: '5px' }} onClick={props.toggle} data-dismiss="modal">
                                    <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
                                </Button>
                                <Button id="btnSearch" color="success" type="button" onClick={() => { handleSubmit() }} style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                                    {t("Save")}
                                </Button>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};


export default ModalLineaHija;
