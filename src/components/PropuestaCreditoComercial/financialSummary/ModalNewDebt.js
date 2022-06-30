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


const ModalNewDebt = (props) => {

  const [t, c] = translationHelpers('commercial_credit', 'common');

  function handleSubmit(event, errors, value) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    props.onSave(value);
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
        <AvForm className="needs-validation" onSubmit={handleSubmit}>
          <AvGroup className="mb-3">
            <Label htmlFor="bank">{t("Bank")}</Label>
            <AvField
              className="form-control"
              name="bank"
              type="select"
              id="bank"
              value="Banco 1">
              <option>Banco 1</option>
              <option>Banco 2</option>
              <option>Banco 3</option>
            </AvField>
          </AvGroup>
          <AvGroup className="mb-3">
            <Label htmlFor="purpose">{t("Purpose")}</Label>
            <AvField
              className="form-control"
              name="purpose"
              type="select"
              id="purpose"
              value="Proposito 1">
              <option>Proposito 1</option>
              <option>Proposito 2</option>
            </AvField>
          </AvGroup>
          <AvGroup className="mb-3">
            <Label htmlFor="approvedAmount">{t("Approved Amount")}</Label>
            <AvField
              className="form-control"
              name="approvedAmount"
              type="number"
              onKeyPress={(e) => { return check(e) }}
              id="approvedAmount"
              min={0}
            />
          </AvGroup>
          <Row className="my-2">
            <Col xl="12 text-end">
              <Button id="btnSave" color="success" type="submit" style={{ margin: '5px' }}>
                {c("Save")}
              </Button>
              <Button id="btnCancel" color="secondary" type="button" style={{ margin: '5px' }} onClick={handleCancel}>
                {c("Cancel")}
              </Button>
            </Col>
          </Row>
        </AvForm>
      </ModalBody>
    </Modal>
  )
};

ModalNewDebt.propTypes = {
  onSave: PropTypes.func.isRequired,
  toggle: PropTypes.func,
  isOpen: PropTypes.bool
};


export default ModalNewDebt;
