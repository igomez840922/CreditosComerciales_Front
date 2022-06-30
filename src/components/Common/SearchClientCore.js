import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'
import Select from "react-select";
import { useLocation, useHistory } from 'react-router-dom'
import LoadingOverlay from 'react-loading-overlay';

import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  CardFooter,
} from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"
import { Link } from "react-router-dom"

import { CoreServices, BackendServices } from '../../services';

import Alert from 'react-bootstrap/Alert'

const SearchClientCore = (props) => {

  const { t, i18n } = useTranslation();
  const location = useLocation();

  const [dataRows, setDataRows] = useState([]);
  const [isActiveLoading, setIsActiveLoading] = useState(false);

  const [personTypeList, setPersonTypeList] = useState(undefined);
  const [personTypeSelected, setPersonTypeSelected] = useState([]);

  const [apiServiceBackend, setapiServiceBackend] = useState(new BackendServices());
  const [apiCoreServices, setCoreServices] = useState(new CoreServices());

  const [msgData, setmsgData] = useState({ show: false, msg: "", isError: false });
  const [msgDataND, setmsgDataND] = useState({ show: false, msg: "", isError: false });

  const [valuesSelected, setvaluesSelected] = useState(null);
  

  //On Mounting (componentDidMount)
  React.useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    loadPersonTypes();
  }

  //cargar lista de tipo de personas
  function loadPersonTypes() {
    apiServiceBackend.consultarCatalogoTipoPersona()
      .then((data) => {
        if (data !== null && data !== undefined) {
          let json = [];
          for (let i = 0; i < data.length; i++) {
            json.push({ label: t(data[i]["label"]), value: data[i]["code"] })
          }
          setPersonTypeList(json);
          setPersonTypeSelected(json[0]);
        }
      }).catch((error) => { });
  }

  function searchClientT24(values) {

    setmsgData({ show: false, msg: "", isError: false })
    setmsgDataND({ show: false, msg: "", isError: false })
    setDataRows([])
    setvaluesSelected(values);

    setIsActiveLoading(true);
    apiCoreServices.getPartiesInformation(values).then((dataList) => {

      if (dataList.error !== undefined) {
        showMessage(t("ErrorCode") + ": " + t(dataList.errorCode) + "  -  " + t("ErrorMsg") + " " + t(dataList.error), true);
        return;
      }

      if (dataList?.length == 0) {
        showMessageND(t("NoDataFilter"));
        return;
      }

      var rows = dataList.map((data) => (
        <tr key={data.id} className='button-padding'>
          <td>{data.id}</td>
          <td>{data.clientname}</td>
          <td>{data.idtype}</td>
          <td>{data.idnumber}</td>
          <td>
            <Link to={"#"} onClick={() => { props.onClientSelect(data) }} title={t("Select")}><i className="mdi mdi-check-box-multiple-outline mdi-24px"></i></Link>
          </td>
        </tr>)
      );
      setDataRows(rows);
    })
      .catch((err) => {
        showMessage(t("ErrorCode") + ": " + t(err.errorCode) + "  -  " + t("ErrorMsg") + " " + t(err.message), true);
      }).finally(() => {
        setIsActiveLoading(false);
      })
  }

  // Submitimos formulario para busqueda de clientes
  function handleSubmitSearchClient(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    values["PartyType"] = personTypeSelected.value === 1 ? "Natural" : "Juridico";
    searchClientT24(values);
  }

  //mostrar mensaje 
  function showMessage(message, isError = false) {
    setmsgData({ show: true, msg: message, isError: isError })
  }

  //mostrar mensaje 
  function showMessageND(message, isError = false) {
    setmsgDataND({ show: true, msg: message, isError: isError })
  }

  return (

    <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>
      {/*<h5>{t("SearchClient")}</h5>
        <p className="card-title-desc">
  </p>*/}

      <AvForm id="frmClientSearch" className="needs-validation" onSubmit={handleSubmitSearchClient}>

          <CardBody>
            <Row>

              <Col md="3">
                <div className="mb-3">
                  <Label>{t("ID Number")}</Label>
                  <AvField
                    className="form-control"
                    type="text"
                    name="PartyId"
                    validate={{ required: { value: true, errorMessage: t("Required Field") } }}
                  />
                </div>
              </Col>

              <Col md="3">
                <div className="mb-3">
                  <Label>{t("PersonType")}</Label>
                  <Select noOptionsMessage={() => ""} 
                    onChange={(e) => { setPersonTypeSelected(personTypeList.find(x => x.value === e.value)) }}
                    options={personTypeList}
                    placeholder={t("SelectType")}
                    value={personTypeSelected}
                    name="PersonType" />
                  {/*campoRequeridoIdentificacion ?
                <p className="message-error-parrafo">{t("Required Field")}</p>
              : null*/}
                </div>
              </Col>

              <Col md="3" style={{ textAlign: "left" }}>
                <div className="mb-3">
                  <Label>&nbsp;</Label><br></br>
                  <Button color="success" type="submit"><i className="mdi mdi-file-find mdi-12px"></i> {t("Search")}</Button>
                </div>

              </Col>

              <Col md="3" style={{ textAlign: "right" }}>
                <div className="mb-3">
                  <Label>&nbsp;</Label><br></br>
                  <Button color="primary" type="button" onClick={() => { props.onNewClientSelect(valuesSelected?.PartyId??undefined) }}><i className="mdi mdi-account-plus mdi-12px"></i> {t("NewClient")}</Button>
                </div>
              </Col>
            </Row>

            <Alert show={msgDataND.show} variant={msgDataND.isError ? "danger" : "warning"} dismissible onClose={() => { setmsgDataND({ show: false, msg: "", isError: false }) }}>
                  {msgDataND.msg}
            </Alert>
    
            {dataRows.length > 0 ?
              <div className="table-responsive styled-table-div">
                <Table className="table table-striped table-hover styled-table table">
                  <thead className="">
                    <tr>
                      <th>{t("Client Number")}</th>
                      <th>{t("Client Name")}</th>
                      <th>{t("ID Type")}</th>
                      <th>{t("ID Number")}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows}
                  </tbody>
                </Table>

              </div>
              : null}
   
            <Row>
              <Col md="12">
                <Alert show={msgData.show} variant={msgData.isError ? "danger" : "success"} dismissible onClose={() => { setmsgData({ show: false, msg: "", isError: false }) }}>
                  {msgData.msg}
                </Alert>
              </Col>
            </Row>
          </CardBody>
      </AvForm>
    </LoadingOverlay>

  )
}

SearchClientCore.propTypes = {
  onClientSelect: PropTypes.func,
  onNewClientSelect: PropTypes.func,
}

//export default (withTranslation()(DatosGenerales));
export default SearchClientCore;


