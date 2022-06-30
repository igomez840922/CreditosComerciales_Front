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
import { OnlyNumber } from "../../../../../helpers/commons"
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
const ModalEmpresasRelacionadas = (props) => {
  const { t, i18n } = useTranslation();
  const [campoRequeridoRelacion, setcampoRequeridoRelacion] = useState(false);
  const [relacion, setrelacion] = useState(null);
  const [relacionSelect, setrelacionSelect] = useState(undefined);
  const relacionData = [{ label: "N/A", value: "N/A" }, { label: "Cliente", value: "Cliente" }, { label: "Proveedor", value: "Proveedor" }, { label: "Cliente-Proveedor", value: "Cliente-Proveedor" }]
  React.useEffect(() => {
    // Read Api Service data
    var defaultVal = null;
    setrelacionSelect(undefined)
    try {
      if (relacionData.length > 0 && props.jsonEmpresaRelacionada.relationship !== null) {
        defaultVal = relacionData.find(x => (x.value).toUpperCase() === (props.jsonEmpresaRelacionada.relationship).toUpperCase());
        if (defaultVal !== undefined) {
          setrelacionSelect(defaultVal);
        } else {
          defaultVal = relacionData.find(x => (x.value).toUpperCase() === (props.jsonEmpresaRelacionada.relationship).toUpperCase());
          if (defaultVal !== undefined) {
            setrelacionSelect(defaultVal);
          }
        }
      } else {
        setrelacionSelect(relacionData[0])
      }
    }
    catch (err) { }
  }, [props.isOpen]);
  // Submitimos formulario para busqueda de clientes
  function handleSubmit(event, errors, values) {
    // if (relacion == null) {
    //   setcampoRequeridoRelacion(true);
    //   return;
    // } else {
    //   setcampoRequeridoRelacion(false);
    // }
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    values.relationship = relacionSelect.label;
    if (props.tipo == "guardar") {
      props.addRelationBusinnes(values, props.tipo);
    } else {
      values.companyId = Number(props.jsonEmpresaRelacionada.companyId);
      props.addRelationBusinnes(values, props.tipo);
    }
  }
  function change(e) {
    setrelacion(e.value)
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
      size="md"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
        <div className="modal-header">
          <h5 className="modal-title mt-0">{t("RelatedCompanies")}</h5>
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
                  id="name"
                  value={props.jsonEmpresaRelacionada.name}
                  errorMessage={t("Required Field")}
                  validate={{ required: { value: true } }}
                />
              </div>
            </Col>
            <Col md="12">
              <div className="mb-3">
                <Label htmlFor="activity">{t("Activity")}</Label>
                <AvField
                  className="form-control"
                  type="text"
                  name="activity"
                  id="activity"
                  value={props.jsonEmpresaRelacionada.activity}
                // errorMessage={t("Required Field")}
                // validate={{ required: { value: true } }}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <div className="mb-3">
                <Label htmlFor="sectorExperience">{t("YearsInTheSector")}</Label>
                <AvField

                  className="form-control"
                  type="number"
                  name="sectorExperience"
                  min="1"
                  onKeyPress={(e) => { OnlyNumber(e) }}
                  id="sectorExperience"
                  value={props.jsonEmpresaRelacionada.sectorExperience}
                // errorMessage={t("Required Field")}
                // validate={{ required: { value: true } }}
                />
              </div>
            </Col>
            <Col md="6">
              <div className="mb-3">
                <Label htmlFor="relationship">{t("Relation")}</Label>
                <Select noOptionsMessage={() => ""}
                  onChange={(e) => { setrelacionSelect(relacionData.find(x => x.value === e.value)); change(e); }}
                  options={relacionData}
                  id="relationship"
                  classNamePrefix="select2-selection"
                  placeholder={t("toselect")}
                  value={relacionSelect}
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
ModalEmpresasRelacionadas.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

export default ModalEmpresasRelacionadas;
