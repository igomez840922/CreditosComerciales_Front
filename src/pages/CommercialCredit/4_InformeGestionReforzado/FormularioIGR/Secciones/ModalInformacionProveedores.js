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
import Select from "react-select";
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { CoreServices } from "../../../../../services";
import { OnlyNumber } from "../../../../../helpers/commons"

const ModalInformacionProveedores = (props) => {
  const { t, i18n } = useTranslation();
  const [paises, setPaises] = useState([]);
  const [codigoPais, setCodigoPais] = useState(null);
  const [paisSelect, setpaisSelect] = useState(undefined);
  const [dataReturn, setDataReturn] = useState([]);
  const [sumaParticipacion, setsumaParticipacion] = useState(0);
  const [sumaParticipacionMessage, setsumaParticipacionMessage] = useState(false);
  const [campoRequeridoPais, setcampoRequeridoPais] = useState(false);
  React.useEffect(() => {
    // Read Api Service data
    //console.log(props?.jsonProveedores);
    var defaultVal = null;
    setpaisSelect(undefined)
    try {
      if (paises.length > 0 && props.jsonProveedores.country !== null) {
        defaultVal = paises.find(x => (x.label).toUpperCase() === (props.jsonProveedores.country).toUpperCase());
        if (defaultVal !== undefined) {
          setpaisSelect(defaultVal);
        }
      } else {
        paises?.length > 0 ? setpaisSelect(paises.find(x => x.label === "Panama")) : setpaisSelect(undefined);
      }
    }
    catch (err) { }

  }, [props.isOpen, paises]);
  React.useEffect(() => {
    // Read Api Service data
    cargarPaises()
    setcampoRequeridoPais(false);
    if (props.dataGeneralIA != null) {
      setsumaParticipacion(0);
      if (props.tipo == "guardar") {
        let sumaTotal = 0;
        for (let i = 0; i < props.dataGeneralIA.length; i++) {
          sumaTotal = sumaTotal + props.dataGeneralIA[i].percentPurchases;
        }
        setsumaParticipacion(sumaTotal);       
      } else {
        let sumaTotal = 0;
        for (let i = 0; i < props.dataGeneralIA.length; i++) {
          if (props.dataGeneralIA[i].providerId != props.jsonProveedores.providerId) {
            sumaTotal = sumaTotal + props.dataGeneralIA[i].percentPurchases;
          }
        }
        setsumaParticipacion(sumaTotal);
      }
    }
  }, [props.isOpen]);
  // Submitimos formulario para busqueda de clientes
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if(sumaParticipacionMessage){
      return
    }
    if (errors.length > 0) {
      return;
    }
    values.country = paisSelect?.label??"";
    if (props.tipoDato == "guardar") {
      props.dataManagament(values, props.tipoDato)
    } else {
      values.providerId = props.jsonProveedores.providerId;
      props.dataManagament(values, props.tipoDato)

    }
    // props.onSubmit(values);
  }
  function cargarPaises() {
    const api = new CoreServices();
    api.getPaisesCatalogo()
      .then(response => {
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response.Records.length; i++) {
          json.push({ label: response.Records[i]["Description"], value: response.Records[i]["Code"] })
        }
        const optionGroup1 = [
          {
            label: t("SelectCountry"),
            options: json,
          },

        ];
        setPaises(json);
      });
  }
  function changeAll(e, tipo) {

    if (tipo == "name") {
      dataReturn.name = e.target.value;
    }
    if (tipo == "country") {
      dataReturn.country = e.label;
    }
    if (tipo == "salePercentage") {
      dataReturn.salePercentage = e.target.value;
    }
    if (tipo == "customerType") {
      dataReturn.customerType = e.target.value;
    }
    if (tipo == "salesType") {
      dataReturn.salesType = e.target.value;
    }
    if (tipo == "termDays") {
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
    if (tecla === 45) {
      e.preventDefault();
      return true;
    }

    return false;
  }
  function validationParticipation(value) {
    let sumaFinal = parseFloat(value) + parseFloat(sumaParticipacion);
    if (parseFloat(sumaFinal) > 100) {
      setsumaParticipacionMessage(true);
    } else {
      setsumaParticipacionMessage(false)
    }
  }
  return (
    <Modal
      size="md"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
        <div className="modal-header">
          <h5 className="modal-title mt-0">{t("ProvidersInfo")}</h5>
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
            <Col md="12">
              <div className="mb-3">
                <Label htmlFor="name">{t("FullName")}</Label>
                <AvField
                  className="form-control"
                  type="text"
                  name="name"
                  value={props.jsonProveedores.name}
                  id="name"
                  errorMessage={t("Required Field")}
                  validate={{ required: { value: true } }}
                />
              </div>
            </Col>
            <Col md="8">
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
              </div>
            </Col>
            <Col md="4">
              <Label htmlFor="crtermindays">{t("Crtermindays")}</Label>
              <AvField
                className="form-control"
                name="creditDays"
                type="text"
                value={props?.jsonProveedores?.creditDays ?? ""}
                id="creditDays" />
            </Col>
            <Col md="6">
              <AvGroup className="mb-3">
                <Label htmlFor="buyPercent">{t("BuyPercent")} {100 - sumaParticipacion}%</Label>
                <AvField
                  className="form-control"
                  name="percentPurchases"
                  min="0"
                  type="number"
                  onKeyPress={(e) => { return check(e) }}
                  max="100"
                  onChange={(e) => { validationParticipation(e.target.value) }}
                  value={props?.jsonProveedores?.percentPurchases ?? 0}
                  id="percentPurchases" />
              </AvGroup>
              {sumaParticipacionMessage ?
                <p className="message-error-parrafo">{t("Thepercentageexceeds100%")}</p>
                : null}
            </Col>
            <Col md="6">
              <AvGroup className="mb-3">
                <Label htmlFor="ageofrelation">{t("AgeofRelationship")}</Label>
                <AvField
                  className="form-control"
                  name="antiquity"
                  type="text"
                  value={props?.jsonProveedores?.antiquity ?? ""}
                  id="antiquity" />
              </AvGroup>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <div className="mb-3">
                <Label htmlFor="specialTradingConditions">{t("SpecialTradingConditions")}</Label>
                <AvField
                  className="form-control"
                  name="negotiationConditions"
                  type="textarea"
                  maxLength="1000"
                  rows="7"
                  value={props?.jsonProveedores?.negotiationConditions ?? ""}
                  id="negotiationConditions" />
              </div>
            </Col>
          </Row>



        </div>
        <div className="modal-footer">
          <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={props.toggle}>
            <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
          </Button>
          {props.botones ?
            <Button disabled={sumaParticipacionMessage} id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}>
              <i className="mdi mdi-content-save mdi-12px"></i>
              {" "} {props.tipo == "guardar" ? t("Save") : t("Save")}
            </Button>
            : null}
        </div>
      </AvForm>
    </Modal>
  );
};

ModalInformacionProveedores.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

export default (withTranslation()(ModalInformacionProveedores));
