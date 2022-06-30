import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  Button,
  Label,
  Input,
  Modal,
  Card,
  CardBody,
  CardFooter,
  InputGroup,
} from "reactstrap"
import Currency from "../../../../../helpers/currency";
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { Select } from 'antd';
import { uniq_key } from "../../../../../helpers/unq_key";
const { Option } = Select;
const ModalCargaTrabajo = (props) => {
  const currencyData = new Currency();
  const { t, i18n } = useTranslation();
  const [contractType, setcontractType] = useState(null);
  const [contractTypeCatalogue, setcontractTypeCatalogue] = useState([{ Code: "Contrato Cedido", Description: "Contrato Cedido" }, { Code: "Domiciliado", Description: "Domiciliado" }]);
  const [campoTasa, setcampoTasa] = useState(false);
  const [campoTasa2, setcampoTasa2] = useState(false);
  const [campoTasa3, setcampoTasa3] = useState(false);
  React.useEffect(() => {
    setcontractType(props.jsonSow.contractType)
  }, [props.jsonSow])

  // Submitimos formulario para busqueda de clientes
  function handleSubmit(event, errors, values) {
    if (campoTasa) {
      return;
    } 
    if (campoTasa2) {
      return;
    } 
    if (campoTasa3) {
      return;
    } 
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    values.contractAmount = Number(currencyData.getRealValue(values?.contractAmount ?? 0));
    values.pendingAmount = Number(currencyData.getRealValue(values?.pendingAmount ?? 0));
    values.initialPlan = Number(currencyData.getRealValue(values?.initialPlan ?? 0));
    values.endPlan = Number(currencyData.getRealValue(values?.endPlan ?? 0));
    values.executedPercentage = Number(currencyData.getRealPercent(values?.executedPercentage??0));
    values.percentageTobeExecuted = Number(currencyData.getRealPercent(values?.percentageTobeExecuted??0));
    values.expectedExecution = Number(currencyData.getRealPercent(values?.expectedExecution??0));

    values.contractType = contractType;

    if (props.tipo == "CARGATRABAJO") {
      props.saveData(values, props.tipo);
    }
    if (props.tipo == "ECARGATRABAJO") {
      values.cashFlowWorkloadId = props.jsonSow.cashFlowWorkloadId;
      values.status = true;
      props.updateData(values, props.tipo);
    }
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
    <Modal
      size="lg"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <div className="modal-header">
        <h5 className="modal-title mt-0">{t("Workload")}</h5>
        <button
          type="button"
          onClick={props.toggle}
          data-dismiss="modal"
          className="close"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body" style={{ backgroundColor: "#f3f5f7" }}>

        <Row>
          <Col xl="12">
            <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmit}>
              <Card>
                <CardBody>
                  <Row>
                    <Col md="12">
                      <div className="mb-3">
                        <Label htmlFor="client">{t("Client")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="customer"
                          value={props.jsonSow.customer}
                          id="customer"
                          validate={{
                            required: { value: true, errorMessage: t("Required Field") },
                          }}
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="projectName">{t("ProjectName")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="projectName"
                          value={props.jsonSow.projectName}
                          id="projectName"
                          validate={{
                            required: { value: true, errorMessage: t("Required Field") },
                          }}
                        />
                      </div>

                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="publicOrganizationPrivateCompany">{t("PublicOrganizationPrivateCompany")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="organismType"
                          value={props.jsonSow.organismType}
                          id="organismType"
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="contractAmount">{t("ContractAmount")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          name="contractAmount"
                          value={currencyData.format(props?.jsonSow?.contractAmount ?? 0)}
                          id="contractAmount"
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="june">{t("PendinAmount")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          name="pendingAmount"
                          value={currencyData.format(props?.jsonSow?.pendingAmount ?? 0)}
                          id="pendingAmount"
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="startExecutionPeriod">{t("StartExecutionPeriod")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          name="initialPlan"
                          value={currencyData.format(props?.jsonSow?.initialPlan ?? 0)}
                          id="initialPlan"
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="endExecutionPeriod">{t("EndExecutionPeriod")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          pattern="^[0-9,.]*$"
                          onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                          name="endPlan"
                          value={currencyData.format(props?.jsonSow?.endPlan ?? 0)}
                          id="endPlan"
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="percentExecuted">{t("PercentExecuted")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="executedPercentage"
                          value={props.jsonSow.executedPercentage}
                          onKeyUp={(e) => { let x = currencyData.getRealPercent(e.target.value); e.target.value = currencyData.formatPercent(x,e); }}
                          onChange={(e) => { let x = currencyData.getRealPercent(e.target.value); parseFloat(x) > 100 ? setcampoTasa(true) : setcampoTasa(false); }}
                          id="executedPercentage"
                        />
                        {campoTasa ?
                          <p className="message-error-parrafo">{t("Thepercentageexceeds100%")}</p>
                          : null}
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="percentToExecute">{t("PercentToExecute")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          name="percentageTobeExecuted"
                          onKeyUp={(e) => { let x = currencyData.getRealPercent(e.target.value); e.target.value = currencyData.formatPercent(x,e); }}
                          value={props.jsonSow.percentageTobeExecuted}
                          onChange={(e) => { let x = currencyData.getRealPercent(e.target.value); parseFloat(x) > 100 ? setcampoTasa2(true) : setcampoTasa2(false); }}
                          id="percentageTobeExecuted"
                        />
                        {campoTasa2 ?
                          <p className="message-error-parrafo">{t("Thepercentageexceeds100%")}</p>
                          : null}
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="expectedExecution">{t("ExpectedExecution")}</Label>
                        <AvField
                          className="form-control"
                          type="text"
                          onKeyUp={(e) => { let x = currencyData.getRealPercent(e.target.value); e.target.value = currencyData.formatPercent(x,e); }}
                          value={props.jsonSow.expectedExecution}
                          onChange={(e) => { let x = currencyData.getRealPercent(e.target.value); parseFloat(x) > 100 ? setcampoTasa3(true) : setcampoTasa3(false); }}
                          name="expectedExecution"
                          id="expectedExecution"
                        />
                         {campoTasa3 ?
                          <p className="message-error-parrafo">{t("Thepercentageexceeds100%")}</p>
                          : null}
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="assignedDomiciledContract">{t("AssignedDomiciledContract")}</Label>
                        <Select noOptionsMessage={() => ""}
                          showSearch
                          style={{ width: "100%" }}
                          placeholder={t("SearchtoSelect")}
                          optionFilterProp="children"
                          defaultValue={contractType}
                          onChange={(e) => { setcontractType(e) }}
                          filterOption={(input, option) =>
                            option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {contractTypeCatalogue?.length > 0 ?
                            contractTypeCatalogue.map((item, index) => (
                              <Option key={uniq_key()} value={item.Description}>{item.Description}</Option>
                            ))
                            : null}
                        </Select>
                      </div>
                    </Col>
                  </Row>

                </CardBody>
                <CardFooter style={{ textAlign: "right" }}>

                  <Button id="btnNew" color="danger" type="button" style={{ margin: '5px' }} onClick={props.toggle} data-dismiss="modal">
                    <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
                  </Button>
                  {props.botones ?
                    <Button id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                      {" "} {props.tipo == "CARGATRABAJO" ? t("Save") : t("Save")}
                    </Button> : null}
                </CardFooter>
              </Card>


            </AvForm>


          </Col>
        </Row>


      </div>
    </Modal>
  );
};

ModalCargaTrabajo.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func
};

export default ModalCargaTrabajo;
