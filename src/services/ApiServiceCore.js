import axios from "axios"
import TokenService from "./TokenService";
import * as url from "../helpers/url_helper"
import qs from 'qs';
import http from "http";
import https from "https";
import { BackendServices } from "../services";
import errorDispacherHelper from "../helpers/errorDispacherHelper";
import * as OPTs from "../helpers/options_helper"

const userId = "ARICO1";
const channelId = "CreditosComerciales"
const client_id = '6cbk7drlvbc88vdgvgo1tg1r3o'; //'rrcmi5fefq56q4bc9pri0mfa0';//
const client_secret = 'b9vti5n8pbn1cn2gr35vlgq8s3uq7mm1j2d79ih0u1jjb4hkd3m'//'k7f89803rmgu8n93ppr3e2honuguo064ga8co4oqgml8k0tdrbp';//

const httpAgent = new http.Agent({ keepAlive: true })
const httpsAgent = new https.Agent({ keepAlive: true })

//apply base url for axios
const API_URL = ""

const axiosApi = axios.create({
  baseURL: API_URL,
  httpAgent,
  httpsAgent,
  headers: {
    "Content-Type": "application/json",
    "userId": userId,
    "channelId": channelId
  },
})

/*
axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)
*/

axiosApi.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      config.headers["Authorization"] = 'Bearer ' + token.access_token;
      //config.headers["x-access-token"] = token; // for Node.js Express back-end
    }

    // console.log('config: ',config);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosApi.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    //return Promise.reject(err);

    console.log('err: ', err);
    const originalConfig = err.config;

    // console.log('originalConfig: ',originalConfig);
    if (originalConfig.url === url.URL_CORE_TOKENGEN) {
      return Promise.reject(err);
    }

    var token = TokenService.getLocalAccessToken();

    //si existe Token chequear la validez de tiempo
    if (token) {
      //calculamos que el expiration time esté correcto
      var elapsed = (new Date()).getTime() - token.tokenexpiration;

      if (elapsed < 0) {
        return Promise.reject(err);
      }
    }

    TokenService.removeLocalAccessToken();

    originalConfig._retry = true;
    try {

      const data = qs.stringify({ grant_type: 'client_credentials' });
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': "Basic " + btoa(client_id + ":" + client_secret)
      };

      var rs = await axiosApi.post(url.URL_CORE_TOKENGEN, data, {
        headers: headers
      });

      var responsetokenJson = rs.data;

      var tokenexpiration = new Date();
      tokenexpiration.setSeconds(new Date().getSeconds() + parseInt(responsetokenJson.expires_in))
      responsetokenJson.tokenexpiration = tokenexpiration.getTime();

      TokenService.updateLocalAccessToken(responsetokenJson);

      originalConfig.headers["Authorization"] = 'Bearer ' + responsetokenJson.access_token;
      return axiosApi(originalConfig);

    }
    catch (_error) {
      return Promise.reject(_error);
    }

    /*
    //originalConfig.url !== "/auth/signin" &&
    if (err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {

          const data = qs.stringify({
            grant_type: 'client_credentials'
          });
          const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': "Basic " + btoa(client_id + ":" + client_secret)
          };

          const rs = await axiosApi.post(url_TokenGeneration,
            data,headers
          );

          console.log(rs.data);
          TokenService.updateLocalAccessToken(rs.data);

          //const { accessToken } = rs.data;
          return axiosApi(originalConfig);

        }
        catch (_error) {
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);

    */
  }
);


export default class ApiServiceCore {

  async get(url, config = {}) {

    return await axiosApi
      .get(url, { ...config })
      .then(response => {
        if (response?.data?.Status?.StatusCode !== OPTs.ResponseT24_STATUSOK && response?.data?.Status?.StatusCode !== OPTs.ResponseT24_STATUSOK1 && response?.data?.Status?.StatusCode !== OPTs.ResponseT24_STATUSOK2) {
          if (response?.data?.catalog) {
          } else {
            //errorDispacherHelper.dispatch({ status: response?.data?.Status?.StatusCode ?? "500", error: response?.data?.Status?.StatusDesc ?? "NO DATA ERROR", url: url, type: "GET" });
          }
        }
        return response.data
      })
      .catch((err) => {
        console.error("ApiServiceCore", err);
        errorDispacherHelper.dispatch({ status: err?.response?.status ?? "500", error: err?.response?.data ?? "NO DATA ERROR", url: url, type: "GET" });
      })
  }

