import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'
import { useLocation, useHistory } from 'react-router-dom'

import moment from "moment";
import * as OPTs from "../../helpers/options_helper"
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";


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
  Modal,
} from "reactstrap"

import { AvForm, AvField, AvInput } from "availity-reactstrap-validation"
import { Link } from "react-router-dom"
import DocumentModel from "../../models/Core/DocumentModel";
import DocumentoAnexoModel from "../../models/Backend/DocumentoAnexoModel";
import functionshelper from "../../helpers/functions_helper"
import LoadingOverlay from 'react-loading-overlay';

import { CoreServices, BackendServices, BpmServices } from '../../services';
import Alert from 'react-bootstrap/Alert'
import { number } from 'yargs';
import { uniqueId } from 'lodash';

const CheckList = (props) => {

  const { t, i18n } = useTranslation();

  const { attachmentFileInputModel } = props;

  const [showModelAttachment, setShowModelAttachment] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isActiveLoading, setIsActiveLoading] = useState(false);
  const [fileData, setfileData] = useState({});
  const [mainPerson, setmainPerson] = useState(undefined);

  //Servicios
  const [bpmServices, setbpmServices] = useState(new BpmServices());
  const [backendServices, setbackendServices] = useState(new BackendServices());
  const [coreServices, setcoreServices] = useState(new CoreServices());

  const [msgData, setmsgData] = useState({ show: false, msg: "", isError: false });
  const [msgModal, setmsgModal] = useState({ show: false, msg: "", isError: false });

  const [selectedAttachment, setselectedAttachment] = useState(undefined);
  const [facilidadesList, setfacilidadesList] = useState(null);
  const [exception, setException] = useState(false);

  //On Mounting (componentDidMount) if selectedData has changes
  React.useEffect(() => {
    setIsActiveLoading(true)
    loadData();
  }, []);


  async function loadData() {
    setTimeout(() => {
      setIsActiveLoading(false)
    }, 5000);
    var mainDebtor = await backendServices.consultPrincipalDebtor(attachmentFileInputModel.transactId);
    setmainPerson(mainDebtor);//mainDebtor.personId

    var generalData = await backendServices.consultGeneralDataIGR(attachmentFileInputModel.transactId);
    //generalData.bank.code;

    var propousalData = await backendServices.consultGeneralDataPropCred(attachmentFileInputModel.transactId);
    //propousalData[0].requestId;

    var lfacilities = await backendServices.consultarFacilidades(propousalData[0]?.requestId ?? "");
    setfacilidadesList(lfacilities)

    var lCheckValidation = (await bpmServices.listCheckValidation(attachmentFileInputModel.processId));
    console.log("lCheckValidation", lCheckValidation)

    var bankingType = []; //es del IGR ... generalData.bank.code;
    var facilityType = []; //facilityType
    var requestType = []  //proposedType
    var processStage = [] //processId
    var guaranteeType = [];
    var bailType = [];

    bankingType.push(generalData?.bank?.code ?? "");

    var procId = attachmentFileInputModel.processId === OPTs.PROCESS_BUSQUEDADESCARTE ? 0 : (attachmentFileInputModel.processId === OPTs.PROCESS_ACEPTACIONCLIENTE ? 13 : attachmentFileInputModel.processId);
    processStage.push(procId)

    for (var facility of lfacilities) {
      facilityType.push(facility.facilityTypeId);
      requestType.push(facility.proposalTypeId);
      var lguarantees = await backendServices.consultarGarantiaPropCred(facility.facilityId);
      var lbails = await backendServices.consultarFianzaPropCred(facility.facilityId);
      if (lguarantees !== undefined) {
        for (var guarantee of lguarantees) {
          guaranteeType.push(Number(guarantee.guaranteeTypeName))
        }
      }
      if (lbails !== undefined) {
        for (var bail of lbails) {
          bailType.push(bail.typeBail)
        }
      }
    }
    if (facilityType.length == 0) {
      facilityType = [""];
    }
    if (guaranteeType.length == 0) {
      guaranteeType = [""];
    }
    if (bankingType.length == 0) {
      bankingType = [""];
    }
    if (processStage.length == 0) {
      processStage = [""];
    }
    if (requestType.length == 0) {
      requestType = [""];
    }
    if (bailType.length == 0) {
      bailType = [""];
    }
    var data = {
      "bankingType": bankingType,
      "guaranteeType": guaranteeType,
      "facilityType": facilityType,
      "requestType": requestType,
      "processStage": processStage,
      "bailType": bailType,
      "guarantorCustomer": true,
      "transactId": attachmentFileInputModel.transactId
    }

    /* data={
       "bankingType": ["PYME"],
       "guaranteeType": [100],
       "facilityType": ["LCR"],
       "requestType": ["NU"],
       "processStage": [2]
     }*/
    //  console.log(data);
    var lCheckListDocs = await backendServices.getCheckListDocuments(data);

    var lCheckListDocsArray = [];
    lCheckListDocsArray = Object.keys(lCheckListDocs);

    if (lCheckListDocs !== undefined) {

      var lCheckListTramite = await backendServices.consultarCheckListTramite(attachmentFileInputModel?.transactId ?? 0, mainDebtor?.personId ?? 0);

      if (lCheckListTramite !== undefined && lCheckListTramite !== null && lCheckListTramite.length > 0) {
        for (var i = 0; i < lCheckListDocsArray.length; i++) {
          try {

            for (var chkDoc of lCheckListDocs[lCheckListDocsArray[i]]) {
              for (var item of lCheckListTramite) {
                if (item.checklistId === chkDoc.id) {
                  chkDoc["onbaseId"] = item.onbaseId;
                  //chkDoc["date"] = moment(item.date).add(chkDoc.validityPeriodDays, "days");
                  chkDoc["commitmentDate"] = item.commitmentDate != "" || item.commitmentDate != null ? moment(item.commitmentDate).format("DD/MM/YYYY") : "";
                  chkDoc["comments"] = item.comments;
                  chkDoc["expirationDate"] = "";
                  if (item.expirationDate !== null && item.expirationDate !== undefined && moment(item.expirationDate).diff(moment(), 'years') < 50) {
                    chkDoc["expirationDate"] = moment(item.expirationDate).format("DD/MM/YYYY");
                  }
                  console.log()
                  if (item.excluded !== null && item.excluded !== undefined) {
                    chkDoc.excepted = item.excluded;
                  }
                }
              }
            }

          }
          catch (err) { }
        }
      }
      console.log(lCheckListDocs);
      let datosCheckList = [];
      (lCheckListDocs?.general ?? [])?.length > 0 && (datosCheckList = [(
        <tr key={(+uniqueId()) ** 2}>
          <td colSpan="8" className='tr-subtitle'><b>Documentos Generales</b></td>
        </tr>), ...(lCheckListDocs?.general ?? [])?.map((data) => (
          <tr key={uniqueId() + data.id}>
            <td></td>
            <td>{data.document}</td>
            <td>{data.excepted ? "Si" : "No"}</td>
            <td>
              {data.expirationDate}
            </td>
            <td>
              {data.commitmentDate}
            </td>
            <td>
              {data.comments}
            </td>
            <td>
              {data["onbaseId"] !== undefined ?
                <Link to="#" title={t("View")} onClick={() => viewAttachment(data.onbaseId)}><i className="mdi mdi-file-eye-outline mdi-24px"></i></Link>
                : null}
            </td>
            <td style={{ textAlign: "right" }}>
              {lCheckValidation ? (data["onbaseId"] !== undefined ?
                <Link to="#" title={t("Remove")} onClick={() => removeAttachment(data, mainDebtor)}><i className="mdi mdi-file-remove-outline mdi-24px"></i></Link>
                :
                <Link to="#" title={t("Attach")} color="danger" onClick={() => openAddAttachment(data)}><i className="mdi mdi-file-upload-outline mdi-24px"></i></Link>) : null
              }
            </td>
          </tr>
        ))]);

      /*
      (lCheckListDocs?.mandatory ?? [])?.length > 0 && (datosCheckList = [(
        <tr key={(+uniqueId()) ** 2}>
          <td colSpan="6" className='tr-subtitle'><b>Documentos Generales</b></td>
        </tr>), ...(lCheckListDocs?.mandatory ?? [])?.map((data) => (
          <tr key={uniqueId() + data.id}>
            <td></td>
            <td>{data.document}</td>
            <td>{data.excepted ? "Si" : "No"}</td>
            <td>
              {data.expirationDate}
            </td>
            <td>
              {data["onbaseId"] !== undefined ?
                <Link to="#" title={t("View")} onClick={() => viewAttachment(data.onbaseId)}><i className="mdi mdi-file-eye-outline mdi-24px"></i></Link>
                : null}
            </td>
            <td style={{ textAlign: "right" }}>
              {lCheckValidation ? (data["onbaseId"] !== undefined ?
                <Link to="#" title={t("Remove")} onClick={() => removeAttachment(data, mainDebtor)}><i className="mdi mdi-file-remove-outline mdi-24px"></i></Link>
                :
                <Link to="#" title={t("Attach")} color="danger" onClick={() => openAddAttachment(data)}><i className="mdi mdi-file-upload-outline mdi-24px"></i></Link>) : null
              }
            </td>
          </tr>
        ))]);
        */

      backendServices.retrieveFacilityType()
        .then((facilidad) => {

          console.log("facilidad", facilidad);
          console.log("lfacilities", lfacilities);


          for (let k = 0; k < lCheckListDocsArray.length; k++) {
            if (lCheckListDocsArray[k] != "general") {
              console.log("lCheckListDocsArray[k]", lCheckListDocsArray[k]);
              for (let i = 0; i < lfacilities.length; i++) {
                if (lfacilities[i].facilityId == lCheckListDocsArray[k]) {
                  console.log("facilidad Encontrada");

                  datosCheckList = [...datosCheckList, (<tr key={(uniqueId()) ** 3}>
                    <td colSpan="8" className='tr-subtitle'><b>{facilidad.find(x => x.id === lfacilities[i].facilityTypeId)?.description}</b></td>
                  </tr>)];


                  datosCheckList = [...datosCheckList, ...lCheckListDocs[lfacilities[i].facilityId].map((data) => (
                    <tr key={uniqueId() + data.id}>
                      <td></td>
                      <td>{data.document}</td>
                      <td>{data.excepted ? "Si" : "No"}</td>
                      <td>
                        {data.expirationDate}
                      </td>
                      <td>
                        {data.commitmentDate}
                      </td>
                      <td>
                        {data.comments}
                      </td>
                      <td>
                        {data["onbaseId"] !== undefined ?
                          <Link to="#" title={t("View")} onClick={() => viewAttachment(data.onbaseId)}><i className="mdi mdi-file-eye-outline mdi-24px"></i></Link>
                          : null}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {lCheckValidation ? (data["onbaseId"] !== undefined ?
                          <Link to="#" title={t("Remove")} onClick={() => removeAttachment(data, mainDebtor)}><i className="mdi mdi-file-remove-outline mdi-24px"></i></Link>
                          :
                          <Link to="#" title={t("Attach")} color="danger" onClick={() => { openAddAttachment(data) }}><i className="mdi mdi-file-upload-outline mdi-24px"></i></Link>) : null
                        }
                      </td>
                    </tr>
                  ))];

                  break;
                }
              }
            }
          }




          /*
          for (let i = 0; i < lfacilities.length; i++) {
            datosGenerales = [...datosGenerales,(<tr>
              <td>{facilidad.find(x => x.id === lfacilities[i].facilityTypeId)?.description}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>)];
            // datosGenerales = [...datosGenerales,...lCheckListDocs[594].map((data) => (
            datosGenerales = [...datosGenerales,...lCheckListDocs[lfacilities[i].facilityId].map((data) => (
              <tr key={data.id}>
                <td></td>
                <td>{data.document}</td>
                <td>{data.excepted ? "Si" : "No"}</td>
                <td>
                  {data.expirationDate}
                </td>
                <td>
                  {data["onbaseId"] !== undefined ?
                    <Link to="#" title={t("View")} onClick={() => viewAttachment(data.onbaseId)}><i className="mdi mdi-file-eye-outline mdi-24px"></i></Link>
                    : null}
                </td>
                <td style={{ textAlign: "right" }}>
                  {data["onbaseId"] !== undefined ?
                    <Link to="#" title={t("Remove")} onClick={() => removeAttachment(data)}><i className="mdi mdi-file-remove-outline mdi-24px"></i></Link>
                    :
                    <Link to="#" title={t("Attach")} color="danger" onClick={() => openAddAttachment(data)}><i className="mdi mdi-file-upload-outline mdi-24px"></i></Link>
                  }
                </td>
              </tr>
            )) ]
          }*/

          console.log("datosCheckList", datosCheckList);
          setAttachments(datosCheckList);
        });


      // setAttachments(lCheckListDocs);
    }
    setIsActiveLoading(false)
  }

  //abrimos modal para adjunar archivos
  function toggleShowModelAttachment() {
    setException(false)
    if (!showModelAttachment) {
      fileData["name"] = "";
      fileData["description"] = "";
      setfileData(fileData);
    }
    setShowModelAttachment(!showModelAttachment);
    removeBodyCss()
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  //ABRIR PARA ADJNTAR ARCHIVO
  function openAddAttachment(data) {
    setselectedAttachment(data);
    setShowModelAttachment(true);
  }

  //GUARDAR ADJUNTO
  async function addAttachment(filedata, values = null) {

    setIsActiveLoading(true);
    console.log("selectedAttachment", selectedAttachment.documentTypeId);
    try {
      console.log({ mainPerson })
      //GUARDAR EN GESTOR DOCUMENTAL ONBASE
      //filedata.name, filedata.description, filedata.fileName, filedata.fileExtension, filedata.fileBase64 
      var clientName = mainPerson !== undefined ? (mainPerson.name + mainPerson.secondName + mainPerson.lastName + mainPerson.secondSurname) : "Attachment";
      var clientNumber = mainPerson !== undefined ? (mainPerson.customerNumberT24) : attachmentFileInputModel.transactId.toString();
      var clientType = mainPerson !== undefined && mainPerson.personType !== "1" ? "J" : "N";
      var identification = mainPerson !== undefined && mainPerson.clientDocId.length > 0 ? mainPerson.clientDocId : attachmentFileInputModel.transactId.toString();
      var data = {
        ApplicationNumber: attachmentFileInputModel.transactId,
        ClientName: clientName.trim(),
        ClientNumber: clientNumber.trim(),//"98765432",
        ClientType: clientType,//"N",
        DocumentTypeId: selectedAttachment?.documentTypeId ?? "167",//selectedAttachment.documentaryType,//,
        ExpirationDate: moment().add(selectedAttachment.validityPeriodDays, "days").format("DD/MM/YYYY"),
        FileExtension: filedata.fileExtension,
        Identification: identification.trim() + selectedAttachment.id,//"9-728-1643",
        ImageBase64: filedata.fileBase64,
        ProcessCode: attachmentFileInputModel.processId,//"7",
        Token: attachmentFileInputModel.transactId + attachmentFileInputModel.processId + attachmentFileInputModel.activityId + selectedAttachment.id,//"34543",
        UploadDate: moment().format("DD/MM/YYYY"),
        //ProductNumber:"456"
      };

      /*
      filedata['transactId'] = attachmentFileInputModel.transactId;
      filedata['processId'] = attachmentFileInputModel.processId;
      filedata['activityId'] = attachmentFileInputModel.activityId;
      filedata['personId'] = attachmentFileInputModel.personId;
      filedata['documentId'] = resultCore.documentId;
      filedata['docName'] = resultCore.docName;
      */
      let resultCore = await coreServices.postDocument(data).then((resultCore) => resultCore).catch((error) => {
        showMessage(t("Error") + " " + error.message, true);
      }).finally(() => { setIsActiveLoading(false); });

      console.log("addAttachment", fileData);
      var data = {
        "transactId": attachmentFileInputModel.transactId,
        "personId": mainPerson?.personId ?? 0,
        "checklistId": selectedAttachment.id,
        "document": selectedAttachment.document,
        "onbaseId": resultCore?.documentId ?? '',
        "date": moment().valueOf(),
        "expirationDate": fileData.expirationDate !== undefined ? fileData.expirationDate : moment().add(100, 'years').format("YYYY-MM-DD"),
        "excluded": fileData.excluded !== undefined ? fileData.excluded : false,
        "commitmentDate": fileData.expirationDate2 !== undefined ? fileData.expirationDate2 : moment().add(100, 'years').format("YYYY-MM-DD"),
        "status": true,
        "comments": values != null ? values?.comments : " ",
        "receivedCa": false
      }
      backendServices.guardarCheckListTramite(data).then((resultBackend) => {
        if (resultBackend) {
          // SI TODO OK ACTUALIZAR LA LISTA DE ADJUNTOS
          loadData();
          setException(false)
        }
      }).catch((error) => {
        showMessage(t("Error") + " " + error.message, true);
      }).finally(() => { setIsActiveLoading(false); });
    }
    catch (error) { showMessage(t("Error") + " " + error.message, true); setIsActiveLoading(false); }
  }

  //BORRAR ADJUNTO
  function removeAttachment(data, mainPersonL = mainPerson) {

    //BORRAR EN GESTOR DOCUMENTAL ONBASE

    ////BORRAR EN BD 
    // data = { transactId: data.transactId, onBaseIdentification: data.onBaseIdentification };
    backendServices.eliminarCheckListTramite(attachmentFileInputModel.transactId, mainPersonL.personId, data.id).then((resultBackend) => {

      if (resultBackend) {
        // SI TODO OK ACTUALIZAR LA LISTA DE ADJUNTOS
        loadData();
      }

    }).catch((error) => {
      showMessage(t("Error") + " " + error.message, true);
    })
      .finally(() => { });
    //})
    //.catch((error) => {console.error('api error', error);})
    //.finally (() => {  });        
  }

  //VER ADJUNTO
  function viewAttachment(docId) {
    coreServices.postViewDocument(docId).then((resultCore) => {
      console.log("viewAttachment", resultCore);

      if (resultCore !== null) {
        window.open(resultCore, "_blank")
      }
    }).catch((error) => { console.error('api error', error); })
      .finally(() => { setIsActiveLoading(false); });
  }

  function saveAttachment() {
    let form = document.getElementById('frmAttachment');
    form.requestSubmit();
  }

  // Submitimos formulario para busqueda de clientes
  function handleSubmitfrmAttachment(event, errors, values) {
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }

    if (fileData['fileName'] === undefined && !exception) {
      return;
    }

    addAttachment(fileData, values);
    toggleShowModelAttachment();
  }
  //On change Inputs
  async function handleChangeInputfrm(e) {
    fileData[e.target.name] = e.target.value;
    switch (e.target.name) {
      case "attachment": {
        fileData['fileName'] = undefined;

        if (e.target.files[0].size > (1024 * 1024 * 5)) {  //1024*1024*5 => 5MB
          showMessageModal(t("FileToBigOnlyAcceptFilesUntil") + " 5MB", true);
          return;
        };

        const file = e.target.files[0]
        fileData['fileName'] = file.name;
        fileData['fileExtension'] = "." + file.name.split('.').pop();
        var base64 = await functionshelper.convertBase64(file);
        //console.log("base64",base64.split(','))
        fileData['fileBase64'] = base64.split(',')[1];
        break;
      }
      default:
        break;
    }
    console.log("fileData", fileData)
    setfileData(fileData);
  }
  function handleChangeInputChkClient(e) {
    fileData[e.target.name] = e.target.checked;
    setException(e.target.checked)
  }
  //mostrar mensaje 
  function showMessage(message, isError = false) {
    setmsgData({ show: true, msg: message, isError: isError })
  }
  function showMessageModal(message, isError = false) {
    setmsgModal({ show: true, msg: message, isError: isError })
  }

  return (

    <React.Fragment>
      <LoadingOverlay active={isActiveLoading} spinner text={t("WaitingPlease")}>

        <Card>
          <Row>
            <Col md="6">
              <h5 className="card-sub-title">{t("CheckList")}</h5>
            </Col>
          </Row>

          <CardBody>
            <Row>
              {/* <Col md={12}> */}

              <Col md="12" className="table-responsive styled-table-div">
                {attachments !== null ?
                  <Table className="table table-striped table-hover table-condensed styled-table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>{t("Name")}</th>
                        <th>{t("Exception")}</th>
                        <th>{t("Expiration")}</th>
                        <th>{t("Fecha de reposición")}</th>
                        <th>{t("Comentarios")}</th>
                        <th>{t("File")}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {attachments}
                    </tbody>
                  </Table>
                  // </Col>
                  : (
                    <Row>
                      <Col Col md={12}>
                        <div className="alert alert-info">{t("NoData")}</div>
                      </Col>
                    </Row>
                  )}

              </Col>
            </Row>


          </CardBody>

          <Row>
            <Col md="12">
              <Alert className='text-center' show={msgData.show} variant={msgData.isError ? "danger" : "success"} dismissible onClose={() => { setmsgData({ show: false, msg: "", isError: false }) }}>
                {msgData.msg}
              </Alert>
            </Col>
          </Row>
        </Card>
        {showModelAttachment ?
          <Modal size="md" isOpen={showModelAttachment} toggle={toggleShowModelAttachment} centered={true}>
            <div className="modal-header">
              <h5 className="modal-title mt-0">{t("Attach File")}</h5>
              <button
                type="button"
                onClick={toggleShowModelAttachment}
                className="close"
                data-dismiss="modal"
                aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <AvForm id="frmAttachment" className="needs-validation" onSubmit={handleSubmitfrmAttachment}>
              <div className="modal-body">
                <Row>
                  <Col md="12">
                    <div className="mb-3">
                      <Label htmlFor="name">{t("Name")}</Label>

                      <AvField
                        className="form-control"
                        type="text"
                        name="name" onChange={handleChangeInputfrm}
                        errorMessage={t("Required Field")}
                        validate={{ required: { value: !exception } }}
                      />
                    </div>
                  </Col>
                  <Col md="12">
                    <div className="mb-3">
                      <Label htmlFor="name">{t("ExpirationDate")}</Label>
                      <Flatpickr
                        id="expirationDate"
                        name="expirationDate"
                        className="form-control d-block"
                        placeholder={OPTs.FORMAT_DATE_SHOW}
                        options={{
                          dateFormat: OPTs.FORMAT_DATE,
                          //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                          //defaultDate: dataGeneral !== undefined && dataGeneral !==null ? new Date(moment(dataGeneral.issuedDate, 'YYYY-MM-DD').format()) : new Date()
                        }}
                        onChange={(selectedDates, dateStr, instance) => { handleChangeInputfrm({ target: { name: "expirationDate", value: moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD") } }) }}
                      />

                    </div>
                  </Col>
                  <Col md="12">
                    <div className="mb-3">
                      <Label htmlFor="name">{t("Exception")}</Label>
                      <AvInput type="checkbox" name="excluded" onChange={handleChangeInputChkClient} />
                    </div>
                  </Col>
                  <Col md="12">
                    <div className="mb-3">
                      <Label htmlFor="attachment">{t("File")}</Label>
                      <AvField
                        className="form-control"
                        type="file"
                        name="attachment" onChange={handleChangeInputfrm}
                        errorMessage={t("Required Field")}
                        validate={{ required: { value: !exception } }}
                        accept=".jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.pdf"
                      />

                    </div>
                  </Col>
                  {exception ?
                    <Col md="12">
                      <div className="mb-3">
                        <Label htmlFor="name">{t("Fecha de reposición")}</Label>
                        <Flatpickr
                          id="expirationDate2"
                          name="expirationDate2"
                          className="form-control d-block"
                          placeholder={OPTs.FORMAT_DATE_SHOW}
                          options={{
                            dateFormat: OPTs.FORMAT_DATE,
                            //maxDate: new Date().setFullYear(new Date().getFullYear() - 18),
                            //defaultDate: dataGeneral !== undefined && dataGeneral !==null ? new Date(moment(dataGeneral.issuedDate, 'YYYY-MM-DD').format()) : new Date()
                          }}
                          onChange={(selectedDates, dateStr, instance) => { handleChangeInputfrm({ target: { name: "expirationDate2", value: moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD") } }) }}
                        />

                      </div>
                    </Col> : null}
                  <Col md="12">
                    <div className="mb-3">
                      <Label htmlFor="attachment">{t("Comment")}</Label>
                      <AvField
                        className="form-control"
                        type="textarea"
                        name="comments"
                        id="comments"
                        rows="7"
                      />

                    </div>
                  </Col>

                </Row>
              </div>
              <div className="modal-footer">
                <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={toggleShowModelAttachment} data-dismiss="modal">
                  <i className="mdi mdi mdi-cancel mid-12px"></i> {t("Cancel")}
                </Button>

                <Button color="success" type="submit" style={{ margin: '5px' }}>
                  <i className="mdi mdi-content-save mid-12px"></i> {t("Save")}
                </Button>
              </div>
            </AvForm>

            <Row>
              <Col md="12">
                <Alert className='text-center' show={msgModal.show} variant={msgModal.isError ? "danger" : "success"} dismissible onClose={() => { setmsgModal({ show: false, msg: "", isError: false }) }}>
                  {msgModal.msg}
                </Alert>
              </Col>
            </Row>

          </Modal>
          : null}

      </LoadingOverlay>
    </React.Fragment >

  )
}

CheckList.propTypes = {
  attachmentFileInputModel: PropTypes.any
}

//export default (withTranslation()(DatosGenerales));
export default CheckList;


