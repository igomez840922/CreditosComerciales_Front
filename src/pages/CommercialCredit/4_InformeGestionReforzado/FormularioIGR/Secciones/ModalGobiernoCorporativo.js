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
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { CoreServices } from "../../../../../services";
import Select from "react-select";
const ModalGobiernoCorporativo = (props) => {
  const { t, i18n } = useTranslation();
  // Submitimos formulario para busqueda de clientes
  const [CargosSelect, setCargosSelect] = useState(undefined);
  const [Cargoset, setCargoset] = useState(null);
  const [Cargos, setCargos] = useState(null);
  const [cargosRequerido, setcargosRequerido] = useState(false);
  // Submitimos formulario para busqueda de clientes
  function handleSubmit(event, errors, values) {
    if (CargosSelect == undefined) {
      setcargosRequerido(true);
      return;
    } else {
      setcargosRequerido(false);
    }
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    values.position = CargosSelect.label;
    props.addGobierno(values, props.tipo);
  }
  React.useEffect(() => {
    // Read Api Service data
    loadCharges();
  }, [props.isOpen]);
  React.useEffect(() => {
    // Read Api Service data
    try {
      var defaultVal = null;
      // setCargosSelect(undefined)
      if (Cargos.length > 0 && props.jsonCorporativo.position !== null) {
        defaultVal = Cargos.find(x => (x.label).toUpperCase() === (props.jsonCorporativo.position).toUpperCase());
        if (defaultVal !== undefined) {
          setCargosSelect(defaultVal);
        }
      }
    }
    catch (err) { }
  }, [Cargos, props.isOpen]);
  function loadCharges() {
    const api = new CoreServices();
    // getCargosCatalogo
    api.getCargosCatalogo()
      .then(response => {
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response.Records.length; i++) {
          json.push({ label: response.Records[i]["Description"], value: response.Records[i]["Code"] })
        }
        setCargos(json);
      });
  }
  return (
    <Modal
      size="md"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
        <div className="modal-header">
          <h5 className="card-title">
            {props.jsonCorporativo.name + " " + props.jsonCorporativo.secondName + " " + props.jsonCorporativo.lastName + " " + props.jsonCorporativo.secondSurname}
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
        <div className="modal-body">


          <Row>
            {/* <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="name">{t("FullName")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="name"
                          value={props.jsonCorporativo.name}
                          id="name"
                          errorMessage={t("Required Field")}
                          validate={{ required: { value: true } }}
                        />
                      </div>
                    </Col>
                    <Col md="2">
                    </Col> */}
            <Col md="12">
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
                {cargosRequerido ?
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

ModalGobiernoCorporativo.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func
};

export default ModalGobiernoCorporativo;
