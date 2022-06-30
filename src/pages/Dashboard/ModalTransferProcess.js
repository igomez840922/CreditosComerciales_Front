import React, { useState } from "react"
import { useLocation, useHistory, Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { useTranslation } from "react-i18next";
import * as OPTs from "../../helpers/options_helper"
import * as url from "../../helpers/url_helper"
import moment from "moment";
import { InfoBpmModel } from '../../models/Common/InfoBpmModel';

import {
    Row,
    Col,
    Card,
    CardBody,
    CardFooter,
    Button,
    Label,
    Table,
  Modal,
} from "reactstrap"

import { AvForm, AvField, AvGroup, AvInput, AvCheckbox } from "availity-reactstrap-validation";
import Select from "react-select";
import { BackendServices, CoreServices, BpmServices } from "../../services";
import * as opt from "../../helpers/options_helper"
import LocalStorageHelper from "../../helpers/LocalStorageHelper";

const ModalTransferProcess = props => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const history = useHistory();

  //Servicios
  const [backendServices, setbackendServices] = useState(new BackendServices());
  const [coreServices, setcoreServices] = useState(new CoreServices());
  const [bpmServices, setbpmServices] = useState(new BpmServices());
  const [usersByGroupList, setusersByGroupList] = useState([]);
  const [usersByGroupSelected, setusersByGroupSelected] = useState(undefined);
  const localStorageHelper = new LocalStorageHelper();
    
  React.useEffect(() => {
    loadUserGroups();
  }, [props.data]);
  

  //cargar lista de tipo de personas
  function loadUserGroups() {

    if(props.data === undefined || props.data === null){
      return;
    }
    if(props.data.data === undefined || props.data.data === null){
      return;
    }

    console.log("loadUserGroups",props.data.data)
    backendServices.getUsersByGroup(props.data.data.grupoldap)
      .then((data) => {
        if (data !== null && data.result !== undefined) {
          let json = [];
          for (let i = 0; i < data.result.length; i++) {
            json.push({ label: data.result[i]["userName"], value: data.result[i]["userName"] })
          }
          console.log("getUsersByGroup",json);
          setusersByGroupList(json);
          setusersByGroupSelected(json[0]);
        }
      }).catch((error) => { });
  }

  //Guardar el Cliente
  async function handleSubmitFormClient(event, errors, values) {    
    event.preventDefault();
    if (errors.length > 0) {
      return;
    }
    console.log("handleSubmitFormClient", values);

    /*var result = await bpmServices.ChangeTaskUser(usersByGroupSelected.value,props.data.taskId,props.data.instanceId);
    if(result){
      props.updateData();
    }*/
    var credentials = localStorageHelper.get(opt.VARNAME_USRCREDENTIAL);

    if(usersByGroupSelected){
      if(credentials && credentials.isAnalysisSupervisor){

        bpmServices.checkAndStartTask(props.data)
        .then((iniresult) => {
          
          saveJBPMProcess(OPTs.PROCESS_ANALISISCREDITO);
        props.updateData();
        props.toggle();

        })
      
    }
    }
  }

  async function saveJBPMProcess(option) {
    var maindebtor = await backendServices.consultPrincipalDebtor(props.data.transactionId)
    var infoBpmModel = new InfoBpmModel(
      props.data.infoBpmModel?.instanceId ?? props.data.instanceId,
      props.data.infoBpmModel?.transactId ?? props.data.transactionId,
      0, 0,
      maindebtor?.personId
    );
    infoBpmModel.personName = maindebtor !== undefined ? (maindebtor.typePerson == "2" ? maindebtor.name : (maindebtor.name + " " + maindebtor.name2 + " " + maindebtor.lastName + " " + maindebtor.lastName2)) : "";
    infoBpmModel.toprocess = 0;//props.data.infobpm.toprocess;

    switch (option) {
      case OPTs.PROCESS_ANALISISCREDITO: { //Enviar a Analisis de Credito
        infoBpmModel.processId = OPTs.PROCESS_ANALISISCREDITO;
        infoBpmModel.activityId = OPTs.ACT_NONE;

           var values = {
              "info": JSON.stringify(infoBpmModel),
              "processId": OPTs.PROCESS_ANALISISCREDITO.toString(),
              "activityId": OPTs.ACT_NONE.toString(),
              "transactionId": props.data.transactionId,
              "requestId": props.data.requestId,
              //"decision": "si",
              //"tiposolicitud": "si", //flujo normal (no es devolucion)
              "id": props.data.instanceId,
              "analista": usersByGroupSelected.value              //autonomy.banca
            };
        bpmServices.completedStatusTask(props.data.taskId, values)
          .then((data) => {
            if (data !== undefined) {

              //saveAutoLog(null, null);
              history.push(url.URL_DASHBOARD);
            }
            else {
              //Mensaje ERROR
              //seterror_msg(t("ErrorSaveMessage"));
              // seterror_dlg(false);
            }
          });

        break;
      }      
      
      default:
        break;
    }
  }


  return (
    <React.Fragment key="mcf1">
    <Modal
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}>
      <div className="modal-header">
        <h5 className="modal-title mt-0">{t("Transferir Trámite")}</h5>
        <button
          type="button"
          onClick={props.toggle}
          className="close"
          data-dismiss="modal"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div key="TransferForm" className="modal-body">

      
      <AvForm id="frmClient" className="needs-validation" onSubmit={handleSubmitFormClient}>
       
          {/*<h5 className="card-sub-title">{t("Seleccionar Usuario")}</h5>*/}
          <CardBody>
            <Row>
             
             <Col md="12">
                <div className="mb-3">
                  <Label htmlFor="userSelected">{t("Seleccionar Usuario")}</Label>
                  <Select noOptionsMessage={() => ""}
                    onChange={(e) => { setusersByGroupSelected(usersByGroupList.find(x => x.value === e.value));  }} //handleSubmitFormClient({ target: { name: 'usersSelected', value: e.value } })
                    options={usersByGroupList}
                    classNamePrefix="select2-selection"
                    value={usersByGroupSelected}
                    name="userSelected"
                  />
                </div>
              </Col>
              
              {/*<Col md="6">
                <div className="mb-3">
                  <Label htmlFor="transferto">{t("Seleccionar Usuario")}</Label>
                  <AvField className="form-control"
                    name="transferTo" type="text" />
                </div>
              </Col>*/}
            </Row>
           
          </CardBody>
          <CardFooter style={{ textAlign: "right" }}>
            <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={props.toggle}>
              <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
            </Button>
            <Button color="success" type="submit" style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
              {" "}{t("Save")}
            </Button>
          </CardFooter>
       
      </AvForm>
      
      </div>
    </Modal>
</React.Fragment>
  );
};

ModalTransferProcess.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onCancel:PropTypes.func,
  data:PropTypes.any,
  updateData: PropTypes.func,
}

export default ModalTransferProcess;
