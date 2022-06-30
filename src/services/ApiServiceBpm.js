import axios from "axios"
import * as url from "../helpers/url_helper"
import * as opt from "../helpers/options_helper"
import qs from 'qs';

import LocalStorageHelper from "../helpers/LocalStorageHelper";
    
    const localStorageHelper = new LocalStorageHelper();
    //apply base url for axios
    const API_URL = ""
    
    const axiosApi = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json"
      },
    })
    
    axiosApi.interceptors.request.use(
      (config) => {  
        var credentials = localStorageHelper.get(opt.VARNAME_USRCREDENTIAL);  
        config.headers["Authorization"] = "Basic " + btoa(credentials.usr + ":" + credentials.psw);
        return config;
      },
      (error) => {
        console.log("request error: ", error)
        return Promise.reject(error);
      }
    );
    
export default class ApiServiceCore {

  setDataError(err) {

    /*let jsonError = {
      code: err.response.status,
      error: true,
      message: err.response.data,
      method: err.response.config.method,
      serviceType: "bk",
      url: err.response.config.url,
    }

    localStorage.setItem("jsonError", JSON.stringify(jsonError))
    const event = new CustomEvent('errorSoaint', jsonError);
    event.initEvent("errorSoaint", true, true);
    window.dispatchEvent(event);
    */
  }

    async get(url, config = {}) {
      return await axiosApi
      .get(url, { ...config })
      .then(response => response.data).catch(err => {
        this.setDataError(err);
      });

    } 

    async post(url, data,config = {}) {
      return axiosApi
        .post(url, { ...data },{ ...config })
        .then(response => response.data).catch(err => {
          this.setDataError(err);
        });
    }

    async put(url, data, config = {}) {
      return axiosApi
        .put(url, { ...data }, { ...config })
        .then(response => response.data).catch(err => {
          this.setDataError(err);
        });
    }

    async del(url,data, config = {}) {
      return await axiosApi
        .delete(url,{ data: data}, { ...config })
        .then(response => response.data).catch(err => {
          this.setDataError(err);
        });
    }
}
  

  
