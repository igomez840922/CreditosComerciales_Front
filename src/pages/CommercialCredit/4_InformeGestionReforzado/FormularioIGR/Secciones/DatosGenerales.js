import React, { useState } from 'react';
import { withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'
import Select from "react-select";
import { useLocation, useHistory } from 'react-router-dom'
import moment from "moment";

import {
  Card, CardBody, CardHeader,
  Row,
  Col,
  Label,
  Table,
} from "reactstrap"
import { AvForm, AvField } from "availity-reactstrap-validation"
import ApiServiceBackend from "../../../../../services/BackendServices/Services";
import MaskSoaint from "../../../../../api/plugins_soaint/maskNumber";
import { BackendServices, CoreServices } from '../../../../../services';
import * as url from "../../../../../helpers/url_helper"
import LoadingOverlay from 'react-loading-overlay';
import { uniq_key } from '../../../../../helpers/unq_key';

const DatosGenerales = React.forwardRef((props, ref) => {
  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmDatosGenerales');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }, dataReturn2
  }))
  const { t, i18n } = useTranslation();
  const location = useLocation()
  const history = useHistory();

  const [locationData, setLocationData] = useState(location.data);
  const [identificationTypeList, setIdentificationTypeList] = useState([]);
  const [identificationTypeSelected, setIdentificationTypeSelected] = useState(undefined);
  const [gruposEconomicos, setGruposEconomicos] = useState([]);
  const [gruposEconomicosSelected, setGruposEconomicosSelected] = useState(undefined);
  const [banca, setBanca] = useState([]);
  const [bancaSelected, setBancaSelected] = useState(undefined);
  const [actividadEmpresa, setActividadEmpresa] = useState([]);
  const [actividadEmpresaSelected, setActividadEmpresaSelected] = useState(undefined);
  const [subactividadEmpresa, setSubActividadEmpresa] = useState([]);
  const [subactividadEmpresaSelected, setSubActividadEmpresaSelected] = useState(undefined);
  const [bancaDate, setDataBanca] = useState([]);
  const [codigoGrupo, setCodigoGrupo] = useState(null);
  const [nombreGrupo, setCNombreGrupo] = useState(null);
  const [dataReturn, setDataReturn] = useState({
    codigoTipoPersona: null,
    codigoTipoIdentificacion: null,
    numeroCliente: null,
    primerNombre: null,
    segundoNombre: null,
    primerApellido: null,
    segundoApellido: null,
    numeroIdentificacion: null,
    transactId: 0,
    economicGroup: {
      code: "",
      name: ""
    },
    economicActivity: {
      code: "",
      name: ""
    },
    subeconomicActivity: {
      code: "",
      name: ""
    },
    bank: {
      code: "",
      name: ""
    },
  });
  const [dataReturn2, setDataReturn2] = useState();
  const [formValid, setFormValid] = useState(false);
  const [cambio, setCambio] = useState(2);
  const [campoRequeridoGrupo, setcampoRequeridoGrupo] = useState(false);
  const [campoRequeridoActividad, setcampoRequeridoActividad] = useState(false);
  const [campoRequeridoSubActividad, setcampoRequeridoSubActividad] = useState(false);
  const [campoRequeridoBanca, setcampoRequeridoBanca] = useState(false);
  const [dataDeudores, setdataDeudores] = useState(null);
  const [VariableDisabled, setVariableDisabled] = useState(false);
  const [VariableDisabled2, setVariableDisabled2] = useState(false);
  const [numberExpresion, setnumberExpresion] = useState(0);

  const [isActiveLoading, setIsActiveLoading] = useState(false); //loading de la pagina

  const [mainDebtor, setmainDebtor] = useState(null)

  //On Mounting (componentDidMount)
  React.useEffect(() => {

    let dataSession;
    if (location.data !== null && location.data !== undefined) {
      if (location.data.transactionId === undefined || location.data.transactionId.length <= 0) {
        //location.data.transactionId = 0;
        //checkAndCreateProcedure(location.data);
        history.push(url.URL_DASHBOARD);
      }
      else {
        sessionStorage.setItem('locationData', JSON.stringify(location.data));
        setLocationData(location.data);
        dataSession = location.data;
      }
    }
    else {
      //chequeamos si tenemos guardado en session
      var result = sessionStorage.getItem('locationData');
      if (result !== undefined && result !== null) {
        result = JSON.parse(result);
        setLocationData(result);
        dataSession = result;
      }
    }
    setIsActiveLoading(true)

    // Read Api Service data      
    loadMainDebtor(dataSession.transactionId);
    loadData(dataSession);
    loadInitialData(dataSession);
    loadListGroupEconomic();
    loadBank();
    loadActivityEconomic()
  }, []);
  React.useEffect(() => {
    // Read Api Service data 
    var defaultVal = null;
    try {
      if (identificationTypeList.length > 0 && dataReturn.codigoTipoIdentificacion !== null && identificationTypeSelected === undefined) {
        defaultVal = identificationTypeList.find(x => x.value === dataReturn.codigoTipoIdentificacion);
        if (defaultVal !== undefined) {
          setIdentificationTypeSelected(defaultVal);
        }
      }
      if (gruposEconomicos.length > 0 && dataReturn.economicGroup !== null && gruposEconomicosSelected === undefined) {
        defaultVal = gruposEconomicos.find(x => x.value === dataReturn.economicGroup.code);
        if (defaultVal !== undefined) {
          setVariableDisabled(true)
          setGruposEconomicosSelected(defaultVal);
        } else {
          defaultVal = gruposEconomicos.find(x => x.label === dataReturn.economicGroup.name);
          if (defaultVal !== undefined) {
            setGruposEconomicosSelected(defaultVal);
            if (VariableDisabled2) {
              setVariableDisabled(true)
            }
          }
        }
      }
      if (banca.length > 0 && dataReturn.bank !== null && bancaSelected === undefined) {
        defaultVal = banca.find(x => x.value === dataReturn.bank.code);
        if (defaultVal !== undefined) {
          setBancaSelected(defaultVal);
        }
      }
      if (actividadEmpresa.length > 0 && dataReturn.economicActivity !== null && actividadEmpresaSelected === undefined) {
        defaultVal = actividadEmpresa.find(x => x.value === dataReturn.economicActivity.code);
        if (defaultVal !== undefined) {
          setActividadEmpresaSelected(defaultVal);
        }
      }
      if (subactividadEmpresa.length > 0 && dataReturn.subeconomicActivity !== null && subactividadEmpresaSelected === undefined) {
        defaultVal = subactividadEmpresa.find(x => x.value === dataReturn.subeconomicActivity.code);
        if (defaultVal !== undefined) {
          setSubActividadEmpresaSelected(defaultVal);
        }
      }
    }
    catch (err) { }
  }, [cambio]);
  React.useEffect(() => {
    try {
      if (props.selectedClient !== null && props.selectedClient !== undefined) {
        loadClientSelectedData(props.selectedClient);
      }
    }
    catch (err) { }
  }, [props.selectedClient]);

  function loadMainDebtor(transactionId) {
    const backendServices = new BackendServices();
    backendServices.consultPrincipalDebtor(transactionId).then(resp => {
      //console.log(resp);
      setmainDebtor(resp)
    })

  }

  ///////////..... CHEQUEAMOS LA DATA PARA INICIALIZAR VALORES POR DEFECTO EN LOS SELECT2 .... ////////
  // cargar actividad economica
  function loadActivityEconomic() {
    const api = new CoreServices();
    // getActividadEconomicaCatalogo
    api.getActividadEconomicaCatalogo().then(response => {
      if (response === null) { return; }
      let json = [];
      for (let i = 0; i < response.Records.length; i++) {
        json.push({ label2: response.Records[i]["Description"], value: response.Records[i]["Code"], label: response.Records[i]["Code"] + " - "+ response.Records[i]["Description"] })
      }
      setActividadEmpresa(json);
      setCambio(null);
      setCambio(5);
    })
  }
  // cargarSubActividadEconomica
  function loadSubActivityEconomic(codActividad) {
    const api = new CoreServices();
    // getSubActividadEconomicaCatalogo
    api.getSubActividadEconomicaCatalogo(codActividad).then(response => {
      if (response === null) { return; }
      let json = [];
      for (let i = 0; i < response.Records.length; i++) {
        json.push({ label2: response.Records[i]["Description"], value: response.Records[i]["Code"],label: response.Records[i]["Code"] + " - "+ response.Records[i]["Description"] })
      }
      setSubActividadEmpresa(json);
      if (dataReturn.subeconomicActivity !== null) {
        setSubActividadEmpresaSelected(json.find(x => x.value === dataReturn.subeconomicActivity.code));
      }
      else {
        dataReturn.subeconomicActivity = { code: json[0].value, name: json[0].label }
        setSubActividadEmpresaSelected(json[0]);
      }
      setCambio(null);
      setCambio(5);
    })
  }
  // cargarListaGrupoEconomico
  function loadListGroupEconomic() {
    const api = new CoreServices();
    // getGrupoEconomicoCatalogo
    api.getGrupoEconomicoCatalogo()
      .then(response => {
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response.Records.length; i++) {
          if (response.Records[i]["Code"] == "0003") {
            json.push({ label: response.Records[i]["Description"], value: response.Records[i]["Code"] })
          } else {
            json.push({ label: response.Records[i]["Description"], value: response.Records[i]["Code"] })
          }
        }
        setGruposEconomicos(json);
        setCambio(null);
        setCambio(5);
      });
  }
  // cargarBancas
  function loadBank() {
    const api = new CoreServices();
    api.getBancaCatalogo()
      .then(response => {
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response.Records.length; i++) {
          json.push({ label: response.Records[i]["Description"], value: response.Records[i]["Code"] })
        }
        setBanca(json);
        setCambio(null);
        setCambio(5);
      });
  }
  // consultarDatos
  async function loadData(locationData) {
    const api = new CoreServices();
    const apiBack = new BackendServices();
    //consultarDeudorPrincipal
    await apiBack.consultPrincipalDebtor(locationData.transactionId).then(async resp => {
      dataReturn.numeroCliente = resp?.customerNumberT24
      dataReturn.primerNombre = resp?.name
      dataReturn.segundoNombre = resp?.name2
      dataReturn.primerApellido = resp?.lastName
      dataReturn.segundoApellido = resp?.lastName2
      dataReturn.numeroIdentificacion = resp?.clientDocId
      dataReturn.nuevoDato = ""
      setDataReturn(dataReturn);
      await apiBack.consultGeneralDataIGR(locationData.transactionId).then(async resp => {
        if (resp.statusService.statusCode == "204") {
          await apiBack.consultPrincipalDebtor(locationData?.transactionId ?? 0).then(async response => {
            if (response === null) { return; }
            //console.log(response);
            await api.getPartiesInformationExtra(response.typePerson, response.customerNumberT24).then(async response2 => {
              //console.log(response2);
              await api.getEconomicGroup(response.customerNumberT24).then(async resp2 => {
                //console.log(resp2);
                // return
                setVariableDisabled2(true);
                dataReturn.codigoTipoIdentificacion = resp.identificationType
                dataReturn.transactId = locationData.transactionId;
                dataReturn.economicGroup.code = resp.economicGroup?.code ?? "";
                dataReturn.economicGroup.name = resp2;
                dataReturn.economicActivity.code = response2?.activity?.EconomicActivity ?? "";
                dataReturn.economicActivity.name = resp?.economicActivity?.name ?? "";
                dataReturn.subeconomicActivity.code = resp.subeconomicActivity?.code ?? "";
                dataReturn.subeconomicActivity.name = resp.subeconomicActivity?.name ?? "";
                dataReturn.bank.code = resp.bank?.code ?? "";
                dataReturn.bank.name = resp.bank?.name ?? "";
                loadSubActivityEconomic(response2?.activity?.EconomicActivity ?? "")
                setDataReturn(dataReturn);
                setCambio(null);
                setCambio(5);
                setIsActiveLoading(false)
                return
              });
            });
          })
        } else {
          setIsActiveLoading(false)
          dataReturn.codigoTipoIdentificacion = resp.identificationType
          dataReturn.transactId = locationData.transactionId;
          dataReturn.economicGroup.code = resp?.economicGroup?.code ?? "";
          dataReturn.economicGroup.name = resp?.economicGroup?.name ?? "";
          dataReturn.economicActivity.code = resp?.economicActivity?.code ?? "";
          dataReturn.economicActivity.name = resp?.economicActivity?.name ?? "";
          dataReturn.subeconomicActivity.code = resp?.subeconomicActivity?.code ?? "";
          dataReturn.subeconomicActivity.name = resp?.subeconomicActivity?.name ?? "";
          dataReturn.bank.code = resp?.bank?.code ?? "";
          dataReturn.bank.name = resp?.bank?.name ?? "";
          loadSubActivityEconomic(resp?.economicActivity?.code ?? "")
          setDataReturn(dataReturn);
          setCambio(null);
          setCambio(5);
        }
      }).catch((error) => {
      });
    })
    // consultarDatosGeneralesIGR
  }
  // guardarDatosGenerales
  function saveDataGeneral() {
    const apiBack = new BackendServices();
    /* ---------------------------------------------------------------------------------------------- */
    /*                               Actualizamos los datos del cliente                               */
    /* ---------------------------------------------------------------------------------------------- */

  }
  // Form Submission
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      setFormValid(false);
      return;
    }
    setDataReturn2(dataReturn)
    setDataReturn(dataReturn)
    // saveDataGeneral();
    setFormValid(true);
  }
  function loadInitialData(locationData) {
    const apiServiceBackend = new ApiServiceBackend();
    // consultarCatalogoTipoIdentificacion
    apiServiceBackend.consultarCatalogoTipoIdentificacion()
      .then((data) => {
        if (data !== null && data !== undefined) {
          let json = [];
          for (let i = 0; i < data.length; i++) {
            json.push({ label: t(data[i]["description"]), value: data[i]["id"] })
          }
          setIdentificationTypeList(json)
        }
      })
    // consultarCatalogoTipoPersonaDescripcion
    apiServiceBackend.consultarCatalogoTipoPersonaDescripcion("").then(resp2 => {
      // consultarDeudores
      apiServiceBackend.consultarDeudores(locationData.transactionId).then(resp => {
        if (resp.length > 0) {
          setdataDeudores(resp.map((data, index) => (
            <tr key={uniq_key()}>
              <td data-label={t("PersonType")}>{resp2.find(x => x.code === Number(data.typePerson)).label}</td>
              <td data-label={t("FullName")}>{Number(data.typePerson) === 2 ? data.name : data.name + " " + data.name2 + " " + data.lastName + " " + data.lastName2}</td>
              <td data-label={t("IdentificationType")}>{data.idType}</td>
              <td data-label={t("IdentificationNumber")}>{data.clientDocId}</td>
              <td data-label={t("Customer ID")}>{data.customerNumberT24}</td>
            </tr>)))
        } else {
          setdataDeudores(
            <tr key={uniq_key()}>
              <td colSpan="4" style={{ textAlign: 'center' }}></td>
            </tr>);
        }

      }).catch((error) => {

      });
    });
  }
  function changeAll(e, tipo) {
    if (tipo == "tipoPersona") {
      dataReturn.codigoTipoPersona = e.value
    }
    if (tipo == "Tipo") {
      dataReturn.codigoTipoIdentificacion = e.value
    }
    if (tipo == "codigoGrupo") {
      dataReturn.economicGroup.code = e.value;
      dataReturn.economicGroup.name = e.label;
      setCodigoGrupo(e.value)
      setCNombreGrupo(e.label)
    }
    if (tipo == "codigoBanca") {
      dataReturn.bank.code = e.value;
      dataReturn.bank.name = e.label;
      setDataBanca(e);
    }
    if (tipo == "numeroCliente") {
      dataReturn.numeroCliente = e.target.value;
    }
    if (tipo == "primerNombre") {
      dataReturn.primerNombre = e.target.value;
    }
    if (tipo == "segundoNombre") {
      dataReturn.segundoNombre = e.target.value;
    }
    if (tipo == "primerApellido") {
      dataReturn.primerApellido = e.target.value;
    }
    if (tipo == "segundoApellido") {
      dataReturn.segundoApellido = e.target.value;
    }
    if (tipo == "numeroIdentificacion") {
      dataReturn.numeroIdentificacion = e.target.value;
    }
    if (tipo == "actividadEconomica") {
      dataReturn.economicActivity.code = e.value;
      dataReturn.economicActivity.name = e.label;

      dataReturn.subeconomicActivity = null;
      loadSubActivityEconomic(e.value)
    }
    if (tipo == "subactividadEconomica") {
      dataReturn.subeconomicActivity.code = e.value;
      dataReturn.subeconomicActivity.name = e.label;
    }
    setDataReturn(dataReturn)

  }

  /////////////// CARGA LOS DATOS DEL CLIENTE SELECCIONADO DE T24 //////
  function loadClientSelectedData(selectedClient) {
    dataReturn.numeroCliente = selectedClient.id;
    dataReturn.primerNombre = selectedClient.firstname;
    dataReturn.segundoNombre = selectedClient.secondname;
    dataReturn.primerApellido = selectedClient.lastname;
    dataReturn.segundoApellido = selectedClient.secondlastname;
    dataReturn.codigoTipoIdentificacion = selectedClient.idtype;
    dataReturn.numeroIdentificacion = selectedClient.idnumber;
    dataReturn.codigoTipoPersona = selectedClient.partyType;
    setDataReturn(dataReturn);
    var defaultVal = identificationTypeList.find(x => x.value === dataReturn.codigoTipoIdentificacion);
    if (defaultVal !== undefined) {
      setIdentificationTypeSelected(defaultVal);
    }
  }
  return (
    <>
      <LoadingOverlay active={isActiveLoading} spinner text={t("Processinginformation")}>

        <h5 className="card-title">{t("General Data")}</h5>
        <AvForm id="frmDatosGenerales" className="needs-validation" onSubmit={handleSubmit}>
          <Row>
            <Col md="6">
              <div className="mb-4">
                <Label>{t("Economic Group")}</Label>
                <Select noOptionsMessage={() => ""}
                  key={uniq_key()}
                  onChange={(e) => {
                    setGruposEconomicosSelected(gruposEconomicos.find(x => x.value === e.value))
                    changeAll(e, "codigoGrupo");
                  }}
                  isDisabled={VariableDisabled}
                  options={gruposEconomicos}
                  classNamePrefix="select2-selection"
                  placeholder={t("SelectGroup")}
                  value={gruposEconomicosSelected}
                />
                {campoRequeridoGrupo ?
                  <p className="message-error-parrafo">{t("Required Field")}</p>
                  : null}
              </div>
            </Col>
            <Col md="6">
              <div className="mb-4">
                <Label>{t("Banking")}</Label>
                <Select noOptionsMessage={() => ""}
                  key={uniq_key()}
                  onChange={(e) => {
                    setBancaSelected(banca.find(x => x.value === e.value))
                    changeAll(e, "codigoBanca");
                  }}
                  options={banca}
                  value={bancaSelected}//defaultValue={props.datosGenerales.bank.code}
                  classNamePrefix="select2-selection"
                  placeholder={t("SelectBanking")}
                />
                {campoRequeridoBanca ?
                  <p className="message-error-parrafo">{t("Required Field")}</p>
                  : null}
              </div>
            </Col>
            <Col md="6">
              <div className="mb-4">
                <Label>Sub{t("Economic Activity")}</Label>
                <Select noOptionsMessage={() => ""}
                  key={uniq_key()}
                  onChange={(e) => {
                    setActividadEmpresaSelected(actividadEmpresa.find(x => x.value === e.value))
                    changeAll(e, "actividadEconomica")
                  }}
                  placeholder={t("Selectcompanyactivity")}
                  options={actividadEmpresa}
                  classNamePrefix="select2-selection"
                  value={actividadEmpresaSelected}
                />
                {campoRequeridoActividad ?
                  <p className="message-error-parrafo">{t("Required Field")}</p>
                  : null}
              </div>
            </Col>
            <Col md="6">
              <div className="mb-4">
                <Label>{t("Economic Activity")}</Label>
                <Select noOptionsMessage={() => ""}
                  key={uniq_key()}
                  onChange={(e) => {
                    setSubActividadEmpresaSelected(subactividadEmpresa.find(x => x.value === e.value))
                    changeAll(e, "subactividadEconomica")
                  }}
                  placeholder={t("Selectcompanysubactivity")}
                  options={subactividadEmpresa}
                  classNamePrefix="select2-selection"
                  value={subactividadEmpresaSelected}
                />
                {campoRequeridoSubActividad ?
                  <p className="message-error-parrafo">{t("Required Field")}</p>
                  : null}
              </div>
            </Col>

            {mainDebtor != null && mainDebtor.typePerson === "2" ?
              <Col md="6">
                <div className="mb-4">
                  <Label htmlFor="email">{t("ComercialName")}</Label>
                  <input readOnly="readOnly"
                    className="form-control"
                    name="commercialname"
                    type="text"
                    value={mainDebtor.name2}
                  />
                </div>
              </Col>
              : null}

          </Row>
          <Row>
            <Col md="4">
              {/* <MaskSoaint setnumberExpresion={setnumberExpresion} numberExpresion={numberExpresion}/> */}
            </Col>
          </Row>
        </AvForm>

        <h5 className="card-sub-title">{t("Debtors")}</h5>
        <Table className="table table-striped table-hover styled-table table">
          <thead>
            <tr key={uniq_key()}>
              <th>{t("PersonType")}</th>
              <th>{t("FullName")}</th>
              <th>{t("IdentificationType")}</th>
              <th>{t("IdentificationNumber")}</th>
              <th>{t("Customer ID")}</th>
            </tr>
          </thead>
          <tbody>
            {dataDeudores}
          </tbody>
        </Table>
      </LoadingOverlay>


    </>
  )
})
DatosGenerales.propTypes = {
  onSubmit: PropTypes.func,
  onOpenClientSelection: PropTypes.func,
}
export default DatosGenerales;
