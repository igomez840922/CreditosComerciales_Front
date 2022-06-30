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
import Select from "react-select";
import Currency from "../../../../../helpers/currency";
import { OnlyNumber } from "../../../../../helpers/commons";

const ModalFacilidadActivosFijos = (props) => {
  const { t, i18n } = useTranslation();
  const [campoRequeridoTipo, setcampoRequeridoTipo] = useState(false);
  const [tipo, setTipo] = useState(null);
  const [propiedadSelect, setpropiedadSelect] = useState(undefined);
  const [propertyType, setpropertyType] = useState(null);
  // Submitimos formulario para busqueda de clientes
  const [dataPropiedad, setDataPropiedad] = useState(undefined);

  const currencyData = new Currency()

  function handleSubmit(event, errors, values) {
    if (propertyType == null) {
      setcampoRequeridoTipo(true);
      return;
    } else {
      setcampoRequeridoTipo(false);
    }
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    values.propertyType = { code: propiedadSelect.label, name: propiedadSelect.label }
    values.leaseFee = Number(currencyData.getRealValue(values?.leaseFee ?? 0))

    if (props.tipo == "guardar") {
      props.dataManagament(values, props.tipo);
    } else {
      values.facilityAssetId = props.dataFacilidad.facilityAssetId
      props.dataManagament(values, props.tipo);
    }
  }
  React.useEffect(() => {
    // Read Api Service data     
    var defaultVal = null;
    setcampoRequeridoTipo(false)
    setpropiedadSelect(undefined)

    let propiedad = [{ label: "Propia", value: "1" }, { label: "Rentada", value: "2" }];
    console.log(props, propiedad.find(x => (x.label).toUpperCase() === (props.dataFacilidad.propertyType.code).toUpperCase()))
    try {
      if (propiedad.length > 0 && props.dataFacilidad.propertyType !== null && propiedadSelect === undefined) {
        defaultVal = propiedad.find(x => (x.label).toUpperCase() === (props.dataFacilidad.propertyType.code).toUpperCase());
        if (defaultVal !== undefined) {
          setpropiedadSelect(defaultVal);
          setpropertyType(defaultVal)
          // console.log(defaultVal, props.dataFacilidad.propertyType)
        }
      }

      setDataPropiedad(propiedad)
    }
    catch (err) { }
  }, [props.isOpen]);

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
      size="xl"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <div className="modal-header">
        <h5 className="modal-title mt-0">{t("FixedAssetsFacilities")}</h5>
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
                    <Col md="8">
                      <div className="mb-3">
                        <Label htmlFor="address">{t("Address")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="address"
                          value={props.dataFacilidad.address}
                          id="address"
                        />

                      </div>
                    </Col>
                    <Col md="4">
                      <div className="mb-3">
                        <Label htmlFor="propertyType">{t("PropertyType")}</Label>
                        <Select noOptionsMessage={() => ""}
                          onChange={(e) => { setpropiedadSelect(dataPropiedad.find(x => x.label === e.label)); setpropertyType(e) }}
                          options={dataPropiedad}
                          id="sustainableCustomer"
                          classNamePrefix="select2-selection"
                          placeholder={t("toselect")}
                          value={propiedadSelect}
                        />
                        {campoRequeridoTipo ?
                          <p className="message-error-parrafo">{t("Required Field")}</p>
                          : null}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="8">
                      <div className="mb-3">
                        <Label htmlFor="description">{t("Description")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="observations"
                          value={props.dataFacilidad.observations}
                          validate={{
                            required: { value: true, errorMessage: t("Required Field") },
                          }}
                          id="observations" />
                      </div>
                    </Col>
                    <Col md="4">
                      <div className="mb-3">
                        <Label htmlFor="ownerCompany">{t("OwnerCompany")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="ownerCompany"
                          value={props.dataFacilidad.ownerCompany}
                          // validate={{
                          //   required: { value: true, errorMessage: t("Required Field") },
                          // }}
                          id="ownerCompany" />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4">
                      <div className="mb-3">
                        <Label htmlFor="leaseFee">{t("LeaseFee")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="leaseFee"
                          onKeyPress={(e) => { return OnlyNumber(e) }}
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          value={currencyData.format(props.dataFacilidad.leaseFee)}
                          id="leaseFee" />
                      </div>
                    </Col>
                    <Col md="4">
                      <div className="mb-3">
                        <Label htmlFor="leaseTerms">{t("LeaseTerms")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="leaseConditions"
                          value={props.dataFacilidad.leaseConditions}
                          id="leaseConditions" />
                      </div>
                    </Col>
                    <Col md="4">
                      <div className="mb-3">
                        <Label htmlFor="contractPeriod">{t("ContractPeriod") + " (" + t("Year") + "s)"}</Label>
                        <AvField
                          className="form-control"
                          min={0}
                          type="number"
                          onKeyPress={(e) => { return check(e) }}
                          name="contractDuration"
                          validate={{
                            number: { value: true, errorMessage: t("InvalidField") },
                          }}
                          value={props.dataFacilidad.contractDuration}
                          id="contractDuration" />
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
                      {" "} {props.tipo == "guardar" ? t("Save") : t("Save")}
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

ModalFacilidadActivosFijos.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

export default ModalFacilidadActivosFijos;
