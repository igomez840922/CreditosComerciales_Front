import React, { useState } from "react"
import PropTypes from 'prop-types';
import { useTranslation } from "react-i18next";
import DatePicker from 'react-datepicker';
import Select from "react-select";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
  Button,
  Label,
  Table,
} from "reactstrap"

import Alert from 'react-bootstrap/Alert'
import { BackendServices, CoreServices, BpmServices, } from "../../../services";
import { AvForm, AvField, AvGroup, AvInput, AvCheckbox } from "availity-reactstrap-validation";
import { AvDateField } from "availity-reactstrap-validation";
import { PersonModel } from '../../../models/Common/PersonModel';
import { BlackListHistoryModel } from '../../../models/Common/BlackListHistoryModel';
import BlackListForm from "./BlackListForm"
import checkNumber from "../../../helpers/checkNumber";
import { Link } from "react-router-dom"
//Import Flatepicker

import * as OPTs from "../../../helpers/options_helper"
import moment from "moment";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

const Offsymbol = () => {
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

const ClientForm = props => {
  const { t, i18n } = useTranslation();
  const [transactId, settransactId] = useState(props.transactId);
  const [selectClient, setselectClient] = useState(props.clientSelected);
  const [identificationTypeList, setidentificationTypeList] = useState([]);
  const [identificationTypeSelected, setidentificationTypeSelected] = useState(undefined);
  const [personTypeList, setpersonTypeList] = useState([]);
  const [personTypeSelected, setpersonTypeSelected] = useState(undefined);
  const [roleList, setroleList] = useState([]);
  const [roleSelected, setroleSelected] = useState(undefined);
  const [countryList, setcountryList] = useState([]);
  const [campoRequeridoCountry, setcampoRequeridoCountry] = useState(false);
  const [countrySelected, setcountrySelected] = useState(undefined);
  const [apiServiceBackend, setapiServiceBackend] = useState(new BackendServices());
  const [apiCoreServices, setCoreServices] = useState(new CoreServices());
  const [msgData, setmsgData] = useState({ show: false, msg: "", isError: false });
  const [showBlackListForm, setshowBlackListForm] = useState(false);
  //On Mounting (componentDidMount)
  React.useEffect(() => {
    //console.log("useEffect", transactId)
    fetchData();
  }, []);
  function fetchData() {
    loadIdentificationTypes();
    loadPersonTypes();
    loadRoles();
    loadCountries();
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
  //cargar lista de roles
  function loadRoles() {
    apiServiceBackend.retrieveRoleCatalog()
      .then((data) => {
        if (data !== null && data !== undefined) {
          let json = [];
          for (let i = 0; i < data.length; i++) {
            json.push({ label: t(data[i]["roleDescription"]), value: data[i]["roleId"], checked: false })
          }
          if (selectClient !== undefined && selectClient.roles.length > 0) {
            selectClient.roles.map(async function (item, i) {
              var rol = json.find((rolItem) => {
                return rolItem.value === item.roleId;
              })
              if (rol !== undefined && rol !== null) {
                rol.checked = true;
              }
            })
          }
          setroleList(json)
        }
      }).catch((error) => { });
  }
  //cargar lista de paises
  function loadCountries() {
    apiCoreServices.getPaisesCatalogo()
      .then((data) => {
        if (data !== null && data !== undefined) {
          let json = [];
          for (let i = 0; i < data.Records.length; i++) {
            json.push({ label: t(data.Records[i]["Description"]), value: data.Records[i]["Code"] })
          }
          // console.log("loadCountries", selectClient);
          setcountryList(json);
          setcountrySelected(json.find(x => x.value === selectClient.nationality));
          // setcountrySelected(selectClient !== undefined ? json.find(x => x.value === selectClient.nationality) : json[0]);
        }
      }).catch((error) => { });
  }
  //Actualizar valores de Cliente cada vez que se actualiza un campo
  function handleChangeInputFormClient(e) {
    // console.log("handleChangeInputFormClient", e);
    if (e.target.name == 'socialReason')
      e.target.name = 'name';
    var clientPerson = selectClient !== undefined ? selectClient : new PersonModel();
    clientPerson.transactId = transactId;
    clientPerson[e.target.name] = e.target.value;
    setselectClient(clientPerson);
    //si la persona es juridica auto seleccionamos RUC
    if (clientPerson.personType === 2) {
      setidentificationTypeSelected(identificationTypeList.find(x => x.value === "RUC"));
    }
  }
  //Actualizar roles de Cliente cada vez que se actualiza un checkbox
  function handleChangeInputChkClient(e) {
    var clientPerson = selectClient !== undefined ? selectClient : new PersonModel();
    clientPerson.transactId = transactId;
    if (e.target.checked) { //si es true lo agregamos
      clientPerson.roles.push({ roleId: e.target.name })
    }
    else {//lo borramos
      clientPerson.roles = clientPerson.roles.filter(rol => rol.roleId !== e.target.name)
    }
    setselectClient(clientPerson);
  }
  //Guardar el Cliente
  async function handleSubmitFormClient(event, errors, values) {

    selectClient.name = values.name ?? values.nameJ;
    selectClient.secondName = values.secondName ?? values.secondNameJ;

    event.preventDefault();
    if (errors.length > 0) {
      return;
    }

    if (selectClient !== undefined && selectClient !== null) {
      if (countrySelected == undefined) {
        setcampoRequeridoCountry(true);
        return;
      } else {
        setcampoRequeridoCountry(false)
      }
      if (selectClient.roles.length <= 0) {
        showMessage(t("YoumustselectatleasoneRoleforthisclient"), true);
        return;
      }
      if (selectClient.blacklist.length <= 0) {
        showMessage(t("ThisclienthasnotbeenverifiedonWatchLists"), true);
        return;
      }
      if (selectClient.idType.length <= 0) {
        showMessage(t("PleaseselectIdentificationType"), true);
        return;
      }
      if (selectClient.nationality.length <= 0) {
        showMessage(t("PleaseselectNationality"), true);
        return;
      }

      if (selectClient.personId <= 0) {//nueva persona
        apiServiceBackend.nuevoOrquestadoListaPersonaSolicitud(selectClient).then((data) => {
          if (data !== null && data !== undefined) {

            var client = selectClient.roles.find(x => x.roleId === "DEU");
            if (client !== undefined && client !== null) {
              props.checkDebtorShareholders();
            }
            //salir
            props.onCancel();

          }
          else {
            showMessage(t("Datacouldnotbesaved"), true);
          }
        }).catch((error) => { });
      }
      else {
        apiServiceBackend.actualizarOrquestadoListaPersonaSolicitud(selectClient)
          .then((data) => {
            if (data !== null && data !== undefined) {
              //salir
              props.onCancel();
            }
            else {
              showMessage(t("Datacouldnotbesaved"), true);
            }
          }).catch((err) => { });
      }
    }
    else {
      showMessage(t("Theclientisnotvalid"), true);
    }
  }
  //Retorna los campos a mostrar en pantalla segun el tipo de persona seleccionada
  function getClientDataFormByPersonType(personType) {
    if (personType === undefined) {
      return null;
    }
    switch (personType.value) {
      case 1: {//Natural
        return (<React.Fragment key="cfn">
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="name">{t("FirstName")}</Label>
              <AvField
                className="form-control"
                name="name"
                type="text" onChange={handleChangeInputFormClient}
                value={selectClient !== undefined ? selectClient.name : ''}
                errorMessage={t("Required Field")}
                validate={{ required: { value: true } }}
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="secondName">{t("SecondName")}</Label>
              <AvField
                className="form-control"
                name="secondName"
                type="text" onChange={handleChangeInputFormClient}
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
                type="text" onChange={handleChangeInputFormClient}
                value={selectClient !== undefined ? selectClient.lastName : ''}
                errorMessage={t("Required Field")}
                validate={{ required: { value: true } }}
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="secondSurname">{t("SecondLastName")}</Label>
              <AvField
                className="form-control"
                name="secondSurname"
                type="text" onChange={handleChangeInputFormClient}
                value={selectClient !== undefined ? selectClient.secondSurname : ''}
              />
            </div>
          </Col>
          <Col md="3">
            <AvGroup className="mb-3">
              <Label htmlFor="birthDate">{t("DBO")}</Label>
               
              <Flatpickr
                name="birthDate"
                className="form-control d-block"
                placeholder={OPTs.FORMAT_DATE_SHOW}
                options={{
                  dateFormat: OPTs.FORMAT_DATE,
                  maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                  defaultDate: selectClient !== undefined ? new Date(moment(selectClient.birthDate, 'YYYY-MM-DD').format()) : new Date()
                }}
                onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr,"DD/MM/YYYY").format("YYYY-MM-DD") } }) }}
                />

            </AvGroup>

          </Col>
        </React.Fragment>)
      }
      case 2: {//Juridica
        return (
          <React.Fragment key="cfj">
            <Col md="6">
              <div className="mb-3">
                <Label htmlFor="name">{t("SocialReason")}</Label>
                <AvField
                  className="form-control"
                  name="nameJ"
                  type="text" onChange={handleChangeInputFormClient}
                  value={selectClient !== undefined ? selectClient.name : ''}
                  errorMessage={t("Required Field")}
                  validate={{ required: { value: true } }} />
              </div>
            </Col>
            <Col md="6">
              <div className="mb-3">
                <Label htmlFor="secondName">{t("CommercialName")}</Label>
                <AvField
                  className="form-control"
                  name="secondNameJ"
                  type="text"
                  onChange={handleChangeInputFormClient}
                  value={selectClient !== undefined ? selectClient.secondName : ''}
                  errorMessage={t("Required Field")}
                // validate={{ required: { value: true } }}
                />
              </div>
            </Col>

          </React.Fragment>
        )
      }
      default:
        break;
    }
    return null;
  }
  //Carga de Datos de Cliente de T24 Seleccionado
  function loadClientDataT24(dataClientT24) {
    var clientPerson = new PersonModel();
    if (selectClient !== undefined) {
      clientPerson.personId = selectClient.personId;
    }
    clientPerson.customerNumberT24 = dataClientT24.id;
    clientPerson.clientDocumentId = dataClientT24.idnumber;
    clientPerson.name = dataClientT24.firstname;
    clientPerson.secondName = dataClientT24.secondname;
    clientPerson.lastName = dataClientT24.lastname;
    clientPerson.secondSurname = dataClientT24.secondlastname;
    clientPerson.personType = personTypeList.find(x => x.value === Number(dataClientT24.partyType)).value;
    clientPerson.idType = identificationTypeList.find(x => x.value === dataClientT24.idtype).value;
    setselectClient(clientPerson);
    setidentificationTypeSelected(identificationTypeList.find(x => x.value === clientPerson.idType));
    setpersonTypeSelected(personTypeList.find(x => x.value === clientPerson.personType));
  }
  //mostrar mensaje 
  function showMessage(message, isError = false) {
    setmsgData({ show: true, msg: message, isError: isError })
  }
  //Abrir modal de verificacion en listas de vigilancias
  function showWatchListCheck(show = true) {
    setshowBlackListForm(show);
  }
  function addWatchListResult(resultWatchList) {
    if (selectClient !== undefined) {
      var blacklistmdl = new BlackListHistoryModel(); //new BlacklistModel();
      blacklistmdl.blackList = resultWatchList.blackList;
      blacklistmdl.comment = resultWatchList.comments;
      blacklistmdl.transactId = transactId;
      selectClient.blacklist.push(blacklistmdl);
      setselectClient(selectClient);
    }
  }

  //Elimina record de la lista de Incidencias de Black Lista
  return (
    <React.Fragment key="libl">
      <p className="card-title-desc"></p>
      <AvForm id="frmClient" className="needs-validation" onSubmit={handleSubmitFormClient}>
        <Card>
          <h5 className="card-sub-title">{t("ClientData")}</h5>
          <CardBody>
            <Row>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="personType">{t("PersonType")}</Label>
                  <Select noOptionsMessage={() => ""}
                    onChange={(e) => { setpersonTypeSelected(personTypeList.find(x => x.value === e.value)); handleChangeInputFormClient({ target: { name: 'personType', value: e.value } }) }}
                    options={personTypeList}
                    classNamePrefix="select2-selection"
                    value={personTypeSelected}
                    name="personType"
                  />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="customerNumberT24">{t("ClientNumber")}</Label>
                  <AvField onChange={handleChangeInputFormClient} className="form-control"
                    name="customerNumberT24" type="number" disabled={selectClient !== undefined ? selectClient.isNew : true}
                    value={selectClient !== undefined ? selectClient.customerNumberT24 : ''}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              {getClientDataFormByPersonType(personTypeSelected)}

              <Col md="3">
                <div className="mb-3">
                  <Label>{t("IdType")}</Label>
                  <Select noOptionsMessage={() => ""}
                    onChange={(e) => { setidentificationTypeSelected(identificationTypeList.find(x => x.value === e.value)); handleChangeInputFormClient({ target: { name: 'idType', value: e.value } }) }}
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
                  <AvField onChange={handleChangeInputFormClient} className="form-control"
                    name="clientDocumentId" type="text"
                    validate={{ required: { value: true, errorMessage: t("Required Field") } }}
                    value={selectClient !== undefined ? selectClient.clientDocumentId : ''}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="nationality">{t("Nationality")}</Label>
                  <Select noOptionsMessage={() => ""}
                    onChange={(e) => { setcountrySelected(countryList.find(x => x.value === e.value)); handleChangeInputFormClient({ target: { name: 'nationality', value: e.value } }) }}
                    options={countryList}
                    classNamePrefix="select2-selection"
                    value={countrySelected}
                    name="nationality"
                  />
                  {campoRequeridoCountry ?
                    <p className="message-error-parrafo">{t("Required Field")}</p>
                    : null}
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="phone">{t("PhoneNumber")}</Label>
                  <AvField onChange={handleChangeInputFormClient} className="form-control"
                    name="phone"
                    type="text"
                    onKeyPress={(e) => { return checkNumber(e) }}
                    validate={{
                      number: { value: true, errorMessage: t("InvalidField") },
                    }}
                    value={selectClient !== undefined ? selectClient.phone : ''}
                  />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="email">{t("Email")}</Label>
                  <AvField onChange={handleChangeInputFormClient} className="form-control"
                    name="email" type="email"
                    value={selectClient !== undefined ? selectClient.email : ''}
                  />
                </div>
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <Card>
                  <h5 className="card-sub-title">{t("Roles")}</h5>
                  <CardBody>
                    <Row>
                      {roleList.map((item, index) => (
                        <Col md="4">
                          <AvGroup check className="my-2">
                            <AvInput type="checkbox" defaultChecked={item.checked} name={item.value} onChange={handleChangeInputChkClient} />
                            <Label htmlFor={item.value}> {item.label}</Label>
                          </AvGroup>
                        </Col>
                      ))}
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>


            <Row>
              <Col xs={12}>
                <Card>
                  <CardBody>
                    <Row>
                      <Col md="6">
                        <h5 className="card-sub-title">{t("BlackListIncidences")}</h5>
                      </Col>
                      <Col md={6} style={{ textAlign: "right", }}>
                        <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={showWatchListCheck} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <div className="table-responsive styled-table-div">
                          <Table className="table table-striped table-hover styled-table table">
                            <thead>
                              <tr>
                                <th>{t("WithMatches")}</th>
                                <th>{t("Observations")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectClient !== undefined && selectClient.blacklist !== undefined && selectClient.blacklist.length > 0 ?
                                selectClient.blacklist.map((item, index) => (
                                  <tr key={index}>
                                    <td>{item.blackList ? "Si" : "No"}</td>
                                    <td>{item.comment}</td>
                                  </tr>
                                )) :
                                <tr>
                                  <td colSpan={7}>
                                    <div className="alert alert-info" style={{ textAlign: "center" }}>{t("NotVerified")}</div>
                                  </td>
                                </tr>

                              }
                            </tbody>
                          </Table>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <Alert show={msgData.show} variant={msgData.isError ? "danger" : "success"} dismissible onClose={() => { console.log("onClose"); setmsgData({ show: false, msg: "", isError: false }) }}>
                  {msgData.msg}
                </Alert>
              </Col>
            </Row>
          </CardBody>
          <CardFooter style={{ textAlign: "right" }}>
            <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={props.onCancel}>
              <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
            </Button>
            <Button color="success" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
              {" "}{t("Save")}
            </Button>
          </CardFooter>
        </Card>
      </AvForm>
      {showBlackListForm ?
        <BlackListForm clientSelected={selectClient} isOpen={showBlackListForm} toggle={() => { setshowBlackListForm(!showBlackListForm) }} watchListResult={addWatchListResult} />
        : null}
    </React.Fragment>
  );
};
ClientForm.propTypes = {
  onCancel: PropTypes.func,
  clientSelected: PropTypes.any,
  transactId: PropTypes.any,
  checkDebtorShareholders: PropTypes.func
}
export default ClientForm;