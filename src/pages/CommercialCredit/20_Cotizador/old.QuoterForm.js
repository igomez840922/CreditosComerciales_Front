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

const QuoterForm = props => {
  const { t, i18n } = useTranslation();
  const [selectClient, setselectClient] = useState(props.clientSelected);
  const [identificationTypeList, setidentificationTypeList] = useState([]);
  const [identificationTypeSelected, setidentificationTypeSelected] = useState(undefined);
  const [personTypeList, setpersonTypeList] = useState([]);
  const [personTypeSelected, setpersonTypeSelected] = useState(undefined);
  const [countryList, setcountryList] = useState([]);
  const [campoRequeridoCountry, setcampoRequeridoCountry] = useState(false);
  const [countrySelected, setcountrySelected] = useState(undefined);
  const [banca, setBanca] = useState([]);
  const [bancaSelected, setBancaSelected] = useState(undefined);
  
  const [apiServiceBackend, setapiServiceBackend] = useState(new BackendServices());
  const [apiCoreServices, setCoreServices] = useState(new CoreServices());
  const [msgData, setmsgData] = useState({ show: false, msg: "", isError: false });
  //On Mounting (componentDidMount)
  React.useEffect(() => {
    //console.log("useEffect", transactId)
    fetchData();
  }, []);
  function fetchData() {
    loadIdentificationTypes();
    loadPersonTypes();
    loadCountries();
    loadBank();
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

  // cargarBancas
  function loadBank() {
    apiCoreServices.getBancaCatalogo()
      .then(response => {
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response.Records.length; i++) {
          json.push({ label: response.Records[i]["Description"], value: response.Records[i]["Code"] })
        }
        setBanca(json);
      });
  }

  //Actualizar valores de Cliente cada vez que se actualiza un campo
  function handleChangeInputFormClient(e) {
    // console.log("handleChangeInputFormClient", e);
    if (e.target.name == 'socialReason')
      e.target.name = 'name';
    var clientPerson = selectClient !== undefined ? selectClient : new PersonModel();
    //clientPerson.transactId = transactId;
    clientPerson[e.target.name] = e.target.value;
    setselectClient(clientPerson);
    //si la persona es juridica auto seleccionamos RUC
    if (clientPerson.personType === 2) {
      setidentificationTypeSelected(identificationTypeList.find(x => x.value === "RUC"));
    }
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
            {/*<Col md="6">
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
            </Col>*/}

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
              {/*<Col md="3">
                <div className="mb-3">
                  <Label htmlFor="customerNumberT24">{t("ClientNumber")}</Label>
                  <AvField onChange={handleChangeInputFormClient} className="form-control"
                    name="customerNumberT24" type="number" disabled={selectClient !== undefined ? selectClient.isNew : true}
                    value={selectClient !== undefined ? selectClient.customerNumberT24 : ''}
                  />
                </div>
  </Col>*/}
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
              {getClientDataFormByPersonType(personTypeSelected)}

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
              <Col md="12">
                <Alert show={msgData.show} variant={msgData.isError ? "danger" : "success"} dismissible onClose={() => { console.log("onClose"); setmsgData({ show: false, msg: "", isError: false }) }}>
                  {msgData.msg}
                </Alert>
              </Col>
            </Row>
          </CardBody>

          <h5 className="card-sub-title">{t("QuoterData")}</h5>
          <CardBody>
            <Row>

            <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="email">{t("Monto Solicitado")}</Label>
                  <AvField onChange={handleChangeInputFormClient} className="form-control"
                    name="amount" type="text"
                  />
                </div>
              </Col>

              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="email">{t("Tasa Anual(%)")}</Label>
                  <AvField onChange={handleChangeInputFormClient} className="form-control"
                    name="anualRate" type="text"
                  />
                </div>
              </Col>

              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="efectiveRate">{t("Tasa Efectiva (%)")}</Label>
                  <AvField onChange={handleChangeInputFormClient} className="form-control"
                    name="efectiveRate" type="text"
                  />
                </div>
              </Col>


              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="feci">{t("Feci")}</Label>
                  <select 
                    className="form-control"
                    name="feci">
                      <option value={true}>{"Si"}</option>
                      <option value={false}>{"No"}</option>
                    </select>
                </div>
              </Col>

              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="feciAmount">{t("Monto Feci")}</Label>
                  <AvField onChange={handleChangeInputFormClient} className="form-control"
                    name="feciAmount" type="text"
                  />
                </div>
              </Col>

              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="term">{t("Plazo (Meses)")}</Label>
                  <AvField onChange={handleChangeInputFormClient} className="form-control"
                    name="term" type="text"
                  />
                </div>
              </Col>

              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="paymentsType">{t("Pagos")}</Label>
                  <select 
                    className="form-control"
                    name="paymentsType">
                      <option value={true}>{"Mensual"}</option>
                      <option value={false}>{"Trimestral"}</option>
                      <option value={false}>{"Semestral"}</option>
                      <option value={false}>{"Anual"}</option>
                    </select>
                </div>
              </Col>

              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="gracePeriod">{t("Período de Gracia")}</Label>
                  <select 
                    className="form-control"
                    name="gracePeriod">
                      <option value={true}>{"Si"}</option>
                      <option value={false}>{"No"}</option>
                    </select>
                </div>
              </Col>

              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="balloomFee">{t("Cuota Balloom")}</Label>
                  <select 
                    className="form-control"
                    name="balloomFee">
                      <option value={true}>{"Si"}</option>
                      <option value={false}>{"No"}</option>
                    </select>
                </div>
              </Col>

              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="financialAmount">{t("Monto a Financiar")}</Label>
                  <AvField onChange={handleChangeInputFormClient} className="form-control"
                    name="financialAmount" type="text"
                  />
                </div>
              </Col>

              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="initialAmount">{t("Abono Inicial")}</Label>
                  <AvField onChange={handleChangeInputFormClient} className="form-control"
                    name="initialAmount" type="text"
                  />
                </div>
              </Col>

              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="monthLetter">{t("Letra Mensual")}</Label>
                  <AvField onChange={handleChangeInputFormClient} className="form-control"
                    name="monthLetter" type="text"
                  />
                </div>
              </Col>

              <Col md="6">
              <div className="mb-4">
                <Label>{t("Banking")}</Label>
                <Select noOptionsMessage={() => ""}
                  onChange={(e) => {
                    setBancaSelected(banca.find(x => x.value === e.value)) //changeAll(e, "codigoBanca");
                  }}
                  options={banca}
                  value={bancaSelected}
                  classNamePrefix="select2-selection"
                  placeholder={t("SelectBanking")}
                />
              </div>
            </Col>

            <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="legalExpenses">{t("Gastos Legales")}</Label>
                  <AvField onChange={handleChangeInputFormClient} className="form-control"
                    name="legalExpenses" type="text"
                  />
                </div>
              </Col>

              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="fideicomiso">{t("Fideicomiso")}</Label>
                  <AvField onChange={handleChangeInputFormClient} className="form-control"
                    name="fideicomiso" type="text"
                  />
                </div>
              </Col>

            </Row>
          
          </CardBody>

          <h5 className="card-sub-title">{t("Results")}</h5>
          <CardBody>
            <Row>
            <Col md="12">
            <div className="table-responsive styled-table-div">
                                <Table className="table table-striped table-hover styled-table">
                                    <thead>
                                        <tr>
                                            <th>{t("Período")}</th>
                                            <th>{t("Abono")}</th>
                                            <th>{t("Interés")}</th>
                                            <th>{t("Feci")}</th>
                                            <th>{t("Capital")}</th>
                                            <th>{t("Saldo")}</th>
                                            <th>{t("Total Int.")}</th>
                                            <th>{t("Total Cap.")}</th>
                                            <th>{t("Total Pagado")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{t("1")}</td>
                                            <td>$88.126,81</td>
                                            <td>$16.378,19</td>
                                            <td></td>
                                            <td>$71.748,62</td>
                                            <td>$2.548.761,38</td>
                                            <td>$16.378,19</td>
                                            <td>$71.748,62</td>
                                            <td>$88.126,81</td>
                                        </tr>
                                        <tr>
                                            <td>{t("2")}</td>
                                            <td>$88.126,81</td>
                                            <td>$15.929,76</td>
                                            <td></td>
                                            <td>$72.197,05</td>
                                            <td>$2.476.564,32</td>
                                            <td>$32.307,95</td>
                                            <td>$143.945,68</td>
                                            <td>$176.253,62</td>
                                        </tr>
                                        <tr>
                                            <td>{t("3")}</td>
                                            <td>$88.126,81</td>
                                            <td>$15.478,53</td>
                                            <td></td>
                                            <td>$72.648,28</td>
                                            <td>$2.403.916,04</td>
                                            <td>$47.786,47</td>
                                            <td>$216.593,96</td>
                                            <td>$264.380,43</td>
                                        </tr>
                                        <tr>
                                            <td>{t("4")}</td>
                                            <td>$88.126,81</td>
                                            <td>$15.024,48</td>
                                            <td></td>
                                            <td>$73.102,34</td>
                                            <td>$2.330.813,70</td>
                                            <td>$62.810,95</td>
                                            <td>$289.696,30</td>
                                            <td>$352.507,24</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
            </Col>             
            </Row>
          
          </CardBody>

          <CardFooter style={{ textAlign: "right" }}>
            <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={props.onCancel}>
              <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
            </Button>
            <Button color="info" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-printer mdi-12px"></i>
              {" "}{t("Print")}
            </Button>
            <Button color="success" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
              {" "}{t("Save")}
            </Button>
          </CardFooter>
        </Card>
      </AvForm>
     
    </React.Fragment>
  );
};
QuoterForm.propTypes = {
  onCancel: PropTypes.func
}
export default QuoterForm;