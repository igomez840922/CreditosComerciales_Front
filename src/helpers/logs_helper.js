


import * as OPTs from "./options_helper"
import LocalStorageHelper from "./LocalStorageHelper";
import { BackendServices } from "../services/index";

const localStorageHelper = new LocalStorageHelper();
const backendServices = new BackendServices();

// Guardar en Bitacora
export async function saveLogProcess(logProcessModel) {
    
    var credentials = localStorageHelper.get(OPTs.VARNAME_USRCREDENTIAL);    
    logProcessModel.responsible = credentials?.usr??"admin"
    //logProcessModel.clientId = mainDebtor?.personId??logProcessModel.clientId;
    //logProcessModel.observations= observations;    
    var result = await backendServices.saveHistorical(logProcessModel);
    if(result!==undefined){
        return true;
    }
    return false;
}