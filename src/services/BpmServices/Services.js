
import TaskListPostownersModel from "../../models/BPM/TaskListPostownersModel";
import { GetDashBoardModel } from "../../models";
import ApiServiceBpm from "../ApiServiceBpm";
import * as url from "../../helpers/url_helper"
import * as opt from "../../helpers/options_helper"
import qs from "qs";
import { result } from "lodash";

import LocalStorageHelper from "../../helpers/LocalStorageHelper";

export default class Services extends ApiServiceBpm {

  /* ------------------------------------------------------------------------------------------------------------------ */
  /*                                 retorna las actividades para la bandeja de entrada                                 */
  /* ------------------------------------------------------------------------------------------------------------------ */


  //creamos un nueva instancia de proceso en BPM...    
  async createNewInstance() {
    try {
      var number = await this.startProcess(); //iniciamos una nueva instancia de proceso en BPM...    
      if (number !== null && number !== undefined && number > 0) {
        var result1 = await this.getTasksByPrcess(number);//buscamos la tarea que crea el nuevo proceso
        if (result1 !== undefined) {
          var result2 = await this.startedStatusTask(result1.taskId);//iniciamos la tarea
          if (result2 !== undefined) {
            return result1; //instanceId:result.instanceId,taskId:result.taskId,taskStatus:result.status
          }
        }
      }
    }
    catch (err) {
      console.error(err);
    }
    return undefined;
  }

  //creamos un nueva instancia de proceso de Instructivo de desembolso...    
  async createNewInstanceDisbursementInstructions() {
    try {
      var number = await this.startProcessDisbursementInstructions(); //iniciamos una nueva instancia de proceso en BPM...    
      if (number !== null && number !== undefined && number > 0) {
        var result1 = await this.getTasksByPrcess(number);//buscamos la tarea que crea el nuevo proceso
        if (result1 !== undefined) {
          //var result2 = await this.startedStatusTask(result1.taskId);//iniciamos la tarea
          //if (result2 !== undefined) {
            return result1; //instanceId:result.instanceId,taskId:result.taskId,taskStatus:result.status
          //}
        }
      }
    }
    catch (err) {
      console.error(err);
    }
    return undefined;
  }

  //retorna la bandeja de entrada
  async getDashBoard() {
    var result = await this.get(url.URL_BPM_DASHBOARD);
    return GetDashBoardModel.fromJson(result);
  }

  //retorna la bandeja de entrada
  async getDashBoard2() {

    var params = { containerId: url.WORD_BPM_CONTAINERID } //processInstanceId: processInstanceId
    var data = qs.stringify(params);

    var result = await this.get(url.URL_BPM_DASHBOARDADMIN + "?" + data);
    return GetDashBoardModel.fromJsonAdmin(result);
  }

  //Chequea e Inicializa la tarea
  async checkAndStartTask(locationData) {
    try {


      console.log("checkAndStartTask", locationData);
      await this.startedStatusTask(locationData.taskId, undefined, locationData.instanceId)
      return true;
      //chequear si la tarea no ha sido iniciada
      /*if(locationData.taskStatus === "Ready" || locationData.taskStatus === "Listo"){        
        //Iniciamos la nueva tarea en BPM   
        await this.startedStatusTask(locationData.taskId)
        return true;
      }
      else{
        return true;
      }      */
    }
    catch (err) { console.error(err) }
    return false;
  }

  //retorna las tareas de un proceso especifico
  async getTasksByPrcess(instanceId) {
    try {
      var result = await this.get(url.URL_BPM_DASHBOARD);
      result = GetDashBoardModel.fromJson(result);
      return result.filter((e) => e.instanceId === instanceId)[0];
    }
    catch (err) { console.error("getTasksByPrcess", err) }
    return undefined;
  }

