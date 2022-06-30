import React, { useState } from "react"
import PropTypes from 'prop-types';
import { useTranslation } from "react-i18next";
import Select from "react-select";

import { Link } from "react-router-dom"
import {
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
  Button,
  Label,
  Table,
  Modal,
} from "reactstrap"
import Alert from 'react-bootstrap/Alert'
import Switch from "react-switch";
import { BackendServices, CoreServices, BpmServices, } from "../../../services";
import { AvForm, AvField, AvGroup, AvInput, AvCheckbox } from "availity-reactstrap-validation";
import { PersonModel } from '../../../models/Common/PersonModel';
import LoadingOverlay from 'react-loading-overlay';
import watchlist from "../../../models/Core/WatchListModel";
const BlackListForm = props => {
  const { t, i18n } = useTranslation();
  const [selectClient, setselectClient] = useState(props.clientSelected);
  const [identificationTypeList, setidentificationTypeList] = useState([]);
  const [identificationTypeSelected, setidentificationTypeSelected] = useState(undefined);
  const [personTypeList, setpersonTypeList] = useState([]);
  const [personTypeSelected, setpersonTypeSelected] = useState(undefined);
  const [dataBlackListResult, setdataBlackListResult] = useState([]);
  const [apiServiceBackend, setapiServiceBackend] = useState(new BackendServices());
  const [apiCoreServices, setCoreServices] = useState(new CoreServices());
  const [msgData, setmsgData] = useState({ show: false, msg: "", isError: false });
  const [showLoading, setshowLoading] = useState(false);
  const [alreadyVerified, setalreadyVerified] = useState(false);
  const [openGoogle, setopenGoogle] = useState(true);
  React.useEffect(() => {
    fetchData();
  }, []);
  //Caraga Inicial de datos
  function fetchData() {
    loadIdentificationTypes();
    loadPersonTypes();
  }
  //cargar lista de tipo de identificacion
  function loadIdentificationTypes() {
    // consultarCatalogoTipoIdentificacion
    apiServiceBackend.consultarCatalogoTipoIdentificacion()
      .then((data) => {
        if (data !== null && data !== undefined) {
          let json = [];
          for (let i = 0; i < data.length; i++) {
            json.push({ label: t(data[i]["description"]), value: data[i]["id"] })
          }
          setidentificationTypeList(json)
          setidentificationTypeSelected(selectClient !== undefined ? json.find(x => x.value === selectClient.idType) : json[0]);
        }
      }).catch((error) => { });
  }
  //cargar lista de tipo de personas
  function loadPersonTypes() {
    // consultarCatalogoTipoPersona
    apiServiceBackend.consultarCatalogoTipoPersona()
      .then((data) => {
        if (data !== null && data !== undefined) {
          let json = [];
          for (let i = 0; i < data.length; i++) {
            json.push({ label: t(data[i]["label"]), value: data[i]["code"] })
          }
          setpersonTypeList(json);
          setpersonTypeSelected(selectClient !== undefined ? json.find(x => x.value === Number(selectClient.personType)) : json[0]);
        }
      }).catch((error) => { });
  }
  //Actualizar valores de Cliente cada vez que se actualiza un campo
  function handleChangeInputFormBlackList(e) {
    var clientPerson = selectClient !== undefined ? selectClient : new PersonModel();
    clientPerson[e.target.name] = e.target.value;
    setselectClient(clientPerson);
    //si la persona es juridica auto seleccionamos RUC
    if (clientPerson.personType === 2) {
      setidentificationTypeSelected(identificationTypeList.find(x => x.value === "RUC"));
    }
  }
  //Guardar el Cliente
  function handleSubmitFormBlackList(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    //retornar los datos recolectados 
    let dataModel = watchlist.getRequestModel();
    switch (selectClient.idType) {
      case "RUC": {
        dataModel.pTypeId = 'JURIDICA';
        dataModel.pCustomerId = selectClient.clientDocumentId;
        dataModel.pCustomerListParams.KeyValueParam.push({ _x003C_Key_x003E_k__BackingField: "NOMBRE", _x003C_Value_x003E_k__BackingField: selectClient.name });
        break;
      }
      case "CED": {
        dataModel.pTypeId = 'CEDULA';
        dataModel.pCustomerId = selectClient.clientDocumentId;
        dataModel.pCustomerListParams.KeyValueParam.push({ _x003C_Key_x003E_k__BackingField: "NOMBRE", _x003C_Value_x003E_k__BackingField: selectClient.name });
        dataModel.pCustomerListParams.KeyValueParam.push({ _x003C_Key_x003E_k__BackingField: "SEGUNDO_NOMBRE", _x003C_Value_x003E_k__BackingField: selectClient.secondName });
        dataModel.pCustomerListParams.KeyValueParam.push({ _x003C_Key_x003E_k__BackingField: "PRIMER_APELLIDO", _x003C_Value_x003E_k__BackingField: selectClient.lastName });
        dataModel.pCustomerListParams.KeyValueParam.push({ _x003C_Key_x003E_k__BackingField: "SEGUNDO_APELLIDO", _x003C_Value_x003E_k__BackingField: selectClient.secondSurname });
        break;
      }
      default: {
        dataModel.pTypeId = 'PASAPORTE';
        dataModel.pCustomerId = selectClient.clientDocumentId;
        dataModel.pCustomerListParams.KeyValueParam.push({ _x003C_Key_x003E_k__BackingField: "NOMBRE", _x003C_Value_x003E_k__BackingField: selectClient.name });
        dataModel.pCustomerListParams.KeyValueParam.push({ _x003C_Key_x003E_k__BackingField: "SEGUNDO_NOMBRE", _x003C_Value_x003E_k__BackingField: selectClient.secondName });
        dataModel.pCustomerListParams.KeyValueParam.push({ _x003C_Key_x003E_k__BackingField: "PRIMER_APELLIDO", _x003C_Value_x003E_k__BackingField: selectClient.lastName });
        dataModel.pCustomerListParams.KeyValueParam.push({ _x003C_Key_x003E_k__BackingField: "SEGUNDO_APELLIDO", _x003C_Value_x003E_k__BackingField: selectClient.secondSurname });
        break;
      }
    }
    searchOnWatchListCheck(dataModel);
  }
  //Retorna los campos a mostrar en pantalla segun el tipo de persona seleccionada
  function getClientDataFormByPersonType(personType) {
    if (personType === undefined) {
      return null;
    }
    switch (personType.value) {
      case 1: {//Natural
        return (<React.Fragment>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="name">{t("FirstName")}</Label>
              <AvField
                className="form-control"
                name="name"
                type="text" onChange={handleChangeInputFormBlackList}
                value={selectClient !== undefined ? selectClient.name : ''}
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="secondName">{t("SecondName")}</Label>
              <AvField
                className="form-control"
                name="secondName"
                type="text" onChange={handleChangeInputFormBlackList}
                value={selectClient !== undefined ? selectClient.secondName : ''}
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="lastName">{t("FirstLastName")}</Label>
              <AvField
                className="form-control"
                name="lastName"
                type="text" onChange={handleChangeInputFormBlackList}
                value={selectClient !== undefined ? selectClient.lastName : ''}
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="secondSurname">{t("SecondLastName")}</Label>
              <AvField
                className="form-control"
                name="secondSurname"
                type="text" onChange={handleChangeInputFormBlackList}
                value={selectClient !== undefined ? selectClient.secondSurname : ''}
              />
            </div>
          </Col>

        </React.Fragment>)
      }
      case 2: {//Juridica
        return (
          <Col md="6">
            <div className="mb-3">
              <Label htmlFor="name">{t("SocialReason")}</Label>
              <AvField
                className="form-control"
                name="name"
                type="text" onChange={handleChangeInputFormBlackList}
                value={selectClient !== undefined ? selectClient.name : ''}
              />
            </div>
          </Col>
        )
      }
    }
    return null;
  }
  //mostar mensaje 
  function showMessage(message, isError = false) {
    msgData.show = false;
    setmsgData(msgData);
    setmsgData({ show: true, msg: message, isError: isError });
  }
  //realizar busqueda en listas de vigilancias
  function searchOnWatchListCheck(dataModel) {
    setshowLoading(true);
    apiCoreServices.postWhatchList(dataModel)
      .then((data) => {
        if (data.status === 200) {
          if (data.result.length > 0) {
            setdataBlackListResult(data.result);
          }
          else { showMessage(t('NoResults')); }
          setalreadyVerified(true);
        }
        else {
          showMessage(t('ErrorCode') + ": " + data.error.errorCode + "  " + t('ErrorMsg') + ": " + data.error.errorCode, true);
        }
      })
      .catch((error) => { console.error(error); })
      .finally(() => { setshowLoading(false); })
  }
  //funcion de Guardar Resultados y saber si tuvo coincidencias para enviarlo a cumplimiento
  function saveresults(hasCoincidences = false) {
    props.watchListResult({ blackList: hasCoincidences, comments: selectClient.comments !== undefined ? selectClient.comments : "" });
    props.toggle();
  }
  //Abre un tab para busquedas en google
  function onOpenGooleSearch() {
    let query;
    switch (selectClient.idType) {
      case "RUC": {
        query = [
          identificationTypeList.find(x => x.value === selectClient.idType).label,
          selectClient.clientDocumentId,
          selectClient.name
        ];
        break;
      }
      default: {
        query = [
          identificationTypeList.find(x => x.value === selectClient.idType).label,
          selectClient.clientDocumentId,
          selectClient.name,
          selectClient.secondName,
          selectClient.lastName,
          selectClient.secondSurname
        ];
        break;
      }
    }
    setopenGoogle(false);
    query = query.filter(item => item !== '').join('+');
    var searchUrl = `https://www.google.com/search?igu=1&gws_rd=ssl&q=${query}`;
    window.open(searchUrl, "_blank");
  }
  return (
    <Modal
      size="xl"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <div className="modal-header">
        <h5 className="modal-title mt-0">{t("WatchListCheck")}</h5>
        <button
          type="button"
          onClick={props.toggle}
          className="close"
          data-dismiss="modal"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body" style={{ minHeight: '500px' }}>
        <LoadingOverlay active={showLoading} spinner text={t("WaitingPlease")}>
          <AvForm id="frmBlackList" className="needs-validation" onSubmit={handleSubmitFormBlackList}>
            <Card>
              <CardBody>
                <Row>
                  <Col md="3">
                    <div className="mb-3">
                      <Label htmlFor="personType">{t("PersonType")}</Label>
                      <Select noOptionsMessage={() => ""} 
                        onChange={(e) => { setpersonTypeSelected(personTypeList.find(x => x.value === e.value)); handleChangeInputFormBlackList({ target: { name: 'personType', value: e.value } }) }}
                        options={personTypeList}
                        classNamePrefix="select2-selection"
                        value={personTypeSelected}
                        name="personType"
                      />
                    </div>
                  </Col>
                  <Col md="3">
                    <div className="mb-3" style={{ textAlign: "right" }}>
                      <Label>{' '}</Label> <br></br>
                      <Button color="success" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-file-find mdi-12px"></i>
                        {" "}{t("Consult")}
                      </Button>
                      <Button color="warning" type="button" onClick={onOpenGooleSearch} style={{ margin: '5px' }}><i className="mdi mdi-google mdi-12px"></i>
                        {" "}{t("Google")}
                      </Button>
                    </div>
                  </Col>
                </Row>
                <Row>
                  {getClientDataFormByPersonType(personTypeSelected)}


                  <Col md="3">
                    <div className="mb-3">
                      <Label>{t("IdType")}</Label>
                      <Select noOptionsMessage={() => ""} 
                        onChange={(e) => { setidentificationTypeSelected(identificationTypeList.find(x => x.value === e.value)); handleChangeInputFormBlackList({ target: { name: 'idType', value: e.value } }) }}
                        options={identificationTypeList}
                        classNamePrefix="select2-selection"
                        value={identificationTypeSelected}
                        name="idType"
                      />
                    </div>
                  </Col>

                  <Col md="3">
                    <div className="mb-3">
                      <Label htmlFor="idnumber">{t("IdNumber")}</Label>
                      <AvField onChange={handleChangeInputFormBlackList} className="form-control"
                        name="clientDocumentId" type="text"
                        //validate={{required: { value: true, errorMessage: t("Required Field") }}}
                        value={selectClient !== undefined ? selectClient.clientDocumentId : ''}
                      />
                    </div>
                  </Col>
                </Row>

                <Alert show={msgData.show} variant={msgData.isError ? "danger" : "success"} dismissible onClose={() => { console.log("onClose"); setmsgData({ show: false, msg: "", isError: false }) }}>
                  {msgData.msg}
                </Alert>

              </CardBody>
              <CardBody>
                <Row>
                  <Col md="12">
                    {dataBlackListResult !== undefined && dataBlackListResult.length > 0 ?
                      <div className="mb-3">
                        <Label>{t("Results")}</Label>
                        <div className="table-responsive styled-table-div">
                          <Table className="table table-striped table-hover styled-table table">
                            <thead className="">
                              <tr>
                                <th>{t("#")}</th>
                                <th>{t("FullName")}</th>
                                <th>{t("Evaluation")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dataBlackListResult.map((item, index) => (
                                <tr>
                                  <td>{item.id}</td>
                                  <td>{item.name}</td>
                                  <td>{item.evaluation}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                      : null}
                  </Col>
                </Row>
              </CardBody>
              <CardBody>
                <Row>
                  <Col md="12">
                    <div className="mb-3">
                      <Label htmlFor="comments">{t("Observation")}</Label>
                      <AvField
                        className="form-control"
                        name="comments" rows={7}
                        type="textarea" onChange={handleChangeInputFormBlackList}
                      />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter style={{ textAlign: "right" }}>
                <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={props.toggle}>
                  <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
                </Button>
                <Button color="danger" disabled={openGoogle} type="button" onClick={() => { saveresults(true) }} style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                  {" "}{t("WithMatches")}
                </Button>
                <Button color="success" disabled={openGoogle} type="button" onClick={() => { saveresults() }} style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                  {" "}{t("WithoutMatches")}
                </Button>
              </CardFooter>
            </Card>
          </AvForm>
        </LoadingOverlay>
      </div>
    </Modal>

  );
};

BlackListForm.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onCancel: PropTypes.func,
  clientSelected: PropTypes.any,
  watchListResult: PropTypes.func,
}

export default BlackListForm;
