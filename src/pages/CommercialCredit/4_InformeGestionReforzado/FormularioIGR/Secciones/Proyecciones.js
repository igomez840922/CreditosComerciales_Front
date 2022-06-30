import React, { useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types'
import { Link, useLocation, useHistory } from "react-router-dom"
import {
  Row,
  Col,
  Label,
  Table,
  InputGroup,
  input,
} from "reactstrap"
import { AvForm, AvField } from "availity-reactstrap-validation"
import AttachmentFileCore from "../../../../../components/Common/AttachmentFileCore";
import * as OPTs from "../../../../../helpers/options_helper";
import { AttachmentFileInputModel } from '../../../../../models/Common/AttachmentFileInputModel';
import { BackendServices } from "../../../../../services/index.js"
//Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";
import * as url from "../../../../../helpers/url_helper"
import Currency from "../../../../../helpers/currency"
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import moment from "moment";

const Proyecciones = React.forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  // const { locationData } = props;
  const currencyData = new Currency();
  const location = useLocation()
  const [dataLocation, setData] = useState(location.data);
  const [formValid, setFormValid] = useState(false);
  const [dataReturn, setDataReturn] = useState({});
  const history = useHistory();

  const [locationData, setLocationData] = useState(null);
  const [fechaSet, setfechaSet] = useState(null);
  const [validacionFecha, setvalidacionFecha] = useState(false);
  React.useImperativeHandle(ref, () => ({
    validateForm: () => {
      const form = document.getElementById('frmProyecciones');
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
    if (props.activeTab == 13) {
      // Read Api Service data
      initializeData(dataSession);
    }
  }, [props.activeTab == 13]);
  function initializeData(dataLocation) {
    const api = new BackendServices()
    // consultarProyecciones
    api.consultProjections(dataLocation.transactionId).then(resp => {
      console.log(resp);
      if (resp == undefined) {
        setfechaSet("")
        //setfechaSet(moment(moment(), "DD/MM/YYYY").format("YYYY-MM-DD"))

      } else {
        setDataReturn(resp.projectionsDTO);
        //setfechaSet(moment(resp.projectionsDTO.estimatedDate, "DD/MM/YYYY").format("YYYY-MM-DD"))
        let date = moment(resp.projectionsDTO.estimatedDate).format("DD-MM-YYYY");
        setfechaSet(date === 'Invalid date' ? '' : date)

      }
    })
  }
  // Form Submission
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    values.estimatedDate = fechaSet == " " ? fechaSet : (moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? fechaSet : (moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD")))
    console.log(moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD"), moment(fechaSet, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date")
    setDataReturn(values)
    setFormValid(true)
    //props.onSubmit(values);
  }

  return (
    <React.Fragment>
      <h5>
        {t("Projections")}
      </h5>
      <p className="card-title-desc"></p>
      <AvForm id="frmProyecciones" className="needs-validation" onSubmit={handleSubmit}>
        <Row>
          <Col md="12">
            <div className="mb-3">
              <Label htmlFor="companyHistoryDetails">{t("Details")}</Label>
              <AvField
                className="form-control"
                name="descripcion"
                type="textarea"
                value={dataReturn?.descripcion ?? " "}
                id="descripcion"
                rows="7" />
            </div>
          </Col>
        </Row>
        {locationData ? (props?.activeTab == 13 ?
          <AttachmentFileCore attachmentFileInputModel={new AttachmentFileInputModel(locationData.transactionId, OPTs.PROCESS_INFORMEGESTION, OPTs.ACT_PROYECCIONES)} />
          : null) : null}


        <Row>
          <Col md="6">
            <h5 className="card-sub-title">{t("EstimatesVariationsInItsAssetStructure")}</h5>
          </Col>
        </Row>

        <Row>
          <Col md="12">

            <div className='table-responsive styled-table-div'>
              <Table className="table table-striped table-hover styled-table table table">
                <thead  >
                  <tr>
                    <th>{t("Type")}</th>
                    <th>{t("Amount")}</th>
                    <th>{t("Reason")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{t("OperatingAssets")}</td>
                    <td>
                      <AvField
                        className="form-control"
                        name="assetsOperatingAmount"
                        type="text"
                        value={currencyData.format(dataReturn?.assetsOperatingAmount ?? 0)}
                        id="assetsOperatingAmount"
                        pattern="^[0-9,.-]*$"
                        onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        rows="7" />
                    </td>
                    <td>
                      <AvField
                        className="form-control"
                        name="assetsOperatingReason"
                        type="text"
                        value={dataReturn?.assetsOperatingReason ?? " "}
                        id="assetsOperatingReason"
                        // validate={{
                        //   required: { value: true, errorMessage: t("Required Field") }
                        // }}
                        rows="7" />
                    </td>
                  </tr>
                  <tr>
                    <td>{t("FixedAssets")}</td>
                    <td>
                      <AvField
                        className="form-control"
                        name="fixedAssetsAmount"
                        type="text"
                        value={currencyData.format(dataReturn?.fixedAssetsAmount ?? 0)}
                        id="fixedAssetsAmount"
                        pattern="^[0-9,.-]*$"
                        onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        rows="7" />
                    </td>
                    <td>
                      <AvField
                        className="form-control"
                        name="fixedAssetsReason"
                        type="text"
                        value={dataReturn?.fixedAssetsReason ?? " "}
                        id="fixedAssetsReason"
                        // validate={{
                        //   required: { value: true, errorMessage: t("Required Field") }
                        // }}
                        rows="7" />
                    </td>
                  </tr>
                  <tr>
                    <td>{t("OthersAssets")}</td>
                    <td>
                      <AvField
                        className="form-control"
                        name="othersAssetsAmount"
                        type="text"
                        value={currencyData.format(dataReturn?.othersAssetsAmount ?? 0)}
                        id="othersAssetsAmount"
                        pattern="^[0-9,.-]*$"
                        onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        rows="7" />
                    </td>
                    <td>
                      <AvField
                        className="form-control"
                        name="othersAssetsReason"
                        type="text"
                        value={dataReturn?.othersAssetsReason ?? " "}
                        id="othersAssetsReason"
                        // validate={{
                        //   required: { value: true, errorMessage: t("Required Field") }
                        // }}
                        rows="7" />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>



        <Row>
          <Col md="12">
            <h5 className="card-sub-title">{t("EstimatesVariationsInItsFinancingSources")}</h5>
          </Col>
        </Row>
        <Row>
          <Col md="12">

            <div className='table-responsive styled-table-div'>
              <Table className="table table-striped table-hover styled-table table table">
                <thead  >
                  <tr>
                    <th>{t("Type")}</th>
                    <th>{t("Amount")}</th>
                    <th>{t("Reason")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{t("Banking")}</td>
                    <td>
                      <AvField
                        className="form-control"
                        name="bankAmount"
                        type="text"
                        value={currencyData.format(dataReturn?.bankAmount ?? 0)}
                        id="bankAmount"
                        pattern="^[0-9,.-]*$"
                        onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        rows="7" />
                    </td>
                    <td>
                      <AvField
                        className="form-control"
                        name="bankReason"
                        type="text"
                        value={dataReturn?.bankReason ?? " "}
                        id="bankReason"
                        // validate={{
                        //   required: { value: true, errorMessage: t("Required Field") }
                        // }}
                        rows="7" />
                    </td>
                  </tr>
                  <tr>
                    <td>{t("Providers")}</td>
                    <td>
                      <AvField
                        className="form-control"
                        name="providersAmount"
                        type="text"
                        value={currencyData.format(dataReturn?.providersAmount ?? 0)}
                        id="providersAmount"
                        pattern="^[0-9,.-]*$"
                        onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        rows="7" />
                    </td>
                    <td>
                      <AvField
                        className="form-control"
                        name="providersReason"
                        type="text"
                        value={dataReturn?.providersReason ?? " "}
                        id="providersReason"
                        // validate={{
                        //   required: { value: true, errorMessage: t("Required Field") }
                        // }}
                        rows="7" />
                    </td>
                  </tr>
                  <tr>
                    <td>{t("Capital")}</td>
                    <td>
                      <AvField
                        className="form-control"
                        name="capitalAmount"
                        type="text"
                        value={currencyData.format(dataReturn?.capitalAmount ?? 0)}
                        id="capitalAmount"
                        pattern="^[0-9,.-]*$"
                        onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                        rows="7" />
                    </td>
                    <td>
                      <AvField
                        className="form-control"
                        name="capitalReason"
                        type="text"
                        value={dataReturn?.capitalReason ?? " "}
                        id="capitalReason"
                        // validate={{
                        //   required: { value: true, errorMessage: t("Required Field") }
                        // }}
                        rows="7" />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>

        <Row>
          <Col md="6">
            <div className="mb-3">
              <Label>{t("MaximumAmountOfBankDebtToTake")}</Label>
              <AvField
                className="form-control"
                name="maximodeuda"
                type="text"
                pattern="^[0-9,.-]*$"
                onKeyUp={(e) => { let x = currencyData.getRealValue(e.target.value); e.target.value = currencyData.format(x); }}
                value={currencyData.format(dataReturn?.maximodeuda ?? 0)}
                id="maximodeuda"
              />
            </div>
          </Col>
          <Col md="6">
            <div className="mb-3">
              <Label>{t("EstimatedDate")}</Label>

              {(fechaSet !== null) ?
                <Flatpickr
                  name="estimatedDate"
                  id="estimatedDate"
                  className="form-control d-block"
                  placeholder={OPTs.FORMAT_DATE_SHOW}
                  options={{
                    dateFormat: OPTs.FORMAT_DATE,
                    defaultDate: fechaSet,//selectClient !== undefined ? moment(selectClient.birthDate) : null
                  }}
                  onChange={(selectedDates, dateStr, instance) => {
                    setfechaSet(moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD"))
                  }}
                // onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr,"DD/MM/YYYY").format("YYYY-MM-DD") } }) }}

                // onChange={(selectedDates, dateStr, instance) => { handleChangeInputFormClient({ target: { name: "birthDate", value: moment(dateStr).format("YYYY-MM-DD") } }) }}
                /> : null}
              {/* {fechaSet == " " ? <p className="message-error-parrafo">{t("Required")}</p> : null} */}
            </div>
          </Col>
        </Row>
      </AvForm>
    </React.Fragment>
  );
});
Proyecciones.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  locationData: PropTypes.any,
}
export default Proyecciones;
