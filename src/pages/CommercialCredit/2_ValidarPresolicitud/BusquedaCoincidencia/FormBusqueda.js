import React, { useState } from "react"
import { withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
import watchlist from "../../../../models/Core/WatchListModel";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
} from "reactstrap"
import { AvForm, AvField } from "availity-reactstrap-validation"
import ApiServiceBackend from "../../../../services/BackendServices/Services";
const FormBusqueda = (props) => {
  const { selectedData } = props;
  const [identificationType, setidentificationType] = useState(selectedData !== undefined ? selectedData.identificationType : "RUC");
  const [identificationList, setIdentificationList] = useState([]);
  //On Mounting (componentDidMount)
  React.useEffect(() => {
    if (selectedData !== undefined && selectedData !== null) {
      setidentificationType(selectedData !== undefined ? selectedData.identificationType : "RUC")
    }
    initializeData();
  }, [selectedData]);
  //Caraga Inicial
  function initializeData() {
    const apiServiceBackend = new ApiServiceBackend();
    apiServiceBackend.consultarCatalogoTipoIdentificacion()
      .then((data) => {
        if (data !== null && data !== undefined) {
          setIdentificationList(data);
        }
      })
      .catch((error) => {
        console.error('api error: ', error);
      });
  }
  // Form Submission
  function handleSubmitFrmSearch(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    const form = document.getElementById('frmSearch');
    let dataModel = watchlist.getRequestModel();
    switch (form.identificationType.value) {
      case "RUC": {
        dataModel.pTypeId = 'JURIDICA';
        dataModel.pCustomerId = form.customerDocumentId.value;
        dataModel.pCustomerListParams.KeyValueParam.push({ _x003C_Key_x003E_k__BackingField: "NOMBRE", _x003C_Value_x003E_k__BackingField: form.firstName.value });
        break;
      }
      case "CED": {
        dataModel.pTypeId = 'CEDULA';
        dataModel.pCustomerId = form.customerDocumentId.value;
        dataModel.pCustomerListParams.KeyValueParam.push({ _x003C_Key_x003E_k__BackingField: "NOMBRE", _x003C_Value_x003E_k__BackingField: form.firstName.value });
        dataModel.pCustomerListParams.KeyValueParam.push({ _x003C_Key_x003E_k__BackingField: "SEGUNDO_NOMBRE", _x003C_Value_x003E_k__BackingField: form.secondName.value });
        dataModel.pCustomerListParams.KeyValueParam.push({ _x003C_Key_x003E_k__BackingField: "PRIMER_APELLIDO", _x003C_Value_x003E_k__BackingField: form.firstLastName.value });
        dataModel.pCustomerListParams.KeyValueParam.push({ _x003C_Key_x003E_k__BackingField: "SEGUNDO_APELLIDO", _x003C_Value_x003E_k__BackingField: form.secondLastName.value });
        break;
      }
      default: {
        dataModel.pTypeId = 'PASAPORTE';
        dataModel.pCustomerId = form.customerDocumentId.value;
        dataModel.pCustomerListParams.KeyValueParam.push({ _x003C_Key_x003E_k__BackingField: "NOMBRE", _x003C_Value_x003E_k__BackingField: form.firstName.value });
        dataModel.pCustomerListParams.KeyValueParam.push({ _x003C_Key_x003E_k__BackingField: "SEGUNDO_NOMBRE", _x003C_Value_x003E_k__BackingField: form.secondName.value });
        dataModel.pCustomerListParams.KeyValueParam.push({ _x003C_Key_x003E_k__BackingField: "PRIMER_APELLIDO", _x003C_Value_x003E_k__BackingField: form.firstLastName.value });
        dataModel.pCustomerListParams.KeyValueParam.push({ _x003C_Key_x003E_k__BackingField: "SEGUNDO_APELLIDO", _x003C_Value_x003E_k__BackingField: form.secondLastName.value });
        break;
      }
    }
    props.onSubmit(dataModel);
  }
  //On change Inputs
  function handleChangeInputfrmSearch(e) {
    selectedData[e.target.name] = e.target.value;
    props.updateDataModel(selectedData);

    switch (e.target.name) {
      case "identificationType": {
        setidentificationType(e.target.value);
        break;
      }
    }
  }
  function handleGoogleSearch() {
    const form = document.getElementById('frmSearch');
    let query;
    switch (form.identificationType.value) {
      case "RUC": {
        query = [
          form.identificationType.options[form.identificationType.options.selectedIndex].innerText,
          form.customerDocumentId.value,
          form.firstName.value
        ];
        break;
      }
      default: {
        query = [
          form.identificationType.options[form.identificationType.options.selectedIndex].innerText,
          form.customerDocumentId.value,
          form.firstName.value,
          form.secondName.value !== undefined ? form.secondName.value : "",
          form.firstLastName.value !== undefined ? form.firstLastName.value : "",
          form.secondLastName.value !== undefined ? form.secondLastName.value : ""
        ];
        break;
      }
    }
    props.onGoogleSearch(query);
  }
  function getSearchForm() {
    //segun tipo de identiicación
    switch (identificationType) {
      case "RUC": { //RUC
        return (
          <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmitFrmSearch}>
            <Row>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="identificationType">{props.t("ID Type")}</Label>
                  <Select noOptionsMessage={() => ""}  name="identificationType" className="form-control" value={identificationType} onChange={handleChangeInputfrmSearch}>
                    {identificationList.map((dt) => (
                      <option value={dt.id}>{props.t(dt.description)}</option>
                    ))}
                  </select>
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="customerDocumentId">{props.t("ID Number")}</Label>
                  <AvField
                    className="form-control"
                    name="customerDocumentId"
                    type="text" onChange={handleChangeInputfrmSearch}
                    errorMessage={props.t("Required Field")}
                    validate={{ required: { value: true } }} value={selectedData !== undefined ? selectedData.customerDocumentId : 0}
                  />
                </div>
              </Col>

              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="firstName">{props.t("Name")}</Label>
                  <AvField
                    className="form-control"
                    name="firstName"
                    type="text" onChange={handleChangeInputfrmSearch}
                    errorMessage={props.t("Required Field")}
                    validate={{ required: { value: true } }} value={selectedData !== undefined ? selectedData.firstName : ""}
                  />
                </div>
              </Col>

            </Row>

            <Row>
              <Col lg="12" style={{ textAlign: "right" }}>
                <Button id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}>
                  <i className="mdi mdi-file-find mdi-12px"></i> {props.t("Search")}
                </Button>
                <Button id="btnGoogle" color="warning" style={{ margin: '5px' }} onClick={() => { handleGoogleSearch() }}>
                  <i className="mdi mdi-google mdi-12px"></i> {props.t("Google")}
                </Button>
              </Col>
            </Row>
          </AvForm>
        )
      }
      default: { //Cedula o Pasaporte 
        return (

          <AvForm id="frmSearch" className="needs-validation" onSubmit={handleSubmitFrmSearch}>
            <Row>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="identificationType">{props.t("ID Type")}</Label>
                  <Select noOptionsMessage={() => ""}  name="identificationType" className="form-control" value={identificationType} onChange={handleChangeInputfrmSearch}>
                    {identificationList.map((dt) => (
                      <option value={dt.id}>{props.t(dt.description)}</option>
                    ))}
                  </select>
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="customerDocumentId">{props.t("ID Number")}</Label>
                  <AvField
                    className="form-control"
                    name="customerDocumentId"
                    type="text" onChange={handleChangeInputfrmSearch}
                    errorMessage={props.t("Required Field")}
                    validate={{ required: { value: true } }} value={selectedData !== undefined ? selectedData.customerDocumentId : 0}
                  />
                </div>
              </Col>

              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="firstName">{props.t("First Name")}</Label>
                  <AvField
                    className="form-control"
                    name="firstName"
                    type="text" onChange={handleChangeInputfrmSearch}
                    errorMessage={props.t("Required Field")}
                    validate={{ required: { value: true } }} value={selectedData !== undefined ? selectedData.firstName : ""}
                  />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="secondName">{props.t("SecondName")}</Label>
                  <AvField
                    name="secondName"
                    type="text" onChange={handleChangeInputfrmSearch}
                    className="form-control" value={selectedData !== undefined ? selectedData.secondName : ""}
                  />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="firstLastName">{props.t("FirstLastName")}</Label>
                  <AvField
                    name="firstLastName"
                    type="text" onChange={handleChangeInputfrmSearch}
                    className="form-control"
                    errorMessage={props.t("Required Field")}
                    validate={{ required: { value: true } }} value={selectedData !== undefined ? selectedData.firstLastName : ""}
                  />
                </div>
              </Col>
              <Col md="3">
                <div className="mb-3">
                  <Label htmlFor="secondLastName">{props.t("SecondLastName")}</Label>
                  <AvField
                    name="secondLastName"
                    type="text" onChange={handleChangeInputfrmSearch}
                    className="form-control" value={selectedData !== undefined ? selectedData.secondLastName : ""}
                  />
                </div>
              </Col>
            </Row>

            <Row>
              <Col lg="12" style={{ textAlign: "right" }}>
                <Button id="btnSearch" color="success" type="submit" style={{ margin: '5px' }}>
                  <i className="mdi mdi-file-find mdi-12px"></i> {props.t("Search")}
                </Button>
                <Button id="btnGoogle" color="success" style={{ margin: '5px' }} onClick={() => { handleGoogleSearch() }}>
                  <i className="mdi mdi-google mdi-12px"></i> {props.t("Google")}
                </Button>
              </Col>
            </Row>
          </AvForm>

        )
      }
    }
  }

  return (

    <Row>
      <Col lg="12">
        <h4 className="card-title">{props.t("Surveillance List")}</h4>
        <p className="card-title-desc  border-bottom">
          {props.t("Search and Discard your Customers")}
        </p>


        {getSearchForm()}


      </Col>
    </Row>
  );

};

FormBusqueda.propTypes = {
  onSubmit: PropTypes.func,
  onGoogleSearch: PropTypes.func,
  updateDataModel: PropTypes.func,
  selectedData: PropTypes.any,
}

export default (withTranslation()(FormBusqueda));
