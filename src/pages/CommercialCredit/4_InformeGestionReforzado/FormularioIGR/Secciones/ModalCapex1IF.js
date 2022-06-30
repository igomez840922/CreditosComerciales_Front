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
import 'antd/dist/antd.css';
// import './index.css';
import { Select } from 'antd';
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { CoreServices } from "../../../../../services";
import Currency from "../../../../../helpers/currency";
import LoadingOverlay from "react-loading-overlay";
import { uniq_key } from "../../../../../helpers/unq_key";

const ModalCapex1IF = (props) => {
  const { t, i18n } = useTranslation();
  const { Option } = Select;
  const [options, setBancos] = useState([]);
  const [codigoBanco, setCodigoBanco] = useState(null);

  const currencyData = new Currency();
  const [isActiveLoading, setIsActiveLoading] = useState(false);


  // Submitimos formulario para busqueda de clientes
  React.useEffect(() => {
    // Read Api Service data
    setCodigoBanco(null);
    loadCatalog();
  }, [props.isOpen]);
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }

    values.back = codigoBanco;
    // values.thousandUse = currencyData.getRealValue(values.thousandUse);
    values.thousandUse = +currencyData.getRealValue(values.thousandUse);
    // values.thousandUse = values.thousandUse == null || values == "" || values == undefined ? 0 : currencyData.getRealValue(values.thousandUse);
    //console.log(values);
    // return
    if (props.tipo == "ECAPEX1") {
      values.capexId = props.dataCapex1.capexId;
      props.UpdateData(values, props.tipo);
    } else {
      props.SaveData(values, props.tipo);
    }
  }
  function loadCatalog() {
    setIsActiveLoading(true);
    const api = new CoreServices();
    // getBancosCatalogo
    api.getBancosCatalogo()
      .then(response => {
        setCodigoBanco(props.dataCapex1.back);
        setBancos(response.Records);
        setIsActiveLoading(false);
      }).catch(err => {
        setIsActiveLoading(false);
      });
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
      size="xl"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <div className="modal-header">
        <h5 className="modal-title mt-0">{t("Capex")}</h5>
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
        <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>

          <Row>
            <Col xl="12">
              <AvForm id="frmSearch" autocomplete="off" className="needs-validation" onSubmit={handleSubmit}>
                <Card>
                  <CardBody>
                    <Row>
                      <Col md="6">
                        <div className="mb-3">
                          <Label htmlFor="observations">{t("Description")}</Label>
                          <AvField
                            className="form-control"
                            type="text"
                            name="observations"
                            validate={{
                              required: { value: true, errorMessage: t("Required Field") },
                            }}
                            value={props.dataCapex1.observations}
                            id="observations"
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="3">
                        <div className="mb-3">
                          <Label htmlFor="thousandUse">{t("UsageThousands")}</Label>
                          <AvField
                            className="form-control"
                            type="text"
                            name="thousandUse"
                            value={currencyData.format(props.dataCapex1.thousandUse ?? 0)}
                            pattern="^[0-9,.]*$"
                            onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                            onKeyPress={(e) => { return check(e); }}
                            id="thousandUse"
                          />
                        </div>
                      </Col>
                      <Col md="3">
                        <div className="mb-3">
                          <Label htmlFor="shareholder">{t("Shareholder")}</Label>
                          <AvField
                            className="form-control"
                            type="text"
                            name="shareholder"
                            validate={{
                              required: { value: true, errorMessage: t("Required Field") },
                            }}
                            value={props.dataCapex1.shareholder}
                            id="shareholder"
                          />
                        </div>
                      </Col>
                      <Col md="3">
                        <div className="mb-3">
                          <Label htmlFor="back">{t("Bank")}</Label>
                          <Select noOptionsMessage={() => ""}
                            showSearch
                            style={{ width: "100%" }}
                            placeholder={t("SearchtoSelect")}
                            optionFilterProp="children"
                            defaultValue={props.dataCapex1.back}
                            onChange={(e) => { setCodigoBanco(e) }}
                            filterOption={(input, option) =>
                              option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {options.length > 0 ?
                              options.map((item, index) => (
                                <Option key={uniq_key()} value={item.Description}>{item.Description}</Option>
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
                    {props.botones ?
                      <Button id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                        {" "} {props.tipo == "CAPEX1" ? t("Save") : t("Save")}
                      </Button> : null}
                  </CardFooter>
                </Card>
              </AvForm>
            </Col>
          </Row>
        </LoadingOverlay>
      </div>
    </Modal>
  );
};
ModalCapex1IF.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func
};
export default ModalCapex1IF;
