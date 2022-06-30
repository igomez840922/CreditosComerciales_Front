import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Button,
  Label,
  Modal,
  Card,
  CardBody,
  CardFooter,
} from "reactstrap";
import Currency from "../../../../../helpers/currency";
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
const ModalCuentasCobrar = (props) => {
  const currencyData = new Currency();
  const { t, i18n } = useTranslation();
  const [total, settotal] = useState(0);
  // Submitimos formulario para busqueda de clientes
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    if (props.tipo == "guardar") {
      props.dataManagament(values, props.tipo);
    } else {
      values.accountReceivableId = props.dataCuentas.idCollectionAccount;
      props.dataManagament(values, props.tipo);
    }
  }
  React.useEffect(() => {
    // Read Api Service data
    settotal(props.dataCuentas.total)
  }, [props.dataCuentas]);
  // calcula el total final
  function calculateTotal() {
    let days30 = parseFloat(currencyData.getRealValue(document.getElementById("days30").value == "" ? 0 : document.getElementById("days30").value));
    let days60 = parseFloat(currencyData.getRealValue(document.getElementById("days60").value == "" ? 0 : document.getElementById("days60").value));
    let days90 = parseFloat(currencyData.getRealValue(document.getElementById("days90").value == "" ? 0 : document.getElementById("days90").value));
    let days120 = parseFloat(currencyData.getRealValue(document.getElementById("days120").value == "" ? 0 : document.getElementById("days120").value));
    let days150 = parseFloat(currencyData.getRealValue(document.getElementById("days150").value == "" ? 0 : document.getElementById("days150").value));
    let days180 = parseFloat(currencyData.getRealValue(document.getElementById("days180").value == "" ? 0 : document.getElementById("days180").value));
    let days210 = parseFloat(currencyData.getRealValue(document.getElementById("days210").value == "" ? 0 : document.getElementById("days210").value));
    let days240 = parseFloat(currencyData.getRealValue(document.getElementById("days240").value == "" ? 0 : document.getElementById("days240").value));
    let days270 = parseFloat(currencyData.getRealValue(document.getElementById("days270").value == "" ? 0 : document.getElementById("days270").value));
    let days300 = parseFloat(currencyData.getRealValue(document.getElementById("days300").value == "" ? 0 : document.getElementById("days300").value));
    let days330 = parseFloat(currencyData.getRealValue(document.getElementById("days330").value == "" ? 0 : document.getElementById("days330").value));
    let days331 = parseFloat(currencyData.getRealValue(document.getElementById("days331").value == "" ? 0 : document.getElementById("days331").value));
    let suma = parseFloat(currencyData.getRealValue(days30)) + parseFloat(currencyData.getRealValue(days60)) + parseFloat(currencyData.getRealValue(days90)) + parseFloat(currencyData.getRealValue(days120)) + parseFloat(currencyData.getRealValue(days150)) + parseFloat(currencyData.getRealValue(days180)) + parseFloat(currencyData.getRealValue(days210)) + parseFloat(currencyData.getRealValue(days240)) + parseFloat(currencyData.getRealValue(days270)) + parseFloat(currencyData.getRealValue(days300)) + parseFloat(currencyData.getRealValue(days330)) + parseFloat(currencyData.getRealValue(days331));
    document.getElementById("total").value = suma + "";
    settotal(suma)
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
      size="lg"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <div className="modal-header">
        <h5 className="modal-title mt-0">{t("AccountsReceivable")}</h5>
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
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="countryClient">{t("CountryClient")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="countryCustomer"
                          validate={{
                            required: { value: true, errorMessage: t("Required Field") },
                          }}
                          value={props.dataCuentas.countryCustomer}
                          id="countryCustomer"
                        />
                      </div>

                    </Col>

                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="days30">30 {t("Days")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          onChange={(e) => { calculateTotal() }}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          name="days30"
                          value={props.tipo == "guardar" ? "" : currencyData.format(props.dataCuentas.days30) + ""}
                          id="days30"
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="days60">60 {t("Days")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          onChange={(e) => { calculateTotal() }}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          name="days60"
                          value={props.tipo == "guardar" ? "" : currencyData.format(props.dataCuentas.days60) + ""}
                          id="days60"
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="days90">90 {t("Days")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          onChange={(e) => { calculateTotal() }}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          name="days90"
                          value={props.tipo == "guardar" ? "" : currencyData.format(props.dataCuentas.days90) + ""}
                          id="days90"
                        />
                      </div>
                    </Col>

                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="days120">120 {t("Days")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          onChange={(e) => { calculateTotal() }}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          name="days120"
                          value={props.tipo == "guardar" ? "" : currencyData.format(props.dataCuentas.days120) + ""}
                          id="days120"
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="days150">150 {t("Days")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          onChange={(e) => { calculateTotal() }}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          name="days150"
                          value={props.tipo == "guardar" ? "" : currencyData.format(props.dataCuentas.days150) + ""}
                          id="days150"
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="days180">180 {t("Days")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          onChange={(e) => { calculateTotal() }}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          name="days180"
                          value={props.tipo == "guardar" ? "" : currencyData.format(props.dataCuentas.days180) + ""}
                          id="days180"
                        />
                      </div>
                    </Col>

                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="days210">210 {t("Days")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          onChange={(e) => { calculateTotal() }}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          name="days210"
                          value={props.tipo == "guardar" ? "" : currencyData.format(props.dataCuentas.days210) + ""}
                          id="days210"
                        />
                      </div>
                    </Col>

                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="days240">240 {t("Days")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          onChange={(e) => { calculateTotal() }}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          name="days240"
                          value={props.tipo == "guardar" ? "" : currencyData.format(props.dataCuentas.days240) + ""}
                          id="days240"
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="days270">270 {t("Days")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          onChange={(e) => { calculateTotal() }}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          name="days270"
                          value={props.tipo == "guardar" ? "" : currencyData.format(props.dataCuentas.days270) + ""}
                          id="days270"
                        />
                      </div>
                    </Col>

                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="days300">300 {t("Days")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          onChange={(e) => { calculateTotal() }}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          name="days300"
                          value={props.tipo == "guardar" ? "" : currencyData.format(props.dataCuentas.days300) + ""}
                          id="days300"
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="days330">330 {t("Days")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          onChange={(e) => { calculateTotal() }}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          name="days330"
                          value={props.tipo == "guardar" ? "" : currencyData.format(props.dataCuentas.days330) + ""}
                          id="days330"
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="days331">+331 {t("Days")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          onChange={(e) => { calculateTotal() }}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          name="days331"
                          value={props.tipo == "guardar" ? "" : currencyData.format(props.dataCuentas.days331) + ""}
                          id="days331"
                        />
                      </div>
                    </Col>

                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="total">{t("Total")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          name="total"
                          value={currencyData.format(parseFloat(total).toFixed(2) ?? 0)}
                          // value={props.tipo=="guardar"?"0":props.dataCuentas.total+""}
                          id="total"
                        />

                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <Label htmlFor="percent">{t("Percent")}</Label>
                        <AvField
                          className="form-control"
                          type="number"
                          onKeyPress={(e) => { return check(e) }}
                          min={0}
                          errorMessage={t("Thepercentageexceeds100%")}
                          max="100"
                          validate={{
                            number: { value: true, errorMessage: t("Thepercentageexceeds100%") },
                          }}
                          name="percentage"
                          value={props.tipo == "guardar" ? "" : props.dataCuentas.percentage + ""}
                          id="percentage"
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
                      {" "} {props.tipo == "guardar" ? t("Save") : t("Save")}
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
ModalCuentasCobrar.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func
};
export default ModalCuentasCobrar;
