import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Button,
  Label,
  Modal,
} from "reactstrap"
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import Select from "react-select";
const ModalGobiernoCorporativoJunta = (props) => {
  const { t } = useTranslation();

  useEffect(() => {
    //console.log(props);

    return () => {

    }
  }, [props.isOpen])

  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }

    props.onSave(values);
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
            {t("Members of the Board of Directors")}
          </h5>
        </div>
        <div className="modal-body">
          <Row>
            <Col md="6">
              <div className="mb-3">
                <Label htmlFor="name">{t("Name")}</Label>
                <AvField
                  className="form-control"
                  type="text"
                  name="name"
                  value={props.dataGovernance?.name ?? ''}
                  id="name"
                  validate={{
                    required: { value: true, errorMessage: t("Required Field") },
                  }}
                />
              </div>
            </Col>
            <Col md="6">
              <div className="mb-3">
                <Label htmlFor="charge">{t("Charge")}</Label>
                <AvField
                  className="form-control"
                  type="text"
                  name="charge"
                  value={props.dataGovernance?.charge ?? ''}
                  id="charge"
                  validate={{
                    required: { value: true, errorMessage: t("Required Field") },
                  }}
                />
              </div>
            </Col>
            <Col md="12">
              <div className="mb-3">
                <Label htmlFor="description">{t("Description")}</Label>
                <AvField
                  className="form-control"
                  type="textarea"
                  name="description"
                  value={props.dataGovernance?.description ?? ''}
                  id="description"
                  rows="7"
                  validate={{
                    required: { value: true, errorMessage: t("Required Field") },
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

          <Button id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}>
            <i className="mdi mdi-content-save mdi-12px"></i>
            {" "} {t("Save")}
          </Button>

        </div>
      </AvForm>
    </Modal>
  );
};

ModalGobiernoCorporativoJunta.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func
};

export default ModalGobiernoCorporativoJunta;