  //crea e inicia una nueva instancia de Proceso y actividad
  async startProcess() {
    //Estructura de la data que se le debe pasar
    var data = {
      "containerId": url.WORD_BPM_CONTAINERID,
      "processId": url.WORD_BPM_PROCESSID,
      "parametros": {
        "values": {
          "info": "",
          "processId": opt.PROCESS_BUSQUEDADESCARTE.toString(),
          "activityId": "0",
          "transactionId": "",
          "customerId": "",
          "applicationNumber": "",
          "procedureNumber": "",
          "requestId": "",
          "facilityId": "",
          "dambientalparalelo": "",
          "decision": "",
          "id": "",
          "monto": 0,
          "status": "",
          "decicionforma": "",
          "cargo": "cargo",
          "statuscredito": "",
          "statusadm": "",
          "statusformali": "",
          "tiposolicitud": "",
          "origensolicitud": "",
          "dcreditoparalelo": "",
          "regresar": "",
          "rol": ""
        }
      }
    }

    var result = await this.post(url.URL_BPM_STARTPROCESS, data);
    /*
    {
    "body": {
        "processInstanceId": "8124",
        "containers": null,
        "response": null
    },
    "status": "CREATED",
    "businessStatus": "",
    "timeResponse": "2021-12-06 13:41:57",
    "message": null,
    "path": "/api-jbpm-0.0.1-SNAPSHOT/soaint-toolbox-eis/bpm-api/v0/processes/startProcess",
    "transactionState": null
    }
    */

    return result.body.processInstanceId;
  }

  //crea uns nueva instancia del Proceso de instructivo desembolso
  async startProcessDisbursementInstructions() {
    //Estructura de la data que se le debe pasar
    var data = {
      "containerId": url.WORD_BPM_CONTAINERID,
      "processId": url.WORD_BPM_PROCESSID_DisbursementInstructions,
      "parametros": {
        "values": {
          "info": "",
          "processId": opt.PROCESS_INSTRUCTIVEDISBURSEMENT.toString(),
          "activityId": "0",
          "transactionId": "",
          "customerId": "",
          "applicationNumber": "",
          "procedureNumber": "",
          "requestId": "",
          "facilityId": "",
          "decision": "",
          "id": "",
          "regresar": "",
        }
      }
    }

    var result = await this.post(url.URL_BPM_STARTPROCESS, data);
    /*
    {
    "body": {
        "processInstanceId": "8124",
        "containers": null,
        "response": null
    },
    "status": "CREATED",
    "businessStatus": "",
    "timeResponse": "2021-12-06 13:41:57",
    "message": null,
    "path": "/api-jbpm-0.0.1-SNAPSHOT/soaint-toolbox-eis/bpm-api/v0/processes/startProcess",
    "transactionState": null
    }
    */

    return result.body.processInstanceId;
  }

  async authentication(data) {
    var result = await this.post(url.URL_BPM_LOGIN, data);
    return result.status; //OK
  }

  async startedStatusTask(taskId, containerId = undefined, instanceId = undefined) {
    try {

      var data = {
        "containerId": containerId !== undefined ? containerId : url.WORD_BPM_CONTAINERID,
        "taskId": taskId,
        "taskStatus": url.WORD_BPM_STARTED
      }

      var result = await this.put(url.URL_BPM_STATUSTASK, data);
      console.log("startedStatusTask", result);

      if (result?.status === "OK") {
        if (instanceId !== undefined) {
          const localStorageHelper = new LocalStorageHelper();
          var credentials = localStorageHelper.get(opt.VARNAME_USRCREDENTIAL);
          var values = {
            "asignado": credentials.usr
          };
          await this.updatevariables(instanceId, values)
        }
        return result;
      }

    }
    catch (err) {
      console.error("api startedStatusTask:", err)
    }

    return undefined;
  }

  async completedStatusTask(taskId, values, containerId = undefined) {
    try {
      /* "values":{
          "decision":"si"  
      } */
      var data = {
        "containerId": containerId !== undefined ? containerId : url.WORD_BPM_CONTAINERID,
        "taskId": taskId,
        "taskStatus": url.WORD_BPM_COMPLETED,
        "parametros": {
          "values": values,
        }
      }
      var result = await this.put(url.URL_BPM_STATUSTASK, data);
      if (result.status === "OK") {
        return result;
      }

    }
    catch (err) {
      console.error("api completedStatusTask:", err)
    }

    return undefined;
  }

  async abortProcess(instanceId, containerId = undefined) {

    try {
      console.log("abortProcess", instanceId);
      //Estructura de la data que se le debe pasar
      var data = {
        "containerId": containerId !== undefined ? containerId : url.WORD_BPM_CONTAINERID,
        "processInstanceId": instanceId,
      }
      console.log("data", data);
      var result = await this.del(url.URL_BPM_ABORTPROCESS, data);

      if (result.status === "OK") {
        return result;
      }

    }
    catch (err) {
      console.error("api abortProcess:", err)
    }

    return undefined;
  }

