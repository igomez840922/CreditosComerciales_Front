import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { translationHelpers } from '../../../helpers/translation-helper';

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
import { BackendServices } from '../../../services';
import Select from "react-select";
import { values } from 'lodash';

const ModalNewSurety = (props) => {
  const api = new BackendServices();
  const [t, c] = translationHelpers('commercial_credit', 'common');
  const [tipoPropuesta, settipoPropuesta] = useState(null);
  const [tipoPropuestaSelect, settipoPropuestaSelect] = useState(undefined);
  const [propuestaSet, setpropuestaSet] = useState(null);
  const [tipoPropuestaRequerido, settipoPropuestaRequerido] = useState(false);
  function handleSubmit(event, errors, value) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    value.typeBail=propuestaSet;
    props.guardarDatos(value, props.tipo);
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
    settipoPropuestaSelect(undefined);
    try {
      if (tipoPropuesta.length > 0 && props.dataSet.typeBail !== null && tipoPropuestaSelect === undefined) {
        defaultVal = tipoPropuesta.find(x => x.label === props.dataSet.typeBail);
        if (defaultVal !== undefined) {
          settipoPropuestaSelect(defaultVal);
        }
      }
    }
    catch (err) { }
  }, [props]);
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
        <AvForm className="needs-validation" onSubmit={handleSubmit}>
          <AvGroup className="mb-3">
            <Label htmlFor="type">{t("Surety Type")}</Label>
            {/* <AvField
              className="form-control"
              name="typeBail"
              type="text"
              value={props.dataSet.typeBail}
              id="typeBail" /> */}
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
              value={props.dataSet.observations}
              id="observations"
              rows="4" />
          </AvGroup>
          <Row className="my-2">
            <Col xl="12 text-end">
              <Button id="btnCancel" color="danger" type="button" style={{ margin: '5px' }} onClick={handleCancel}>
                {c("Cancel")}
              </Button>
              {props.botones ?
                <Button id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                  {" "} {props.tipo == "COMISION" ? c("Save") : c("Edit")}
                </Button> : null}
            </Col>
          </Row>
        </AvForm>
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
