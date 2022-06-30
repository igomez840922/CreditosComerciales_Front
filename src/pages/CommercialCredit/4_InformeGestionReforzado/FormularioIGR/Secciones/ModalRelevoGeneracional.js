import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
import Select from "react-select";
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
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { CoreServices } from "../../../../../services";
import * as OPTs from "../../../../../helpers/options_helper"
import moment from "moment";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
const ModalRelevoGeneracional = (props) => {
  const { t, i18n } = useTranslation();
  const [campoRequeridoCargo, setcampoRequeridoCargo] = useState(false);
  const [campoRequeridoDate, setcampoRequeridoDate] = useState(false);
  const [cargo, setCargo] = useState(null);
  const [CargosSelect, setCargosSelect] = useState(undefined);
  const [Cargoset, setCargoset] = useState(null);
  const [fechaSet, setfechaSet] = useState(null);
  const [Cargos, setCargos] = useState([]);
  const [Relacion, setRelacion] = useState([]);
  const [codigoRelacion, setcodigoRelacion] = useState(null);
  const [relacionSelect, setrelacionSelect] = useState(undefined);
  const [campoRequeridoRelacion, setcampoRequeridoRelacion] = useState(undefined);
  const [cargoSelect, setcargoSelect] = useState(undefined);
  // Submitimos formulario para busqueda de clientes
  const cargos = [{ label: "Gerente", value: "1" }, { label: "Jefe RH", value: "2" }, { label: "Operario", value: "3" }]
  function handleSubmit(event, errors, values) {
    // if (CargosSelect == undefined) {
    //   setcampoRequeridoCargo(true);
    //   return;
    // } else {
    //   setcampoRequeridoCargo(false);
    // }
    if (relacionSelect == undefined) {
      setcampoRequeridoRelacion(true);
      return;
    } else {
      setcampoRequeridoRelacion(false);
    }
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    // let fecha=fechaSet.split("/").length==1?fechaSet.split("-"):fechaSet.split("/");
    values.birthDate = moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet : (moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD"))
    values.position = Cargoset;
    values.relationship = codigoRelacion;
    props.addRelay(values);

  }
  React.useEffect(() => {

    // Read Api Service data
    loadCharges()
    loadRelashions()
    setcampoRequeridoCargo(false);
  }, []);
  React.useEffect(() => {
    // Read Api Service data

    var defaultVal = null;
    setCargoset("");
    setcodigoRelacion("");
    setrelacionSelect(undefined)
    setCargosSelect(undefined)
    try {
      if (Relacion.length > 0 && props.jsonRelevo.relationship !== null) {
        defaultVal = Relacion.find(x => (x.label).toUpperCase() === (props.jsonRelevo.relationship).toUpperCase());
        if (defaultVal !== undefined) {
          setrelacionSelect(defaultVal);
          setcodigoRelacion(defaultVal.label);
        }
      } else {
        Relacion?.length > 0 ? setrelacionSelect(Relacion[0]) : setrelacionSelect(undefined);
        Relacion?.length > 0 ? setcodigoRelacion(Relacion[0].label) : setcodigoRelacion(null);
        // Cargos?.length > 0 ? setCargosSelect(Cargos[0]) : setCargosSelect(undefined);
      }
      if (Cargos.length > 0 && props.jsonRelevo.position !== null) {
        defaultVal = Cargos.find(x => (x.label).toUpperCase() === (props.jsonRelevo.position).toUpperCase());
        if (defaultVal !== undefined) {
          setCargoset(defaultVal.label);
          setCargosSelect(defaultVal);
        }
      } else {
        // Relacion?.length > 0 ? setrelacionSelect(Relacion[0]) : setrelacionSelect(undefined);
        Cargos?.length > 0 ? setCargosSelect(Cargos[0]) : setCargosSelect(undefined);
        Cargos?.length > 0 ? setCargoset(Cargos[0].label) : setCargoset(null);
      }
    }
    catch (err) { }
  }, [props.isOpen, Relacion, Cargos]);
  React.useEffect(() => {
    // Read Api Service data
    if (props.tipo == "guardar") {
      setfechaSet(null)
    } else {
      setfechaSet(moment(props.jsonRelevo.birthDate == undefined || props.jsonRelevo.birthDate == null ? "" : props.jsonRelevo.birthDate).format("DD-MM-YYYY"))
    }
    console.log(props.jsonRelevo.birthDate);
  }, [props.isOpen]);
  function loadCharges() {
    const api = new CoreServices();
    // getCargosCatalogo
    api.getCargosCatalogo()
      .then(response => {
        if (response === null) { return; }
        let json = [];
        json.push({ label: "N/A", value: "N/A" })
        for (let i = 0; i < response.Records.length; i++) {
          json.push({ label: response.Records[i]["Description"], value: response.Records[i]["Code"] })
        }
        setCargos(json);
        // setCargosSelect(json[0]);

      });
  }
  function loadRelashions() {
    const api = new CoreServices();
    // getRelacionCatalogo
    api.getRelacionCatalogo()
      .then(response => {
        if (response === null) { return; }
        let json = [];
        json.push({ label: "N/A", value: "N/A" })
        for (let i = 0; i < response.Records.length; i++) {
          json.push({ label: response.Records[i]["Description"], value: response.Records[i]["Code"] })
        }
        // setrelacionSelect(json[0]);
        setRelacion(json);
      });
  }

  function calculaEdad(fecha, fecha_nac) {
    var a = moment(fecha);
    var b = moment(fecha_nac);

    var years = a.diff(b, 'year');
    b.add(years, 'years');

    var months = a.diff(b, 'months');
    b.add(months, 'months');

    var days = a.diff(b, 'days');

    return years == 0 || years < 18;
  }

  function validateDate(e) {
    let date = e.target.value;
    //console.log(date);
    setcampoRequeridoDate(calculaEdad(moment(), moment(date).format("DD/MM/YYYY")))
  }

  return (
    <Modal
      size="xl"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
        <div className="modal-header">
          <h5 className="modal-title mt-0">{t("ManagementRelays")}</h5>
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
                  className="form-control"
                  type="text"
                  name="name"
                  id="name"
                  value={props.jsonRelevo.name}
                  errorMessage={t("Required Field")}
                  validate={{ required: { value: true } }}
                />
              </div>
            </Col>
            <Col md="4">
              <div className="mb-3">
                <Label htmlFor="position">{t("Charge")}</Label>
                <Select noOptionsMessage={() => ""}
                  onChange={(e) => {
                    setCargosSelect(Cargos.find(x => x.label === e.label));
                    setCargoset(e.label);
                  }}
                  options={Cargos}
                  id="paises"
                  classNamePrefix="select2-selection"
                  placeholder={t("toselect")}
                  value={CargosSelect}
                />
                {campoRequeridoCargo ?
                  <p className="message-error-parrafo">{t("Required Field")}</p>
                  : null}
              </div>
            </Col>
          </Row>
          <Row>
            <Col md="3">
              <AvGroup className="mb-3">
                <Label htmlFor="birthDate">{t("DBO")}</Label>
                {fechaSet && props.tipo != "guardar" ?
                  <Flatpickr
                    name="birthDate"
                    id="birthDate"
                    className="form-control d-block"
                    placeholder={OPTs.FORMAT_DATE_SHOW}
                    options={{
                      dateFormat: OPTs.FORMAT_DATE,
                      // maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                      defaultDate: fechaSet,//selectClient !== undefined ? moment(selectClient.birthDate) : null
                    }}
                    onChange={(selectedDates, dateStr, instance) => { setfechaSet(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
                  // onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr).format("YYYY-MM-DD") } }) }}
                  /> :
                  <Flatpickr
                    name="birthDate2"
                    id="birthDate2"
                    className="form-control d-block"
                    placeholder={OPTs.FORMAT_DATE_SHOW}
                    options={{
                      dateFormat: OPTs.FORMAT_DATE,
                    }}
                    onChange={(selectedDates, dateStr, instance) => { setfechaSet(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
                  // onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr).format("YYYY-MM-DD") } }) }}
                  />
                }
              </AvGroup>
            </Col>
            <Col md="3">
              <div className="mb-3">
                <Label htmlFor="relationship">{t("Relation")}</Label>
                <Select noOptionsMessage={() => ""}
                  onChange={(e) => { setrelacionSelect(Relacion.find(x => x.label === e.label)); setcodigoRelacion(e.label) }}
                  options={Relacion}
                  id="relationship"
                  classNamePrefix="select2-selection"
                  placeholder={t("Relation")}
                  value={relacionSelect}
                />
                {campoRequeridoRelacion ?
                  <p className="message-error-parrafo">{t("Required Field")}</p>
                  : null}
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
ModalRelevoGeneracional.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};
export default ModalRelevoGeneracional;