  async updatevariables(instanceId, values, containerId = undefined) {
    try {
      /* "values":{
          "decision":"si"  
      } */
      var data = {
        "containerId": containerId !== undefined ? containerId : url.WORD_BPM_CONTAINERID,
        "processInstanceId": instanceId,
        "parametros": {
          "values": values,
        }
      }
      var result = await this.post(url.URL_BPM_UPDATEVAR, data);
      if (result.status === "OK") {
        return result;
      }

    }
    catch (err) {
      console.error("api completedStatusTask:", err)
    }

    return undefined;
  }

  //Retorna la imagen relacionada a un proceso
  async wacthprocess(processInstanceId) {
    try {

      var params = { containerId: url.WORD_BPM_CONTAINERID, processInstanceId: processInstanceId }
      var data = qs.stringify(params);

      var result = await this.get(url.URL_BPM_WATCHPROCESS + "?" + data);

      console.log("wacthprocess", result);

      return result.body.response;
    }
    catch (err) { console.error(err); }
    return undefined;
  }

  async saveAutonomy(autonomy, containerId = undefined) {
    try {
      /* "values":{
          "decision":"si"  
      } */

      const { amount: montos, tipo } = autonomy
      //"model-namespace": "https://kiegroup.org/dmn/_3B8E611A-D760-4020-9BA9-69ED1FD4DFFC"
      var data = {
        "containerId": containerId !== undefined ? containerId : url.WORD_BPM_CONTAINERID,
        //"processId": url.WORD_BPM_PROCESSID,
        "parametros": {
          "values": {
            "model-namespace": "https://kiegroup.org/dmn/_6A4C1540-4D56-4357-BDF3-3F9E81907A54",
            "model-name": "ReglaAsignacionAutonomiasduales",
            "dmn-context": { montos, tipo }
          }
        }
      }
      var result = await this.post(url.URL_BPM_checketapa, data);
      if (result.status === "OK") {
        return result;
      }

    }
    catch (err) {
      console.error("api completedStatusTask:", err);
      return undefined;
    }
  }

  async listCheckValidation(process, containerId = undefined) {
    try {
      /* "values":{
          "decision":"si"  
      } */
      var data = {
        "containerId": containerId !== undefined ? containerId : url.WORD_BPM_CONTAINERID,
        //"processId": url.WORD_BPM_PROCESSID,
        "parametros": {
          "values": {
            "model-namespace": url.URL_BPM_MODELNAMESPACE,
            "model-name": "estadoetapa",
            "dmn-context": { "numeroetapa": `${process}` }
          }
        }
      }
      var result = await this.post(url.URL_BPM_checketapa, data);
      if (result.status === "OK") {
        return result?.body?.result['dmn-evaluation-result']['dmn-context']?.resuletapa === 'true';
      }

    }
    catch (err) {
      console.error("api completedStatusTask:", err);
      return undefined;
    }
  }


  //reasignar tarea a otro usuario
  async ChangeTaskUser(user, taskId, instanceId, containerId = undefined) {
    const localStorageHelper = new LocalStorageHelper();
    var credentials = localStorageHelper.get(opt.VARNAME_USRCREDENTIAL);
    try {
      var values = {
        "asignado": user
      };
      await this.updatevariables(instanceId, values)

      var data = {
        "containerId": containerId !== undefined ? containerId : url.WORD_BPM_CONTAINERID,
        "taskId": taskId,//"10006",         
        "parametros": {
          "values": {
            "users": user,//"ETECCAnlPrevencion1" 
            "asignado": user
          }
        }
      }
      localStorageHelper.save(opt.VARNAME_USRCREDENTIAL, { usr: url.USRREASIGNACION, psw: url.PSWREASIGNACION, email: credentials.email });
      var result = await this.post(url.URL_BPM_ChangeTaskUser, data);
      if (result.status === "OK") {
        return true;
      }

      values = {
        "asignado": credentials.usr
      };
      await this.updatevariables(instanceId, values)

    }
    catch (err) { }
    finally {
      localStorageHelper.save(opt.VARNAME_USRCREDENTIAL, credentials);
    }

    return false;
  }

}
