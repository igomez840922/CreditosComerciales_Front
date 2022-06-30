import { useTranslation } from 'react-i18next'
import { Link } from "react-router-dom";
import { translationHelpers } from '../../helpers';

import * as opt from "../../helpers/options_helper";
export default class GetDashBoardModel {

  static results = [];
  static fromJson(json) {

    this.results = [];
    this.searchValue("tasks", json);
    const items = new GetDashBoardModel();
    items.results = this.results;

    return items.results;
  }

  static searchValue(mainkey, json) {
    const [t, c] = translationHelpers('translation', 'common');

    const jsonPrioridad = [
      { value: "1", label: "Muy Urgente" },
      { value: "2", label: "Urgencia Moderada" },
      { value: "3", label: "Importante" },
      { value: "4", label: "Baja Urgencia" },
      { value: "5", label: "Sin Urgencia" }]
    try {
      for (let [key, value] of Object.entries(json)) {
        if (value !== null && value !== undefined) {
          if (typeof value === "object") {
            if (key !== mainkey) {
              this.searchValue(mainkey, value);
            } else {
              switch (key) {
                case "tasks": {
                  for (var i = 0; i < value.length; i++) {
                    /* ------------------------------------------------------------------------------------------------------------------ */
                    /*                                 Convertimos la fecha de milisegundos a fecha normal                                */
                    /* ------------------------------------------------------------------------------------------------------------------ */
                    //let date = new Date(value[i]['task-activation-time']["java.util.Date"]);
                    /* ------------------------------------------------------------------------------------------------------------------ */
                    /*                                   Se arma el json que se le va a dar al dataTable                                  */
                    /* ------------------------------------------------------------------------------------------------------------------ */

                    if (value[i]["variables"]["asignado"] !== undefined && value[i]["variables"]["asignado"] !== null && value[i]["variables"]["asignado"].length > 0) {
                      console.log("dashboardItem", value[i]);
                    }

                    var infobpm = value[i]["variables"]["info"];
                    if (infobpm !== undefined && infobpm.length > 5) {
                      infobpm = JSON.parse(infobpm);
                      infobpm.priority = infobpm?.priority ?? 0;
                      value[i]["variables"]["processId"] = infobpm.processId.toString();
                      value[i]["variables"]["activityId"] = infobpm.activityId.toString();
                      //value[i]["variables"]["processId"] = infobpm.instanceId.toString();
                      value[i]["variables"]["transactionId"] = infobpm.transactId.toString();
                    }
                    else {
                      infobpm = null;
                    }
                    //infobpm["taskProcDefId"] = value[i]["taskProcDefId"];
                    //infobpm["containerId"] = value[i]["containerId"];

                    var pathname = "/creditocomercial/presolicitud";
                    switch (value[i]["variables"]["processId"]) {
                      case opt.PROCESS_BUSQUEDADESCARTE.toString(): {
                        pathname = '/creditocomercial/presolicitud';
                        break;
                      }
                      case opt.PROCESS_CUMPLIMIENTO.toString(): {
                        pathname = "/creditocomercial/descartarcoincidencia";
                        break;
                      }
                      case opt.PROCESS_LISTAEXCLUSION.toString(): {
                        pathname = "/creditocomercial/listaexclusion";
                        break;
                      }
                      case opt.PROCESS_INFORMEGESTION.toString(): {
                        pathname = "/creditocomercial/informegestion";
                        break;
                      }
                      case opt.PROCESS_PROPUESTACREDITO.toString(): {
                        pathname = "/creditocomercial/propuestacredito";
                        break;
                      }
                      case opt.PROCESS_ANALISISCREDITO.toString(): {
                        pathname = "/creditocomercial/analisiscredito";
                        break;
                      }
                      case opt.PROCESS_INFORMEFINANCIERO.toString(): {
                        pathname = "/creditocomercial/analisiscredito/informefinanciero";
                        break;
                      }
                      case opt.PROCESS_SUPERVISORANALISISCREDITO.toString(): {
                        pathname = "/creditocomercial/supervisoranalisiscredito";
                        break;
                      }
                      case opt.PROCESS_CREDITRISK.toString(): {
                        pathname = "/creditocomercial/riesgocredito";
                        break;
                      }
                      case opt.PROCESS_AUTONOMY.toString(): {
                        pathname = "/creditocomercial/autonomiabanca";
                        break;
                      }
                      case opt.PROCESS_AUTONOMYCREDIT.toString(): {
                        pathname = "/creditocomercial/autonomiacredito";
                        break;
                      }
                      case opt.PROCESS_ACEPTACIONCLIENTE.toString(): {
                        pathname = "/creditocomercial/aceptacioncliente";
                        break;
                      }
                      case opt.PROCESS_ASIGNARNUMFIDEICOMISO.toString(): {
                        pathname = "/creditocomercial/fideicomiso/asignarnumero";
                        break;
                      }
                      case opt.PROCESS_DATOSFIDEICOMISO.toString(): {
                        pathname = "/creditocomercial/fideicomiso/relacionfiduciaria";
                        break;
                      }
                      case opt.PROCESS_DOCUMENTACIONLEGAL.toString(): {
                        pathname = "/creditocomercial/documentacionlegal";
                        break;
                      }
                      case opt.PROCESS_LAWEYER.toString(): {
                        pathname = "/creditocomercial/abogado";
                        break;
                      }
                      case opt.PROCESS_SIGNCONTRACT.toString(): {
                        pathname = "/creditocomercial/firmarcontrato";
                        break;
                      }
                      case opt.PROCESS_INSTRUCTIVEDISBURSEMENT.toString():
                      case "22":
                      case "23":
                      case "450": {
                        pathname = "/creditocomercial/instructivodesembolso";
                        break;
                      }
                      case opt.PROCESS_ADMINDISBURSEMENT.toString(): {
                        pathname = "/creditocomercial/administracion";
                        break;
                      }
                      case opt.PROCESS_GUARANTEE.toString(): {
                        pathname = "/creditocomercial/garantias";
                        break;
                      }
                      case opt.PROCESS_VALIDATEFILE.toString(): {
                        pathname = "/creditocomercial/centroarchivo";
                        break;
                      }
                      case opt.PROCESS_LEGACYEXPENSE.toString(): {
                        pathname = "/creditocomercial/gastoslegales";
                        break;
                      }
                      case opt.PROCESS_EXECUTEDISBURSEMENT.toString(): {
                        pathname = "/creditocomercial/ejecutarinstructivodesembolso";
                        break;
                      }
                    }

                    if (value[i]["taskName"].indexOf('Emitir opinión de Riesgo Ambiental y Social') >= 0) {
                      pathname = "/creditocomercial/riesgoambiental";
                    }
                    if (value[i]["taskName"].indexOf('Emitir Opinión de Riesgo de Crédito') >= 0) {
                      pathname = "/creditocomercial/riesgocredito";
                    }

                    //pathname = "/creditocomercial/autonomiacredito";
                    // pathname = "/creditocomercial/supervisoranalisiscredito";
                    // pathname = "/creditocomercial/analisiscredito";
                    // pathname = "/creditocomercial/supervisoranalisiscredito";
                    // pathname = "/creditocomercial/instructivodesembolso";
                    // pathname = "/creditocomercial/propuestacredito";
                    //pathname = "/creditocomercial/analisiscredito";
                    //pathname = "/creditocomercial/fideicomiso/asignarnumero";
                    //pathname = "/creditocomercial/fideicomiso/relacionfiduciaria";
                    // pathname = "/creditocomercial/garantias";
                    //pathname = "/creditocomercial/desembolso";
                    // pathname = "/creditocomercial/documentacionlegal";
                    // pathname = "/creditocomercial/supervisoranalisiscredito";
                    //pathname = "/creditocomercial/aceptacioncliente";
                    // pathname = "/creditocomercial/aceptacioncliente";
                    // pathname = "/creditocomercial/analisiscredito";
                    // pathname = "/creditocomercial/analisiscredito/informefinanciero";
                    // pathname = "/creditocomercial/propuestacredito";
                    // pathname = "/creditocomercial/propuestacredito";
                    //pathname = "/creditocomercial/firmarcontrato";
                    // pathname = "/creditocomercial/abogado";
                    // pathname = "/creditocomercial/riesgoambiental";
                    // pathname = "/creditocomercial/supervisoranalisiscredito";
                    //pathname = "/creditocomercial/analisiscredito";
                    // pathname = "/creditocomercial/administracion";
                    // pathname = "/creditocomercial/supervisoranalisiscredito";
                    // pathname = "/creditocomercial/analisiscredito/informefinanciero";
                    // pathname = "/creditocomercial/documentacionlegal";
                    // pathname = "/creditocomercial/aceptacioncliente";
                    //pathname = "/creditocomercial/instructivodesembolso";
                    // pathname = "/creditocomercial/riesgoambiental";
                    // pathname = "/creditocomercial/garantias";
                    //pathname = "/creditocomercial/fideicomiso/asignarnumero";  
                    // pathname = "/creditocomercial/autonomiacredito";
                    // pathname = "/creditocomercial/supervisoranalisiscredito";
                    //pathname = "/creditocomercial/administracion";
                    //pathname = "/creditocomercial/fideicomiso/relacionfiduciaria";

                    // pathname = "/creditocomercial/analisiscredito";
                    // pathname = "/creditocomercial/supervisoranalisiscredito";
                    //pathname = "/creditocomercial/informegestion";
                    //pathname = "/creditocomercial/garantias";
                    // pathname = "/creditocomercial/propuestacredito";
                    // pathname = "/creditocomercial/autonomiacredito";
                    // pathname = "/creditocomercial/supervisoranalisiscredito";
                    // pathname = "/creditocomercial/riesgoambiental";
                    // pathname = "/creditocomercial/analisiscredito";
                    //  pathname = "/creditocomercial/garantias";
                    // pathname = "/creditocomercial/fideicomiso/asignarnumero";
                    //pathname = "/creditocomercial/administracion";
                    //pathname = "/creditocomercial/fideicomiso/relacionfiduciaria";
                    // pathname = "/creditocomercial/garantias";
                    // pathname = "/creditocomercial/analisiscredito";
                    // pathname = "/creditocomercial/supervisoranalisiscredito";
                    // pathname = "/creditocomercial/informegestion";
                    // pathname = "/creditocomercial/propuestacredito";
                    // pathname = "/creditocomercial/informegestion";
                    // pathname = "/creditocomercial/analisiscredito";
                    // pathname = "/creditocomercial/riesgoambiental";
                    // pathname = "/creditocomercial/autonomiacredito";
                    // pathname = "/creditocomercial/supervisoranalisiscredito";
                    //pathname = "/creditocomercial/administracion";
                    // pathname = "/creditocomercial/garantias";
                    //pathname = "/creditocomercial/fideicomiso/asignarnumero";
                    // pathname = "/creditocomercial/garantias";
                    // pathname = "/creditocomercial/analisiscredito";
                    // pathname = "/creditocomercial/supervisoranalisiscredito";
                    // pathname = "/creditocomercial/garantias";
                    // pathname = "/creditocomercial/analisiscredito";
                    // pathname = "/creditocomercial/supervisoranalisiscredito";
                    // pathname = "/creditocomercial/garantias";
                    // pathname = "/creditocomercial/analisiscredito";
                    // pathname = "/creditocomercial/supervisoranalisiscredito";
                    // pathname = "/creditocomercial/garantias";
                    // pathname = "/creditocomercial/analisiscredito";
                    // pathname = "/creditocomercial/supervisoranalisiscredito";
                    // pathname = "/creditocomercial/propuestacredito";
                    // pathname = "/creditocomercial/aceptacioncliente";
                    // pathname = "/creditocomercial/analisiscredito";
                    // pathname = "/creditocomercial/analisiscredito";
                    // pathname = "/creditocomercial/instructivodesembolso";
                    //pathname = "/creditocomercial/riesgoambiental";
                    // pathname = "/creditocomercial/garantias";
                    //pathname = "/creditocomercial/fideicomiso/asignarnumero";  
                    // pathname = "/creditocomercial/autonomiacredito";
                    // pathname = "/creditocomercial/supervisoranalisiscredito";
                    //pathname = "/creditocomercial/administracion";
                    // pathname = "/creditocomercial/fideicomiso/relacionfiduciaria";
                    // pathname = "/creditocomercial/analisiscredito";
                    // pathname = "/creditocomercial/supervisoranalisi  scredito";
                    let trafficLight = value[i].variables?.sla?.result['dmn-evaluation-result']['dmn-context']?.color;
                    let sla = trafficLight && (<div className="trafficLight"><label>{`${value[i].taskActivationTime} ${value[i].taskActivationTime === '1' ? t("day") : t("days")}`}</label><div className={trafficLight?.toLocaleLowerCase() === 'verde' ? 'Green' : (trafficLight?.toLocaleLowerCase() === 'amarillo' ? 'Yellow' : (trafficLight?.toLocaleLowerCase() === 'rojo' ? 'Red' : (trafficLight?.toLocaleLowerCase() === 'naranja' ? 'Orange' : '')))}></div></div>);
                    this.results.push({
                      uniqueData: i + "",
                      personName: infobpm?.personName ?? "",
                      priority: infobpm?.priority ?? 0,
                      priorityName: jsonPrioridad.find(x => x.value == infobpm?.priority)?.label ?? "Sin urgencia",
                      date: value[i]["taskCreatedOn"],
                      taskId: value[i]["taskId"], // BPM Id de la tarea
                      instanceId: value[i]["instanceId"],// BPM Id del Proceso
                      procedureNumber: value[i]["variables"]["procedureNumber"],//value[i]["task-proc-inst-id"],
                      applicationNumber: value[i]["variables"]["applicationNumber"],//value[i]["taskId"],
                      transactionId: value[i]["variables"]["transactionId"],//value[i]["taskId"],
                      facilityTypeId: value[i]["variables"]["facilityTypeId"] !== undefined ? value[i]["variables"]["facilityTypeId"] : "",
                      activityId: value[i]["variables"]["activityId"],//value[i]["taskId"],
                      processId: value[i]["variables"]["processId"],//value[i]["taskId"],
                      activity: value[i]["taskName"],
                      status: value[i]["taskStatus"],
                      asignedTo: value[i]["variables"]["asignado"],
                      pathname: pathname,
                      sla: sla,
                      data: {
                        containerId: value[i]["containerId"], statusambiental: value[i]["variables"]["status"],
                        statuscredito: value[i]["variables"]["statuscredito"], priority: infobpm?.priority ?? 0,
                        creditRisk: value[i]["variables"]["dcreditoparalelo"],
                        environmentalRisk: value[i]["variables"]["dambientalparalelo"],
                        infobpm: infobpm,
                        requestId: value[i]["variables"]["requestId"],
                        facilityId: value[i]["variables"]["facilityId"],
                        facilityTypeId: value[i]["variables"]["facilityTypeId"] !== undefined ? value[i]["variables"]["facilityTypeId"] : "",
                        customerId: value[i]["variables"]["customerId"], transactionId: value[i]["variables"]["transactionId"],
                        processId: value[i]["variables"]["processId"],
                        activityId: value[i]["variables"]["activityId"],
                        instanceId: value[i]["instanceId"],
                        taskId: value[i]["taskId"],
                        taskStatus: value[i]["taskStatus"],
                        grupoldap: value[i]["variables"]["grupoldap"]
                      },
                      /*action: (
                        <Link
                          to={{
                            pathname: pathname,
                            data: { creditRisk: value[i]["variables"]["dcreditoparalelo"], environmentalRisk: value[i]["variables"]["dambientalparalelo"], infobpm: infobpm, requestId: value[i]["variables"]["requestId"], facilityId: value[i]["variables"]["facilityId"], customerId: value[i]["variables"]["customerId"], transactionId: value[i]["variables"]["transactionId"], processId: value[i]["variables"]["processId"], activityId: value[i]["variables"]["activityId"], instanceId: value[i]["instanceId"], taskId: value[i]["taskId"], taskStatus: value[i]["taskStatus"] },
                          }}
                        >
                          <i className="mdi mdi-file-search-outline mdi-24px"></i>
                        </Link>
                      ),*/

                    });
                  }
                  break;
                }

                default: {
                  break;
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.error(err)
    }
  }


  static fromJsonAdmin(json) {
    const [t, c] = translationHelpers('translation', 'common');

    const jsonPrioridad = [
      { value: "1", label: "Muy Urgente" },
      { value: "2", label: "Urgencia Moderada" },
      { value: "3", label: "Importante" },
      { value: "4", label: "Baja Urgencia" },
      { value: "5", label: "Sin Urgencia" }]

    var items = [];
    
    /*
    var data =
    {
    "body": {
        "variable-task": [
          {
                "process-instance-variables": {
                    "activityId": "1",
                    "facilityId": "",
                    "procedureNumber": "",
                    "decision": "no",
                    "processId": "4",
                    "applicationNumber": "",
                    "requestId": "",
                    "initiator": "admin",
                    "customerId": "",
                    "transactionId": "3030"
                },
                "task-summary": [
                    {
                        "taskId": 5946,
                        "taskName": "Generar informe de gestion y Propuesta de credito",
                        "taskSubject": null,
                        "taskDescription": "",
                        "taskStatus": "En Progreso",
                        "taskPriority": null,
                        "taskActualOwner": "admin",
                        "taskCreatedBy": "",
                        "taskCreatedOn": "14/03/2022  01:23:16",
                        "taskActivationTime": "106",
                        "taskExpirationTime": null,
                        "taskProcDefId": "CreditosComerciales.SolicitudDeCredito",
                        "containerId": "CreditosComerciales_1.0.0-SNAPSHOT",
                        "instanceId": "9579",
                        "variables": null
                    }
                ]
            }            
          ]
        },
        "status": "OK",
        "businessStatus": "",
        "timeResponse": "27/06/2022 15:51:39",
        "message": null,
        "path": "/api-jbpm-0.0.1-SNAPSHOT/soaint-toolbox-eis/bpm-api/v0/processes/bandejadmin",
        "transactionState": null
    }
    */
   
    var i=0;
    console.log("body",json)
    if(json===undefined){
      return items;
    }
    
    for(const process of json['body']['variable-task'] ) {
      /* ------------------------------------------------------------------------------------------------------------------ */
      /*                                 Convertimos la fecha de milisegundos a fecha normal                                */
      /* ------------------------------------------------------------------------------------------------------------------ */
      //let date = new Date(value[i]['task-activation-time']["java.util.Date"]);
      /* ------------------------------------------------------------------------------------------------------------------ */
      /*                                   Se arma el json que se le va a dar al dataTable                                  */
      /* ------------------------------------------------------------------------------------------------------------------ */ 
      if(process!==undefined && process!==null && process['task-summary']!==undefined && process['task-summary']!==null){
        for(const task of process['task-summary']) {
          i++;
          var infobpm = process["process-instance-variables"]["info"];
          if (infobpm !== undefined && infobpm.length > 5) {
            infobpm = JSON.parse(infobpm);
            infobpm.priority = infobpm?.priority ?? 0;
            process["process-instance-variables"]["processId"] = infobpm.processId.toString();
            process["process-instance-variables"]["activityId"] = infobpm.activityId.toString();
            //process["process-instance-variables"]["processId"] = infobpm.instanceId.toString();
            process["process-instance-variables"]["transactionId"] = infobpm.transactId.toString();
          }
          else {
            infobpm = null;
          }
          //infobpm["taskProcDefId"] = value[i]["taskProcDefId"];
          //infobpm["containerId"] = value[i]["containerId"];
  
          var pathname = "/creditocomercial/presolicitud";
          switch (process["process-instance-variables"]["processId"]) {
            case opt.PROCESS_BUSQUEDADESCARTE.toString(): {
              pathname = '/creditocomercial/presolicitud';
              break;
            }
            case opt.PROCESS_CUMPLIMIENTO.toString(): {
              pathname = "/creditocomercial/descartarcoincidencia";
              break;
            }
            case opt.PROCESS_LISTAEXCLUSION.toString(): {
              pathname = "/creditocomercial/listaexclusion";
              break;
            }
            case opt.PROCESS_INFORMEGESTION.toString(): {
              pathname = "/creditocomercial/informegestion";
              break;
            }
            case opt.PROCESS_PROPUESTACREDITO.toString(): {
              pathname = "/creditocomercial/propuestacredito";
              break;
            }
            case opt.PROCESS_ANALISISCREDITO.toString(): {
              pathname = "/creditocomercial/analisiscredito";
              break;
            }
            case opt.PROCESS_INFORMEFINANCIERO.toString(): {
              pathname = "/creditocomercial/analisiscredito/informefinanciero";
              break;
            }
            case opt.PROCESS_SUPERVISORANALISISCREDITO.toString(): {
              pathname = "/creditocomercial/supervisoranalisiscredito";
              break;
            }
            case opt.PROCESS_CREDITRISK.toString(): {
              pathname = "/creditocomercial/riesgocredito";
              break;
            }
            case opt.PROCESS_AUTONOMY.toString(): {
              pathname = "/creditocomercial/autonomiabanca";
              break;
            }
            case opt.PROCESS_AUTONOMYCREDIT.toString(): {
              pathname = "/creditocomercial/autonomiacredito";
              break;
            }
            case opt.PROCESS_ACEPTACIONCLIENTE.toString(): {
              pathname = "/creditocomercial/aceptacioncliente";
              break;
            }
            case opt.PROCESS_ASIGNARNUMFIDEICOMISO.toString(): {
              pathname = "/creditocomercial/fideicomiso/asignarnumero";
              break;
            }
            case opt.PROCESS_DATOSFIDEICOMISO.toString(): {
              pathname = "/creditocomercial/fideicomiso/relacionfiduciaria";
              break;
            }
            case opt.PROCESS_DOCUMENTACIONLEGAL.toString(): {
              pathname = "/creditocomercial/documentacionlegal";
              break;
            }
            case opt.PROCESS_LAWEYER.toString(): {
              pathname = "/creditocomercial/abogado";
              break;
            }
            case opt.PROCESS_SIGNCONTRACT.toString(): {
              pathname = "/creditocomercial/firmarcontrato";
              break;
            } 
            case opt.PROCESS_INSTRUCTIVEDISBURSEMENT.toString():
            case "22":
            case "23":
            case "450": {
              pathname = "/creditocomercial/instructivodesembolso";
              break;
            }
            case opt.PROCESS_ADMINDISBURSEMENT.toString(): {
              pathname = "/creditocomercial/administracion";
              break;
            }
            case opt.PROCESS_GUARANTEE.toString(): {
              pathname = "/creditocomercial/garantias";
              break;
            }
            case opt.PROCESS_VALIDATEFILE.toString(): {
              pathname = "/creditocomercial/centroarchivo";
              break;
            }
            case opt.PROCESS_LEGACYEXPENSE.toString(): {
              pathname = "/creditocomercial/gastoslegales";
              break;
            }
            case opt.PROCESS_EXECUTEDISBURSEMENT.toString(): {
              pathname = "/creditocomercial/ejecutarinstructivodesembolso";
              break;
            }
          }
  
        if (task["taskName"].indexOf('Emitir opinión de Riesgo Ambiental y Social') >= 0) {
          pathname = "/creditocomercial/riesgoambiental";
        }
        if (task["taskName"].indexOf('Emitir Opinión de Riesgo de Crédito') >= 0) {
          pathname = "/creditocomercial/riesgocredito";
        }
  
        var activationdate = task['taskActivationTime'];
        
        let trafficLight = process["process-instance-variables"]?.sla?.result['dmn-evaluation-result']['dmn-context']?.color;
        let sla = trafficLight && (<div className="trafficLight"><label>{`${activationdate} ${activationdate === '1' ? t("day") : t("days")}`}</label><div className={trafficLight?.toLocaleLowerCase() === 'verde' ? 'Green' : (trafficLight?.toLocaleLowerCase() === 'amarillo' ? 'Yellow' : (trafficLight?.toLocaleLowerCase() === 'rojo' ? 'Red' : (trafficLight?.toLocaleLowerCase() === 'naranja' ? 'Orange' : '')))}></div></div>);
        items.push({
          uniqueData: i + "",
          personName: infobpm?.personName ?? "",
          priority: infobpm?.priority ?? 0,
          priorityName: jsonPrioridad.find(x => x.value == infobpm?.priority)?.label ?? "Sin urgencia",
          date: task["taskCreatedOn"],
          taskId: task["taskId"], // BPM Id de la tarea
          instanceId: process["process-instance-id"],// BPM Id del Proceso
          procedureNumber: process["process-instance-variables"]["procedureNumber"],//value[i]["task-proc-inst-id"],
          applicationNumber: process["process-instance-variables"]["applicationNumber"],//value[i]["taskId"],
          transactionId: process["process-instance-variables"]["transactionId"],//value[i]["taskId"],
          facilityTypeId: process["process-instance-variables"]["facilityTypeId"] !== undefined ? process["process-instance-variables"]["facilityTypeId"] : "",
          activityId: process["process-instance-variables"]["activityId"],//value[i]["taskId"],
          processId: process["process-instance-variables"]["processId"],//value[i]["taskId"],
          activity: task["taskName"],
          status: task["taskStatus"],
          asignedTo: process["process-instance-variables"]["asignado"],
          pathname: pathname,
          sla: sla,
          data: {
            containerId: task["containerId"], statusambiental: process["process-instance-variables"]["status"],
            statuscredito: process["process-instance-variables"]["statuscredito"], priority: infobpm?.priority ?? 0,
            creditRisk: process["process-instance-variables"]["dcreditoparalelo"],
            environmentalRisk: process["process-instance-variables"]["dambientalparalelo"],
            infobpm: infobpm,
            requestId: process["process-instance-variables"]["requestId"],
            facilityId: process["process-instance-variables"]["facilityId"],
            facilityTypeId: process["process-instance-variables"]["facilityTypeId"] !== undefined ? process["process-instance-variables"]["facilityTypeId"] : "",
            customerId: process["process-instance-variables"]["customerId"], transactionId: process["process-instance-variables"]["transactionId"],
            processId: process["process-instance-variables"]["processId"],
            activityId: process["process-instance-variables"]["activityId"],
            instanceId: process["process-instance-id"],
            taskId: task["taskId"],
            taskStatus: task["taskStatus"],
            grupoldap: process["process-instance-variables"]["grupoldap"]
          },
          /*action: (
            <Link
              to={{
                pathname: pathname,
                data: { creditRisk: value[i]["variables"]["dcreditoparalelo"], environmentalRisk: value[i]["variables"]["dambientalparalelo"], infobpm: infobpm, requestId: value[i]["variables"]["requestId"], facilityId: value[i]["variables"]["facilityId"], customerId: value[i]["variables"]["customerId"], transactionId: value[i]["variables"]["transactionId"], processId: value[i]["variables"]["processId"], activityId: value[i]["variables"]["activityId"], instanceId: value[i]["instanceId"], taskId: value[i]["taskId"], taskStatus: value[i]["taskStatus"] },
              }}
            >
              <i className="mdi mdi-file-search-outline mdi-24px"></i>
            </Link>
          ),*/
  
        });
        } 
      }          

    }

    console.log("items",items);
    return items;
  }

}