  async post(url, data, config = {}) {
    return axiosApi
      .post(url, { ...data }, { ...config })
      .then(response => {
        if (response?.data?.Status?.StatusCode !== OPTs.ResponseT24_STATUSOK && response?.data?.Status?.StatusCode !== OPTs.ResponseT24_STATUSOK1 && response?.data?.Status?.StatusCode !== OPTs.ResponseT24_STATUSOK2) {
          if (response?.data?.catalog) {
          } else {
            //errorDispacherHelper.dispatch({ status: response?.data?.Status?.StatusCode ?? "500", error: response?.data?.Status?.StatusDesc ?? "NO DATA ERROR", url: url, type: "POST" });
          }
        }
        return response.data
      })
      .catch((err) => {
        console.error("ApiServiceCore", err);
        errorDispacherHelper.dispatch({ status: err?.response?.status ?? "500", error: err?.response?.data ?? "NO DATA ERROR", url: url, type: "POST" });
        return { url: url, status: err?.response?.status ?? "500", error: err?.response?.data ?? "" };
      })
  }

  async put(url, data, config = {}) {
    return axiosApi
      .put(url, { ...data }, { ...config })
      .then(response => {
        if (response?.data?.Status?.StatusCode !== OPTs.ResponseT24_STATUSOK && response?.data?.Status?.StatusCode !== OPTs.ResponseT24_STATUSOK1 && response?.data?.Status?.StatusCode !== OPTs.ResponseT24_STATUSOK2) {
          if (response?.data?.catalog) {
          } else {
            //errorDispacherHelper.dispatch({ status: response?.data?.Status?.StatusCode ?? "500", error: response?.data?.Status?.StatusDesc ?? "NO DATA ERROR", url: url, type: "PUT" });
          }
        }
        return response.data
      })
      .catch((err) => {
        console.error("ApiServiceCore", err);
        errorDispacherHelper.dispatch({ status: err?.response?.status ?? "500", error: err?.response?.data ?? "NO DATA ERROR", url: url, type: "PUT" });
        return { url: url, status: err?.response?.status ?? "500", error: err?.response?.data ?? "" };
      })
  }

  async del(url, config = {}) {
    return await axiosApi
      .delete(url, { ...config })
      .then(response => {
        if (response?.data?.Status?.StatusCode !== OPTs.ResponseT24_STATUSOK && response?.data?.Status?.StatusCode !== OPTs.ResponseT24_STATUSOK1 && response?.data?.Status?.StatusCode !== OPTs.ResponseT24_STATUSOK2) {
          if (response?.data?.catalog) {
          } else {
            //errorDispacherHelper.dispatch({ status: response?.data?.Status?.StatusCode ?? "500", error: response?.data?.Status?.StatusDesc ?? "NO DATA ERROR", url: url, type: "DELETE" });
          }
        }
        return response.data
      })
      .catch((err) => {
        console.error("ApiServiceCore", err);
        errorDispacherHelper.dispatch({ status: err?.response?.status ?? "500", error: err?.response?.data ?? "NO DATA ERROR", url: url, type: "DELETE" });
        return { url: url, status: err?.response?.status ?? "500", error: err?.response?.data ?? "" };
      })
  }

  //////////////////////////////
  //////////////////////////////

  /*

fetch = function() {
let self = this;
let args = arguments;
return originalFetch.apply(self, args).then(async function(data) {
  if (data.status === 200)
    console.log("---------Status 200----------");
  if (data.status === 401) {
    // request for token with original fetch if status is 401
    console.log('failed');
    let response = await originalFetch(TEMP_API['200'].url, TEMP_API['200'].args);
    // if status is 401 from token api return empty response to close recursion
    console.log("==========401 UnAuthorize.=============");
    console.log(response);
    if (response.status === 401) {
      return {};
    }
    // else set token
    // recall old fetch
    // here i used 200 because 401 or 404 old response will cause it to rerun
    // return fetch(...args); <- change to this for real scenarios
    // return fetch(args[0], args[1]); <- or to this for real sceaerios
    return fetch(TEMP_API['200'].url, TEMP_API['200'].args);
  }
  // condition will be tested again after 401 condition and will be ran with old args
  if (data.status === 404) {
    console.log("==========404 Not Found.=============");
    // here i used 200 because 401 or 404 old response will cause it to rerun
    // return fetch(...args); <- change to this for real scenarios
    // return fetch(args[0], args[1]); <- or to this for real scenarios
    return fetch(TEMP_API['200'].url, TEMP_API['200'].args);
    //scenaerios
  }
  else {
    return data;
  }
});
};
*/

}



