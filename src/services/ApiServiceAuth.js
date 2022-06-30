import axios from "axios"
import * as url from "../helpers/url_helper"
import qs from 'qs';
let API_URL = ""
let axiosApi =  axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    },
})


class ApiServiceCore {
    SetParams(usr,psw){
        /* ---------------------------------------------------------------------------------------------- */
        /*                               Asignamos los headers a la peticion                              */
        /* ---------------------------------------------------------------------------------------------- */
        axiosApi.interceptors.response.use(
            (config) => {
                config.headers["Authorization"] = "Basic " + (usr + ":" + psw);
                return config;
            },
            (error) => {
                console.log("request error: ", error)
            }
        ); 

        axiosApi.interceptors.request.use(
            (config) => {
                config.headers["Authorization"] = "Basic " + (usr + ":" + psw);
                return config;
            },
            (error) => {
                console.log("request error: ", error)
            }
        ); 
    }

    async get(url, config = {}) {
        return await axiosApi
            .get(url, { ...config })
            .then(response => response.data)
    }

    async post(url, data, config = {},auth) {
        /* ---------------------------------------------------------------------------------------------- */
        /*        Retornamos la respuesta y le montamos el header con el token de las credenciales        */
        /* ---------------------------------------------------------------------------------------------- */        
         return await axiosApi
            .post(url, { ...data }, {
                headers: {
                  'Authorization': 'Basic '+btoa(auth.headers.username+':'+auth.headers.password)
                }
              })
            .then(response =>response)        
    }

    async put(url, data, config = {}) {
        return axiosApi
            .put(url, { ...data }, { ...config })
            .then(response => response.data)
    }

    async del(url, config = {}) {
        return await axiosApi
            .delete(url, { ...config })
            .then(response => response.data)
    }
}


export default  ApiServiceCore
