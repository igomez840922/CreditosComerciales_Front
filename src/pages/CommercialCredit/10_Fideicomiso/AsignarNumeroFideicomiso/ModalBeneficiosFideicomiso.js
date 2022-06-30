import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
import Select from "react-select";
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
import checkNumber from "../../../../helpers/checkNumber";

import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import ApiServiceBackend from "../../../../services/ApiServiceBackend";
import { CoreServices, BackendServices } from "../../../../services";
const ModalBeneficiosFideicomiso = (props) => {
  const [paises, setPaises] = useState([]);
  const [codigoPais, setCodigoPais] = useState(null);
  const [sumaParticipacion, setsumaParticipacion] = useState(0);
  const [sumaParticipacionMessage, setsumaParticipacionMessage] = useState(false);
  const [identificationType, setidentificationType] = useState("1");//1-Juridico, 2-Persona
  const [campoRequeridoTipo, setcampoRequeridoTipo] = useState(false);
  const [campoRequeridoNacionalidad, setcampoRequeridoNacionalidad] = useState(false);
  const [tipo, setTipo] = useState(null);
  const [nacionalidadSelect, setnacionalidadSelect] = useState(undefined);
  const [tipoPersona, settipoPersona] = useState(undefined);
  const [dataReturn, setDataReturn] = useState(props.jsonAccionistas);
  const [cambio, setcambio] = useState(1);
  const [identificationTypeList, setIdentificationTypeList] = useState([]);
  const [identificationTypeSelected, setIdentificationTypeSelected] = useState(undefined);
  const [personTypeSelect, setpersonTypeSelect] = useState(undefined);
  const [tipoIdentificacion, settipoIdentificacion] = useState(null);
  const [campoRequeridoIdentificacion, setcampoRequeridoIdentificacion] = useState(false);
  // Submitimos formulario para busqueda de clientes
  const [Relacion, setRelacion] = useState([]);
  const [relacionSelect, setrelacionSelect] = useState(undefined);

  const personTypeData = [{ label: props.t("Legal"), value: "1" }, { label: props.t("Natural"), value: "2" }]
  const { t, i18n } = useTranslation();
  React.useEffect(() => {
    // Read Api Service data
    console.log(props);
    cargarPaises()
    if (props.tipo != "guardar") {
      setidentificationType(props.dataSet.personType)
    }
  }, [props.isOpen]);
  React.useEffect(() => {
    // Read Api Service data
    var defaultVal = null;
    setrelacionSelect(undefined)
    // setnacionalidadSelect(undefined)
    // setIdentificationTypeSelected(undefined)
    // setpersonTypeSelect(undefined)
    try {
      if (Relacion.length > 0 && props.dataSet.relationship !== null) {
        defaultVal = Relacion.find(x => (x.label).toUpperCase() === (props.dataSet.relationship).toUpperCase());
        if (defaultVal !== undefined) {
          setrelacionSelect(defaultVal);
          // setcodigoRelacion(defaultVal.label);
        }
      } else {
        Relacion?.length > 0 ? setrelacionSelect(Relacion[0]) : setrelacionSelect(undefined);
        // Relacion?.length > 0 ? setcodigoRelacion(Relacion[0].label) : setcodigoRelacion(null);
        // Cargos?.length > 0 ? setCargosSelect(Cargos[0]) : setCargosSelect(undefined);
      }
      if (paises.length > 0 && props.dataSet.nationality !== null) {
        defaultVal = paises.find(x => (x.value).toUpperCase() === (props.dataSet.nationality).toUpperCase());
        if (defaultVal !== undefined) {
          setCodigoPais(defaultVal)
          setnacionalidadSelect(defaultVal);
        }
      }
      if (personTypeData.length > 0 && props.dataSet.personType !== null) {
        defaultVal = personTypeData.find(x => (x.value).toUpperCase() === (props.dataSet.personType).toUpperCase());
        if (defaultVal !== undefined) {

          setTipo(defaultVal.label)
          setpersonTypeSelect(defaultVal);
        }
      }
      if (identificationTypeList.length > 0 && props.dataSet.documentType !== null) {
        defaultVal = identificationTypeList.find(x => (x.value).toUpperCase() === (props.dataSet.documentType).toUpperCase());
        if (defaultVal !== undefined) {
          setidentificationType(defaultVal.label)
          settipoIdentificacion(defaultVal.label)
          setIdentificationTypeSelected(defaultVal);
        }
      }
    }
    catch (err) { }

  }, [props.isOpen, paises, Relacion]);
  function changePais(event) {
    setCodigoPais(event);
  }
  function changeTipo(event) {
    setTipo(event);
    setidentificationType(event.value);
  }
  function cargarPaises() {
    const api = new CoreServices();
    api.getPaisesCatalogo()
      .then(response => {
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response.Records.length; i++) {
          json.push({ label: response.Records[i]["Description"], value: response.Records[i]["Code"] })
        }
        const optionGroup1 = [
          {
            label: t("Selectacountry"),
            options: json,
          },

        ];
        setPaises(json);
        setcambio(null)
        setcambio(2)
      });
    const apiServiceBackend = new BackendServices();
    apiServiceBackend.consultarCatalogoTipoIdentificacion()
      .then((data) => {
        if (data !== null && data !== undefined) {
          let json = [];
          for (let i = 0; i < data.length; i++) {
            json.push({ label: t(data[i]["description"]), value: data[i]["id"] })
          }
          /*const optionGroup1 = [
            {
              label: t("ID Type"),
              options: json,
            },
          ];*/
          setIdentificationTypeList(json)
        }
      })
      .catch((error) => {
        console.error('api error: ', error);
      });
    // getRelacionCatalogo
    api.getRelacionCatalogo()
      .then(response => {
        if (response === null) { return; }
        let json = [];
        json.push({ label: "N/A", value: "N/A" })
        for (let i = 0; i < response.Records.length; i++) {
          json.push({ label: response.Records[i]["Description"], value: response.Records[i]["Code"] })
        }
        // setrelacionSelect(json[0]);
        setRelacion(json);
      });
  }
  // Submitimos formulario para busqueda de clientes
  function handleSubmit(event, errors, values) {
    if (tipo == null) {
      setcampoRequeridoTipo(true);
      return;
    } else {
      setcampoRequeridoTipo(false);
    }
    if (codigoPais == null) {
      setcampoRequeridoNacionalidad(true);
      return;
    } else {
      setcampoRequeridoNacionalidad(false);
    }
    if (tipoIdentificacion == null) {
      setcampoRequeridoIdentificacion(true);
      return;
    } else {
      setcampoRequeridoIdentificacion(false);
    }
    if (sumaParticipacionMessage) {
      return;
    }
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    values.codigoPais = codigoPais;
    values.documentType = identificationTypeSelected?.value ?? "";
    values.personType = personTypeSelect?.value ?? "";
    values.relationship = relacionSelect?.label ?? "";
    props.gestionDatos(values, props.tipo);

  }
  function handleChangeInputfrmSearch(e) {
    //selectedData[e.target.name] = e.target.value;
    //props.updateDataModel(selectedData);    

    switch (e.target.name) {
      case "identificationType": {
        setidentificationType(e.target.value);
        break;
      }
    }
  }
  function getSearchForm(tipo) {
    console.log(tipo);
    if (tipo != undefined) {
      if (tipo?.label == "Jurídica") {
        return (
          <Col md="8">
            <div className="mb-3">
              <Label htmlFor="firstName">{props.t("SocialReason")}</Label>
              <AvField
                className="form-control"
                name="firstName"
                type="text" onChange={handleChangeInputfrmSearch}
                value={props.dataSet.firstName}
                errorMessage={props.t("Required Field")}
                validate={{ required: { value: true } }} />
            </div>
          </Col>
        );
      } else {
        return (
          <React.Fragment>
            <Col md="4">
              <div className="mb-3">
                <Label htmlFor="firstName">{props.t("First Name")}</Label>
                <AvField
                  className="form-control"
                  name="firstName"
                  value={props.dataSet.firstName}
                  type="text" onChange={handleChangeInputfrmSearch}
                  errorMessage={props.t("Required Field")}
                  validate={{ required: { value: true } }} />
              </div>
            </Col>
            <Col md="4">
              <div className="mb-3">
                <Label htmlFor="secondName">{props.t("SecondName")}</Label>
                <AvField
                  name="secondName"
                  value={props.dataSet.secondName}
                  type="text" onChange={handleChangeInputfrmSearch}
                  errorMessage={props.t("Required Field")}
                  validate={{ required: { value: true } }}
                  className="form-control" />
              </div>
            </Col>
            <Col md="4">
              <div className="mb-3">
                <Label htmlFor="firstLastName">{props.t("FirstLastName")}</Label>
                <AvField
                  name="firstLastName"
                  value={props.dataSet.firstLastName}
                  type="text" onChange={handleChangeInputfrmSearch}
                  errorMessage={props.t("Required Field")}
                  className="form-control"
                  validate={{ required: { value: true } }} />
              </div>
            </Col>
            <Col md="4">
              <div className="mb-3">
                <Label htmlFor="secondLastName">{props.t("SecondLastName")}</Label>
                <AvField
                  name="secondLastName"
                  value={props.dataSet.secondLastName}
                  type="text" onChange={handleChangeInputfrmSearch}
                  errorMessage={props.t("Required Field")}
                  validate={{ required: { value: true } }}
                  className="form-control" />
              </div>
            </Col>

          </React.Fragment>
        )
      }
    } else {
      return (
        <React.Fragment>
          <Col md="4">
            <div className="mb-3">
              <Label htmlFor="firstName">{props.t("First Name")}</Label>
              <AvField
                className="form-control"
                name="firstName"
                value={props.dataSet.firstName}
                type="text" onChange={handleChangeInputfrmSearch}
                errorMessage={props.t("Required Field")}
                validate={{ required: { value: true } }} />
            </div>
          </Col>
          <Col md="4">
            <div className="mb-3">
              <Label htmlFor="secondName">{props.t("SecondName")}</Label>
              <AvField
                name="secondName"
                value={props.dataSet.secondName}
                type="text" onChange={handleChangeInputfrmSearch}
                errorMessage={props.t("Required Field")}
                validate={{ required: { value: true } }}
                className="form-control" />
            </div>
          </Col>
          <Col md="4">
            <div className="mb-3">
              <Label htmlFor="firstLastName">{props.t("FirstLastName")}</Label>
              <AvField
                name="firstLastName"
                value={props.dataSet.firstLastName}
                type="text" onChange={handleChangeInputfrmSearch}
                errorMessage={props.t("Required Field")}
                className="form-control"
                validate={{ required: { value: true } }} />
            </div>
          </Col>
          <Col md="4">
            <div className="mb-3">
              <Label htmlFor="secondLastName">{props.t("SecondLastName")}</Label>
              <AvField
                name="secondLastName"
                value={props.dataSet.secondLastName}
                type="text" onChange={handleChangeInputfrmSearch}
                errorMessage={props.t("Required Field")}
                validate={{ required: { value: true } }}
                className="form-control" />
            </div>
          </Col>

        </React.Fragment>
      )
    }
    //segun tipo de identiicación
    // if (tipo != undefined && tipo.value) {
    //   if (identificationTypeSelected != undefined && identificationTypeSelected.value) {
    //     if (identificationTypeSelected.value == "RUC" || tipo.value == "1") {
    //       return (
    //         <Col md="8">
    //           <div className="mb-3">
    //             <Label htmlFor="firstName">{props.t("SocialReason")}</Label>
    //             <AvField
    //               className="form-control"
    //               name="firstName2"
    //               type="text" onChange={handleChangeInputfrmSearch}
    //               value={props.dataSet.firstName}
    //               errorMessage={props.t("Required Field")}
    //               validate={{ required: { value: true } }} />
    //           </div>
    //         </Col>
    //       );
    //     } else {
    //       return (
    //         <React.Fragment>
    //           <Col md="4">
    //             <div className="mb-3">
    //               <Label htmlFor="firstName">{props.t("First Name")}</Label>
    //               <AvField
    //                 className="form-control"
    //                 name="firstName"
    //                 value={props.dataSet.firstName}
    //                 type="text" onChange={handleChangeInputfrmSearch}
    //                 errorMessage={props.t("Required Field")}
    //                 validate={{ required: { value: true } }} />
    //             </div>
    //           </Col>
    //           <Col md="4">
    //             <div className="mb-3">
    //               <Label htmlFor="secondName">{props.t("SecondName")}</Label>
    //               <AvField
    //                 name="secondName"
    //                 value={props.dataSet.secondName}
    //                 type="text" onChange={handleChangeInputfrmSearch}
    //                 errorMessage={props.t("Required Field")}
    //                 validate={{ required: { value: true } }}
    //                 className="form-control" />
    //             </div>
    //           </Col>
    //           <Col md="4">
    //             <div className="mb-3">
    //               <Label htmlFor="firstLastName">{props.t("FirstLastName")}</Label>
    //               <AvField
    //                 name="firstLastName"
    //                 value={props.dataSet.firstLastName}
    //                 type="text" onChange={handleChangeInputfrmSearch}
    //                 errorMessage={props.t("Required Field")}
    //                 className="form-control"
    //                 validate={{ required: { value: true } }} />
    //             </div>
    //           </Col>
    //           <Col md="4">
    //             <div className="mb-3">
    //               <Label htmlFor="secondLastName">{props.t("SecondLastName")}</Label>
    //               <AvField
    //                 name="secondLastName"
    //                 value={props.dataSet.secondLastName}
    //                 type="text" onChange={handleChangeInputfrmSearch}
    //                 errorMessage={props.t("Required Field")}
    //                 validate={{ required: { value: true } }}
    //                 className="form-control" />
    //             </div>
    //           </Col>

    //         </React.Fragment>
    //       )
    //     }
    //   } else {
    //     return (
    //       <Col md="8">
    //         <div className="mb-3">
    //           <Label htmlFor="firstName">{props.t("SocialReason")}</Label>
    //           <AvField
    //             className="form-control"
    //             name="firstName2"
    //             type="text" onChange={handleChangeInputfrmSearch}
    //             value={props.dataSet.firstName}
    //             errorMessage={props.t("Required Field")}
    //             validate={{ required: { value: true } }} />
    //         </div>
    //       </Col>
    //     );
    //   }
    // } else {
    //   if (identificationTypeSelected != undefined && identificationTypeSelected.value) {
    //     if (identificationTypeSelected.value == "RUC") {
    //       return (
    //         <Col md="8">
    //           <div className="mb-3">
    //             <Label htmlFor="firstName">{props.t("SocialReason")}</Label>
    //             <AvField
    //               className="form-control"
    //               name="firstName2"
    //               type="text" onChange={handleChangeInputfrmSearch}
    //               value={props.dataSet.firstName}
    //               errorMessage={props.t("Required Field")}
    //               validate={{ required: { value: true } }} />
    //           </div>
    //         </Col>
    //       );
    //     } else {
    //       return (
    //         <React.Fragment>
    //           <Col md="4">
    //             <div className="mb-3">
    //               <Label htmlFor="firstName">{props.t("First Name")}</Label>
    //               <AvField
    //                 className="form-control"
    //                 name="firstName"
    //                 value={props.dataSet.firstName}
    //                 type="text" onChange={handleChangeInputfrmSearch}
    //                 errorMessage={props.t("Required Field")}
    //                 validate={{ required: { value: true } }} />
    //             </div>
    //           </Col>
    //           <Col md="4">
    //             <div className="mb-3">
    //               <Label htmlFor="secondName">{props.t("SecondName")}</Label>
    //               <AvField
    //                 name="secondName"
    //                 value={props.dataSet.secondName}
    //                 type="text" onChange={handleChangeInputfrmSearch}
    //                 errorMessage={props.t("Required Field")}
    //                 validate={{ required: { value: true } }}
    //                 className="form-control" />
    //             </div>
    //           </Col>
    //           <Col md="4">
    //             <div className="mb-3">
    //               <Label htmlFor="firstLastName">{props.t("FirstLastName")}</Label>
    //               <AvField
    //                 name="firstLastName"
    //                 value={props.dataSet.firstLastName}
    //                 type="text" onChange={handleChangeInputfrmSearch}
    //                 errorMessage={props.t("Required Field")}
    //                 className="form-control"
    //                 validate={{ required: { value: true } }} />
    //             </div>
    //           </Col>
    //           <Col md="4">
    //             <div className="mb-3">
    //               <Label htmlFor="secondLastName">{props.t("SecondLastName")}</Label>
    //               <AvField
    //                 name="secondLastName"
    //                 value={props.dataSet.secondLastName}
    //                 type="text" onChange={handleChangeInputfrmSearch}
    //                 errorMessage={props.t("Required Field")}
    //                 validate={{ required: { value: true } }}
    //                 className="form-control" />
    //             </div>
    //           </Col>

    //         </React.Fragment>
    //       )
    //     }
    //   } else {
    //     return (
    //       <React.Fragment>
    //         <Col md="4">
    //           <div className="mb-3">
    //             <Label htmlFor="firstName">{props.t("First Name")}</Label>
    //             <AvField
    //               className="form-control"
    //               name="firstName"
    //               value={props.dataSet.firstName}
    //               type="text" onChange={handleChangeInputfrmSearch}
    //               errorMessage={props.t("Required Field")}
    //               validate={{ required: { value: true } }} />
    //           </div>
    //         </Col>
    //         <Col md="4">
    //           <div className="mb-3">
    //             <Label htmlFor="secondName">{props.t("SecondName")}</Label>
    //             <AvField
    //               name="secondName"
    //               value={props.dataSet.secondName}
    //               type="text" onChange={handleChangeInputfrmSearch}
    //               errorMessage={props.t("Required Field")}
    //               validate={{ required: { value: true } }}
    //               className="form-control" />
    //           </div>
    //         </Col>
    //         <Col md="4">
    //           <div className="mb-3">
    //             <Label htmlFor="firstLastName">{props.t("FirstLastName")}</Label>
    //             <AvField
    //               name="firstLastName"
    //               value={props.dataSet.firstLastName}
    //               type="text" onChange={handleChangeInputfrmSearch}
    //               errorMessage={props.t("Required Field")}
    //               className="form-control"
    //               validate={{ required: { value: true } }} />
    //           </div>
    //         </Col>
    //         <Col md="4">
    //           <div className="mb-3">
    //             <Label htmlFor="secondLastName">{props.t("SecondLastName")}</Label>
    //             <AvField
    //               name="secondLastName"
    //               value={props.dataSet.secondLastName}
    //               type="text" onChange={handleChangeInputfrmSearch}
    //               errorMessage={props.t("Required Field")}
    //               validate={{ required: { value: true } }}
    //               className="form-control" />
    //           </div>
    //         </Col>
    //         <Col md="4">
    //           <AvGroup className="mb-3">
    //             <Label htmlFor="startDate">{props.t("DBO")}</Label>
    //             <AvField
    //               className="form-control"
    //               name="startDate"
    //               type="date"
    //               value={props.dataSet.birthDate}
    //               id="startDate" />
    //           </AvGroup>
    //         </Col>
    //       </React.Fragment>
    //     )
    //   }
    // }
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
      size="xl"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={props.true}>
      <div className="modal-header">
        <h5 className="modal-title mt-0">{props.t("SecondaryBeneficiary")}</h5>
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
                    <Col xl="6">
                      <div className="mb-3">
                        <Label>{props.t("ID Type")}</Label>
                        <Select noOptionsMessage={() => ""}
                          onChange={(e) => {
                            setIdentificationTypeSelected(identificationTypeList.find(x => x.value === e.value))
                            settipoIdentificacion(e.value);
                          }}
                          options={identificationTypeList}
                          placeholder={props.t("SelectType")}
                          value={identificationTypeSelected}
                        />
                        {campoRequeridoIdentificacion ?
                          <p className="message-error-parrafo">{props.t("Required Field")}</p>
                          : null}
                      </div>
                    </Col>

                    <Col xl="6">
                      <div className="mb-3">
                        <Label htmlFor="idnumber">{props.t("ID Number")}</Label>
                        <AvField
                          className="form-control"
                          name="documentNumber"
                          type="text"
                          id="documentNumber"
                          validate={{
                            required: { value: true, errorMessage: t("Required Field") },
                            // number: { value: true, errorMessage: t("InvalidField") },
                          }}
                          value={props.dataSet.documentNumber}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4">
                      <div className="mb-3">
                        <Label htmlFor="identificationType">{props.t("PersonType")}</Label>
                        <Select noOptionsMessage={() => ""}
                          onChange={(e) => { setpersonTypeSelect(personTypeData.find(x => x.value === e.value)); changeTipo(e) }}
                          options={personTypeData}
                          id="sustainableCustomer"
                          classNamePrefix="select2-selection"
                          placeholder={props.t("toselect")}
                          value={personTypeSelect}
                        // value={props.dataSet.shareholderName}
                        />
                        {campoRequeridoTipo ?
                          <p className="message-error-parrafo">{props.t("Required Field")}</p>
                          : null}

                      </div>
                    </Col>
                    {getSearchForm(personTypeSelect)}
                  </Row>
                  <Row>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="nationality">{props.t("Nationality")}</Label>
                        <Select noOptionsMessage={() => ""}
                          onChange={(e) => {
                            setnacionalidadSelect(paises.find(x => x.value === e.value))
                            changePais(e);
                          }}
                          options={paises}
                          id="paises"
                          name="paises"
                          classNamePrefix="select2-selection"
                          placeholder={props.t("toselect")}
                          value={nacionalidadSelect}
                        // value={props.dataSet.nationality}
                        // defaultValue={props.datosEmpresa.countryIdentification}
                        />
                        {campoRequeridoNacionalidad ?
                          <p className="message-error-parrafo">{props.t("Required Field")}</p>
                          : null}
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Label htmlFor="address">{props.t("Address")}</Label>
                        <AvField
                          className="form-control"
                          name="address"
                          type="text"
                          id="address" value={props.dataSet.address} />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4">
                      <div className="mb-3">
                        <Label htmlFor="telephone">{props.t("Phone")}</Label>
                        <AvField
                          className="form-control"
                          name="telephone"
                          type="text"
                          onKeyPress={(e) => { return checkNumber(e) }}
                          id="telephone" value={props.dataSet.telephone} />
                      </div>
                    </Col>
                    <Col md="4">
                      <div className="mb-3">
                        <Label htmlFor="relationship">{props.t("Relationship")}</Label>
                        <Select noOptionsMessage={() => ""}
                          onChange={(e) => { setrelacionSelect(Relacion.find(x => x.label === e.label)); }}
                          options={Relacion}
                          id="relationship"
                          classNamePrefix="select2-selection"
                          placeholder={t("Relation")}
                          value={relacionSelect}
                        />
                        {/* <AvField
                          className="form-control"
                          name="relationship"
                          type="text"
                          id="relationship" value={props.dataSet.relationship} /> */}
                      </div>
                    </Col>
                    <Col md="4">
                      <div className="mb-3">
                        <Label htmlFor="percentage">{props.t("Percent")}</Label>
                        <AvField
                          className="form-control"
                          name="percentage"
                          type="number"
                          onKeyPress={(e) => { return check(e) }}
                          min={0}
                          max={100}
                          validate={{
                            number: { value: true, errorMessage: t("InvalidField") },
                          }}
                          id="percentage" value={props.dataSet.percentage} />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter style={{ textAlign: "right" }}>
                  <Button id="btnNew" color="danger" type="button" style={{ margin: '5px' }} onClick={props.toggle} data-dismiss="modal">
                    <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{props.t("Cancel")}
                  </Button>
                  {props.botones ?
                    <Button id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                      {" "} {props.tipo == "guardar" ? t("Save") : t("Save")}
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
ModalBeneficiosFideicomiso.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func
};
export default (withTranslation()(ModalBeneficiosFideicomiso));
