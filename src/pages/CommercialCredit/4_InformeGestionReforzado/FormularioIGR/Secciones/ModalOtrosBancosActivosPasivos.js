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
import 'antd/dist/antd.css';
// import './index.css';
import { Select } from 'antd';
import Currency from "../../../../../helpers/currency";

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { CoreServices } from "../../../../../services";
import { uniq_key } from "../../../../../helpers/unq_key";
const ModalOtrosBancosActivosPasivos = (props) => {
  const currencyData = new Currency();
  const { Option } = Select;
  const { t, i18n } = useTranslation();
  const [campoRequeridoBanco, setcampoRequeridoBanco] = useState(false);
  const [pasivo, setpasivo] = useState("");
  const [participacion, setparticipacion] = useState("");
  const [options, setBancos] = useState([]);
  const [campoTasa3, setcampoTasa3] = useState(false);
  const [campoTasa2, setcampoTasa2] = useState(false);
  const [codigoBanco, setCodigoBanco] = useState(null);
  // Submitimos formulario para busqueda de clientes
  function handleSubmit(event, errors, values) {
    if (campoTasa2) {
      return;
    }
    if (campoTasa3) {
      return;
    }
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    values.bank = codigoBanco;
    values.passivePercentage = currencyData.getRealPercent(values.passivePercentage ?? 0)
    values.participation = currencyData.getRealPercent(values.participation ?? 0)
    if (props.tipo == "OTROBANCO") {
      props.dataManagament(values, props.tipo);
    } else {
      values.otherBankId = props.jsonSow.otherBankId;
      values.status = true;
      props.updateDataManagament(values, props.tipo);
    }
  }
  React.useEffect(() => {
    // Read Api Service data
    loadBank()
    if (props.tipo == "ECP") {
      setCodigoBanco(props.jsonSow.bank)
    }
    setcampoRequeridoBanco(false);
    setpasivo(props.jsonSow.passivePercentage)
    setparticipacion(props.jsonSow.participation)
  }, [props.isOpen]);
  function changeAll(e, tipo) {
    if (tipo == "bank") {
      setCodigoBanco(e);
    }
  }
  function loadBank() {
    const api = new CoreServices();
    // getBancosCatalogo
    api.getBancosCatalogo().then(response => {
      let json = [];
      for (let i = 0; i < response.Records.length; i++) {
        json.push({ label: response.Records[i]["Description"], value: response.Records[i]["Code"] })
      }
      setBancos(json);
    });
  }

  function check(e) {
    let tecla = (document.all) ? e.keyCode : e.which;
    //Tecla de retroceso para borrar, siempre la permite
    if (tecla === 45) {
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
        <h5 className="modal-title mt-0">{t("OtherBanksLiabilitiesAssets")}</h5>
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
            <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
              <Card>
                <CardBody>
                  <Row>
                    <Col md="12">
                      <div className="mb-3">
                        <Label htmlFor="idBank">{t("Bank")}</Label>
                        <Select noOptionsMessage={() => ""}
                          showSearch
                          style={{ width: "100%" }}
                          placeholder={t("SearchtoSelect")}
                          optionFilterProp="children"
                          defaultValue={props.jsonSow.bank}
                          onChange={(e) => { changeAll(e, "bank") }}
                          filterOption={(input, option) =>
                            option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {options.length > 0 ?

                            options.map((item) => (
                              <Option key={uniq_key()} value={item.label}>{item.label}</Option>
                            ))

                            : null}
                        </Select>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="passive">{t("Passive")}</Label>
                        <AvField
                          className="form-control"
                          min={0}
                          type="text"
                          name="passivePercentage"
                          value={pasivo + "%"}
                          onKeyUp={(e) => { let x = currencyData.getRealPercent(e.target.value); e.target.value = currencyData.formatPercent(x, e); }}
                          onChange={(e) => { let x = currencyData.getRealPercent(e.target.value); parseFloat(x) > 100 ? setcampoTasa2(true) : setcampoTasa2(false); }}
                          id="passivePercentage"
                          validate={{
                            required: { value: true, errorMessage: t("Required Field") },
                          }}
                        />
                        {campoTasa2 ?
                          <p className="message-error-parrafo">{t("Thepercentageexceeds100%")}</p>
                          : null}
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="participation">{t("Participation")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="participation"
                          id="participation"
                          onKeyUp={(e) => { let x = currencyData.getRealPercent(e.target.value); e.target.value = currencyData.formatPercent(x, e); }}
                          onChange={(e) => { let x = currencyData.getRealPercent(e.target.value); parseFloat(x) > 100 ? setcampoTasa3(true) : setcampoTasa3(false); }}
                          value={participacion + "%"}
                        />
                        {campoTasa3 ?
                          <p className="message-error-parrafo">{t("Thepercentageexceeds100%")}</p>
                          : null}
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="longTerm">{t("LongTerm")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="longTerm"
                          value={currencyData.format(props?.jsonSow?.longTerm ?? 0)}
                          id="longTerm"
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="shortTerm">{t("ShortTerm")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="shortTerm"
                          value={currencyData.format(props?.jsonSow?.shortTerm ?? 0)}
                          id="shortTerm"
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter style={{ textAlign: "right" }}>
                  <Button id="btnNew" color="danger" type="button" style={{ margin: '5px' }} onClick={props.toggle} data-dismiss="modal">
                    <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
                  </Button>
                  {props.botones ?
                    <Button id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                      {" "} {props.tipo == "OTROBANCO" ? t("Save") : t("Save")}
                    </Button> : null}
                </CardFooter>
              </Card>
            </AvForm>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};
ModalOtrosBancosActivosPasivos.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func
};
export default (withTranslation()(ModalOtrosBancosActivosPasivos));
