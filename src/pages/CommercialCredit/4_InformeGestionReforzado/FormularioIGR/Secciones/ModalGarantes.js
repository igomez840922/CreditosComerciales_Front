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
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { BackendServices } from "../../../../../services/";
import Switch from "react-switch";
const Offsymbol = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2,
      }}
    >
      {" "}
      No
    </div>
  );
};
const OnSymbol = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2,
      }}
    >
      {" "}
      Si
    </div>
  );
};
const ModalGarantes = (props) => {
  const { t, i18n } = useTranslation();
  const [identificationType, setidentificationType] = useState("RUC");
  const [identificationList, setIdentificationList] = useState([]);
  const [switch1, setswitch1] = useState(false);
  //On Mounting (componentDidMount)
  React.useEffect(() => {
    initializeData();
    setswitch1(props.jsonGarante.isGuarantor)
  }, [props.isOpen]);
  // Submitimos formulario para busqueda de clientes
  function handleSubmit(event, errors, values) {
    values.isGuarantor = switch1
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    if (props.tipo == "guardar") {
      props.addWarrant(values, props.tipo);
    } else {
      props.addWarrant(values, props.tipo);
    }
  }
  //Caraga Inicial
  function initializeData() {
    const apiServiceBackend = new BackendServices();
    // consultarCatalogoTipoIdentificacion
    apiServiceBackend.consultarCatalogoTipoIdentificacion()
      .then((data) => {
        if (data !== null && data !== undefined) {
          let json = [];
          for (let i = 0; i < data.length; i++) {
            json.push({ label: t(data[i]["description"]), value: data[i]["id"] })
          }
          setIdentificationList(json);
        }
      })
  }
  return (
    <Modal
      size="xl"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <div className="modal-header">
        <h5 className="card-title">
          {props.jsonGarante.firstName + " " + props.jsonGarante.secondName + " " + props.jsonGarante.firstLastName + " " + props.jsonGarante.secondLastName}
        </h5>
        <h5 className="card-title float-right" style={{ marginRight: '15px' }}>
          {props.jsonGarante.docIdCustomer}
        </h5>
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
        <AvForm id="frnGarante" className="needs-validation" onSubmit={handleSubmit}>
          <Card>
            <CardBody>
              <Row>
                <Col md="12">
                  <div className="mb-3">
                    <Label htmlFor="guantorDebtor">{t("The Debtor is the Guarantor of the property to be assigned as Guarantee")}</Label>
                    {'   '}
                    <Switch name="guantorDebtor"
                      id="guantorDebtor"
                      uncheckedIcon={<Offsymbol />}
                      checkedIcon={<OnSymbol />}
                      onColor="#007943"
                      className="form-label"
                      onChange={() => {
                        setswitch1(!switch1);
                      }}
                      checked={switch1}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <div className="mb-3">
                    <Label htmlFor="relationship">{t("Direct relationship between the debtor and the guarantor")}</Label>
                    <AvField
                      type="textarea"
                      name="relationship"
                      value={props.jsonGarante.relationship}
                      id="relationship"
                      maxLength="1000"
                      rows="7"
                      
                    />
                  </div>
                </Col>
                <Col md="6">
                  <div className="mb-3">
                    <Label htmlFor="fundsAssets">{t("How and with what funds was the asset to be sold as collateral acquired")}</Label>
                    <AvField
                      type="textarea"
                      name="fundsAssets"
                      value={props.jsonGarante.fundsAssets}
                      id="fundsAssets"
                      maxLength="1000"
                      rows="7"
                      
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <div className="mb-3">
                    <Label htmlFor="debtorCommitment">{t("Does the debtor have any commitment or credit obligation with the guarantor")}</Label>
                    <AvField
                      type="textarea"
                      name="debtorCommitment"
                      value={props.jsonGarante.debtorCommitment}
                      id="debtorCommitment"
                      maxLength="1000"
                      rows="7"
                      
                    />
                  </div>
                </Col>
                <Col md="6">
                  <div className="mb-3">
                    <Label htmlFor="guaranteeReason">{t("Why do you pledge your property as collateral")}</Label>
                    <AvField
                      type="textarea"
                      name="guaranteeReason"
                      value={props.jsonGarante.guaranteeReason}
                      id="guaranteeReason"
                      maxLength="1000"
                      rows="7"
                      
                    />
                  </div>
                </Col>
              </Row>
            </CardBody>
            <CardFooter style={{ textAlign: "right" }}>
              <Button id="btnNew" color="danger" type="button" style={{ margin: '5px' }} onClick={props.toggle} data-dismiss="modal">
                {t("Cancel")}
              </Button>
              {props.botones ?
                <Button id="btnSearch" type="submit" color="success" style={{ margin: '5px' }}>
                  <i className="mdi mdi-content-save mdi-12px"></i>
                  {" "} {props.tipo == "guardar" ? t("Save") : t("Save")}
                </Button>
                : null}
            </CardFooter>
          </Card>
        </AvForm>
      </div>
    </Modal>
  );
};
ModalGarantes.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};
export default (withTranslation()(ModalGarantes));
