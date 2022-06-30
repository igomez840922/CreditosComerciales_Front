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
} from "reactstrap"
import Currency from "../../../../../helpers/currency";

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
const ModalSow = (props) => {
  const currencyData = new Currency();
  const { t, i18n } = useTranslation();
  const [OtroBanco, setOtroBanco] = useState(0);
  const [Banesco, setBanesco] = useState(0);
  const [total, settotal] = useState(0);
  const [sow, setsow] = useState(0);
  // Submitimos formulario para busqueda de clientes
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }    
    values.sow=sow.replace("%", "")
    if (props.tipo == "EditarActual" || props.tipo == "EditarPropuesto") {
      // values.currentSowId = props.jsonSow.currentSowId;
      // values.transactId = props.jsonSow.transactId;
      // values.status = true;
      props.updateData(values, props.tipo);
    }
  }

  React.useEffect(() => {
    console.log(props);
    setOtroBanco(props.jsonSow.otherBanks);
    setBanesco(props.jsonSow.banesco);
    recalcular(props?.jsonSow?.otherBanks??0, props?.jsonSow?.banesco??0)
    setsow(props.jsonSow.sow)
  }, [props.isOpen]);

  function recalcular(banco, banesc) {
    let suma = parseFloat(currencyData.getRealValue(banco)) + parseFloat(currencyData.getRealValue(banesc));
    settotal(parseFloat(suma).toFixed(2))
    console.log(currencyData.getRealValue(banesc));
    console.log(currencyData.getRealValue(suma));
    let division = parseFloat(currencyData.getRealValue(banesc)) / parseFloat(currencyData.getRealValue(suma));
    if (Number.isNaN(parseFloat(currencyData.getRealValue(banesc)) / parseFloat(suma))) {
      setsow(0)
    } else {
      setsow(parseFloat(parseFloat(division)*100).toFixed(2))
    }
  }
  return (
    <Modal
      size="md"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <div className="modal-header">
        <h5 className="modal-title mt-0">{props.tipo == "Actual" || props.tipo == "EditarActual" ? t("ActualSow") : t("ProposedSow")}</h5>
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
                        <Label htmlFor="otherBank">{t("OtherBank")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="otherBanks"
                          id="otherBanks"
                          readOnly={true}
                          onChange={(e) => { setOtroBanco(e.target.value); recalcular(e.target.value, Banesco) }}
                          value={currencyData.format(props?.jsonSow?.otherBanks ?? 0)}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="banesco">{t("Banesco")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="banesco"
                          id="banesco"
                          onChange={(e) => { setBanesco(e.target.value); recalcular(OtroBanco, e.target.value) }}
                          value={currencyData.format(props?.jsonSow?.banesco ?? 0)}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="total">{t("Total")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="total"
                          id="total"
                          readOnly={true}
                          value={currencyData.format(total ?? 0)}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="sow">{t("Sow")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="sow"
                          readOnly={true}
                          id="sow"
                          value={currencyData.format(parseFloat(sow).toFixed(2) ?? 0)+"%"}
                          // pattern="^[0-9,.]*$"
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
                      {" "}{props.tipo == "Actual" || props.tipo == "Propuesto" ? t("Save") : t("Save")}
                    </Button>
                    : null}
                </CardFooter>
              </Card>
            </AvForm>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};
ModalSow.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func
};
export default ModalSow;
