import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types'
import { Link, useLocation, useHistory } from "react-router-dom"
import {
  Row,
  Col,
  Button,
  Label,
  Table,
} from "reactstrap"
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import AvInput from 'availity-reactstrap-validation/lib/AvInput'
import ModalFacilidadActivosFijos from "./ModalFacilidadActivosFijos"
import AttachmentFileCore from "../../../../../components/Common/AttachmentFileCore";
import * as OPTs from "../../../../../helpers/options_helper";
import { AttachmentFileInputModel } from '../../../../../models/Common/AttachmentFileInputModel';
import { BackendServices } from "../../../../../services"
import SweetAlert from "react-bootstrap-sweetalert"
import * as url from "../../../../../helpers/url_helper"
import { uniq_key } from "../../../../../helpers/unq_key"
import Currency from "../../../../../helpers/currency"
const FacilidadActivosFijos = React.forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  // const { locationData } = props;
  const location = useLocation()
  /* ---------------------------------------------------------------------------------------------- */
  /*                        Variables de estados para los mensajes de alerta                        */
  /* ---------------------------------------------------------------------------------------------- */
  const [successSave_dlg, setsuccessSave_dlg] = useState(false);
  const [error_dlg, seterror_dlg] = useState(false);
  const [error_msg, seterror_msg] = useState("");
  const [confirm_alert, setconfirm_alert] = useState(false)
  const [dataDelete, setDataDelete] = useState([]);
  const [dataLocation, setData] = useState(location.data);
  const [botonValidation, setbotonValidation] = useState(true);
  const [dataReturn, setdataReturn] = useState(props.dataFacilidadActivosFijos);
  const [formValid, setFormValid] = useState(false);
  const [showModalFacilidadActivosFijos, setShowModalFacilidadActivosFijos] = useState(false);
  const [showModelAttachment, setShowModelAttachment] = useState(false);
  const [showBlock1, setShowBlock1] = useState(false);
  const [showBlock2, setShowBlock2] = useState(false);
  const [showBlock3, setShowBlock3] = useState(false);
  const [showBlock4, setShowBlock4] = useState(false);
  const [showBlock5, setShowBlock5] = useState(false);
  const [showBlock6, setShowBlock6] = useState(false);
  const [dataFixedAssetsFacilitiesRows, setdataFixedAssetsFacilitiesRows] = useState(null);
  const [tipo, setTipo] = useState("")
  const currencyData = new Currency()

  const [dataFacilidad, setdataFacilidad] = useState({
    "transactId": 0,
    "address": null,
    "propertyType": {
      "code": "",
      "name": ""
    },
    "observations": null,
    "ownerCompany": null,
    "leaseFee": 0,
    "leaseConditions": null,
    "contractDuration": 0
  });

  const [locationData, setLocationData] = useState(null);
  const history = useHistory();

  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmActivosFijos');
      form.requestSubmit();
    },
    getFormValidation: () => {
      return formValid;
    }, dataReturn
  }));
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
    if (props.activeTab == 17) {
      // Read Api Service data   
      initializeData(dataSession);
    }
  }, [props.activeTab == 17]);
  React.useEffect(() => {
    console.log(props)
    // Read Api Service data   
    setShowBlock1(props.dataFacilidadActivosFijos.variationsAssets);
    setShowBlock2(props.dataFacilidadActivosFijos.manufacturingAgroCompanies);
    setShowBlock3(props.dataFacilidadActivosFijos.tradingCompany);
    setShowBlock4(props.dataFacilidadActivosFijos.transportDistributionFleet);
    setShowBlock5(props.dataFacilidadActivosFijos.notApplicable);
    setShowBlock6(props.dataFacilidadActivosFijos.descriptionOfTheFacilities);
  }, [props.activeTab == 17]);
  function initializeData(dataLocation) {
    const api = new BackendServices();
    // consultarActivosFijosIGR
    api.consultFixedAssetsIGR(dataLocation.transactionId).then(resp => {
      if (resp != undefined && resp.fixedAssets.length > 0) {
        setdataFixedAssetsFacilitiesRows(resp.fixedAssets.map((data, index) => (
          <tr key={uniq_key()}>
            <td data-label={t("Address")}>{data.address}</td>
            <td data-label={t("Description")}>{data.observations}</td>
            <td data-label={t("PropertyType")}>{data.propertyType.code}</td>
            <td data-label={t("OwnerCompany")}>{data.ownerCompany}</td>
            <td data-label={t("LeaseFee")}>${currencyData.format(data.leaseFee)}</td>
            <td data-label={t("ContractPeriod") + " (" + t("Year") + "s)"}>{data.contractDuration}</td>
            <td data-label={t("LeaseTerms")}>{data.leaseConditions}</td>
            <td data-label={t("Actions")} style={{ textAlign: "right", display: "flex" }}>
              <Button type="button" color="link" onClick={(resp) => { updateDataFacility(data) }} className="btn btn-link" ><i className="mdi mdi-border-color mdi-24px"></i></Button>
              <Button type="button" color="link" onClick={(resp) => { deleteDataFacility(data) }} className="btn btn-link" ><i className="mdi mdi-trash-can-outline mdi-24px"></i></Button>
            </td>
          </tr>)
        ));
      } else {
        setdataFixedAssetsFacilitiesRows(
          <tr key={uniq_key()}>
            <td colSpan="7" style={{ textAlign: 'center' }}>{t("NoData")}</td>
          </tr>);
      }
    })
  }
  function cerrarModal() {
    setShowModalFacilidadActivosFijos(false);
    removeBodyCss()
  }
  function abrirModal() {
    setShowModalFacilidadActivosFijos(true);
    removeBodyCss()
  }
  function updateDataFacility(data) {
    setdataFacilidad(data)
    setbotonValidation(true);
    setTipo("editar")
    abrirModal()
  }
  function deleteDataFacility(data) {
    setDataDelete(data)
    setconfirm_alert(true);
  }
  // gestion de datos
  function dataManagament(data, tipo) {
    const api = new BackendServices()
    data.transactId = locationData.transactionId;
    let datos = {
      "transactId": Number(locationData.transactionId),
      "address": data?.address ?? " ",
      "propertyType": {
        "code": data.propertyType.name,
        "name": data.propertyType.name
      },
      "observations": data?.observations ?? " ",
      "ownerCompany": data?.ownerCompany ?? " ",
      "leaseFee": Number(data.leaseFee),
      "leaseConditions": data?.leaseConditions ?? "",
      "rentAmount": 0,
      "contractDuration": Number(data.contractDuration)
    }
    if (tipo == "guardar") {
      // nuevoActivosFijosIGR
      api.newFixedAssetsIGR(datos).then(resp => {
        if (resp !== null && resp !== undefined) {
          initializeData(locationData);
          cerrarModal();
        } else {
          cerrarModal();
          seterror_dlg(false);
        }
      }).catch(err => {
        seterror_dlg(false);
      })
    } else {
      datos.facilityAssetId = data.facilityAssetId;
      // actualizarActivosFijosIGR
      api.updateFixedAssetsIGR(datos).then(resp => {
        if (resp !== null && resp !== undefined) {
          initializeData(locationData);
          cerrarModal();
        } else {
          cerrarModal();
          seterror_dlg(false);
        }
      }).catch(err => {
        seterror_dlg(false);
      })
    }
  }
  //abrimos modal para adjunar archivos
  function toggleShowModalFacilidadActivosFijos() {
    setShowModalFacilidadActivosFijos(!showModalFacilidadActivosFijos);
    removeBodyCss()
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  // Form Submission
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    let datosSet = {
      transactId: 1,
      variationsAssets: values.showBlock1 ?? false,
      variationsAssetsObs: values.variationsAssetsObs1 ?? "",
      manufacturingAgroCompanies: values.showBlock2 ?? false,
      productionLine: values.productionLine1 ?? "",
      capacity: values.capacity1 ?? "",
      usedCapacity: values.usedCapacity1 ?? "",
      tradingCompany: values.showBlock3 ?? false,
      warehouseCapacity: values.warehouseCapacity1 ?? "",
      transportDistributionFleet: values.showBlock4 ?? false,
      notApplicable: values.showBlock5 ?? false,
      units: values.units1 ?? "",
      renovation: values.renovation1 ?? "",

      descriptionOfTheFacilities: values.showBlock6 ?? false,
      physicalLocation: values.physicalLocation ?? '',
      numberOfBranches: values.numberOfBranches ?? '',
      rentalConditions: values.rentalConditions ?? '',
      rentalConditionsAf: values.rentalConditionsAf ?? '',
      invested: values.invested ?? '',
    }
    setdataReturn(datosSet)
    setFormValid(true)
  }
  return (
    <React.Fragment>

      <h5 className="card-title">{t("FixedAssetsFacilities")}</h5>
      <AvForm id="frmActivosFijos" className="needs-validation" onSubmit={handleSubmit}>
        <Row>
          <Col md="9">
            <h5 className="card-sub-title">{t("DescriptionOfTheFacilities2")}</h5>
          </Col>
          <Col md="3" style={{ textAlign: "right" }}>
            <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => {
              setbotonValidation(true); setTipo("guardar"); setdataFacilidad({
                "transactId": 0,
                "address": null,
                "propertyType": {
                  "code": "",
                  "name": ""
                },
                "observations": null,
                "ownerCompany": null,
                "leaseFee": 0,
                "leaseConditions": null,
                "contractDuration": 0
              }); abrirModal();
            }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>
          </Col>
          <Col lg="12" className="table-responsive styled-table-div">
            <Table className="table table-striped table-hover styled-table table" >
              <thead>
                <tr>
                  <th>{t("Address")}</th>
                  <th>{t("Description")}</th>
                  <th>{t("PropertyType")}</th>
                  <th>{t("OwnerCompany")}</th>
                  <th>{t("LeaseFee")}</th>
                  <th>{t("ContractPeriod") + " (" + t("Year") + "s)"}</th>
                  <th>{t("LeaseTerms")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {dataFixedAssetsFacilitiesRows}
              </tbody>
            </Table>

          </Col>
        </Row>
        <Row style={{ marginTop: "15px" }}>
          <Col md="1" style={{ textAlign: "center" }}>
            <AvField type="checkbox" name="showBlock1" checked={showBlock1} onChange={() => { setShowBlock1(!showBlock1) }} />
          </Col>
          <Col md="11" style={{ textAlign: "left" }}>
            <Label htmlFor="variationsAssets">{t("ThereSignificanVariationsFixedAssetsCompanies")}</Label>
          </Col>
          {showBlock1 && (
            <Col md="12">
              <div className="mb-3">
                <Label style={{ textAlign: "left" }} htmlFor="variationsAssetsObs1">{t("IndicateTypeInvestmentWasMadeAdvantagesCompanyInvestmentWasFinanced")}</Label>
                <AvField
                  type="textarea"
                  name="variationsAssetsObs1"
                  id="variationsAssetsObs1"
                  maxLength="1000"
                  rows="7"
                  validate={{
                    required: { value: true, errorMessage: t("Required Field") },
                  }}
                  value={props.dataFacilidadActivosFijos.variationsAssetsObs}
                />
              </div>
            </Col>
          )}
        </Row>
        <Row>
          <Col md="1" style={{ textAlign: "center" }}>
            <AvField type="checkbox" name="showBlock2" checked={showBlock2} onChange={() => { setShowBlock2(!showBlock2) }} />
          </Col>
          <Col md="11" style={{ textAlign: "left" }}>
            <Label htmlFor="variationsAssets">{t("HasManufacturingCompaniesAgroindustries")}</Label>
          </Col>
          {/* <Col md="12">
            <AvGroup check className="mb-3">
              <AvField type="checkbox" name="showBlock2" checked={showBlock2} onChange={() => { setShowBlock2(!showBlock2) }} />
              <Label style={{ textAlign: "left" }} htmlFor="manufacturingAgroCompanies">{t("HasManufacturingCompaniesAgroindustries")}</Label>
            </AvGroup>
          </Col> */}
          {showBlock2 &&
            <React.Fragment>
              <Col md="12">
                <div className="mb-3">
                  <Label style={{ textAlign: "left" }} htmlFor="typeInvestmentWasMade">{t("MainProductionLinesWhatDoesConsist")}</Label>
                  <AvField
                    type="textarea"
                    name="productionLine1"
                    id="productionLine1"
                    maxLength="1000"
                    rows="7"
                    validate={{
                      required: { value: true, errorMessage: t("Required Field") },
                    }}
                    value={props.dataFacilidadActivosFijos.productionLine}
                  />
                </div>
              </Col>
              <Col md="12">
                <div className="mb-3">
                  <Label style={{ textAlign: "left" }} htmlFor="installedCapacity">{t("Installed Capacity in units amount of finished products that the company can produce per period per year, per month, etc")}</Label>
                  <AvField
                    type="textarea"
                    name="capacity1"
                    id="capacity1"
                    maxLength="1000"
                    rows="7"
                    validate={{
                      required: { value: true, errorMessage: t("Required Field") },
                    }}
                    value={props.dataFacilidadActivosFijos.capacity}
                  />
                </div>
              </Col>
              <Col md="12">
                <div className="mb-3">
                  <Label style={{ textAlign: "left" }} htmlFor="percentCapacityUsed">{t("Percentage of capacity used number of finished products that are currently producing per year, per month, etc")}</Label>
                  <AvField
                    type="textarea"
                    name="usedCapacity1"
                    id="usedCapacity1"
                    maxLength="1000"
                    rows="7"
                    validate={{
                      required: { value: true, errorMessage: t("Required Field") },
                    }}
                    value={props.dataFacilidadActivosFijos.usedCapacity}
                  />
                </div>
              </Col>
            </React.Fragment>
          }
        </Row>

        <Row>
          <Col md="1" style={{ textAlign: "center" }}>
            <AvField type="checkbox" name="showBlock3" checked={showBlock3} onChange={() => { setShowBlock3(!showBlock3) }} />
          </Col>
          <Col md="11" style={{ textAlign: "left" }}>
            <Label htmlFor="variationsAssets">{t("Has Marketing Companies")}</Label>
          </Col>
          {/* <Col md="12">
            <AvGroup check className="mb-3">
              <AvField type="checkbox" name="showBlock3" checked={showBlock3} onChange={() => { setShowBlock3(!showBlock3) }} />
              <Label style={{ textAlign: "left" }} htmlFor="tradingCompany">{t("Has Marketing Companies")}</Label>
            </AvGroup>
          </Col> */}
          {showBlock3 &&
            <React.Fragment>
              <Col md="12">
                <div className="mb-3">
                  <Label style={{ textAlign: "left" }} htmlFor="storageDistributionCapacity">{t("Storage and Distribution Capacity (Installed and percentage of use)")}</Label>
                  <AvField
                    type="textarea"
                    name="warehouseCapacity1"
                    id="warehouseCapacity1"
                    maxLength="1000"
                    rows="7"
                    validate={{
                      required: { value: true, errorMessage: t("Required Field") },
                    }}
                    value={props.dataFacilidadActivosFijos.warehouseCapacity}
                  />
                </div>
              </Col>
            </React.Fragment>
          }
        </Row>
        <Row>
          <Col md="1" style={{ textAlign: "center" }}>
            <AvField type="checkbox" name="showBlock4" checked={showBlock4} onChange={() => { setShowBlock4(!showBlock4) }} />
          </Col>
          <Col md="11" style={{ textAlign: "left" }}>
            <Label htmlFor="variationsAssets">{t("It has a transportation / distribution fleet")}</Label>
          </Col>
          {showBlock4 &&
            <React.Fragment>
              <Col md="12">
                <div className="mb-3">
                  <Label style={{ textAlign: "left" }} htmlFor="indicatenumberunits">{t("Indicate the number of units with which it has the age of said vehicles the average number of trips per month average costs of routine and preventive maintenance of each vehicle and the frequency in which they do it")}</Label>
                  <AvField
                    type="textarea"
                    name="units1"
                    id="units1"
                    maxLength="1000"
                    rows="7"
                    validate={{
                      required: { value: true, errorMessage: t("Required Field") },
                    }}
                    value={props.dataFacilidadActivosFijos.units}
                  />
                </div>
              </Col>
              <Col md="12">
                <div className="mb-3">
                  <Label style={{ textAlign: "left" }} htmlFor="estimateashorttermrenewal">{t("Do you estimate a short-term renewal of the fleet? How do you plan to finance it?")}</Label>
                  <AvField
                    type="textarea"
                    name="renovation1"
                    id="renovation1"
                    maxLength="1000"
                    rows="7"
                    validate={{
                      required: { value: true, errorMessage: t("Required Field") },
                    }}
                    value={props.dataFacilidadActivosFijos.renovation}
                  />
                </div>
              </Col>
            </React.Fragment>
          }
        </Row>

        <Row>
          <Col md="1" style={{ textAlign: "center" }}>
            <AvField type="checkbox" name="showBlock6" checked={showBlock6} onChange={() => { setShowBlock6(!showBlock6) }} />
          </Col>
          <Col md="11" style={{ textAlign: "left" }}>
            <Label htmlFor="descriptionOfTheFacilities">{t("Description of the facilities")}</Label>
          </Col>
          {/* <Col md="12">
            <AvGroup check className="mb-3">
              <AvField type="checkbox" name="ShowBlock6" checked={ShowBlock6} onChange={() => { setShowBlock6(!ShowBlock6) }} />
              <Label style={{ textAlign: "left" }} htmlFor="manufacturingAgroCompanies">{t("HasManufacturingCompaniesAgroindustries")}</Label>
            </AvGroup>
          </Col> */}
          {showBlock6 &&
            <React.Fragment>
              <Col md="12">
                <div className="mb-3">
                  <Label style={{ textAlign: "left" }} htmlFor="typeInvestmentWasMade">{t("DescriptionOfTheFacilities1")}</Label>
                  <AvField
                    type="textarea"
                    name="physicalLocation"
                    id="physicalLocation"
                    maxLength="1000"
                    rows="7"
                    // validate={{
                    //   required: { value: true, errorMessage: t("Required Field") },
                    // }}
                    value={props.dataFacilidadActivosFijos.physicalLocation}
                  />
                </div>
              </Col>
              {/* <Col md="12">
                <div className="mb-3">
                  <Label style={{ textAlign: "left" }} htmlFor="typeInvestmentWasMade">{t("DescriptionOfTheFacilities2")}</Label>
                  <AvField
                    type="textarea"
                    name="numberOfBranches"
                    id="numberOfBranches"
                    maxLength="1000"
                    rows="7"
                    // validate={{
                    //   required: { value: true, errorMessage: t("Required Field") },
                    // }}
                    value={props.dataFacilidadActivosFijos.numberOfBranches}
                  />
                </div>
              </Col>
              <Col md="12">
                <div className="mb-3">
                  <Label style={{ textAlign: "left" }} htmlFor="typeInvestmentWasMade">{t("DescriptionOfTheFacilities3")}</Label>
                  <AvField
                    type="textarea"
                    name="rentalConditions"
                    id="rentalConditions"
                    maxLength="1000"
                    rows="7"
                    // validate={{
                    //   required: { value: true, errorMessage: t("Required Field") },
                    // }}
                    value={props.dataFacilidadActivosFijos.rentalConditions}
                  />
                </div>
              </Col> */}
              <Col md="12">
                <div className="mb-3">
                  <Label style={{ textAlign: "left" }} htmlFor="typeInvestmentWasMade">{t("DescriptionOfTheFacilities4")}</Label>
                  <AvField
                    type="textarea"
                    name="rentalConditionsAf"
                    id="rentalConditionsAf"
                    maxLength="1000"
                    rows="7"
                    value={props.dataFacilidadActivosFijos.rentalConditionsAf}
                  />
                </div>
              </Col>
              <Col md="12">
                <div className="mb-3">
                  <Label style={{ textAlign: "left" }} htmlFor="typeInvestmentWasMade">{t("DescriptionOfTheFacilities5")}</Label>
                  <AvField
                    type="textarea"
                    name="invested"
                    id="invested"
                    maxLength="1000"
                    rows="7"
                    value={props.dataFacilidadActivosFijos.invested}
                  />
                </div>
              </Col>
            </React.Fragment>
          }
        </Row>

        <Row>
          <Col md="1" style={{ textAlign: "center" }}>
            <AvField type="checkbox" name="showBlock5" checked={showBlock5} onChange={() => { setShowBlock5(!showBlock5) }} />
          </Col>
          <Col md="11" style={{ textAlign: "left" }}>
            <Label htmlFor="variationsAssets">{t("N/A")}</Label>
          </Col>
        </Row>
        {locationData ? (props?.activeTab == 17 ?
          <AttachmentFileCore attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.PROCESS_INFORMEGESTION, OPTs.ACT_FACILIDADACTIVOSFIJOS)} />
          : null) : null}
      </AvForm>
      <ModalFacilidadActivosFijos dataManagament={dataManagament} botones={botonValidation} tipo={tipo} dataFacilidad={dataFacilidad} isOpen={showModalFacilidadActivosFijos} toggle={() => { cerrarModal() }} />
      {successSave_dlg ? (
        <SweetAlert
          success
          title={t("SuccessDialog")}
          confirmButtonText={t("Confirm")}
          cancelButtonText={t("Cancel")}
          onConfirm={() => {
            setsuccessSave_dlg(false)
            initializeData(locationData);
          }}
        >
          {t("SuccessSaveMessage")}
        </SweetAlert>
      ) : null}

      {error_dlg ? (
        <SweetAlert
          error
          title={t("ErrorDialog")}
          confirmButtonText={t("Confirm")}
          cancelButtonText={t("Cancel")}
          onConfirm={() => {
            seterror_dlg(false)
            initializeData(locationData);
          }}
        >
          {error_msg}
        </SweetAlert>
      ) : null}
      {confirm_alert ? (
        <SweetAlert
          title={t("Areyousure")}
          warning
          showCancel
          confirmButtonText={t("Yesdeleteit")}
          cancelButtonText={t("Cancel")}
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          onConfirm={() => {
            const apiBack = new BackendServices();
            // eliminarActivosFijosIGR
            apiBack.removeFixedAssetsIGR({ transactId: Number(locationData.transactionId), fixedAssetId: dataDelete.facilityAssetId }).then(resp => {
              if (resp.statusCode == "500") {
                setconfirm_alert(false)
                seterror_dlg(false)
              } else {
                setconfirm_alert(false)
                initializeData(locationData);
              }
            }).catch(error => {
              setconfirm_alert(false)
              seterror_dlg(false)
            })
          }}
          onCancel={() => setconfirm_alert(false)}
        >
          {t("Youwontbeabletorevertthis")}
        </SweetAlert>
      ) : null}
    </React.Fragment>
  );

});
FacilidadActivosFijos.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  locationData: PropTypes.any,
}
export default FacilidadActivosFijos;
