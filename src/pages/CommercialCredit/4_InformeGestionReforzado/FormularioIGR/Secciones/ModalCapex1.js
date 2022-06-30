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
import { uniq_key } from "../../../../../helpers/unq_key";
const ModalCapex1 = (props) => {
  const currencyData = new Currency();
  const { t, i18n } = useTranslation();
  const { Option } = Select;
  const [options, setBancos] = useState([]);
  const [codigoBanco, setCodigoBanco] = useState(null);
  // Submitimos formulario para busqueda de clientes
  React.useEffect(() => {
    // Read Api Service data
    setCodigoBanco(null);
    loadCatalog();
  }, []);
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    values.bank = codigoBanco;
    if (props.tipo == "ECAPEX1") {
      values.capexId = props.dataCapex1.capexId;
      props.UpdateData(values, props.tipo);
    } else {
      props.SaveData(values, props.tipo);
    }
  }
  function loadCatalog() {
    const api = new CoreServices();
    // getBancosCatalogo
    api.getBancosCatalogo()
      .then(response => {
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response.Records.length; i++) {
          json.push({ label: response.Records[i]["Description"], value: response.Records[i]["Code"] });
          if (response.Records[i]["Description"] == props.dataCapex1.back) {
            setCodigoBanco(props.dataCapex1.back);
          }
        }
        setBancos(json);
      });
  }
  return (
    <Modal
      size="md"
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
        <Row>
          <Col xl="12">
            <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
              <Card>
                <CardBody>
                  <Row>
                    <Col md="12">
                      <div className="mb-3">
                        <Label htmlFor="description">{t("Description")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="description"
                          validate={{
                            required: { value: true, errorMessage: t("Required Field") },
                          }}
                          value={props.dataCapex1.observations}
                          id="description"
                        />
                      </div>
                    </Col>
                    <Col md="12">
                      <div className="mb-3">
                        <Label htmlFor="bank">{t("Bank")}</Label>
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
                              <Option key={uniq_key()} value={item.label}>{item.label}</Option>
                            ))
                            : null}
                        </Select>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="usageThousands">{t("UsageThousands")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="useInMiles"
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          value={currencyData.format(props.dataCapex1.thousandUse ?? 0)}
                          id="useInMiles"
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="shareholder">{t("Shareholder")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="shareholder"

                          value={props.dataCapex1.shareholder}
                          id="shareholder"
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
                      {" "} {props.tipo == "CAPEX1" ? t("Save") : t("Save")}
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
ModalCapex1.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func
};
export default ModalCapex1;
