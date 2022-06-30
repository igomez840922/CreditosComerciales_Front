import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types'
import { Link, useHistory, useLocation } from "react-router-dom"
import {
  Row,
  Col,
  Label,
  Card,
  CardBody,
} from "reactstrap"
import jsonAmbientales from "./jsonAspectosAmbientales.json";
import Switch from "react-switch";
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import AttachmentFileCore from "../../../../../components/Common/AttachmentFileCore";
import * as OPTs from "../../../../../helpers/options_helper";
import { AttachmentFileInputModel } from '../../../../../models/Common/AttachmentFileInputModel';
import { BackendServices, CoreServices } from "../../../../../services"
import * as url from "../../../../../helpers/url_helper"
import LoadingOverlay from "react-loading-overlay"


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
const AspectosAmbientales = React.forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const [formValid, setFormValid] = useState(false);
  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmAspectosAmbientales');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }, dataReturn
  }));
  const location = useLocation()
  const [dataReturn, setDataReturn] = useState(props.dataAspectosAmbientales);
  const [switch1, setswitch1] = useState(false);
  const [switch2, setswitch2] = useState(false);
  const [switch3, setswitch3] = useState(false);
  const [switch4, setswitch4] = useState(false);
  const [switch5, setswitch5] = useState(false);
  const [pregunta1, setpregunta1] = useState(true);
  const [pregunta2, setpregunta2] = useState(true);
  const [pregunta3, setpregunta3] = useState(true);
  const [pregunta4, setpregunta4] = useState(true);
  const [pregunta5, setpregunta5] = useState(true);
  const [datosGenerales, setdatosGenerales] = useState({});
  const [datosAmbientales, setdatosAmbientales] = useState(null);
  const [locationData, setLocationData] = useState(props.locationData);
  const [preClasificacionRiesgo, setpreClasificacionRiesgo] = useState("Baja");
  const [clasificacionRiesgo, setclasificacionRiesgo] = useState("Baja");
  const [isActiveLoading, setIsActiveLoading] = useState(false); //loading de la pagina
  const [reputationResearchValidation, setReputationResearchValidation] = useState(false); //loading de la pagina
  const [dataGeneralIGR, setdataGeneralIGR] = useState(false); //loading de la pagina
  const [legalInvestigation, setLegalInvestigation] = useState(''); //loading de la pagina

  function handleSubmit(event, errors, values) {
    dataReturn.natureLocationProject = switch1;
    dataReturn.physicalResettlement = switch2;
    dataReturn.environmentalPermits = switch3;
    dataReturn.newProject = switch4;
    dataReturn.workersContractors = switch5;
    dataReturn.riskPreClassification = preClasificacionRiesgo;
    dataReturn.riskClassificationConfirmation = clasificacionRiesgo;
    dataReturn.legalInvestigation = values?.legalInvestigation ?? '';
    setDataReturn(dataReturn)
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    setFormValid(true)
  }

  const history = useHistory();

  React.useEffect(() => {
    initialize()
  }, [props.activeTab == 18]);

  async function initialize() {
    setIsActiveLoading(true)
    const apiBack = new BackendServices();
    await apiBack.getJsonRAS().then(resp => {
      // console.log("aspectos",resp.aspectosAmbientalesDTO.jsonaspectos);

      console.log("aspectos", JSON.parse(resp.aspectosAmbientalesDTO.jsonaspectos));

    }).catch((error) => {
      console.log(error);
    });
    let dataSession;

    // const apiBack = new BackendServices();



    if (props?.previsualizarHistoria) {
      dataSession = { transactId: props?.locationData.transactId ?? "", transactionId: props?.locationData.transactId ?? "" }
      setLocationData({ transactId: props?.locationData.transactId ?? "" });
      apiBack.consultDataCompanyIGR(dataSession?.transactionId ?? 0).then(async resp => {
        setdataGeneralIGR(resp)
      });
      /* ---------------------------------------------------------------------------------------------- */
      /*                  Obtenemos los datos de la seccion de los asectos ambientales                  */
      /* ---------------------------------------------------------------------------------------------- */
      await apiBack.consultEnvironmentalAspectsIGR(dataSession.transactionId).then(resp => {
        if (resp !== undefined && resp.environmentalAspectsDTO != null) {
          setLegalInvestigation(resp.environmentalAspectsDTO.legalInvestigation)
          setpregunta1(false)
          setpregunta2(false)
          setpregunta3(false)
          setpregunta4(false)
          setpregunta5(false)
          setswitch1(resp.environmentalAspectsDTO.natureLocationProject);
          setswitch2(resp.environmentalAspectsDTO.physicalResettlement);
          setswitch3(resp.environmentalAspectsDTO.environmentalPermits);
          setswitch4(resp.environmentalAspectsDTO.newProject);
          setswitch5(resp.environmentalAspectsDTO.workersContractors);
          resp.environmentalAspectsDTO.tipo = false;
          setDataReturn(resp.environmentalAspectsDTO)
          setpreClasificacionRiesgo(resp.environmentalAspectsDTO.riskPreClassification)
          setclasificacionRiesgo(resp.environmentalAspectsDTO.riskClassificationConfirmation)
          setdatosAmbientales(resp.environmentalAspectsDTO)
          setTimeout(() => {
            apiBack.consultGeneralDataIGR(dataSession.transactionId).then(resp => {
              if (resp != undefined) {
                setdatosGenerales(resp);
                // setTimeout(() => {
                //   validateActivity()
                // }, 1500);
              }

            }).catch((error) => {

            });

          }, 1000);
        } else {
          setTimeout(() => {
            apiBack.consultGeneralDataIGR(dataSession.transactionId).then(resp => {
              if (resp != undefined) {
                setdatosGenerales(resp);
                // setTimeout(() => {
                //   validateActivity()
                // }, 1500);
              }

            }).catch((error) => {

            });
          }, 1000);
        }
      });

      return
    }
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

    apiBack.consultDataCompanyIGR(dataSession?.transactionId ?? 0).then(async resp => {
      setdataGeneralIGR(resp)
    });

    //////console.log(props.activeTab);
    if (props.activeTab == 18) {



      /* ---------------------------------------------------------------------------------------------- */
      /*                  Obtenemos los datos de la seccion de los asectos ambientales                  */
      /* ---------------------------------------------------------------------------------------------- */
      setIsActiveLoading(true)

      apiBack.consultEnvironmentalAspectsIGR(dataSession.transactionId).then(resp => {
        if (resp !== undefined && resp.environmentalAspectsDTO != null) {
          setLegalInvestigation(resp.environmentalAspectsDTO.legalInvestigation)
          setpregunta1(false)
          setpregunta2(false)
          setpregunta3(false)
          setpregunta4(false)
          setpregunta5(false)
          setswitch1(resp.environmentalAspectsDTO.natureLocationProject);
          setswitch2(resp.environmentalAspectsDTO.physicalResettlement);
          setswitch3(resp.environmentalAspectsDTO.environmentalPermits);
          setswitch4(resp.environmentalAspectsDTO.newProject);
          setswitch5(resp.environmentalAspectsDTO.workersContractors);
          resp.environmentalAspectsDTO.tipo = false;
          setDataReturn(resp.environmentalAspectsDTO)
          setclasificacionRiesgo(resp.environmentalAspectsDTO.riskClassificationConfirmation)
          setpreClasificacionRiesgo(resp.environmentalAspectsDTO.riskPreClassification)
          setdatosAmbientales(resp.environmentalAspectsDTO)
          setTimeout(() => {
            apiBack.consultGeneralDataIGR(dataSession.transactionId).then(resp => {
              if (resp != undefined) {
                if (resp.economicActivity.code == "") {
                  setIsActiveLoading(false);
                }
                setdatosGenerales(resp);
                // setTimeout(() => {
                //   validateActivity()
                // }, 1500);
              }

            }).catch((error) => {

            });
          }, 1000);
        } else {
          setTimeout(() => {
            apiBack.consultGeneralDataIGR(dataSession.transactionId).then(resp => {
              if (resp != undefined) {
                if (resp.economicActivity.code == "") {
                  setIsActiveLoading(false);
                }
                setdatosGenerales(resp);
                // setTimeout(() => {
                //   validateActivity()
                // }, 1500);
              }
            }).catch((error) => {
            });
          }, 1000);
        }
      });
    }
  }

  React.useEffect(() => {
    setTimeout(() => {
      validateActivity()
    }, 2000);
  }, [datosGenerales]);

  React.useEffect(() => {
    let clasificacionRiesgoL = clasificacionRiesgo?.toLowerCase() ?? '';
    let preClasificacionRiesgoL = preClasificacionRiesgo?.toLowerCase() ?? '';
    // let validation = (preClasificacionRiesgoL === 'media' && clasificacionRiesgoL === 'alta') || (preClasificacionRiesgoL === 'alta' && clasificacionRiesgoL === 'media') || (preClasificacionRiesgoL === 'alta' && clasificacionRiesgoL === 'baja') || (preClasificacionRiesgoL === 'alta' && clasificacionRiesgoL === 'alta');
    let validation = preClasificacionRiesgoL === 'alta';
    console.log(preClasificacionRiesgoL, clasificacionRiesgoL, validation)
    // setIsActiveLoading(false)

    setReputationResearchValidation(validation);
  }, [clasificacionRiesgo, preClasificacionRiesgo]);

  function changeAll(e, tipo) {
    if (tipo == "riskPreClassification") {
      setpreClasificacionRiesgo(e.target.value)
      dataReturn.riskPreClassification = e.target.value;
    }
    if (tipo == "sustainableCreditRating") {
      dataReturn.sustainableCreditRating = "2";
    }
    if (tipo == "riskClassificationConfirmation") {
      setclasificacionRiesgo(e.target.value)
      dataReturn.riskClassificationConfirmation = e.target.value;
    }
    setDataReturn(dataReturn);
  }
  function validateActivity() {
    try {

      const api = new CoreServices();
      let json = [];
      /* ---------------------------------------------------------------------------------------------- */
      /*                            Obtenemos el catalogo de las actividades                            */
      /* ---------------------------------------------------------------------------------------------- */
      api.getActividadEconomicaCatalogo().then(response => {
        for (let i = 0; i < response.Records.length; i++) {
          json.push({ nombreActividad: response.Records[i]["Description"], codActividad: response.Records[i]["Code"] });
        }
        // for (let i = 0; i < json.length; i++) {
        //   let jsonSub = [];
        //   /* ---------------------------------------------------------------------------------------------- */
        //   /*                           Obtenemos las subActividades de la empresa                           */
        //   /* ---------------------------------------------------------------------------------------------- */
        //   api.getSubActividadEconomicaCatalogo(json[i].codActividad).then(response => {
        //     for (let j = 0; j < response.Records.length; j++) {
        //       jsonSub.push({ nombreSubActividad: response.Records[j]["Description"], codigoSubActividad: response.Records[j]["Code"] });
        //     }
        //   });
        //   json[i].subActividades = jsonSub;
        // }
        let tipoClasificacion = "BAJA";
        if (datosGenerales?.economicActivity?.code == undefined || datosGenerales?.subeconomicActivity?.code == undefined) {
          setIsActiveLoading(false)
        }
        tipoClasificacion = jsonAmbientales[datosGenerales?.economicActivity?.code == "" ? "A" : datosGenerales?.economicActivity?.code][datosGenerales?.subeconomicActivity?.code == "" ? "3001" : datosGenerales?.subeconomicActivity?.code]
        // if (dataReturn.tipo) {
        setpreClasificacionRiesgo(tipoClasificacion.values.clasificacion);
        // }
        let preguntas3 = false;
        if (tipoClasificacion.values.clasificacion != "Baja") {
          setpregunta1(() => { return tipoClasificacion.values.preguntas["1"] });
          setpregunta2(() => { return tipoClasificacion.values.preguntas["2"] });
          preguntas3 = tipoClasificacion.values.preguntas["3"];
          setpregunta3(tipoClasificacion.values.preguntas["3"]);
          setpregunta4(tipoClasificacion.values.preguntas["4"]);
          setpregunta5(tipoClasificacion.values.preguntas["5"]);
          setTimeout(() => {
            if (datosAmbientales != null) {
              console.log(datosAmbientales);
              if (tipoClasificacion.values.preguntas["1"] == true && tipoClasificacion.values.preguntas["2"] == true) {
                setpregunta3(true);
                if (datosAmbientales.environmentalPermits == true) {
                  preguntas3 = true;
                  document.getElementById("check3").checked = datosAmbientales.environmentalPermits;
                }
              }
            }
            setTimeout(() => {
              // setIsActiveLoading(true)
              validatePreClasification({
                pregunta1: tipoClasificacion.values.preguntas["1"],
                pregunta2: tipoClasificacion.values.preguntas["2"],
                pregunta3: preguntas3,
                pregunta4: tipoClasificacion.values.preguntas["4"],
                pregunta5: tipoClasificacion.values.preguntas["5"],
              })
            }, 1000);
          }, 1000);
        }
      });
    }
    catch (err) { }
    finally {
    }

  }
  function validatePreClasification(jsonPreguntas = null) {
    let check1 = document.getElementById("check1") ? document.getElementById("check1").checked : false;
    let check2 = document.getElementById("check2") ? document.getElementById("check2").checked : false;
    let check3 = document.getElementById("check3") ? document.getElementById("check3").checked : false;
    let check4 = document.getElementById("check4") ? document.getElementById("check4").checked : false;
    let check5 = document.getElementById("check5") ? document.getElementById("check5").checked : false;

    console.log("fase 0");

    if (preClasificacionRiesgo != "Baja") {
      if (jsonPreguntas != null) {

        if (jsonPreguntas.pregunta1 == true && jsonPreguntas.pregunta2 == true) {
          console.log("fase 2");
          if (check1 == true || check2 == true) {
            console.log("fase 3");
            setclasificacionRiesgo("Alta");
            dataReturn.riskClassificationConfirmation = "Alta";
            setDataReturn(dataReturn);
            setpregunta3(false);
            setpregunta4(false);
            setswitch3(false);
            setIsActiveLoading(false);
            return;
          } else {
            console.log("fase 4");
            if (check3 == true) {
              setclasificacionRiesgo("Media-Alta");
              dataReturn.riskClassificationConfirmation = "Media-Alta";
              setDataReturn(dataReturn);
              setIsActiveLoading(false);
              return;
            } else {
              setclasificacionRiesgo("Media");
              dataReturn.riskClassificationConfirmation = "Media";
              setDataReturn(dataReturn);
              setIsActiveLoading(false);
              return;
            }
          }
        } else {
          console.log("fase 6");
          if (jsonPreguntas.pregunta3 == true) {
            if (check3 == true) {
              setclasificacionRiesgo("Media");
              dataReturn.riskClassificationConfirmation = "Media";
              setDataReturn(dataReturn);
              setIsActiveLoading(false);
              return;
            } else {
              setclasificacionRiesgo("Baja");
              dataReturn.riskClassificationConfirmation = "Baja";
              setDataReturn(dataReturn);
              setIsActiveLoading(false);
              return;
            }
          }
          if (jsonPreguntas.pregunta4 == true) {
            if (check4 == true) {
              setclasificacionRiesgo("Media");
              dataReturn.riskClassificationConfirmation = "Media";
              setDataReturn(dataReturn);
              setIsActiveLoading(false);
              return;
            } else {
              setclasificacionRiesgo("Baja");
              dataReturn.riskClassificationConfirmation = "Baja";
              setDataReturn(dataReturn);
              setIsActiveLoading(false);
              return;
            }
          }
          if (jsonPreguntas.pregunta5 == true) {
            if (check5 == true) {
              setclasificacionRiesgo("Media");
              dataReturn.riskClassificationConfirmation = "Media";
              setDataReturn(dataReturn);
              setIsActiveLoading(false);
              return;
            } else {
              setclasificacionRiesgo("Baja");
              dataReturn.riskClassificationConfirmation = "Baja";
              setDataReturn(dataReturn);
              setIsActiveLoading(false);
              return;
            }
          }
        }
      } else {
        if (pregunta1 == true && pregunta2 == true) {
          console.log("fase 2");
          if (check1 == true || check2 == true) {
            console.log("fase 3");
            setclasificacionRiesgo("Alta");
            dataReturn.riskClassificationConfirmation = "Alta";
            setDataReturn(dataReturn);
            setpregunta3(false);
            setpregunta4(false);
            setswitch3(false);
            setIsActiveLoading(false);
            return;
          } else {
            console.log("fase 4");
            if (check3 == true) {
              setclasificacionRiesgo("Media-Alta");
              dataReturn.riskClassificationConfirmation = "Media-Alta";
              setDataReturn(dataReturn);
              setIsActiveLoading(false);
              return;
            } else {
              console.log("fase 5");
              setpregunta3(true);
              setclasificacionRiesgo("Media");
              dataReturn.riskClassificationConfirmation = "Media";
              setDataReturn(dataReturn);
              setIsActiveLoading(false);
              return;
            }
          }
        } else {
          console.log("fase 6");
          if (pregunta3 == true) {
            if (check3 == true) {
              setclasificacionRiesgo("Media");
              dataReturn.riskClassificationConfirmation = "Media";
              setDataReturn(dataReturn);
              setIsActiveLoading(false);
              return;
            } else {
              setclasificacionRiesgo("Baja");
              dataReturn.riskClassificationConfirmation = "Baja";
              setDataReturn(dataReturn);
              setIsActiveLoading(false);
              return;
            }
          }
          if (pregunta4 == true) {
            if (check4 == true) {
              setclasificacionRiesgo("Media");
              dataReturn.riskClassificationConfirmation = "Media";
              setDataReturn(dataReturn);
              setIsActiveLoading(false);
              return;
            } else {
              setclasificacionRiesgo("Baja");
              dataReturn.riskClassificationConfirmation = "Baja";
              setDataReturn(dataReturn);
              setIsActiveLoading(false);
              return;
            }
          }
          if (pregunta5 == true) {
            if (check5 == true) {
              setclasificacionRiesgo("Media");
              dataReturn.riskClassificationConfirmation = "Media";
              setDataReturn(dataReturn);
              setIsActiveLoading(false);
              return;
            } else {
              setclasificacionRiesgo("Baja");
              dataReturn.riskClassificationConfirmation = "Baja";
              setDataReturn(dataReturn);
              setIsActiveLoading(false);
              return;
            }
          }
        }

      }
    }
  }
  return (
    <React.Fragment>
      <h5 className="card-sub-title">
        {t("EnvironmentalAspects")}
      </h5>
      <LoadingOverlay active={isActiveLoading} spinner text={t("Processinginformation")}>

        <AvForm id="frmAspectosAmbientales" className="needs-validation" onSubmit={handleSubmit}>
          <Row>
            <Col md="6">
              <div className="mb-3">
                <Label htmlFor="preClassificationRisk">{t("PreClassificationRisk")}</Label>
                <AvField
                  className="form-control"
                  type="select"
                  disabled={true}
                  name="riskPreClassification"
                  onChange={(e) => { changeAll(e, "riskPreClassification") }}
                  value={preClasificacionRiesgo}
                  validate={{
                    required: { value: true, errorMessage: t("Required Field") },
                  }}
                  id="riskPreClassification"
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Media-Alta">Media-Alta</option>
                  <option value="Alta">Alta</option>
                </AvField>
              </div>
            </Col>
            <Col md="6">
              <div className="mb-3">
                <Label htmlFor="riskClassificationConfirmation">{t("EnvironmentalRiskclassification")}</Label>
                <AvField
                  className="form-control"
                  type="select"
                  disabled={true}
                  name="riskClassificationConfirmation"
                  onChange={(e) => { changeAll(e, "riskClassificationConfirmation"); }}
                  value={clasificacionRiesgo}
                  validate={{
                    required: { value: true, errorMessage: t("Required Field") },
                  }}
                  id="riskClassificationConfirmation"
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Media-Alta">Media-Alta</option>
                  <option value="Alta">Alta</option>
                </AvField>
              </div>
            </Col>
          </Row>
          <Row>
            {pregunta1 ?
              <Col md="12">
                <AvGroup check className="mb-3">
                  <Switch name="isProjectLocatedProtectedNaturalArea"
                    uncheckedIcon={<Offsymbol />}
                    checkedIcon={<OnSymbol />}
                    onColor="#007943"
                    disabled={props?.previsualizar ? true : false}
                    id="check1"
                    className="form-label"
                    onChange={() => {
                      setswitch1(!switch1); setTimeout(() => {
                        validatePreClasification();
                      }, 500);
                    }}
                    checked={switch1}
                  />
                  {'   '}
                  <Label className="form-check-label" htmlFor="isProjectLocatedProtectedNaturalArea"> 1-{t("Is the project located or adjacent to a protected natural area")}</Label>
                </AvGroup>
              </Col>
              : null}
            {pregunta2 ?
              <Col md="12">
                <AvGroup check className="mb-3">
                  <Switch name="theProjectInvolvePhysicalEconomicResettlement"
                    uncheckedIcon={<Offsymbol />}
                    checkedIcon={<OnSymbol />}
                    onColor="#007943"
                    id="check2"
                    disabled={props?.previsualizar ? true : false}
                    className="form-label"
                    onChange={() => {
                      setswitch2(!switch2); setTimeout(() => {
                        validatePreClasification();
                      }, 500);
                    }}
                    checked={switch2}
                  />
                  {'   '}
                  <Label style={{ textAlign: "left" }} htmlFor="theProjectInvolvePhysicalEconomicResettlement">2-{t("Does the project involve physical and or economic resettlement of more than 100 people")}</Label>
                </AvGroup>
              </Col> : null}
            {pregunta3 ?
              <Col md="12">
                <AvGroup check className="mb-3">
                  <Switch name="isPresentationEnvironmentalPermitsNecessary"
                    uncheckedIcon={<Offsymbol />}
                    checkedIcon={<OnSymbol />}
                    onColor="#007943"
                    id="check3"
                    disabled={props?.previsualizar ? true : false}
                    className="form-label"
                    onChange={() => {
                      setswitch3(!switch3); setTimeout(() => {
                        validatePreClasification();
                      }, 500);
                    }}
                    checked={switch3}
                  />
                  {'   '}
                  <Label style={{ textAlign: "left" }} htmlFor="isPresentationEnvironmentalPermitsNecessary">3-{t("Is the presentation of environmental permits necessary for the execution of the project")}</Label>
                </AvGroup>
              </Col> : null}
            {pregunta4 ?
              <Col md="12">
                <AvGroup check className="mb-3">
                  <Switch name="isProjectNew"
                    uncheckedIcon={<Offsymbol />}
                    checkedIcon={<OnSymbol />}
                    onColor="#007943"
                    id="check4"
                    disabled={props?.previsualizar ? true : false}
                    className="form-label"
                    onChange={() => {
                      setswitch4(!switch4); setTimeout(() => {
                        validatePreClasification();
                      }, 500);
                    }}
                    checked={switch4}
                  />
                  {'   '}
                  <Label style={{ textAlign: "left" }} htmlFor="isProjectNew">4-{t("Is the project new and involves the use of more than 35 hectares of land")}</Label>
                </AvGroup>
              </Col> : null}
            {pregunta5 ?
              <Col md="12">
                <AvGroup check className="mb-3">
                  <Switch name="doesActivityEmployMoreThan50Workers"
                    uncheckedIcon={<Offsymbol />}
                    checkedIcon={<OnSymbol />}
                    onColor="#007943"
                    id="check5"
                    disabled={props?.previsualizar ? true : false}
                    className="form-label"
                    onChange={() => {
                      setswitch5(!switch5); setTimeout(() => {
                        validatePreClasification();
                      }, 500);
                    }}
                    checked={switch5}
                  />
                  {'   '}
                  <Label style={{ textAlign: "left" }} htmlFor="doesActivityEmployMoreThan50Workers">5-{t("Does the activity employ more than 50 workers and handle more than 15 contractors")}</Label>  {'  '}
                </AvGroup>
              </Col>
              : null}
          </Row>

          {((!props?.IGR && !props?.supervisorPreview) && reputationResearchValidation) && <Row className="my-3">
            <Col md="12">
              <AvGroup>
                <Label htmlFor="legalInvestigation">{t("Reputation Research")}</Label>
                <AvField className="form-control"
                  name="legalInvestigation"
                  type="textarea"
                  id="legalInvestigation"
                  disabled={props?.previsualizar || props?.previsualizarHistoria ? true : false}
                  value={props?.dataAspectosAmbientales?.legalInvestigation ?? legalInvestigation ?? ''}
                  onKeyUp={(e) => { console.log(e.target.value); props.setReputationResearch(e.target.value) }}
                  rows="7" />
              </AvGroup>
            </Col>
          </Row>
          }

          {!props?.IGR && <Row>
            {
              <Col md="3" className="d-flex align-items-center">
                <AvGroup check className="">
                  <Switch name="doesActivityEmployMoreThan50Workers"
                    uncheckedIcon={<Offsymbol />}
                    checkedIcon={<OnSymbol />}
                    onColor="#007943"
                    id="check5"
                    disabled={true}
                    className="form-label"
                    checked={dataGeneralIGR?.sustainable ?? false}
                  />
                  {'   '}
                  <Label style={{ textAlign: "left" }} htmlFor="SustainableCustomer">{t("SustainableCustomer")}</Label>
                </AvGroup>
              </Col>
            }
            {dataGeneralIGR?.sustainable && <Col md="3">
              <Col>
                <div className="mb-3">
                  <Label htmlFor="SustainableProject">{t("Sustainable Project")}</Label>
                  <AvField
                    className="form-control"
                    name="sustainableProject"
                    type="text"
                    id="sustainableProject"
                    disabled={true}
                    // maxLength={15}
                    value={dataGeneralIGR?.sustainableProjectDesc ?? ''}
                  />
                </div>
              </Col>
            </Col>}
          </Row>}

          {locationData ? (props?.activeTab == 18 ?
            props?.previsualizar ? null : (
              <AttachmentFileCore attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, (props?.OPTs ? props?.OPTs : OPTs.PROCESS_INFORMEGESTION), OPTs.ACT_ASPECTOSAMBIENTALES)} />
            ) : null) : null}

        </AvForm>
      </LoadingOverlay>

    </React.Fragment>
  );
});
AspectosAmbientales.propTypes = {
  onSubmit: PropTypes.func,
  locationData: PropTypes.any,
}
export default AspectosAmbientales;
