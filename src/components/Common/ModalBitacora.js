import React, { useEffect, useState } from "react"
import { withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
import { Row, Col, Button, Label, Input, Modal, Card, CardBody, CardFooter } from "reactstrap"
import { AvForm, AvField } from "availity-reactstrap-validation"
import Services from "../../services/BackendServices/Services";
import { useLocation, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toastr from "toastr";
import "toastr/build/toastr.min.css";

import Alert from 'react-bootstrap/Alert'

import LocalStorageHelper from "../../helpers/LocalStorageHelper";
import * as opt from "../../helpers/options_helper";
import { BackendServices } from "../../services/index";

import { Select } from 'antd';

const Offsymbol = () => {
  const { Option } = Select;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2,
      }}
    >
      {" "}
      No
    </div>
  );
};
const OnSymbol = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        fontSize: 12,
        color: "#fff",
        paddingRight: 2,
      }}
    >
      {" "}
      Si
    </div>
  );
};


/* ---------------------------------------------------------------------------------------------- */
/*                  Funcion para mostrar el modal para guardar la bitacora manual                 */
/* ---------------------------------------------------------------------------------------------- */
const ModalBitacora = (props) => {


  const { t, i18n } = useTranslation();
  const [logProcessModel, setlogProcessModel] = useState(props.logProcessModel);
  const [localStorageHelper, setlocalStorageHelper] = useState(new LocalStorageHelper());
  const [backendServices, setbackendServices] = useState(new BackendServices());

  const [mainDebtor, setmainDebtor] = useState(null);
  const [msgData, setmsgData] = useState({ show: false, msg: "", isError: false });

  const [listDevolution, setlistDevolution] = useState([]);
  const [listDevolutionSelect, setListDevolutionSelect] = useState("");


  useEffect(() => {


    if (logProcessModel !== undefined && logProcessModel !== null) {
      loadMainDebtor(logProcessModel.transactId);
    }
  }, []);

  function loadMainDebtor(transactionId) {
    // consultarDeudorPrincipal
    Promise.allSettled([
      backendServices.consultPrincipalDebtor(transactionId),
      backendServices.getDevolutionCatalog()
    ]).then(allPromise => {
      const [{ value: debtor }, { value: devolutionCatalog }] = allPromise;
      if (debtor !== undefined) {
        setmainDebtor(debtor);
        setlistDevolution(devolutionCatalog.map(list => ({ Code: list.id, Description: list.description })));
      }

    }).catch(err => { console.log(err) });
  }

  //mostrar mensaje 
  function showMessage(message, isError = false) {
    setmsgData({ show: true, msg: message, isError: isError })
  }


  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    onSaveLogProcess(values.txtComment);
  }

  function onSaveLogProcess(observations) {

    var credentials = localStorageHelper.get(opt.VARNAME_USRCREDENTIAL);

    logProcessModel.responsible = credentials?.usr ?? "admin"
    logProcessModel.clientId = mainDebtor?.personId ?? logProcessModel.clientId;
    logProcessModel.observations = observations;
    logProcessModel.devolutionId = listDevolutionSelect?.Code ?? '';
    logProcessModel.devolutionDesc = listDevolutionSelect?.Description ?? '';
    logProcessModel.statusDescription = props.recommend ? t("Ready") : t("Returned");

    logProcessModel.autonomyCredit = props?.autonomyCredit ?? ' ';
    logProcessModel.autonomyBank = props?.autonomyBank ?? ' ';
    logProcessModel.decAutonomyCredit = props?.decAutonomyCredit ?? ' ';
    logProcessModel.decAutonomyBank = props?.decAutonomyBank ?? ' ';

    console.log("logProcessModel", logProcessModel)
    backendServices.saveHistorical(logProcessModel)
      .then(resp => {
        // console.log("saveHistorical", resp);
        if (resp !== undefined) {
          props.successSaved()
          props.toggle()
        }
        else {
          //Mensaje ERROR
          showMessage(t("ErrorSaveMessage"), true);
        }

        props.successSaved()
        props.toggle()

      }).catch(err => {
        showMessage(err.message, true);
      });
  }


  return (
    <Modal
      size="xl"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <div className="modal-header">
        <h5 className="modal-title mt-0">{props.recommend ? `${props.t(props.recommendTitle)}` : props.t("NewLog")}</h5>
        <button
          type="button"
          onClick={props.toggle}
          className="close"
          data-dismiss="modal"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <AvForm id="frmNewLog" className="needs-validation" onSubmit={handleSubmit}>
        <div className="modal-body">
          {!props.recommend && <Row className="mb-3">
            <Label htmlFor="authType">{t("Return List")}</Label>
            <Select disabled={false} noOptionsMessage={() => ""}
              showSearch
              style={{ width: "100%" }}
              placeholder={t("SearchtoSelect")}
              optionFilterProp="children"
              defaultValue={JSON.stringify(listDevolution?.find(aut => aut.Code === listDevolutionSelect?.authType))}
              onChange={(e) => {
                let listDevolution = JSON.parse(e)
                setListDevolutionSelect(listDevolution)
              }}
              filterOption={(input, option) =>
                option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {listDevolution?.length > 0 ?
                listDevolution?.map((item, index) => (
                  <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                ))
                : null}
            </Select>
          </Row>}
          <Row>
            <Col md="12">
              <div className="mb-3">
                <Label htmlFor="txtComment">{t("Comment")}</Label>
                <AvField
                  className="form-control"
                  name="txtComment"
                  type="textarea"
                  rows={7}
                  validate={{
                    required: { value: true, errorMessage: t("Required Field") }
                  }}
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col md="12">
              <Alert show={msgData.show} variant={msgData.isError ? "danger" : "success"} dismissible onClose={() => { setmsgData({ show: false, msg: "", isError: false }) }}>
                {msgData.msg}
              </Alert>
            </Col>
          </Row>

        </div>
        <div className="modal-footer">
          <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { props.toggle() }}>
            <i className="mdi mdi-cancel mid-12px"></i> {props.t("Cancel")}
          </Button>
          <Button color="success" type="submit" style={{ margin: '5px' }} >
            <i className="mdi mdi-content-save  mid-12px"></i> {props.t("Save")}
          </Button>
        </div>
      </AvForm>

    </Modal>
  );
};

ModalBitacora.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  successSaved: PropTypes.func,
  logProcessModel: PropTypes.any, //LogProcessModel
};

export default (withTranslation()(ModalBitacora));
