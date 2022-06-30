import * as OPTs from "../helpers/options_helper"

export default class functions_helper {

    //Convierte Archio a string Base64
    static convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file)
          fileReader.onload = () => {
            resolve(fileReader.result);
          }
          fileReader.onerror = (error) => {
            reject(error);
          }
        })
      }
      
      //Retorna el nombre del proceso interno
      static getProcessName = (processId) => {
        switch(processId){
          case OPTs.PROCESS_BUSQUEDADESCARTE:{ 
            return "BUSQUEDA Y DESCARTE"
          }
          case OPTs.PROCESS_CUMPLIMIENTO:{ 
            return "CUMPLIMIENTO"
          }
          case OPTs.PROCESS_INFORMEGESTION:{ 
            return "INFORME DE GESTION REFORZADO"
          }
          case OPTs.PROCESS_LISTAEXCLUSION:{ 
            return "LISTA EXCLUSION"
          }
          case OPTs.PROCESS_PROPUESTACREDITO:{ 
            return "PROPUESTA DE CREDITO"
          }
          case OPTs.PROCESS_ANALISISCREDITO:{ 
            return "ANALISIS DE CREDITO"
          }
          case OPTs.PROCESS_INFORMEFINANCIERO:{ 
            return "INFORME FINANCIERO"
          }
          case OPTs.PROCESS_SUPERVISORANALISISCREDITO:{ 
            return "SUPERVISOR DE ANALISIS"
          }
          case OPTs.PROCESS_AUTONOMY:{ 
            return "AUTONOMIA DE CREDITO"
          }
          case OPTs.PROCESS_ACEPTACIONCLIENTE:{ 
            return "ACEPTACION DE CLIENTE"
          }
          case OPTs.PROCESS_CREDITRISK:{ 
            return "RIESGO DE CREDITO"
          }
          case OPTs.PROCESS_EVIROMENTRISK:{ 
            return "RIESGO AMBIENTAL"
          }
          case OPTs.PROCESS_ASIGNARNUMFIDEICOMISO:{ 
            return "ASIGNAR NUMERO FIDEICOMISO"
          }
          case OPTs.PROCESS_DATOSFIDEICOMISO:{ 
            return "RELACION FIDUCIARIA"
          }
          case OPTs.PROCESS_DOCUMENTACIONLEGAL:{ 
            return "DOCUMENTACION LEGAL"
          }
          case OPTs.PROCESS_LAWEYER:{ 
            return "ABOGADO"
          }
          case OPTs.PROCESS_SIGNCONTRACT:{ 
            return "FIRMA DE CONTRATO"
          }
          case OPTs.PROCESS_ADMINDISBURSEMENT:{ 
            return "ADMINISTRACION Y DESEMBOLSO"
          }
          case OPTs.PROCESS_INSTRUCTIVEDISBURSEMENT:{ 
            return "DESEMBOLSO"
          }
        }
        return "";
      }  
}

