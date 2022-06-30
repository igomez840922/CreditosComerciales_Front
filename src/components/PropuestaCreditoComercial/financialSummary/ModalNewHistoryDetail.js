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
import Currency from '../../../helpers/currency';
import { useEffect, useState } from 'react';


const ModalNewHistoryDetail = (props) => {
  const currencyData = new Currency();

  const [t, c, tr] = translationHelpers('commercial_credit', 'common', 'translation');

  const [totals, settotals] = useState(0)

  useEffect(() => {
    settotals(props.dataEdit?.total ?? 0)
  }, [props.isOpen])

  function handleSubmit(event, errors, value) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    for (const iterator of cols) {
      value[iterator.id] = currencyData.getRealValue(value[iterator.id]);
    }
    value.totals = currencyData.getRealValue(value.totals);
    props.onSave(value);
    props.toggle();
  }

  function handleCancel() {
    props.toggle();
  }

  const cols = [
    { id: 'days30', label: t("# days", { days: 30 }) },
    { id: 'days60', label: t("# days", { days: 60 }) },
    { id: 'days90', label: t("# days", { days: 90 }) },
    { id: 'days120', label: t("# days", { days: 120 }) },
    { id: 'days150', label: t("# days", { days: 150 }) },
    { id: 'days180', label: t("# days", { days: 180 }) },
    { id: 'days210', label: t("# days", { days: 210 }) },
    { id: 'days240', label: t("# days", { days: 240 }) },
    { id: 'days270', label: t("# days", { days: 270 }) },
    { id: 'days300', label: t("# days", { days: 300 }) },
    { id: 'days330', label: t("# days", { days: 330 }) },
    { id: 'days331', label: t("+# days", { days: 331 }) },
    // { id: 'totals', label: t("Totals") }
  ];
  const fields = cols.map((col, index) => (
    <Col md="4" key={'col-' + col.id}>
      <AvGroup className="mb-3">
        <Label htmlFor="client">{col.label}</Label>
        <AvField
          className="form-control"
          name={col.id}
          id={col.id}
          value={currencyData.format(props.dataEdit?.details[col.id] ?? 0)}
          type="text"
          pattern="^[0-9,.]*$"
          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
          onChange={() => { sumTotal(); }}
          onKeyPress={(e) => { return check(e); }}
        />
      </AvGroup>
    </Col>
  ));

  function sumTotal() {
    settotals(currencyData.format(cols.reduce((acu, crr) => acu + +currencyData.getRealValue(document.getElementById(crr.id).value), 0)));
  }

  function check(e) {
    let tecla = (document.all) ? e.keyCode : e.which;
    //Tecla de retroceso para borrar, siempre la permite
    if (tecla == 45) {
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
      <ModalHeader toggle={props.toggle} color="primary">{t("History Details")}</ModalHeader>
      <ModalBody>
        <AvForm className="needs-validation" autocomplete="off" id="historyDetails" onSubmit={handleSubmit}>
          <AvGroup className="mb-3">
            <Label htmlFor="client">{t("Country / Client")}</Label>
            <AvField
              className="form-control"
              name="bank"
              type="text"
              value={props.dataEdit?.bank}
              id="bank"
              validate={{
                required: { value: true, errorMessage: t("Required Field") },
              }}
            />
          </AvGroup>
          <Row>
            {fields}
            <Col md="4">
              <AvGroup className="mb-3">
                <Label htmlFor="client">{tr("Totals")}</Label>
                <AvField
                  className="form-control"
                  name="totals"
                  value={currencyData.format(totals)}
                  type="text"
                  pattern="^[0-9,.]*$"
                  disabled
                  onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                />
              </AvGroup>
            </Col>
          </Row>
          <Row className="my-2">
            <Col xl="12 text-end">
              <Button id="btnCancel" color="danger" type="button" style={{ margin: '5px' }} onClick={handleCancel}>
                <i className="mdi mdi mdi-cancel mid-12px"></i>{c("Cancel")}
              </Button>
              <Button id="btnSave" color="success" type="submit" style={{ margin: '5px' }}>
                <i className="mdi mdi-content-save mdi-12px"></i>{c("Save")}
              </Button>
            </Col>
          </Row>
        </AvForm>
      </ModalBody>
    </Modal>
  )
};

ModalNewHistoryDetail.propTypes = {
  onSave: PropTypes.func.isRequired,
  toggle: PropTypes.func,
  isOpen: PropTypes.bool
};


export default ModalNewHistoryDetail;
