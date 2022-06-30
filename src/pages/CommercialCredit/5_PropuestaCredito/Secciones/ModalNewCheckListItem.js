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
import AvInput from 'availity-reactstrap-validation/lib/AvInput'
import { useTranslation } from 'react-i18next';

import * as OPTs from "../../../../helpers/options_helper"
import moment from "moment";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

const ModalNewCheckListItem = (props) => {
  const { t, i18n } = useTranslation();
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
  return (
    <Modal isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}
      size="md">
      <ModalHeader toggle={props.toggle} color="primary">{t("Check List")}</ModalHeader>
      <ModalBody>
        <AvForm className="needs-validation" onSubmit={handleSubmit}>
          <Row>
            <Col xl="6">
              <AvGroup check className="mb-3">
                <AvInput type="checkbox" name="isRequired" />
                <Label htmlFor="isRequired">{t("Required")}</Label>
              </AvGroup>
            </Col>
            <Col xl="6">
              <AvGroup check className="mb-3">
                <AvInput type="checkbox" name="isException" />
                <Label htmlFor="isException">{t("Exception")}</Label>
              </AvGroup>
            </Col>
          </Row>
          <Row>
            <Col xl="6">
              <Label htmlFor="attachment">{t("Attachment")}</Label>
              <AvField
                className="form-control"
                name="attachment"
                type="file"
                id="attachment" />
            </Col>
            <Col xl="6">
              <Label htmlFor="expirationDate">{t("Expiration")}</Label>

              <Flatpickr
                            id="expirationDate"
                            name="expirationDate"
                            className="form-control d-block"
                            placeholder={OPTs.FORMAT_DATE_SHOW}
                            options={{
                              dateFormat: OPTs.FORMAT_DATE,
                              //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                              defaultDate: new Date()
                            }}
                            //onChange={(selectedDates, dateStr, instance) => { setfechaSet2(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")) }}
                          /> 
            
            </Col>

          </Row>
          <Row>
            <Col lg="12" style={{ marginTop: "10px" }}>
              <AvGroup className="mb-3">
                <Label htmlFor="description">{t("Description")}</Label>
                <AvField
                  className="form-control"
                  name="description"
                  type="textarea"
                  id="description"
                  rows="4" />
              </AvGroup>

            </Col>
            <Col lg="12">
              <AvGroup className="mb-3">
                <Label htmlFor="comments">{t("Comments")}</Label>
                <AvField
                  className="form-control"
                  name="comments"
                  type="textarea"
                  id="comments"
                  rows="4" />
              </AvGroup>

            </Col>
          </Row>
          <Row className="my-2">
            <Col xl="12 text-end">
              <Button id="btnCancel" color="danger" type="button" style={{ margin: '5px' }} onClick={handleCancel}>
                {t("Cancel")}
              </Button>
              <Button id="btnSave" color="success" type="submit" style={{ margin: '5px' }}>
                {t("Save")}
              </Button>

            </Col>
          </Row>
        </AvForm>
      </ModalBody>
    </Modal>
  )
};
ModalNewCheckListItem.propTypes = {
  onSave: PropTypes.func.isRequired,
  toggle: PropTypes.func,
  isOpen: PropTypes.bool
};
export default ModalNewCheckListItem;
