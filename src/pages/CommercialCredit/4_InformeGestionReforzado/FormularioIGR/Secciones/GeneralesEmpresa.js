import React, { useState } from "react"
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
} from "reactstrap"
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import ApiServicesCommon from "../../../../../services/Common/ApiServicesCommon";
import { BackendServices, CoreServices } from "../../../../../services";
import checkNumber from "../../../../../helpers/checkNumber";
import { OnlyNumber } from "../../../../../helpers/commons";
import Select from "react-select";
import Switch from "react-switch";
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


const GeneralesEmpresa = React.forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const [paises, setPaises] = useState([]);
  const [paisesSelected, setPaisesSelected] = useState(undefined);
  const [codigoPais, setCodigoPais] = useState(null);
  const [switch1, setswitch1] = useState(false);
  const [switch2, setswitch2] = useState(false);
  const [provincias, setProvincias] = useState([]);
  const [provinciasSelected, setProvinciasSelected] = useState(undefined);
  const [codigoProvincia, setCodigoProvincia] = useState(null);
  const [distrito, setDistrito] = useState([]);
  const [distritoSelected, setDistritoSelected] = useState(undefined);
  const [codigoDistrito, setCodigoDistrito] = useState(null);
  const [corregimiento, setCorregimiento] = useState([]);
  const [corregimientoSelected, setCorregimientoSelected] = useState(undefined);
  const [codigoCorregimiento, setCodigoCorregimiento] = useState(null);
  const [clienteSostenibleSelect, setclienteSostenibleSelect] = useState(undefined);
  const [listaExclusionSelect, setlistaExclusionSelect] = useState(undefined);
  const [sectorSelect, setsectorSelect] = useState(undefined);
  const [ciudad, setCiudad] = useState([]);
  const [ciudadSelected, setCiudadSelected] = useState(undefined);
  const [codigoCiudad, setCodigoCiudad] = useState(null);
  const [dataReturn, setDataReturn] = useState(props.datosEmpresa);
  const [sectorList, setSectorList] = useState([]);
  const [subsectorList, setSubsectorList] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const [SectorEconomico, setSectorEconomico] = useState([]);
  const [codigoSector, setcodigoSector] = useState({ label: "", value: "" });
  const [campoRequeridoSector, setcampoRequeridoSector] = useState(false);
  const [validacionCiudad, setvalidacionCiudad] = useState(false);
  const [campoRequeridoSostenible, setcampoRequeridoSostenible] = useState(false);
  const [campoRequeridoExclusion, setcampoRequeridoExclusion] = useState(false);
  const listaExclusion = [{ label: "No", value: 1 }, { label: "Si", value: 2 }]
  const clienteSostenible = [{ label: "No", value: 1 }, { label: "Si", value: 2 }]
  const [sustainableProject, setSustainableProject] = useState([]);
  const [sustainableProjectSelected, setSustainableProjectSelected] = useState(undefined);

  const apiBackendServices = new BackendServices();


  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmGeneralesEmpresa');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }, dataReturn
  }));
  React.useEffect(() => {
    // Read Api Service data
    if (props.ValidacionGeneralesEmpresa == true && props.activeTab == 2) {
      //console.log("generales de empresa", props);
      // setTimeout(() => {
      loadCountry();
      loadSectorEconomic();
      setDataReturn(props.datosEmpresa)
      loadProvinces(props.datosEmpresa.country.code);
      loadDistric(props.datosEmpresa.province.code);
      loadCorregiment(props.datosEmpresa.district.code);
      loadCity(props.datosEmpresa.township.code);
      setswitch1(props.datosEmpresa.exclusion);
      setswitch2(props.datosEmpresa.sustainable);
      // }, 1500);
      sustainableProjects()
    }

  }, [props.activeTab == 2, props.ValidacionGeneralesEmpresa]);
  React.useEffect(() => {
    // Read Api Service data
    loadDefaultValue()

  }, [paises, provincias, distrito, corregimiento]);

  function sustainableProjects() {
    apiBackendServices.getSustainableProjectsCatalog().then(sustainableProjects => {
      let json = sustainableProjects.map(sustainableProject => ({ value: sustainableProject.id, label: sustainableProject.description }))
      setSustainableProjectSelected(json?.find($$ => $$.value === props.datosEmpresa.sustainableProjectId))
      setSustainableProject(json)
    }).catch(err => console.log(err))
  }


  // cargar secto economico
  function loadSectorEconomic() {
    const api = new CoreServices();
    // getSectorEconomicoCatalogo
    api.getSectorEconomicoCatalogo().then(response => {
      if (response === null) { return; }
      let json = [];
      for (let i = 0; i < response?.Records.length; i++) {
        json.push({ label: response?.Records[i]["Description"], value: response?.Records[i]["Code"] })
      }
      setSectorEconomico(json);
    })
  }
  function changeAll(e, tipo) {
    if (tipo == "countryIdentification") {
      dataReturn.country.name = e.label;
      dataReturn.country.code = e.value;
    }
    if (tipo == "provinceIdentification") {
      dataReturn.province.name = e.label;
      dataReturn.province.code = e.value;
    }
    if (tipo == "districtIdentification") {
      dataReturn.district.name = e.label;
      dataReturn.district.code = e.value;
    }
    if (tipo == "townshipIdentification") {
      dataReturn.township.name = e.label;
      dataReturn.township.code = e.value;
    }
    if (tipo == "cityIdentification") {
      dataReturn.city.name = e.label;
      dataReturn.city.code = e.value;
    }
    if (tipo == "cityChangueManual") {
      dataReturn.city.name = e.target.value;
      dataReturn.city.code = e.target.value;;
    }
    if (tipo == "referencePoint") {
      dataReturn.referencePoint = e.target.value;
    }
    if (tipo == "residency") {
      dataReturn.residency = e.target.value;
    }
    if (tipo == "houseNumber") {
      dataReturn.houseNumber = e.target.value;
    }
    if (tipo == "phoneNumber") {
      dataReturn.phoneNumber = Number(e.target.value);
    }
    if (tipo == "mobileNumber") {
      dataReturn.mobileNumber = Number(e.target.value);
    }
    if (tipo == "workNumber") {
      dataReturn.workNumber = Number(e.target.value);
    }
    if (tipo == "email") {
      dataReturn.email = e.target.value;
    }
    if (tipo == "sectorIdentification") {
      dataReturn.sector.name = e.label;
      dataReturn.sector.code = e.value;
    }
    if (tipo == "subSectorIdentification") {
      dataReturn.subSector.code = e.target.value;
      dataReturn.subSector.name = e.target.selectedOptions[0].innerHTML;
    }
    if (tipo == "exclusion") {
      dataReturn.exclusion = switch1;
      setswitch1(!switch1);
    }
    if (tipo == "sustainable") {
      dataReturn.sustainable = !switch2;
      setswitch2(!switch2);
    }
    if (tipo == "apto") {
      dataReturn.apto = e.target.value;
    }
    setDataReturn(dataReturn)

  }
  function loadDefaultValue() {
    try {
      var defaultVal = null;
      //console.log("props.datosEmpresa", props.datosEmpresa);
      ////console.log("provincia 1", provincias);
      if (provincias.length > 0 && props.datosEmpresa.province !== null && provinciasSelected === undefined) {
        //console.log("provincia", provincias);
        defaultVal = provincias.find(x => (x.value).toUpperCase() === (props.datosEmpresa.province.code).toUpperCase());
        if (defaultVal !== undefined) {
          setProvinciasSelected(defaultVal);
        }
      }
      if (distrito.length > 0 && props.datosEmpresa.district !== null && distritoSelected === undefined) {
        defaultVal = distrito.find(x => (x.value).toUpperCase() === (props.datosEmpresa.district.code).toUpperCase());
        if (defaultVal !== undefined) {
          setDistritoSelected(defaultVal);
        }
      }
      if (corregimiento.length > 0 && props.datosEmpresa.township !== null && corregimientoSelected === undefined) {
        defaultVal = corregimiento.find(x => (x.value).toUpperCase() === (props.datosEmpresa.township.code).toUpperCase());
        if (defaultVal !== undefined) {
          setCorregimientoSelected(defaultVal);
        }
      }
      if (ciudad.length > 0 && props.datosEmpresa.city !== null && ciudadSelected === undefined) {
        defaultVal = ciudad.find(x => (x.value).toUpperCase() === (props.datosEmpresa.city.code).toUpperCase());
        if (defaultVal !== undefined) {
          setCiudadSelected(defaultVal);
        }
      }
      if (SectorEconomico.length > 0 && props.datosEmpresa.sector !== null && sectorSelect === undefined) {
        defaultVal = SectorEconomico.find(x => (x.value).toUpperCase() === (props.datosEmpresa.sector.code).toUpperCase());
        if (defaultVal !== undefined) {
          setsectorSelect(defaultVal);
        }
      }
    }
    catch (err) { }
  }
  // Cargar paises
  function loadCountry() {

    const api = new CoreServices();
    // getPaisesCatalogo
    api.getPaisesCatalogo()
      .then(response => {
        if (response === null) { return; }
        let json = [];
        for (let i = 0; i < response?.Records.length; i++) {
          json.push({ label: response?.Records[i]["Description"], value: response?.Records[i]["Code"] })
        }
        setPaises(json);
        try {
          var defaultVal = null;
          if (json.length > 0 && props.datosEmpresa.country !== null && paisesSelected === undefined) {
            defaultVal = json.find(x => x.value === props.datosEmpresa.country.code);
            if (defaultVal !== undefined) {
              setPaisesSelected(defaultVal);
            }
          }
        }
        catch (err) { }
      });
  }
  // cargarProvincias
  function loadProvinces(pais) {
    setProvincias([]);
    const api = new CoreServices();
    // getProvinciasCatalogo
    api.getProvinciasCatalogo(pais)
      .then(response => {
        if (response === null || response == undefined) { setProvincias([]); return; }
        let json = [];
        for (let i = 0; i < response?.Records.length; i++) {
          json.push({ label: response?.Records[i]["Description"], value: response?.Records[i]["Code"] })
        }
        setProvincias(json);
        loadDefaultValue()
      });
  }
  // cargarDistrito
  function loadDistric(provincia) {
    setCorregimiento([]);
    setDistrito([])
    setDistritoSelected(undefined)
    setCorregimientoSelected(undefined)
    const api = new CoreServices();
    // getDistritoCatalogo
    api.getDistritoCatalogo(provincia)
      .then(response => {
        if (response === null || response == undefined) {
          setCorregimiento([]);
          setDistrito([]);
          return;
        }
        let json = [];
        //console.log("Distrito", response);
        for (let i = 0; i < response?.Records.length; i++) {
          json.push({ label: response?.Records[i]["Description"], value: response?.Records[i]["Code"] })
        }
        setDistrito(json);
        loadDefaultValue()
      });
  }
  // cargarCorregimiento
  function loadCorregiment(distrito) {
    setCorregimiento([]);
    setCorregimientoSelected(undefined)
    const api = new CoreServices();
    // getCorregimientoCatalogo
    api.getCorregimientoCatalogo(distrito)
      .then(response => {
        if (response === null || response == undefined) {
          setCorregimiento([]);
          return;
        }
        let json = [];
        //console.log("Corregimiento", response);
        for (let i = 0; i < response?.Records.length; i++) {
          json.push({ label: response?.Records[i]["Description"], value: response?.Records[i]["Code"] })
        }
        setCorregimiento(json);
      });
  }
  // cargarCiudad
  function loadCity(provincia) {
    const api = new CoreServices();
    // getCiudadCatalogo
    api.getCiudadCatalogo(provincia)
      .then(response => {
        //console.log(response);
        if (response === null || response === undefined) { setvalidacionCiudad(false); return; }
        let json = [];
        for (let i = 0; i < response?.Records.length; i++) {
          json.push({ label: response?.Records[i]["Description"], value: response?.Records[i]["Code"] })
        }
        setvalidacionCiudad(true);
        setCiudad(json);
      });
  }

  function changeCountry(event) {
    setDistrito([]);
    setCorregimiento([]);
    setCiudad([]);
    setProvincias([]);
    setProvinciasSelected(undefined)
    setDistritoSelected(undefined)
    setCorregimientoSelected(undefined)
    setCodigoPais(event.value);
    loadProvinces(event.value);
    changeAll(event, "countryIdentification")
    dataReturn.province = { code: "", name: "" };
    dataReturn.district = { code: "", name: "" };
    dataReturn.township = { code: "", name: "" };
    dataReturn.city = { code: "", name: "" };
    SelectProvinceRef.current.state.value = ""
    SelectProvinceRef1.current.state.value = ""
    SelectProvinceRef2.current.state.value = ""
    SelectProvinceRef3.current.state.value = ""

  }
  function changeProvince(event) {
    setCorregimiento([]);
    setDistrito([]);
    setCiudad([]);
    setCorregimientoSelected(undefined)
    setDistritoSelected(undefined)
    loadCity(event.value);
    setCodigoProvincia(event.value);
    loadDistric(event.value);
    changeAll(event, "provinceIdentification")
    dataReturn.district = { code: "", name: "" };
    dataReturn.township = { code: "", name: "" };
    dataReturn.city = { code: "", name: "" };
    SelectProvinceRef1.current.state.value = ""
    SelectProvinceRef2.current.state.value = ""
    SelectProvinceRef3.current.state.value = ""
  }
  function changeDisitric(event) {
    setCorregimiento([]);
    setCorregimientoSelected(undefined)
    setCodigoDistrito(event.value);
    loadCorregiment(event.value);
    changeAll(event, "districtIdentification")
    dataReturn.townshipIdentification = 0;
    dataReturn.township = { code: "", name: "" };
    SelectProvinceRef2.current.state.value = ""
    SelectProvinceRef3.current.state.value = ""
  }
  function changeCorregiment(event) {
    setCodigoCorregimiento(event.value);
    changeAll(event, "townshipIdentification")
    SelectProvinceRef3.current.state.value = ""
  }
  function changeCity(event) {
    setCodigoCiudad(event.value);
    changeAll(event, "cityIdentification")
  }
  // Form Submission
  function handleSubmit(event, errors, values) {
    dataReturn.exclusion = switch1;
    dataReturn.sustainable = switch2;
    dataReturn.mobileNumber = Number(dataReturn?.mobileNumber ?? 0);
    dataReturn.workNumber = Number(dataReturn?.workNumber ?? 0);
    dataReturn.province.code = provinciasSelected?.value ?? "";
    dataReturn.province.name = provinciasSelected?.label ?? "";

    dataReturn.district.code = distritoSelected?.value ?? "";
    dataReturn.district.name = distritoSelected?.label ?? "";

    dataReturn.township.code = corregimientoSelected?.value ?? "";
    dataReturn.township.name = corregimientoSelected?.label ?? "";
    dataReturn.sustainableProjectId = sustainableProjectSelected.value ?? ''
    dataReturn.sustainableProjectDesc = sustainableProjectSelected.label ?? ''
    setDataReturn(dataReturn)
    event.preventDefault();
    if (errors.length > 0) {
      setFormValid(false);
      dataReturn.formValid = false;
      setDataReturn(dataReturn)
      return;
    }
    dataReturn.formValid = true;
    setDataReturn(dataReturn)
    setFormValid(true);
  }
  //On Mounting (componentDidMount)
  React.useEffect(() => {
    // Read Api Service data
    loadInitialData();
  }, []);
  function loadInitialData() {
    const api = new ApiServicesCommon()
    // getSectorList
    api.getSectorList().then((data) => { setSectorList(data); })
    // getSubSectorList
    api.getSubSectorList().then((data) => { setSubsectorList(data); })
  }
  const SelectProvinceRef = React.useRef();
  const SelectProvinceRef1 = React.useRef();
  const SelectProvinceRef2 = React.useRef();
  const SelectProvinceRef3 = React.useRef();
  return (
    <React.Fragment>
      <h5 className="card-title">
        {t("General of the Company")}
      </h5>
      <AvForm id="frmGeneralesEmpresa" className="needs-validation" onSubmit={handleSubmit}>
        <Row>
          <Col md="3">
            <div className="mb-3">
              <Label>{t("Country")}</Label>
              <Select noOptionsMessage={() => ""}
                onChange={(e) => {
                  setPaisesSelected(paises.find(x => x.value === e.value))
                  changeCountry(e);
                }}
                options={paises}
                id="paises"
                classNamePrefix="select2-selection"
                placeholder={t("toselect")}
                value={paisesSelected}
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label>{t("Province")}</Label>
              {/* {provincias.length > 0 ? */}
              <Select noOptionsMessage={() => ""}
                onChange={(e) => {
                  setProvinciasSelected(provincias.find(x => x.value === e.value))
                  changeProvince(e);
                }}
                ref={SelectProvinceRef}
                options={provincias}
                id="provincias"
                classNamePrefix="select2-selection"
                placeholder={t("toselect")}
                value={provinciasSelected}
              />
              {/* : null} */}
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label>{t("District")}</Label>
              {/* {distrito.length > 0 ? */}
              <Select noOptionsMessage={() => ""}
                onChange={(e) => {
                  setDistritoSelected(distrito.find(x => x.value === e.value))
                  changeDisitric(e);
                }}
                options={distrito}
                id="distrito"
                ref={SelectProvinceRef1}
                classNamePrefix="select2-selection"
                placeholder={t("toselect")}
                value={distritoSelected}
              />
              {/* : <Select3
                  options={[]}
                  classNamePrefix="select2-selection"
                  placeholder={t("toselect")}
                  value={[]}
                />} */}
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label>{t("Township")}</Label>
              {/* {corregimiento.length > 0 ? */}
              <Select noOptionsMessage={() => ""}
                onChange={(e) => {
                  setCorregimientoSelected(corregimiento.find(x => x.value === e.value))
                  changeCorregiment(e);
                }}
                ref={SelectProvinceRef2}
                options={corregimiento}
                id="corregimiento"
                classNamePrefix="select2-selection"
                placeholder={t("toselect")}
                value={corregimientoSelected}
              />
              {/* : <Select3
                  options={[]}
                  classNamePrefix="select2-selection"
                  placeholder={t("toselect")}
                  value={[]}
                />} */}
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="3">
            <div className="mb-3">
              <Label>{t("City")}</Label>
              {validacionCiudad ?
                <Select noOptionsMessage={() => ""}
                  onChange={(e) => {
                    setCiudad(ciudad.find(x => x.value === e.value))
                    changeCity(e);
                  }}
                  options={ciudad}
                  id="ciudad"
                  ref={SelectProvinceRef3}
                  classNamePrefix="select2-selection"
                  placeholder={t("toselect")}
                  value={ciudadSelected}
                />
                : <AvField onChange={(e) => { changeAll(e, "cityChangueManual") }}
                  className="form-control"
                  name="ciudadManual"
                  type="text"
                  id="ciudadManual"
                  placeholder={t("City")}
                  value={props?.datosEmpresa?.city?.name ?? ""}
                />
              }
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="buildingResidence">{t("Building/Residence")}</Label>
              <AvField onChange={(e) => { changeAll(e, "residency") }}
                className="form-control"
                name="buildingResidence"
                type="text"
                id="buildingResidence"
                value={props.datosEmpresa.residency}
              />
            </div>
          </Col>

          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="apto">{t("Apto")}</Label>
              <AvField onChange={(e) => { changeAll(e, "houseNumber") }}
                className="form-control"
                name="houseNumber"
                type="text"
                id="houseNumber"
                value={props.datosEmpresa.houseNumber}
              />
            </div>
          </Col>


        </Row>

        <Col md="12">
          <div className="mb-3">
            <Label htmlFor="referencePoint">{t("Reference Point")}</Label>
            <AvField onChange={(e) => { changeAll(e, "referencePoint") }}
              className="form-control"
              name="referencePoint"
              type="text"
              id="referencePoint"
              value={props.datosEmpresa.referencePoint}
            />
          </div>
        </Col>

        <Row>

        </Row>
        <Row>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="phoneNumber">{t("Phone Number")}</Label>
              <AvField onChange={(e) => { changeAll(e, "phoneNumber") }}
                className="form-control"
                name="phoneNumber"
                type="text"
                onKeyPress={(e) => { return OnlyNumber(e) }}
                // maxLength={15}
                // style={{
                //   background: "url('https://www.mestel.com/wp-content/uploads/2017/06/dollar-icon-png-3547.png') no-repeat scroll 7px 7px",
                //   paddingLeft: "30px",
                //   backgroundSize:"20px !important"
                // }}

                id="phoneNumber"
                value={props?.datosEmpresa?.phoneNumber == undefined || props?.datosEmpresa?.phoneNumber == "NaN" ? "" : props?.datosEmpresa?.phoneNumber ?? ""}
                validate={{
                  required: { value: true, errorMessage: t("Required Field") },
                  number: { value: true, errorMessage: t("InvalidField") },
                }}
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="phoneNumberMobile">{t("Mobile Phone Number")}</Label>
              <AvField onChange={(e) => { changeAll(e, "mobileNumber") }}
                className="form-control"
                name="phoneNumberMobile"
                type="text"
                onKeyPress={(e) => { return checkNumber(e) }}
                id="phoneNumberMobile"
                // maxLength={15}
                value={props?.datosEmpresa?.mobileNumber ?? 0}
                validate={{
                  number: { value: true, errorMessage: t("InvalidField") },
                }}
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="phoneNumberOffice">{t("Office Phone Number")}</Label>
              <AvField onChange={(e) => { changeAll(e, "workNumber") }}
                className="form-control"
                name="phoneNumberOffice"
                type="text"
                onKeyPress={(e) => { return checkNumber(e) }}
                id="phoneNumberOffice"
                // maxLength="11"
                value={props.datosEmpresa.workNumber}
                validate={{
                  number: { value: true, errorMessage: t("InvalidField") },
                }}
              />
            </div>
          </Col>
          <Col md="3">
            <div className="mb-3">
              <Label htmlFor="email">{t("Email")}</Label>
              <AvField onChange={(e) => { changeAll(e, "email") }}
                className="form-control"
                name="email"
                type="email"
                id="email"
                value={props.datosEmpresa.email}
                validate={{
                  required: { value: true, errorMessage: t("Required Field") },
                  email: { value: true, errorMessage: t("InvalidField") },
                }}
              />
            </div>
          </Col>
        </Row>
        <Row>
          {/* <Col md="4">
            <div className="mb-3">
              <Label>{t("Apply for Exclusion List")}</Label>
              <AvGroup check className="mb-3">
                <Switch name="theProjectInvolvePhysicalEconomicResettlement"
                  uncheckedIcon={<Offsymbol />}
                  checkedIcon={<OnSymbol />}
                  onColor="#007943"
                  className="form-label"
                  onChange={() => {
                    changeAll("e", "exclusion");
                  }}
                  checked={switch1}
                />
              </AvGroup>
            </div>
          </Col> */}
          <Col md="3">
            <div className="mb-3">
              <Label>{t("SustainableCustomer")}</Label>
              <AvGroup check className="mb-3">
                <Switch name="theProjectInvolvePhysicalEconomicResettlement"
                  uncheckedIcon={<Offsymbol />}
                  checkedIcon={<OnSymbol />}
                  onColor="#007943"
                  className="form-label"
                  onChange={() => {
                    changeAll("e", "sustainable")
                  }}
                  checked={switch2}
                />
              </AvGroup>
            </div>
          </Col>
          {switch2 && <Col md="3">
            <div className="mb-3">
              <Label>{t("Sustainable Project")}</Label>
              {/* {corregimiento.length > 0 ? */}
              <Select noOptionsMessage={() => ""}
                onChange={(e) => {
                  setSustainableProjectSelected(sustainableProject.find(x => x.value === e.value))
                }}
                options={sustainableProject}
                id="corregimiento"
                classNamePrefix="select2-selection"
                placeholder={t("toselect")}
                value={sustainableProjectSelected}
              />
            </div>
          </Col>}
        </Row>
      </AvForm>
    </React.Fragment>);

})

GeneralesEmpresa.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}
export default GeneralesEmpresa;