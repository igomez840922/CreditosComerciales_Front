import React, { useState } from 'react';
import PropTypes from 'prop-types'

import {
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Row,
  Col,
  Button
} from "reactstrap"

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { BackendServices } from '../../../../services';
import Select from "react-select";
import { values } from 'lodash';
import { useTranslation } from 'react-i18next';
const ModalNewSurety = (props) => {
  const api = new BackendServices();
  const { t, i18n } = useTranslation();
  const [tipoPropuesta, settipoPropuesta] = useState(null);
  const [tipoPropuestaSelect, settipoPropuestaSelect] = useState(undefined);
  const [propuestaSet, setpropuestaSet] = useState(null);
  const [tipoPropuestaRequerido, settipoPropuestaRequerido] = useState(false);
  const [dataReturn, setdataReturn] = useState(null);
  function handleSubmit() {
    dataReturn.typeBail = tipoPropuestaSelect.value;
    setdataReturn(dataReturn)
    props.saveData(dataReturn, props.tipo);
    props.toggle();
  }
  function handleCancel() {
    props.toggle();
  }

  React.useEffect(() => {
    // Read Api Service data
    initializeData();
  }, []);
  React.useEffect(() => {
    // Read Api Service data 
    var defaultVal = null;
    // settipoPropuestaSelect(undefined);
    setdataReturn(props.dataSet)
    setpropuestaSet(props.dataSet.typeBail)
    try {
      if (tipoPropuesta.length > 0 && props.dataSet.typeBail !== null) {
        defaultVal = tipoPropuesta.find(x => (x.value).toUpperCase() === (props.dataSet.typeBail).toUpperCase());
        if (defaultVal !== undefined) {
          settipoPropuestaSelect(defaultVal);
        }
      }
    }
    catch (err) { }
  }, [props.isOpen]);
  function initializeData() {
    api.retrieveBailType()
      .then((response) => {
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response.length; i++) {
          json.push({ label: response[i]["description"], value: response[i]["id"] })
        }
        settipoPropuesta(json);
      })
      .catch((error) => {
        console.error('api error: ', error);
      });
  }
  return (
    <Modal isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}
      size="md">
      <ModalHeader toggle={props.toggle} color="primary">{t("Sureties")}</ModalHeader>
      <ModalBody>
        <AvGroup className="mb-3">
          <Label htmlFor="type">{t("Surety Type")}</Label>
          <Select noOptionsMessage={() => ""} 
            onChange={(e) => {
              settipoPropuestaSelect(tipoPropuesta.find(x => x.label === e.label))
              setpropuestaSet(e.label);
            }}
            options={tipoPropuesta}
            placeholder={t("Select")}
            value={tipoPropuestaSelect}
          />
          {tipoPropuestaRequerido ?
            <p className="message-error-parrafo">{t("Required")}</p>
            : null}
        </AvGroup>
        <AvGroup className="mb-3">
          <Label htmlFor="description">{t("Description")}</Label>
          <AvField
            className="form-control"
            name="observations"
            type="textarea"
            onChange={(e) => { dataReturn.observations = e.target.value; setdataReturn(dataReturn); }}
            value={dataReturn?.observations}
            id="observations"
            rows="4" />
        </AvGroup>
        <Row className="my-2">
          <Col xl="12 text-end">
            <Button id="btnCancel" color="danger" type="button" style={{ margin: '5px' }} onClick={handleCancel}>
              <i className="mdi mdi-cancel mid-12px"></i> {t("Cancel")}
            </Button>
            {props.botones ?
              <Button id="btnSearch" color="success" type="button" onClick={(e) => { handleSubmit() }} style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                {" "} {props.tipo == "COMISION" ? t("Save") : t("Edit")}
              </Button> : null}
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  )
};
ModalNewSurety.propTypes = {
  onSave: PropTypes.func.isRequired,
  toggle: PropTypes.func,
  isOpen: PropTypes.bool
};
export default ModalNewSurety;
