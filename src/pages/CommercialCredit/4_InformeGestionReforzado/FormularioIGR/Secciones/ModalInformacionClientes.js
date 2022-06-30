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
import Select from "react-select";
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { CoreServices } from "../../../../../services";
import { OnlyNumber } from "../../../../../helpers/commons"
const ModalInformacionClientes = (props) => {
  const { t, i18n } = useTranslation();
  const [paises, setPaises] = useState([]);
  const [dataReturn, setDataReturn] = useState(props.jsonClientes);
  const [campoRequeridoCustomType, setcampoRequeridoCustomType] = useState(false);
  const [campoRequeridoTipoVenta, setcampoRequeridoTipoVenta] = useState(false);
  const [campoRequeridoPais, setcampoRequeridoPais] = useState(false);
  const [paisSelect, setpaisSelect] = useState(undefined);
  const [tipoClienteSelect, settipoClienteSelect] = useState(undefined);
  const [sumaParticipacion, setsumaParticipacion] = useState(0);
  const [sumaParticipacionMessage, setsumaParticipacionMessage] = useState(false);

  const [tipoVentaSelect, settipoVentaSelect] = useState(undefined);
  const clienteTipo = [{ label: "Privado", value: "1" }, { label: "Gobierno", value: "2" }];
  const tipoVentaData = [{ label: "Credito", value: "1" }, { label: "Contado", value: "2" }];
  React.useEffect(() => {
    // Read Api Service data
    loadCountry()
    setcampoRequeridoCustomType(false);
    setcampoRequeridoTipoVenta(false);
    setcampoRequeridoPais(false);
  }, [props.isOpen]);
  React.useEffect(() => {
    // Read Api Service data
    var defaultVal = null;
    setpaisSelect(undefined)
    settipoClienteSelect(undefined)
    settipoVentaSelect(undefined)
    try {
      if (paises.length > 0 && props.jsonClientes.country !== null && paisSelect === undefined) {
        defaultVal = paises.find(x => (x.label).toUpperCase() === (props.jsonClientes.country).toUpperCase());
        if (defaultVal !== undefined) {
          setpaisSelect(defaultVal);
        }
      }
      if (clienteTipo.length > 0 && props.jsonClientes.customerType !== null && tipoClienteSelect === undefined) {
        defaultVal = clienteTipo.find(x => (x.label).toUpperCase() === (props.jsonClientes.customerType).toUpperCase());
        if (defaultVal !== undefined) {
          settipoClienteSelect(defaultVal);
        }
      }
      if (tipoVentaData.length > 0 && props.jsonClientes.salesType !== null && tipoVentaSelect === undefined) {
        defaultVal = tipoVentaData.find(x => (x.label).toUpperCase() === (props.jsonClientes.salesType).toUpperCase());
        if (defaultVal !== undefined) {
          settipoVentaSelect(defaultVal);
        }
      }
    }
    catch (err) { }
    setDataReturn(props.jsonClientes)
    if (props.dataGeneralIA != null) {
      setsumaParticipacion(0);
      if (props.tipo == "guardar") {
        let sumaTotal = 0;
        for (let i = 0; i < props.dataGeneralIA.length; i++) {
          sumaTotal = sumaTotal + props.dataGeneralIA[i].salePercentage;
        }
        setsumaParticipacion(sumaTotal);
      } else {
        let sumaTotal = 0;
        for (let i = 0; i < props.dataGeneralIA.length; i++) {
          if (props.dataGeneralIA[i].customerInfoId != props.jsonClientes.customerInfoId) {
            sumaTotal = sumaTotal + props.dataGeneralIA[i].salePercentage;
          }
        }
        setsumaParticipacion(sumaTotal);
      }
    }
  }, [props.isOpen, paises]);
  // Submitimos formulario para busqueda de clientes
  function handleSubmit(event, errors, values) {
    if (sumaParticipacionMessage) {
      return;
    }
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    props.addCliente(dataReturn, props.tipo);
  }
  function loadCountry() {
    const api = new CoreServices();
    // getPaisesCatalogo
    api.getPaisesCatalogo()
      .then(response => {
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response.Records.length; i++) {
          json.push({ label: response.Records[i]["Description"], value: response.Records[i]["Code"] })
        }
        setPaises(json);
      });
  }
  function validationParticipation(value) {
    let sumaFinal = parseFloat(value) + parseFloat(sumaParticipacion);
    if (parseFloat(sumaFinal) > 100) {
      setsumaParticipacionMessage(true);
    } else {
      setsumaParticipacionMessage(false)
    }
  }
  function changeAll(e, tipo) {
    if (tipo == "name") {
      dataReturn.name = e.target.value;
    }
    if (tipo == "country") {
      dataReturn.country = e.label;
    }
    if (tipo == "salePercentage") {
      dataReturn.salePercentage = Number(e.target.value);
    }
    if (tipo == "customerType") {
      dataReturn.customerType = e.label;
    }
    if (tipo == "salesType") {
      dataReturn.salesType = e.label;
    }
    if (tipo == "termDays") {
      // dataReturn.termDays = Number(e.target.value);
      dataReturn.termDays = e.target.value;
    }
    if (tipo == "delayReason") {
      dataReturn.delayReason = e.target.value;
    }
    setDataReturn(dataReturn)
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
      <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
        <div className="modal-header">
          <h5 className="modal-title mt-0">{t("ClientsInfo")}</h5>
          <button
            type="button"
            onClick={props.toggle}
            data-dismiss="modal"
            className="close"
            aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">

          <Row>
            <Col md="8">
              <div className="mb-3">
                <Label htmlFor="name">{t("FullName")}</Label>
                <AvField
                  onChange={(e) => {
                    changeAll(e, "name");
                  }}
                  className="form-control"
                  type="text"
                  name="name"
                  id="name"
                  errorMessage={t("Required Field")}
                  validate={{ required: { value: true } }}
                  value={props.jsonClientes.name}
                />
              </div>
            </Col>
            <Col md="4">
              <div className="mb-3">
                <Label htmlFor="idcountry">{t("Country")}</Label>
                <Select noOptionsMessage={() => ""}
                  onChange={(e) => {
                    setpaisSelect(paises.find(x => x.label === e.label)); changeAll(e, "country");
                  }}
                  options={paises}
                  id="paises"
                  value={paisSelect}
                  classNamePrefix="select2-selection"
                  placeholder={t("SelectCountry")}
                />
                {campoRequeridoPais ?
                  <p className="message-error-parrafo">{t("Required Field")}</p>
                  : null}
              </div>
            </Col>
          </Row>
          <Row>
            <Col md="3">
              <AvGroup className="mb-3">
                <Label htmlFor="salePercent">{t("SalePercent")} {100 - sumaParticipacion}%</Label>
                <AvField
                  onChange={(e) => {
                    changeAll(e, "salePercentage");
                    validationParticipation(e.target.value)
                  }}
                  onKeyPress={(e) => { return check(e) }}
                  className="form-control"
                  name="salePercent"
                  min={0}
                  type="number"
                  validate={{
                    number: { value: true, errorMessage: t("InvalidField") },
                    min: { value: 0, errorMessage: t("InvalidField") }
                  }}
                  value={props.jsonClientes.salePercentage}
                  id="salePercent" />
                {sumaParticipacionMessage ?
                  <p className="message-error-parrafo">{t("Thepercentageexceeds100%")}</p>
                  : null}
              </AvGroup>
            </Col>
            <Col md="3">
              <div className="mb-3">
                <Label htmlFor="customerType">{t("ClientType")}</Label>
                <Select noOptionsMessage={() => ""}
                  onChange={(e) => { settipoClienteSelect(clienteTipo.find(x => x.label === e.label)); changeAll(e, "customerType"); }}
                  options={clienteTipo}
                  id="sustainableCustomer"
                  classNamePrefix="select2-selection"
                  placeholder={t("toselect")}
                  value={tipoClienteSelect}
                />
                {campoRequeridoCustomType ?
                  <p className="message-error-parrafo">{t("Required Field")}</p>
                  : null}
              </div>
            </Col>
            <Col md="3">
              <AvGroup className="mb-3">
                <Label htmlFor="termDays">{t("Crterm(days)")}</Label>
                <AvField
                  onChange={(e) => {
                    changeAll(e, "termDays");
                  }}
                  className="form-control"
                  name="termDays"
                  // min={0}
                  type="text"
                  // onKeyPress={(e) => { OnlyNumber(e) }}
                  // validate={{
                  //   number: { value: true, errorMessage: t("InvalidField") },
                  //   min: { value: 0, errorMessage: t("InvalidField") }
                  // }}
                  value={props.jsonClientes.creditDays}
                  id="termDays" />
              </AvGroup>
            </Col>
            <Col md="3">
              <div className="mb-3">
                <Label htmlFor="salesType">{t("SaleType")}</Label>
                <Select noOptionsMessage={() => ""}
                  onChange={(e) => { settipoVentaSelect(tipoVentaData.find(x => x.label === e.label)); changeAll(e, "salesType"); }}
                  options={tipoVentaData}
                  id="sustainableCustomer"
                  classNamePrefix="select2-selection"
                  placeholder={t("toselect")}
                  value={tipoVentaSelect}
                />
                {campoRequeridoTipoVenta ?
                  <p className="message-error-parrafo">{t("Required Field")}</p>
                  : null}
              </div>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <div className="mb-3">
                <Label htmlFor="companyHistoryDescription">{t("IncaseofCollectionDelayindicateReasonforCollectionDelayandStartegia")}</Label>
                <AvField
                  onChange={(e) => {
                    changeAll(e, "delayReason");
                  }}
                  value={props.jsonClientes.delayReason}
                  type="textarea"
                  name="companyHistoryDescription"
                  id="companyHistoryDescription"
                  maxLength="1000"
                  rows="7"
                />
              </div>
            </Col>
          </Row>

        </div>
        <div className="modal-footer">
          <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={props.toggle}>
            <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
          </Button>
          {props.botones ?
            <Button id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}>
              <i className="mdi mdi-content-save mdi-12px"></i>
              {" "} {props.tipo == "guardar" ? t("Save") : t("Save")}
            </Button>
            : null}
        </div>
      </AvForm>
    </Modal>
  );
};

ModalInformacionClientes.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};
export default (withTranslation()(ModalInformacionClientes));
