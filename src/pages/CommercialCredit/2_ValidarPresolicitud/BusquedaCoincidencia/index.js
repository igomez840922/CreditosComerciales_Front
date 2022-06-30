import React, { useState } from "react"
import PropTypes from 'prop-types';
import { useLocation, useHistory } from 'react-router-dom'
import LoadingOverlay from 'react-loading-overlay';
import * as OPTs from "../../../../helpers/options_helper"
import * as url from "../../../../helpers/url_helper"
import {
  Card,
  CardBody,
  CardFooter,
  Button,
} from "reactstrap"
import Breadcrumbs from "../../../../components/Common/Breadcrumb"
import { withTranslation } from "react-i18next"
import SweetAlert from "react-bootstrap-sweetalert"
import FormBusqueda from "./FormBusqueda"
import FormResultados from "./FormResultados"
import FormObservaciones from "./FormObservaciones"
import FormGoogle from "./FormGoogle"
import ModalCloseOptions from "./ModalCloseOptions"
import ModalAdvanceOptions from "./ModalAdvanceOptions"
import ModalEndProcess from "../../../../components/EndProcess/ModalEndProcess";
import AttachmentFileCore from "../../../../components/Common/AttachmentFileCore";
import { BackendServices, CoreServices, BpmServices, } from "../../../../services";
import { BusquedaDescarteModel } from "../../../../models";

import { LogProcessModel } from '../../../../models/Common/LogProcessModel';
import LogProcess from "../../../../components/LogProcess/index";

import LocalStorageHelper from "../../../helpers/LocalStorageHelper";

