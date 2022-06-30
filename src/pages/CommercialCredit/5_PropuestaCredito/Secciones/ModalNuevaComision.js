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
import Currency from "../../../../helpers/currency"

const ModalNuevaComision = (props) => {
  const { t, i18n } = useTranslation();
  const [sumaParticipacion, setsumaParticipacion] = useState(0);
  const [sumaParticipacionMessage, setsumaParticipacionMessage] = useState(false);
  const [dataReturn, setdataReturn] = useState({});
  const currencyData = new Currency();

  function handleSubmit() {
    if (sumaParticipacionMessage) {
      return;
    }
    props.saveData(dataReturn, props.tipo);
    props.toggle();
  }
  function handleCancel() {
    props.toggle();
  }
  React.useEffect(() => {
    if (!props.isOpen) return;
    if (props.dataGeneralComisiones != null) {
      props.dataSet.comisionType = props.dataSet?.comisionType?.code ?? props.dataSet?.comisionType;
      setdataReturn(props.dataSet)
      setsumaParticipacion(0);
      if (props.tipo == "COMISION") {
        let sumaTotal = 0;
        for (let i = 0; i < props.dataGeneralComisiones.length; i++) {
          sumaTotal = parseFloat(sumaTotal) + parseFloat(props.dataGeneralComisiones[i].amount);
        }
        setsumaParticipacion(sumaTotal);
      } else {
        let sumaTotal = 0;
        for (let i = 0; i < props.dataGeneralComisiones.length; i++) {
          if (props.dataGeneralComisiones[i].commissionId != dataReturn?.commissionId) {
            sumaTotal = sumaTotal + props.dataGeneralComisiones[i].amount;
          }
        }
        setsumaParticipacion(sumaTotal);
      }

    }
  }, [props.isOpen]);
  function validationPatticipation(value) {
    let sumaFinal = parseFloat(currencyData.getRealValue(value)) + parseFloat(currencyData.getRealValue(sumaParticipacion));
    if (parseFloat(sumaFinal) > parseFloat(currencyData.getRealValue(props.MontoFacilidad))) {
      setsumaParticipacionMessage(true);
    } else {
      setsumaParticipacionMessage(false)
    }
  }
  return (
    <Modal isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}
      size="md">
      <ModalHeader toggle={props.toggle} color="primary">{t("Commission")}</ModalHeader>
      <ModalBody>
        <AvGroup className="mb-3">
          <Label htmlFor="commissionType">{t("Commission Type")}</Label>
          <AvField
            className="form-control"
            name="comisionType"
            type="text"
            onChange={(e) => { dataReturn.comisionType = e.target.value; setdataReturn(dataReturn); }}
            value={dataReturn?.comisionType}
            id="comisionType"
            validate={{
              required: { value: true, errorMessage: t("Required") },
            }}
            required />
        </AvGroup>
        <AvGroup className="mb-3">
          <Label htmlFor="amount">{t("Amount")}</Label>
          <AvField
            className="form-control"
            name="amount2"
            type="text"
            pattern="^[0-9,.]*$"
            onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
            onChange={(e) => { dataReturn.amount = currencyData.getRealValue(e.target.value); setdataReturn(dataReturn); validationPatticipation(currencyData.getRealValue(e.target.value)) }}
            value={currencyData.format(dataReturn?.amount ?? 0)}
            id="amount2"
            validate={{
              required: { value: true, errorMessage: t("Required") },
            }}
            required />
          {sumaParticipacionMessage ?
            <p className="message-error-parrafo">{t("Theamountexceedstheamountofthefacility")}</p>
            : null}
        </AvGroup>
        {
          parseFloat(props.MontoFacilidad) > 0 ?
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
            : <p className="message-error-parrafo">{t("In order to save a commission you must add the amount of the facility")}</p>}
      </ModalBody>
    </Modal>
  )
};
ModalNuevaComision.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool
};
export default ModalNuevaComision;
