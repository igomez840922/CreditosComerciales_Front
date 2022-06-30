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
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
const ModalNewPaymentProgram = (props) => {
  const { t, i18n } = useTranslation();
  const [requerido, setrequerido] = useState(false);
  const [dataReturn, setdataReturn] = useState(null);
  function handleSubmit() {
    if (dataReturn?.paymentProgram == "") {
      setrequerido(true)
      return;
    } else {
      setrequerido(false)
    }
    props.saveData(dataReturn, props.tipo);
    props.toggle();
  }
  React.useEffect(() => {
    setdataReturn(props.dataSet)
  }, [props.isOpen]);
  function handleCancel() {
    props.toggle();
  }
  return (
    <Modal isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}
      size="md">
      <ModalHeader toggle={props.toggle} color="primary">{t("Payment Program")}</ModalHeader>
      <ModalBody>
        <AvGroup className="mb-3">
          <Label htmlFor="paymentProgram">{t("Payment Program Type")}</Label>
          <AvField
            className="form-control"
            name="paymentProgram"
            type="text"
            value={dataReturn?.paymentProgram}
            onChange={(e) => { dataReturn.paymentProgram = e.target.value; setdataReturn(dataReturn); }}
            id="paymentProgram" />
          {requerido ?
            <p className="message-error-parrafo">{t("Required Field")}</p>
            : null}
        </AvGroup>
        <AvGroup className="mb-3">
          <Label htmlFor="observations">{t("Description")}</Label>
          <AvField
            className="form-control"
            name="observations"
            type="textarea"
            value={dataReturn?.observations}
            onChange={(e) => { dataReturn.observations = e.target.value; setdataReturn(dataReturn); }}
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
                {" "} {t("Save")}
              </Button> : null}
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  )
};
ModalNewPaymentProgram.propTypes = {
  onSave: PropTypes.func.isRequired,
  toggle: PropTypes.func,
  isOpen: PropTypes.bool
};
export default ModalNewPaymentProgram;
