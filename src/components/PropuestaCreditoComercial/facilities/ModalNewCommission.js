import PropTypes from 'prop-types'
import { translationHelpers } from '../../../helpers';


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


const ModalNewCommission = (props) => {

  const [t, c] = translationHelpers('commercial_credit', 'common');

  function handleSubmit(event, errors, value) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    props.guardarDatos(value, props.tipo);
    props.toggle();
  }

  function handleCancel() {
    props.toggle();
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
    <Modal isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}
      size="md">
      <ModalHeader toggle={props.toggle} color="primary">{t("Commission")}</ModalHeader>
      <ModalBody>
        <AvForm id="formNewCommission" className="needs-validation" onSubmit={handleSubmit}>
          <AvGroup className="mb-3">
            <Label htmlFor="commissionType">{t("Commission Type")}</Label>
            <AvField
              className="form-control"
              name="commissionType"
              type="text"
              value={props.dataSet.commissionType}
              id="commissionType"
              validate={{
                required: { value: true, errorMessage: t("Required") },
              }}
              required />
          </AvGroup>
          <AvGroup className="mb-3">
            <Label htmlFor="amount">{t("Amount")}</Label>
            <AvField
              className="form-control"
              name="amount"
              min={0}
              type="number"
              onKeyPress={(e) => { return check(e) }}
              value={props.dataSet.amount}
              id="amount"
              validate={{
                required: { value: true, errorMessage: t("Required") },
                number: { value: true, errorMessage: t("InvalidField") },
              }}
              max="100"
              required />
          </AvGroup>
          <AvGroup className="mb-3">
            <Label htmlFor="observation">{t("Description")}</Label>
            <AvField
              className="form-control"
              name="observation"
              type="textarea"
              value={props.dataSet.observation}
              id="observation"
              validate={{
                required: { value: true, errorMessage: t("Required") },
              }}
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

ModalNewCommission.propTypes = {
  onSave: PropTypes.func.isRequired,
  toggle: PropTypes.func,
  isOpen: PropTypes.bool
};


export default ModalNewCommission;