const BandejaEntrada = props => {
  const history = useHistory();
  const location = useLocation();
  const [locationData, setLocationData] = useState(undefined);
  const [selectedData, setSelectedData] = useState(undefined);
  const [dataList, setDataList] = useState([]);
  const [displayModalGoogle, setDisplayModalGoogle] = useState(false);
  const [searchGoogleTerms, setSearchGoogleTerms] = useState([]);
  const [displayModalCloseOptions, setDisplayModalCloseOptions] = useState(false);
  const [displayModalAdvanceOptions, setDisplayModalAdvanceOptions] = useState(false);
  const [displayModalEndProcess, setDisplayModalEndProcess] = useState(false);
  const [isActiveLoading, setIsActiveLoading] = useState(false);
  const [successSave_dlg, setsuccessSave_dlg] = useState(false)
  const [error_dlg, seterror_dlg] = useState(false)
  const [error_msg, seterror_msg] = useState("")
  const [info_dlg, setinfo_dlg] = useState(false)
  const [info_msg, setinfo_msg] = useState("")

  const [localStorageHelper, setlocalStorageHelper] = useState(new LocalStorageHelper());

  //On Mounting (componentDidMount)
  React.useEffect(() => {
    if (location.data !== null && location.data !== undefined) {
      console.log("BandejaEntrada", location.data);
      setLocationData(location.data);
      initializeData(location.data);
    }
  }, []);
  //Caraga Inicial
  function initializeData(InputData) {
    if (InputData !== undefined && InputData !== null) {
      const apiBackendServices = new BackendServices();
      //var parameters = {processId:InputData.processId,transactId:InputData.transactionId,activityId:InputData.activityId}      
      apiBackendServices.consultSearchDiscard(InputData.transactionId)
        .then((data) => {
          if (data !== null && data !== undefined) {
            UpdateDataModel(data);
          }
          else {
            //Nuevo Proceso            
            data = BusquedaDescarteModel.getRequestModel();
            UpdateDataModel(data);
          }
        })
        .catch((error) => {
          console.error('api error: ', error);
        });
    }
    else {
      history.push(url.URL_DASHBOARD);
    }
  }
  function searchWhatchList(values) {
    setIsActiveLoading(true);
    const apiCoreServices = new CoreServices()
    apiCoreServices.postWhatchList(values)
      .then((data) => {
        if (data.status === 200) {
          if (data.result.length > 0) {
            setDataList(data.result);
          }
          else {
            setinfo_msg(props.t('NoResults'));
            setinfo_dlg(true)
          }
        }
        else {
          seterror_msg(props.t('ErrorCode') + ": " + data.error.errorCode + "  " + props.t('ErrorMsg') + ": " + data.error.errorCode);
          seterror_dlg(false)
        }
      })
      .catch((error) => {
      }).finally(() => {
        setIsActiveLoading(false);
      })
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  function onGoogleSearch(q) {
    setSearchGoogleTerms(q);
    setDisplayModalGoogle(!displayModalGoogle);
    removeBodyCss();
  }
  function toggleGoogleModal() {
    setDisplayModalGoogle(!displayModalGoogle);
  }
  //Modal Opciones al Salir
  function toggleModalCloseOptions() {
    setDisplayModalCloseOptions(!displayModalCloseOptions);
  }
  //Modal Para mostrar las opciones al Avanzar
  function toggleModalAdvanceOptions() {
    setDisplayModalAdvanceOptions(!displayModalAdvanceOptions);
  }
  //Modal Para mostrar Comentario de Fin de Proceso
  function toggleModalEndProcess() {
    setDisplayModalEndProcess(!displayModalEndProcess);
  }
  //Salvando el Proceso y le pasamos una opcion: 1-Finalizar Proceso, 2- Salvarlo, 3- A Cumplimmineto, 4- Avanzar a IGR
  function onSaveProcess(option) {
    if (option === OPTs.OPT_PREFINALIZARPROCESO) {
      toggleModalEndProcess();
      return;
    }

    var credentials = localStorageHelper.get(OPTs.VARNAME_USRCREDENTIAL);

    selectedData.instanceId = locationData.instanceId !== null && locationData.instanceId !== undefined ? locationData.instanceId : selectedData.instanceId;
    selectedData.customerId = locationData.customerId !== null && locationData.customerId !== undefined ? locationData.customerId : selectedData.customerId;
    selectedData.responsible = credentials?.usr ?? "admin";
    const apiBackendServices = new BackendServices();
    //Guardar el usuario prospecto    
    apiBackendServices.saveProspectUser(selectedData)
      .then((userData) => {
        if (userData !== undefined) {
          selectedData.transactId = userData.transactId !== null && userData.transactId !== undefined ? userData.transactId : selectedData.transactId;
          selectedData.customerId = userData.customerId !== null && userData.customerId !== undefined ? userData.customerId : selectedData.customerId;
          selectedData.compliance = option === OPTs.OPT_ENVIARCUMPLIMIENTO ? true : false;
          UpdateDataModel(selectedData);
          //Guardar busqueda y descarte
          apiBackendServices.saveSearchDiscard(selectedData)
            .then((descarteData) => {
              if (descarteData !== undefined) {
                saveJBPMProcess(option);
              }
              else {
                //Mensaje ERROR
                seterror_msg(props.t("ErrorSaveMessage"))
                seterror_dlg(false)
              }
            })
            .catch((error) => {
            });
        }
        else {
          //Mensaje ERROR
          seterror_msg(props.t("ErrorSaveMessage"))
          seterror_dlg(false)
        }
      })
      .catch((error) => {
      });
  }
  function saveJBPMProcess(option) {
    const apiBpmServices = new BpmServices();
    switch (option) {
      case OPTs.PROCESS_CANCELPROCESS: {
        apiBpmServices.abortProcess(locationData.instanceId)
          .then((data) => {
            if (data !== undefined) {
              history.push(url.URL_DASHBOARD);
            }
            else {
              //Mensaje ERROR
              seterror_msg(props.t("TheProcessCouldNotFinish"))
              seterror_dlg(false)
            }
          });
        break;
      }
      case OPTs.OPT_SALVAPARCIAL: {
        var values = {
          "processId": OPTs.PROCESS_BUSQUEDADESCARTE.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": selectedData.transactId.toString(),
          "customerId": selectedData.customerId.toString(),
          "applicationNumber": "",
          "procedureNumber": "",
          //"decision":"no"          
        };
        apiBpmServices.updatevariables(locationData.instanceId, values)
          .then((data) => {
            if (data !== undefined) {
              setsuccessSave_dlg(true);
            }
            else {
              //Mensaje ERROR
              seterror_msg(props.t("ErrorSaveMessage"))
              seterror_dlg(false)
            }
          });

        break;
      }
      case OPTs.OPT_ENVIARCUMPLIMIENTO: {

        var values = {
          "processId": OPTs.PROCESS_CUMPLIMIENTO.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": selectedData.transactId.toString(),
          "customerId": selectedData.customerId.toString(),
          "applicationNumber": "",
          "procedureNumber": "",
          "decision": "si"
        };
        apiBpmServices.completedStatusTask(locationData.taskId, values)
          .then((data) => {
            if (data !== undefined) {
              setsuccessSave_dlg(true);
            }
            else {
              //Mensaje ERROR
              seterror_msg(props.t("ErrorSaveMessage"))
              seterror_dlg(false)
            }
          });

        break;
      }
      case OPTs.OPT_LISTAEXCLUSION: {
        var values = {
          "processId": OPTs.PROCESS_LISTAEXCLUSION.toString(),
          "activityId": OPTs.ACT_NONE.toString(),
          "transactionId": selectedData.transactId.toString(),
          "customerId": selectedData.customerId.toString(),
          "applicationNumber": "",
          "procedureNumber": "",
          "decision": "no"
        };
        apiBpmServices.completedStatusTask(locationData.taskId, values)
          .then((data) => {
            if (data !== undefined) {
              setsuccessSave_dlg(true);
            }
            else {
              //Mensaje ERROR
              seterror_msg(props.t("ErrorSaveMessage"))
              seterror_dlg(false)
            }
          });
        break;
      }
    }
  }
  //salvar comentario de end process
  function onSaveEndProcess(values) {
    //Salvar los comentarios en Bitacora    
    selectedData.endProcessComment = values.txtComment;
    UpdateDataModel(selectedData);
    onSaveProcess(OPTs.OPT_FINALIZARPROCESO);
  }
  //Actualizamos El Modelo de Datos segun va cambiando
  function UpdateDataModel(data) {
    setSelectedData(data);
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title={props.t("CommercialCredit")} breadcrumbItem={props.t("SearchDiscard")} />
        <LoadingOverlay active={isActiveLoading} spinner text={props.t("WaitingPlease")}>
          <Card>
            <CardBody>
              <FormBusqueda onSubmit={searchWhatchList} onGoogleSearch={onGoogleSearch} selectedData={selectedData} updateDataModel={UpdateDataModel} />
              {dataList.length > 0 && (
                <FormResultados results={dataList} onScreenOption={props.onScreenOption} />
              )}
              <FormObservaciones selectedData={selectedData} updateDataModel={UpdateDataModel} />
              {
                (locationData !== undefined) ?
                  (<AttachmentFileCore locationData={{ instanceId: locationData.instanceId, processId: OPTs.PROCESS_BUSQUEDADESCARTE, activityId: OPTs.ACT_NONE }} />)
                  : null
              }
            </CardBody>
            <CardFooter style={{ textAlign: "right" }}>
              <Button color="danger" style={{ margin: '5px 0px' }} type="button" onClick={() => { toggleModalCloseOptions() }}><i className="mdi mdi-arrow-left-bold-circle-outline mid-12px"></i> {props.t("Exit")}</Button>
              <Button color="success" type="button" onClick={() => { toggleModalAdvanceOptions() }}><i className="mdi mdi-arrow-right-bold-circle-outline mid-12px"></i> {props.t("Advance")}</Button>
            </CardFooter>
          </Card>

          {locationData ?
            <LogProcess logProcessModel={new LogProcessModel(locationData.instanceId, locationData.transactionId, 0, "", "", OPTs.PROCESS_BUSQUEDADESCARTE, OPTs.ACT_NONE, OPTs.BPM_ACTIVITY_01)} />
            : null}

        </LoadingOverlay>
        <FormGoogle searchGoogleTerms={searchGoogleTerms} isOpen={displayModalGoogle} toggle={() => { toggleGoogleModal() }} />
        <ModalCloseOptions onSaveProcess={onSaveProcess} isOpen={displayModalCloseOptions} toggle={() => { toggleModalCloseOptions() }} />
        <ModalAdvanceOptions onSaveProcess={onSaveProcess} isOpen={displayModalAdvanceOptions} toggle={() => { toggleModalAdvanceOptions() }} />
        <ModalEndProcess onSaveEndProcess={onSaveEndProcess} isOpen={displayModalEndProcess} toggle={() => { toggleModalEndProcess() }} />
        {successSave_dlg ? (
          <SweetAlert
            success
            title={props.t("SuccessDialog")}
            confirmButtonText={props.t("Confirm")}
            cancelButtonText={props.t("Cancel")}
            onConfirm={() => {
              setsuccessSave_dlg(false)
              history.push(url.URL_DASHBOARD);
            }}
          >
            {props.t("SuccessSaveMessage")}
          </SweetAlert>
        ) : null}

        {error_dlg ? (
          <SweetAlert
            error
            title={props.t("ErrorDialog")}
            confirmButtonText={props.t("Confirm")}
            cancelButtonText={props.t("Cancel")}
            onConfirm={() => {
              seterror_dlg(false)
            }}
          >
            {error_msg}
          </SweetAlert>
        ) : null}

        {info_dlg ? (
          <SweetAlert
            info
            title={props.t("SuccessDialog")}
            confirmButtonText={props.t("Confirm")}
            cancelButtonText={props.t("Cancel")}
            onConfirm={() => {
              setinfo_dlg(false)
            }}
          >
            {info_msg}
          </SweetAlert>
        ) : null}
      </div>
    </React.Fragment>
  )
}
export default (withTranslation()(BandejaEntrada))
