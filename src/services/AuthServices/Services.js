
import { GetDashBoardModel } from "../../models";
import * as url from "../../helpers/url_helper"
import qs from "qs";
import ApiServiceAuth from "../ApiServiceAuth";

export default class Services extends ApiServiceAuth {
    /* ---------------------------------------------------------------------------------------------- */
    /*                        enviamos las variables al api del authentication                        */
    /* ---------------------------------------------------------------------------------------------- */

    async loginAccess(auth) {
            let result = this.post(url.URL_LOGIN,{},{},auth);
            return result;
    }

}
