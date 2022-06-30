import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'
import { useLocation, useHistory } from 'react-router-dom'

import moment from "moment";

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

import { AvForm, AvField } from "availity-reactstrap-validation"
import { Link } from "react-router-dom"
import DocumentModel from "../../models/Core/DocumentModel";
import DocumentoAnexoModel from "../../models/Backend/DocumentoAnexoModel";
import functionshelper from "../../helpers/functions_helper"
import LoadingOverlay from 'react-loading-overlay';

import { CoreServices, BackendServices } from '../../services';
import Alert from 'react-bootstrap/Alert'

const AttachmentFileCore = (props) => {

  const { t, i18n } = useTranslation();

  const { attachmentFileInputModel } = props;

  const [showModelAttachment, setShowModelAttachment] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isActiveLoading, setIsActiveLoading] = useState(false);
  const [fileData, setfileData] = useState({});
  const [mainPerson, setmainPerson] = useState(undefined);

  //Servicios
  const [backendServices, setbackendServices] = useState(new BackendServices());
  const [coreServices, setcoreServices] = useState(new CoreServices());

  const [msgData, setmsgData] = useState({ show: false, msg: "", isError: false });

  const [msgModal, setmsgModal] = useState({ show: false, msg: "", isError: false });

  //On Mounting (componentDidMount) if selectedData has changes
  React.useEffect(() => {
    if (attachmentFileInputModel !== undefined && attachmentFileInputModel !== null) {
      getPerson();
      updateAttachments();
    }
  }, [attachmentFileInputModel]);


  async function getPerson() {
    if (attachmentFileInputModel.personId > 0) {
      var result = await backendServices.consultarListaPersonaSolicitud(attachmentFileInputModel.transactId);
      if (result !== null) {
        var person = result.find(x => x.personId === attachmentFileInputModel.personId);
        if (person !== undefined) {
          setmainPerson(person);
        }
      }
    }
  }

  //abrimos modal para adjunar archivos
  function toggleShowModelAttachment() {
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

  //GUARDAR ADJUNTO
  function addAttachment(filedata) {

    setIsActiveLoading(true);

    try {
      //GUARDAR EN GESTOR DOCUMENTAL ONBASE
      //filedata.name, filedata.description, filedata.fileName, filedata.fileExtension, filedata.fileBase64 
      var clientName = mainPerson !== undefined ? (mainPerson.name + mainPerson.secondName + mainPerson.lastName + mainPerson.secondSurname) : "Attachment";
      var clientNumber = mainPerson !== undefined ? (mainPerson.customerNumberT24) : attachmentFileInputModel.transactId.toString();
      var clientType = mainPerson !== undefined && mainPerson.personType !== "1" ? "J" : "N";
      var identification = mainPerson !== undefined && mainPerson.clientDocumentId.length > 0 ? mainPerson.clientDocumentId : attachmentFileInputModel.transactId.toString();
      var data = {
        ApplicationNumber: attachmentFileInputModel.transactId,
        ClientName: clientName.trim(),
        ClientNumber: clientNumber.trim(),//"98765432",
        ClientType: clientType,//"N",
        DocumentTypeId: "1067",
        ExpirationDate: moment().format("DD/MM/YYYY"),
        FileExtension: filedata.fileExtension,
        Identification: identification.trim(),//"9-728-1643",
        ImageBase64: filedata.fileBase64,
        ProcessCode: attachmentFileInputModel.processId,//"7",
        Token: attachmentFileInputModel.transactId + attachmentFileInputModel.processId + attachmentFileInputModel.activityId,//"34543",
        UploadDate: moment().format("DD/MM/YYYY"),
        //ProductNumber:"456"
      };
      coreServices.postDocument(data).then((resultCore) => {

        filedata['transactId'] = attachmentFileInputModel.transactId;
        filedata['processId'] = attachmentFileInputModel.processId;
        filedata['activityId'] = attachmentFileInputModel.activityId;
        filedata['personId'] = attachmentFileInputModel.personId;
        filedata['documentId'] = resultCore.documentId;
        filedata['docName'] = resultCore.docName;

        ////GUARDAR EN BD ////
        data = DocumentoAnexoModel.getSaveModel(filedata);

        backendServices.saveAttachmentDocument(data).then((resultBackend) => {

          if (resultBackend) {
            // SI TODO OK ACTUALIZAR LA LISTA DE ADJUNTOS
            updateAttachments();
          }
        })
          .catch((error) => {
            showMessage(t("Error") + " " + error.message, true);
          })
          .finally(() => { setIsActiveLoading(false); });
      })
        .catch((error) => {
          showMessage(t("Error") + " " + error.message, true);
        })
        .finally(() => { setIsActiveLoading(false); });

    }
    catch (error) { setIsActiveLoading(false); console.error(error.message) }
  }

  //BORRAR ADJUNTO
  function removeAttachment(data) {

    //BORRAR EN GESTOR DOCUMENTAL ONBASE

    ////BORRAR EN BD 
    // data = { transactId: data.transactId, onBaseIdentification: data.onBaseIdentification };
    backendServices.deleteAttachmentDocument(data.transactId, data.onBaseIdentification).then((resultBackend) => {

      if (resultBackend) {
        // SI TODO OK ACTUALIZAR LA LISTA DE ADJUNTOS
        updateAttachments();
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
      if (resultCore !== null) {
        window.open(resultCore, "_blank")
      }
    }).catch((error) => { console.error('api error', error); })
      .finally(() => { setIsActiveLoading(false); });
  }

  //ACTUALIZAR LISTA DE ADJUNTOS
  function updateAttachments() {

    backendServices.getAttachmentDocumentByPerson(attachmentFileInputModel).then((data) => {
      setAttachments(data);
    })
      .catch((error) => { console.error('api error', error); })
      .finally(() => { });
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

    if (fileData['fileName'] === undefined) {
      return;
    }

    addAttachment(fileData);
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
    }
    console.log("fileData", fileData)
    setfileData(fileData);
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



        <Row>
          <Col md="6">
            <h5 className="card-sub-title">{t("Attach File")}</h5>
          </Col>
          {!props.preview && <Col md={6} style={{ textAlign: "right", }}>
            <Button className="btn" color="success" type="button" style={{ margin: '5px' }} onClick={() => { toggleShowModelAttachment() }} title={t("Add")}><i className="fas fa-lg fa-plus-circle"></i> {(" ")}</Button>

          </Col>}
        </Row>

        <div className='table-responsive styled-table-div'>
          <Table className="table table-striped table-hover styled-table table">
            <thead>
              <tr>
                <th>{t("Name")}</th>
                <th>{t("Description")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {attachments !== null && attachments !== undefined && attachments.length > 0 ?
                (attachments.map((data) => (
                  <tr key={data.documentIdentification}>
                    <td>{data.fileName}</td>
                    <td>{data.fileDescription}</td>
                    <td style={{ textAlign: "right" }}>
                      <Link to="#" title={t("View")} onClick={() => viewAttachment(data.onBaseIdentification)}><i className="mdi mdi-file-search-outline mdi-24px"></i></Link>
                      {!props.preview && <Link to="#" title={t("Delete")} onClick={() => removeAttachment(data)}><i className="mdi mdi-trash-can-outline mdi-24px"></i></Link>}
                    </td>
                  </tr>
                ))) :
                <tr>
                  <td colSpan={7}>
                    <div className="alert alert-info" style={{ textAlign: "center" }}>{t("NoData")}</div>
                  </td>
                </tr>
              }
            </tbody>
          </Table>

        </div>

        <Row>
          <Col md="12">
            <Alert className='text-center' show={msgData.show} variant={msgData.isError ? "danger" : "success"} dismissible onClose={() => { setmsgData({ show: false, msg: "", isError: false }) }}>
              {msgData.msg}
            </Alert>
          </Col>
        </Row>

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
                      validate={{ required: { value: true } }}
                    />
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
                      validate={{ required: { value: true } }}
                      accept=".jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.pdf"
                    />

                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <div className="mb-3">
                    <Label htmlFor="description">{t("Description")}</Label>
                    <AvField
                      className="form-control"
                      type="textarea"
                      name="description"
                      maxLength="1000"
                      rows="7"
                      onChange={handleChangeInputfrm}
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
      </LoadingOverlay>
    </React.Fragment>

  )
}

AttachmentFileCore.propTypes = {
  attachmentFileInputModel: PropTypes.any,
}

//export default (withTranslation()(DatosGenerales));
export default AttachmentFileCore;


