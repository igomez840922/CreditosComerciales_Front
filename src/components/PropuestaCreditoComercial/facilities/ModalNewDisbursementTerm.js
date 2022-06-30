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


const ModalNewDisbursementTerm = (props) => {

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

  return (
    <Modal isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}
      size="md">
      <ModalHeader toggle={props.toggle} color="primary">{t("Disbursement Type")}</ModalHeader>
      <ModalBody>
        <AvForm className="needs-validation" onSubmit={handleSubmit}>
          <AvGroup className="mb-3">
            <Label htmlFor="disbursementTypeId">{t("Disbursement Type")}</Label>
            <AvField
              className="form-control"
              name="disbursementTypeId"
              type="text"
              value={props.dataSet.disbursementTypeId}
              id="disbursementTypeId" />
          </AvGroup>
          <AvGroup className="mb-3">
            <Label htmlFor="observations">{t("Description")}</Label>
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
                  {" "} {props.tipo == "DESEMBOLSO" ? t("Save") : t("Edit")}
                </Button> : null}
            </Col>
          </Row>
        </AvForm>
      </ModalBody>
    </Modal>
  )
};

ModalNewDisbursementTerm.propTypes = {
  onSave: PropTypes.func.isRequired,
  toggle: PropTypes.func,
  isOpen: PropTypes.bool
};


export default ModalNewDisbursementTerm;
