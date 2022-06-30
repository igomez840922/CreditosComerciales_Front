
import { GetDashBoardModel } from "../../models";
import * as url from "../../helpers/url_helper"
import qs from "qs";
import ApiServiceCore from "../ApiServiceBpm";

export default class ServicesCumplimiento extends ApiServiceCore {
    /* ---------------------------------------------------------------------------------------------- */
    /*                          enviamos las variables al api del status JBPM                         */
    /* ---------------------------------------------------------------------------------------------- */
    async iniciarTarea(taskID) {
        const data = {
            "containerId": "CreditosComerciales_1.0.0-SNAPSHOT",
            "taskId": taskID,
            "taskStatus": "started"
        }
        // let result = this.put(url.URL_BPM_ModifiStatus, data);
        // return result;
    }
    async completarTarea(taskID,decision) {
        const data = {
            "containerId": "CreditosComerciales_1.0.0-SNAPSHOT",
            "taskId": taskID,
            "taskStatus": "completed",
            "parametros": {
                "values": {
                    "decision": decision
                }
            }
        }
        // let result = this.put(url.URL_BPM_ModifiStatus, data);
        // return result;
    }

}
