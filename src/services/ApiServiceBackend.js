import axios from "axios"
import { convertToUpperCasesData } from '../helpers/commons'
//apply base url for axios
const API_URL = ""
// headers: {
//   "Content-Type": "application/json",
//   'Cache-Control': 'no-cache',
//   'Pragma': 'no-cache',
//   'Expires': '0',
// },
const axiosApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  },
})


export default class ApiServiceBackend {

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
  async getSinData(url, config = {}) {
    return await axiosApi
      .get(url, { ...config })
      .then(response => response)
  }

  async post(url, data, config = {}) {
    await convertToUpperCasesData(data);
    return axiosApi
      .post(url, { ...data }, { ...config })
      .then(response => response.data).catch(err => {
        this.setDataError(err);
      });
  }

  async put(url, data, config = {}) {
    await convertToUpperCasesData(data);
    return axiosApi
      .put(url, { ...data }, { ...config })
      .then(response => response.data).catch(err => {
        this.setDataError(err);
      });
  }

  async del(url, data, config = {}) {
    return await axiosApi
      .delete(url, { data: data }, { ...config })
      .then(response => {
        if (response.statusCode == "500") {
          this.setDataError({
            code: 500,
            error: true,
            message: "Error del servidor",
            method: 'Delete',
            serviceType: "bk",
            url: '',
          });
        }
        return response.data
      }).catch(err => {
        this.setDataError(err);
      });
  }
}



