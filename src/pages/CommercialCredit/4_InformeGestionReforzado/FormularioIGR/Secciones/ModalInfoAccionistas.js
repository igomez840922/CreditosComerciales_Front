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
import { CoreServices } from "../../../../../services";
import ApiServiceBackend from "../../../../../services/BackendServices/Services";
import Select from "react-select";

const ModalInfoAccionistas = React.forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const [paises, setPaises] = useState([]);
  const [sumaParticipacion, setsumaParticipacion] = useState(0);
  const [sumaParticipacionMessage, setsumaParticipacionMessage] = useState(false);
  const [identificationType, setidentificationType] = useState("1");//1-Juridico, 2-Persona
  const [tipo, setTipo] = useState(null);
  const [cambio, setcambio] = useState(1);
  const [identificationTypeList, setIdentificationTypeList] = useState([]);
  // Submitimos formulario para busqueda de clientes
  const personTypeData = [{ label: t("Legal"), value: "1" }, { label: t("Natural"), value: "2" }]
  function handleSubmit(event, errors, values) {
    if (sumaParticipacionMessage) {
      return;
    }
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    if (props.tipo == "guardar") {
      props.addAccionist(values, props.tipo);
    } else {
      values.shareholderId = props.dataAcciones.shareholderId;
      props.addAccionist(values, props.tipo);
    }
  }
  React.useEffect(() => {
    // Read Api Service data
    //console.log(props);
    cargarPaises()
    if (props.tipo != "guardar") {
      setidentificationType(props.dataAcciones.personType)
    }
    if (props.dataGeneralIA != null) {
      setsumaParticipacion(0);
      if (props.tipo == "guardar") {
        let sumaTotal = 0;
        for (let i = 0; i < props.dataGeneralIA.length; i++) {
          sumaTotal = sumaTotal + props.dataGeneralIA[i].participation;
        }
        setsumaParticipacion(sumaTotal);
      } else {
        let sumaTotal = 0;
        for (let i = 0; i < props.dataGeneralIA.length; i++) {
          if (props.dataGeneralIA[i].personId != props.dataAcciones.personId) {
            sumaTotal = sumaTotal + props.dataGeneralIA[i].participation;
          }
        }
        setsumaParticipacion(sumaTotal);
      }
    }
  }, [props.isOpen]);
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
            label: t("Selectacountry"),
            options: json,
          },

        ];
        setPaises(json);
        setcambio(null)
        setcambio(2)
      });
    const apiServiceBackend = new ApiServiceBackend();
    apiServiceBackend.consultarCatalogoTipoIdentificacion()
      .then((data) => {
        if (data !== null && data !== undefined) {
          let json = [];
          for (let i = 0; i < data.length; i++) {
            json.push({ label: t(data[i]["description"]), value: data[i]["id"] })
          }
          /*const optionGroup1 = [
            {
              label: t("ID Type"),
              options: json,
            },
          ];*/
          setIdentificationTypeList(json)
        }
      })
      .catch((error) => {
        console.error('api error: ', error);
      });
  }
  // validamos que el porcentaje de la participacion no sea mayor a 100
  function validationParticipation(value) {
    let sumaFinal = parseFloat(value) + parseFloat(sumaParticipacion);
    if (parseFloat(sumaFinal) > 100) {
      setsumaParticipacionMessage(true);
    } else {
      setsumaParticipacionMessage(false)
    }
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
      <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
        <div className="modal-header">
          <h5 className="card-title">
            {props.dataAcciones.name + " " + props.dataAcciones.secondName + " " + props.dataAcciones.lastName + " " + props.dataAcciones.secondSurname}
          </h5>
          {/* <h5 className="card-title float-right" style={{ marginRight: '15px' }}>
          {props.dataAcciones.clientDocumentId}
        </h5> */}
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
                <Label htmlFor="name">{t("Participation")} {t("available")} {100 - sumaParticipacion}%</Label>
                <AvField
                  className="form-control"
                  type="number"
                  onKeyPress={(e) => { return check(e) }}
                  min={0}
                  max="100"
                  name="participation"
                  id="participation"
                  onChange={(e) => { validationParticipation(e.target.value) }}
                  value={props.dataAcciones.participation}
                  validate={{
                    required: { value: true, errorMessage: t("Required Field") },
                    number: { value: true, errorMessage: t("InvalidField") },
                  }}
                />
                {sumaParticipacionMessage ?
                  <p className="message-error-parrafo">{t("Thepercentageexceeds100%")}</p>
                  : null}
              </div>
            </Col>
            <Col md="12">
              <div className="mb-3">
                <Label htmlFor="name">{t("YearsExprience")}</Label>
                <AvField
                  className="form-control"
                  type="number"
                  name="yearsExprience"
                  value={props.dataAcciones.yearsExperience}
                  id="yearsExprience"
                  validate={{
                    required: { value: true, errorMessage: t("Required Field") },
                    number: { value: true, errorMessage: t("InvalidField") },
                    min: { value: 0, errorMessage: t("InvalidField") }
                  }}
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
});

ModalInfoAccionistas.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onSelectClient: PropTypes.func
};

export default (withTranslation()(ModalInfoAccionistas));
