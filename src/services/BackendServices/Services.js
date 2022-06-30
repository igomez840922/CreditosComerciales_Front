import { BusquedaDescarteModel, UsuarioProspectoModel } from "../../models";
import DocumentoAnexoModel from "../../models/Backend/DocumentoAnexoModel";
import IgrInboxResultModel from "../../models/InformeGestion/InboxResultModel";
import ApiService from "../ApiServiceBackend";
import * as url from "../../helpers/url_helper"
import * as opt from "../../helpers/options_helper"
import qs from 'qs';
import moment from "moment";
import ModalErrrorMessage from '../../helpers/errorModalSoaint.js'
import { convertToUpperCasesData } from "../../helpers/commons";
export default class Services extends ApiService {

  //Login de Usuario
  /**
   * 
   * OldName: None
   * 
  */
  async getQuoterPaymentPlan(
    typeLoan = "compuesto",
    amountDebt,
    anualRate,
    feciRate = 0,
    term = 0,
    paymentPeriod = 1,
    gracePeriod = 0,
    gracePeriodType = "NA",
    customerDefinedPayment
  ) {
    try {
      if (typeLoan === "compuesto") {
        const data = await this.get(
          `${url.URL_BACKEND_QUOTER}/${typeLoan}?amountDebt=${amountDebt}&anualRate=${anualRate}&feciRate=${feciRate}&term=${term}&paymentPeriod=${paymentPeriod}&gracePeriod=${gracePeriod}&gracePeriodType=${gracePeriodType}&customerDefinedPayment=${customerDefinedPayment}`
        )
        console.log("from service function", data);
        return data;
      } else {
        const data = await this.get(
          `${url.URL_BACKEND_QUOTER}/${typeLoan}?amountDebt=${amountDebt}&anualRate=${anualRate}&feciRate=${feciRate}&term=${term}&paymentPeriod=${paymentPeriod}`
        )
        console.log("from service function", data);
        return data;
      }
    } catch (error) {
      console.error("Error: quoter payment plan", error)
    }
  }

  async getUserInfo(userName, password) {
    try {
      var data = qs.stringify({ userName: userName, password: password });
      var result = await this.get(url.URL_BACKEND_LOGINUSUARIO + "?" + data);

      console.error("result: ", result);
      return { status: 200, result: result };
    }
    catch (err) {
      console.error("api getUserInfo: ", err);
      return { status: err.response.status, error: err.response.data };
    }
    return undefined;
  }

  /* ---------------------------------------------------------------------------------------------- */
  /*                  Recibimos el body desde la pantalla, y Guardamos la bitacora                  */
  /* ---------------------------------------------------------------------------------------------- */
  //guardarHistorico
  async saveHistorical(data) {
    try {
      /*{
    "instanceId": "8429",
    "transactId": 102,
    "clientId": 68,
    "observations": "444444444",
    "responsible": "555555555",
    "processId": 6,
    "activityId": 7,
    "requestId": "vidsolicitud character varying",
    "requestStatus": "vestadosolicitud character varying",
    "rejectionReason": "vmotivorechazo character varying"
}*/
      data.riskOpinionId = '';
      data.riskOpinionDesc = '';
      var result = await this.post(url.ULR_BACKEND_HISTORICO, data);

      return result;
    }
    catch (err) {
      console.error("api saveHistorical: ", err);
    }
    return undefined;
  }
  /* ---------------------------------------------------------------------------------------------- */
  /*             Consultamos todos los datos de las bitacoras, pasamos las variables get            */
  /* ---------------------------------------------------------------------------------------------- */
  //Consultar Historico
  async getHistorical(transactId) {

    try {
      var data = qs.stringify({ transactId: transactId });
      var result = await this.get(url.ULR_BACKEND_HISTORICO + "?" + data);

      /*{
    "logs": [
        {
            "instanceId": "9095",
            "transactId": 3039,
            "clientId": 68,
            "observations": "444444444",
            "date": "2022-03-23T00:00:00.000+00:00",
            "responsible": "555555555",
            "processId": 6,
            "activityId": 7,
            "status": true,
            "requestId": "vidsolicitud character varying",
            "requestStatus": "vestadosolicitud character varying",
            "rejectionReason": "vmotivorechazo character varying",
            "statusDescription": null,
            "requestStage": null,
            "processBpmId": null,
            "processBpmName": null,
            "activityBpmId": null,
            "activityBpmName": null
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
} */

      return result.logs;

    }
    catch (err) {
      console.error(err)
      return { status: err.response.status, error: err.response.data }; //errorMessage, //errorCode
    }
    return undefined;
  }

  //consultar estadisticas
  async getBpmStatistics() {
    try {
      var result = await this.get(url.ULR_BACKEND_ESTADISTICAS);

      /*{
    "statistics": [
        
        {
            "transactId": 3529,
            "date": "2022-04-07T14:47:36.427+00:00",
            "processId": 3,
            "activityId": 0,
            "processBpmId": "FP-SC-BPM-01",
            "activityBpmId": "003"
        },
        {
            "transactId": 3538,
            "date": "2022-04-07T15:13:11.644+00:00",
            "processId": 2,
            "activityId": 0,
            "processBpmId": "FP-SC-BPM-01",
            "activityBpmId": "002"
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
} */

      return result.statistics;

    }
    catch (err) {
      console.error(err)
      return { status: err.response.status, error: err.response.data }; //errorMessage, //errorCode
    }
    return undefined;
  }

  ////IGR - GUARDAR DATOS GENERALES///////
  /**
   * 
   * OldName: guardarDatosGeneralesIGR
   * 
  */
  async saveGeneralDataIGR(data) {
    try {
      /*
      {
    "transactId": 101,
    "economicGroup": {
        "code": "2 save",
        "name": "3 save"
    },
    "economicActivity": {
        "code": "4 save",
        "name": "5 save"
    },
    "subeconomicActivity": {
        "code": "4.5 save",
        "name": "5.5 save"
    },
    "bank": {
        "code": "6 save",
        "name": "7 save"
    }
}
      */

      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_DATOSGENERALES_IGR, data);

      //si es 500 existe, solo debemos actualizar
      if (result.statusCode !== opt.ResponseBackend_STATUSOK) {
        //Guardamos
        result = await this.post(url.URL_BACKEND_DATOSGENERALES_IGR, data);
      }

      //OK
      /*var result ={
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
      }*/

      return result;
    }
    catch (err) {
      console.error("api saveGeneralDataIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: consultarDatosGeneralesIGR
   * 
  */
  async consultGeneralDataIGR(transactId) { //retorna la Data de Busqueda y Descarte para un proceso
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_DATOSGENERALES_IGR + "?" + data);
      /*{
    "transactId": 101,
    "economicGroup": {
        "code": "2 save",
        "name": "3 save"
    },
    "economicActivity": {
        "code": "4 save",
        "name": "5 save"
    },
    "bank": {
        "code": "6 save",
        "name": "7 save"
    },
    "status": true,
    "identificationType": "RUC",
    "customerDocumentId": "00000081",
    "customerNumberT24": "",
    "firstName": "Rey",
    "secondName": "",
    "firstLastName": "",
    "secondLastName": "",
    "statusService": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
} */
      return result;
    }
    catch (err) {
      console.error("api consultGeneralDataIGR: ", err)
    }
    return undefined;
  }

  ////IGR - GUARDAR DATOS EMPRESA///////
  /**
   * 
   * OldName: guardarDatosEmpresaIGR
   * 
  */
  async saveDataCompanyIGR(data) {
    try {
      /*
      {
    "transactId": 44,
    "country": {
        "code": "2",
        "name": "3"
    },
    "province": {
        "code": "4",
        "name": "5"
    },
    "district": {
        "code": "6",
        "name": "7"
    },
    "township": {
        "code": "8",
        "name": "9"
    },
    "city": {
        "code": "10",
        "name": "11"
    },
    "referencePoint": "12",
    "residency": "13",
    "houseNumber": "14",
    "phoneNumber": 15,
    "mobileNumber": 16,
    "workNumber": 17,
    "email": "18",
    "sector": {
        "code": "19",
        "name": "20"
    },
    "subSector": {
        "code": "21",
        "name": "22"
    },
    "exclusion": true,
    "sustainable": true

}
      */

      //Guardamos
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_DATOSEMPRESA_IGR, data);
      //OK
      /*var result ={
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
      }*/

      //si es 500 existe, solo debemos actualizar
      if (result.statusCode !== opt.ResponseBackend_STATUSOK) {
        result = await this.post(url.URL_BACKEND_DATOSEMPRESA_IGR, data);
      }

      return result;

    }
    catch (err) {
      console.error("api saveDataCompanyIGR", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: consultarDatosEmpresaIGR
   * 
  */
  async consultDataCompanyIGR(transactId) { //retorna la Data de Busqueda y Descarte para un proceso
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_DATOSEMPRESA_IGR + "?" + data);
      /*
      {
          "transactId": 44,
          "country": {
              "code": "2",
              "name": "3"
          },
          "province": {
              "code": "4",
              "name": "5"
          },
          "district": {
              "code": "6",
              "name": "7"
          },
          "township": {
              "code": "8",
              "name": "9"
          },
          "city": {
              "code": "10",
              "name": "11"
          },
          "referencePoint": "12",
          "residency": "13",
          "houseNumber": "14",
          "phoneNumber": 15,
          "mobileNumber": 16,
          "workNumber": 17,
          "email": "18",
          "sector": {
              "code": "19",
              "name": "20"
          },
          "subSector": {
              "code": "21",
              "name": "22"
          },
          "exclusion": true,
          "sustainable": true,
          "status": true,
          "identificationType": "0",
          "customerDocumentId": "00000030",
          "customerNumberT24": "",
          "firstName": "Novey",
          "secondName": "",
          "firstLastName": "",
          "secondLastName": "",
          "statusService": {
              "statusCode": "200",
              "statusDesc": "Transacciï¿½n Exitosa"
          }
      }
      */
      if (result.statusService.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api consultDataCompanyIGR: ", err)
    }
    return undefined;
  }

  ////IGR - GUARDAR HISTORIAL EMPRESA///////
  /**
   * 
   * OldName: guardarHistorialEmpresaIGR
   * 
  */
  async saveCompanyHistoryIGR(data) {
    try {
      /*
{
"transactId":"8",
"description":"description2",
"employeesNumber":"346",
"details":"detalles2",
"status":true
}
      */

      //Guardamos
      var result = await this.post(url.URL_BACKEND_HISTORIALEMPRESA, data);
      //OK
      /*var result ={
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
      }*/

      //si es 500 existe, solo debemos actualizar
      if (result.statusCode === "500") {
        data["status"] = true;
        result = await this.put(url.URL_BACKEND_HISTORIALEMPRESA, data);
      }

      if (result.statusCode === "200") {
        return result;
      }

      // data = {
      //   "customerIdentification":"5",
      //   "firstName":"diana",
      //   "secondName":"",
      //   "firstLastName":"perez",
      //   "secondLastName": "jj",
      //   "identificationTypeId":1,
      //   "identificationType":"45",
      //   "numberIdentification" :45,
      //   "currentProcessIdentification":1,
      //   "responsible":"dinaUser",
      //   "sla":58
      // }
    } catch (err) {
      console.error("api saveCompanyHistoryIGR", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: consultarHistorialEmpresaIGR
   * 
  */
  async checkHistoryCompanyIGR(transactId) { //retorna la Data de Busqueda y Descarte para un proceso
    try {
      var params = { transactId: transactId, processId: opt.PROCESS_INFORMEGESTION, activityId: opt.ACT_HISTORIAEMPRESA }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_HISTORIALEMPRESA + "?" + data);
      if (result.status.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api checkHistoryCompanyIGR: ", err)
    }
    return undefined;
  }

  ////IGR - INFO ACCIONISTAS///////
  /**
   * 
   * OldName: consultarDatosAccionistas
   * 
  */
  async consultShareholderData(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_ACCIONISTASECCION + "?" + data);

      /*
      {
    "shareholders": [
        {
            "transactId": 1,
            "personType": "N",
            "identificationType": "CIP",
            "identificationNumber": "8-000-888",
            "shareholderFirstName": "vprimernombresocio character varying",
            "shareholderMiddleName": "vsegundonombresocio character varying",
            "shareholderFirstSurname": "vprimerapellidosocio character varying",
            "shareholderSecondSurname": "vsegundoapellidosocio character varying",
            "nationalityId": "vidnacionalidad character varying",
            "nationality": "vnacionalidad character varying",
            "birthDate": "1970-01-19",
            "participation": 25,
            "yearsExperience": 30,
            "status": true,
            "shareholderId": 24
        },
        {
            "transactId": 1,
            "personType": "N",
            "identificationType": "CIP",
            "identificationNumber": "8-000-888",
            "shareholderFirstName": "vprimernombresocio character varying",
            "shareholderMiddleName": "vsegundonombresocio character varying",
            "shareholderFirstSurname": "vprimerapellidosocio character varying",
            "shareholderSecondSurname": "vsegundoapellidosocio character varying",
            "nationalityId": "vidnacionalidad character varying",
            "nationality": "vnacionalidad character varying",
            "birthDate": "1970-01-19",
            "participation": 25,
            "yearsExperience": 30,
            "status": true,
            "shareholderId": 23
        },
        {
            "transactId": 1,
            "personType": "N",
            "identificationType": "CIP",
            "identificationNumber": "8-000-888",
            "shareholderFirstName": "vprimernombresocio character varying",
            "shareholderMiddleName": "vsegundonombresocio character varying",
            "shareholderFirstSurname": "vprimerapellidosocio character varying",
            "shareholderSecondSurname": "vsegundoapellidosocio character varying",
            "nationalityId": "vidnacionalidad character varying",
            "nationality": "vnacionalidad character varying",
            "birthDate": "1970-01-19",
            "participation": 25,
            "yearsExperience": 30,
            "status": true,
            "shareholderId": 22
        }
    ],
    "observations": "ALGODON",
    "infoDate": "2021-11-19",
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacción Exitosa"
    }
}
      */

      return result.shareholders;
    }
    catch (err) {
      console.error("api consultShareholderData: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarSeccionAccionista
   * 
  */
  async saveSectionShareholder(data) {
    try {

      /*{
    "transactId": 107,
    "description": "dd5",
    "infoDate":1643723937
}
      */
      data = {
        transactId: data.transactId,
        description: data.observations == null ? " " : data.observations,
        infoDate: Number(moment().format("YYYYMMDD"))
      }
      // data["date"] = "1980-11-11";
      // data["jsonData"] = "[{}]";

      var result = await this.post(url.URL_BACKEND_ACCIONISTASECCION, data);

      /*OK
      {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
      }
      */

      //si es 500 existe, solo debemos actualizar
      if (result.statusCode === "500") {
        data["status"] = true;
        result = await this.put(url.URL_BACKEND_ACCIONISTASECCION, data);
      }

      if (result.statusCode === "200") {
        return result;
      }

    }
    catch (err) {
      console.error("api saveSectionShareholder", err);
    }
    return undefined;

  }

  /**
   * 
   * OldName: consultarSeccionAccionista
   * 
  */
  async consultSectionShareholder(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_ACCIONISTASECCION + "?" + data);

      /*
       {
    "shareholders": [
        {
            "transactId": 101,
            "personType": "N",
            "identificationType": "CIP",
            "identificationNumber": "8-000-888",
            "shareholderFirstName": "vprimernombresocio character varying",
            "shareholderMiddleName": "vsegundonombresocio character varying",
            "shareholderFirstSurname": "vprimerapellidosocio character varying",
            "shareholderSecondSurname": "vsegundoapellidosocio character varying",
            "nationalityId": "vidnacionalidad character varying",
            "nationality": "vnacionalidad character varying",
            "birthDate": "1970-01-19",
            "participation": 25,
            "yearsExperience": 30,
            "status": true,
            "shareholderId": 2
        }
    ],
    "observations": "dd5",
    "infoDate": "2022-01-10",
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacción Exitosa"
    }
}
      */

      return result.observations;
    }
    catch (err) {
      console.error("api consultSectionShareholder: ", err)
    }
    return undefined;
  }

  ////IGR - GUARDAR ESTRUCTURA ORGANIZACIONAL///////
  /**
   * 
   * OldName: guardarEstructuraEmpresaIGR
   * 
  */
  async saveCompanyStructureIGR(data) {
    try {
      /*
{
"transactId":"46",
"description":"estructura1",
"date":"2021-12-10"
}
      */
      data["date"] = moment().format("YYYY-MM-DD");
      //Guardamos
      var result = await this.post(url.URL_BACKEND_ESTRUCTURAEMPRESA, data);
      //OK
      /*var result ={
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
      }*/

      //si es 500 existe, solo debemos actualizar
      if (result.statusCode === "500") {
        data["date"] = moment().format("YYYY-MM-DD");
        data["status"] = true;
        result = await this.put(url.URL_BACKEND_ESTRUCTURAEMPRESA, data);
      }

      if (result.statusCode === "200") {
        return result;
      }

      // data = {
      //   "customerIdentification":"5",
      //   "firstName":"diana",
      //   "secondName":"",
      //   "firstLastName":"perez",
      //   "secondLastName": "jj",
      //   "identificationTypeId":1,
      //   "identificationType":"45",
      //   "numberIdentification" :45,
      //   "currentProcessIdentification":1,
      //   "responsible":"dinaUser",
      //   "sla":58
      // }
    } catch (err) {
      console.error("api saveCompanyStructureIGR", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: consultarEstructuraEmpresaIGR
   * 
  */
  async consultStructureCompanyIGR(transactId) { //retorna la Data de Busqueda y Descarte para un proceso
    try {
      var params = { transactId: transactId, processId: opt.PROCESS_INFORMEGESTION, activityId: opt.ACT_HISTORIAEMPRESA }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_ESTRUCTURAEMPRESA + "?" + data);
      /*{
    "transactId": 44,
    "observations": "estructura2",
    "infoDate": "2022-01-19",
    "status": true,
    "attachments": []
} */
      return result;
    }
    catch (err) {
      console.error("api consultStructureCompanyIGR: ", err)
    }
    return undefined;
  }

  ////IGR - GOBIERNO CORPORATIVO///////
  /**
   * 
   * OldName: consultarDatosGobiernoCorporativo
   * 
  */
  async consultDataCorporateGovernance(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_GOBIERNOCORPORATIVO + "?" + data);

      /*
      {
    "corporateGobernance": [
        {
            "transactId": 9327,
            "personId": 3,
            "personType": "2",
            "idType": "RUC",
            "clientDocumentId": "0000027551-0051-0000228486",
            "customerNumberT24": "600235373",
            "name": "SPORTMATE CORPORATION",
            "secondName": "SPORTMATE CORPORATION ",
            "lastName": "SPORTMATE CORPORATION ",
            "secondSurname": "",
            "nationality": "PA",
            "birthDate": "2022-03-01",
            "position": null
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacción Exitosa"
    }
}
      */
      if (result.status.statusCode === "200" || result.status.statusCode === "204") {
        return result;
      }
    }
    catch (err) {
      console.error("api consultDataCorporateGovernance: ", err)
    }
    return undefined;
  }

  //salvar gobierno corporativo
  async saveCorporateGovernance(data) {
    /*    
{
   "transactId":1,
    "personId":1,
    "position":"test",
}
     */
    data["status"] = true;
    var result = await this.put(url.URL_BACKEND_GOBIERNOCORPORATIVO, data);
    if (result.statusCode === "500") {
      result = await this.post(url.URL_BACKEND_GOBIERNOCORPORATIVO, data);
    }
    return result;//WatchlistModel.fromJson(result);
  }

  //eliminarGobiernoCoporativo
  async deleteCorporateGovernment(transactId, personId) {

    var data = { transactId: transactId };
    var result = await this.del(url.URL_BACKEND_GOBIERNOCORPORATIVO + "?" + qs.stringify(data));

    return result;//WatchlistModel.fromJson(result);
  }

  ////IGR - RELEVO GENERACIONAL ///////
  /**
   * 
   * OldName: consultarDatosRelevoGeneracional
   * 
  */
  async consultDataRelayGenerational(transactId) {
    try {
      /*{
    "statusCode": "200",
    "statusDesc": "Transacciï¿½n Exitosa",
    "getManagementRelaysInfoResponseDTO": {
        "transactId": 101,
        "observations": "comentario",
        "status": true,
        "date": "2022-01-10"
    },
    "getManagementRelaysResponseDTOList": [
        {
            "transactId": 101,
            "managementRIdentification": 10,
            "name": "pepe",
            "position": "bd",
            "birthDate": "1980-11-11",
            "age": 41,
            "relationship": "lola",
            "status": false
        },
        {
            "transactId": 101,
            "managementRIdentification": 12,
            "name": "pepe",
            "position": "bd",
            "birthDate": "1980-11-11",
            "age": 41,
            "relationship": "lola",
            "status": true
        },
        {
            "transactId": 101,
            "managementRIdentification": 13,
            "name": "pepe",
            "position": "bd",
            "birthDate": "1980-11-11",
            "age": 41,
            "relationship": "lola",
            "status": true
        },
        {
            "transactId": 101,
            "managementRIdentification": 11,
            "name": "pepe",
            "position": "bd",
            "birthDate": "1980-11-11",
            "age": 41,
            "relationship": "lola",
            "status": false
        },
        {
            "transactId": 101,
            "managementRIdentification": 38,
            "name": "vnombre character varying",
            "position": "vcargo character varying",
            "birthDate": "1998-08-17",
            "age": 23,
            "relationship": "vrelacion character varying",
            "status": true
        }
    ]
}*/
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_RELEVOGENERACIONAL + "?" + data);

      if (result.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api consultDataRelayGenerational: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoRelevoGeneracional
   * 
  */
  async newGenerationalRelay(data) {
    try {

      /*
      {
  "transactId":101,
  "name":"vnombre character varying",
  "position":"vcargo character varying",
  "birthDate":"1998-08-17",
  "age":23,
  "relationship":"vrelacion character varying"
}
      */
      var result = await this.post(url.URL_BACKEND_RELEVOGENERACIONAL, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newGenerationalRelay: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarRelevoGeneracional
   * 
  */
  async updateRelevoGeneracional(data) {
    try {

      /*
      {
  "transactId":101,
  "managementRIdentification":10,
  "name":"vnombre character varying",
  "position":"vcargo character varying",
  "birthDate":"1998-08-17",
  "age":23,
  "relationship":"vrelacion character varying",
  "status":true
}
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_RELEVOGENERACIONAL, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateRelevoGeneracional: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarRelevoGeneracional
   * 
  */
  async eliminateGenerationalChange(data) {
    try {
      /*{
  "transactId":101,
    "managementRIdentification":10
}*/
      var result = await this.del(url.URL_BACKEND_RELEVOGENERACIONAL, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminateGenerationalChange: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarSeccionRelevoGeneracional
   * 
  */
  async saveSectionRelevoGeneracional(data) {
    try {
      /*{
    "transactId":1,
    "observations":"ncn",
    "status":true,
    "date":"2022-01-14"
}*/
      var result = await this.post(url.URL_BACKEND_RELEVOGENERACIONALSECTION, data);

      //si es 500 existe, solo debemos actualizar
      if (result.statusCode === "500") {
        data["status"] = true;
        data["date"] = moment().format("YYYY-MM-DD");
        result = await this.put(url.URL_BACKEND_RELEVOGENERACIONALSECTION, data);
      }

      if (result.statusCode === "200") {
        return result;
      }

    }
    catch (err) {
      console.error("api saveSectionRelevoGeneracional: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: consultarSeccionRelevoGeneracional
   * 
  */
  async consultSectionRelevoGeneracional(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_RELEVOGENERACIONAL + "?" + data);

      /*{
   "statusCode": "200",
   "statusDesc": "Transacciï¿½n Exitosa",
   "getManagementRelaysInfoResponseDTO": {
       "transactId": 200,
       "observations": "ncn",
       "status": true,
       "date": "2022-01-14"
   }
} */

      return result.getManagementRelaysInfoResponseDTO?.observations ?? "";
    }
    catch (err) {
      console.error("api consultSectionRelevoGeneracional: ", err)
    }
    return undefined;
  }

  ////IGR - GUARDAR Flujo Operativo///////
  /**
   * 
   * OldName: guardarFlujoOperativo
   * 
  */
  async saveOperatingFlow(data) {
    try {
      /*
      {
"transactId":"8",
"observations":"ee445",
"infoDate":"2021-12-10"
}
      */

      //Guardamos
      var result = await this.post(url.URL_BACKEND_FLUJOOPERATIVO_IGR, data);
      //OK
      /*var result ={
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
      }*/

      //si es 500 existe, solo debemos actualizar
      if (result.statusCode === "500") {
        data["status"] = true;
        result = await this.put(url.URL_BACKEND_FLUJOOPERATIVO_IGR, data);
      }

      if (result.statusCode === "200") {
        return result;
      }

    }
    catch (err) {
      console.error("api saveOperatingFlow", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: consultarFlujoOperativo
   * 
  */
  async consultOperatingFlow(transactId) {
    try {
      //vidtramite=44&vidproceso=5&vidactividad=1
      var params = { vidtramite: transactId, vidproceso: opt.PROCESS_INFORMEGESTION, vidactividad: opt.ACT_FLUJOOPERATIVO }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_FLUJOOPERATIVO_IGR + "?" + data);

      /*
      {
    "transactId": 199,
    "observations": "prueba",
    "infoDate": "2021-12-29",
    "status": true,
    "attachments": []}
      */

      if (result.transactId !== null) {
        return result;
      }
    }
    catch (err) {
      console.error("api consultOperatingFlow: ", err)
    }
    return undefined;
  }

  ////IGR - EMPRESAS RELACIONADAS///////
  /**
   * 
   * OldName: consultarDatosEmpresaRelacionada
   * 
  */
  async consultRelatedCompanyData(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_EMPRESARELACIONADA + "?" + data);

      /*
      {
    "transactId": 104,
    "observations": "tets",
    "date": "2022-01-24",
    "estado": true,
    "relatedCompanies": [
        {
            "trasactId": 104,
            "companyId": 25,
            "name": "1113",
            "activity": "112",
            "sectorExperience": 12,
            "relationship": "ffff",
            "status": true
        },
        {
            "trasactId": 104,
            "companyId": 27,
            "name": "1113",
            "activity": "112",
            "sectorExperience": 12,
            "relationship": "ffff",
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacción Exitosa"
    }
}
      */
      return result;
    }
    catch (err) {
      console.error("api consultRelatedCompanyData: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoEmpresaRelacionada
   * 
  */
  async newCompanyRelated(data) {
    try {
      /*{
    "serviceResponseTO": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    },
    "companyId": 11
} */
      var result = await this.post(url.URL_BACKEND_EMPRESARELACIONADA, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newCompanyRelated: ", err)
    }
    return undefined;


  }

  /**
   * 
   * OldName: actualizarEmpresaRelacionada
   * 
  */
  async updateCompanyRelated(data) {
    try {
      /*{
    "trasactId":1,
    "companyId":15,
    "name":"maicol up",
    "activity":"actividad up",
    "sectorExperience":10,
    "relationship":"relaciona up",
    "status":true
}*/
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_EMPRESARELACIONADA, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateCompanyRelated: ", err)
    }
    return undefined;


  }

  /**
   * 
   * OldName: eliminarEmpresaRelacionada
   * 
  */
  async removeRelatedCompany(data) {
    try {
      /*trasactId:101,companyId:11 */
      var result = await this.del(url.URL_BACKEND_EMPRESARELACIONADA + "?" + qs.stringify(data), data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api removeRelatedCompany: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarSeccionEmpresaRelacionada
   * 
  */
  async saveRelatedCompanySection(data) {
    try {
      data = {
        "trasactId": data.trasactId,
        "description": data.description
      }
      var result = await this.post(url.URL_BACKEND_EMPRESARELACIONADASECCION, data);

      //si es 500 existe, solo debemos actualizar
      if (result.statusCode === "500") {
        data["status"] = true;
        result = await this.put(url.URL_BACKEND_EMPRESARELACIONADASECCION, data);
      }

      if (result.statusCode === "200") {
        return result;
      }

    }
    catch (err) {
      console.error("api saveRelatedCompanySection: ", err)
    }
    return undefined;


  }


  ////IGR - INFORMACIóN CLIENTE ///////
  /**
   * 
   * OldName: consultarListaClientesIGR
   * 
  */
  async consultListaClientesIGR(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_INFOCLIENTE + "?" + data);
      /*{
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa",
          "getClientsInformationDTO": null,
          "clientsInformationListDTOList": [
              {
                  "transactId": 101,
                  "customerInfoId": 1,
                  "name": "enrique5",
                  "country": "pana",
                  "salePercentage": 75.55,
                  "customerType": "cred",
                  "salesType": "cred",
                  "delayReason": "cred",
                  "termDays": 90,
                  "status": true
              },{
                  "transactId": 101,
                  "customerInfoId": 3,
                  "name": "enrique5",
                  "country": "pana",
                  "salePercentage": 75.55,
                  "customerType": "cred",
                  "salesType": "cred",
                  "delayReason": "cred",
                  "termDays": 90,
                  "status": true
              }
          ]
      }*/
      if (result.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api consultListaClientesIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoClienteIGR
   * 
  */
  async newClientIGR(data) {
    try {

      /*
      {
  "transactId":104,
    "name":"enrique5",
    "country":"pana",
    "salePercentage":75.55,
    "customerType":"cred",
    "salesType":"cred",
    "delayReason":"cred",
    "termDays":90
}

      */
      var result = await this.post(url.URL_BACKEND_INFOCLIENTE, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newClientIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarClienteIGR
   * 
  */
  async updateIGRClient(data) {
    try {

      /*
      {
    "transactId": 104,
    "customerInfoId": 14,
    "name": "enrique5",
    "country": "pana",
    "salePercentage": 75.55,
    "customerType": "cred",
    "salesType": "cred",
    "delayReason": "cred",
    "termDays": 90,
    "status": true
}
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_INFOCLIENTE, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateIGRClient: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarClienteIGR
   * 
  */
  async removeClientIGR(data) {
    try {
      /*transactId:101,customerIdentification:2 */
      var result = await this.del(url.URL_BACKEND_INFOCLIENTE + "?" + qs.stringify(data), data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api removeClientIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarSeccionClienteIGR
   * 
  */
  async saveClientSectionIGR(data) {
    try {
      /*{
    "transactId": 101,
    "description": "ddd",
    "seasonalSales": false,
    "percSeasonalPeriodSales": 0.5,
    "dateInformation": "2022-01-14"
}*/
      data["dateInformation"] = moment().format("YYYY-MM-DD");//"2021-11-10";
      var result = await this.post(url.URL_BACKEND_INFOCLIENTESECCION, data);

      //si es 500 existe, solo debemos actualizar
      if (result.statusCode == "500") {
        data["status"] = true;
        result = await this.put(url.URL_BACKEND_INFOCLIENTESECCION, data);
      }

      return result;

    }
    catch (err) {
      console.error("api saveClientSectionIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: guardarSeccionClienteIGR
   * 
  */
  async consultIGRClientSection(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_INFOCLIENTESECCION + "?" + data);

      /*
      {
    "statusCode": "200",
    "statusDesc": "Transacciï¿½n Exitosa",
    "clientSectionCompaniesDTO": {
        "transactId": 101,
        "description": "ddd",
        "seasonalSales": false,
        "percSeasonalPeriodSales": 0.5,
        "dateInformation": "2022-01-14",
        "status": true
    }
}
      */

      return result.clientSectionCompaniesDTO;
    }
    catch (err) {
      console.error("api consultIGRClientSection: ", err)
    }
    return undefined;
  }

  ////IGR - INFORMACIóN PROVEEOR ///////
  /**
   * 
   * OldName: consultarListaProveedoresIGR
   * 
  */
  async consultListaProvidersIGR(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_INFOPROVEEDORES + "?" + data);
      /**/
      return result;
    }
    catch (err) {
      console.error("api consultListaProvidersIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoProveedorIGR
   * 
  */
  async newProviderIGR(data) {
    try {

      /*
      {
    "transactId": 101,
    "name": "Provedor de prueba",
    "oldRelationship": 2,
    "percentPurchases": 2.35788,
    "creditDays": 30,
    "negotiationConditions": "prueba de negociacion",
    "country": "panama"
}
      */
      var result = await this.post(url.URL_BACKEND_IGR_INFOPROVEEDORES, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newProviderIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarProveedorIGR
   * 
  */
  async updateProviderIGR(data) {
    try {

      /*
      {
    "transactId": 11,
    "providerId": 1,
    "name": "provedor actualizado",
    "oldRelationship": 52,
    "percentPurchases": 30.255,
    "creditDays": 20,
    "negotiationConditions": "condiccion de prueba actualizada",
    "country": "colombia",
    "status": false
}
      */
      data["status"] = true;

      var result = await this.put(url.URL_BACKEND_IGR_INFOPROVEEDORES, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateProviderIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarProveedorIGR
   * 
  */
  async removeIGRProvider(data) {
    try {
      /*transactId:101,vidproveedor:2 */
      var result = await this.del(url.URL_BACKEND_IGR_INFOPROVEEDORES + "?" + qs.stringify(data), data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api removeIGRProvider: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarSeccionProveedorIGR
   * 
  */
  async saveProviderSectionIGR(data) {
    try {
      /*{
  "transactId": 1,
  "description": "descripcion text",
  "purchasingCycle": "ciclocompras character varying"
}*/
      var result = await this.post(url.URL_BACKEND_IGR_INFOPROVEEDORESSECCION, data);

      //si es 500 existe, solo debemos actualizar
      if (result.statusCode === "500") {
        data["status"] = true;
        result = await this.put(url.URL_BACKEND_IGR_INFOPROVEEDORESSECCION, data);
      }

      if (result.statusCode === "200") {
        return result;
      }

    }
    catch (err) {
      console.error("api saveProviderSectionIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: consultarSeccionProveedorIGR
   * 
  */
  async consultProviderSectionIGR(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_INFOPROVEEDORESSECCION + "?" + data);

      /*
      {
    "suppliersList": {
        "transactId": 1,
        "description": "descripcion text",
        "purchasingCycle": "ciclocompras character varying",
        "status": true
    },
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}
      */

      if (result.status.statusCode === "200" || result.status.statusCode === "204") {
        return result.suppliersList;
      }
    }
    catch (err) {
      console.error("api consultProviderSectionIGR: ", err)
    }
    return undefined;
  }

  ////IGR - INFORMACIóN RECIPROCIDAD ///////
  /**
   * 
   * OldName: consultarListaReciprocidadIGR
   * 
  */
  async consultIGRReciprocityList(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_RECIPROCIDAD + "?" + data);
      /*{
    "reciprocity": [
        {
            "transactId": 108,
            "reciprocity_id": 9,
            "year": 2022,
            "month": "Enero",
            "sales": 200,
            "deposits": 4000,
            "averageBalance": 2400,
            "reciprocity": 200,
            "sow": 20,
            "status": false
        },
        {
            "transactId": 108,
            "reciprocity_id": 11,
            "year": 2022,
            "month": "Enero",
            "sales": 200,
            "deposits": 4000,
            "averageBalance": 2400,
            "reciprocity": 200,
            "sow": 20,
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}*/
      return result;
    }
    catch (err) {
      console.error("api consultIGRReciprocityList: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoReciprocidadIGR
   * 
  */
  removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  async newReciprocityIGR(data) {
    // let jsonError={
    //   code:"400",
    //   message:"Error del servidor",
    //   functionName:"newReciprocityIGR",
    //   serviceType:"bk",
    //   error:true
    // }
    // localStorage.setItem("jsonError",JSON.stringify(jsonError))
    // return
    try {

      /*
      {
  "transactId": 108,
    "year":2021,
    "month":"December",
    "sales":200,
    "deposits":4000,
    "averageBalance":2400,
    "reciprocity":200,
    "sow":"20"
}
      */
data["t24"] = false;
      var result = await this.post(url.URL_BACKEND_IGR_RECIPROCIDAD, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newReciprocityIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarReciprocidadIGR
   * 
  */
  async updateReciprocityIGR(data) {
    try {

      /*
      {
  "transactId": 101,
    "reciprocity_id":1,
    "year":2021,
    "month":"December",
    "sales":200,
    "deposits":4000,
    "averageBalance":2400,
    "reciprocity":200,
    "sow":"20",
    "status":true
}
      */
      data["status"] = true;
      data["t24"] = false;

      var result = await this.put(url.URL_BACKEND_IGR_RECIPROCIDAD, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateReciprocityIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarReciprocidadIGR
   * 
  */
  async removeReciprocityIGR(data) {
    try {
      /*transactId:101,reciprocityId:2 */
      var result = await this.del(url.URL_BACKEND_IGR_RECIPROCIDAD + "?" + qs.stringify(data), data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api removeReciprocityIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarSeccionReciprocidad
   * 
  */
  async saveSectionReciprocity(data) {
    try {
      /*{
"transactId":4,
"observations":"Cambios"
}
      */
      var result = await this.post(url.URL_BACKEND_IGR_RECIPROCIDADSECCION, data);

      /*OK
      {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
      }
      */

      //si es 500 existe, solo debemos actualizar
      if (result.statusCode === "500") {
        data["status"] = true;
        result = await this.put(url.URL_BACKEND_IGR_RECIPROCIDADSECCION, data);
      }

      if (result.statusCode === "200") {
        return result;
      }

    }
    catch (err) {
      console.error("api saveSectionReciprocity", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: consultarSeccionReciprocidad
   * 
  */
  async consultSectionReciprocity(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_RECIPROCIDADSECCION + "?" + data);

      /*
      {
    "reciprocity": [
        [
            101,
            "Cambios",
            "2022-01-24",
            true
        ]
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacción exitosa"
    }
}
      */

      if (result.status.statusCode === "200" || result.status.statusCode === "204") {
        return result.reciprocity[0].observations;
      }
    }
    catch (err) {
      console.error("api consultSectionReciprocity: ", err)
    }
    return undefined;
  }


  ////IGR - INFORMACIóN ACTIVOS FIJOS ///////
  /**
   * 
   * OldName: consultarActivosFijosIGR
   * 
  */
  async consultFixedAssetsIGR(transactId) {
    try {

      var params = { transactId: transactId, processId: opt.PROCESS_INFORMEGESTION, activityId: opt.ACT_FACILIDADACTIVOSFIJOS }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_ACTIVOSFIJOS + "?" + data);
      /*
      {
    "fixedAssets": [
        {
            "transactId": 101,
            "facilityAssetId": 1,
            "address": "vdireccion",
            "propertyType": {
                "code": "vtipopropiedad",
                "name": ""
            },
            "observations": "vdescripcion",
            "ownerCompany": "vsociedadpropietaria",
            "leaseFee": 5.66,
            "leaseConditions": "vcondicionesarrendamiento",
            "contractDuration": 3,
            ""
            "status": true
        }
    ],
    "attachments": [],
    "variationsAssets": null,
    "variationsAssetsObs": null,
    "manufacturingAgroCompanies": null,
    "productionLine": null,
    "capacity": null,
    "usedCapacity": null,
    "tradingCompany": null,
    "warehouseCapacity": null,
    "transportDistributionFleet": null,
    "units": null,
    "renovation": null,
    "notApplicable":"false"
    "status": null,
    "serviceStatus": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}
      */
      if (result.serviceStatus.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api consultFixedAssetsIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoActivosFijosIGR
   * 
  */
  async newFixedAssetsIGR(data) {
    try {

      /*
      {
    "transactId": 101,
    "address": "vdireccion",
    "propertyType": {
        "code": "vtipopropiedad",
        "name": "se deja en blanco, pero hace parte del json."
    },
    "observations": "vdescripcion",
    "ownerCompany": "vsociedadpropietaria",
    "leaseFee": 5.66,
    "rentAmount":0.00,
    "leaseConditions": "vcondicionesarrendamiento",
    "contractDuration": 3
}
      */
      var result = await this.post(url.URL_BACKEND_IGR_ACTIVOSFIJOS, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newFixedAssetsIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarActivosFijosIGR
   * 
  */
  async updateFixedAssetsIGR(data) {
    try {

      /*
      {
    "transactId": 101,
    "facilityAssetId":2,
    "address": "vdireccion",
    "propertyType": {
        "code": "vtipopropiedad",
        "name": "se deja en blanco, pero hace parte del json."
    },
    "observations": "vdescripcion",
    "ownerCompany": "vsociedadpropietaria",
    "leaseFee": 5.66,
    "rentAmount": 10.55,
    "leaseConditions": "vcondicionesarrendamiento",
    "contractDuration": 3,
    "status":true
}
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_IGR_ACTIVOSFIJOS, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateFixedAssetsIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarActivosFijosIGR
   * 
  */
  async removeFixedAssetsIGR(data) {
    try {
      /*transactId:101,fixedAssetId:2 */
      var result = await this.del(url.URL_BACKEND_IGR_ACTIVOSFIJOS + "?" + qs.stringify(data), data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarEmpresaRelacionada: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarSeccionActivosFijosIGR
   * 
  */
  async saveSectionFixedAssetsIGR(data) {
    try {

      /*
      {
    "transactId": 1,
    "variationsAssets": true,
    "variationsAssetsObs": "vdescripcionvariaciones",
    "manufacturingAgroCompanies": true,
    "productionLine": "vlineaproduccion",
    "capacity": "vcapacidad",
    "usedCapacity": "vcapacidadutilizada",
    "tradingCompany": true,
    "warehouseCapacity": "vcapacidadalmacen",
    "transportDistributionFleet": true,
    "units": "vunidades",
    "renovation": "vrenovacion",
}
      */
      var result = await this.post(url.URL_BACKEND_IGR_ACTIVOSFIJOSSECCION, data);
      //si es 500 existe, solo debemos actualizar
      if (result.statusCode === "500") {
        data["status"] = true;
        result = await this.put(url.URL_BACKEND_IGR_ACTIVOSFIJOSSECCION, data);
      }

      if (result.statusCode === "200") {
        return result;
      }

    }
    catch (err) {
      console.error("api saveSectionFixedAssetsIGR: ", err)
    }
    return undefined;

  }

  ////IGR - INFORMACIóN SEGUROS ///////
  /**
   * 
   * OldName: consultarSegurosEmpresaIGR
   * 
  */
  async consultInsuranceCompanyIGR(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_SEGUROSEMPRESA + "?" + data);
      /*{
    "statusCode": "200",
    "statusDesc": "Transacciï¿½n Exitosa",
    "companyInsurance": [
        {
            "transactId": 101,
            "insuranceId": 1,
            "company": "Comision",
            "insuranceType": null,
            "amount": 5.0,
            "dueDate": "2021-12-29T05:00:00.000+00:00",
            "status": true
        }
    ]
}*/
      if (result.serviceStatus.statusCode === "200") {
        return result.companyInsurance;
      }
    }
    catch (err) {
      console.error("api consultInsuranceCompanyIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoSegurosEmpresaIGR
   * 
  */
  async newInsuranceCompanyIGR(data) {
    try {

      /*
      {
    "transactId":101,
    "company":"Comision",
    "insuranceType":{
        "code":"Seguro",
        "name":""
    },
    "amount":5.000,
    "dueDate":"2021-12-30"
}
      */
      var result = await this.post(url.URL_BACKEND_IGR_SEGUROSEMPRESA, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newInsuranceCompanyIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarSegurosEmpresaIGR
   * 
  */
  async updateInsuranceCompanyIGR(data) {
    try {

      /*
      {
    "transactId":101,
    "insuranceId":1,
    "company":"Company",
    "insuranceType":{
        "code":"Seguro",
        "name":""
    },
    "amount":5.000,
    "dueDate":"2021-12-27",
    "status":"true"
}
      */
      data["status"] = true;

      var result = await this.put(url.URL_BACKEND_IGR_SEGUROSEMPRESA, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api nuevoProveedorIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarSegurosEmpresaIGR
   * 
  */
  async deleteInsuranceCompanyIGR(data) {
    try {
      /*transactId:101,InsuranceId:2 */
      var result = await this.del(url.URL_BACKEND_IGR_SEGUROSEMPRESA + "?" + qs.stringify(data), data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api deleteInsuranceCompanyIGR: ", err)
    }
    return undefined;
  }

  ////IGR - GUARDAR ARQUITECTURA EMPRESARIAL///////
  /**
   * 
   * OldName: guardarArquitecturaEmpresarialIGR
   * 
  */
  async saveArchitectureBusinessIGR(data) {
    try {
      /*
      {
"transactId": 101,
  "ticCompanyUse":"Ganaderia",
  "auditedAreas":"Santander"
}
      */

      //Guardamos
      var result = await this.post(url.URL_BACKEND_IGR_ARQUITECTURAEMPRESARIAL, data);
      //OK
      /*var result ={
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
      }*/

      //si es 500 existe, solo debemos actualizar
      if (result.statusCode !== "200") {
        data["status"] = true;
        result = await this.put(url.URL_BACKEND_IGR_ARQUITECTURAEMPRESARIAL, data);
      }

      if (result.statusCode === "200") {
        return result;
      }

    }
    catch (err) {
      console.error("api saveArchitectureBusinessIGR", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: consultarArquitecturaEmpresarialIGR
   * 
  */
  async consultBusinessArchitectureIGR(transactId) {
    try {

      var params = { transactId: transactId, processId: opt.PROCESS_INFORMEGESTION, activityId: opt.ACT_ARQUITECTURAEMPRESARIAL }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_ARQUITECTURAEMPRESARIAL + "?" + data);

      /*
      {
  "transactId": 101,
  "ticCompanyUse": "Ganaderia",
  "auditedAreas": "Santander",
  "status": true,
  "attachments": []
}
      */

      if (result.transactId !== null) {
        return result;
      }
    }
    catch (err) {
      console.error("api consultBusinessArchitectureIGR: ", err)
    }
    return undefined;
  }

  ////IGR - COMPERTIDORES DEL MERCADO ///////
  /**
   * 
   * OldName: consultarCompetidores
   * 
  */
  async consultCompetitors(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_COMPETIDORESMERCADO + "?" + data);

      /*{
    "competitors": [
      {
        "transactId":13,
    "competitorId":1,
    "name":"COMPETICION",
    "description":"LISTA COMPETICION",
    "status":true
      }
    ],
    "status": {
        "statusCode": "204",
        "statusDesc": "Sin contenido"
    }
} */
      return result;
    }
    catch (err) {
      console.error("api consultCompetitors: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoCompetidorIGR
   * 
  */
  async newCompetitorIGR(data) {
    try {

      /*
      {
    "transactId":1,
    "name":"COMPETICION",
    "description":"LISTA COMPETICION"
}
      */
      var result = await this.post(url.URL_BACKEND_COMPETIDORESMERCADO, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newCompetitorIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarCompetidorIGR
   * 
  */
  async updateCompetitorIGR(data) {
    try {

      /*
      {
    "transactId":4,
    "competitorId":8,
    "name":"CARRERA",
    "description":"LISTA CARRERA",
    "status":true
}
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_COMPETIDORESMERCADO, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateCompetitorIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarCompetidorIGR
   * 
  */
  async removeCompetitorIGR(data) {
    try {
      /*transactId:101,competitorId:2 */
      var result = await this.del(url.URL_BACKEND_COMPETIDORESMERCADO + "?" + qs.stringify(data), data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api removeCompetitorIGR: ", err)
    }
    return undefined;
  }

  ////IGR - PROYECCIONES ///////
  /**
   * 
   * OldName: consultarProyecciones
   * 
  */
  async consultProjections(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_PROYECCIONES + "?" + data);

      /*
      {
    "projectionsDTO": {
        "transactId": 1,
        "descripcion": "gggsgsgsgsgs",
        "assetsOperatingAmount": 3,
        "assetsOperatingReason": "jhfjshdhshd",
        "fixedAssetsAmount": 3,
        "fixedAssetsReason": "jhfjshdhshd",
        "othersAssetsAmount": 3,
        "othersAssetsReason": "jhfjshdhshd",
        "bankAmount": 3,
        "bankReason": "jhfjshdhshd",
        "providersAmount": 3,
        "providersReason": "jhfjshdhshd",
        "capitalAmount": 3,
        "capitalReason": "jhfjshdhshd",
        "maximodeuda": 3,
        "estimatedDate": "1970-01-19",
        "status": true
    },
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacción Exitosa"
    }
}
      */
      if (result.status.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api consultProjections: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarProyecciones
   * 
  */
  async saveProjections(data) {
    try {

      /*
      {
"transactId":1,
"descripcion":"gggsgsgsgsgs",
"assetsOperatingAmount":3,
"assetsOperatingReason":"jhfjshdhshd",
"fixedAssetsAmount":3,
"fixedAssetsReason":"jhfjshdhshd",
"othersAssetsAmount":3,
"othersAssetsReason":"jhfjshdhshd",
"bankAmount":3,
"bankReason":"jhfjshdhshd",
"providersAmount":3,
"providersReason":"jhfjshdhshd",
"capitalAmount":3,
"capitalReason":"jhfjshdhshd",
"maximodeuda":3,
"estimatedDate":"2022-01-15"
}
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_PROYECCIONES, data);
      if (result.statusCode !== "200") {
        result = await this.post(url.URL_BACKEND_PROYECCIONES, data);
      }

      return result;


    }
    catch (err) {
      console.error("api saveProjections: ", err)
    }
    return undefined;
  }

  ////IGR - INFORMACION GARANTES///////
  /**
   * 
   * OldName: consultarGarantes
   * 
  */
  async consultGuarantors(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_GARANTES + "?" + data);

      /*
      {
    "transactId": 1,
    "guarantors": [
        {
            "guarantorId": 1,
            "documentType": "vtipodocumento up",
            "guarantorDocument": "vdocumentogarante up",
            "isGuarantor": true,
            "name": "vnombre up",
            "secondName": "vsegnombre up",
            "lastName": "vapellido up",
            "secondLastName": "vsegapellido up",
            "guarantorRelationship": "vrelaciongarante up",
            "origin": "vprocedenciabien up",
            "guarantorCommitment": "vcompromisogarante up",
            "warrantyReason": "vrazongarantia up",
            "date": "2022-01-17",
            "status": false
        },
        {
            "guarantorId": 2,
            "documentType": "vtipodocumento up",
            "guarantorDocument": "vdocumentogarante up",
            "isGuarantor": true,
            "name": "vnombre up",
            "secondName": "vsegnombre up",
            "lastName": "vapellido up",
            "secondLastName": "vsegapellido up",
            "guarantorRelationship": "vrelaciongarante up",
            "origin": "vprocedenciabien up",
            "guarantorCommitment": "vcompromisogarante up",
            "warrantyReason": "vrazongarantia up",
            "date": "2022-01-17",
            "status": false
        },
        {
            "guarantorId": 3,
            "documentType": "vtipodocumento character varying",
            "guarantorDocument": "vdocumentogarante character varying",
            "isGuarantor": true,
            "name": "vnombre character varying",
            "secondName": "vsegnombre character varying",
            "lastName": "vapellido character varying",
            "secondLastName": "vsegapellido character varying",
            "guarantorRelationship": "vrelaciongarante text",
            "origin": "vprocedenciabien text",
            "guarantorCommitment": "vcompromisogarante text",
            "warrantyReason": "vrazongarantia text",
            "date": "2022-01-19",
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}

      */
      return result.guarantors;
    }
    catch (err) {
      console.error("api consultGuarantors: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoGarante
   * 
  */
  async newGuarantor(data) {
    try {

      /*
      {
  "transactId": 1,
  "documentType": "CED",
  "guarantorDocument": "vdocumentogarante character varying",
  "isGuarantor": true,
  "name": "vnombre character varying",
  "secondName": "vsegnombre character varying",
  "lastName": "vapellido character varying",
  "secondLastName": "vsegapellido character varying",
  "guarantorRelationship": "vrelaciongarante text",
  "origin": "vprocedenciabien text",
  "guarantorCommitment": "vcompromisogarante text",
  "warrantyReason": "vrazongarantia text"
}
      */

      return await this.post(url.URL_BACKEND_GARANTES, data);

    }
    catch (err) {
      console.error("api newGuarantor: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarGarante
   * 
  */
  async updateGuarantor(data) {
    try {
      /*
      {
    "transactId": 44,
    "guarantorId": 1,
    "documentType": "vtipodocumento up",
    "guarantorDocument": "vdocumentogarante up",
    "isGuarantor": true,
    "name": "vnombre up",
    "secondName": "vsegnombre up",
    "lastName": "vapellido up",
    "secondLastName": "vsegapellido up",
    "guarantorRelationship": "vrelaciongarante up",
    "origin": "vprocedenciabien up",
    "guarantorCommitment": "vcompromisogarante up",
    "warrantyReason": "vrazongarantia up",
    "date": "2022-01-18",
    "status": true}
      */
      data["date"] = moment().format("YYYY-MM-DD");//"2021-11-10";
      data["status"] = true;
      return await this.put(url.URL_BACKEND_GARANTES, data);
    }
    catch (err) {
      console.error("api updateGuarantor: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarGarante
   * 
  */
  async removeGuarantor(data) {
    try {
      /*transactId:101,guarantorId:2 */
      var result = await this.del(url.URL_BACKEND_GARANTES + "?" + qs.stringify(data), data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api removeGuarantor: ", err)
    }
    return undefined;
  }

  ////IGR - SOW ACTUAL ///////
  /**
   * 
   * OldName: consultarSowActualIGR
   * 
  */
  async consultSowActualIGR(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_PROPUESTACREDITO_SOWACTUAL + "?" + data);
      /*{
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa",
          "transactId": 101,
          "currentSOWDTOList": [
              {
                  "currentSowId": 2,
                  "otherBanks": 35.55,
                  "banesco": 30.23,
                  "total": 55.55,
                  "sow": 40.25,
                  "status": true
              }
          ]
      }*/
      if (result.statusCode === "204") {
        return result;
      }
    }
    catch (err) {
      console.error("api consultSowActualIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoSowActualIGR
   * 
  */
  async newSowCurrentIGR(data) {
    try {

      /*
      {
     "transactId":101,
       "otherBanks":35.55,
       "banesco":30.23,
       "total":55.55,
       "sow":40.25
  }
      */
      var result = await this.post(url.URL_BACKEND_PROPUESTACREDITO_SOWACTUAL, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newSowCurrentIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarSowActualIGR
   * 
  */
  async updateSowActualIGR(data) {
    try {

      /*
      {
      "transactId": 101,
      "currentSowId": 2,
      "otherBanks": 20.55,
      "banesco": 30.23,
      "total": 55.55,
      "sow": 40.25,
      "status": true
  }
      */
      data.status = true;
      var result = await this.put(url.URL_BACKEND_PROPUESTACREDITO_SOWACTUAL, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateSowActualIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarSowActualIGR
   * 
  */
  async removeSowCurrentIGR(data) {
    try {
      /*transactId:101,currentSowId:2 */
      var result = await this.del(url.URL_BACKEND_PROPUESTACREDITO_SOWACTUAL + "?" + qs.stringify(data), data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api removeSowCurrentIGR: ", err)
    }
    return undefined;
  }

  ////IGR - SOW PROPUESTO ///////
  /**
   * 
   * OldName: consultarSowPropuestoIGR
   * 
  */
  async consultSowProposedIGR(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_PROPUESTACREDITO_SOWPROPUESTO + "?" + data);
      /*{
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa",
          "transactId": 101,
          "currentSOWDTOList": [
              {
                  "currentSowId": 2,
                  "otherBanks": 35.55,
                  "banesco": 30.23,
                  "total": 55.55,
                  "sow": 40.25,
                  "status": true
              }
          ]
      }*/
      console.log(result);
      if (result.statusCode === "200") {
        return result;
      }
      if (result.statusCode === "204") {
        return result;
      }
    }
    catch (err) {
      console.error("api consultSowProposedIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoSowPropuestoIGR
   * 
  */
  async newSowProposedIGR(data) {
    try {

      /*
      {
     "transactId":101,
       "otherBanks":35.55,
       "banesco":30.23,
       "total":55.55,
       "sow":40.25
  }
      */
      var result = await this.post(url.URL_BACKEND_PROPUESTACREDITO_SOWPROPUESTO, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newSowProposedIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarSowPropuestoIGR
   * 
  */
  async updateSowProposedIGR(data) {
    try {
      data.status = true;
      /*
      {
      "transactId": 101,
      "currentSowId": 2,
      "otherBanks": 20.55,
      "banesco": 30.23,
      "total": 55.55,
      "sow": 40.25,
      "status": true
  }
      */
      var result = await this.put(url.URL_BACKEND_PROPUESTACREDITO_SOWPROPUESTO, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateSowProposedIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarSowPropuestoIGR
   * 
  */
  async deleteSowProposedIGR(data) {
    try {
      /*transactId:101,currentSowId:2 */
      var result = await this.del(url.URL_BACKEND_PROPUESTACREDITO_SOWPROPUESTO + "?" + qs.stringify(data), data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api deleteSowProposedIGR: ", err)
    }
    return undefined;
  }

  ////IGR - ASPECTOS AMBIENTALES///////
  /**
   * 
   * OldName: consultarAspectosAmbientalesIGR
   * 
  */
  async consultEnvironmentalAspectsIGR(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_PROPUESTACREDITO_ASPECTOSAMBIENTALES + "?" + data);

      /*{
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa",
      "environmentalAspectsDTO": {
          "transactId": 101,
          "riskPreClassification": "2",
          "sustainableCreditRating": "2",
          "riskClassificationConfirmation": "2",
          "natureLocationProject": true,
          "physicalResettlement": true,
          "environmentalPermits": true,
          "newProject": true,
          "workersContractors": true,
          "status": true
      }
  } */
      if (result.statusCode === "200" || result.statusCode === "204") {
        return result;
      }
      return undefined;
    }
    catch (err) {
      console.error("api consultEnvironmentalAspectsIGR: ", err);
      throw err;
    }
  }
  async getJsonRAS() {
    try {
      var result = await this.get(url.URL_BACKEND_JSONASPECTOSAMBIENTALES);
      /*{
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa",
      "environmentalAspectsDTO": {
          "transactId": 101,
          "riskPreClassification": "2",
          "sustainableCreditRating": "2",
          "riskClassificationConfirmation": "2",
          "natureLocationProject": true,
          "physicalResettlement": true,
          "environmentalPermits": true,
          "newProject": true,
          "workersContractors": true,
          "status": true
      }
  } */
      return result;
      return undefined;
    }
    catch (err) {
      console.error("api consultEnvironmentalAspectsIGR: ", err);
      throw err;
    }
  }

  /**
   * 
   * OldName: guardarAspectosAmbientalesIGR
   * 
  */
  async saveEnvironmentalAspectsIGR(data) {
    try {

      /*
      {
      "transactId": 101,
      "riskPreClassification": "2",
      "sustainableCreditRating": "2",
      "riskClassificationConfirmation": "2",
      "natureLocationProject": true,
      "physicalResettlement": true,
      "environmentalPermits": true,
      "newProject": true,
      "workersContractors": true
  }
      */
      var result = await this.post(url.URL_BACKEND_PROPUESTACREDITO_ASPECTOSAMBIENTALES, data);

      //si es 500 existe, solo debemos actualizar
      if (result.statusCode === "500") {
        data["status"] = true;
        result = await this.put(url.URL_BACKEND_PROPUESTACREDITO_ASPECTOSAMBIENTALES, data);
      }
      return result;
    }
    catch (err) {
      console.error("api saveEnvironmentalAspectsIGR: ", err);
      throw err;
    }
  }

  ////IGR - RELACIONES BANCARAS - DEUDAS CP ///////
  /**
   * 
   * OldName: consultarRelacionesBancariasDeudasCP
   * 
  */
  async consultBankingRelationsDebtsCP(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_DEUDASBANCARIACP + "?" + data);
      /*{
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa",
          "transactId": 101,
          "getBankingRelationCPDTOList": [
              {
                  "debtId": 1,
                  "bank": "bb",
                  "facilityType": "bb",
                  "amount": 0.5,
                  "date": "2021-11-11",
                  "expirationDate": "2021-11-11",
                  "debitBalance1": 0.5,
                  "debitBalance2": 0.5,
                  "debitBalance3": 0.5,
                  "rate": 0.5,
                  "fee": 0.5,
                  "bail": "bb",
                  "fundDestiny": "bb",
                  "paymentHistory": "fake_data",
                  "status": true
              }
          ]
      }*/
      return result;
    }
    catch (err) {
      console.error("api consultBankingRelationsDebtsCP: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoRelacionesBancariasDeudasCP
   * 
  */
  async newBankingRelationsDebtsCP(data) {
    try {

      /*
      {
      "transactId": 101,
      "bank": "bb",
      "facilityType": "bb",
      "amount": 0.5,
      "date": "2021-11-11",
      "expirationDate": "2021-11-11",
      "debitBalance1": 0.5,
      "debitBalance2": 0.5,
      "debitBalance3": 0.5,
      "rate": 0.5,
      "fee": 0.5,
      "bail": "bb",
      "fundDestiny": "bb",
      "paymentHistory": "fake_data"
      
  }
      */
  if(data["t24"]===undefined){
    data["t24"] = false;
  }

      var result = await this.post(url.URL_BACKEND_IGR_DEUDASBANCARIACP, data);

      console.error("newBankingRelationsDebtsCP", result)

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newBankingRelationsDebtsCP: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarRelacionesBancariasDeudasCP
   * 
  */
  async updateBankRelationsDebtsCP(data) {
    try {

      /*
      {facilityType: "Linea de credito rotativa", amount: 25000, date: "", expirationDate: "",…}
amount: 25000
bail: " "
bank: ""
date: ""
debitBalance1: 0
debitBalance2: 0
debitBalance3: 0
debtId: 37
expirationDate: ""
facilityType: "Linea de credito rotativa"
fee: 0
fundDestiny: ""
rate: 0,
"paymentHistory": "fake_data",
status: true
transactId: 3106

      {
      "transactId": 101,
      "debtId": 1,
      "bank": "cc",
      "facilityType": "cc",
      "amount": 0.5,
      "date": "2021-11-11",
      "expirationDate": "2021-11-11",
      "debitBalance1": 0.5,
      "debitBalance2": 0.5,
      "debitBalance3": 0.5,
      "rate": 0.5,
      "fee": 0.5,
      "bail": "cc",
      "fundDestiny": "cc",
      "paymentHistory": "fake_data",
      "status": true
  }
      */

  if(data["t24"]===undefined){
    data["t24"] = false;
  }

      // data["date"] = moment().format("YYYY-MM-DD");
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_IGR_DEUDASBANCARIACP, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateBankRelationsDebtsCP: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarRelacionesBancariasDeudasCP
   * 
  */
  async eliminateBankingRelationshipsDebtsCP(data) {
    try {
      /*transactId:101,debtId:1 */
      var result = await this.del(url.URL_BACKEND_IGR_DEUDASBANCARIACP + "?" + qs.stringify(data), data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminateBankingRelationshipsDebtsCP: ", err)
    }
    return undefined;
  }

  async eliminateFisicalBankingRelationshipsDebtsCP(transactId) {
    try {
      var data = {transactId:transactId}/*transactId:101 */
      var result = await this.del(url.URL_BACKEND_IGR_DEUDASBANCARIACP + "?" + qs.stringify(data));
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminateFisicalBankingRelationshipsDebtsCP: ", err)
    }
    return undefined;
  }

  ////IGR - RELACIONES BANCARAS - DEUDAS LP ///////
  /**
   * 
   * OldName: consultarRelacionesBancariasDeudasLP
   * 
  */
  async consultBankRelationsDebtsLP(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_DEUDASBANCARIALP + "?" + data);
      /*{
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa",
          "transactId": 101,
          "bankingRelationLPDTOList": [
              {
                  "debtId": 1,
                  "bank": "oo",
                  "facilityType": "bb",
                  "amount": 0.5,
                  "date": "2021-11-11",
                  "expirationDate": "2021-11-11",
                  "debitBalance1": 0.5,
                  "debitBalance2": 0.5,
                  "debitBalance3": 0.5,
                  "rate": 0.5,
                  "fee": 0.5,
                  "bail": "bb",
                  "fundDestiny": "bb",
                  "paymentHistory":"",
                  "status": true
              }
          ]
      }*/
      return result;

    }
    catch (err) {
      console.error("api consultBankRelationsDebtsLP: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoRelacionesBancariasDeudasLP
   * 
  */
  async newBankingRelationsDebtsLP(data) {
    try {

      /*
      {
      "transactId": 101,
      "bank": "oo",
      "facilityType": "bb",
      "amount": 0.5,
      "date": "2021-11-11",
      "expirationDate": "2021-11-11",
      "debitBalance1": 0.5,
      "debitBalance2": 0.5,
      "debitBalance3": 0.5,
      "rate": 0.5,
      "fee": 0.5,
      "bail": "bb",
      "fundDestiny": "bb",
      "paymentHistory": "fake_data"
  }
      */
  if(data["t24"]===undefined){
    data["t24"] = false;
  }
  if(data["codigot24"]===undefined){
    data["codigot24"] = "";
  }
  if(data["codigot24"]===undefined){
    data["codigot24"] = "";
  }
      console.log("newBankingRelationsDebtsLP", data)

      var result = await this.post(url.URL_BACKEND_IGR_DEUDASBANCARIALP, data);

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.log("newBankingRelationsDebtsLP", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarRelacionesBancariasDeudasLP
   * 
  */
  async updateBankRelationsDebtsLP(data) {
    try {

      /*
      {
      "transactId": 101,
      "debtId": 1,
      "bank": "cc",
      "facilityType": "cc",
      "amount": 0.5,
      "date": "2021-11-11",
      "expirationDate": "2021-11-11",
      "debitBalance1": 0.5,
      "debitBalance2": 0.5,
      "debitBalance3": 0.5,
      "rate": 0.5,
      "fee": 0.5,
      "bail": "cc",
      "fundDestiny": "cc",
      "paymentHistory": "fake_data",
      "status": true
  }
      */
  if(data["t24"]===undefined){
    data["t24"] = false;
  }
  if(data["codigot24"]===undefined){
    data["codigot24"] = "";
  }
  if(data["codigot24"]===undefined){
    data["codigot24"] = "";
  }
      var result = await this.put(url.URL_BACKEND_IGR_DEUDASBANCARIALP, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateBankRelationsDebtsLP: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarRelacionesBancariasDeudasLP
   * 
  */
  async eliminateBankingRelationshipsDebtsLP(data) {
    try {
      /*transactId:101,debtId:2 */
      var result = await this.del(url.URL_BACKEND_IGR_DEUDASBANCARIALP + "?" + qs.stringify(data), data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminateBankingRelationshipsDebtsLP: ", err)
    }
    return undefined;
  }
  async eliminateFisicalBankingRelationshipsDebtsLP(transactId) {
    try {
      var data = {transactId:transactId}/*transactId:101 */
      var result = await this.del(url.URL_BACKEND_IGR_DEUDASBANCARIALP + "?" + qs.stringify(data));
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminateFisicalBankingRelationshipsDebtsLP: ", err)
    }
    return undefined;
  }

  ////IGR - RELACIONES BANCARIAS SECCION///////
  /**
   * 
   * OldName: consultarRelacionesBancariasSeccionIGR
   * 
  */
  async consultBankingRelationsSectionIGR(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_DEUDASBANCARIASECCION + "?" + data);

      /*{
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa",
      "bankingRelationSection": {
          "transactId": 101,
          "observations": "ddd1",
          "date": "2022-01-10",
          "status": true
      }
  } */
      if (result.statusCode === "200" || result.statusCode === "204") {
        return result;
      }
    }
    catch (err) {
      console.error("api consultBankingRelationsSectionIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarRelacionesBancariasSeccionIGR
   * 
  */
  async saveRelacionesBancariasSeccionIGR(data) {
    try {

      /*
      {
      "transactId": 101,
      "observations": "ddd1"
  }
      */
      var result = await this.post(url.URL_BACKEND_IGR_DEUDASBANCARIASECCION, data);

      //si es 500 existe, solo debemos actualizar
      if (result.statusCode === "500") {
        data["status"] = true;
        result = await this.put(url.URL_BACKEND_IGR_DEUDASBANCARIASECCION, data);
      }

      if (result.statusCode === "200") {
        return result;
      }

    }
    catch (err) {
      console.error("api saveRelacionesBancariasSeccionIGR: ", err)
    }
    return undefined;
  }

  ////IGR - FLUJO DE CAJA - DOLLAR ///////
  /**
   * 
   * OldName: consultarFlujoCajaDollar
   * 
  */
  async queryCashFlowDollar(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_FLUJOCAJADOLLAR + "?" + data);
      /*{
          "cashFlowDollarDTOList": [
              {
                  "transactId": 101,
                  "cashFlowDolarId": 1,
                  "description": "rrr",
                  "january": 0.5,
                  "february": 0.5,
                  "march": 0.5,
                  "april": 0.5,
                  "may": 0.5,
                  "june": 0.5,
                  "july": 0.5,
                  "august": 0.5,
                  "september": 0.5,
                  "october": 0.5,
                  "november": 0.5,
                  "december": 0.5,
                  "status": true
              }
          ],
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa"
      }*/
      if (result.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api queryCashFlowDollar: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoFlujoCajaDollar
   * 
  */
  async newCashFlowDollar(data) {
    try {

      /*
      {
      "transactId": 101,
      "description": "ddd",
      "january": 0.1,
      "february": 0.1,
      "march": 0.1,
      "april": 0.1,
      "may": 0.1,
      "june": 0.1,
      "july": 0.1,
      "august": 0.1,
      "september": 0.1,
      "october": 0.1,
      "november": 0.1,
      "december": 0.1
  }
      */
      var result = await this.post(url.URL_BACKEND_IGR_FLUJOCAJADOLLAR, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newCashFlowDollar: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarFlujoCajaDollar
   * 
  */
  async updateCashFlowDollar(data) {
    try {

      /*
         {
      "transactId": 101,
      "cashFlowDolarId": 1,
      "description": "qqqq",
      "january": 0.5,
      "february": 0.5,
      "march": 0.5,
      "april": 0.5,
      "may": 0.5,
      "june": 0.5,
      "july": 0.5,
      "august": 0.5,
      "september": 0.5,
      "october": 0.5,
      "november": 0.5,
      "december": 0.5,
      "status": true
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_IGR_FLUJOCAJADOLLAR, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateCashFlowDollar: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarFlujoCajaDollar
   * 
  */
  async deleteCashFlowDollar(data) {
    try {
      /*transactId:101,cashFlowDolarId:2 */
      var result = await this.del(url.URL_BACKEND_IGR_FLUJOCAJADOLLAR + "?" + qs.stringify(data), data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api deleteCashFlowDollar: ", err)
    }
    return undefined;
  }

  ////IGR - FLUJO DE CAJA - SERVICIOS DE DEUDAS ///////
  /**
   * 
   * OldName: consultarFlujoCajaServicioDeudas
   * 
  */
  async consultCashFlowServiceDebts(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_FLUJOCAJASERVICIODEUDAS + "?" + data);
      /*{
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa",
          "cashFlowDebtServiceDTOList": [
              {
                  "transactId": 101,
                  "cashFlowDebtServiceId": 1,
                  "description": "kkkk",
                  "january": 0.5,
                  "february": 0.5,
                  "march": 0.5,
                  "april": 0.5,
                  "may": 0.5,
                  "june": 0.5,
                  "july": 0.5,
                  "august": 0.5,
                  "september": 0.5,
                  "october": 0.5,
                  "november": 0.5,
                  "december": 0.5,
                  "status": true
              }
          ]
      }*/
      if (result.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api consultCashFlowServiceDebts: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoFlujoCajaServicioDeudas
   * 
  */
  async newCashFlowServiceDebts(data) {
    try {

      /*
      {"transactId": 101,
      "description": "rrr",
      "january": 0.5,
      "february": 0.5,
      "march": 0.5,
      "april": 0.5,
      "may": 0.5,
      "june": 0.5,
      "july": 0.5,
      "august": 0.5,
      "september": 0.5,
      "october": 0.5,
      "november": 0.5,
      "december": 0.5
    }

      */
      var result = await this.post(url.URL_BACKEND_IGR_FLUJOCAJASERVICIODEUDAS, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newCashFlowServiceDebts: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarFlujoCajaServicioDeudas
   * 
  */
  async updateCashFlowServiceDebts(data) {
    try {

      /*
      {
      "transactId": 101,
      "cashFlowDebtServiceId": 1,
      "description": "kkkk",
      "january": 0.5,
      "february": 0.5,
      "march": 0.5,
      "april": 0.5,
      "may": 0.5,
      "june": 0.5,
      "july": 0.5,
      "august": 0.5,
      "september": 0.5,
      "october": 0.5,
      "november": 0.5,
      "december": 0.5,
      "status": true
  }

      */
      var result = await this.put(url.URL_BACKEND_IGR_FLUJOCAJASERVICIODEUDAS, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateCashFlowServiceDebts: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarFlujoCajaServicioDeudas
   * 
  */
  async eliminateCashFlowServiceDebts(data) {
    try {
      /*transactId:101,cashFlowDebtServiceId:2 */
      var result = await this.del(url.URL_BACKEND_IGR_FLUJOCAJASERVICIODEUDAS + "?" + qs.stringify(data), data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminateCashFlowServiceDebts: ", err)
    }
    return undefined;
  }

  ////IGR - FLUJO DE CAJA - EGRESOS ///////
  /**
   * 
   * OldName: consultarFlujoCajaEgresos
   * 
  */
  async consultCashFlowExpenses(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_FLUJOCAJAEGRESO + "?" + data);
      /*{

      {
          "cashFlowOutcome": [
              {
                  "transactId": 101,
                  "cashFlowOutcomeId": 1,
                  "description": "Ganaderia",
                  "january": 6.000,
                  "february": 6.000,
                  "march": 6.000,
                  "april": 6.000,
                  "may": 6.000,
                  "june": 6.000,
                  "july": 6.000,
                  "august": 6.000,
                  "september": 6.000,
                  "october": 6.000,
                  "november": 6.000,
                  "december": 6.000,
                  "status": false
              },
              {
                  "transactId": 101,
                  "cashFlowOutcomeId": 4,
                  "description": "Ganaderia",
                  "january": 5.000,
                  "february": 5.000,
                  "march": 5.000,
                  "april": 5.000,
                  "may": 5.000,
                  "june": 5.000,
                  "july": 5.000,
                  "august": 5.000,
                  "september": 5.000,
                  "october": 5.000,
                  "november": 5.000,
                  "december": 5.000,
                  "status": false
              },
              {
                  "transactId": 101,
                  "cashFlowOutcomeId": 5,
                  "description": "Ganaderia",
                  "january": 5.000,
                  "february": 5.000,
                  "march": 5.000,
                  "april": 5.000,
                  "may": 5.000,
                  "june": 5.000,
                  "july": 5.000,
                  "august": 5.000,
                  "september": 5.000,
                  "october": 5.000,
                  "november": 5.000,
                  "december": 5.000,
                  "status": true
              }
          ],
          "status": {
              "statusCode": "200",
              "statusDesc": "Transacciï¿½n Exitosa"
          }
      }
      */
      if (result.status.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api consultCashFlowExpenses: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoFlujoCajaEgresos
   * 
  */
  async newCashFlowExpenses(data) {
    try {

      /*
      {
    "transactId": 101,
      "description":"Ganaderia",
      "january":5.000,
      "februray":5.000,
      "march":5.000,
      "april":5.000,
      "may":5.000,
      "june":5.000,
      "july":5.000,
      "august":5.000,
      "september":5.000,
      "october":5.000,
      "november":5.000,
      "december":5.000
  }
      */

      var result = await this.post(url.URL_BACKEND_IGR_FLUJOCAJAEGRESO, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newCashFlowExpenses: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarFlujoCajaEgresos
   * 
  */
  async updateCashFlowEgresses(data) {
    try {

      /*
      {
    "transactId": 101,
      "cashFlowOutcomeId":1,
      "description":"Ganaderia",
      "january":6.000,
      "februray":6.000,
      "march":6.000,
      "april":6.000,
      "may":6.000,
      "june":6.000,
      "july":6.000,
      "august":6.000,
      "september":6.000,
      "october":6.000,
      "november":6.000,
      "december":6.000,
      "status":true
  }
      */
      var result = await this.put(url.URL_BACKEND_IGR_FLUJOCAJAEGRESO, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateCashFlowEgresses: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarFlujoCajaEgresos
   * 
  */
  async eliminateCashFlowExpenses(data) {
    try {
      /*transactId:101,cashFlowOutcomeId:2 */
      var result = await this.del(url.URL_BACKEND_IGR_FLUJOCAJAEGRESO + "?" + qs.stringify(data), data);
      //var result = await this.put(url.URL_BACKEND_IGR_FLUJOCAJAEGRESOBORRAR, data);

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminateCashFlowExpenses: ", err)
    }
    return undefined;
  }

  ////IGR - FLUJO DE CAJA - CARGA DE TRABAJO ///////
  /**
   * 
   * OldName: consultarFlujoCajaCargaTrabajo
   * 
  */
  async queryCashFlowLoadWork(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_FLUJOCAJACARGATRABAJO + "?" + data);
      /*{
          "cashFlowWorkLoad": [
              [
                  101,
                  1,
                  "2",
                  "PROYECTO",
                  "ORGANISMO",
                  5.000,
                  10.000,
                  15.000,
                  20.000,
                  2.3,
                  5.2,
                  1.5,
                  "INDEFINIDO",
                  false
              ]
          ],
          "status": {
              "statusCode": "200",
              "statusDesc": "Transacción Exitosa"
          }
      }*/
      if (result.status.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api queryCashFlowLoadWork: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoFlujoCajaCargaTrabajo
   * 
  */
  async newCashFlowLoadWork(data) {
    try {

      /*
      {
      "transactId": 101,
      "customer": "2",
      "projectName": "PROYECTO",
      "organismType":"ORGANISMO",
      "contractAmount": 5.000,
      "pendingAmount":10.000,
      "initialPlan":15.000,
      "endPlan":20.000,
      "executedPercentage":2.3,
      "percentageTobeExecuted":5.2,
      "expectedExecution":1.5,
      "contractType":"PRESTACION DE SERVICIOS"
  }
      */
      var result = await this.post(url.URL_BACKEND_IGR_FLUJOCAJACARGATRABAJO, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newCashFlowLoadWork: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarFlujoCajaCargaTrabajo
   * 
  */
  async updateCashFlowWorkLoad(data) {
    try {

      /*
      {
    "transactId": 101,
      "cashFlowWorkloadId":1,
      "customer": "2",
      "projectName": "PROYECTO",
      "organismType":"ORGANISMO",
      "contractAmount": 5.000,
      "pendingAmount":10.000,
      "initialPlan":15.000,
      "endPlan":20.000,
      "executedPercentage":2.3,
      "percentageTobeExecuted":5.2,
      "expectedExecution":1.5,
      "contractType":"INDEFINIDO",
      "status":true
  }
      */
      data.status = true;
      var result = await this.put(url.URL_BACKEND_IGR_FLUJOCAJACARGATRABAJO, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateCashFlowWorkLoad: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarFlujoCajaCargaTrabajo
   * 
  */
  async deleteCashFlowWorkLoad(data) {
    try {
      /*transactId:101,cashFlowWorkloadId:2 */
      var result = await this.del(url.URL_BACKEND_IGR_FLUJOCAJACARGATRABAJO + "?" + qs.stringify(data), data);

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api deleteCashFlowWorkLoad: ", err)
    }
    return undefined;
  }

  ////IGR - FLUJO DE CAJA - INGRESOS ///////
  /**
   * 
   * OldName: consultarFlujoCajaIngresoFacturacion
   * 
  */
  async checkCashFlowIncomeInvoicing(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_FLUJOCAJAINGRESOFACTURACION + "?" + data);
      /*{
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa",
          "cashFlowDebtServiceDTOList": [
              {
                  "transactId": 101,
                  "cashFlowDebtServiceId": 1,
                  "description": "kkkk",
                  "january": 0.5,
                  "february": 0.5,
                  "march": 0.5,
                  "april": 0.5,
                  "may": 0.5,
                  "june": 0.5,
                  "july": 0.5,
                  "august": 0.5,
                  "september": 0.5,
                  "october": 0.5,
                  "november": 0.5,
                  "december": 0.5,
                  "status": true
              }
          ]
      }*/
      if (result.status.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api checkCashFlowIncomeInvoicing: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoFlujoCajaIngresoFacturacion
   * 
  */
  async newCashFlowRevenueInvoicing(data) {
    try {

      /*
      {
      "transactId": 101,
      "description": "des",
      "january": 1,
      "february": 2,
      "march": 3,
      "april": 4,
      "may": 5,
      "june": 6,
      "july": 7,
      "august": 8,
      "september": 9,
      "october": 10,
      "november": 11,
      "december": 12
  }
      */
      var result = await this.post(url.URL_BACKEND_IGR_FLUJOCAJAINGRESOFACTURACION, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newCashFlowRevenueInvoicing: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarFlujoCajaIngresoFacturacion
   * 
  */
  async updateCashFlowRevenueInvoicing(data) {
    try {

      /*
      {
      "transactId": 101,
      "cashFlowInvoiceId": 1,
      "description": "desup",
      "january": 11,
      "february": 22,
      "march": 33,
      "april": 44,
      "may": 55,
      "june": 66,
      "july": 77,
      "august": 88,
      "september": 99,
      "october": 1010,
      "november": 1111,
      "december": 1212,
      "status": true
  }
      */
      var result = await this.put(url.URL_BACKEND_IGR_FLUJOCAJAINGRESOFACTURACION, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateCashFlowRevenueInvoicing: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarFlujoCajaIngresoFacturacion
   * 
  */
  async eliminateCashFlowRevenueInvoicing(data) {
    try {
      /*transactId:101,cashFlowInvoiceId:2 */
      var result = await this.del(url.URL_BACKEND_IGR_FLUJOCAJAINGRESOFACTURACION + "?" + qs.stringify(data), data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminateCashFlowRevenueInvoicing: ", err)
    }
    return undefined;
  }

  ////IGR - FLUJO DE CAJA - COBRANZAS ///////
  /**
   * 
   * OldName: consultarFlujoCajaCobranzas
   * 
  */
  async checkCashFlowCollections(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_FLUJOCAJACOBRANZAS + "?" + data);
      /*{
          "cashFlowCollection": [
              {
                  "transactId": 101,
                  "cashFlowCollectiond": 1,
                  "description": "des",
                  "january": 1,
                  "february": 2,
                  "march": 3,
                  "april": 4,
                  "may": 5,
                  "june": 6,
                  "july": 7,
                  "august": 8,
                  "september": 9,
                  "october": 10,
                  "november": 11,
                  "december": 12,
                  "status": true
              }
          ],
          "status": {
              "statusCode": "200",
              "statusDesc": "Transacciï¿½n Exitosa"
          }
      }*/
      if (result.status.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api checkCashFlowCollections: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoFlujoCajaCobranzas
   * 
  */
  async newCashFlowCollections(data) {
    try {

      /*
      {
      "transactId": 101,
      "description": "des",
      "january": 1,
      "february": 2,
      "march": 3,
      "april": 4,
      "may": 5,
      "june": 6,
      "july": 7,
      "august": 8,
      "september": 9,
      "october": 10,
      "november": 11,
      "december": 12
  }
      */
      var result = await this.post(url.URL_BACKEND_IGR_FLUJOCAJACOBRANZAS, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newCashFlowCollections: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarFlujoCajaCobranzas
   * 
  */
  async updateCashFlowCollections(data) {
    try {

      /*
      {
      "transactId": 101,
      "cashFlowCollectiond": 1,
      "description": "desup",
      "january": 11,
      "february": 22,
      "march": 33,
      "april": 44,
      "may": 55,
      "june": 66,
      "july": 77,
      "august": 88,
      "september": 99,
      "october": 1010,
      "november": 1111,
      "december": 1212,
      "status": true
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_IGR_FLUJOCAJACOBRANZAS, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateCashFlowCollections: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarFlujoCajaCobranzas
   * 
  */
  async eliminateCashFlowCollections(data) {
    try {
      /*transactId:101,cashFlowCollectiond:2 */
      var result = await this.del(url.URL_BACKEND_IGR_FLUJOCAJACOBRANZAS + "?" + qs.stringify(data), data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminateCashFlowCollections: ", err)
    }
    return undefined;
  }


  ////IGR - MOVIMIENTOS DE CUENTAS ///////
  /**
   * 
   * OldName: consultarMovimientosCuentasIGR
   * 
  */
  async consultMovementsAccountsIGR(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_MOVIMIENTOCUENTAS + "?" + data);
      /*{
    "movements": [
        {
            "trasactId": 109,
            "movementId": 12,
            "year": 2021,
            "month": "2021-12-29",
            "deposits": 3,
            "averageBalance": 3,
            "observations": "test",
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacción Exitosa"
    }
}*/
      return result.movements;
    }
    catch (err) {
      console.error("api consultMovementsAccountsIGR: ", err)
    }
    return undefined;
  }

  async consultMovementsBank(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_MOVIMIENTOCUENTAS + "?" + data);
      const months = { ENERO: 0, FEBRERO: 1, MARZO: 2, ABRIL: 3, MAYO: 4, JUNIO: 5, JULIO: 6, AGOSTO: 7, SEPTIEMBRE: 8, OCTUBRE: 9, NOVIEMBRE: 10, DICIEMBRE: 11 }

      result.movements = result.movements.sort(function (a, b) {
        // a must be equal to b
        if (months[a.month.toUpperCase()] > months[b.month.toUpperCase()]) {
          return 1;
        }
        if (months[a.month.toUpperCase()] < months[b.month.toUpperCase()]) {
          return -1;
        }
        return 0;
      }).sort(function (a, b) {
        // a must be equal to b
        if (b.year > a.year) {
          return 1;
        }
        if (b.year < a.year) {
          return -1;
        }
        return 0;
      }).sort(function (a, b) {
        if (b.accountNumber > a.accountNumber) {
          return 1;
        }
        if (b.accountNumber < a.accountNumber) {
          return -1;
        }
        // a must be equal to b
        return 0;
      })

      result = {
        bankBanesco: [...result.movements.filter(bank => bank.t24)],
        bankOthersBank: [...result.movements.filter(bank => !bank.t24)]
      }
      return result;
    }
    catch (err) {
      console.error("api consultMovementsAccountsIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoMovimientosCuentasIGR
   * 
  */
  async newMovementsAccountsIGR(data) {
    try {

      /*
      {
"trasactId":1,
"year":2021,
"month":"2021-12-30",
"deposits":3,
"averageBalance":3,
"observations":"test"
}
      */
if(data["t24"]===undefined){
  data["t24"] = false;
}
      var result = await this.post(url.URL_BACKEND_IGR_MOVIMIENTOCUENTAS, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newMovementsAccountsIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarMovimientosCuentasIGR
   * 
  */
  async updateMovementsAccountsIGR(data) {
    try {

      /*
      {
"trasactId":109,
"movementId":12,
"year":2021,
"month":"2021-12-30",
"deposits":3,
"averageBalance":3,
"observations":"test",
"status":true
}
      */

if(data["t24"]===undefined){
  data["t24"] = false;
}

      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_IGR_MOVIMIENTOCUENTAS, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateMovementsAccountsIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarMovimientosCuentasIGR
   * 
  */
  async deleteMovementsAccountsIGR(data) {
    try {
      /*transactId:101,movementId:12 */
      var result = await this.del(url.URL_BACKEND_IGR_MOVIMIENTOCUENTAS + "?" + qs.stringify(data), data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api deleteMovementsAccountsIGR: ", err)
    }
    return undefined;
  }

  async deleteFisicalMovementsAccountsIGR(transactId) {
    try {
      var data = {transactId: transactId}
      var result = await this.del(url.URL_BACKEND_IGR_MOVIMIENTOCUENTAS + "?" + qs.stringify(data));
      console.log("deleteFisicalMovementsAccountsIGR",result)
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("deleteFisicalMovementsAccountsIGR", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarSeccionMovimientosCuentas
   * 
  */
  async saveSectionMovementsAccounts(data) {
    try {
      /*{
"trasactId":101,
"observations":"test"
} */
if(data["t24"]===undefined){
  data["t24"] = false;
}
      var result = await this.post(url.URL_BACKEND_IGR_MOVIMIENTOCUENTASSECCION, data);

      //si es 500 existe, solo debemos actualizar
      if (result.statusCode === "500") {
        data["status"] = true;
        result = await this.put(url.URL_BACKEND_IGR_MOVIMIENTOCUENTASSECCION, data);
      }

      return result;

    }
    catch (err) {
      console.error("api saveSectionMovementsAccounts: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: consultarSeccionMovimientosCuentas
   * 
  */
  async consultSectionMovementsAccounts(transactId) {
    try {
      /*{
    "movements": [
        {
            "trasactId": 109,
            "observations": "test",
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacción Exitosa"
    }
}*/
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_MOVIMIENTOCUENTASSECCION + "?" + data);

      return result.movements[0];
    }
    catch (err) {
      console.error("api consultSectionMovementsAccounts: ", err)
    }
    return undefined;
  }

  ////IGR - CUENTAS POR COBRAR ///////
  /**
   * 
   * OldName: consultarCuentasCobrarIGR
   * 
  */
  async consultAccountsReceivableIGR(transactId) {
    try {

      var params = { transactId: transactId, processId: opt.PROCESS_INFORMEGESTION, activityId: opt.ACT_CUENTASPORCOBRAR }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_CUENTASCOBRAR + "?" + data);
      /*{
          "accountsReceivable": [
              {
                  "countryCustomer": "panama",
                  "days30": 30,
                  "days60": 60,
                  "days90": 90,
                  "days120": 120,
                  "days150": 150,
                  "days180": 180,
                  "days210": 210,
                  "days240": 240,
                  "days270": 270,
                  "days300": 300,
                  "days330": 330,
                  "days331": null,
                  "total": 10000,
                  "percentage": 100
              }
          ],
          "attachments": null,
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa"
      }*/
      if (result.statusCode === "200") {
        return result.accountsReceivable;
      }
    }
    catch (err) {
      console.error("api consultAccountsReceivableIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoCuentasCobrarIGR
   * 
  */
  async newAccountsReceivableIGR(data) {
    try {

      /*
      {
      "transactId": 101,
      "countryCustomer": "panama",
      "days30": 30,
      "days60": 60,
      "days90": 90,
      "days120": 120,
      "days150": 150,
      "days180": 180,
      "days210": 210,
      "days240": 240,
      "days270": 270,
      "days300": 300,
      "days330": 330,
      "days331": 331,
      "total": 10000,
      "percentage": 100
  }
      */
      var result = await this.post(url.URL_BACKEND_IGR_CUENTASCOBRAR, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newAccountsReceivableIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarCuentasCobrarIGR
   * 
  */
  async updateAccountsReceivableIGR(data) {
    try {

      /*
      {
      "transactId": 101,
      "accountReceivableId":1,
      "countryCustomer": "colombia",
      "days30": 60,
      "days60": 120,
      "days90": 180,
      "days120": 240,
      "days150": 300,
      "days180": 180,
      "days210": 210,
      "days240": 240,
      "days270": 270,
      "days300": 300,
      "days330": 330,
      "days331": 331,
      "total": 10000,
      "percentage": 100,
      "status":true
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_IGR_CUENTASCOBRAR, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateAccountsReceivableIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarCuentasCobrarIGR
   * 
  */
  async deleteAccountsReceivableIGR(data) {
    try {
      /*data={transactId:101,accountReceivableId:1 }*/
      var result = await this.del(url.URL_BACKEND_IGR_CUENTASCOBRAR + "?" + qs.stringify(data), data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api deleteAccountsReceivableIGR: ", err)
    }
    return undefined;
  }

  ////IGR - CAPEX ///////
  /**
   * 
   * OldName: consultarCapexIGR
   * 
  */
  async consultCapexIGR(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_CAPEX + "?" + data);
      /*{
          "capex": [
              {
                  "transactId": 101,
                  "capexId": 1,
                  "description": "Test",
                  "useInMiles": 100,
                  "shareholder": "shareholder2",
                  "bank": "bank2",
                  "status": false
              }
          ],
          "status": {
              "statusCode": "200",
              "statusDesc": "Transacción Exitosa"
          }
      }*/
      if (result.status.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api consultCapexIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoCapexIGR
   * 
  */
  async newCapexIGR(data) {
    try {

      /*
      {
      "transactId":101,
      "description":"Test",
      "useInMiles":100,
      "shareholder":"shareholder2",
      "bank":"bank2"
  }
      */
      var result = await this.post(url.URL_BACKEND_IGR_CAPEX, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newCapexIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarCapexIGR
   * 
  */
  async updateCapexIGR(data) {
    try {

      /*
      {
      "transactId":101,
      "capexId":1,
      "description":"Test",
      "useInMiles":100,
      "shareholder":"shareholder2",
      "bank":"bank2",
      "status":true
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_IGR_CAPEX, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateCapexIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarCapexIGR
   * 
  */
  async deleteCapexIGR(data) {
    try {
      /*data={transactId:101,capexsId:1 }*/
      var result = await this.del(url.URL_BACKEND_IGR_CAPEX + "?" + qs.stringify(data), data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api deleteCapexIGR: ", err)
    }
    return undefined;
  }

  ////IGR - CAPEX PRESUPUESTO ///////
  /**
   * 
   * OldName: consultarCapexPresupuestoIGR
   * 
  */
  async consultCapexBudgetIGR(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_CAPEXPRESUPUESTO + "?" + data);
      /*{
          "capexBudget": [
              {
                  "transactId": 101,
                  "capexId": 1,
                  "budget": "vpresupuesto",
                  "amount": 100,
                  "status": true
              }
          ],
          "status": {
              "statusCode": "200",
              "statusDesc": "Transacción Exitosa"
          }
      }*/
      if (result.status.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api consultCapexBudgetIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoCapexPresupuestoIGR
   * 
  */
  async newCapexBudgetIGR(data) {
    try {

      /*
      {
      "transactId":101,
      "budget":"Test",
      "amount":100
  }
      */
      var result = await this.post(url.URL_BACKEND_IGR_CAPEXPRESUPUESTO, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newCapexBudgetIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarCapexPresupuestoIGR
   * 
  */
  async updateCapexBudgetIGR(data) {
    try {

      /*
      {
      "transactId":101,
      "capexId":1,
      "budget":"vpresupuesto",
      "amount":100,
      "status":true
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_IGR_CAPEXPRESUPUESTO, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateCapexBudgetIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarCapexPresupuestoIGR
   * 
  */
  async removeCapexBudgetIGR(data) {
    try {
      /*data={transactId:101,capexId:1 }*/
      var result = await this.del(url.URL_BACKEND_IGR_CAPEXPRESUPUESTO + "?" + qs.stringify(data), data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api removeCapexBudgetIGR: ", err)
    }
    return undefined;
  }

  ////IGR - CAPEX DETALLES PROYECTO ///////
  /**
   * 
   * OldName: consultarCapexDetalleProyectoIGR
   * 
  */
  async consultCapexDetailProjectIGR(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_CAPEXDETALLESPROYECTO + "?" + data);
      /*{
          "capexBudget": [
              {
                  "transactId": 101,
                  "capexDetailsId": 1,
                  "observations": "vpresupuesto",
                  "amount": 100,
                  "status": true
              }
          ],
          "status": {
              "statusCode": "200",
              "statusDesc": "Transacción Exitosa"
          }
      }*/
      if (result.status.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api consultCapexDetailProjectIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoCapexDetalleProyectoIGR
   * 
  */
  async newCapexDetailProjectIGR(data) {
    try {

      /*
      {
      "transactId":101,
      "observations":"Inserted",
      "amount":5
  }
      */
      var result = await this.post(url.URL_BACKEND_IGR_CAPEXDETALLESPROYECTO, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newCapexDetailProjectIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarCapexDetalleProyectoIGR
   * 
  */
  async updateCapexDetailProjectIGR(data) {
    try {

      /*
      {
      "transactId":101,
      "capexDetailsId":1,
      "observations":"Updated",
      "amount":5,
      "status":true
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_IGR_CAPEXDETALLESPROYECTO, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateCapexDetailProjectIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarCapexDetalleProyectoIGR
   * 
  */
  async removeCapexDetailProjectIGR(data) {
    try {
      /*data={transactId:101,capexDetailsId:1 }*/
      var result = await this.del(url.URL_BACKEND_IGR_CAPEXDETALLESPROYECTO + "?" + qs.stringify(data), data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api removeCapexDetailProjectIGR: ", err)
    }
    return undefined;
  }

  ////IGR - RECOMENDACIONES ///////
  /**
   * 
   * OldName: consultarRecomendacionesIGR
   * 
  */
  async consultRecommendationsIGR(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_RECOMENDACIONES + "?" + data);
      /*{
          "transactId": 101,
          "recommendations": "2 save",
          "valueChain": "3 save",
          "background": "4 save",
          "refinancingLog": "6 save",
          "status": true,
          "statusService": {
              "statusCode": "200",
              "statusDesc": "Transacciï¿½n Exitosa"
          }
      }*/
      if (result.statusService.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api consultRecommendationsIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarRecomendacionesIGR
   * 
  */
  async saveRecommendationsIGR(data) {
    try {

      /*
      {
      "transactId": 101,
      "recommendations": "2 save",
      "valueChain": "3 save",
      "background": "4 save",
      "refinancingLog": "6 save"
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_IGR_RECOMENDACIONES, data);

      //si es 500 existe, solo debemos actualizar
      if (result.statusCode !== opt.ResponseBackend_STATUSOK) {
        result = await this.post(url.URL_BACKEND_IGR_RECOMENDACIONES, data);
      }

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api saveRecommendationsIGR: ", err)
    }
    return undefined;

  }

  ////IGR - MATRIZ OTROS BANCOS ///////
  /**
   * 
   * OldName: consultarMatrizOtrosBancosIGR
   * 
  */
  async consultMatrixOtherBanksIGR(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_MATRIZOTROSBANCOS + "?" + data);
      /*{
    "competitiveMatrixOtherBanks": [
        {
            "transactId": 101,
            "otherBankId": 5,
            "bank": "BANESCO PANAMA",
            "passivePercentage": 5.000,
            "participation": 10.000,
            "longTerm": 15.000,
            "shortTerm": 20.000,
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacción Exitosa"
    }
}*/
      if (result.status.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api consultMatrixOtherBanksIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoMatrizOtrosBancosIGR
   * 
  */
  async newMatrixOtherBanksIGR(data) {
    try {

      /*
      {
    "transactId": 101,
      "bank": "BANESCO PANAMA",
      "passivePercentage": 5.000,
      "participation":10.000,
      "longTerm":15.000,
      "shortTerm":20.000
  }
      */
      data.status = true
      var result = await this.post(url.URL_BACKEND_IGR_MATRIZOTROSBANCOS, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newMatrixOtherBanksIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarMatrizOtrosBancosIGR
   * 
  */
  async updateMatrixOtherBanksIGR(data) {
    try {

      /*
      {
  "transactId":101,
  "otherBankId":1,
  "bank": "BANESCO PANAMA",
  "passivePercentage":3.5,
  "participation":5.2,
  "longTerm":1.200,
  "shortTerm":600,
  "status":true
  }
      */
      data.status = true
      var result = await this.put(url.URL_BACKEND_IGR_MATRIZOTROSBANCOS, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateMatrixOtherBanksIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarMatrizOtrosBancosIGR
   * 
  */
  async deleteMatrixOtherBanksIGR(data) {
    try {
      /*transactId:101,otherBankId:2 */
      var result = await this.del(url.URL_BACKEND_IGR_MATRIZOTROSBANCOS + "?" + qs.stringify(data), data);

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api deleteMatrixOtherBanksIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: consultarMatrizExpedientesIGR
   * 
  */
  async consultMatrixFilesIGR(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_MATRIZEXPEDIENTES + "?" + data);
      /*{
    "files": [
        {
            "transactId": 101,
            "filesId": 1,
            "fileType": {
                "code": "Expediente Contable",
                "name": ""
            },
            "fileStatus": "En Revision",
            "observations": "Expediente Contabilizado",
            "status": true
        }
    ],
    "serviceStatus": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}
}*/
      if (result.serviceStatus.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api consultMatrixFilesIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoMatrizExpedientesIGR
   * 
  */
  async newMatrixIGRFiles(data) {
    try {

      /*
     {
"transactId":5,
"fileType":{
"code":"Expediente Contable",
"name":""
},
"fileStatus":"En Revision",
"observations":"Expediente Contabilizado"
}
      */
      var result = await this.post(url.URL_BACKEND_IGR_MATRIZEXPEDIENTES, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newMatrixIGRFiles: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarMatrizExpedientesIGR
   * 
  */
  async updateMatrizIGRFiles(data) {
    try {

      /*
      {
"transactId":4,
"filesId":5,
"fileType":{
"code":"Expediente Contable",
"name":""
},
"fileStatus":"En Revision",
"observations":"Expediente Contabilizado",
"status":true
}
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_IGR_MATRIZEXPEDIENTES, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateMatrizIGRFiles: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarMatrizExpedientesIGR
   * 
  */
  async deleteMatrixFilesIGR(data) {
    try {
      /*transactId:101,filesId:2 */
      var result = await this.del(url.URL_BACKEND_IGR_MATRIZEXPEDIENTES + "?" + qs.stringify(data), data);

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api deleteMatrixFilesIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: consultarMatrizNuevosNegociosIGR
   * 
  */
  async consultMatrixNewBusinessIGR(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_MATRIZNUEVONEGOCIO + "?" + data);
      /*{
    "newBusiness": [
        {
            "transactId": 101,
            "newBusinessId": 1,
            "businessType": {
                "code": "Papeleria",
                "name": ""
            },
            "businessStatus": "Bueno",
            "observations": "Ventas productos oficina",
            "status": true
        }
    ],
    "serviceStatus": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}
}*/
      if (result.serviceStatus.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api consultMatrixNewBusinessIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoMatrizNuevosNegociosIGR
   * 
  */
  async newMatrixNewBusinessIGR(data) {
    try {

      /*
      {
"transactId":101,
"businessType": {
"code":"Papeleria",
"name":""
},
"businessStatus":"Bueno",
"observations":"Ventas productos oficina"
}
      */
      var result = await this.post(url.URL_BACKEND_IGR_MATRIZNUEVONEGOCIO, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newMatrixNewBusinessIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarMatrizNuevosNegociosIGR
   * 
  */
  async updateMatrixNewBusinessIGR(data) {
    try {

      /*
      {
"transactId":2,
"newBusinessId":2,
"businessType": {
"code":"Cigarreria",
"name":""
},
"businessStatus":"Excelente",
"observations":"Ventas productos canasta familiar",
"status":true
}
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_IGR_MATRIZNUEVONEGOCIO, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateMatrixNewBusinessIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarMatrizNuevosNegociosIGR
   * 
  */
  async deleteMatrixNewBusinessIGR(data) {
    try {
      /*transactId:101,newBusinessId:2 */
      var result = await this.del(url.URL_BACKEND_IGR_MATRIZNUEVONEGOCIO + "?" + qs.stringify(data), data);

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api deleteMatrixNewBusinessIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: consultarMatrizRentabilidadIGR
   * 
  */
  async consultMatrixProfitabilityIGR(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_MATRIZRENTABILIDAD + "?" + data);
      /*{
    "profitability": [
        {
            "transactId": 101,
            "profitabilityId": 2,
            "matrixType": {
                "code": "Otros Bancos",
                "name": ""
            },
            "quantity": 50.000,
            "status": true
        }
    ],
    "serviceStatus": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}
}*/
      if (result.serviceStatus.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api consultMatrixProfitabilityIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoMatrizRentabilidadIGR
   * 
  */
  async newMatrixProfitabilityIGR(data) {
    try {

      /*
      {
"transactId":4,
"matrixType":{
"code":"Otros Bancos",
"name":""
},
"quantity": 50.000
}
      */
      var result = await this.post(url.URL_BACKEND_IGR_MATRIZRENTABILIDAD, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newMatrixProfitabilityIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarMatrizRentabilidadIGR
   * 
  */
  async updateMatrixProfitabilityIGR(data) {
    try {

      /*
      {
"transactId":4,
"profitabilityId":4,
"matrixType":{
"code":"Nuevo negocio",
"name":""
},
"quantity": 500.000,
"status":true
}
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_IGR_MATRIZRENTABILIDAD, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateMatrixProfitabilityIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarMatrizRentabilidadIGR
   * 
  */
  async deleteMatrixProfitabilityIGR(data) {
    try {
      /*transactId:101,profitabilityId:2 */
      var result = await this.del(url.URL_BACKEND_IGR_MATRIZRENTABILIDAD + "?" + qs.stringify(data), data);

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api deleteMatrixProfitabilityIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarMatrizSeccionIGR
   * 
  */
  async saveMatrixSectionIGR(data) {
    try {
      /*
      {
  "transactId": 101,
    "observations": "Observacion"}
 */
      //Guardamos Busqueda y Descarte
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_IGR_MATRIZSECCION, data);
      if (result.statusCode !== "200") {
        result = await this.post(url.URL_BACKEND_IGR_MATRIZSECCION, data);
      }
      //OK
      /*{
    "statusCode": "200",
    "statusDesc": "Transacciï¿½n Exitosa"
}*/
      return result;


    }
    catch (err) {
      console.error("api saveMatrixSectionIGR", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: consultarMatrizSeccionIGR
   * 
  */
  async consultMatrixSectionIGR(transactId) { //retorna la Data de Busqueda y Descarte para un proceso
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_MATRIZSECCION + "?" + data);
      /*
            {
    "competitiveMatrix": [
        {
            "transactId": 101,
            "observations": "Observacion",
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacción Exitosa"
    }
}
            */
      return result.competitiveMatrix[0];
    }
    catch (err) {
      console.error("api consultMatrixSectionIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: consultarMatrizPosicionBanescoIGR
   * 
  */
  async consultMatrixPosicionBanescoIGR(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_MATRIZPOSICIONBANESCO + "?" + data);
      /*{
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    },
    "positions": [
        {
            "transactId": 101,
            "positionId": 1,
            "product": "product",
            "closeVol": 5.66,
            "participation": 999,
            "status": true
        }
    ]
}*/
      return result.positions;
    }
    catch (err) {
      console.error("api consultMatrixPosicionBanescoIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoMatrizPosicionBanescoIGR
   * 
  */
  async newMatrixPositionBanescoIGR(data) {
    try {

      /*
      {
    "transactId":101,
    "product":"product",
    "closeVol":5.66,
    "participation":999
}
      */
      var result = await this.post(url.URL_BACKEND_IGR_MATRIZPOSICIONBANESCO, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newMatrixPositionBanescoIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarMatrizPosicionBanescoIGR
   * 
  */
  async updateMatrixPosicionBanescoIGR(data) {
    try {

      /*
      {
    "transactId": 101,
    "positionId": 1,
    "product": "product",
    "closeVol": 5.66,
    "participation": 999,
    "status": true
}
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_IGR_MATRIZPOSICIONBANESCO, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateMatrixPosicionBanescoIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarMatrizPosicionBanescoIGR
   * 
  */
  async eliminateMatrixPosicionBanescoIGR(data) {
    try {
      /*transactId:101,positionId:2 */
      var result = await this.del(url.URL_BACKEND_IGR_MATRIZPOSICIONBANESCO + "?" + qs.stringify(data), data);

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminateMatrixPosicionBanescoIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: consultarMatrizTransaccionBanescoIGR
   * 
  */
  async consultMatrixTransactionBanescoIGR(transactId) {
    try {

      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_IGR_MATRIZTRANSACCIONBANESCO + "?" + data);
      /*{
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    },
    "transactionals": [
        {
            "transactId": 101,
            "product": "product",
            "closeVol": 5.66,
            "participation": 999,
            "status": true,
            "transactionalId": 1
        }
    ]
}*/
      return result.transactionals;
    }
    catch (err) {
      console.error("api consultMatrixTransactionBanescoIGR: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoMatrizTransaccionBanescoIGR
   * 
  */
  async newMatrixTransactionBanescoIGR(data) {
    try {

      /*
      {
    "transactId":101,
    "product":"product",
    "closeVol":5.66,
    "participation":999
}
      */
      var result = await this.post(url.URL_BACKEND_IGR_MATRIZTRANSACCIONBANESCO, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api newMatrixTransactionBanescoIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: actualizarMatrizTransaccionBanescoIGR
   * 
  */
  async updateTransactionMatrixBanescoIGR(data) {
    try {

      /*
      {
    "transactId": 101,
    "transactionalId": 1,
    "product": "product",
    "closeVol": 5.66,
    "participation": 999,
    "status": true
}
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_IGR_MATRIZTRANSACCIONBANESCO, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateTransactionMatrixBanescoIGR: ", err)
    }
    return undefined;

  }

  /**
   * 
   * OldName: eliminarMatrizTransaccionBanescoIGR
   * 
  */
  async eliminateMatrizTransaccionBanescoIGR(data) {
    try {
      /*transactId:101,transactionalId:2 */
      var result = await this.del(url.URL_BACKEND_IGR_MATRIZTRANSACCIONBANESCO + "?" + qs.stringify(data), data);

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminateMatrizTransaccionBanescoIGR: ", err)
    }
    return undefined;
  }

  ////IGR - GUARDAR NEGOCIOS A OBTENER///////
  /**
   * 
   * OldName: guardarNegocioObtenerIGR
   * 
  */
  async saveBusinessGetIGR(data) {
    try {
      /*
  {
      "transactId":1,
      "observations":"opservation up"
  }
      */
      //Guardamos
      var result = await this.post(url.URL_BACKEND_NEGOCIOOBTENER, data);
      //OK
      /*var result ={
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
      }*/

      //si es 500 existe, solo debemos actualizar
      if (result?.statusCode == "500") {
        data["status"] = true;
        result = await this.put(url.URL_BACKEND_NEGOCIOOBTENER, data);
      }

      if (result?.statusCode == "200") {
        return result;
      }

      // data = {
      //   "customerIdentification":"5",
      //   "firstName":"diana",
      //   "secondName":"",
      //   "firstLastName":"perez",
      //   "secondLastName": "jj",
      //   "identificationTypeId":1,
      //   "identificationType":"45",
      //   "numberIdentification" :45,
      //   "currentProcessIdentification":1,
      //   "responsible":"dinaUser",
      //   "sla":58
      // }
    } catch (err) {
      console.error("api saveBusinessGetIGR", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: consultarNegocioObtenerIGR
   * 
  */
  async consultBusinessGetIGR(transactId) { //retorna la Data de Busqueda y Descarte para un proceso
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_NEGOCIOOBTENER + "?" + data);
      /*{
      "observations": null,
      "productsAndServices": null,
      "month": null,
      "amount": null,
      "status": null,
      "transactId": null,
      "statusService": {
          "statusCode": "204",
          "statusDesc": "Sin Contenido"
      }
  }*/
      return result;
    }
    catch (err) {
      console.error("api consultBusinessGetIGR: ", err)
    }
    return undefined;
  }

  ////BUSQUEDA y DESCARTE///////
  /**
   * 
   * OldName: guardarBusquedaDescarte
   * 
  */
  async saveSearchDiscard(data) {
    try {
      var model = BusquedaDescarteModel.getSaveModel(data);

      //Guardamos Busqueda y Descarte
      var result = await this.post(url.URL_BACKEND_BUSQUEDADESCARTE, model);
      //OK
      /*var result ={
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
      }*/

      if (result.statusCode === "200") {
        return result;
      }

      //Si es 500, la entidad existe... si existe lo actualizamos
      if (result.statusCode === "500") {

        //rutima para actualizar aun no existe

        return result;
      }
    }
    catch (err) {
      console.error("api saveSearchDiscard", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: consultarBusquedaDescarte
   * 
  */
  async consultSearchDiscard(transactId) { //retorna la Data de Busqueda y Descarte para un proceso
    try {
      var params = { transactId: transactId, processId: opt.PROCESS_BUSQUEDADESCARTE, activityId: opt.ACT_NONE }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_BUSQUEDADESCARTE + "?" + data);
      /*
            const json ={
            "statusCode": "200",
            "statusDesc": "Transacciï¿½n Exitosa",
            "getSearchAndDiscardSectionResponseDTO": {
                "identificationType": 7,
                "customerDocumentId": "3882595",
                "firstName": "antonio",
                "secondName": "jose",
                "firstLastName": "ledezma",
                "secondLastName": "meneses",
                "transactId": 6,
                "compliance": true,
                "observationsSearchDiscard": "prospect 1",
                "approved": false,
                "observationsCompliance": null,
                "status": true,
                "date": "2021-12-03",
                "attachments": []
              }
            }
            */
      if (result.statusCode === "200") {
        return BusquedaDescarteModel.fromJson(result);
      }
    }
    catch (err) {
      console.error("api consultSearchDiscard: ", err)
    }
    return undefined;
  }

  ///////// USUARIO PROSPECTO ////////////

  /**
   * 
   * OldName: guardarUsuarioProspecto
   * 
  */
  async saveProspectUser(data) {
    let result = undefined;
    try {

      //Actualizar
      if (data.customerId !== null && data.customerId !== undefined && data.customerId.length > 0) {
        var userModel = UsuarioProspectoModel.getUpdateModel(data);
        //Actualizamos Usuario Prospecto
        result = await this.put(url.URL_BACKEND_USUARIOPROSPECTO, userModel);
        if (result.statusCode === "200") {
          result.customerId = data.customerId;
          result.transactId = data.transactId;

          return result;
        }
      }
      else { //Nuevo
        userModel = UsuarioProspectoModel.getSaveModel(data);
        //Guardamos Nuevo Usuario Prospecto
        result = await this.post(url.URL_BACKEND_USUARIOPROSPECTO, userModel);
        if (result.status.statusCode === "200") {
          return result;
        }
      }
      /*
      //Si es 204, el Usuario existe... si existe lo actualizamos
      if(result.status.statusCode === "204"){

        data.customerId = result.customerId;
        data.transactId = result.transactId;
        userModel = UsuarioProspectoModel.getSaveModel(data);

        //Actualizamos Usuario Prospecto
        result = await this.put(url.URL_BACKEND_USUARIOPROSPECTO,userModel);
        if(result.statusCode === "200"){

          result.customerId = data.customerId;
          result.transactId = data.transactId;

          return result;
        }
      }
      */
    }
    catch (err) {
      console.error("api saveProspectUser: ", err);
    }

    return undefined;
  }

  /**
   * consultarUsuarioProspecto
   */

  /**
   * 
   * OldName: None
   * 
  */
  /*
   async consultProspectUser(transactId) {
     try {
       var params = { transactId: transactId }
       var data = qs.stringify(params);
       var result = await this.get(url.URL_BACKEND_USUARIOPROSPECTO + "?" + data);
 
       return result.costumer[0];
     }
     catch (err) {
       console.error("api consultarEntidadBusquedaDescarte: ", err)
     }
     return undefined;
   }
   */


  /**
   * 
   * OldName: guardarCumplimiento
   * 
  */
  async saveCompliance(data) {
    try {

      var model = {
        transactId: data.transactId,
        compliance: true,
        observations: data.observationsSearchDiscard,
        approved: true,
        observationsComp: data.observationsComp
      }

      //Guardamos Busqueda y Descarte
      var result = await this.post(url.URL_BACKEND_CUMPLIMIENTO, model);
      //OK
      /*var result ={
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
      }*/

      if (result.statusCode === "200" || result.statusCode === "500") {
        return result;
      }
    }
    catch (err) {
      console.error("api saveCompliance", err);
    }
    return undefined;
  }

  ///////////////////////////////////////

  /**
   * 
   * OldName: consultarTramiteInbox
   * 
  */
  async consultProcedureInbox(username) { //retorna la Data de Busqueda y Descarte para un proceso
    try {
      var params = { responsible: username }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_BANDEJAENTRADA_TRAMITE + "?" + data);
      /*
            {
      "transactions": [
          {
              "transactId": 101,
              "instanceId": "8429",
              "customerId": 68,
              "currentProcess": 1,
              "nextProcess": 2,
              "responsible": "admin",
              "date": "2021-12-15",
              "status": true,
              "requestId": ""
          },
          {
              "transactId": 102,
              "instanceId": "8429",
              "customerId": 68,
              "currentProcess": 1,
              "nextProcess": 2,
              "responsible": "admin",
              "date": "2021-12-15",
              "status": true,
              "requestId": ""
          }
        ],
        "status": {
          "statusCode": "200",
          "statusDesc": "Transacción Exitosa"
        }
      }
            */
      if (result.status.statusCode === "200") {
        return BusquedaDescarteModel.fromJson(result);
      }
    }
    catch (err) {
      console.error("api consultProcedureInbox: ", err)
    }
    return undefined;
  }


  /**
   * 
   * OldName: actualizarTramiteInbox
   * 
  */
  async updateTramiteInbox(data) {
    try {

      /*
      {
  "transactId":"8",
  "instanceId":1,
  "customerId":3,
  "currentProcess":5,
  "nextprocess":6,
  "responsible":"userTest",
  "date":"2021-12-10",
  "status":true,
  "requestId":3
  }
      */
      data["status"] = true;
      var result = await this.post(url.URL_BACKEND_BANDEJAENTRADA_TRAMITE, data);
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api updateTramiteInbox: ", err)
    }
    return undefined;

  }



  /* ---------------------------------------------------------------------------------------------- */
  /*                                METODO PARA LA LISTA DE EXCLUSION                               */
  /* ---------------------------------------------------------------------------------------------- */

  /**
   * 
   * OldName: consultarListaExclusion
   * 
  */
  async queryListExclusion() {
    /* ---------------------------------------------------------------------------------------------- */
    /*     Obtenemos la respuesta de la lista de exclusion y retornamos el json, queda pendiente      */
    /* ---------------------------------------------------------------------------------------------- */
    return await this.get(url.URL_BACKEND_LISTAEXCLUSION);
  }
  /* ---------------------------------------------------------------------------------------------- */
  /*                     METODO PARA GUARDAR LA LISTA DE EXCLUSION SELECCIONADA                     */
  /* ---------------------------------------------------------------------------------------------- */

  /**
   * 
   * OldName: guardarListaExclusion
   * 
  */
  async saveListExclusion(transaccionId, exclusionId) {
    /* ---------------------------------------------------------------------------------------------- */
    /*     Obtenemos la respuesta de la lista de exclusion y retornamos el json, queda pendiente      */
    /* ---------------------------------------------------------------------------------------------- */
    try {
      let data = {
        "transactId": transaccionId,
        "exclusionCatListId": exclusionId
      }
      var result = await this.post(url.URL_BACKEND_LISTAEXCLUSION, data);
      if (result.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.err("api saveListExclusion", err);
    }
    return undefined;
  }
  /* ---------------------------------------------------------------------------------------------- */
  /*                     Obtenemos los chec de las listas de exclusion marcadas                     */
  /* ---------------------------------------------------------------------------------------------- */

  /**
   * 
   * OldName: consultarListaExclusionMarcada
   * 
  */
  async consultListExclusionChecked(params) {
    var data = qs.stringify(params);
    return await this.get(url.URL_BACKEND_LISTAEXCLUSION_MARCADA + "?" + data);
  }

  /**
   * 
   * OldName: eliminarListaExclusionMarcada
   * 
  */
  async removeCheckedExclusionList(transactId, exclusionId) {
    try {
      var data = { transactId: transactId, exclusionId: exclusionId };
      var result = await this.del(url.URL_BACKEND_LISTAEXCLUSION + "?" + qs.stringify(data));
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api removeCheckedExclusionList: ", err)
    }
    return undefined;
  }


  ////////////////////////////////////////////////////////////////

  ////PROPUSTA DE CREDITO - DATOS GENERALES///////

  /**
   * 
   * OldName: nuevoDatosGeneralesPropCred
   * 
  */
  async newDataGeneralPropCred(data) {
    try {

      /*
      {
    "transactId":107,
    "customerNumber":"123",
    "revision":"1",
    "preapproval":true,
    "economicGroupNumber":"1",
    "economicGroupName":"1",
    "country": "cub",
    "activityCompany":"banca",
    "riskClassification":"1",
    "minimumProvisionSIB":1.55,
    "relatedPart": true,
    "approvalLevel":"1",
    "accountExecutive":"1",
    "responsibleUnit":"1",
    "countryRisk":"1",
    "requestDate": "2021-12-20",
    "lastRequestDate":"2021-10-20",
    "nextRevisionDate":"2022-01-20",
    "proposedExpirationDate":"2022-01-20",
    "flow":"1"
}
      */

      var result = await this.post(url.URL_BACKEND_PROPUESTACREDITO_DATOSGENERALES, data);//saveProposalData

      /*
      {
    "requestId": "XYZ682022",
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}
      */
      // if (result.statusCode === "200") {

      //   //Nota: Actualizar Variable en BPM de requestId
      //   return result;
      // }

      return result;
    }
    catch (err) {
      console.error("api newDataGeneralPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarSeccionDatosGeneralesPropCred
   * 
  */
  async saveSectionDataGeneralPropCred(data) {
    try {

      /*
      {
    "transactId":107,
    "customerNumber":"123",
    "revision":"1",
    "preapproval":true,
    "economicGroupNumber":"1",
    "economicGroupName":"1",
    "country": "cub",
    "activityCompany":"banca",
    "riskClassification":"1",
    "minimumProvisionSIB":1.55,
    "relatedPart": true,
    "approvalLevel":"1",
    "accountExecutive":"1",
    "responsibleUnit":"1",
    "countryRisk":"1",
    "requestDate": "2021-12-20",
    "lastRequestDate":"2021-10-20",
    "nextRevisionDate":"2022-01-20",
    "proposedExpirationDate":"2022-01-20",
    "flow":"1"
}
      */

      var result = await this.post(url.URL_BACKEND_PROPUESTACREDITO_DATOSGENERALES, data);//saveProposalData
      if (result.status.statusCode === "500") {
        data["date"] = moment().format("YYYY-MM-DD");//"2021-11-10";
        data["status"] = true;
        result = await this.put(url.URL_BACKEND_PROPUESTACREDITO_DATOSGENERALES, data);
        return result;
      }
      if (result.status.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api saveSectionDataGeneralPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarDatosGeneralesPropCred
   * 
  */
  async updateDataGeneralPropCred(data) {
    try {

      /*
      {
    "transactId":107,
    "requestId":"XYZ682022",
    "customerNumber":"1",
    "revision":"1",
    "preapproval":true,
    "economicGroupNumber":"1",
     "economicGroupName": "1",
    "country": "cub",
    "activityCompany":"banca-cambio",
    "riskClassification":"1",
    "minimumProvisionSIB":1,
    "relatedPart": true,
    "approvalLevel":"1",
    "accountExecutive":"1",
    "responsibleUnit":"1",
    "countryRisk":"1",
    "requestDate": "2022-01-20",
    "lastRequestDate":"2022-01-20",
    "nextRevisionDate":"2022-01-20",
    "proposedExpirationDate":"2022-01-20",
    "flow":"1",
    "status":true,
    "date":"2022-01-20"
}
      */

      data["date"] = moment().format("YYYY-MM-DD");//"2021-11-10";
      data["status"] = true;

      var result = await this.put(url.URL_BACKEND_PROPUESTACREDITO_DATOSGENERALES, data);//saveProposalData

      if (result.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api updateDataGeneralPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: consultarDatosGeneralesPropCred
   * 
  */
  async consultGeneralDataPropCred(transactId) { //retorna la Data de Busqueda y Descarte para un proceso
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_PROPUESTACREDITO_DATOSGENERALES + "?" + data);
      /*
                  {
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacción Exitosa"
    },
    "data": [
        {
            "transactId": 108,
            "requestId": "XYZ722022",
            "customerNumber": "123",
            "revision": "1",
            "preapproval": true,
            "economicGroupNumber": "1",
            "economicGroupName": "1",
            "country": "cub",
            "activityCompany": "banca",
            "riskClassification": "1",
            "minimumProvisionSIB": 1.55,
            "relatedPart": true,
            "approvalLevel": "1",
            "accountExecutive": "1",
            "responsibleUnit": "1",
            "countryRisk": "1",
            "requestDate": "2022-01-26",
            "lastRequestDate": "2022-01-17",
            "nextRevisionDate": "2022-01-19",
            "proposedExpirationDate": "2022-01-19",
            "flow": "1",
            "status": true,
            "date": "2022-01-26"
        }
    ]
}
            */
      return result.data;
    }
    catch (err) {
      console.error("api consultGeneralDataPropCred: ", err)
    }
    return undefined;
  }

  ////PROPUSTA DE CREDITO - FACILIDAD ///////

  /**
   * 
   * OldName: nuevoFacilidadPropCred
   * 
  */
  async newFacilityPropCred(data) {
    try {

      /*
      {
    "requestId": "XYZ432022", -> Viene de guardar nuevo datos generales
    "cr": "",
    "amount": 22.5,
    "debtor": "",
    "clientTypeId": 1,
    "balance": 22.5,
    "proposalTypeId": "",
    "proposalTypeName": "",
    "facilityTypeId": "",
    "purpose": "",
    "sublimits": "",
    "proposalRate": 22.5,
    "noSubsidyRate": 22.5,
    "effectiveRate": 22.5,
    "feci": true,
    "termDays": 22.5,
    "termType":"",
    "termDescription": "",
    "ltv": 22.5,
    "finantialConditions": "",
    "environmentRiskCategory": 22.5,
    "covenant": "",
    "environmentRiskOpinion": "",
    "finantialCovenant": "",
    "legalDocumentation": "",
    "creditRiskOpinion": "",
    "provision": "",
    "applyEscrow":true
}
      */

      if(data["t24"]===undefined){
        data["t24"] = false;
      }
      // var result = await this.post(url.URL_BACKEND_PROPUESTACREDITO_FACILIDAD, data);//saveProposalData
      var result = await this.post(url.URL_BACKEND_FACILIDADES, data);//saveProposalData
      console.log("newFacilityPropCred", result);
      /*
      {
    "statusCode": "200",
    "statusDesc": "Transacciï¿½n Exitosa",
    "facilityId": 5
} */
      return result.facilityId;
    }
    catch (err) {
      console.error("api newFacilityPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarFacilidadPropCred
   * 
  */
  async updateFacilityPropCred(data) {
    try {
      // data.facilityId = 12;
      // data.requestId = "XYZ892022";
      /*
      {
    "requestId": "XYZ972022",
    "facilityId":22,
    "cr": "1",
    "amount": 1.0,
    "debtor": "1",
    "clientTypeId": 1,
    "balance": 1.0,
    "proposalTypeId": "1",
    "proposalTypeName": "1",
    "facilityTypeId": "1",
    "purpose": "1",
    "sublimits": "1",
    "proposalRate": 1.0,
    "noSubsidyRate": 1.0,
    "effectiveRate": 1.0,
    "feci": true,
    "termDays": 1.0,
    "termType":"",
    "termDescription": "1",
    "ltv": 1.0,
    "finantialConditions": "1",
    "environmentRiskCategory": 1.0,
    "covenant": "1",
    "environmentRiskOpinion": "1",
    "finantialCovenant": "1",
    "legalDocumentation": "1",
    "otherConditions": "1",
    "creditRiskOpinion": "1",
    "provision": "1",
    "applyEscrow":true,
    "status":true
}
      */
    if(data["t24"]===undefined){
      data["t24"] = false;
    }
      data["status"] = true;
      // var result = await this.put(url.URL_BACKEND_PROPUESTACREDITO_FACILIDAD, data);//saveProposalData
      var result = await this.put(url.URL_BACKEND_FACILIDADES, data);//saveProposalData

      if (result.statusCode === "200" || result.status?.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api updateFacilityPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: consultarFacilidadPropCred
   * 
  */
  async consultFacilidadPropCred(facilityId, requestId) { //retorna la Data de Busqueda y Descarte para un proceso
    try {
      var params = { facilityId: facilityId, requestId: requestId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_PROPUESTACREDITO_FACILIDAD + "?" + data);
      /*
            const json ={ 
    "statusCode": "200",
    "statusDesc": "Transacciï¿½n Exitosa",
    "facilitiesDetailDTO": {
        "requestId": "XYZ432022",
        "facilityId": 2,
        "cr": "",
        "amount": 22.4,
        "debtor": "",
        "clientTypeId": 1,
        "balance": 22.5,
        "proposalTypeId": "",
        "proposalTypeName": "",
        "facilityTypeId": "",
        "purpose": "",
        "sublimits": "",
        "proposalRate": 22.5,
        "noSubsidyRate": 22.5,
        "effectiveRate": 22.5,
        "feci": true,
        "termDays": 22.5,
        "termType":"",
        "termDescription": "",
        "ltv": 22.5,
        "finantialConditions": "",
        "environmentRiskCategory": 22.5,
        "covenant": "",
        "environmentRiskOpinion": "",
        "finantialCovenant": "",
        "legalDocumentation": "",
        "creditRiskOpinion": "",
        "provision": "",
        "applyEscrow":true,
        "t24":false
    }
}
            */
      return result.facilitiesDetailDTO;
    }
    catch (err) {
      console.error("api consultFacilidadPropCred: ", err)
    }
    return undefined;
  }

  ////PROPUSTA DE CREDITO - DESEMBOLSO///////

  /**
   * 
   * OldName: consultarListaDesembolsoPropCred
   * 
  */
  async consultDisbursementListPropCred(facilityId) {
    try {
      var params = { facilityId: facilityId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_PROPUESTACREDITO_DESEMBOLSOS + "?" + data);

      /*{
          "disbursements": [
              {
                  "facilityId": 2,
                  "disbursementTypeId": "update2",
                  "observations": "updated obs",
                  "status": true,
                  "disbursementId": 2
              },
              {
                  "facilityId": 2,
                  "disbursementTypeId": "disbursementTypeId2",
                  "observations": "observations2",
                  "status": true,
                  "disbursementId": 3
              },
              {
                  "facilityId": 2,
                  "disbursementTypeId": "update2",
                  "observations": "updated obs",
                  "status": false,
                  "disbursementId": 1
              },
              {
                  "facilityId": 2,
                  "disbursementTypeId": "update2",
                  "observations": "updated obs",
                  "status": true,
                  "disbursementId": 4
              }
          ],
          "status": {
              "statusCode": "200",
              "statusDesc": "Transacción Exitosa"
          }
      } */

      return result.disbursements;

    }
    catch (err) {
      console.error("api consultDisbursementListPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoDesembolsoPropCred
   * 
  */
  async newDisbursementPropCred(data) {
    try {

      /*{
    "facilityId":"2",
    "disbursementTypeId":"disbursementTypeId2",
    "observations":"observations2"
}
      */

      var result = await this.post(url.URL_BACKEND_PROPUESTACREDITO_DESEMBOLSOS, data);//saveProposalData
      //OK
      /*var result ={
    "disbursementId": 2,
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}*/
      if (result.status.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api newDisbursementPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarDesembolsoPropCred
   * 
  */
  async actualizarDesembolsoPropCred(data) {
    try {

      /*{
    "facilityId":1,
    "disbursementTypeId":"update2",
    "observations":"updated obs",
    "status":true,
    "disbursementId":2
}
      */

      var result = await this.put(url.URL_BACKEND_PROPUESTACREDITO_DESEMBOLSOS, data);//saveProposalData
      //OK
      /*var result ={
    "statusCode": "200",
    "statusDesc": "Transacciï¿½n Exitosa"
}
}*/
      if (result.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarDesembolsoPropCred
   * 
  */
  async deleteDisbursementPropCred(facilityId, disbursementId) {
    try {
      var data = { facilityId: facilityId, disbursementId: disbursementId };
      var result = await this.del(url.URL_BACKEND_PROPUESTACREDITO_DESEMBOLSOS + "?" + qs.stringify(data));
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api deleteDisbursementPropCred: ", err)
    }
    return undefined;
  }

  ////PROPUSTA DE CREDITO - PROGRAMA DE PAGO///////
  /**
   * 
   * OldName: consultarListaProgramaPagoPropCred
   * 
  */
  async consultListProgramPagoPropCred(facilityId) {
    try {
      var params = { facilityId: facilityId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_PROPUESTACREDITO_PROGRAMAPAGO + "?" + data);
      /*{
    "statusCode": "200",
    "statusDesc": "Transacciï¿½n Exitosa",
    "paymentProgramDTOList": [
        {
            "facilityId": 2,
            "paymentProgram": "tt1",
            "observations": "desc1",
            "status": true,
            "paymentProgramId": 2
        },
        {
            "facilityId": 2,
            "paymentProgram": "tt1",
            "observations": "desc1",
            "status": true,
            "paymentProgramId": 3
        },
        {
            "facilityId": 2,
            "paymentProgram": "tt1",
            "observations": "desc1",
            "status": true,
            "paymentProgramId": 4
        },
        {
            "facilityId": 2,
            "paymentProgram": "tt1",
            "observations": "desc1",
            "status": true,
            "paymentProgramId": 1
        },
        {
            "facilityId": 2,
            "paymentProgram": "tt1",
            "observations": "desc1",
            "status": true,
            "paymentProgramId": 5
        }
    ]
}*/
      return result.paymentProgramDTOList;
    }
    catch (err) {
      console.error("api consultListProgramPagoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoProgramaPagoPropCred
   * 
  */
  async newProgramPagoPropCred(data) {
    try {

      /*{
    "facilityId": 2,
    "paymentProgram": "tt1",
    "observations": "desc1"
}
      */

      var result = await this.post(url.URL_BACKEND_PROPUESTACREDITO_PROGRAMAPAGO, data);//saveProposalData
      //OK
      /*{
    "serviceResponseTO": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    },
    "paymentProgramId": "5"
}*/
      if (result.serviceResponseTO.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api newProgramPagoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarProgramaPagoPropCred
   * 
  */
  async updateProgramPagoPropCred(data) {
    try {

      /*{
    "facilityId": 2,
    "paymentProgram": "tt1",
    "observations": "desc1",
    "paymentProgramId":5,
    "status":true
}
      */

      var result = await this.put(url.URL_BACKEND_PROPUESTACREDITO_PROGRAMAPAGO, data);//saveProposalData
      //OK
      /*var result ={
    "statusCode": "200",
    "statusDesc": "Transacciï¿½n Exitosa"
}
}*/
      if (result.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api updateProgramPagoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarProgramaPagoPropCred
   * 
  */
  async deleteProgramPagoPropCred(facilityId, paymentProgramId) {
    try {
      var data = { facilityId: facilityId, paymentProgramId: paymentProgramId };
      var result = await this.del(url.URL_BACKEND_PROPUESTACREDITO_PROGRAMAPAGO + "?" + qs.stringify(data));
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api deleteProgramPagoPropCred: ", err)
    }
    return undefined;
  }

  ////PROPUSTA DE CREDITO - COMISION///////
  /**
   * 
   * OldName: consultarComisionPropCred
   * 
  */
  async consultCommissionPropCred(facilityId) {
    try {
      var params = { facilityId: facilityId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_PROPUESTACREDITO_COMISION + "?" + data);

      /*{
    "commission": [
        [
            2,
            null,
            "vtipocomision character varying",
            12.5,
            "vdescripcion text,",
            true
        ],
        [
            2,
            null,
            "Comision",
            500000,
            "Prestamos",
            true
        ]
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacción Exitosa"
    }
}*/
      return result;

    }
    catch (err) {
      console.error("api consultCommissionPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoComisionPropCred
   * 
  */
  async newCommissionPropCred(data) {
    try {

      /*{
    "facilityId":2,
    "comisionType":"Comision",
    "amount":500000,
    "observations":"Prestamo"
}
      */

      var result = await this.post(url.URL_BACKEND_PROPUESTACREDITO_COMISION, data);//saveProposalData
      //OK
      /*var result ={
    "disbursementId": 2,
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}*/
      if (result.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api newCommissionPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarComisionPropCred
   * 
  */
  async updateComisionPropCred(data) {
    try {

      /*
     
      {
    "facilityId":4,
    "commissionId":1,
    "comisionType":"Comision",
    "amount":500000,
    "observations":"Prestamo",
    "status":true
}
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_PROPUESTACREDITO_COMISION, data);//saveProposalData
      //OK
      /*var result ={
    "statusCode": "200",
    "statusDesc": "Transacciï¿½n Exitosa"
}
}*/
      if (result.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api updateComisionPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarComisionPropCred
   * 
  */
  async deleteComisionPropCred(facilityId, commissionId) {
    try {
      var data = { facilityId: facilityId, commissionId: commissionId };
      var result = await this.del(url.URL_BACKEND_PROPUESTACREDITO_COMISION + "?" + qs.stringify(data));
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api deleteComisionPropCred: ", err)
    }
    return undefined;
  }

  ////PROPUSTA DE CREDITO - FORMA DE DESEMBOLSO///////
  /**
   * 
   * OldName: consultarFormaDesembolsoPropCred
   * 
  */
  async consultDisbursementFormPropCred(facilityId) {
    try {
      var params = { facilityId: facilityId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_PROPUESTACREDITO_FORMADESEMBOLSO + "?" + data);

      /*{
    "facilityId": 2,
    "disbursementForm": [
        {
            "formOfDisbursement": "tipodesembolso ",
            "observations": "description ingreso",
            "status": true,
            "commissionId": 1
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}
} */
      return result.disbursementForm;
    }
    catch (err) {
      console.error("api consultDisbursementFormPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoFormaDesembolsoPropCred
   * 
  */
  async newFormDisbursementPropCred(data) {
    try {

      /*{
    "facilityid": "2",
    "typedistrenchment":"tipodesembolso ",
    "description":"description ingreso"
}
      */

      var result = await this.post(url.URL_BACKEND_PROPUESTACREDITO_FORMADESEMBOLSO, data);//saveProposalData
      //OK
      /*var result ={
    "disbursementId": 2,
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}*/
      if (result.status.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api newFormDisbursementPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarFormaDesembolsoPropCred
   * 
  */
  async updateFormDisbursementPropCred(data) {
    try {

      /*{
    "facilityid":2,
    "typedistrenchment":"tipodesembolso",
    "description":"description actualizada",
    "status":true,
    "disbursementid":1
}
      */

      var result = await this.put(url.URL_BACKEND_PROPUESTACREDITO_FORMADESEMBOLSO, data);//saveProposalData
      //OK
      /*var result ={
    "statusCode": "200",
    "statusDesc": "Transacciï¿½n Exitosa"
}
}*/
      if (result.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api updateFormDisbursementPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarFormaDesembolsoPropCred
   * 
  */
  async deleteDisbursementFormPropCred(facilityId, disbursementFormId) {
    try {
      var data = { facilityId: facilityId, disbursementFormId: disbursementFormId };
      var result = await this.del(url.URL_BACKEND_PROPUESTACREDITO_FORMADESEMBOLSO + "?" + qs.stringify(data));
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api deleteDisbursementFormPropCred: ", err)
    }
    return undefined;
  }

  ////PROPUSTA DE CREDITO - GARANTIA///////
  /**
   * 
   * OldName: consultarGarantiaPropCred
   * 
  */
  async consultarGarantiaPropCred(facilityId) {
    try {
      var params = { requestId: facilityId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_PROPUESTACREDITO_GARANTIA + "?" + data);

      /*{
    "requestId": "2",
    "guarantees": [
        {
            "guaranteeId": 1,
            "guaranteeTypeName": "garantia",
            "commercialValue": 255,
            "fastValue": 200,
            "observations": "observacion prueba",
            "ltv": 600,
            "appraisalDate": "2021-12-22",
            "signature": "firma prueba",
            "trustNumber": "numero nose como es ",
            "fiduciary": "el fidu de la prueba",            
            "guaranteeSubtypeCode": "subtipoGarntiaCod",
            "guaranteeSubtypeDesc": "subtipoGarntiaDesc",
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}*/
      return result.guarantees;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoGarantiaPropCred
   * 
  */
  async nuevoGarantiaPropCred(data) {
    try {

      /*{
      "requestId": 2, //facilityId
      "guaranteeTypeName": "garantia",
      "commercialValue": "255",
      "fastValue": "200",
      "observations": "observacion prueba",
      "ltv": "600",
      "appraisalDate": "2021-12-22T19:13:53.786004+00:00",
      "signature": "firma prueba",
      "trustNumber": "numero nose como es ",
      "fiduciary": "el fidu de la prueba",
      "guaranteeSubtypeCode": "subtipoGarntiaCod",
      "guaranteeSubtypeDesc": "subtipoGarntiaDesc"
    }
      */

      var result = await this.post(url.URL_BACKEND_PROPUESTACREDITO_GARANTIA, data);//saveProposalData
      //OK
      /*var result ={
    "guaranteeId": 1,
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}*/
      if (result.status.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarGarantiaPropCred
   * 
  */
  async actualizarGarantiaPropCred(data) {
    try {

      /*{
    "requestId": 2, //facilityId
    "guaranteeId": 1,
    "guaranteeTypeName": "2",
    "commercialValue": 655,
    "fastValue": 800,
    "observations": "observacion prueba",
    "ltv": 700,
    "appraisalDate": "2021-12-22T05:00:00.000+00:00",
    "signature": "firma prueba actualizada",
    "trustNumber": "numero nose como es ",
    "fiduciary": "el fidu de la prueba actualizada",
    "guaranteeSubtypeCode": "subtipoGarntiaCod",
    "guaranteeSubtypeDesc": "subtipoGarntiaDesc",
    "status": false
}
      */

      var result = await this.put(url.URL_BACKEND_PROPUESTACREDITO_GARANTIA, data);//saveProposalData
      //OK
      /*var result ={
    "statusCode": "200",
    "statusDesc": "Transacciï¿½n Exitosa"
}
}*/
      if (result.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarGarantiaPropCred
   * 
  */
  async eliminarGarantiaPropCred(facilityId, guaranteeId) {
    try {
      var data = { requestId: facilityId, guaranteeId: guaranteeId };
      var result = await this.del(url.URL_BACKEND_PROPUESTACREDITO_GARANTIA + "?" + qs.stringify(data));
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarEmpresaRelacionada: ", err)
    }
    return undefined;
  }

  ////PROPUSTA DE CREDITO - FIANZAS///////

  /**
   * 
   * OldName: consultarFianzaPropCred
   * 
  */
  async consultarFianzaPropCred(facilityId) {
    try {
      var params = { facilityId: facilityId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_PROPUESTACREDITO_FIANZA + "?" + data);

      /*{
    "bails": [
        {
            "facilityId": 2,
            "idBail": 2,
            "typeBail": "Jose Vargas",
            "observations": "Competicion",
            "status": true
        },
        {
            "facilityId": 2,
            "idBail": 1,
            "typeBail": "Fianza",
            "observations": "Entrega",
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacción exitosa"
    }
}*/
      return result.bails;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoFianzaPropCred
   * 
  */
  async nuevoFianzaPropCred(data) {
    try {

      /*{
    "facilityId": 2,
      "typeBail": "Jose Vargas",
      "observations":"Competicion"
  }
      */

      var result = await this.post(url.URL_BACKEND_PROPUESTACREDITO_FIANZA, data);//saveProposalData
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      if (result.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarFianzaPropCred
   * 
  */
  async actualizarFianzaPropCred(data) {
    try {

      /*{
    "facilityId": 2,
      "idBail":1,
      "typeBail": "Fianza",
      "observations":"Entrega",
      "status":true
  }
      */

      var result = await this.put(url.URL_BACKEND_PROPUESTACREDITO_FIANZA, data);//saveProposalData
      //OK
      /*var result ={
    "statusCode": "200",
    "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      if (result.statusCode === "200") {
        return result;
      }
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarFianzaPropCred
   * 
  */
  async eliminarFianzaPropCred(facilityId, idBail) {
    try {
      var data = { facilityId: facilityId, bailId: idBail };
      var result = await this.del(url.URL_BACKEND_PROPUESTACREDITO_FIANZA + "?" + qs.stringify(data));
      //var result = await this.put(url.URL_BACKEND_PROPUESTACREDITO_FIANZABORRAR, data);

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarFianzaPropCred: ", err)
    }
    return undefined;
  }


  /////ANALISIS DE CREDITO //////
  ///////////////////////////////
  //Balance Pasivo

  /**
   * 
   * OldName: checkBalancePassiveAC
   * 
  */
  async checkBalancePassiveAC(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_BALANCEPASIVOAC + "?" + data);

      /*
     {
    "activeBalanceDebtor": [
        {
            "transactId": 1,
            "personId": 1,
            "itemActiveId": 1,
            "itemActive": "fake_data",
            "year1": 87.49,
            "year2": 68.44,
            "year3": 72.14,
            "year4": 75.56,
            "presentYear": 5.42,
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}
      */
      return result.passiveBalanceDebtor;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoBalancePasivoAC
   * 
  */
  async nuevoBalancePasivoAC(data) {
    try {

      /*{
"transactId":4,
"personId":4,
"itemPassive":"ITEM PASIVO", 
"year1": 0.55,
"year2": 0.55,
"year3": 0.55,
"year4": 0.55,
"presentYear":0.55
}
      */

      var result = await this.post(url.URL_BACKEND_BALANCEPASIVOAC, data);//saveProposalData
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarBalancePasivoAC
   * 
  */
  async actualizarBalancePasivoAC(data) {
    try {

      /*{
"transactId":4,
"personId":4,
"itemPassiveId":4,
"itemPassive":"ITEM PASIVO", 
"year1": 3.65,
"year2": 3.65,
"year3": 3.65,
"year4": 3.65,
"presentYear":3.65,
"status":true
}
      */
      data["status"] = true;

      var result = await this.put(url.URL_BACKEND_BALANCEPASIVOAC, data);//saveProposalData
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarBalancePasivoAC
   * 
  */
  async eliminarBalancePasivoAC(transactId, personId, itemPassiveId) {
    try {
      var data = { transactId: transactId, personId: personId, itemPassiveId: itemPassiveId };
      var result = await this.del(url.URL_BACKEND_BALANCEPASIVOAC + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarFianzaPropCred: ", err)
    }
    return undefined;
  }

  //ESTADO Y ORIGEN DE LAS APLICACIONES X DEUDOR

  /**
   * 
   * OldName: consultarEstadoOrigenAplicacionesxDeudor
   * 
  */
  async consultarEstadoOrigenAplicacionesxDeudor(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_ESTADOORIGENAPLICACIONAC + "?" + data);

      /*{
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    },
    "sourceApplicationsStates": [
        {
            "transactId": 9327,
            "personId": 1,
            "sourceApplicationItemId": 1,
            "sourceApplicationItem": "fake_data",
            "year1": 81.36,
            "year2": 53.93,
            "year3": 54.11,
            "year4": 23.29,
            "presentYear": 86.10,
            "status": true
        }
    ]
}*/

      return result.sourceApplicationsStates;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarEstadoOrigenAplicacionesxDeudor
   * 
  */
  async guardarEstadoOrigenAplicacionesxDeudor(data) {
    try {

      /*{
    "transactId": 9327,
    "personId": 1,
    "sourceApplicationItem": "fake_data",
    "year1": 81.36,
    "year2": 53.93,
    "year3": 54.11,
    "year4": 23.29,
    "presentYear": 86.10
}
      */

      var result = await this.post(url.URL_BACKEND_ESTADOORIGENAPLICACIONAC, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarEstadoOrigenAplicacionesxDeudor
   * 
  */
  async actualizarEstadoOrigenAplicacionesxDeudor(data) {
    try {

      /*{
    "transactId": 9327,
    "personId": 1,
    "sourceApplicationItem": "fake_data",
    "year1": 81.36,
    "year2": 53.93,
    "year3": 54.11,
    "year4": 23.29,
    "presentYear": 86.10
}
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_ESTADOORIGENAPLICACIONAC, data);//saveProposalData
      if (result.statusCode === "500") {
        result = await this.post(url.URL_BACKEND_ESTADOORIGENAPLICACIONAC, data);//saveProposalData
      }

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarEstadoOrigenAplicacionesxDeudor
   * 
  */
  async eliminarEstadoOrigenAplicacionesxDeudor(transactId, personId, sourceApplicationItemId) {
    try {
      var data = { transactId: transactId, sourceApplicationItemId: sourceApplicationItemId, personId: personId };
      var result = await this.del(url.URL_BACKEND_ESTADOORIGENAPLICACIONAC + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  //Balance Activo

  /**
   * 
   * OldName: queryACIndicator
   * 
  */
  async queryACIndicator(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_INDICADORAC + "?" + data);

      /*{
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa",
      "indicatorDTOList": [
          {
              "transactId": 1,
              "itemIndicatorsId": 1,
              "itemIndicators": "fghf",
              "year1": 0.55,
              "year2": 0.55,
              "year3": 0.55,
              "year4": 0.55,
              "presentYear": 0.55,
              "status": true
          },
          {
              "transactId": 1,
              "itemIndicatorsId": 2,
              "itemIndicators": "fghf",
              "year1": 0.56,
              "year2": 0.55,
              "year3": 0.55,
              "year4": 0.55,
              "presentYear": 0.56,
              "status": true
          }
      ]
  }*/
      return result.indicatorDTOList;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: newACIndicator
   * 
  */
  async newACIndicator(data) {
    try {

      /*{
      "transactId": 1,
      "itemIndicators": "fghf",
      "year1": 0.55,
      "year2": 0.55,
      "year3": 0.55,
      "year4": 0.55,
      "presentYear": 0.55
  }

      */

      var result = await this.post(url.URL_BACKEND_INDICADORAC, data);//saveProposalData
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarIndicadorAC
   * 
  */
  async actualizarIndicadorAC(data) {
    try {

      /*{
      "transactId": 1,
      "itemIndicatorsId": 1,
      "itemIndicators": "1111",
      "year1": 0.56,
      "year2": 0.55,
      "year3": 0.55,
      "year4": 0.55,
      "presentYear": 0.56,
      "status": true
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_INDICADORAC, data);//saveProposalData
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarIndicadorAC
   * 
  */
  async eliminarIndicadorAC(transactId, itemIndicatorsId) {
    try {
      var data = { transactId: transactId, itemIndicatorsId: itemIndicatorsId };
      var result = await this.del(url.URL_BACKEND_INDICADORAC + "?" + qs.stringify(data));
      //var result = await this.put(url.URL_BACKEND_PROPUESTACREDITO_FIANZABORRAR, data);

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarFianzaPropCred: ", err)
    }
    return undefined;
  }

  //INDICADORES X DEUDOR

  /**
   * 
   * OldName: consultarListaIndicadores
   * 
  */
  async consultarListaIndicadores(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_INDICADORAC + "?" + data);

      /*{
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    },
    "sourceApplicationsStates": [
        {
            "transactId": 9327,
            "personId": 1,
            "sourceApplicationItemId": 1,
            "sourceApplicationItem": "fake_data",
            "year1": 81.36,
            "year2": 53.93,
            "year3": 54.11,
            "year4": 23.29,
            "presentYear": 86.10,
            "status": true
        }
    ]
}*/

      return result.sourceApplicationsStates;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarListaIndicadores
   * 
  */
  async guardarListaIndicadores(data) {
    try {

      /*{
"transactId":3,
"personId":3, 
"itemIndicators":"INDICADORES ITEM",
"year1":0.55,
"year2":0.55,
"year3":0.55,
"year4":0.55,
"presentYear":0.55
}
      */

      var result = await this.post(url.URL_BACKEND_INDICADORAC, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarListaIndicadores
   * 
  */
  async actualizarListaIndicadores(data) {
    try {

      /*{
"transactId":3,
"personId":3, 
"itemIndicatorsId":3,
"itemIndicators":"INDICADORES",
"year1":3.65,
"year2":3.65,
"year3":3.65,
"year4":3.65,
"presentYear":3.65,
"status":true
}
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_INDICADORAC, data);//saveProposalData
      if (result.statusCode === "500") {
        result = await this.post(url.URL_BACKEND_INDICADORAC, data);//saveProposalData
      }

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarListaIndicadores
   * 
  */
  async eliminarListaIndicadores(transactId, personId, itemIndicatorsId) {
    try {
      var data = { transactId: transactId, personId: personId, itemIndicatorsId: itemIndicatorsId };
      var result = await this.del(url.URL_BACKEND_INDICADORAC + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  //Balance Activo

  /**
   * 
   * OldName: checkActiveBalanceAC
   * 
  */
  async checkActiveBalanceAC(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_BALANCEACTIVOAC + "?" + data);

      /*{
    "activeBalanceDebtor": [
        {
            "transactId": 1,
            "personId": 1,
            "itemActiveId": 1,
            "itemActive": "fake_data",
            "year1": 87.49,
            "year2": 68.44,
            "year3": 72.14,
            "year4": 75.56,
            "presentYear": 5.42,
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}*/

      return result.activeBalanceDebtor;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: newActiveBalanceAC
   * 
  */
  async newActiveBalanceAC(data) {
    try {

      /*{
  "transactId": 41,
  "personId": 49,
  "itemActive": "fake_data",
  "year1": 87.49,
  "year2": 68.44,
  "year3": 72.14,
  "year4": 75.56,
  "presentYear": 5.42
}
      */

      var result = await this.post(url.URL_BACKEND_BALANCEACTIVOAC, data);//saveProposalData
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: updateActiveBalanceAC
   * 
  */
  async updateActiveBalanceAC(data) {
    try {

      /*{
  "transactId": 41,
  "personId": 49,
  "itemActiveId": 1,
  "itemActive": "fake_data",
  "year1": 29.93,
  "year2": 1.81,
  "year3": 68.87,
  "year4": 58.83,
  "presentYear": 1.64,
  "status": false
}
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_BALANCEACTIVOAC, data);//saveProposalData
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarBalanceActivoAC
   * 
  */
  async eliminarBalanceActivoAC(transactId, personId, itemActiveId) {
    try {
      var data = { transactId: transactId, personId: personId, itemActiveId: itemActiveId };
      var result = await this.del(url.URL_BACKEND_BALANCEACTIVOAC + "?" + qs.stringify(data));
      //var result = await this.put(url.URL_BACKEND_PROPUESTACREDITO_FIANZABORRAR, data);

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarFianzaPropCred: ", err)
    }
    return undefined;
  }


  //POLITICAS DE CREDITOS - INFORME FINANCIERO

  /**
   * 
   * OldName: consultarPoliticaCredito
   * 
  */
  async consultarPoliticaCredito(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_POLITICACREDITO + "?" + data);

      /*{
    "creditPolicy": [
          {
              "transactId": 1,
            "debtorId": 7,
            "itemId": 1,
            "parameter": "Reglas",
            "condition": "Restriccion",
            "comply": "false",
            "observations": "Politicas de Credito",
              "status": true
          }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacción exitosa"
    }
  }*/

      return result.newCreditPolicy;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoPoliticaCredito
   * 
  */
  async nuevoPoliticaCredito(data) {
    try {

      /*
  {
"transactId":4,
"debtorId":4,
"parameter":"Reglas",
"condition":"Restriccion",
"comply": "true",
"observations":"Politicas de Credito"
}
      */

      var result = await this.post(url.URL_BACKEND_POLITICACREDITO, data);//saveProposalData
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarPoliticaCredito
   * 
  */
  async actualizarPoliticaCredito(data) {
    try {

      /*{
"transactId":3,
"debtorId":3,
"itemId":3,
"parameter":"Reglas",
"condition":"Restriccion",
"comply": "true",
"observations":"Politicas de Credito",
"status":true
}
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_POLITICACREDITO, data);//saveProposalData
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarPoliticaCredit
   * 
  */
  async eliminarPoliticaCredit(transactId, debtorId, itemId) {
    try {
      var data = { transactId: transactId, debtorId: debtorId, itemId: itemId };
      var result = await this.del(url.URL_BACKEND_POLITICACREDITO + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarFianzaPropCred: ", err)
    }
    return undefined;
  }


  //INFORMACION FINANCIERA - INFORME FINANCIERO

  /**
   * 
   * OldName: consultarInformiacionFinancieraFiadores
   * 
  */
  async consultarInformiacionFinancieraFiadores(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_INFOFINANCIERA + "?" + data);

      /*{
    "finantialInfoGuarantor": [
        {
            "transactId": 101,
            "debtorId": 1,
            "guarantorId": 1,
            "personType": "NATURAL",
            "identificationType": "CEDULA",
            "identificationNumber": "987654",
            "firstName": "ANDREA",
            "secondName": "JOSEFINA",
            "firstLastName": "VELASQUEZ",
            "secondLastName": "BARROS",
            "share": 500.000,
            "activeCash": 250.000,
            "activeShares": 160.000,
            "passiveLoan": 50.000,
            "personalWealth": 850.000,
            "status": true
        }
    ],
      "status": {
        "statusCode": "200",
        "statusDesc": "Transacción exitosa"
      }
  }*/

      return result.finantialInfoGuarantor;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoInformacionFinancieraFiadores
   * 
  */
  async nuevoInformacionFinancieraFiadores(data) {
    try {

      /*{
  "transactId":2,
  "debtorId":2,
  "personType":"NATURAL",
  "identificationType":"CEDULA",
  "identificationNumber":"987654",
  "firstName":"ANDREA",
  "secondName":"JOSEFINA",
  "firstLastName":"VELASQUEZ",
  "secondLastName":"BARROS",
  "share":500.000,
  "activeCash":250.000,
  "activeShares":160.000,
  "passiveLoan":50.000,
  "personalWealth":850.000
  }
      */
      data.transactId = Number(data.transactId)
      data.share = Number(data.share);
      data.activeCash = Number(data.activeCash);
      data.activeShares = Number(data.activeShares);
      data.passiveLoan = Number(data.passiveLoan);
      data.personalWealth = Number(data.personalWealth);
      var result = await this.post(url.URL_BACKEND_INFOFINANCIERA, data);//saveProposalData
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarInformacionFinancieraFiadores
   * 
  */
  async actualizarInformacionFinancieraFiadores(data) {
    try {

      /*{
  "transactId":2,
  "debtorId":2,
  "guarantorId":2,
  "personType":"NATURAL",
  "identificationType":"CEDULA",
  "identificationNumber":"987654",
  "firstName":"ANDREA",
  "secondName":"JOSEFINA",
  "firstLastName":"VELASQUEZ",
  "secondLastName":"BARROS",
  "share":500.000,
  "activeCash":250.000,
  "activeShares":160.000,
  "passiveLoan":50.000,
  "personalWealth":850.000,
  "status":true
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_INFOFINANCIERA, data);//saveProposalData
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarInformacionFinancieraFiadores
   * 
  */
  async eliminarInformacionFinancieraFiadores(transactId, debtorId, guarantorId) {
    try {
      var data = { transactId: transactId, debtorId: debtorId, guarantorId: guarantorId };
      var result = await this.del(url.URL_BACKEND_INFOFINANCIERA + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  //INFORMACION FINANCIERA - INFORME FINANCIERO

  /**
   * 
   * OldName: consultarDetalleOpinionRiesgoCredito
   * 
  */
  async consultarDetalleOpinionRiesgoCredito(transactId) {
    try {
      var params = { requestId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_OPINIONRIESGOCREDITO + "?" + data);

      /*{
      "status": {
          "statusCode": "200",
          "statusDesc": "Transacción Exitosa"
      },
      "opinions": [
          {
              "transactId": 1,
              "opinion": "opinion",
              "status": true
          },
          {
              "transactId": 1,
              "opinion": "opinion",
              "status": true
          }
      ]
  }*/

      return result.opinions;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoDetalleOpinionRiesgoCredito
   * 
  */
  async nuevoDetalleOpinionRiesgoCredito(data) {
    try {

      /*{
      "transactId":1,
       "opinion":"opinion"
  }
      */

      var result = await this.post(url.URL_BACKEND_OPINIONRIESGOCREDITO, data);//saveProposalData
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarDetalleOpinionRiesgoCredito
   * 
  */
  async actualizarDetalleOpinionRiesgoCredito(data) {
    try {

      /*{
      "transactId":1,
       "opinion":"opinion-updated",
       "status":true
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_OPINIONRIESGOCREDITO, data);//saveProposalData
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarDetalleOpinionRiesgoCredito
   * 
  */
  async eliminarDetalleOpinionRiesgoCredito(transactId) {
    try {
      var data = { requestId: transactId };
      var result = await this.del(url.URL_BACKEND_OPINIONRIESGOCREDITO + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  //CONCLUSIONES Y RECOMENDACIONES - INFORME FINANCIERO

  /**
   * 
   * OldName: consultarConclusionesRecomendacionesAnalisisFinanciero
   * 
  */
  async consultarConclusionesRecomendacionesAnalisisFinanciero(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_CONCLUSIONESRECOMENDACIONESINFORMEFINANCIERO + "?" + data);

      /*{
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa",
      "conclusionFinantialAnalysisDTOList": [
          {
              "transactId": 1,
              "debtorId": "3",
              "strengths": "13",
              "weakness": "13",
              "conclusion": "13",
              "status": true
          },
          {
              "transactId": 1,
              "debtorId": "3",
              "strengths": "13",
              "weakness": "13",
              "conclusion": "13",
              "status": true
          }
      ]
  }*/

      return result.conclusionFinantialAnalysisDTOList;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoConclusionesRecomendacionesAnalisisFinanciero
   * 
  */
  async nuevoConclusionesRecomendacionesAnalisisFinanciero(data) {
    try {

      /*{
      "transactId": 1,
      "debtorId": "3",
      "strengths": "13",
      "weakness": "13",
      "conclusion": "13"
  }
      */

      var result = await this.post(url.URL_BACKEND_CONCLUSIONESRECOMENDACIONESINFORMEFINANCIERO, data);//saveProposalData
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarConclusionesRecomendacionesAnalisisFinanciero
   * 
  */
  async actualizarConclusionesRecomendacionesAnalisisFinanciero(data) {
    try {

      /*{
      "transactId": 1,
      "debtorId": "3",
      "strengths": "13a",
      "weakness": "13",
      "conclusion": "13",
      "status": true
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_CONCLUSIONESRECOMENDACIONESINFORMEFINANCIERO, data);//saveProposalData
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarConclusionesRecomendacionesAnalisisFinanciero
   * 
  */
  async eliminarConclusionesRecomendacionesAnalisisFinanciero(transactId, debtorId) {
    try {
      var data = { requestId: transactId, debtorId: debtorId };
      var result = await this.del(url.URL_BACKEND_CONCLUSIONESRECOMENDACIONESINFORMEFINANCIERO + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  //ASPECTOS AMBIENTALES - ASPECTOS AMBIENTALES

  //OldName: consultarInformacionRiesgoAmbiental
  async getEnvironmentalRiskInfo(transactId) {
    try {
      var params = { transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_RIESGOAMBIENTALDETALLES + "?" + data);

      /*{
    "transactId": 101,
      "environmentCovenant": true,
      "detail": "Detalle",
      "compliance": "Incumplido",
      "term": "Indefinido",
      "detected": "Sin detectar",
      "recommendations": "Recomendar",
      "conclusions": "Concluido",
      "status": true,
      "serviceStatus": {
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa"
      }
  }*/

      return result;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err);
      throw err;
    }
  }
  //OldName: nuevoInformacionRiesgoAmbiental
  async saveEnvironmentalRiskInfo(data) {
    try {

      /*{
"transactId":101,
  "environmentCovenant":true,
  "detail":"Detalle",
  "compliance":"Incumplido",
  "term":"Indefinido",
  "detected":"Sin detectar",
  "recommendations":"Recomendar",
"conclusions":"Concluido"
  }
      */

      var result = await this.post(url.URL_BACKEND_RIESGOAMBIENTALDETALLES, data);//saveProposalData
      //OK
      if (result.statusCode == "500") {
        data["status"] = true;
        result = await this.put(url.URL_BACKEND_RIESGOAMBIENTALDETALLES, data);//saveProposalData
        return result
      }
      return result;

      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }
  //OldName: eliminarInformacionRiesgoAmbiental
  async deleteEnvironmentalRiskInfo(transactId) {
    try {
      var data = { transactId: transactId };
      var result = await this.del(url.URL_BACKEND_RIESGOAMBIENTALDETALLES + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }


  //OldName: consultarRiesgoCreditoComercial
  async consultarRiesgoCreditoComercial(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_RIESGOCREDITOS + "?" + data);

      /*{
      "transactId": 1,
      "conclusions": "Recomendaciones",
      "status": true,
      "serviceStatus": {
          "statusCode": "200",
        "statusDesc": "Transacción exitosa"
      }
  }*/

      return result;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  //nuevoRiesgoCreditoComercial
  async salvarRiesgoCreditoComercial(data) {
    try {

      /*{
  "transactId":1,
  "conclusions":"Recomendaciones"
  }
      */

      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_RIESGOCREDITOS, data);//saveProposalData
      if (result.statusCode !== opt.ResponseBackend_STATUSOK) {
        result = await this.post(url.URL_BACKEND_RIESGOCREDITOS, data);
      }
      //saveProposalData
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  //eliminarRiesgoCreditoComercial
  async eliminarRiesgoCreditoComercial(transactId) {
    try {
      var data = { transactId: transactId };
      var result = await this.del(url.URL_BACKEND_RIESGOCREDITOS + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  //FIDEICOMISO - GENERAR NUMERO DE FIDEICOMISO

  /**
   * 
   * OldName: consultarNumeroFideicomiso
   * 
  */
  async consultarNumeroFideicomiso(transactId) {
    try {
      var params = { requestId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_NUMEROFIDEICOMISO + "?" + data);

      /*{
      "status": {
          "statusCode": "200",
          "statusDesc": "Transacción Exitosa"
      },
      "trustInfo": [
          {
              "transactId": 1,
              "trustName": "BASA FID 2004",
              "trustNumber": "2004",
              "conclusions": "conclusions",
              "status": true
          }
      ]
  } */

      return result.trustInfo;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarNumeroFideicomiso
   * 
  */
  async guardarNumeroFideicomiso(data) {
    try {

      /*{
      "transactId":"200",
      "conclusions":"conclusions"
  }
      */
      var result = await this.post(url.URL_BACKEND_NUMEROFIDEICOMISO, data);//saveProposalData
      if (result.status.statusCode === "500") {
        data["status"] = true;
        result = await this.put(url.URL_BACKEND_NUMEROFIDEICOMISO, data);//saveProposalData
      }
      //OK
      /*{
      "status": {
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa"
      },
      "trustNumber": "2004",
      "trustName": "BASA FID 2004"
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }
  /**
   * 
   * OldName: eliminarNumeroFideicomiso
   * 
  */
  async eliminarNumeroFideicomiso(transactId) {
    try {
      var data = { requestId: transactId };
      var result = await this.del(url.URL_BACKEND_NUMEROFIDEICOMISO + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  //FIDEICOMISO - GENERAR NUMERO DE FIDEICOMISO

  /**
   * 
   * OldName: consultarListaFideicomitentes
   * 
  */
  async consultarListaFideicomitentes(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_FIDEICOMITENTES + "?" + data);

      /*{
      "trustors": [
          {
              "transactId": 1,
              "trustorId": 3,
              "name": "maicol",
              "address": "nuevo san juan",
              "email": "igomez@soaint.com",
              "telephone": 6666666,
              "status": true
          },
          {
              "transactId": 1,
              "trustorId": 4,
              "name": "maicol",
              "address": "nuevo san juan",
              "email": "igomez@soaint.com",
              "telephone": 6666666,
              "status": true
          }
      ],
      "status": {
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa"
      }
  }
  } */

      return result.trustors;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevaListaFideicomitentes
   * 
  */
  async nuevaListaFideicomitentes(data) {
    try {

      /*{
"transactId":1,
"personId":1,
"name":"JOSE",
"address":"CARRERA",
"email":"jose@correo.com",
"telephone":2222222
}
      */

      var result = await this.post(url.URL_BACKEND_FIDEICOMITENTES, data);//saveProposalData
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarListaFideicomitentes
   * 
  */
  async actualizarListaFideicomitentes(data) {
    try {

      /*{
"transactId":1,
"personId":1,
"name":"JOSE",
"address":"CARRERA",
"email":"jose@correo.com",
"telephone":2222222,
"status":true
}
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_FIDEICOMITENTES, data);//saveProposalData
      if (result.statusCode === "500") {
        result = await this.post(url.URL_BACKEND_FIDEICOMITENTES, data);//saveProposalData
      }
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarListaFideicomitentes
   * 
  */
  async eliminarListaFideicomitentes(transactId, personId) {
    try {
      var data = { transactId: transactId, personId: personId };
      var result = await this.del(url.URL_BACKEND_FIDEICOMITENTES + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  //FIDEICOMISO - GENERAR NUMERO DE FIDEICOMISO

  /**
   * 
   * OldName: consultarTipoFiduciarioYOtrosDatos
   * 
  */
  async consultarTipoFiduciarioYOtrosDatos(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_FIDUCIARIAOTROSBANCOS + "?" + data);

      /*{
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa",
      "finantialCommissionDTO": {
          "transactId": 101,
          "structuring": "t2",
          "facilityType": "t2",
          "creditLineRot": "t2",
          "creditLineNoRot": "t2",
          "declineLoan": "t2",
          "status": true
      }
  }*/

      return result.finantialCommissionDTO;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarTipoFiduciarioYOtrosDatos
   * 
  */
  async guardarTipoFiduciarioYOtrosDatos(data) {
    try {

      /*{
      "transactId": 101,
      "structuring": "t2",
      "facilityType": "t2",
      "creditLineRot": "t2",
      "creditLineNoRot": "t2",
      "declineLoan": "t2",
  }
      */

      var result = await this.post(url.URL_BACKEND_FIDUCIARIAOTROSBANCOS, data);//saveProposalData

      if (result.statusCode === 500) {
        data["status"] = true;
        result = await this.put(url.URL_BACKEND_FIDUCIARIAOTROSBANCOS, data);
      }
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  //FIDEICOMISO - GENERAR NUMERO DE FIDEICOMISO

  /**
   * 
   * OldName: consultarListaBeneficiarioSecundario
   * 
  */
  async consultarListaBeneficiarioSecundario(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_BEENFICIARIOSECUNDARIO + "?" + data);

      /*{
      "beneficiaries": [
          {
              "transactId": 101,
              "beneficiaryId": 5,
              "firstName": "Maicol",
              "secondName": "Israel",
              "firstLastName": "nombre 2 ",
              "secondLastName": "apellido 2",
              "nationality": "CUBA",
              "personType": "N",
              "documentType": "PA",
              "documentNumber": "KDKDKDLDDD",
              "address": "JDJDJD",
              "telephone": "JDDJDJDJ",
              "relationship": "DKDKDK",
              "percentage": 5.99,
              "status": true
          },
          {
              "transactId": 101,
              "beneficiaryId": 2,
              "firstName": "Maicol",
              "secondName": "Israel",
              "firstLastName": "nombre 2 ",
              "secondLastName": "apellido 2",
              "nationality": "CUBA",
              "personType": "N",
              "documentType": "PA",
              "documentNumber": "KDKDKDLDDD",
              "address": "JDJDJD",
              "telephone": "JDDJDJDJ",
              "relationship": "DKDKDK",
              "percentage": 5.99,
              "status": true
          }
      ],
      "status": {
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa"
      }
  }
  } */

      return result.beneficiaries;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevaListaBeneficiarioSecundario
   * 
  */
  async nuevaListaBeneficiarioSecundario(data) {
    try {

      /*{
      "transactId":101,
      "firstName":"Maicol",
      "secondName":"Israel",
      "firstLastName":"nombre 2 ",
      "secondLastName":"apellido 2",
      "nationality":"CUBA",
      "personType":"N",
      "documentType":"PA",
      "documentNumber":"KDKDKDLDDD",
      "address":"JDJDJD",
      "telephone":"JDDJDJDJ",
      "relationship":"DKDKDK",
      "percentage":5.99
  }
      */

      var result = await this.post(url.URL_BACKEND_BEENFICIARIOSECUNDARIO, data);//saveProposalData
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarListaBeneficiarioSecundario
   * 
  */
  async actualizarListaBeneficiarioSecundario(data) {
    try {

      /*{
      "transactId":101,
      "beneficiaryId":2,
      "firstName":"Maicol",
      "secondName":"Israel",
      "firstLastName":"nombre 2 ",
      "secondLastName":"apellido 2",
      "nationality":"CUBA",
      "personType":"N",
      "documentType":"PA",
      "documentNumber":"KDKDKDLDDD",
      "address":"JDJDJD",
      "telephone":"JDDJDJDJ",
      "relationship":"DKDKDK",
      "percentage":5.99,
      "status":true
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_BEENFICIARIOSECUNDARIO, data);//saveProposalData
      if (result.statusCode == "500") {
        data["status"] = true;
        result = await this.post(url.URL_BACKEND_BEENFICIARIOSECUNDARIO, data);
      }
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarListaBeneficiarioSecundario
   * 
  */
  async eliminarListaBeneficiarioSecundario(transactId, beneficiaryId) {
    try {
      var data = { transactId: transactId, beneficiaryId: beneficiaryId };
      var result = await this.del(url.URL_BACKEND_BEENFICIARIOSECUNDARIO + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  //SERVICIO FIDUCIARIOS - SECCION SERVICIOS FIDUCIARIOS

  /**
   * 
   * OldName: consultarSeccionServiciosFiduciario
   * 
  */
  async consultarSeccionServiciosFiduciario(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_SERVICIOSFIDUCIARIOS + "?" + data);

      /*{
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa",
      "fiduciaryServicesDTOS": {
          "transactId": 1,
          "guaranteetrust": 32.3,
          "administrationTrust": 23.1,
          "investmentTrust": 1.1,
          "stateTrust": 22.0,
          "scrowAccount": 345.0,
          "description": "dsadsad",
          "others": 12.3,
          "status": true
      }
  }*/

      return result.fiduciaryServicesDTOS;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarSeccionServiciosFiduciario
   * 
  */
  async guardarSeccionServiciosFiduciario(data) {
    try {

      /*{
      "transactId": 1,
      "guaranteetrust": 32.3,
      "administrationTrust": 23.1,
      "investmentTrust": 1.1,
      "stateTrust": 22,
      "scrowAccount": 345,
      "description": "dsadsad",
      "others": "12.3",
      "status": true
  }
      */

      var result = await this.post(url.URL_BACKEND_SERVICIOSFIDUCIARIOS, data);//saveProposalData

      if (+result.statusCode === 500) {
        data["status"] = true;
        result = await this.put(url.URL_BACKEND_SERVICIOSFIDUCIARIOS, data);
      }
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  //SERVICIO FIDUCIARIOS - SECCION SERVICIOS FIDUCIARIOS

  /**
   * 
   * OldName: consultarSeccionOtrosServiciosFiduciario
   * 
  */
  async consultarSeccionOtrosServiciosFiduciario(transactId, facilityId) {
    try {
      var params = { transactId: transactId, facilityId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_OTROSSERVICIOSFIDUCIARIOS + "?" + data);

      /*{
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa",
      "otherFiduciaryServicesDTO": {
          "transactId": 1,
          "proposal": 12.6,
          "purpose": "rer",
          "fixedActiveType": "sasa",
          "description": "dsadsad",
          "structureCommission": 23.1,
          "administrationCommision": 1.1,
          "term": "rere",
          "paymentType": "sasa",
          "others": "1.3",
          "status": true
      }
  }*/

      return result.otherFiduciaryServicesDTO;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarSeccionOtrosServiciosFiduciario
   * 
  */
  async guardarSeccionOtrosServiciosFiduciario(data) {
    try {

      /*{
      "transactId": 1,
      "proposal": 12.6,
      "purpose": "rer",
      "fixedActiveType": "sasa",
      "description": "dsadsad",
      "structureCommission": 23.1,
      "administrationCommision": 1.1,
      "term": "rere",
      "paymentType": "sasa",
      "others": "1.3",
      "status": true
  }
      */

      var result = await this.post(url.URL_BACKEND_OTROSSERVICIOSFIDUCIARIOS, data);//saveProposalData

      if (+result.statusCode === 500) {
        data["status"] = true;
        result = await this.put(url.URL_BACKEND_OTROSSERVICIOSFIDUCIARIOS, data);
      }
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  //DOCUMENTACION LEGAL - DOCUMENTACION LEGAL

  /**
   * 
   * OldName: consultarDocumentacionLegal
   * 
  */
  async consultarDocumentacionLegal(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_DOCUMENTACIONLEGAL + "?" + data);

      /*{
      "status": {
          "statusCode": "200",
          "statusDesc": "Transacción Exitosa"
      },
      "legalDocumentations": [
          {
              "transactId": 1,
              "legalDocumentationId": 1,
              "rotary": false,
              "commercialLoan": true,
              "multipleRotary": true,
              "rotaryNumber": true,
              "overdraft": true,
              "transfer": true,
              "bail": true,
              "trust": true,
              "agroPawn": true,
              "naturalBail": true,
              "legalBail": true,
              "crossedLegalBail": true,
              "crossedNaturalBail": true,
              "promiseLetter": true,
              "privateRecord": true,
              "trustRecord": true,
              "loanGuarantees": true,
              "fiduciaryLine": true,
              "prefinanced": true,
              "status": true
          }
      ]
  }*/

      return result.legalDocumentations[0];
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoDocumentacionLegal
   * 
  */
  async nuevoDocumentacionLegal(data) {
    try {

      /*{
   "transactId":1,
     "rotary":false,
     "commercialLoan":true,
     "multipleRotary":true,
     "rotaryNumber":true,
       "overdraft":true,
       "transfer":true,
       "bail":true,
       "trust":true,
  "agroPawn":true,
  "naturalBail":true,
  "legalBail":true,
  "crossedLegalBail":true,
  "crossedNaturalBail":true,
  "promiseLetter":true,
  "privateRecord":true,
  "trustRecord":true,
  "loanGuarantees":true,
  "fiduciaryLine":true,
  "prefinanced":true
  }
      */

      var result = await this.post(url.URL_BACKEND_DOCUMENTACIONLEGAL, data);//saveProposalData
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarDocumentacionLegal
   * 
  */
  async actualizarDocumentacionLegal(data) {
    try {

      /*{
      "legalDocumentationId":1,
   "transactId":1,
     "rotary":false,
     "commercialLoan":true,
     "multipleRotary":true,
     "rotaryNumber":true,
       "overdraft":true,
       "transfer":true,
       "bail":true,
       "trust":true,
  "agroPawn":true,
  "naturalBail":true,
  "legalBail":true,
  "crossedLegalBail":true,
  "crossedNaturalBail":true,
  "promiseLetter":true,
  "privateRecord":true,
  "trustRecord":true,
  "loanGuarantees":true,
  "fiduciaryLine":true,
  "prefinanced":true,
  "status":true
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_DOCUMENTACIONLEGAL, data);//saveProposalData
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarDocumentacionLegal
   * 
  */
  async eliminarDocumentacionLegal(transactId, legalDocumentationId) {
    try {
      var data = { requestId: transactId, legalDocumentationId: legalDocumentationId };
      var result = await this.del(url.URL_BACKEND_DOCUMENTACIONLEGAL + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  //DESEMBOLSO - DATOS GENERALES

  /**
   * 
   * OldName: consultarDatosGeneralesDesembolso
   * 
  */
  async consultarDatosGeneralesDesembolso(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_DESEMBOLSODATOSGENERALES + "?" + data);

      /*{
      "subproduct": "vsubproducto character varying",
      "line": "vnlinea character varying",
      "masterLine": "vnlineamaster character varying",
      "customerLine": "vnlineacliente character varying",
      "afiRequest": "vnsolicitudsafi character varying",
      "amount": 99.68,
      "interestRate": 5.99,
      "savingDpf": "vdpfnahorro character varying",
      "van": "van character varying",
      "date": true,
      "disbursementTerm": "vplazodesembolso character varying",
      "debitAccount": "vncuentadebitar character varying",
      "nameOf": "vanombrede character varying",
      "monthlyFee": true,
      "commissionFid": true,
      "itbmIncluded": true,
      "commissionFwla": true,
      "interestPaymentCycle": "vciclopagoint character varying",
      "capitalPaymentCycle": "vciclopagocap character varying",
      "status": true,
      "serviceStatus": {
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa"
      }
  }*/

      return result;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarDatosGeneralesDesembolso
   * 
  */
  async guardarDatosGeneralesDesembolso(data) {
    try {

      /*{
    "transactId": 101,
    "branch": "vsucursal character varying",
    "loan": "vnprestamo character varying",
    "product": "vproducto character varying",
    "subproduct": "vsubproducto character varying",
    "line": "vnlinea character varying",
    "masterLine": "vnlineamaster character varying",
    "customerLine": "vnlineacliente character varying",
    "afiRequest": "vnsolicitudsafi character varying",
    "amount": 99.68,
    "interestRate": 5.99,
    "savingDpf": "vdpfnahorro character varying",
    "van": "van character varying",
    "date": true,
    "disbursementTerm": "vplazodesembolso character varying",
    "debitAccount": "vncuentadebitar character varying",
    "nameOf": "vanombrede character varying",
    "monthlyFee": true,
    "commissionFid": true,
    "itbmIncluded": true,
    "commissionFwla": true,
    "interestPaymentCycle": "vciclopagoint character varying",
    "capitalPaymentCycle": "vciclopagocap character varying",
    "status":true
  }
      */

      var result = await this.post(url.URL_BACKEND_DESEMBOLSODATOSGENERALES, data);//saveProposalData
      if (result.statusCode === 500) {
        data["status"] = true;
        result = await this.put(url.URL_BACKEND_DESEMBOLSODATOSGENERALES, data);
      }


      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  //DESEMBOLSO E INSTRUCTIVO DE DESEMBOLSO -

  /**
   * 
   * OldName: consultarInstructivoDesembolso
   * 
  */
  async consultarInstructivoDesembolso(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_INSTRUCTIVODESEMBOLSO + "?" + data);

      /*{
    "statusCode": "200",
    "statusDesc": "Transacciï¿½n Exitosa",
    "disbursementInstructiveDTO": {
        "transactId": 1,
        "creditAccount": "creditAccount",
        "creditAmount": 2.3,
        "transference": "transference",
        "transferenceAmount": 12.3,
        "others": "others",
        "othersAmount": 12.5,
        "destinyCountry": "destinyCountry",
        "province": "province",
        "activityType": "activityType",
        "enlargedDetail": "enlargedDetail",
        "freeDisbursement": true,
        "lawyerInvoice": "lawyerInvoice",
        "managerCheck": "managerCheck",
        "accountCr": "accountCr",
        "commission": "commission",
        "itbm": "itbm",
        "differ": true,
        "notary": "notary",
        "invoiceTimbre": "invoiceTimbre",
        "customerAccount": "customerAccount",
        "pawn": true,
        "savingsDpfn": "savingsDpfn",
        "van": "van",
        "pawnAmount": 34.7,
        "cinuActivity": "cinuActivity",
        "fee": "fee",
        "firstPaymentDate": "2021-11-11",
        "business": "business",
        "status": true
    }
}*/

      return result.disbursementInstructiveDTO;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: nuevoInstructivoDesembolso
   * 
  */
  async nuevoInstructivoDesembolso(data) {
    try {

      /*{
    "transactId":"1",
    "creditAccount":"creditAccount",
    "creditAmount":2.3,
    "transference":"transference",
    "transferenceAmount":12.3,
    "others":"others",
    "othersAmount":12.5,
    "destinyCountry":"destinyCountry",
    "province":"province",
    "activityType":"activityType",
    "enlargedDetail":"enlargedDetail",
    "freeDisbursement":true,
    "lawyerInvoice":"lawyerInvoice",
    "managerCheck":"managerCheck",
    "accountCr":"accountCr",
    "commission":"commission",
    "itbm":"itbm",
    "differ":true,
    "notary":"notary",
    "invoiceTimbre":"invoiceTimbre",
    "customerAccount":"customerAccount",
    "pawn":true,
    "savingsDpfn":"savingsDpfn",
    "van":"van",
    "pawnAmount":34.7,
    "cinuActivity":"cinuActivity",
    "fee":"fee",
    "firstPaymentDate":"2021-11-11",
    "business":"business"

}
      */

      var result = await this.post(url.URL_BACKEND_INSTRUCTIVODESEMBOLSO, data);//saveProposalData
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarInstructivoDesembolso
   * 
  */
  async actualizarInstructivoDesembolso(data) {
    try {

      /*{
    "transactId":"1",
    "creditAccount":"uuuuuuuuuuu",
    "creditAmount":2.3,
    "transference":"transference",
    "transferenceAmount":12.3,
    "others":"others",
    "othersAmount":12.5,
    "destinyCountry":"destinyCountry",
    "province":"province",
    "activityType":"activityType",
    "enlargedDetail":"enlargedDetail",
    "freeDisbursement":true,
    "lawyerInvoice":"lawyerInvoice",
    "managerCheck":"managerCheck",
    "accountCr":"accountCr",
    "commission":"commission",
    "itbm":"itbm",
    "differ":true,
    "notary":"notary",
    "invoiceTimbre":"invoiceTimbre",
    "customerAccount":"customerAccount",
    "pawn":true,
    "savingsDpfn":"savingsDpfn",
    "van":"van",
    "pawnAmount":34.7,
    "cinuActivity":"cinuActivity",
    "fee":"fee",
    "firstPaymentDate":"2021-11-11",
    "business":"business",
    "status": true

}
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_INSTRUCTIVODESEMBOLSO, data);//saveProposalData
      //OK
      /*var result ={
      "statusCode": "200",
      "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarInstructivoDesembolso
   * 
  */
  async eliminarInstructivoDesembolso(transactId) {
    try {
      var data = { transactId: transactId };
      var result = await this.del(url.URL_BACKEND_INSTRUCTIVODESEMBOLSO + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  //Guardar Schedule de Instructivo de Desembolso
  async saveDisbursementSchedule(data) {
    try {

      /*
       data= {
         "scheduleId": 2,
"instructionalId": "ID191",
"scheduleTypeCode": "fake_data",
"scheduleTypeDesc": "fake_data",
"methodCode": "fake_data",
"methodDesc": "fake_data",
"freqCode": "fake_data",
"freqDesc": "fake_data",
"sendEach": 60,
"propertyCode": "fake_data",
"propertyDesc": "fake_data",
"percent": 58.17,
"iniDate": "2025-02-21",
"amount": 4.39,
"invoiceCode": "fake_data",
"invoiceDesc": "fake_data",
"status":true
}
      */

      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_Disbursementschedule, data);

      if (result.statusCode !== opt.ResponseBackend_STATUSOK) {
        result = await this.post(url.URL_BACKEND_Disbursementschedule, data);
      }
      /*{
        "status": {
        "statusCode": "200",
        "statusDesc": "Succesful transaction"
        }
        }*/

      return result;
      //return result.summaryProcess;
    }
    catch (err) {
      console.error("api getGovernanceInformation: ", err);
      return { status: err.response.status, error: err.response.data };
    }
  }

  async updateDisbursementSchedule(data) {
    try {

      /*
       data= {
         "scheduleId": 2,
"instructionalId": "ID191",
"scheduleTypeCode": "fake_data",
"scheduleTypeDesc": "fake_data",
"methodCode": "fake_data",
"methodDesc": "fake_data",
"freqCode": "fake_data",
"freqDesc": "fake_data",
"sendEach": 60,
"propertyCode": "fake_data",
"propertyDesc": "fake_data",
"percent": 58.17,
"iniDate": "2025-02-21",
"amount": 4.39,
"invoiceCode": "fake_data",
"invoiceDesc": "fake_data",
"status":true
}
      */

      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_Disbursementschedule, data);


      /*{
        "status": {
        "statusCode": "200",
        "statusDesc": "Succesful transaction"
        }
        }*/

      return result;
      //return result.summaryProcess;
    }
    catch (err) {
      console.error("api getGovernanceInformation: ", err);
      return { status: err.response.status, error: err.response.data };
    }
  }

  //Consultar Schedule de Instructivo de Desembolso
  async getDisbursementSchedule(instructionalId) {
    try {
      var params = { instructionalId: instructionalId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_Disbursementschedule + "?" + data);

      /*{
"data": [
{
"scheduleId": 2,
"instructionalId": "ID191",
"scheduleTypeCode": "fake_data",
"scheduleTypeDesc": "fake_data",
"methodCode": "fake_data",
"methodDesc": "fake_data",
"freqCode": "fake_data",
"freqDesc": "fake_data",
"sendEach": 60,
"propertyCode": "fake_data",
"propertyDesc": "fake_data",
"percent": 58.17,
"iniDate": "2025-02-21",
"amount": 4.39,
"invoiceCode": "fake_data",
"invoiceDesc": "fake_data",
"status": true
}
],
"status": {
"statusCode": "200",
"statusDesc": "Succesful transaction"
}
}*/

      return result.data;
    }
    catch (err) {
      console.error("api getDisbursementSchedule: ", err)
    }
    return undefined;
  }
  //Eliminar Schedule de Instructivo de Desembolso
  async deleteDisbursementSchedule(data) {
    try {

      /*
       data= {
         "scheduleId": 2,
"instructionalId": "ID191",
"scheduleTypeCode": "fake_data",
"scheduleTypeDesc": "fake_data",
"methodCode": "fake_data",
"methodDesc": "fake_data",
"freqCode": "fake_data",
"freqDesc": "fake_data",
"sendEach": 60,
"propertyCode": "fake_data",
"propertyDesc": "fake_data",
"percent": 58.17,
"iniDate": "2025-02-21",
"amount": 4.39,
"invoiceCode": "fake_data",
"invoiceDesc": "fake_data",
"status":true
}
      */

      data["status"] = false;
      var result = await this.put(url.URL_BACKEND_Disbursementschedule, data);

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }


  //ORQUESTADO PERSONA SOLICITUD - BUSQUEDA Y DESCARTE
  async consultarOrquestadoListaPersonaSolicitud(transactId) {
    try {

      //consultamos todas las personas
      var lPerson = await this.consultarListaPersonaSolicitud(transactId);
      var lRoles = await this.consultarRolPersona(transactId);
      //var listaVigilancia = await this.consultarListaVigilanciaPersona(transactId);
      var lblackList = await this.getBlackListHistory(transactId);

      console.log("listaRoles", lRoles)
      lPerson.map(async function (item, i) {
        item["roles"] = [];
        var roleResult = lRoles.find((itemrole) => {
          return itemrole.personId === item.personId;
        })
        if (roleResult !== undefined && roleResult !== null) {
          roleResult.roles.map(async function (rol, i) {
            item["roles"].push(rol)
          })
        }
      })

      console.log("lblackList", lblackList);
      lPerson.map(async function (item, i) {
        item["blacklist"] = [];
        lblackList.map(async function (itemblacklist, i) {
          if (itemblacklist.personId === item.personId) {
            item["blacklist"].push(itemblacklist);
          }
        })
      })

      console.log(lPerson);
      return lPerson;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  async nuevoOrquestadoListaPersonaSolicitud(data) {
    try {

      if (data.birthDate.length <= 0) {
        data.birthDate = moment().format("YYYY-MM-DD");
      }
      console.log("nuevoOrquestadoListaPersonaSolicitud");
      var resultPerson = await this.nuevoPersonaSolicitud(data);
      for (var i = 0; i < data.roles.length; i++) {
        await this.nuevoRolPersona({
          transactId: data.transactId,
          personId: resultPerson.personId,
          roleId: data.roles[i].roleId,
          status: true
        });
        if (data.roles[i].roleId === "ACC") {
          var sharehold = {
            "transactId": data.transactId,
            "personId": resultPerson.personId,
            "participation": 0,
            "yearsExperience": 0,
            "status": true
          }
          await this.salvarAccionistaBD(sharehold);
        }

      }

      for (var i = 0; i < data.blacklist.length; i++) {
        data.blacklist[i].transactId = data.transactId;
        data.blacklist[i].personId = resultPerson.personId;
        //await this.nuevoListaVigilanciaPersona(data.blacklist[i]);
        await this.saveBlackListHistory(data.blacklist[i]);
      }

      console.log("nuevoOrquestadoListaPersonaSolicitud", resultPerson);
      return resultPerson;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  async actualizarOrquestadoListaPersonaSolicitud(data) {
    try {
      if (data.birthDate.length <= 0) {
        data.birthDate = moment().format("YYYY-MM-DD");
      }
      var resultPerson = await this.actualizarPersonaSolicitud(data);

      var listaRoles = await this.consultarRolPersona(data.transactId);
      for (var p = 0; p < listaRoles.length; p++) {
        if (listaRoles[p].personId === data.personId) {
          for (var i = 0; i < listaRoles[p].roles.length; i++) {
            await this.eliminarRolPersona(data.transactId, data.personId, listaRoles[p].roles[i].roleId);
          }
          break;
        }
      }
      for (var i = 0; i < data.roles.length; i++) {
        await this.nuevoRolPersona({
          transactId: data.transactId,
          personId: data.personId,
          roleId: data.roles[i].roleId,
          status: true
        });
      }
      for (var i = 0; i < data.blacklist.length; i++) {
        if (data.blacklist[i].date === null) {
          data.blacklist[i].transactId = data.transactId;
          data.blacklist[i].personId = data.personId;
          //await this.actualizarListaVigilanciaPersona(data.blacklist[i]);
          await this.saveBlackListHistory(data.blacklist[i]);
        }
      }

      return resultPerson;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  async eliminarOrquestadoListaPersonaSolicitud(data) {
    try {

      var resultPerson = await this.eliminarPersonaSolicitud(data.transactId, data.personId);

      var listaRoles = await this.consultarRolPersona(data.transactId);
      for (var p = 0; p < listaRoles.length; p++) {
        if (listaRoles[p].personId === data.personId) {
          for (var i = 0; i < listaRoles[p].roles.length; i++) {
            await this.eliminarRolPersona(data.transactId, data.personId, listaRoles[p].roles[i].roleId);
          }
          break;
        }
      }

      await this.eliminarListaVigilanciaPersona(data.transactId, data.personId);

      return resultPerson;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  async consultarOrquestadoPersona(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_PERSONAORQUESTADO + "?" + data);

      /*{
    "transactId": 9327,
    "personsList": [
        {
            "transactId": 9327,
            "personId": 1,
            "personType": "1",
            "idType": "CED",
            "clientDocumentId": "V006976294",
            "customerNumberT24": "14125",
            "name": "JOSE",
            "secondName": "LUIS",
            "lastName": "LAGOA",
            "secondSurname": "GONZALEZ",
            "nationality": "PA",
            "birthDate": "2022-03-01",
            "address": "",
            "phone": "34535354",
            "email": "arico@banesco.com",
            "countryOfResidence": "",
            "registrationDate": "2022-03-01",
            "status": true
        },
        {
            "transactId": 9327,
            "personId": 2,
            "personType": "1",
            "idType": "PAS",
            "clientDocumentId": "084914794",
            "customerNumberT24": "800120843",
            "name": "MIGUEL",
            "secondName": "ANGEL",
            "lastName": "QUEVEDO",
            "secondSurname": "MORENO",
            "nationality": "PA",
            "birthDate": "2022-03-01",
            "address": "",
            "phone": "234243234",
            "email": "arico@banesco.com",
            "countryOfResidence": "",
            "registrationDate": "2022-03-01",
            "status": true
        },
        {
            "transactId": 9327,
            "personId": 3,
            "personType": "2",
            "idType": "RUC",
            "clientDocumentId": "0000027551-0051-0000228486",
            "customerNumberT24": "600235373",
            "name": "SPORTMATE CORPORATION",
            "secondName": "SPORTMATE CORPORATION ",
            "lastName": "SPORTMATE CORPORATION ",
            "secondSurname": "",
            "nationality": "PA",
            "birthDate": "2022-03-01",
            "address": "",
            "phone": "3123132",
            "email": "arico@banesco.com",
            "countryOfResidence": "",
            "registrationDate": "2022-03-01",
            "status": true
        }
    ],
    "roles": [
        {
            "personId": 3,
            "roles": [
                {
                    "roleId": "DEU",
                    "roleDescription": "Deudor principal"
                },
                {
                    "roleId": "ACC",
                    "roleDescription": "Accionista"
                },
                {
                    "roleId": "RPL",
                    "roleDescription": "Representante legal"
                },
                {
                    "roleId": "APO",
                    "roleDescription": "Apoderado legal"
                },
                {
                    "roleId": "DIR",
                    "roleDescription": "Director"
                },
                {
                    "roleId": "GAR",
                    "roleDescription": "Garante"
                },
                {
                    "roleId": "FID",
                    "roleDescription": "Fideicomitente"
                },
                {
                    "roleId": "MIJ",
                    "roleDescription": "Miembro junta directiva"
                }
            ],
            "status": true
        },
        {
            "personId": 2,
            "roles": [
                {
                    "roleId": "DEU",
                    "roleDescription": "Deudor principal"
                },
                {
                    "roleId": "ACC",
                    "roleDescription": "Accionista"
                },
                {
                    "roleId": "RPL",
                    "roleDescription": "Representante legal"
                },
                {
                    "roleId": "APO",
                    "roleDescription": "Apoderado legal"
                },
                {
                    "roleId": "DIR",
                    "roleDescription": "Director"
                },
                {
                    "roleId": "DIG",
                    "roleDescription": "Dignatario"
                },
                {
                    "roleId": "GAR",
                    "roleDescription": "Garante"
                },
                {
                    "roleId": "FID",
                    "roleDescription": "Fideicomitente"
                }
            ],
            "status": true
        },
        {
            "personId": 1,
            "roles": [
                {
                    "roleId": "DEU",
                    "roleDescription": "Deudor principal"
                },
                {
                    "roleId": "ACC",
                    "roleDescription": "Accionista"
                },
                {
                    "roleId": "RPL",
                    "roleDescription": "Representante legal"
                },
                {
                    "roleId": "APO",
                    "roleDescription": "Apoderado legal"
                },
                {
                    "roleId": "DIR",
                    "roleDescription": "Director"
                },
                {
                    "roleId": "DIG",
                    "roleDescription": "Dignatario"
                },
                {
                    "roleId": "GAR",
                    "roleDescription": "Garante"
                },
                {
                    "roleId": "FID",
                    "roleDescription": "Fideicomitente"
                }
            ],
            "status": true
        }
    ],
    "watchListPerson": [
        {
            "transactId": 9327,
            "personId": 1,
            "backList": false,
            "commentsSearchDiscard": "sfdsdf",
            "commentsCompliance": "",
            "status": true
        },
        {
            "transactId": 9327,
            "personId": 2,
            "backList": false,
            "commentsSearchDiscard": "dfsdfsfd",
            "commentsCompliance": "",
            "status": true
        },
        {
            "transactId": 9327,
            "personId": 3,
            "backList": false,
            "commentsSearchDiscard": "dadads",
            "commentsCompliance": "",
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "succesful transaction"
    }
}*/

      return result;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  async guardarOrquestadoPersona(data) {
    try {

      /*{
    "transactId": "25",
    "personId": 1,
    "personType": "NA",
    "idType": "CIP",
    "clientDocumentId": "viddoccliente character varying 1",
    "customerNumberT24": "vnroclientet24 character varying",
    "name": "vnombre character varying",
    "secondName": "vnombre2 character varying",
    "lastName": "vapellido character varying",
    "secondSurname": "vapellido2 character varying",
    "nationality": "vnacionalidad character varying",
    "birthDate": "1998-08-17",
    "address": "vdireccion text",
    "phone": "vtelefono character varying",
    "email": "vemail character varying",
    "countryOfResidence": "vpaisresidencia character varying",
    "backList":true,
    "commentsSearchDiscard":"CommentsSearchDiscard",
    "commentsCompliance":"CommentsCompliance",
    "roleId":["ACC","DEU"],
    "status": true
} */

      var result = await this.post(url.URL_BACKEND_PERSONAORQUESTADO, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  //PERSONA SOLICITUD - BUSQUEDA Y DESCARTE


  async consultarListaPersonaSolicitud(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_PERSONASOLICITUD + "?" + data);

      /*{
      "personsList": [
          {
              "transactId": 1,
              "personId": 2,
              "personType": "NA",
              "idType": "CIP",
              "clientDocumentId": "viddoccliente character varying 1",
              "customerNumberT24": "vnroclientet24 character varying",
              "name": "vnombre character varying",
              "secondName": "vnombre2 character varying",
              "lastName": "vapellido character varying",
              "secondSurname": "vapellido2 character varying",
              "nationality": "vnacionalidad character varying",
              "birthDate": "1998-08-17",
              "address": "vdireccion text",
              "phone": "vtelefono character varying",
              "email": "vemail character varying",
              "countryOfResidence": "vpaisresidencia character varying",
              "registrationDate": "2022-02-17",
              "status": true
          }
      ],
      "status": {
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa"
      }
  }*/

      return result.personsList;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  async nuevoPersonaSolicitud(data) {
    try {

      /*{
      "transactId": 1,
      "personType": "NA",
      "idType": "CIP",
      "clientDocumentId": "viddoccliente character varying 1",
      "customerNumberT24": "vnroclientet24 character varying",
      "name": "vnombre character varying",
      "secondName": "vnombre2 character varying",
      "lastName": "vapellido character varying",
      "secondSurname": "vapellido2 character varying",
      "nationality": "vnacionalidad character varying",
      "birthDate": "1998-08-17",
      "address": "vdireccion text",
      "phone": "vtelefono character varying",
      "email": "vemail character varying",
      "countryOfResidence": "vpaisresidencia character varying"
  }
      */

      var result = await this.post(url.URL_BACKEND_PERSONASOLICITUD, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  async actualizarPersonaSolicitud(data) {
    try {

      /*{
      "transactId": 1,
      "personId":1,
      "personType": "NA",
      "idType": "CIP",
      "clientDocumentId": "viddoccliente character varying 1",
      "customerNumberT24": "vnroclientet24 character varying",
      "name": "vnombre character varying",
      "secondName": "vnombre2 character varying",
      "lastName": "vapellido character varying",
      "secondSurname": "vapellido2 character varying",
      "nationality": "vnacionalidad character varying",
      "birthDate": "1998-08-17",
      "address": "vdireccion text",
      "phone": "vtelefono character varying",
      "email": "vemail character varying",
      "countryOfResidence": "vpaisresidencia character varying",
      "status":true
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_PERSONASOLICITUD, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  async eliminarPersonaSolicitud(transactId, personId) {
    try {
      var data = { transactId: transactId, personId: personId };
      var result = await this.del(url.URL_BACKEND_PERSONASOLICITUD + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  //ROL PERSONA SOLICITUD - BUSQUEDA Y DESCARTE

  async consultarRolPersona(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_PERSONAROLE + "?" + data);

      /*{
      "transactId": "1",
      "persons":[
              {
                "personId": 1,
                "roles": [
                  {
                    "roleId":"ACC",
                    "roleDescription": "Accionista"	
                  },
                  {
                    "roleId":"DEU",
                    "roleDescription": "Deudor principal"	
                  }
                ],
                "status": true,
              }
            ];    
      "serviceStatus": {
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa"
  }*/

      return result.persons;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  async nuevoRolPersona(data) {
    try {
      /*{
    "transactId":1,
    "personId":"1",
    "roleId":"1"
  }
      */

      var result = await this.post(url.URL_BACKEND_PERSONAROLE, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  async actualizarRolPersona(data) {
    try {

      /*{
    "transactId":"101",
    "personId":"1",
    "roleId":"1",
    "status":true
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_PERSONAROLE, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  async eliminarRolPersona(transactId, personId, roleId) {
    try {
      var data = { transactId: transactId, personId: personId, roleId: roleId };
      var result = await this.del(url.URL_BACKEND_PERSONAROLE + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  //LISTA VIGILANCIA PERSONA SOLICITUD - BUSQUEDA Y DESCARTE

  async consultarListaVigilanciaPersona(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_PERSONALISTAVIGILANCIA + "?" + data);

      /*{
      "watchListPerson": [
          {
              "transactId": 101,
              "personId": 1,
              "backList": true,
              "commentsSearchDiscard": "Encarte",
              "commentsCompliance": "Incumplimiento",
              "status": true
          }
      ],
      "status": {
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa"
      }
  }*/

      return result.watchListPerson;//result.watchListPerson[result.watchListPerson.length - 1];
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  async nuevoListaVigilanciaPersona(data) {
    try {

      /*{
    "transactId": 101,
    "personId":1,
    "backList": true,
    "commentsSearchDiscard": "Encarte",
    "commentsCompliance": "Incumplimiento"
  }
      */

      var result = await this.post(url.URL_BACKEND_PERSONALISTAVIGILANCIA, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  async actualizarListaVigilanciaPersona(data) {
    try {

      /*{
    "transactId": 101,
    "personId":2,
    "backList": true,
    "commentsSearchDiscard": "Encarte",
    "commentsCompliance": "Incumplimiento",
    "status": true
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_PERSONALISTAVIGILANCIA, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  async eliminarListaVigilanciaPersona(transactId, personId) {
    try {
      var data = { transactId: transactId, personId: personId };
      var result = await this.del(url.URL_BACKEND_PERSONALISTAVIGILANCIA + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  //CONSULTAR HISTORIAL LISTA NEGRA
  async getBlackListHistory(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_HISTORIALLISTANEGRA + "?" + data);

      /*{
    "personHistory": [
        {
            "transactId": 1,
            "personId": 1,
            "roleId": "ACC",
            "blackList": true,
            "comment": "comment",
            "date": "2022-03-09T05:00:00.000+00:00"
        },
        {
            "transactId": 1,
            "personId": 1,
            "roleId": "",
            "blackList": true,
            "comment": "comment",
            "date": "2022-03-09T05:00:00.000+00:00"
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}*/

      return result.personHistory;//result.watchListPerson[result.watchListPerson.length - 1];
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }
  async saveBlackListHistory(data) {
    try {

      /*
      {
    "transactId": 1,
    "personId": 1,
    "roleId": "",
    "blackList": true,
    "comment": "comment"
    }
      */

      var result = await this.post(url.URL_BACKEND_HISTORIALLISTANEGRA, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  //PERSONA SOLICITUD - BUSQUEDA Y DESCARTE

  async consultarListaPersonaSolicitudOrquestado(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_PERSONASOLICITUDORQUESTADO + "?" + data);

      /*{
      "transactId": 22,
      "personsList": [
          {
              "transactId": 22,
              "personId": 3,
              "personType": "NA",
              "idType": "CIP",
              "clientDocumentId": "viddoccliente character varying 1",
              "customerNumberT24": "vnroclientet24 character varying",
              "name": "vnombre character varying",
              "secondName": "vnombre2 character varying",
              "lastName": "vapellido character varying",
              "secondSurname": "vapellido2 character varying",
              "nationality": "vnacionalidad character varying",
              "birthDate": "1998-08-17",
              "address": "vdireccion text",
              "phone": "vtelefono character varying",
              "email": "vemail character varying",
              "countryOfResidence": "vpaisresidencia character varying",
              "registrationDate": "2022-02-23",
              "status": true
          }
      ],
      "roles": [
          {
              "personId": 3,
              "roles": [
                  {
                      "roleId": "ACC",
                      "roleDescription": "Accionista"
                  }
              ],
              "status": true
          }
      ],
      "watchListPerson": [
          {
              "transactId": 22,
              "personId": 3,
              "backList": true,
              "commentsSearchDiscard": "CommentsSearchDiscard",
              "commentsCompliance": "CommentsCompliance",
              "status": true
          }
      ],
      "status": {
          "statusCode": "200",
          "statusDesc": "succesful transaction"
      }
  }*/

      return result.personsList;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  async nuevoPersonaSolicitudOrquestado(data) {
    try {

      /*{
      "transactId": "22",
      "personType": "NA",
      "idType": "CIP",
      "clientDocumentId": "viddoccliente character varying 1",
      "customerNumberT24": "vnroclientet24 character varying",
      "name": "vnombre character varying",
      "secondName": "vnombre2 character varying",
      "lastName": "vapellido character varying",
      "secondSurname": "vapellido2 character varying",
      "nationality": "vnacionalidad character varying",
      "birthDate": "1998-08-17",
      "address": "vdireccion text",
      "phone": "vtelefono character varying",
      "email": "vemail character varying",
      "countryOfResidence": "vpaisresidencia character varying",
      "backList":true,
      "commentsSearchDiscard":"CommentsSearchDiscard",
      "commentsCompliance":"CommentsCompliance",
      "roleId":"ACC"
  }
      */

      var result = await this.post(url.URL_BACKEND_PERSONASOLICITUDORQUESTADO, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  async actualizarPersonaSolicitudOrquestado(data) {
    try {

      /*{
      "transactId": "22",
      "personId": 1,
      "personType": "NA",
      "idType": "CIP",
      "clientDocumentId": "viddoccliente character varying 1",
      "customerNumberT24": "vnroclientet24 character varying",
      "name": "vnombre character varying",
      "secondName": "vnombre2 character varying",
      "lastName": "vapellido character varying",
      "secondSurname": "vapellido2 character varying",
      "nationality": "vnacionalidad character varying",
      "birthDate": "1998-08-17",
      "address": "vdireccion text",
      "phone": "vtelefono character varying",
      "email": "vemail character varying",
      "countryOfResidence": "vpaisresidencia character varying",
      "backList":true,
      "commentsSearchDiscard":"CommentsSearchDiscard",
      "commentsCompliance":"CommentsCompliance",
      "roleId":"ACC",
      "status": true
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_PERSONASOLICITUDORQUESTADO, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  async eliminarPersonaSolicitudOrquestado(transactId, personId) {
    try {
      var data = { transactId: transactId, personId: personId };
      var result = await this.del(url.URL_BACKEND_PERSONASOLICITUDORQUESTADO + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  //DEUDORES - BUSQUEDA Y DESCARTE
  //consultarDeudorPrincipal
  async consultPrincipalDebtor(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_PERSONADEUDORES + "?" + data);
      /*{ 
    "debtors": [
        {
            "transactId": 1,
            "personId": 4,
            "typePerson": "NA", 1-> Natural 2 -.Juridico
            "idType": "CIP",
            "clientDocId": "1234567",
            "customerNumberT24": "1234567",
            "name": "vnombre character varying",
            "name2": "vnombre2 character varying",
            "lastName": "vapellido character varying",
            "lastName2": "vapellido2 character varying",
            "nationality": "vnacionalidad character varying",
            "birthDate": "1998-08-17"
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}*/

      return result.debtors[0];
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  async consultarDeudores(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_PERSONADEUDORES + "?" + data);

      /*{
    "debtors": [
        {
            "transactId": 1,
            "personId": 4,
            "typePerson": "NA", 1-> Natural 2 -.Juridico
            "idType": "CIP",
            "clientDocId": "1234567",
            "customerNumberT24": "1234567",
            "name": "vnombre character varying",
            "name2": "vnombre2 character varying",
            "lastName": "vapellido character varying",
            "lastName2": "vapellido2 character varying",
            "nationality": "vnacionalidad character varying",
            "birthDate": "1998-08-17"
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}*/

      return result.debtors;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  //ACCIONISTA - BUSQUEDA Y DESCARTE
  async consultarAccionistaBD(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_PERSONAACCIONISTAS + "?" + data);

      /*{
      "shareholders": [
          {
              "transactId": 1,
              "personId": 3,
              "personType": "NA",
              "idType": "CIP",
              "clientDocumentId": "123456",
              "customerNumberT24": "123456",
              "name": "vnombre character varying",
              "secondName": "vnombre2 character varying",
              "lastName": "vapellido character varying",
              "secondSurname": "vapellido2 character varying",
              "nationality": "vnacionalidad character varying",
              "birthDate": "1998-08-17",
              "yearsExperience": 7,
              "participation": 9
          }
      ],
      "status": {
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa"
      }
  }*/

      return result.shareholders;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  async salvarAccionistaBD(data) {
    try {

      /*{
    "transactId":4,
    "personId": 4,
    "participation": 2,
    "yearsExperience":3,
    "status":true 
  }
      */

      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_PERSONAACCIONISTAS, data);//saveProposalData
      if (result.statusCode !== "200") {
        result = await this.post(url.URL_BACKEND_PERSONAACCIONISTAS, data);//saveProposalData
      }
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  async eliminarAccionistaBD(transactId, personId) {
    try {
      var data = { transactId: transactId, personId: personId };
      var result = await this.del(url.URL_BACKEND_PERSONAACCIONISTAS + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  //GOBIERNO CORP - BUSQUEDA Y DESCARTE

  async consultarGobiernoCorpBD(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_PERSONAGOBIERNOCORP + "?" + data);

      /*{
    "corporateGobernance": [
        {
            "transactId": 9325,
            "personId": 1,
            "personType": "1",
            "idType": "CED",
            "clientDocumentId": "V006976294",
            "customerNumberT24": "14125",
            "name": "JOSE",
            "secondName": "LUIS",
            "lastName": "LAGOA",
            "secondSurname": "GONZALEZ",
            "nationality": "PA",
            "birthDate": "2022-03-01",
            "position": null
        },
        {
            "transactId": 9325,
            "personId": 1,
            "personType": "1",
            "idType": "CED",
            "clientDocumentId": "V006976294",
            "customerNumberT24": "14125",
            "name": "JOSE",
            "secondName": "LUIS",
            "lastName": "LAGOA",
            "secondSurname": "GONZALEZ",
            "nationality": "PA",
            "birthDate": "2022-03-01",
            "position": null
        },
        {
            "transactId": 9325,
            "personId": 1,
            "personType": "1",
            "idType": "CED",
            "clientDocumentId": "V006976294",
            "customerNumberT24": "14125",
            "name": "JOSE",
            "secondName": "LUIS",
            "lastName": "LAGOA",
            "secondSurname": "GONZALEZ",
            "nationality": "PA",
            "birthDate": "2022-03-01",
            "position": null
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacción Exitosa"
    }
}*/

      return result.corporateGobernance;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  async nuevoGobiernoCorpBD(data) {
    try {

      /*{
     "transactId":1,
      "personId":1,
      "position":"test",
      "relation":"nooooooo"
  }
      */

      var result = await this.post(url.URL_BACKEND_PERSONAGOBIERNOCORP, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  async actualizarGobiernoCorpBD(data) {
    try {

      /*{
    "transactId":1,
      "personId":1,
      "position":"test",
      "relation":"nooooooo"
    "status":true 
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_PERSONAGOBIERNOCORP, data);//saveProposalData
      if (result.statusCode === "500") {
        result = await this.post(url.URL_BACKEND_PERSONAGOBIERNOCORP, data);//saveProposalData
      }
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  async eliminarGobiernoCorpBD(transactId, personId) {
    try {
      var data = { transactId: transactId, personId: personId };
      var result = await this.del(url.URL_BACKEND_PERSONAGOBIERNOCORP + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  //GARANTES - BUSQUEDA Y DESCARTE

  async consultarGaranteBD(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_PERSONAGARANTE + "?" + data);

      /*{
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    },
    "guarantors": [
        {
            "transactId": 9327,
            "id": 1,
            "type": "1",
            "typeId": "CED",
            "docIdCustomer": "V006976294",
            "customerNumberT24": "14125",
            "firstName": "JOSE",
            "secondName": "LUIS",
            "firstLastName": "LAGOA",
            "secondLastName": "GONZALEZ",
            "nationality": "PA",
            "birthDate": "2022-03-01",
            "relationship": "relacion",
            "fundsAssets": "fundsAssets",
            "debtorCommitment": "debtorCommitment",
            "guaranteeReason": "guaranteeReason",
            "isGuarantor": true
        },
        {
            "transactId": 9327,
            "id": 2,
            "type": "1",
            "typeId": "PAS",
            "docIdCustomer": "084914794",
            "customerNumberT24": "800120843",
            "firstName": "MIGUEL",
            "secondName": "ANGEL",
            "firstLastName": "QUEVEDO",
            "secondLastName": "MORENO",
            "nationality": "PA",
            "birthDate": "2022-03-01",
            "relationship": null,
            "fundsAssets": null,
            "debtorCommitment": null,
            "guaranteeReason": null,
            "isGuarantor": null
        },
        {
            "transactId": 9327,
            "id": 3,
            "type": "2",
            "typeId": "RUC",
            "docIdCustomer": "0000027551-0051-0000228486",
            "customerNumberT24": "600235373",
            "firstName": "SPORTMATE CORPORATION",
            "secondName": "SPORTMATE CORPORATION ",
            "firstLastName": "SPORTMATE CORPORATION ",
            "secondLastName": "",
            "nationality": "PA",
            "birthDate": "2022-03-01",
            "relationship": null,
            "fundsAssets": null,
            "debtorCommitment": null,
            "guaranteeReason": null,
            "isGuarantor": null
        }
    ]
}*/

      return result.guarantors;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  async nuevoGaranteBD(data) {
    try {

      /*{
  "transactId": 62,
  "id": 1,
  "relationship": "fake_data",
  "fundsAssets": "fake_data",
  "debtorCommitment": "fake_data",
  "guaranteeReason": "fake_data",
  "isGuarantor": true
}*/

      var result = await this.post(url.URL_BACKEND_PERSONAGARANTE, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  async actualizarGaranteBD(data) {
    try {

      /*{
  "transactId": 62,
  "id": 1,
  "relationship": "fake_data up",
  "fundsAssets": "fake_data up",
  "debtorCommitment": "fake_data up",
  "guaranteeReason": "fake_data up",
  "status": true,
  "isGuarantor": false
}
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_PERSONAGARANTE, data);//saveProposalData
      // if (result.statusCode === "500") {
      //   result = await this.put(url.URL_BACKEND_PERSONAGARANTE, data);//saveProposalData
      // }
      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }
  async nuevoGaranteBD(data) {
    try {

      /*{
  "transactId": 62,
  "id": 1,
  "relationship": "fake_data up",
  "fundsAssets": "fake_data up",
  "debtorCommitment": "fake_data up",
  "guaranteeReason": "fake_data up",
  "status": true,
  "isGuarantor": false
}
      */
      data["status"] = true;
      var result = await this.post(url.URL_BACKEND_PERSONAGARANTE, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  async eliminarGaranteBD(transactId, guarantorId) {
    try {
      var data = { transactId: transactId, id: guarantorId };
      var result = await this.del(url.URL_BACKEND_PERSONAGARANTE + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  //GARANTES - BUSQUEDA Y DESCARTE

  async consultarFideiComitentesBD(transactId) {
    try {

      var lRoles = await this.consultarRolPersona(transactId);
      var lPersons = await this.consultarListaPersonaSolicitud(transactId);

      //FID
      var lPersonId = [];
      lRoles.map(function (item, i) {
        var roleResult = item.roles.find((itemrole) => {
          return itemrole.roleId === "FID";
        })
        if (roleResult !== undefined && roleResult !== null) {
          lPersonId.push(item.personId)
        }
      })

      var lFideicomit = [];
      lPersonId.map(function (id, i) {
        var personResult = lPersons.find((person) => {
          return person.personId === id;
        })
        if (personResult !== undefined && personResult !== null) {
          lFideicomit.push(personResult)
        }
      })

      console.log("fideicomitente", lFideicomit)
      /*
      [
          {
              "transactId": 1,
              "personId": 2,
              "personType": "NA",
              "idType": "CIP",
              "clientDocumentId": "viddoccliente character varying 1",
              "customerNumberT24": "vnroclientet24 character varying",
              "name": "vnombre character varying",
              "secondName": "vnombre2 character varying",
              "lastName": "vapellido character varying",
              "secondSurname": "vapellido2 character varying",
              "nationality": "vnacionalidad character varying",
              "birthDate": "1998-08-17",
              "address": "vdireccion text",
              "phone": "vtelefono character varying",
              "email": "vemail character varying",
              "countryOfResidence": "vpaisresidencia character varying",
              "registrationDate": "2022-02-17",
              "status": true
          },
      ]
      */

      return lFideicomit;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }


  //DETALLE ANTIGUEDAD - BUSQUEDA Y DESCARTE

  async consultarDetalleAntiguedad(transactId, personId) {
    try {
      var params = { transactId: transactId, personId: personId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_DETALLEANTIGUEDAD + "?" + data);

      /*{
      "seniorityDetail": [
          {
              "transactId": 1,
              "personId": 1,
              "bank": "BANCO PANAMA",
              "details": {
                  "days30": 360.000,
                  "days60": 360.000,
                  "days90": 360.000,
                  "days120": 360.000,
                  "days150": 360.000,
                  "days180": 360.000,
                  "days210": 360.000,
                  "days240": 360.000,
                  "days270": 360.000,
                  "days300": 360.000,
                  "days330": 360.000,
                  "days331": 360.000
              },
              "total": 360.000,
              "percentage": 2.8,
              "status": true
          }
      ],
      "serviceStatus": {
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa"
      }
  }*/

      return result.seniorityDetail;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  async nuevoDetalleAntiguedad(data) {
    try {

      /*{
  "transactId":3,
  "personId":3, 
  "bank":"BANCO PANAMA", 
  "details":{
  "days30":360.000, 
  "days60":360.000, 
  "days90":360.000, 
  "days120":360.000, 
  "days150":360.000, 
  "days180":360.000, 
  "days210":360.000, 
  "days240":360.000, 
  "days270":360.000, 
  "days300":360.000, 
  "days330":360.000, 
  "days331":360.000
  },
  "total":360.000, 
  "percentage":2.8
  }
      */
      data["status"] = true;

      var result = await this.post(url.URL_BACKEND_DETALLEANTIGUEDAD, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarDetalleAntiguedad
   * 
  */
  async actualizarDetalleAntiguedad(data) {
    try {

      /*{
  "transactId":3,
  "personId":3, 
  "bank":"BANCO PANAMA", 
  "details":{
  "days30":360.000, 
  "days60":360.000, 
  "days90":360.000, 
  "days120":360.000, 
  "days150":360.000, 
  "days180":360.000, 
  "days210":360.000, 
  "days240":360.000, 
  "days270":360.000, 
  "days300":360.000, 
  "days330":360.000, 
  "days331":360.000
  },
  "total":360.000, 
  "percentage":2.8
  }
      */
      data["status"] = true;

      var result = await this.put(url.URL_BACKEND_DETALLEANTIGUEDAD, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarDetalleAntiguedad
   * 
  */
  async eliminarDetalleAntiguedad(transactId, personId, bank) {
    try {
      var data = { transactId: transactId, personId: personId, bank: bank };
      var result = await this.del(url.URL_BACKEND_DETALLEANTIGUEDAD + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }

  //DETALLE PROYECTO CAPEX - BUSQUEDA Y DESCARTE

  /**
   * 
   * OldName: consultarListaCapexDetallesAC
   * 
  */
  async consultarListaCapexDetallesAC(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_CAPEXDETALLE + "?" + data);

      /*{
      "capexDetails": [
          {
              "transactId": 101,
              "personId": 1,
              "capexDetailId": 13,
              "details": "DETALLES",
              "amount": 500.000,
              "status": true
          },
          {
              "transactId": 101,
              "personId": 1,
              "capexDetailId": 14,
              "details": "DETALLES",
              "amount": 500.000,
              "status": true
          },
          {
              "transactId": 101,
              "personId": 1,
              "capexDetailId": 15,
              "details": "DETALLES",
              "amount": 500.000,
              "status": true
          },
          {
              "transactId": 101,
              "personId": 2,
              "capexDetailId": 16,
              "details": "DETALLES",
              "amount": 500.000,
              "status": true
          }
      ],
      "status": {
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa"
      }
  }*/

      return result.capexDetails;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarListaCapexDetallesAC
   * 
  */
  async guardarListaCapexDetallesAC(data) {
    try {

      /*{
  "transactId":3,
  "personId":3,
  "details":"DETALLES", 
  "amount": 500.000
  }
      */
      data["status"] = true;

      var result = await this.post(url.URL_BACKEND_CAPEXDETALLE, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarListaCapexDetallesAC
   * 
  */
  async actualizarListaCapexDetallesAC(data) {
    try {

      /*{
  "transactId":3,
  "personId":3,
  "capexDetailId":3,
  "details":"MINIMO DETALLE", 
  "amount": 350.000,
  "status":true
  }
      */
      data["status"] = true;

      var result = await this.put(url.URL_BACKEND_CAPEXDETALLE, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarListaCapexDetallesAC
   * 
  */
  async eliminarListaCapexDetallesAC(transactId, personId, capexDetailId) {
    try {
      var data = { transactId: transactId, personId: personId, capexDetailId: capexDetailId };
      var result = await this.del(url.URL_BACKEND_CAPEXDETALLE + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }

  //CAPEX - BUSQUEDA Y DESCARTE

  /**
   * 
   * OldName: consultarListaCapexAC
   * 
  */
  async consultarListaCapexAC(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_CAPEX + "?" + data);

      /*{
      "capex": [
          {
              "transactId": 1,
              "personId": 1,
              "capexId": 18,
              "observations": "observations",
              "thousandUse": 4,
              "shareholder": "accionista",
              "back": "banesco",
              "status": true
          },
          {
              "transactId": 1,
              "personId": 1,
              "capexId": 19,
              "observations": "observations",
              "thousandUse": 4,
              "shareholder": "accionista",
              "back": "banesco",
              "status": true
          }
      ],
      "status": {
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa"
      }
  }*/

      return result.capex;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarListaCapexAC
   * 
  */
  async guardarListaCapexAC(data) {
    try {

      /*{
      "transactId": 1,
      "personId": 1,
      "observations": "observations",
      "thousandUse": 4,
      "shareholder": "accionista",
      "back": "banesco"
  }
      */
      data["status"] = true;

      var result = await this.post(url.URL_BACKEND_CAPEX, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarListaCapexAC
   * 
  */
  async actualizarListaCapexAC(data) {
    try {

      /*{
      "transactId": 1,
      "personId": 1,
      "capexId": 18,
      "observations": "observations",
      "thousandUse": 4,
      "shareholder": "accionista",
      "back": "banesco",
      "status": true
  }
      */
      data["status"] = true;

      var result = await this.put(url.URL_BACKEND_CAPEX, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarListaCapexAC
   * 
  */
  async eliminarListaCapexAC(transactId, personId, capexId) {
    try {
      var data = { transactId: transactId, personId: personId, capexId: capexId };
      var result = await this.del(url.URL_BACKEND_CAPEX + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }

  //CAPEX Presupuesto - BUSQUEDA Y DESCARTE

  /**
   * 
   * OldName: consultarListaCapexPresupuestoAC
   * 
  */
  async consultarListaCapexPresupuestoAC(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_CAPEXPRESUPUESTO + "?" + data);

      /*{
      "capexBudget": [
          {
              "transactId": 9327,
              "personId": 1,
              "capexId": 1,
              "budget": "fake_data",
              "amount": 56.02,
              "status": true
          }
      ],
      "status": {
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa"
      }
  }*/

      return result.capexBudget;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarListaCapexPresupuestoAC
   * 
  */
  async guardarListaCapexPresupuestoAC(data) {
    try {

      /*{
    "transactId": 9327,
    "personId": 1,
    "budget": "fake_data",
    "amount": 56.02
  }
      */
      data["status"] = true;

      var result = await this.post(url.URL_BACKEND_CAPEXPRESUPUESTO, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: actualizarListaCapexPresupuestoAC
   * 
  */
  async actualizarListaCapexPresupuestoAC(data) {
    try {

      /*{
    "transactId": 87,
    "capexId": 1,
    "personId": 98,
    "budget": "fake_data",
    "amount": 6.41,
    "status": true
  }
      */
      data["status"] = true;

      var result = await this.put(url.URL_BACKEND_CAPEXPRESUPUESTO, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  /**
   * 
   * OldName: eliminarListaCapexPresupuestoAC
   * 
  */
  async eliminarListaCapexPresupuestoAC(transactId, personId, capexId) {
    try {
      var data = { transactId: transactId, capexId: capexId, personId: personId };
      var result = await this.del(url.URL_BACKEND_CAPEXPRESUPUESTO + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }


  //HISTORIAL LISTAS NEGRAS

  /**
   * 
   * OldName: consultarHistorialListaNegraporPersonas
   * 
  */
  async consultarHistorialListaNegraporPersonas(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_HISTORIALLISTANEGRA + "?" + data);

      /*{
      "personHistory": [
          {
              "transactId": 9327,
              "personId": 1,
              "roleId": "DEU",
              "blackList": true,
              "comment": "comment",
              "date": "2022-03-03T05:00:00.000+00:00"
          }
      ],
      "status": {
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa"
      }
  }*/

      return result.capexBudget;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarHistorialListaNegraporPersonas
   * 
  */
  async guardarHistorialListaNegraporPersonas(data) {
    try {

      /*{
      "transactId": 1,
      "personId": 1,
      "roleId": "ACC",
      "blackList": true,
      "comment": "comment"
  }
      */

      var result = await this.post(url.URL_BACKEND_CAPEXPRESUPUESTO, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  //RESUMEN DE CAMBIOS

  /**
   * 
   * OldName: consultarResumenCambios
   * 
  */
  async consultarResumenCambios(requestId) {
    try {
      var params = { requestId: requestId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_RESUMENCAMBIOS + "?" + data);

      /*{
      "summary": {
          "requestId": "2",
          "increase": "1",
          "rate": "1",
          "guarantee": "1",
          "desbtorsGuarantors": "1",
          "terms": "1",
          "fees": "1",
          "covenats": "1",
          "others": "1",
          "status": true
      },
      "status": {
          "statusCode": "200",
          "statusDesc": "Transacción Exitosa"
      }
  }*/

      return result.summary;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: guardarResumenCambios
   * 
  */
  async guardarResumenCambios(data) {
    try {

      /*{
      "requestId":"2",
      "increase":"1",
      "rate":"1",
      "guarantee":"1",
      "desbtorsGuarantors":"1",
      "terms":"1",
      "fees":"1",
      "covenats":"1",
      "others": "1",
      "status":true
  }
      */
      // data.status = true;
      var result = await this.post(url.URL_BACKEND_RESUMENCAMBIOS, data);//saveProposalData

      if (result.statusCode === "500") {
        result = await this.put(url.URL_BACKEND_RESUMENCAMBIOS, data);//saveProposalData
      }

      return result;
    }
    catch (err) {
      console.error("api guardarDesembolsoPropCred", err);
    }
    return undefined;
  }

  //RESUMEN DE CAMBIOS

  /**
   * 
   * OldName: consultarFacilidades
   * 
  */
  async consultarFacilidades(requestId, facilityId = 0) {
    try {
      var params = {facilityId: facilityId, requestId: requestId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_FACILIDADES + "?" + data); ///list

      /*{
      "status": {
          "statusCode": "200",
          "statusDesc": "Transacción Exitosa"
      },
      "listSection": [
          {
              "requestId": "XYZ972022",
              "facilityId": 22,
              "cr": "1",
              "amount": 1.0,
              "debtor": "1",
              "customerId": 1,
              "balance": 1.0,
              "proposedType": "1",
              "subproposalType": "1",
              "facilityType": "1",
              "purpose": "1",
              "sublimits": "1",
              "proposedRate": 1.0,
              "nonSubsidyRate": 1.0,
              "effectiveRate": 1.0,
              "feci": true,
              "deadlinesDays": 1.0,
              "descriptionDeadlines": "1",
              "ltv": 1.0,
              "financialConditions": "1",
              "environmentalRiskCategory": 1.0,
              "covenant": "1",
              "environmentalOpinion": "1",
              "financialCovenant": "1",
              "legalDocumentation": "1",
              "opinionRiskCredit": "1",
              "provision": "1",
              "applyEscrow":true
          },
          {
              "requestId": "XYZ972022",
              "facilityId": 4,
              "cr": "",
              "amount": 22.4,
              "debtor": "",
              "customerId": 1,
              "balance": 22.5,
              "proposedType": "",
              "subproposalType": "",
              "facilityType": "",
              "purpose": "",
              "sublimits": "",
              "proposedRate": 22.5,
              "nonSubsidyRate": 22.5,
              "effectiveRate": 22.5,
              "feci": true,
              "deadlinesDays": 22.5,
              "descriptionDeadlines": "",
              "ltv": 22.5,
              "financialConditions": "",
              "environmentalRiskCategory": 22.5,
              "covenant": "",
              "environmentalOpinion": "",
              "financialCovenant": "",
              "legalDocumentation": "",
              "opinionRiskCredit": "",
              "provision": "",
              "applyEscrow":true
          }
      ]
  }*/
      /*return result.listSection.find((element) => {
        return element.debtor !== "  ";
      })*/
      //var dataresult = result.listSection.find((item) => {
      //  return Number(item.debtor) > 0;
      //})
      var dataresult = [];
      for (var item of result.facilities) {
        if (Number(item.debtor) > 0) {
          if (item.origin !== "CORE") {
            dataresult.push(item);
          }
        }
      }
      return dataresult;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async consultarFacilidadesT24(requestId) {
    try {
      var params = { requestId: requestId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_FACILIDADES + "?" + data); ///list
      var dataresult = [];
      for (var item of result.facilities) {
        if (item.origin == "CORE") {
          dataresult.push(item);
        }
      }
      return dataresult;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async consultarFacilidadesExposicionCorporativa(requestId) {
    try {
      var params = { requestId: requestId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_FACILIDADES + "/list/accountant?" + data);

      return result??{
        "LP": [],
        "CP": [],
        "status": {
            "statusCode": "204",
            "statusDesc": "No content"
        }
    };
    }
    catch (err) {
      console.error(err)
    }
    return { "LP": [], "CP": [],
      "status": {
          "statusCode": "204",
          "statusDesc": "No content"
      }
  };  
      
  }
  async consultarFacilidades2(requestId, facilityId=0) {
    try {
      var params = { requestId: requestId,facilityId:facilityId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_FACILIDADES + "?" + data); ///list
      var dataresult = [];
      for (var item of result.facilities) {
        if (Number(item.debtor) > 0) {
          dataresult.push(item);
        }
      }
      return result.facilities;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async eliminarFacilidadesFisica(requestId) {
    try {
      var data = { requestId: requestId };
      var result = await this.del(url.URL_BACKEND_FACILIDADES + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
 

  //CHECK LIST 

  //consultar el checklist por etapa en pantalla ... documentoscheck
  async getCheckListDocuments(data) {
    try {

      /*
      {
  "bankingType": [
        "PYME"
    ],
    "guaranteeType": [100],
    "facilityType": ["LCR"],
    "requestType": ["NU"],
    "processStage": [
        2],
    "bailType":["MIL"],
    "guarantorCustomer":true
}
      */
      console.log(data);
      var params = { transactId: data.transactId, stageProcess: data.processStage[0] }

      var result = await this.get(url.URL_BACKEND_CheckListDocuments + "?" + qs.stringify(params));//saveProposalData

      /*{
    "data": [
        {
            "id": 6,
            "document": "\tReferencias  APC (Deudores, accionistas, fiadores, Garantes) \t",
            "bankingType": "\t{\"tipobanca\":[\"PYME\",\"CORPORATIVO / EMPRESAS\",\"INTERNACIONAL\",\"INTERINO\",\"AGROPECUARIO\"]}",
            "guaranteeType": "{\"tipogarantia\":[100,200,100,200]}",
            "facilityType": "{\"tipofacilidad\":[\"LCR\",\"LCN\",\"LCS\",\"LCC\",\"PC\",\"PI\",\"HP\",\"PAC\",\"PCE\",\"PS\",\"PAG\"]}",
            "requestType": "{\"tiposolicitud\":[\"NU\",\"RE\",\"REC\",\"REN\",\"RNC\",\"RES\",\"REF\"]}",
            "excepted": false,
            "documentaryType": "\tCIF - Verificación de referencias APC\t",
            "validityPeriodDays": 180,
            "processStage": "{\"etapaproceso\":[2,3,4,6,8,12]}",
            "status": true,
            "documentationType": "D",
            "fileType": "C"
        },
        {
            "id": 57,
            "document": "\tContrato de Prenda Mercantil (Grantías en efectivo- DPF y ahorro)\t",
            "bankingType": "\t{\"tipobanca\":[\"PYME\",\"CORPORATIVO / EMPRESAS\",\"INTERNACIONAL\",\"INTERINO\",\"AGROPECUARIO\"]}",
            "guaranteeType": "{\"tipogarantia\":[100,200]}",
            "facilityType": "{\"tipofacilidad\":[\"LCR\",\"LCN\",\"LCS\",\"LCC\",\"PC\",\"PI\",\"PR\",\"HP\",\"PAC\",\"PCE\",\"PS\",\"CC\",\"PAG\"]}",
            "requestType": "{\"tiposolicitud\":[\"NU\",\"REC\",\"RNC\",\"REF\"]}",
            "excepted": false,
            "documentaryType": "\tCOM - Contratos / Adenda\t",
            "validityPeriodDays": 180,
            "processStage": "{\"etapaproceso\":[2,6,12]}",
            "status": true,
            "documentationType": "F",
            "fileType": "L"
        }
    ],
    "serviceStatus": {
        "statusCode": "200",
        "statusDesc": "Succesful transaction"
    }
}*/

      return result;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  //consultarCheckListTramite
  async consultarCheckListTramite(transactId, personId) {
    try {
      var params = { transactId, personId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_CHECKLISTTRAMITE + "?" + data);

      /*{
      "status": {
          "statusCode": "204",
          "statusDesc": "Transacción Exitosa"
      },
      "data": [
          {
            "transactId": 3247,
            "personId": 1,
            "checklistId": 2,
            "document": "vdocumentochk",
            "date": "2022-04-02T00:00:00.000+00:00",
            "onbaseId": "idonbase",
            "status": true,
            "expirationDate": null,
            "excluded": null,
            "commitmentDate": null
        },
        {
            "transactId": 3247,
            "personId": 1,
            "checklistId": 6,
            "document": "\tReferencias  APC (Deudores, accionistas, fiadores, Garantes) \t",
            "date": "2022-04-02T00:00:00.000+00:00",
            "onbaseId": "34596729",
            "status": true,
            "expirationDate": null,
            "excluded": null,
            "commitmentDate": null
        }
      ]
  }*/

      return result.data;
    }
    catch (err) {
      console.error("api consultarListaDesembolsoPropCred: ", err)
    }
    return undefined;
  }
  //guardarCheckListTramite
  async guardarCheckListTramite(data) {
    try {

      /*{
    "transactId": 3247,
            "personId": 1,
            "checklistId": 2,
            "document": "vdocumentochk",
            "date": "2022-04-02T00:00:00.000+00:00",
            "onbaseId": "idonbase",
            "expirationDate": "2015-11-25",
            "excluded": false,
            "commitmentDate": "2015-11-25",
            "status":true
}
      */
      data["date"] = moment().valueOf();
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_CHECKLISTTRAMITE, data);//saveProposalData
      if (result.statusCode !== opt.ResponseBackend_STATUSOK) {
        result = await this.post(url.URL_BACKEND_CHECKLISTTRAMITE, data);//saveProposalData
      }

      return result;
    }
    catch (err) {
      console.error(err);
    }
    return undefined;
  }
  //eliminarCheckListTramite
  async eliminarCheckListTramite(transactId, personId, checkListId) {
    try {
      var data = { transactId: transactId, personId: personId, checkListId: checkListId };
      var result = await this.del(url.URL_BACKEND_CHECKLISTTRAMITE + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async deleteFacility(facilityId, requestId) {
    try {
      var data = { facilityId: facilityId, requestId: requestId };
      var result = await this.del(url.URL_BACKEND_FACILIDADES + "?" + qs.stringify(data));
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }

  //GENERACION DE DOCUMENTOS
  //
  /**
   * 
   * OldName: ConsultarDatosComparecenciaJuridicaLineaSobregiro
   * 
  */
  async ConsultarDatosComparecenciaJuridicaLineaSobregiro(transactId) {
    try {
      var data = { transactId: transactId };
      var result = await this.get(url.URL_BACKEND_DatosComparecenciaJuridicaLineaSobregiro + "?" + qs.stringify(data));

      /*{
      "signatory": null,
      "debtorCompany": null,
      "debtorInscription": null,
      "authorizationDocument": null,
      "debtorType": null,
      "amountContractFinanceLetter": null,
      "amountContract": null,
      "interestRateFinantialLetter": null,
      "interestRate": null,
      "guaranteeData": null,
      "liabilities": null,
      "status": {
          "statusCode": "204",
          "statusDesc": "Sin Contenido"
      }
  }*/
      return result;
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }
  //Acta para contratos de fideicomiso de auto banesco (contrato privado)

  /**
   * 
   * OldName: ConsultarDatosContratosPrivados
   * 
  */
  async ConsultarDatosContratosPrivados(transactId) {
    try {
      var data = { transactId: transactId };
      var result = await this.get(url.URL_BACKEND_DatosContratosPrivados + "?" + qs.stringify(data));

      /*{
      "debtorCompanyName": null,
      "signature": null,
      "facilityType": null,
      "presidentName": null,
      "secretaryName": null,
      "amountContractFinanceLetter": null,
      "amountContract": null,
      "purpose": null,
      "signatory": null,
      "status": {
          "statusCode": "204",
          "statusDesc": "Sin Contenido"
      }
  }*/
      return result;
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: ConsultarDatosActaFideicomiso
   * 
  */
  async ConsultarDatosActaFideicomiso(transactId) {
    try {
      var data = { transactId: transactId };
      var result = await this.get(url.URL_BACKEND_DatosActaFideicomiso + "?" + qs.stringify(data));

      /*{
    "debtorCompanyName": "vnombre character varying vnombre2 character varying",
    "presidentName": " ",
    "date": "2022-02-24",
    "secretaryName": " ",
    "amountContractFinanceLetter": " ",
    "amountContract": 99.68,
    "financeAmountFinanceLetter": " ",
    "financeAmount": 99.68,
    "totalAmountFinanceLetter": " ",
    "totalAmount": 99.68,
    "vehicleData": " ",
    "signatoryName": " ",
    "documentTypeSignatory": " ",
    "documentNumberSignatory": " ",
    "presidentNameDebtorCompany": null,
    "secretaryNameDebtorCompany": null,
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}*/
      return result;
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }
  //Contrato de Préstamo Comercial a Plazo( Tipo de facilidad = Préstamo Comercial

  /**
   * 
   * OldName: ConsultarDatosComparecenciaJuridicaPrestAPlazo
   * 
  */
  async ConsultarDatosComparecenciaJuridicaPrestAPlazo(transactId) {
    try {
      var data = { transactId: transactId };
      var result = await this.get(url.URL_BACKEND_DatosComparecenciaJuridicaPrestAPlazo + "?" + qs.stringify(data));

      /*{
      "signatory": null,
      "debtorCompany": null,
      "debtorInscription": null,
      "authorizationDocument": null,
      "debtorType": null,
      "amountContractFinanceLetter": null,
      "amountContract": null,
      "term": null,
      "payment": null,
      "paymentAmount": null,
      "interestRateFinantialLetter": null,
      "interestRate": null,
      "commission": null,
      "guaranteeData": null,
      "liabilities": null,
      "managerBankName": null,
      "notificationAddress": null,
      "debtorTelephone": null,
      "debtorEmail": null,
      "facilityFinanceLetterAmount": null,
      "facilityAmount": null,
      "status": {
          "statusCode": "204",
          "statusDesc": "Sin Contenido"
      }
  }*/
      return result;
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: ConsultarDatosFianzaEntrecruzadaIlimitadaPNat
   * 
  */
  async ConsultarDatosFianzaEntrecruzadaIlimitadaPNat(transactId) {
    try {
      var data = { transactId: transactId };
      var result = await this.get(url.URL_BACKEND_FianzaEntrecruzadaIlimitadaPNat + "?" + qs.stringify(data));

      /*{
    "signatory": {
        "name": "",
        "gender": "",
        "nationality": "",
        "civilStatus": "",
        "profession": "",
        "country": "",
        "documentType": "",
        "documentNumber": ""
    },
    "debtorCompany": {
        "name": "",
        "country": ""
    },
    "debtorInscription": {
        "file": "",
        "document": ""
    },
    "signatureDate": "2022-02-24T21:36:27.407+00:00",
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}*/
      return result;
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: ConsultarDatosFianzaSolidariaIlimitadaPNat
   * 
  */
  async ConsultarDatosFianzaSolidariaIlimitadaPNat(transactId) {
    try {
      var data = { transactId: transactId };
      var result = await this.get(url.URL_BACKEND_FianzaSolidariaIlimitadaPNat + "?" + qs.stringify(data));

      /*{
    "signatory": {
        "name": "",
        "gender": "",
        "nationality": "",
        "civilStatus": "",
        "profession": "",
        "country": "",
        "documentType": "",
        "documentNumber": ""
    },
    "debtorCompany": {
        "name": "",
        "country": ""
    },
    "debtorInscription": {
        "file": "",
        "document": ""
    },
    "signatureDate": "2022-02-24T21:48:32.064+00:00",
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}*/
      return result;
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: ConsultarDatosFianzaSolidariaIlimitadaPJuri
   * 
  */
  async ConsultarDatosFianzaSolidariaIlimitadaPJuri(transactId) {
    try {
      var data = { transactId: transactId };
      var result = await this.get(url.URL_BACKEND_FianzaSolidariaIlimitadaPJuri + "?" + qs.stringify(data));

      /*{
    "signatory": {
        "name": "",
        "gender": "",
        "nationality": "",
        "civilStatus": "",
        "profession": "",
        "country": "",
        "documentType": "",
        "documentNumber": ""
    },
    "debtorCompany": {
        "name": "",
        "country": ""
    },
    "debtorInscription": {
        "file": "",
        "document": ""
    },
    "signatureDate": "2022-02-24T21:54:15.234+00:00",
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}*/
      return result;
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: ConsultarDatosFianzaSolidariaLimitadaPJuri
   * 
  */
  async ConsultarDatosFianzaSolidariaLimitadaPJuri(transactId) {
    try {
      var data = { transactId: transactId };
      var result = await this.get(url.URL_BACKEND_FianzaSolidariaLimitadaPJuri + "?" + qs.stringify(data));

      /*{
    "signatory": null,
    "debtorCompany": null,
    "debtorInscription": null,
    "amountContractFinanceLetter": null,
    "amountContract": null,
    "signatureDate": null,
    "status": {
        "statusCode": "204",
        "statusDesc": "Sin Contenido"
    }
}*/
      return result;
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  /**
   * 
   * OldName: ConsultarDatosFianzalimitadaMancomunadaPNat
   * 
  */
  async ConsultarDatosFianzalimitadaMancomunadaPNat(transactId) {
    try {
      var data = { transactId: transactId };
      var result = await this.get(url.URL_BACKEND_FianzalimitadaMancomunadaPNat + "?" + qs.stringify(data));

      /*{
    "signatory": {
        "name": "",
        "gender": "",
        "nationality": "",
        "civilStatus": "",
        "profession": "",
        "country": "",
        "documentType": "",
        "documentNumber": ""
    },
    "debtorCompany": {
        "name": "",
        "country": ""
    },
    "debtorInscription": {
        "file": "",
        "document": ""
    },
    "interestRateFinantialLetter": "",
    "interestRate": 5.99,
    "amountContractFinanceLetter": "",
    "amountContract": 1.0,
    "signatureDate": "2022-03-01T22:08:51.170+00:00",
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}*/
      return result;
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }
  //Carta de Terminos y Condiciones

  /**
   * 
   * OldName: ConsultarDatosCartaTerminosyCondiciones
   * 
  */
  async ConsultarDatosCartaTerminosyCondiciones(transactId) {
    try {
      var data = { transactId: transactId };
      var result = await this.get(url.URL_BACKEND_CartaTerminosCondiciones + "?" + qs.stringify(data));

      /*{
    "date": null,
    "presidentNameDebtorCompany": null,
    "debtorCompanyName": null,
    "city": null,
    "facilityType": null,
    "debtors": null,
    "amountContractFinanceLetter": null,
    "amountContract": null,
    "purpose": null,
    "interestRate": null,
    "commission": null,
    "term": null,
    "disbursementForm": null,
    "paymentForm": null,
    "financialConditions": null,
    "otherConditions": null,
    "renovationDate": null,
    "field1": null,
    "field2": null,
    "field3": null,
    "field4": null,
    "status": {
        "statusCode": "204",
        "statusDesc": "Sin Contenido"
    }
}*/
      return result;
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }


  //GENERAR NUEVO TRAMITE
  async nuevoTramite(transactId, instanceId, currentProcessId, nextProcessId, responsible, requestId) {
    let result = undefined;
    try {
      //moment().valueOf()
      var data = {
        transactId: transactId,//9330
        instanceId: "-2",//moment().valueOf().toString(),//instanceId,//"9330"
        currentProcessId: currentProcessId,//1
        nextProcessId: nextProcessId,//2
        responsible: responsible,//"admin"
        requestId: requestId//"1"
      }
      console.log("nuevoTramite", data);
      result = await this.post(url.URL_BACKEND_TRAMITES, data);

      data.transactId = result.transactId;
      data.instanceId = result.transactId

      result = await this.actualizarTramite(data)

      console.log("nuevoTramite", result);
      return data;

    }
    catch (err) {
      console.log(err);
    }

    return undefined;
  }
  async actualizarTramite(data) {
    try {

      /*{
  "transactId":3107,
   "instanceId":"3107",
   "currentProcessId":1,
   "nextProcessId":1,
   "responsible":"jjjj",
   "requestId":""
   "clientId":1,
    "processDate":1647955328,
   "status":true,
}
      */
      data["clientId"] = "1";
      data["processDate"] = moment().valueOf();
      data["status"] = true;

      var result = await this.put(url.URL_BACKEND_TRAMITES, data);//saveProposalData
      console.log("actualizarTramite", result);
      return result;
    }
    catch (err) {
      console.error("actualizarTramite", result);
    }
    return undefined;
  }


  //FACILIDA - Consultar Valor de Tasa

  /**
   * 
   * OldName: consultarValorTasa
   * 
  */
  async consultarValorTasa(transactId) {
    try {
      var data = { transactId: transactId };
      var result = await this.get(url.URL_BACKEND_CONSULTARTASA + "?" + qs.stringify(data));

      /*{
      "rate": null,
      "transactId": null,
      "statusService": {
          "statusCode": "204",
          "statusDesc": "Sin Contenido"
      }
  } */
      return result.rate;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("api eliminarInformacionFinancieraFiadores: ", err)
    }
    return undefined;
  }

  //GENERAR NUEVO TRAMITE

  /**
   * 
   * OldName: asignarAnalistaPropuestaCredito
   * 
  */
  async asignarAnalistaPropuestaCredito(transactId, requestId, requestType, analyst, responsibleUnit, requestStatus) {
    let result = undefined;
    try {

      var data = {
        transactId: transactId, //9327,
        requestId: requestId,//"XYZ972022",
        requestType: requestType,//"1",
        analyst: analyst,//"1",
        responsibleUnit: responsibleUnit,//"1-updated",
        requestStatus: requestStatus//"1-updated"
      }

      result = await this.put(url.URL_BACKEND_ASIGNARANALISTA, data);

      return result;

    }
    catch (err) {
      console.error("api guardarUsuarioProspecto: ", err);
    }

    return undefined;
  }

  ///////////// CATALOGOS //////////////////////
  /////////////////////////////////////////

  //LISTA DE TIPO DE IDENTIFICACION

  /**
   * 
   * OldName: consultarCatalogoTipoPersonaDescripcion
   * 
  */
  async consultarCatalogoTipoPersonaDescripcion(tipoPersona) {
    try {
      console.log("consultarCatalogoTipoPersonaDescripcion", tipoPersona);
      var data = await this.consultarCatalogoTipoPersona();
      console.log("consultarCatalogoTipoPersonaDescripcion", data);
      // data = data.find(x => x.code === Number(tipoPersona)).label;

      await convertToUpperCasesData(data)

      return data;
    }
    catch (err) {
      console.error(err);
    }
    return undefined;
  }


  /**
   * 
   * OldName: consultarCatalogoTipoPersona
   * 
  */
  async consultarCatalogoTipoPersona() {
    try {
      var data = [{ label: "Natural", code: 1 }, { label: "Jurídica", code: 2 }];

      await convertToUpperCasesData(data)

      return data;
    }
    catch (err) {
      console.error("error consultarCatalogoTipoPersona: ", err);
    }
    return undefined;
  }

  //LISTA DE TIPO DE IDENTIFICACION

  /**
   * 
   * OldName: consultarCatalogoTipoIdentificacion
   * 
  */
  async consultarCatalogoTipoIdentificacion() {
    try {

      /*
      var result = sessionStorage.getItem('catTipoIdentificacion');
      if (result !== undefined && result !== null) {
        result = JSON.parse(result);
        await convertToUpperCasesData(result)
        return result;
      }*/

      var result = await this.get(url.ULR_BACKEND_TIPODEIDENTIFICACION);

      /*
      "status": {
    "statusCode": "200",
    "statusDesc": "Transacciï¿½n Exitosa"
},
"identificationType": [
    {
        "id": "CED",
        "description": "Identity",
        "state": true
    },
    {
        "id": "CIP",
        "description": "Identity - Panama",
        "state": true
    },
  }
      */

      var data = [];
      for (const identif of result.identificationType) {
        /*if (identif["id"] === "CED" || identif["id"] === "PAS" || identif["id"] === "RUC" || identif["id"] === "RIF") { //|| identif["id"] === "CIP"
          data.push(identif);
        }*/
        data.push(identif);
      }

      await convertToUpperCasesData(data)

      if (data.length > 0) {
        sessionStorage.setItem('catTipoIdentificacion', JSON.stringify(data));
      }

      return data;
    }
    catch (err) {
      console.error("api error consultarCatalogoTipoIdentificacion: ", err);
    }
    return undefined;

    /*
    return watchlist.fromJson(result);
      const json = [
        { id: 1, description: 'RUC' },
        { id: 2, description: 'Cédula' },
        { id: 3, description: 'Pasaporte' },
    ];
    return json;
    */
  }

  //CC-320	ConsultarListaClasificacionRiesgo

  /**
   * 
   * OldName: retrieveRiskClassification
   * 
  */
  async retrieveRiskClassification() {
    try {

      var result = await this.get(url.URL_BACKEND_CATALOGO_CLASIFICACIONRIESGO);

      /*{
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    },
    "riskClassification": [
        {
            "id": "NO",
            "description": "Normal",
            "state": true
        },
        {
            "id": "ME",
            "description": "Mencion especial",
            "state": true
        },
        {
            "id": "DU",
            "description": "Dudoso",
            "state": true
        },
        {
            "id": "IR",
            "description": "Irrecuperable",
            "state": true
        }
    ]
}*/
      await convertToUpperCasesData(result.riskClassification)

      return result.riskClassification;
    }
    catch (err) {
      console.error("api retrieveRiskClassification: ", err)
    }
    return undefined;
  }

  //CC-319	ConsultarListaTipoRevision

  /**
   * 
   * OldName: retrieveRevisionType
   * 
  */
  async retrieveRevisionType() {
    try {

      var result = await this.get(url.URL_BACKEND_CATALOGO_TIPOREVISION);

      /*{
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    },
    "revisionType": [
        {
            "id": "AN",
            "description": "Anual",
            "state": true
        },
        {
            "id": "SE",
            "description": "Semestral",
            "state": true
        },
        {
            "id": "TR",
            "description": "Trimestral",
            "state": true
        },
        {
            "id": "NP",
            "description": "Nueva propuesta",
            "state": true
        },
        {
            "id": "OT",
            "description": "Otra",
            "state": true
        }
    ]
}*/
      await convertToUpperCasesData(result.revisionType)

      return result.revisionType;
    }
    catch (err) {
      console.error("api retrieveRevisionType: ", err)
    }
    return undefined;
  }

  //CC-321	consultarListaTipoPropuesta

  /**
   * 
   * OldName: retrieveProposalType
   * 
  */
  async retrieveProposalType() {
    try {

      var result = await this.get(url.URL_BACKEND_CATALOGO_TIPOPROPUESTA);

      /*{
      "status": {
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa"
      },
      "proposalType": [
          {
              "id": "NU",
              "description": "Nuevo",
              "state": true
          },
          {
              "id": "RE",
              "description": "Revision",
              "state": true
          },
          {
              "id": "REC",
              "description": "Revision con cambio",
              "state": true
          },
          {
              "id": "REN",
              "description": "Renovacion",
              "state": true
          },
          {
              "id": "RNC",
              "description": "Renovacion con cambio",
              "state": true
          },
          {
              "id": "MEN",
              "description": "Mencion",
              "state": true
          },
          {
              "id": "CAN",
              "description": "Cancelar",
              "state": true
          },
          {
              "id": "RES",
              "description": "Restructuracion",
              "state": true
          },
          {
              "id": "REF",
              "description": "Refinanciamiento",
              "state": true
          }
      ]
  }*/

      await convertToUpperCasesData(result.proposalType)


      return result.proposalType;
    }
    catch (err) {
      console.error("api retrieveProposalType: ", err)
    }
    return undefined;
  }

  //CC-325	consultarListaTipoSubPropuesta

  /**
   * 
   * OldName: retrieveSubproposalType
   * 
  */
  async retrieveSubproposalType() {
    try {

      var result = await this.get(url.URL_BACKEND_CATALOGO_TIPOSUBPROPUESTA);

      /*{
      "status": {
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa"
      },
      "subproposalType": [
          {
              "id": "DISV",
              "description": "Disminución de las ventas",
              "state": true
          },
          {
              "id": "LRI",
              "description": "Lenta Rotación de Inventario",
              "state": true
          },
          {
              "id": "LRCC",
              "description": "Lenta Rotación de Cuentas por Cobrar",
              "state": true
          },
          {
              "id": "DFO",
              "description": "Desvío de Fondo a Otras Actividades",
              "state": true
          },
          {
              "id": "DEF",
              "description": "Descalce Financiero",
              "state": true
          },
          {
              "id": "FEX",
              "description": "Factores Externos a la Empresa",
              "state": true
          },
          {
              "id": "CAI",
              "description": "Caída en Ingresos",
              "state": true
          },
          {
              "id": "DISR",
              "description": "Disminución de la Rentabilidad",
              "state": true
          }
      ]
  }*/
      await convertToUpperCasesData(result.subproposalType)

      return result.subproposalType;
    }
    catch (err) {
      console.error("api retrieveProposalType: ", err)
    }
    return undefined;
  }

  //CC-322	consultarListaTipoFacilidad

  /**
   * 
   * OldName: retrieveFacilityType
   * 
  */
  async retrieveFacilityType() {
    try {

      var result = await this.get(url.URL_BACKEND_CATALOGO_TIPOFACILIDAD);

      /*{
      "status": {
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa"
      },
      "facilityType": [
          {
              "id": "LCR",
              "description": "Linea de credito rotativa",
              "state": true
          },
          {
              "id": "LCN",
              "description": "Linea de credito no rotativa",
              "state": true
          },
          {
              "id": "LCS",
              "description": "Linea de credito para sobregiro",
              "state": true
          },
          {
              "id": "LCC",
              "description": "Linea de credito convertible a prestamo",
              "state": true
          },
          {
              "id": "PC",
              "description": "Prestamo comercial",
              "state": true
          },
          {
              "id": "PI",
              "description": "Prestamo interno",
              "state": true
          },
          {
              "id": "PR",
              "description": "prestamo prendario",
              "state": true
          },
          {
              "id": "HP",
              "description": "Prestamo hipotecario",
              "state": true
          },
          {
              "id": "PAC",
              "description": "Prestamo auto comercial",
              "state": true
          },
          {
              "id": "PCE",
              "description": "Prestamo comercial para equipos",
              "state": true
          },
          {
              "id": "PS",
              "description": "Prestamo sindicado",
              "state": true
          },
          {
              "id": "CC",
              "description": "Carta de credito",
              "state": true
          },
          {
              "id": "PAG",
              "description": "Prestamo agropecuario",
              "state": true
          }
      ]
  }*/
      await convertToUpperCasesData(result.facilityType)

      return result.facilityType;
    }
    catch (err) {
      console.error("api retrieveFacilityType: ", err)
    }
    return undefined;
  }

  //CC-324	consultarListaTipoFianza

  /**
   * 
   * OldName: retrieveBailType
   * 
  */
  async retrieveBailType() {
    try {

      var result = await this.get(url.URL_BACKEND_CATALOGO_TIPOFIANZA);

      /*{
      "status": {
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa"
      },
      "bailType": [
          {
              "id": "SIPN",
              "description": "Solidaria ilimitada PN",
              "state": true
          },
          {
              "id": "SIPJ",
              "description": "olidaria ilimitada PJ",
              "state": true
          },
          {
              "id": "CRU",
              "description": "Cruzadas",
              "state": true
          },
          {
              "id": "MAL",
              "description": "Mancomunadas limitadas",
              "state": true
          },
          {
              "id": "SOL",
              "description": "Solidaria limitada",
              "state": true
          },
          {
              "id": "CUM",
              "description": "Cumplimiento",
              "state": true
          },
          {
              "id": "MIL",
              "description": "Mancomunadas ilimitadas",
              "state": true
          }
      ]
  }*/
      await convertToUpperCasesData(result.bailType)

      return result.bailType;
    }
    catch (err) {
      console.error("api retrieveBailType: ", err)
    }
    return undefined;
  }

  //CC-425	consultarListaRoles

  /**
   * 
   * OldName: retrieveRoleCatalog
   * 
  */
  async retrieveRoleCatalog() {
    try {

      var result = sessionStorage.getItem('catRoles');
      if (result !== undefined && result !== null) {
        return JSON.parse(result);
      }
      //sessionStorage.setItem('catRoles', JSON.stringify(result.roles));

      result = await this.get(url.URL_BACKEND_CATALOGO_ROLES);

      /*{
    "roles": [
        {
            "roleId": "DEU",
            "roleDescription": "Deudor principal",
            "status": true
        },
        {
            "roleId": "ACC",
            "roleDescription": "Accionista",
            "status": true
        },
        {
            "roleId": "RPL",
            "roleDescription": "Representante legal",
            "status": true
        },
        {
            "roleId": "APO",
            "roleDescription": "Apoderado legal",
            "status": true
        },
        {
            "roleId": "DIR",
            "roleDescription": "Director",
            "status": true
        },
        {
            "roleId": "DIG",
            "roleDescription": "Dignatario",
            "status": true
        },
        {
            "roleId": "GAR",
            "roleDescription": "Garante",
            "status": true
        },
        {
            "roleId": "FID",
            "roleDescription": "Fideicomitente",
            "status": true
        },
        {
            "roleId": "MIJ",
            "roleDescription": "Miembro junta directiva",
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}*/
      await convertToUpperCasesData(result.roles)


      sessionStorage.setItem('catRoles', JSON.stringify(result.roles));

      return result.roles;
    }
    catch (err) {
      console.error("api retrieveRoleCatalog: ", err)
    }
    return undefined;
  }

  //CC-450	consultarListaTiposdePrestamos

  /**
   * 
   * OldName: retrieveLoanType
   * 
  */
  async retrieveLoanType() {
    try {

      var result = await this.get(url.URL_BACKEND_CATALOGO_TIPOSPRESTAMOS);

      /*{
    "typeOfLoans": [
        {
            "id": "PRC",
            "description": "PRESTAMO COMERCIAL",
            "status": true
        },
        {
            "id": "PBL",
            "description": "PRESTAMO BAJO LINEA",
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}*/
      await convertToUpperCasesData(result.typeOfLoans)

      return result.typeOfLoans;
    }
    catch (err) {
      console.error("api retrieveRoleCatalog: ", err)
    }
    return undefined;
  }

  //CC-451 consultarListadeCiclodePagoIntereses

  /**
   * 
   * OldName: retrieveInterestPaymentCycle
   * 
  */
  async retrieveInterestPaymentCycle() {
    try {

      var result = await this.get(url.URL_BACKEND_CATALOGO_CICLOPAGOSINTERES);

      /*{
    "interestPaymentCycle": [
        {
            "id": "TR",
            "description": "Trimestral",
            "status": true
        },
        {
            "id": "SE",
            "description": "Semestral",
            "status": true
        },
        {
            "id": "AN",
            "description": "Anual",
            "status": true
        },
        {
            "id": "AV",
            "description": "Al vencimiento",
            "status": true
        },
        {
            "id": "ME",
            "description": "Mensual",
            "status": true
        },
        {
            "id": "TR",
            "description": "Trimestral",
            "status": true
        },
        {
            "id": "SE",
            "description": "Semestral",
            "status": true
        },
        {
            "id": "AN",
            "description": "Anual",
            "status": true
        },
        {
            "id": "AV",
            "description": "Al vencimiento",
            "status": true
        },
        {
            "id": "ME",
            "description": "Mensual",
            "status": true
        },
        {
            "id": "TR",
            "description": "Trimestral",
            "status": true
        },
        {
            "id": "SE",
            "description": "Semestral",
            "status": true
        },
        {
            "id": "AN",
            "description": "Anual",
            "status": true
        },
        {
            "id": "AV",
            "description": "Al vencimiento",
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}*/
      await convertToUpperCasesData(result.interestPaymentCycle)

      return result.interestPaymentCycle;
    }
    catch (err) {
      console.error("api retrieveRoleCatalog: ", err)
    }
    return undefined;
  }

  //CC-451 consultarListadePagoCapital

  /**
   * 
   * OldName: retrieveCapitalPaymentCycle
   * 
  */
  async retrieveCapitalPaymentCycle() {
    try {

      var result = await this.get(url.URL_BACKEND_CATALOGO_CICLOPAGOSINTERES);

      /*{
    "interestPaymentCycle": [
        {
            "id": "TR",
            "description": "Trimestral",
            "status": true
        },
        {
            "id": "SE",
            "description": "Semestral",
            "status": true
        },
        {
            "id": "AN",
            "description": "Anual",
            "status": true
        },
        {
            "id": "AV",
            "description": "Al vencimiento",
            "status": true
        },
        {
            "id": "ME",
            "description": "Mensual",
            "status": true
        },
        {
            "id": "TR",
            "description": "Trimestral",
            "status": true
        },
        {
            "id": "SE",
            "description": "Semestral",
            "status": true
        },
        {
            "id": "AN",
            "description": "Anual",
            "status": true
        },
        {
            "id": "AV",
            "description": "Al vencimiento",
            "status": true
        },
        {
            "id": "ME",
            "description": "Mensual",
            "status": true
        },
        {
            "id": "TR",
            "description": "Trimestral",
            "status": true
        },
        {
            "id": "SE",
            "description": "Semestral",
            "status": true
        },
        {
            "id": "AN",
            "description": "Anual",
            "status": true
        },
        {
            "id": "AV",
            "description": "Al vencimiento",
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
}*/
      await convertToUpperCasesData(result.interestPaymentCycle)

      return result.interestPaymentCycle;
    }
    catch (err) {
      console.error("api retrieveRoleCatalog: ", err)
    }
    return undefined;
  }

  //CC-483 ConsultarListaClienteSostenible

  /**
   * 
   * OldName: retrieveSustainableProjects
   * 
  */
  async retrieveSustainableProjects() {
    try {

      var result = await this.get(url.URL_BACKEND_CATALOGO_CLIENTESOSTENIBLE);

      /*{
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    },
    "sustainableProjects": [
        {
            "id": "ES",
            "description": "Energia solar",
            "state": true
        },
        {
            "id": "CIP",
            "description": "Energia eolica",
            "state": true
        },
        {
            "id": "CRP",
            "description": "Hidroelectrica",
            "state": true
        },
        {
            "id": "CSS",
            "description": "Reutilizacion de materia organica para generacion de energia (biomasa)",
            "state": true
        },
        {
            "id": "PAS",
            "description": "Reciclaje y saneamiento de aguas",
            "state": true
        }
    ]
}*/
      await convertToUpperCasesData(result.sustainableProjects)

      return result.sustainableProjects;
    }
    catch (err) {
      console.error("api retrieveRoleCatalog: ", err)
    }
    return undefined;
  }

  //CC-484 ConsultarListaRelacionSolicitante

  /**
   * 
   * OldName: retrieveApplicantRelationship
   * 
  */
  async retrieveApplicantRelationship() {
    try {

      var result = await this.get(url.URL_BACKEND_CATALOGO_RelacionSolicitante);

      /*{
      "status": {
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa"
      },
      "applicantRelationship": [
          {
              "id": "CL",
              "description": "Cliente",
              "state": true
          },
          {
              "id": "PR",
              "description": "Proveedor",
              "state": true
          },
          {
              "id": "CP",
              "description": "Cliente-Proveedor",
              "state": true
          },
          {
              "id": "NI",
              "description": "Ninguna",
              "state": true
          }
      ]
  }*/
      await convertToUpperCasesData(result.applicantRelationship)

      return result.applicantRelationship;
    }
    catch (err) {
      console.error("api retrieveRoleCatalog: ", err)
    }
    return undefined;
  }


  //CC-486 ConsultarListaTipoVenta

  /**
   * 
   * OldName: retrieveSalesType
   * 
  */
  async retrieveSalesType() {
    try {

      var result = await this.get(url.URL_BACKEND_CATALOGO_ListaTipoVenta);

      /*{
      "status": {
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa"
      },
      "salesType": [
          {
              "id": "CON",
              "description": "Contado",
              "state": true
          },
          {
              "id": "CR",
              "description": "Credito",
              "state": true
          }
      ]
  }*/
      await convertToUpperCasesData(result.applicantRelationship)

      return result.applicantRelationship;
    }
    catch (err) {
      console.error("api retrieveRoleCatalog: ", err)
    }
    return undefined;
  }

  //CC-487 ConsultarListaTipoSeguro

  /**
   * 
   * OldName: retrieveInsuranceType
   * 
  */
  async retrieveInsuranceType() {
    try {

      var result = await this.get(url.URL_BACKEND_CATALOGO_ListaSeguros);

      /*{
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacción Exitosa"
    },
    "customerType": [
        {
            "id": "IN",
            "description": "Incendio",
            "state": true
        },
        {
            "id": "VI",
            "description": "Vida",
            "state": true
        },
        {
            "id": "AU",
            "description": "Auto",
            "state": true
        }
    ]
}*/
      await convertToUpperCasesData(result.customerType)

      return result.customerType;
    }
    catch (err) {
      console.error("api retrieveRoleCatalog: ", err)
    }
    return undefined;
  }


  //GARANTIA PIGNORACION
  async getPledge(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_PLEDGES + "?" + data);

      /*{
    "pledges": [
        {
            "transactId": 1,
            "facilityId": 61,
            "guaranteeId": 67,
            "guaranteeNumber": "fake_data",
            "attachedNumber": "fake_data",
            "loanNumber": "fake_data",
            "currency": "fake_data",
            "customerNumber": "fake_data",
            "guaranteeAmount": 68.21,
            "guaranteeType": "fake_data",
            "bank": "fake_data",
            "agency": "fake_data",
            "accountNumber": "fake_data",
            "dueDate": "2023-03-16",
            "status": true
        },
        {
            "transactId": 1,
            "facilityId": 61,
            "guaranteeId": 67,
            "guaranteeNumber": "fake_data",
            "attachedNumber": "fake_data",
            "loanNumber": "fake_data",
            "currency": "fake_data",
            "customerNumber": "fake_data",
            "guaranteeAmount": 68.21,
            "guaranteeType": "fake_data",
            "bank": "fake_data",
            "agency": "fake_data",
            "accountNumber": "fake_data",
            "dueDate": "2023-03-16",
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
  }*/

      return result.pledges;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async savePledge(data) {
    try {

      /*{
  "transactId": 1,
  "facilityId": 61,
  "guaranteeId": 67,
  "guaranteeNumber": "fake_data",
  "attachedNumber": "fake_data",
  "loanNumber": "fake_data",
  "currency": "fake_data",
  "customerNumber": "fake_data",
  "guaranteeAmount": 68.21,
  "guaranteeType": "fake_data",
  "bank": "fake_data",
  "agency": "fake_data",
  "accountNumber": "fake_data",
  "dueDate": "2023-03-16"
  }*/

      var result = await this.post(url.URL_BACKEND_PLEDGES, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error(err);
    }
    return undefined;
  }
  async updatePledge(data) {
    try {

      /*{
  "transactId": 1,
  "facilityId": 61,
  "guaranteeId": 67,
  "guaranteeNumber": "fake_data",
  "attachedNumber": "fake_data",
  "loanNumber": "fake_data",
  "currency": "fake_data",
  "customerNumber": "fake_data",
  "guaranteeAmount": 68.21,
  "guaranteeType": "fake_data",
  "bank": "fake_data",
  "agency": "fake_data",
  "accountNumber": "fake_data",
  "dueDate": "2023-03-16",
  "status": true
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_PLEDGES, data);//saveProposalData
      if (result.statusCode === "500") {
        result = await this.post(url.URL_BACKEND_PLEDGES, data);//saveProposalData
      }
      return result;
    }
    catch (err) {
      console.error(err);
    }
    return undefined;
  }
  async deletePledge(transactId, facilityId, guaranteeId) {
    try {
      var data = { transactId: transactId, facilityId: facilityId, guaranteeId: guaranteeId };
      var result = await this.del(url.URL_BACKEND_PLEDGES + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }

  //GARANTIA Equipos Usados y Nuevos
  async getGuaranteeUsedNewEquipments(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_GuaranteeUsedNewEquipments + "?" + data);

      /*{
  "usedNewEquipments": [
    {
      "transactId": 1,
      "facilityId": 1,
      "guaranteeId": 1,
      "guaranteeNumber": null,
      "attachedNumber": null,
      "loanNumber": null,
      "currency": null,
      "customerNumber": null,
      "guaranteeAmount": null,
      "guaranteeType": null,
      "bank": null,
      "agency": null,
      "assetCode": null,
      "dueDate": null,
      "trust": null,
      "trustDate": null,
      "equipmentType": null,
      "engine": null,
      "serie": null,
      "model": null,
      "year": null,
      "status": true
    }
  ],
  "status": {
    "statusCode": "200",
    "statusDesc": "Transacciï¿½n Exitosa"
  }
  }*/

      return result.usedNewEquipments;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async saveGuaranteeUsedNewEquipments(data) {
    try {

      /*{
  "transactId": 1,
  "facilityId": 20,
  "guaranteeId": 17,
  "guaranteeNumber": "fake_data",
  "attachedNumber": "fake_data",
  "loanNumber": "fake_data",
  "currency": "fake_data",
  "customerNumber": "fake_data",
  "guaranteeAmount": 25.63,
  "guaranteeType": "fake_data",
  "bank": "fake_data",
  "agency": "fake_data",
  "assetCode": "fake_data",
  "dueDate": "2019-04-15",
  "trust": "fake_data",
  "trustDate": "2028-05-01",
  "equipmentType": "fake_data",
  "engine": "fake_data",
  "serie": "fake_data",
  "model": "fake_data",
  "year": 88
  }*/

      var result = await this.post(url.URL_BACKEND_GuaranteeUsedNewEquipments, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error(err);
    }
    return undefined;
  }
  async updateGuaranteeUsedNewEquipments(data) {
    try {

      /*{
  "transactId": 78,
  "facilityId": 20,
  "guaranteeId": 17,
  "guaranteeNumber": "fake_data",
  "attachedNumber": "fake_data",
  "loanNumber": "fake_data",
  "currency": "fake_data",
  "customerNumber": "fake_data",
  "guaranteeAmount": 25.63,
  "guaranteeType": "fake_data",
  "bank": "fake_data",
  "agency": "fake_data",
  "assetCode": "fake_data",
  "dueDate": "2019-04-15",
  "trust": "fake_data",
  "trustDate": "2028-05-01",
  "equipmentType": "fake_data",
  "engine": "fake_data",
  "serie": "fake_data",
  "model": "fake_data",
  "year": 88,
  "status": true
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_GuaranteeUsedNewEquipments, data);//saveProposalData
      if (result.statusCode === "500") {
        result = await this.post(url.URL_BACKEND_GuaranteeUsedNewEquipments, data);//saveProposalData
      }
      return result;
    }
    catch (err) {
      console.error(err);
    }
    return undefined;
  }
  async deleteGuaranteeUsedNewEquipments(transactId, facilityId, guaranteeId) {
    try {
      var data = { transactId: transactId, facilityId: facilityId, guaranteeId: guaranteeId };
      var result = await this.del(url.URL_BACKEND_GuaranteeUsedNewEquipments + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }

  //GARANTIA BIEN MUEBLES
  async getGuaranteeMoveableAsset(transactId) {
    try {
      var params = { requestId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_GuaranteeMoveableAsset + "?" + data);

      /*{
    "data": [
        {
            "transactId": 1,
            "facilityId": 1,
            "guaranteeId": 1,
            "guaranteeNumber": "1",
            "creditId": "1",
            "disbursementNumber": "1",
            "currency": "1",
            "customerNumber": "1",
            "assignAmount": 1,
            "guaranteedAmount": 1,
            "initialValue": 1,
            "guaranteeType": "1",
            "assetCode": "1",
            "guaranteeCurrency": "1",
            "bank": "1",
            "agency": "1",
            "brand": "1",
            "model": "1",
            "year": 1,
            "color": "1",
            "classString": "1",
            "licensePlate": "1",
            "serial": "1",
            "engineSerial": "1",
            "assetOwner": "1",
            "trust": "1",
            "broadcastDate": "1970-01-20",
            "issuingEntity": "1",
            "appraiser": "1",
            "valuedReference": "1",
            "valuedAmount": "1",
            "appraisalDate": "1970-01-20",
            "appraisalVDate": "1970-01-20",
            "observations": "1",
            "status": true
        },
        {
            "transactId": 1,
            "facilityId": 1,
            "guaranteeId": 1,
            "guaranteeNumber": "2",
            "creditId": "1",
            "disbursementNumber": "1",
            "currency": "1",
            "customerNumber": "1",
            "assignAmount": 1,
            "guaranteedAmount": 1,
            "initialValue": 1,
            "guaranteeType": "1",
            "assetCode": "1",
            "guaranteeCurrency": "1",
            "bank": "1",
            "agency": "1",
            "brand": "1",
            "model": "1",
            "year": 1,
            "color": "1",
            "classString": "1",
            "licensePlate": "1",
            "serial": "1",
            "engineSerial": "1",
            "assetOwner": "1",
            "trust": "1",
            "broadcastDate": "1970-01-20",
            "issuingEntity": "1",
            "appraiser": "1",
            "valuedReference": "1",
            "valuedAmount": "1",
            "appraisalDate": "1970-01-20",
            "appraisalVDate": "1970-01-20",
            "observations": "1",
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacción Exitosa"
    }
  }*/

      return result.data;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async saveGuaranteeMoveableAsset(data) {
    try {

      /*{
    "transactId":1,
    "facilityId":1,
    "guaranteeId":1,
    "guaranteeNumber":"3",
    "creditId":"1",
    "disbursementNumber":"1",
    "currency":"1",
    "customerNumber":"1",
   "assignAmount":1,
   "guaranteedAmount":1,
   "initialValue":1,
    "guaranteeType":"1",
    "assetCode":"1",
    "guaranteeCurrency":"1",
    "bank":"1",
    "agency":"1",
    "brand":"1",
    "model":"1",
    "year":1,
    "color":"1",
    "classString":"1",
    "licensePlate":"1",
    "serial":"1",
    "engineSerial":"1",
    "assetOwner":"1",
    "trust":"1",
    "broadcastDate":1646875298,
    "issuingEntity":"1",
    "appraiser":"1",
    "valuedReference":"1",
    "valuedAmount":"1",
    "appraisalDate":1646875298,
    "appraisalVDate":1646875298,
    "observations":"1"
  }*/

      var result = await this.post(url.URL_BACKEND_GuaranteeMoveableAsset, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error(err);
    }
    return undefined;
  }
  async updateGuaranteeMoveableAsset(data) {
    try {

      /*{
      "transactId":1,
    "facilityId":1,
    "guaranteeId":1,
    "guaranteeNumber":"1",
    "creditId":"1",
    "disbursementNumber":"1",
    "currency":"1",
    "customerNumber":"1",
   "assignAmount":1,
   "guaranteedAmount":1,
   "initialValue":1,
    "guaranteeType":"1",
    "assetCode":"1",
    "guaranteeCurrency":"1",
    "bank":"1",
    "agency":"1",
    "brand":"1",
    "model":"1",
    "year":1,
    "color":"1",
    "classString":"1",
    "licensePlate":"1",
    "serial":"1",
    "engineSerial":"1",
    "assetOwner":"1",
    "trust":"1",
    "broadcastDate":1646918016,
    "issuingEntity":"1",
    "appraiser":"1",
    "valuedReference":"1",
    "valuedAmount":"1",
    "appraisalDate":1646918016,
    "appraisalVDate":1646918016,
    "observations":"1",
    "status":true
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_GuaranteeMoveableAsset, data);//saveProposalData
      if (result.statusCode === "500") {
        result = await this.post(url.URL_BACKEND_GuaranteeMoveableAsset, data);//saveProposalData
      }
      return result;
    }
    catch (err) {
      console.error(err);
    }
    return undefined;
  }
  async deleteGuaranteeMoveableAsset(transactId, facilityId, guaranteeId) {
    try {
      var data = { requestId: transactId, facilityId: facilityId, guaranteeId: guaranteeId };
      var result = await this.del(url.URL_BACKEND_GuaranteeMoveableAsset + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }

  //GARANTIA OTRAS
  async getOtherGuarantees(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_OtherGuarantees + "?" + data);

      /*{
      "otherGuarantees": [
          {
              "transactId": 1,
              "facilityId": 1,
              "guaranteeId": 1,
              "guaranteeNumber": "NUMERO GARANTIA",
              "attachedNumber": "3",
              "loanNumber": "NRO PRESTAMO",
              "currency": "DOLARES",
              "customerNumber": "3",
              "asignedAmount": 400.000,
              "guaranteedType": 400.000,
              "initialValue": 400.000,
              "guaranteeType": "GARANTIA",
              "ownerAsset": "CODIGO",
              "guaranteeCurrency": "DOLARES",
              "bank": "BANCO DE PANAMA",
              "agency": "AGENCIA PENDIENTE",
              "instrumentType": "TIPO INSTRUMENTO",
              "documentId": "3",
              "trustNumber": "3",
              "issuedDate": "2022-03-09",
              "guaranteeIdd": "3",
              "guarantorName": "NOMBRE FIADOR",
              "entityName": "ENTIDAD",
              "organismCode": "ORGANISMO",
              "issuedCountry": "CIUDAD DE PANAMA",
              "updateDate": "2022-03-09",
              "status": true
          }
      ],
      "status": {
          "statusCode": "200",
          "statusDesc": "Transacciï¿½n Exitosa"
      }
  }*/

      return result.otherGuarantees;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async saveOtherGuarantees(data) {
    try {

      /*{
  "transactId":3,
  "facilityId":3,
  "guaranteeId":3,
  "guaranteeNumber":"GARANTIA",
  "attachedNumber":"1",
  "loanNumber":"PRESTAMO",
  "currency":"DOLAR",
  "customerNumber":"1",
  "asignedAmount":350.000,
  "guaranteedType":350.000,
  "initialValue":350.000,
  "guaranteeType":"TIPO GARANTIA",
  "ownerAsset":"CODIGO BIEN",
  "guaranteeCurrency":"DOLAR",
  "bank":"BANCO PANAMA",
  "agency":"AGENCIA",
  "instrumentType":"INSTRUMENTO",
  "documentId":"1",
  "trustNumber":"1",
  "issuedDate":"2022-03-10",
  "guaranteeIdd":"1",
  "guarantorName":"",
  "entityName":"FIADOR",
  "organismCode":"ENTIDAD FINANCIERA",
  "issuedCountry":"CODIGO ORGANISMO",
  "updateDate":"2022-03-10"
  }*/

      var result = await this.post(url.URL_BACKEND_OtherGuarantees, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error(err);
    }
    return undefined;
  }
  async updateOtherGuarantees(data) {
    try {

      /*{
  "transactId":3,
  "facilityId":3,
  "guaranteeId":3,
  "guaranteeNumber":"NUMERO GARANTIA",
  "attachedNumber":"3",
  "loanNumber":"NRO PRESTAMO",
  "currency":"DOLARES",
  "customerNumber":"3",
  "asignedAmount":400.000,
  "guaranteedType":400.000,
  "initialValue":400.000,
  "guaranteeType":"GARANTIA",
  "ownerAsset":"CODIGO",
  "guaranteeCurrency":"DOLARES",
  "bank":"BANCO DE PANAMA",
  "agency":"AGENCIA PENDIENTE",
  "instrumentType":"TIPO INSTRUMENTO",
  "documentId":"3",
  "trustNumber":"3",
  "issuedDate":"2022-03-10",
  "guaranteeIdd":"3",
  "guarantorName":"NOMBRE FIADOR",
  "entityName":"ENTIDAD",
  "organismCode":"ORGANISMO",
  "issuedCountry":"CIUDAD DE PANAMA",
  "updateDate":"2022-03-10",
  "status":true
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_OtherGuarantees, data);//saveProposalData
      if (result.statusCode === "500") {
        result = await this.post(url.URL_BACKEND_OtherGuarantees, data);//saveProposalData
      }
      return result;
    }
    catch (err) {
      console.error(err);
    }
    return undefined;
  }
  async deleteOtherGuarantees(transactId, facilityId, guaranteeId) {
    try {
      var data = { transactId: transactId, facilityId: facilityId, guaranteeId: guaranteeId };
      var result = await this.del(url.URL_BACKEND_OtherGuarantees + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }

  //POLIZA DE LA GARANTIA
  async getGuaranteePolicy(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_GUARANTEEPOLICY + "?" + data);

      /*{
    "guaranteePolicy": [
        {
            "transactId": 1,
            "facilityId": 1,
            "guaranteeId": 1,
            "guaranteeType": "TIPO GARANTIA",
            "policyId": 1,
            "insuredName": "NOMBRE ASEGURADO",
            "amount": 350.000,
            "company": "COMPANIA",
            "policyNumber": "POLIZA",
            "policyType": "TIPO POLIZA",
            "companyCode": "CODIGO COMPANIA",
            "issuedDate": "2022-03-08",
            "dueDate": "2022-03-08",
            "status": true
        },
        {
            "transactId": 1,
            "facilityId": 1,
            "guaranteeId": 1,
            "guaranteeType": "TIPO GARANTIA",
            "policyId": 2,
            "insuredName": "NOMBRE ASEGURADO",
            "amount": 350.000,
            "company": "COMPANIA",
            "policyNumber": "POLIZA",
            "policyType": "TIPO POLIZA",
            "companyCode": "CODIGO COMPANIA",
            "issuedDate": "2022-03-08",
            "dueDate": "2022-03-08",
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
  }*/

      return result.guaranteePolicy;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async saveGuaranteePolicy(data) {
    try {

      /*{
  "transactId":1,
  "facilityId":1,
  "guaranteeId":1,
  "guaranteeType":"TIPO GARANTIA",
  "insuredName":"NOMBRE ASEGURADO",
  "amount":350.000,
  "company":"COMPANIA",
  "policyNumber":"POLIZA",
  "policyType":"TIPO POLIZA",
  "companyCode":"CODIGO COMPANIA",
  "issuedDate":"2022-03-09",
  "dueDate":"2022-03-09"
  }*/

      var result = await this.post(url.URL_BACKEND_GUARANTEEPOLICY, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error(err);
    }
    return undefined;
  }
  async updateGuaranteePolicy(data) {
    try {

      /*{
  "transactId":2,
  "facilityId":2,
  "guaranteeId":2,
  "guaranteeType":"GARANTIA",
  "policyId":2,
  "insuredName":"ASEGURADO",
  "amount":300.000,
  "company":"EMPRESA",
  "policyNumber":"POLIZA SEGUROS",
  "policyType":"POLIZA",
  "companyCode":"COMPANIA",
  "issuedDate":"2022-03-07",
  "dueDate":"2022-03-07",
  "status":true
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_GUARANTEEPOLICY, data);//saveProposalData
      if (result.statusCode === "500") {
        result = await this.post(url.URL_BACKEND_GUARANTEEPOLICY, data);//saveProposalData
      }
      return result;
    }
    catch (err) {
      console.error(err);
    }
    return undefined;
  }
  async deleteGuaranteePolicy(transactId, facilityId, guaranteeId, policyId) {
    try {
      var data = { transactId: transactId, facilityId: facilityId, guaranteeId: guaranteeId, policyId: policyId };
      var result = await this.del(url.URL_BACKEND_GUARANTEEPOLICY + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }

  //LINEAS DE CREDITO
  async getCreditLine(transactId) {
    try {
      var params = { transactId: transactId, lineId: '' }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_CREDITLINE + "?" + data);

      /*{
    "creditLine": [
        {
            "transactId": 1,
            "lineId": "LIN5",
            "currency": "cjhar",
            "riskCountry": "char",
            "province": "char",
            "proposalDate": "2022-03-04",
            "approvalDate": "2022-03-04",
            "revisionFrequency": "char",
            "dueDate": "2022-03-04",
            "limitDate": "2022-03-04",
            "amount": 25,
            "maxTotal": 151,
            "modifiedAmount": 154,
            "additionalInfo": "asd",
            "economicActivity": "asd",
            "accounts": "asd",
            "autonomy": "hola",
            "status": true
        },
        {
            "transactId": 1,
            "lineId": "LIN6",
            "currency": "cjhar",
            "riskCountry": "char",
            "province": "char",
            "proposalDate": "2022-03-04",
            "approvalDate": "2022-03-04",
            "revisionFrequency": "char",
            "dueDate": "2022-03-04",
            "limitDate": "2022-03-04",
            "amount": 25,
            "maxTotal": 151,
            "modifiedAmount": 154,
            "additionalInfo": "asd",
            "economicActivity": "asd",
            "accounts": "asd",
            "autonomy": "hola",
            "status": true
        },
        {
            "transactId": 1,
            "lineId": "LIN -7",
            "currency": "cjhar",
            "riskCountry": "char",
            "province": "char",
            "proposalDate": "2022-03-04",
            "approvalDate": "2022-03-04",
            "revisionFrequency": "char",
            "dueDate": "2022-03-04",
            "limitDate": "2022-03-04",
            "amount": 25,
            "maxTotal": 151,
            "modifiedAmount": 154,
            "additionalInfo": "asd",
            "economicActivity": "asd",
            "accounts": "asd",
            "autonomy": "hola",
            "status": true
        },
        {
            "transactId": 1,
            "lineId": "LIN -8",
            "currency": "DOLAR",
            "riskCountry": "PANAMA",
            "province": "PANAMA",
            "proposalDate": "2022-03-07",
            "approvalDate": "2022-03-07",
            "revisionFrequency": "FRECUENCIA REVISION",
            "dueDate": "2022-03-07",
            "limitDate": "2022-03-07",
            "amount": 350.000,
            "maxTotal": 350.000,
            "modifiedAmount": 350.000,
            "additionalInfo": "INFORMACION ADICIONAL",
            "economicActivity": "ACTIVIDAD ECONOMICA",
            "accounts": "CONTABLE",
            "autonomy": "AUTONOMIA",
            "status": true
        },
        {
            "transactId": 1,
            "lineId": "LIN -9",
            "currency": "DOLAR",
            "riskCountry": "PANAMA",
            "province": "PANAMA",
            "proposalDate": "2022-03-07",
            "approvalDate": "2022-03-07",
            "revisionFrequency": "FRECUENCIA REVISION",
            "dueDate": "2022-03-07",
            "limitDate": "2022-03-07",
            "amount": 350.000,
            "maxTotal": 350.000,
            "modifiedAmount": 350.000,
            "additionalInfo": "INFORMACION ADICIONAL",
            "economicActivity": "ACTIVIDAD ECONOMICA",
            "accounts": "CONTABLE",
            "autonomy": "AUTONOMIA",
            "status": true
        },
        {
            "transactId": 1,
            "lineId": "LIN -11",
            "currency": "DOLAR",
            "riskCountry": "PANAMA",
            "province": "PANAMA",
            "proposalDate": "2022-03-07",
            "approvalDate": "2022-03-07",
            "revisionFrequency": "FRECUENCIA REVISION",
            "dueDate": "2022-03-07",
            "limitDate": "2022-03-07",
            "amount": 350.000,
            "maxTotal": 350.000,
            "modifiedAmount": 350.000,
            "additionalInfo": "INFORMACION ADICIONAL",
            "economicActivity": "ACTIVIDAD ECONOMICA",
            "accounts": "CONTABLE",
            "autonomy": "AUTONOMIA",
            "status": true
        },
        {
            "transactId": 1,
            "lineId": "LIN -12",
            "currency": "DOLAR",
            "riskCountry": "PANAMA",
            "province": "PANAMA",
            "proposalDate": "2022-03-07",
            "approvalDate": "2022-03-07",
            "revisionFrequency": "FRECUENCIA REVISION",
            "dueDate": "2022-03-07",
            "limitDate": "2022-03-07",
            "amount": 350.000,
            "maxTotal": 350.000,
            "modifiedAmount": 350.000,
            "additionalInfo": "INFORMACION ADICIONAL",
            "economicActivity": "ACTIVIDAD ECONOMICA",
            "accounts": "CONTABLE",
            "autonomy": "AUTONOMIA",
            "status": true
        },
        {
            "transactId": 1,
            "lineId": "AA",
            "currency": "DOLAR",
            "riskCountry": "PANAMA",
            "province": "PANAMA",
            "proposalDate": "2022-03-07",
            "approvalDate": "2022-03-07",
            "revisionFrequency": "FRECUENCIA REVISION",
            "dueDate": "2022-03-07",
            "limitDate": "2022-03-07",
            "amount": 350.000,
            "maxTotal": 350.000,
            "modifiedAmount": 350.000,
            "additionalInfo": "INFORMACION ADICIONAL",
            "economicActivity": "ACTIVIDAD ECONOMICA",
            "accounts": "CONTABLE",
            "autonomy": "AUTONOMIA",
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
  }*/

      return result.creditLine;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  // guardar o crear Linea 
  // async saveCreditLine(data) {
  //   try {

  //     /*{
  // "transactId":1,
  // "lineId":"AA",
  // "currency":"DOLAR",
  // "riskCountry":"PANAMA",
  // "province":"PANAMA",
  // "proposalDate":"2022-03-08",
  // "approvalDate":"2022-03-08",
  // "revisionFrequency":"FRECUENCIA REVISION",
  // "dueDate":"2022-03-08",
  // "limitDate":"2022-03-08",
  // "amount":350.000,
  // "maxTotal":350.000,
  // "modifiedAmount":350.000,
  // "additionalInfo":"INFORMACION ADICIONAL",
  // "economicActivity":"ACTIVIDAD ECONOMICA",
  // "accounts":"CONTABLE",
  // "autonomy":"AUTONOMIA"
  // }*/

  //     var result = await this.post(url.URL_BACKEND_CREDITLINE, data);//saveProposalData

  //     return result;
  //   }
  //   catch (err) {
  //     console.error(err);
  //   }
  //   return undefined;
  // }
  //Mantenimiento de linea
  async updateCreditLine(data) {
    try {

      /*{
  "transactId":2,
  "lineId":"LIN -2",
  "revisionFrequency":"FRECUENCIA REVISION",
  "dueDate":"2022-03-09",
  "limitDate":"2022-03-09",
  "amount":450.000,
  "maxTotal":450.000,
  "modifiedAmount":450.000,
  "status":true
  }
      */
      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_CREDITLINE, data);//saveProposalData
      if (result.statusCode === "500") {
        result = await this.post(url.URL_BACKEND_CREDITLINE, data);//saveProposalData
      }
      return result;
    }
    catch (err) {
      console.error(err);
    }
    return undefined;
  }
  async deleteCreditLine(transactId, lineId) {
    try {
      var data = { transactId: transactId, lineId: lineId };
      var result = await this.del(url.URL_BACKEND_CREDITLINE + "?" + qs.stringify(data));

      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }


  //DOCUMENTOS ANEXOS
  async saveAttachmentDocument(data) {
    try {
      /*{
      "transactId": 42,
      "personId": 22,
      "fileName": "fake_data",
      "fileDescription": "fake_data",
      "onBaseIdentification": "fake_data",
      "processId": 30,
      "activityId": 37
      } */
      var result = await this.post(url.URL_BACKEND_DOCUMENTS, data);
      if (result.status.statusCode === "500") {
        data["status"] = true;
        result = await this.put(url.URL_BACKEND_DOCUMENTS, data);
      }
      return true;
    }
    catch (err) { console.error(err); }

    return false;
  }
  async deleteAttachmentDocument(transactId, onBaseIdentification) {
    try {
      var data = { transactId, onBaseIdentification };
      var result = await this.del(url.URL_BACKEND_DOCUMENTS + "?" + qs.stringify(data));

      return true;
    }
    catch (err) {
      console.error(err)
    }
    return false;
  }
  async getAttachmentDocument(transactId, processId, activityId) {
    try {
      var params = { transactId: transactId, processId: processId, activityId: activityId }
      var result = await this.get(url.URL_BACKEND_DOCUMENTSANEXOSAll + "?" + qs.stringify(params));
      /*
      {
    "attachments": [
        {
            "transactId": 1,
            "personId": 1,
            "documentIdentification": 5,
            "fileName": "fake_data",
            "fileDescription": "fake_data",
            "onBaseIdentification": "fake_data",
            "processId": 30,
            "activityId": 37,
            "date": "2022-03-14",
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacción Exitosa"
    }
}
      */
      return result.attachments;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async getAttachmentDocumentByPerson(attachmentFileInputModel) {
    try {

      var data = [];
      var result = await this.getAttachmentDocument(attachmentFileInputModel.transactId, attachmentFileInputModel.processId, attachmentFileInputModel.activityId);

      if (attachmentFileInputModel.personId > 0) {
        result.map(async function (attachment, i) {
          if (attachment.personId === attachmentFileInputModel.personId) {
            data.push(attachment);
          }
        })
      }
      else {
        return result;
      }
      return data;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }


  //INSTRUCTIVO DE DESEMBOLSO
  async getDisbursementInstructive(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_DisbursementInstructiveByFacility + "?" + data);

      /*{
    "disbursementInstructiveFacility": [
        {
            "transactId": 1,
            "facilityId": 32,
            "facilityNumber": "fake_data",
            "facilityTypeCode": "fake_data",
            "facilityTypeDesc": "fake_data",
            "proposalTypeCode": "fake_data",
            "proposalTypeDesc": "fake_data",
            "masterLineNumber": "fake_data",
            "disbursementInstructionNumber": "ID2",
            "disbursementDate": "2028-05-29",
            "clientNumber": "fake_data",
            "clientName": "fake_data",
            "loandTypeCode": "fake_data",
            "loandTypeDesc": "fake_data",
            "branchCode": "fake_data",
            "branchDesc": "fake_data",
            "saleChannel": "fake_data",
            "disbursementFinalDestinyFreeZone": false,
            "disbursementApprovedAmount": 93.99,
            "advancement": false,
            "advancementAmount": 34.06,
            "productTypeCode": "fake_data",
            "productTypeDesc": "fake_data",
            "subProductTypeCode": "fake_data",
            "subProductTypeDesc": "fake_data",
            "disbursementComisionDesc": "fake_data",
            "disbursementComisionAmount": 52.51,
            "disbursementItbms": 35.00,
            "differ": true,
            "pawn": false,
            "dpfSavingsCheckingAccount": "fake_data",
            "an": "fake_data",
            "pledgeAmount": 13.99,
            "indexRate": false,
            "dpfRate": 22.57,
            "spreadRate": 81.77,
            "totalRate": 29.81,
            "disbursementTerm": 51,
            "disbursementTermType": "fake_data",
            "debitAccountClientNumber": "fake_data",
            "interestRate": 62.09,
            "feci": true,
            "interestPaymentCycleCode": "fake_data",
            "interestPaymentCycleDesc": "fake_data",
            "capitalPaymentCycleCod": "fake_data",
            "capitalPaymentCycleDesc": "fake_data",
            "monthlyLetterIncludesIntsandFeci": false,
            "monthlyLetterAmount": 84.25,
            "fidBanescoCommissionAmount": 34.59,
            "itbmFidAmount": 99.98,
            "disbursementFormAccountNumber": "fake_data",
            "disbursementFormAccountName": "fake_data",
            "disbursementFormAccountAmount": 5.99,
            "disbursementFormCheckNumber": "fake_data",
            "disbursementFormCheckName": "fake_data",
            "disbursementFormCheckAmount": 15.94,
            "disbursementFormTransferNumber": "fake_data",
            "disbursementFormTransferName": "fake_data",
            "disbursementFormTransferAmount": 67.35,
            "disbursementFormOtherNumber": "fake_data",
            "disbursementFormOtherName": "fake_data",
            "disbursementFormOtherAmount": 76.97,
            "cppNumber": "fake_data",
            "cppBeneficiary": "fake_data",
            "cppAmount": 84.30,
            "countryCode": "fake_data",
            "countryDesc": "fake_data",
            "provinceCode": "fake_data",
            "provinceDesc": "fake_data",
            "economicActivityTypeCode": "fake_data",
            "economicActivityTypeDesc": "fake_data",
            "cinuActivityTypeCode": "fake_data",
            "cinuActivityTypeDesc": "fake_data",
            "disbursementDetailDescription": "fake_data",
            "bankEspecialInstructions": "fake_data",
            "adminNotaryFees": 68.77,
            "adminSealFees": 28.11,
            "adminAditionalComments": "fake_data",
            "operationalLeasNumber": "fake_data",
            "operationalDueDate": "2013-01-21",
            "operationalNextPaymentDate": "2019-01-16",
            "sourceSalesCod": "fake_data",
            "sourceSalesDesc": "fake_data",
            "creditDestination": "fake_data",
            "paymentMethod": "fake_data",
            "fundsDestination": "fake_data",
            "fundsPurposeCode": "fake_data",
            "checkNumber": "fake_data",
            "originationRef": "fake_data",
            "writingType": "fake_data",
            "billsCombined": false,
            "settlement": true,
            "autonomyCode": "fake_data",
            "autonomyUser": "fake_data",
            "subCategoryCode": "fake_data",
            "authType": "fake_data",
            "status": true
        },
        {
            "transactId": 1,
            "facilityId": 32,
            "facilityNumber": "fake_data",
            "facilityTypeCode": "fake_data",
            "facilityTypeDesc": "fake_data",
            "proposalTypeCode": "fake_data",
            "proposalTypeDesc": "fake_data",
            "masterLineNumber": "fake_data",
            "disbursementInstructionNumber": "ID1",
            "disbursementDate": "2028-05-29",
            "clientNumber": "fake_data",
            "clientName": "fake_data",
            "loandTypeCode": "fake_data",
            "loandTypeDesc": "fake_data",
            "branchCode": "fake_data",
            "branchDesc": "fake_data",
            "saleChannel": "fake_data",
            "disbursementFinalDestinyFreeZone": false,
            "disbursementApprovedAmount": 93.99,
            "advancement": false,
            "advancementAmount": 34.06,
            "productTypeCode": "fake_data",
            "productTypeDesc": "fake_data",
            "subProductTypeCode": "fake_data",
            "subProductTypeDesc": "fake_data",
            "disbursementComisionDesc": "fake_data",
            "disbursementComisionAmount": 52.51,
            "disbursementItbms": 35.00,
            "differ": true,
            "pawn": false,
            "dpfSavingsCheckingAccount": "fake_data",
            "an": "fake_data",
            "pledgeAmount": 13.99,
            "indexRate": false,
            "dpfRate": 22.57,
            "spreadRate": 81.77,
            "totalRate": 29.81,
            "disbursementTerm": 51,
            "disbursementTermType": "fake_data",
            "debitAccountClientNumber": "fake_data",
            "interestRate": 62.09,
            "feci": true,
            "interestPaymentCycleCode": "fake_data",
            "interestPaymentCycleDesc": "fake_data",
            "capitalPaymentCycleCod": "fake_data",
            "capitalPaymentCycleDesc": "fake_data",
            "monthlyLetterIncludesIntsandFeci": false,
            "monthlyLetterAmount": 84.25,
            "fidBanescoCommissionAmount": 34.59,
            "itbmFidAmount": 99.98,
            "disbursementFormAccountNumber": "fake_data",
            "disbursementFormAccountName": "fake_data",
            "disbursementFormAccountAmount": 5.99,
            "disbursementFormCheckNumber": "fake_data",
            "disbursementFormCheckName": "fake_data",
            "disbursementFormCheckAmount": 15.94,
            "disbursementFormTransferNumber": "fake_data",
            "disbursementFormTransferName": "fake_data",
            "disbursementFormTransferAmount": 67.35,
            "disbursementFormOtherNumber": "fake_data",
            "disbursementFormOtherName": "fake_data",
            "disbursementFormOtherAmount": 76.97,
            "cppNumber": "fake_data",
            "cppBeneficiary": "fake_data",
            "cppAmount": 84.30,
            "countryCode": "fake_data",
            "countryDesc": "fake_data",
            "provinceCode": "fake_data",
            "provinceDesc": "fake_data",
            "economicActivityTypeCode": "fake_data",
            "economicActivityTypeDesc": "fake_data",
            "cinuActivityTypeCode": "fake_data",
            "cinuActivityTypeDesc": "fake_data",
            "disbursementDetailDescription": "fake_data",
            "bankEspecialInstructions": "fake_data",
            "adminNotaryFees": 68.77,
            "adminSealFees": 28.11,
            "adminAditionalComments": "fake_data",
            "operationalLeasNumber": "fake_data",
            "operationalDueDate": "2013-01-21",
            "operationalNextPaymentDate": "2019-01-16",
            "sourceSalesCod": "fake_data",
            "sourceSalesDesc": "fake_data",
            "creditDestination": "fake_data",
            "paymentMethod": "fake_data",
            "fundsDestination": "fake_data",
            "fundsPurposeCode": "fake_data",
            "checkNumber": "fake_data",
            "originationRef": "fake_data",
            "writingType": "fake_data",
            "billsCombined": false,
            "settlement": true,
            "autonomyCode": "fake_data",
            "autonomyUser": "fake_data",
            "subCategoryCode": "fake_data",
            "authType": "fake_data",
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Succesful transaction"
    }
}*/

      return result.disbursementInstructiveFacility;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async getDisbursementInstructiveByFacility(transactId, facilityId) {
    try {

      var result = await this.getDisbursementInstructive(transactId);

      var data = [];
      result.map(async function (dt, i) {
        if (dt.facilityId === facilityId) {
          data.push(dt);
        }
      })

      return data[data.length - 1];

      /*{
    "disbursementInstructiveFacility": [
        {
            "transactId": 1,
            "facilityId": 1,
            "instructiveId": "ID1",
            "instructiveType": "vtipoistructivo character varying",
            "instructiveDate": "2022-03-10",
            "loan": "vnprestamo character varying",
            "customerT24": "vclientet24 character varying",
            "disbursementTransact": "vntramitedesembolso character varying",
            "product": "vproducto character varying",
            "subProduct": "vsubproducto character varying",
            "loanType": "vtipoprestamo character varying",
            "line": "vnlinea character varying",
            "masterLine": "vnlineamaster character varying",
            "masterCustomer": "0.8",
            "afiRequest": "0.8",
            "disbursementAmount": 0.8,
            "interestRate": 0.8,
            "indexedRate": true,
            "pdfRate": "vtasadpf character varying",
            "spread": "vspread character varying",
            "totalRate": 0.8,
            "dpnfbSaving": "vdpfnahorro character varying",
            "an": "van character varying",
            "feci": true,
            "branch": "vsucursal character varying",
            "disbursementPeriod": "vplazodesembolso character varying",
            "disbursementTerm": "vterminodesembolso character varying",
            "termType": "vtipotermino character varying",
            "debitAccount": "vncuentadebitar character varying",
            "toName": "vanombrede character varying",
            "monthlyLetterFeci": true,
            "amountLetter": 0.8,
            "commissionFid": 0.8,
            "itbmsFid": 0.8,
            "commissionFwla": 0.8,
            "itbmsFwla": 0.8,
            "amountTotalLetter": 0.8,
            "interestPaymentCycle": "vciclopagointeres character varying",
            "capitalPaymentCycle": "vciclopagocapital character varying",
            "nextPaymentDate": "2022-03-10",
            "destinyCountry": "vpaisdestino character varying",
            "province": "vprovincia character varying",
            "activityType": "vtipoactividad character varying",
            "cinuActivity": "vactividadcinu character varying",
            "dutyFree": true,
            "saleChannel": "vcanalventa character varying",
            "detail": "vdetalle text",
            "creditAccount": true,
            "checker": true,
            "transfer": true,
            "others": true,
            "creditAccountNumber": "vnuemrocuentacredito character varying",
            "accountName": "vnombrecuenta character varying",
            "creditAccountAmount": 0.9,
            "checkNumber": "vnrocheque character varying",
            "beneficiary": "vbeneficiario character varying",
            "checkAmount": 0.8,
            "transferenceNumber": "vnrotransferencia character varying",
            "transferenceBeneficiary": "vbeneficiariotransferencia character varying",
            "transferAmount": 0.8,
            "othersItem": "vitemotros character varying",
            "othersDescription": "vdescripcionotros character varying",
            "othersAmount": 0.5,
            "cppNumber": "vnrocpp character varying",
            "disbursementTotalAmount": 0.5,
            "specialInstructions": "vinstruccionesespeciales text",
            "invoiceIop": "viopfactura character varying",
            "checkIop": "viopchequep character varying",
            "accountNumberIop": "viopnrocuenta character varying",
            "commissionIop": "viopcomision character varying",
            "commissionAmountIop": 0.5,
            "itbmsIop": "viopitbm character varying",
            "toDifferIop": true,
            "pawnIop": true,
            "dpfSavingsIop": "viopdpfahorro character varying",
            "anIop": "viopan character varying",
            "pawnAmountIop": 0.5,
            "notaryIop": "viopnotaria character varying",
            "stampsIop": "vioptimbres character varying",
            "instructionsIop": "viopinstrucciones text",
            "status": true
        },
        {
            "transactId": 1,
            "facilityId": 1,
            "instructiveId": "IDID2",
            "instructiveType": "vtipoistructivo character varying",
            "instructiveDate": "2022-03-10",
            "loan": "vnprestamo character varying",
            "customerT24": "vclientet24 character varying",
            "disbursementTransact": "vntramitedesembolso character varying",
            "product": "vproducto character varying",
            "subProduct": "vsubproducto character varying",
            "loanType": "vtipoprestamo character varying",
            "line": "vnlinea character varying",
            "masterLine": "vnlineamaster character varying",
            "masterCustomer": "0.8",
            "afiRequest": "0.8",
            "disbursementAmount": 0.8,
            "interestRate": 0.8,
            "indexedRate": true,
            "pdfRate": "vtasadpf character varying",
            "spread": "vspread character varying",
            "totalRate": 0.8,
            "dpnfbSaving": "vdpfnahorro character varying",
            "an": "van character varying",
            "feci": true,
            "branch": "vsucursal character varying",
            "disbursementPeriod": "vplazodesembolso character varying",
            "disbursementTerm": "vterminodesembolso character varying",
            "termType": "vtipotermino character varying",
            "debitAccount": "vncuentadebitar character varying",
            "toName": "vanombrede character varying",
            "monthlyLetterFeci": true,
            "amountLetter": 0.8,
            "commissionFid": 0.8,
            "itbmsFid": 0.8,
            "commissionFwla": 0.8,
            "itbmsFwla": 0.8,
            "amountTotalLetter": 0.8,
            "interestPaymentCycle": "vciclopagointeres character varying",
            "capitalPaymentCycle": "vciclopagocapital character varying",
            "nextPaymentDate": "2022-03-10",
            "destinyCountry": "vpaisdestino character varying",
            "province": "vprovincia character varying",
            "activityType": "vtipoactividad character varying",
            "cinuActivity": "vactividadcinu character varying",
            "dutyFree": true,
            "saleChannel": "vcanalventa character varying",
            "detail": "vdetalle text",
            "creditAccount": true,
            "checker": true,
            "transfer": true,
            "others": true,
            "creditAccountNumber": "vnuemrocuentacredito character varying",
            "accountName": "vnombrecuenta character varying",
            "creditAccountAmount": 0.9,
            "checkNumber": "vnrocheque character varying",
            "beneficiary": "vbeneficiario character varying",
            "checkAmount": 0.8,
            "transferenceNumber": "vnrotransferencia character varying",
            "transferenceBeneficiary": "vbeneficiariotransferencia character varying",
            "transferAmount": 0.8,
            "othersItem": "vitemotros character varying",
            "othersDescription": "vdescripcionotros character varying",
            "othersAmount": 0.5,
            "cppNumber": "vnrocpp character varying",
            "disbursementTotalAmount": 0.5,
            "specialInstructions": "vinstruccionesespeciales text",
            "invoiceIop": "viopfactura character varying",
            "checkIop": "viopchequep character varying",
            "accountNumberIop": "viopnrocuenta character varying",
            "commissionIop": "viopcomision character varying",
            "commissionAmountIop": 0.5,
            "itbmsIop": "viopitbm character varying",
            "toDifferIop": true,
            "pawnIop": true,
            "dpfSavingsIop": "viopdpfahorro character varying",
            "anIop": "viopan character varying",
            "pawnAmountIop": 0.5,
            "notaryIop": "viopnotaria character varying",
            "stampsIop": "vioptimbres character varying",
            "instructionsIop": "viopinstrucciones text",
            "status": true
        },
        {
            "transactId": 1,
            "facilityId": 1,
            "instructiveId": "IDID3",
            "instructiveType": "vtipoistructivo character varying",
            "instructiveDate": "2022-03-10",
            "loan": "vnprestamo character varying",
            "customerT24": "vclientet24 character varying",
            "disbursementTransact": "vntramitedesembolso character varying",
            "product": "vproducto character varying",
            "subProduct": "vsubproducto character varying",
            "loanType": "vtipoprestamo character varying",
            "line": "vnlinea character varying",
            "masterLine": "vnlineamaster character varying",
            "masterCustomer": "0.8",
            "afiRequest": "0.8",
            "disbursementAmount": 0.8,
            "interestRate": 0.8,
            "indexedRate": true,
            "pdfRate": "vtasadpf character varying",
            "spread": "vspread character varying",
            "totalRate": 0.8,
            "dpnfbSaving": "vdpfnahorro character varying",
            "an": "van character varying",
            "feci": true,
            "branch": "vsucursal character varying",
            "disbursementPeriod": "vplazodesembolso character varying",
            "disbursementTerm": "vterminodesembolso character varying",
            "termType": "vtipotermino character varying",
            "debitAccount": "vncuentadebitar character varying",
            "toName": "vanombrede character varying",
            "monthlyLetterFeci": true,
            "amountLetter": 0.8,
            "commissionFid": 0.8,
            "itbmsFid": 0.8,
            "commissionFwla": 0.8,
            "itbmsFwla": 0.8,
            "amountTotalLetter": 0.8,
            "interestPaymentCycle": "vciclopagointeres character varying",
            "capitalPaymentCycle": "vciclopagocapital character varying",
            "nextPaymentDate": "2022-03-10",
            "destinyCountry": "vpaisdestino character varying",
            "province": "vprovincia character varying",
            "activityType": "vtipoactividad character varying",
            "cinuActivity": "vactividadcinu character varying",
            "dutyFree": true,
            "saleChannel": "vcanalventa character varying",
            "detail": "vdetalle text",
            "creditAccount": true,
            "checker": true,
            "transfer": true,
            "others": true,
            "creditAccountNumber": "vnuemrocuentacredito character varying",
            "accountName": "vnombrecuenta character varying",
            "creditAccountAmount": 0.9,
            "checkNumber": "vnrocheque character varying",
            "beneficiary": "vbeneficiario character varying",
            "checkAmount": 0.8,
            "transferenceNumber": "vnrotransferencia character varying",
            "transferenceBeneficiary": "vbeneficiariotransferencia character varying",
            "transferAmount": 0.8,
            "othersItem": "vitemotros character varying",
            "othersDescription": "vdescripcionotros character varying",
            "othersAmount": 0.5,
            "cppNumber": "vnrocpp character varying",
            "disbursementTotalAmount": 0.5,
            "specialInstructions": "vinstruccionesespeciales text",
            "invoiceIop": "viopfactura character varying",
            "checkIop": "viopchequep character varying",
            "accountNumberIop": "viopnrocuenta character varying",
            "commissionIop": "viopcomision character varying",
            "commissionAmountIop": 0.5,
            "itbmsIop": "viopitbm character varying",
            "toDifferIop": true,
            "pawnIop": true,
            "dpfSavingsIop": "viopdpfahorro character varying",
            "anIop": "viopan character varying",
            "pawnAmountIop": 0.5,
            "notaryIop": "viopnotaria character varying",
            "stampsIop": "vioptimbres character varying",
            "instructionsIop": "viopinstrucciones text",
            "status": true
        },
        {
            "transactId": 1,
            "facilityId": 1,
            "instructiveId": "ID4",
            "instructiveType": "vtipoistructivo character varying",
            "instructiveDate": "2022-03-10",
            "loan": "vnprestamo character varying",
            "customerT24": "vclientet24 character varying",
            "disbursementTransact": "vntramitedesembolso character varying",
            "product": "vproducto character varying",
            "subProduct": "vsubproducto character varying",
            "loanType": "vtipoprestamo character varying",
            "line": "vnlinea character varying",
            "masterLine": "vnlineamaster character varying",
            "masterCustomer": "0.8",
            "afiRequest": "0.8",
            "disbursementAmount": 0.8,
            "interestRate": 0.8,
            "indexedRate": true,
            "pdfRate": "vtasadpf character varying",
            "spread": "vspread character varying",
            "totalRate": 0.8,
            "dpnfbSaving": "vdpfnahorro character varying",
            "an": "van character varying",
            "feci": true,
            "branch": "vsucursal character varying",
            "disbursementPeriod": "vplazodesembolso character varying",
            "disbursementTerm": "vterminodesembolso character varying",
            "termType": "vtipotermino character varying",
            "debitAccount": "vncuentadebitar character varying",
            "toName": "vanombrede character varying",
            "monthlyLetterFeci": true,
            "amountLetter": 0.8,
            "commissionFid": 0.8,
            "itbmsFid": 0.8,
            "commissionFwla": 0.8,
            "itbmsFwla": 0.8,
            "amountTotalLetter": 0.8,
            "interestPaymentCycle": "vciclopagointeres character varying",
            "capitalPaymentCycle": "vciclopagocapital character varying",
            "nextPaymentDate": "2022-03-10",
            "destinyCountry": "vpaisdestino character varying",
            "province": "vprovincia character varying",
            "activityType": "vtipoactividad character varying",
            "cinuActivity": "vactividadcinu character varying",
            "dutyFree": true,
            "saleChannel": "vcanalventa character varying",
            "detail": "vdetalle text",
            "creditAccount": true,
            "checker": true,
            "transfer": true,
            "others": true,
            "creditAccountNumber": "vnuemrocuentacredito character varying",
            "accountName": "vnombrecuenta character varying",
            "creditAccountAmount": 0.9,
            "checkNumber": "vnrocheque character varying",
            "beneficiary": "vbeneficiario character varying",
            "checkAmount": 0.8,
            "transferenceNumber": "vnrotransferencia character varying",
            "transferenceBeneficiary": "vbeneficiariotransferencia character varying",
            "transferAmount": 0.8,
            "othersItem": "vitemotros character varying",
            "othersDescription": "vdescripcionotros character varying",
            "othersAmount": 0.5,
            "cppNumber": "vnrocpp character varying",
            "disbursementTotalAmount": 0.5,
            "specialInstructions": "vinstruccionesespeciales text",
            "invoiceIop": "viopfactura character varying",
            "checkIop": "viopchequep character varying",
            "accountNumberIop": "viopnrocuenta character varying",
            "commissionIop": "viopcomision character varying",
            "commissionAmountIop": 0.5,
            "itbmsIop": "viopitbm character varying",
            "toDifferIop": true,
            "pawnIop": true,
            "dpfSavingsIop": "viopdpfahorro character varying",
            "anIop": "viopan character varying",
            "pawnAmountIop": 0.5,
            "notaryIop": "viopnotaria character varying",
            "stampsIop": "vioptimbres character varying",
            "instructionsIop": "viopinstrucciones text",
            "status": true
        },
        {
            "transactId": 1,
            "facilityId": 55,
            "instructiveId": "ID5",
            "instructiveType": "fake_data",
            "instructiveDate": "2026-09-08",
            "loan": "fake_data",
            "customerT24": "fake_data",
            "disbursementTransact": "fake_data",
            "product": "fake_data",
            "subProduct": "fake_data",
            "loanType": "fake_data",
            "line": "fake_data",
            "masterLine": "fake_data",
            "masterCustomer": "fake_data",
            "afiRequest": "fake_data",
            "disbursementAmount": 54.96,
            "interestRate": 52.16,
            "indexedRate": false,
            "pdfRate": "fake_data",
            "spread": "fake_data",
            "totalRate": 39.22,
            "dpnfbSaving": "fake_data",
            "an": "fake_data",
            "feci": false,
            "branch": "fake_data",
            "disbursementPeriod": "fake_data",
            "disbursementTerm": "fake_data",
            "termType": "fake_data",
            "debitAccount": "fake_data",
            "toName": "fake_data",
            "monthlyLetterFeci": false,
            "amountLetter": 86.72,
            "commissionFid": 80.96,
            "itbmsFid": 19.85,
            "commissionFwla": 14.35,
            "itbmsFwla": 92.71,
            "amountTotalLetter": 53.76,
            "interestPaymentCycle": "fake_data",
            "capitalPaymentCycle": "fake_data",
            "nextPaymentDate": "2026-09-08",
            "destinyCountry": "fake_data",
            "province": "fake_data",
            "activityType": "fake_data",
            "cinuActivity": "fake_data",
            "dutyFree": false,
            "saleChannel": "fake_data",
            "detail": "fake_data",
            "creditAccount": false,
            "checker": false,
            "transfer": false,
            "others": false,
            "creditAccountNumber": "fake_data",
            "accountName": "fake_data",
            "creditAccountAmount": 6.64,
            "checkNumber": "fake_data",
            "beneficiary": "fake_data",
            "checkAmount": 59.19,
            "transferenceNumber": "fake_data",
            "transferenceBeneficiary": "fake_data",
            "transferAmount": 89.28,
            "othersItem": "fake_data",
            "othersDescription": "fake_data",
            "othersAmount": 76.73,
            "cppNumber": "fake_data",
            "disbursementTotalAmount": 66.75,
            "specialInstructions": "fake_data",
            "invoiceIop": "fake_data",
            "checkIop": "fake_data",
            "accountNumberIop": "fake_data",
            "commissionIop": "fake_data",
            "commissionAmountIop": 91.39,
            "itbmsIop": "fake_data",
            "toDifferIop": true,
            "pawnIop": false,
            "dpfSavingsIop": "fake_data",
            "anIop": "fake_data",
            "pawnAmountIop": 90.58,
            "notaryIop": "fake_data",
            "stampsIop": "fake_data",
            "instructionsIop": "fake_data",
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
  }*/

      return result.disbursementInstructiveFacility[result.disbursementInstructiveFacility.length - 1];
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async saveDisbursementInstructiveByFacility(data) {
    try {

      /*{
  "transactId": 1,
  "facilityId": 32,
  "facilityNumber": "fake_data",
  "facilityTypeCode": "fake_data",
  "facilityTypeDesc": "fake_data",
  "proposalTypeCode": "fake_data",
  "proposalTypeDesc": "fake_data",
  "masterLineNumber": "fake_data",
  "disbursementDate": "2028-05-29",
  "clientNumber": "fake_data",
  "clientName": "fake_data",
  "loandTypeCode": "fake_data",
  "loandTypeDesc": "fake_data",
  "branchCode": "fake_data",
  "branchDesc": "fake_data",
  "saleChannel": "fake_data",
  "disbursementFinalDestinyFreeZone": false,
  "disbursementApprovedAmount": 93.99,
  "advancement": false,
  "advancementAmount": 34.06,
  "productTypeCode": "fake_data",
  "productTypeDesc": "fake_data",
  "subProductTypeCode": "fake_data",
  "subProductTypeDesc": "fake_data",
  "disbursementComisionDesc": "fake_data",
  "disbursementComisionAmount": 52.51,
  "disbursementItbms": 35.00,
  "differ": true,
  "pawn": false,
  "dpfSavingsCheckingAccount": "fake_data",
  "an": "fake_data",
  "pledgeAmount": 13.99,
  "indexRate": false,
  "dpfRate": 22.57,
  "spreadRate": 81.77,
  "totalRate": 29.81,
  "disbursementTerm": 51,
  "disbursementTermType": "fake_data",
  "debitAccountClientNumber": "fake_data",
  "interestRate": 62.09,
  "feci": true,
  "interestPaymentCycleCode": "fake_data",
  "interestPaymentCycleDesc": "fake_data",
  "capitalPaymentCycleCod": "fake_data",
  "capitalPaymentCycleDesc": "fake_data",
  "monthlyLetterIncludesIntsandFeci": false,
  "monthlyLetterAmount": 84.25,
  "fidBanescoCommissionAmount": 34.59,
  "itbmFidAmount": 99.98,
  "disbursementFormAccountNumber": "fake_data",
  "disbursementFormAccountName": "fake_data",
  "disbursementFormAccountAmount": 5.99,
  "disbursementFormCheckNumber": "fake_data",
  "disbursementFormCheckName": "fake_data",
  "disbursementFormCheckAmount": 15.94,
  "disbursementFormTransferNumber": "fake_data",
  "disbursementFormTransferName": "fake_data",
  "disbursementFormTransferAmount": 67.35,
  "disbursementFormOtherNumber": "fake_data",
  "disbursementFormOtherName": "fake_data",
  "disbursementFormOtherAmount": 76.97,
  "cppNumber": "fake_data",
  "cppBeneficiary": "fake_data",
  "cppAmount": 84.30,
  "countryCode": "fake_data",
  "countryDesc": "fake_data",
  "provinceCode": "fake_data",
  "provinceDesc": "fake_data",
  "economicActivityTypeCode": "fake_data",
  "economicActivityTypeDesc": "fake_data",
  "cinuActivityTypeCode": "fake_data",
  "cinuActivityTypeDesc": "fake_data",
  "disbursementDetailDescription": "fake_data",
  "bankEspecialInstructions": "fake_data",
  "adminNotaryFees": 68.77,
  "adminSealFees": 28.11,
  "adminAditionalComments": "fake_data",
  "operationalLeasNumber": "fake_data",
  "operationalDueDate": "2013-01-21",
  "operationalNextPaymentDate": "2019-01-16",
  "sourceSalesCod": "fake_data",
  "sourceSalesDesc": "fake_data",
  "creditDestination": "fake_data",
  "paymentMethod": "fake_data",
  "fundsDestination": "fake_data",
  "fundsPurposeCode": "fake_data",
  "checkNumber": "fake_data",
  "originationRef": "fake_data",
  "writingType": "fake_data",
  "billsCombined": false,
  "settlement": true,
  "autonomyCode": "fake_data",
  "autonomyUser": "fake_data",
  "subCategoryCode": "fake_data",
  "authType": "fake_data"
}*/

      var result = await this.post(url.URL_BACKEND_DisbursementInstructiveByFacility, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error(err);
    }
    return undefined;
  } wq
  async updateDisbursementInstructiveByFacility(data) {
    try {

      /*{
  "transactId": 1,
  "facilityId": 32,
  "facilityNumber": "fake_data",
  "facilityTypeCode": "fake_data",
  "facilityTypeDesc": "fake_data",
  "proposalTypeCode": "fake_data",
  "proposalTypeDesc": "fake_data",
  "masterLineNumber": "fake_data",
  "disbursementDate": "2028-05-29",
  "clientNumber": "fake_data",
  "clientName": "fake_data",
  "loandTypeCode": "fake_data",
  "loandTypeDesc": "fake_data",
  "branchCode": "fake_data",
  "branchDesc": "fake_data",
  "saleChannel": "fake_data",
  "disbursementFinalDestinyFreeZone": false,
  "disbursementApprovedAmount": 93.99,
  "advancement": false,
  "advancementAmount": 34.06,
  "productTypeCode": "fake_data",
  "productTypeDesc": "fake_data",
  "subProductTypeCode": "fake_data",
  "subProductTypeDesc": "fake_data",
  "disbursementComisionDesc": "fake_data",
  "disbursementComisionAmount": 52.51,
  "disbursementItbms": 35.00,
  "differ": true,
  "pawn": false,
  "dpfSavingsCheckingAccount": "fake_data",
  "an": "fake_data",
  "pledgeAmount": 13.99,
  "indexRate": false,
  "dpfRate": 22.57,
  "spreadRate": 81.77,
  "totalRate": 29.81,
  "disbursementTerm": 51,
  "disbursementTermType": "fake_data",
  "debitAccountClientNumber": "fake_data",
  "interestRate": 62.09,
  "feci": true,
  "interestPaymentCycleCode": "fake_data",
  "interestPaymentCycleDesc": "fake_data",
  "capitalPaymentCycleCod": "fake_data",
  "capitalPaymentCycleDesc": "fake_data",
  "monthlyLetterIncludesIntsandFeci": false,
  "monthlyLetterAmount": 84.25,
  "fidBanescoCommissionAmount": 34.59,
  "itbmFidAmount": 99.98,
  "disbursementFormAccountNumber": "fake_data",
  "disbursementFormAccountName": "fake_data",
  "disbursementFormAccountAmount": 5.99,
  "disbursementFormCheckNumber": "fake_data",
  "disbursementFormCheckName": "fake_data",
  "disbursementFormCheckAmount": 15.94,
  "disbursementFormTransferNumber": "fake_data",
  "disbursementFormTransferName": "fake_data",
  "disbursementFormTransferAmount": 67.35,
  "disbursementFormOtherNumber": "fake_data",
  "disbursementFormOtherName": "fake_data",
  "disbursementFormOtherAmount": 76.97,
  "cppNumber": "fake_data",
  "cppBeneficiary": "fake_data",
  "cppAmount": 84.30,
  "countryCode": "fake_data",
  "countryDesc": "fake_data",
  "provinceCode": "fake_data",
  "provinceDesc": "fake_data",
  "economicActivityTypeCode": "fake_data",
  "economicActivityTypeDesc": "fake_data",
  "cinuActivityTypeCode": "fake_data",
  "cinuActivityTypeDesc": "fake_data",
  "disbursementDetailDescription": "fake_data",
  "bankEspecialInstructions": "fake_data",
  "adminNotaryFees": 68.77,
  "adminSealFees": 28.11,
  "adminAditionalComments": "fake_data",
  "operationalLeasNumber": "fake_data",
  "operationalDueDate": "2013-01-21",
  "operationalNextPaymentDate": "2019-01-16",
  "sourceSalesCod": "fake_data",
  "sourceSalesDesc": "fake_data",
  "creditDestination": "fake_data",
  "paymentMethod": "fake_data",
  "fundsDestination": "fake_data",
  "fundsPurposeCode": "fake_data",
  "checkNumber": "fake_data",
  "originationRef": "fake_data",
  "writingType": "fake_data",
  "billsCombined": false,
  "settlement": true,
  "autonomyCode": "fake_data",
  "autonomyUser": "fake_data",
  "subCategoryCode": "fake_data",
  "authType": "fake_data"
}*/
      data["data"] = true;
      var result = await this.put(url.URL_BACKEND_DisbursementInstructiveByFacility, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error(err);
    }
    return undefined;
  }


  //ACEPTACION DE CLIENTE
  async getCustomerAcceptance(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_CustomerAcceptance + "?" + data);

      /*{
  "transactId": 1,
  "personId": 26,
  "accept": false,
  "date": "2013-03-09"
},
    "status": {
        "statusCode": "200",
        "statusDesc": "Transacciï¿½n Exitosa"
    }
  }*/

      return result.customerAcceptance[result.customerAcceptance.length - 1];
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async saveCustomerAcceptance(data) {
    try {

      /*{
  "transactId": 1,
  "personId": 0, -> Fijo en 0 no se usa
  "accept": false,
  "date": "2014-03-09"
}*/

      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_CustomerAcceptance, data);//saveProposalData
      if (result.statusCode !== opt.ResponseBackend_STATUSOK) {
        result = await this.post(url.URL_BACKEND_CustomerAcceptance, data);//saveProposalData
      }

      return result;
    }
    catch (err) {
      console.error(err);
    }
    return undefined;
  }

  //DOCUMENTACION LEGAL
  async getLegalDocsFunction() {
    try {
      var params = { id: 0 }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_legalDocsFunctions + "?" + data);

      /*{
    "legalDocsFunctions": [
        {
            "id": 1,
            "documentName": "acta modelo para contratos privados",
            "bdFunction": "gccconsultardatoscontratosprivados",
            "status": true
        },
        {
            "id": 2,
            "documentName": "carta de terminos y condiciones",
            "bdFunction": "gccconsultardatoscartaterminocondiciones",
            "status": true
        },
        {
            "id": 3,
            "documentName": "fianza entrecruzada e ilimitada persona juridica",
            "bdFunction": "gccconsultardatosfianzaentrecruzadaeilimitada",
            "status": true
        },
        {
            "id": 4,
            "documentName": "fianza entrecruzada limitada persona juridica",
            "bdFunction": "gccconsultardatosfianzaentrecruzadalimitadapersonajuridica",
            "status": true
        },
        {
            "id": 5,
            "documentName": "fianza solidaria e ilimitada persona natural",
            "bdFunction": "gccconsultardatosfianzaensolidariaeilimitadapersonanatural",
            "status": true
        },
        {
            "id": 6,
            "documentName": "fianza solidaria limitada de persona juridica",
            "bdFunction": "gccconsultardatosfianzasolidarialimitadapersonajuridica",
            "status": true
        },
        {
            "id": 7,
            "documentName": "fianza solidaria limitada otorgada p natural",
            "bdFunction": "gccconsultardatosfianzasolidarialimitadapersonanatural",
            "status": true
        },
        {
            "id": 8,
            "documentName": "fianza mancomunada limitada persona natural",
            "bdFunction": "gccconsultardatosfianzalimitadamancomunadapersonnatual",
            "status": true
        },
        {
            "id": 9,
            "documentName": "fianza solidaria e ilimitada persona juridica",
            "bdFunction": "gccconsultardatosfianzaensolidariaeilimitadapersonajuridica",
            "status": true
        },
        {
            "id": 10,
            "documentName": "comparecencia juridica linea de sobregiro",
            "bdFunction": "gccconsultardatoscomparecenciajuridicalineasobregiro",
            "status": true
        },
        {
            "id": 11,
            "documentName": "comparecencia juridica prenda agraria",
            "bdFunction": "gccconsultardatoscomparecenciajuridicaprendaagraria",
            "status": true
        },
        {
            "id": 12,
            "documentName": "comparecencia juridica prestamo a plazo",
            "bdFunction": "gccconsultardatoscomparecenciajuridicaprestamoaplazo",
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Succesful transaction"
    }
}*/

      return result.legalDocsFunctions;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }

  //DOCUMENTACION LEGAL SELECCIONADA
  async getLegalDocumentation(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_LegalDocumentation + "?" + data);

      /*{
  "status": {
      "statusCode": "200",
      "statusDesc": "Succesful transaction"
  },
  "legalDocumentations": [
      {
          "processDocumentId": 1,
          "transactId": 1,
          "legalDocumentId": 72,
          "legalDocumentDescription": "fake_data",
          "status": true
      },
      {
          "processDocumentId": 2,
          "transactId": 1,
          "legalDocumentId": 72,
          "legalDocumentDescription": "fake_data",
          "status": true
      }
  ]
}*/

      return result.legalDocumentations;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }

  //GOBIERNO CORPORATIVA
  async getExposicionCorporativaBD(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_ExposicionCorporativa + "?" + data);
      /*"data": [
        {
            "transactId": 4109,
            "exhibitionId": 2,
            "description": "Exposicion Neta",
            "approved": 0,
            "currentBalance": 0,
            "proposed": 0,
            "ltv": 0,
            "difference": 0,
            "guarantee":5666.88,
            "status": true
        }
    ],
    "status": {
        "statusCode": "200",
        "statusDesc": "Succesful transaction"
    }*/
      return result.data;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async saveExposicionCorporativaBD(data) {
    try {
      /*{
            "transactId": 4124,
            "description": "Exposicion Neta",
            "approved": 0,
            "currentBalance": 0,
            "proposed": 0,
            "ltv": 0,
            "difference": 0,
            "guarantee":5666.88,
            "status": true
        }*/
      data["difference"] = data["difference"] !== null && data["difference"] !== undefined && !isNaN(data["difference"]) ? data["difference"] : 0;
      var result = await this.put(url.URL_BACKEND_ExposicionCorporativa, data);
      if (result === undefined || result.status.statusCode !== opt.ResponseBackend_STATUSOK) {
        console.log("saveExposicionCorporativaBD", result, data);
        result = await this.post(url.URL_BACKEND_ExposicionCorporativa, data);//saveProposalData
      }
      return result;
    }
    catch (err) {
      console.error("saveExposicionCorporativaBD", err);
    }
    return undefined;
  }
  async eliminarExposicionCorporativaBD(transactId) {
    try {
      var data = { transactId: transactId };
      var result = await this.del(url.URL_BACKEND_ExposicionCorporativa + "?" + qs.stringify(data));
      console.log("eliminarExposicionCorporativaBD",result)
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("eliminarExposicionCorporativaBD",err)
    }
    return undefined;
  }

  //GOBIERNO CORPORATIVA CLIENTE
  async getExposicionCorporativaClienteBD(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_ExposicionCorporativaCliente + "?" + data);
      /*{
        "corporateExhibition": [
        {
            "transactId": 4109,
            "exhibitionId": 409,
            "accountNumber": "INTERFINANCE ENTERPRISES CORP ",
            "t24ClientId": "600088018",
            "description": "Exposicion Neta",
            "approved": 0,
            "currentBalance": 0,
            "proposed": 0,
            "ltv": 0,
            "difference": 0,
            "guarantee":5666.88,
            "status": true
        }],
        "status": {
            "statusCode": "204",
            "statusDesc": "No content"
        }
    }*/
      return result.corporateExhibition;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async saveExposicionCorporativaClienteBD(data) {
    try {
      /*{
        "transactId": 1,
        "accountNumber": "fake_data",
        "t24ClientId": "fake_data",
        "description": "fake_data",
        "approved": 33.67,
        "currentBalance": 84.75,
        "proposed": 55.19,
        "ltv": 79.87,
        "guarantee":5666.88,
        "difference": 36.63
      }*/
      var result = await this.post(url.URL_BACKEND_ExposicionCorporativaCliente, data);//saveProposalData
      return result;
    }
    catch (err) {
      console.error(err);
    }
    return undefined;
  }
  async eliminarExposicionCorporativaClienteBD(transactId) {
    try {
      var data = { transactId: transactId };
      var result = await this.del(url.URL_BACKEND_ExposicionCorporativaCliente + "?" + qs.stringify(data));
      console.log("eliminarExposicionCorporativaClienteBD",result)
      return result;//WatchlistModel.fromJson(result);
    }
    catch (err) {
      console.error("eliminarExposicionCorporativaClienteBD",err)
    }
    return undefined;
  }

  async saveLegalDocumentation(data) {
    try {

      /*{
          "transactId": 1,
          "legalDocumentId": 72,
          "processDocumentId": 100,
          "legalDocumentDescription": "fake_data",
          "status": true
      }*/

      var result = await this.put(url.URL_BACKEND_LegalDocumentation, data);//saveProposalData
      if (result.statusCode !== opt.ResponseBackend_STATUSOK) {
        data["status"] = data["status"] !== undefined ? data["status"] : true;
        data["processDocumentId"] = data["processDocumentId"] !== undefined ? data["processDocumentId"] : 1;
        result = await this.post(url.URL_BACKEND_LegalDocumentation, data);//saveProposalData
      }

      return result;
    }
    catch (err) {
      console.error(err);
    }
    return undefined;
  }
  async updateDocumentation(data) {
    try {

      /*{
          "transactId": 1,
          "legalDocumentId": 72,
          "processDocumentId": 100,
          "legalDocumentDescription": "fake_data",
          "status": true
      }*/

      var result = await this.put(url.URL_BACKEND_LegalDocumentation, data);//saveProposalData
      return result;
    }
    catch (err) {
      console.error(err);
    }
    return undefined;
  }
  async deleteLegalDocumentation(data) {
    try {

      /*{
          "transactId": 1,
          "legalDocumentId": 72,
          "processDocumentId": 100,
          "legalDocumentDescription": "fake_data",
          "status": true
      }*/
      data["status"] = false;
      var result = await this.put(url.URL_BACKEND_LegalDocumentation, data);//saveProposalData

      return result;
    }
    catch (err) {
      console.error(err);
    }
    return undefined;
  }


  //Esto es para un arreglo de exposicion corporativa
  async recalculateExposicionCorporativa(transactId) {
    try {

      var exposicionCorp = await this.getExposicionCorporativaBD(transactId);
      if (exposicionCorp === undefined) {
        return;
      }

      //Inicializamos
      for (var expCorp of exposicionCorp) {
        if (expCorp.description === "MONTO PIGNORADO") {
          expCorp.proposed = 0;
          expCorp.difference = 0;
        }
      }

      var garantiaCommercialValueCorto = 0;
      var garantiaCommercialValueLargo = 0;
      var garantiaFastValueCorto = 0;
      var garantiaFastValueLargo = 0;

      var propousalData = await this.consultGeneralDataPropCred(transactId);
      var lfacilities = await this.consultarFacilidades(propousalData[0]?.requestId ?? "");
      console.log("recalculateExposicionCorporativa_Facility", lfacilities);
      for (var facility of lfacilities) {
        var lguarantees = await this.consultarGarantiaPropCred(facility.facilityId);
        console.log("recalculateExposicionCorporativa_Garantias", lguarantees);
        if (lguarantees !== undefined) {
          for (var guarantee of lguarantees) {
            //300   
            if (guarantee.guaranteeTypeName === "300") {
              //commercialValue
              for (var expCorp of exposicionCorp) {
                if (expCorp.description === "MONTO PIGNORADO") {
                  expCorp.guarantee = 0;
                  expCorp.proposed += guarantee.commercialValue;
                  expCorp.difference = expCorp.proposed - expCorp.approved;
                  await this.saveExposicionCorporativaBD(expCorp);
                }
              }
            }

            if (facility.term !== undefined && facility.term !== null) {
              switch (facility.term) {
                case "CP": {
                  garantiaCommercialValueCorto += guarantee.commercialValue;
                  garantiaFastValueCorto += guarantee.fastValue;
                }
                case "LP": {
                  garantiaCommercialValueLargo += guarantee.commercialValue;
                  garantiaFastValueLargo += guarantee.fastValue;
                }
              }
            }

          }
        }
      }

      for (var expCorp of exposicionCorp) {
        if (expCorp.description === "FACILIDADES CORTO PLAZO") {
          expCorp.guarantee = garantiaFastValueCorto;
          expCorp.ltv = garantiaFastValueCorto !== 0 ? (expCorp.proposed / garantiaFastValueCorto) * 100 : 0;
          await this.saveExposicionCorporativaBD(expCorp);
        }
        else if (expCorp.description === "FACILIDADES LARGO PLAZO") {
          expCorp.guarantee = garantiaFastValueLargo;
          expCorp.ltv = garantiaFastValueLargo !== 0 ? (expCorp.proposed / garantiaFastValueLargo) * 100 : 0;
          await this.saveExposicionCorporativaBD(expCorp);
        }
      }


    }
    catch (err) { console.error(err) }
    return undefined;
  }


  //getBpmSummaryProcess
  //http://10.40.216.82:8080/banescocc/UtilityBPM/management/v1/bpmLog/statistics/vm/summaryProcess?transactId=3426&idType=CED&clientDocId=08--00727-002057

  //retorna 
  async getStatusInbox() {

  }

  //retorna la estadisticas de los procesos con mas campos
  async getBpmStatisticsvm() {
    try {
      var result = await this.get(url.URL_BACKEND_EstadisticasMejoradas);

      /*{
    "status": {
        "statusCode": "200",
        "statusDesc": "Succesful transaction"
    },
    "statistics": [
        {
            "transactId": 3109,
            "instanceId": "9805",
            "typeId": "RUC",
            "clientDocId": "0001987121-0001-0000738046",
            "name": "MONTREAL FASHION GROUP SA",
            "secondName": "",
            "lastName": "",
            "secondLastName": "",
            "date": "2022-04-11T13:56:42.352+00:00",
            "processBpmId": "FP-SC-BPM-01",
            "processBpmName": "Solicitud de crédito",
            "activityBpmId": "003",
            "activityBpmName": "Generar informe de gestión y propuesta de crédito",
            "processId": 4,
            "activityId": 0,
            "statusDescription": ""
        },
        {
            "transactId": 3247,
            "instanceId": "9855",
            "typeId": "CED",
            "clientDocId": "V006976294",
            "name": "JOSE",
            "secondName": "LUIS",
            "lastName": "LAGOA",
            "secondLastName": "GONZALEZ",
            "date": "2022-04-11T18:46:35.889+00:00",
            "processBpmId": "FP-SC-BPM-01",
            "processBpmName": "Solicitud de crédito",
            "activityBpmId": "003",
            "activityBpmName": "Generar informe de gestión y propuesta de crédito",
            "processId": 4,
            "activityId": 0,
            "statusDescription": ""
        },
      ]
    }*/

      return result.statistics;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }

  //retorna historico la estadisticas de los procesos con mas campos
  async getHistoricalSearches(data) {
    try {


      //transactId=3426
      //idType="CED";
      //clientDocId="08--00727-002057";


      var params = { ...data }
      var data = qs.stringify(params);
      var result = await this.get(`${url.URL_BACKEND_SearchesHistoricalv2}?${data}`);

      return { status: 200, result: result };
      //return result.summaryProcess;
    }
    catch (err) {
      console.error("api getHistoricalSearches: ", err);
      return { status: err.response.status, error: err.response.data };
    }
    return undefined;
  }
  async getEnviromentHistory(transactId, idType, clientDocId, startDate, endDate) {
    try {
      // transactId
      // idType
      // clientDocId
      // startDate //format yyyy-MM-dd
      // endDate
      var params = { transactId, idType, clientDocId, startDate, endDate }
      var data = qs.stringify(params);
      var result = await this.get(`${url.URL_BACKEND_environmentalHistory}?${data}`);
      return { status: 200, result: result };
      //return result.summaryProcess;
    }
    catch (err) {
      console.error("api getHistoricalSearches: ", err);
      return { status: err.response.status, error: err.response.data };
    }
    return undefined;
  }

  //retorna descripcion de gobierno corporativo
  async getGovernanceInformation(transactId) {
    try {

      var params = { transactId }
      var data = qs.stringify(params);
      var result = await this.get(`${url.URL_BACKEND_GovernanceInformation}?${data}`);

      /*
        {
        "information": {
        "transactId": 1,
        "description": "fake_data",
        "estado": true
        },
        "status": {
        "statusCode": "200",
        "statusDesc": "Succesful transaction"
        }
        }

        RESPUESTA SIN DATOS
        {
        "status": {
        "statusCode": "204",
        "statusDesc": "No content"
        }
      }
      */
      return result.information;
      //return result.summaryProcess;
    }
    catch (err) {
      console.error("api getGovernanceInformation: ", err);
      return { status: err.response.status, error: err.response.data };
    }
  }

  //Actualiza descripcion de gobierno corporativo
  async updateGovernanceInformation(data) {
    try {

      /*
        {
          "transactId": 1,
          "description": "fake_data"
        }
      */

      var params = { transactId: data.transactId, description: data.description }
      var result = await this.put(url.URL_BACKEND_GovernanceInformation, params);

      return result;
      //return result.summaryProcess;
    }
    catch (err) {
      console.error("api getGovernanceInformation: ", err);
      return { status: err.response.status, error: err.response.data };
    }
  }

  //Actualiza descripcion de gobierno corporativo
  async saveGovernanceInformation(data) {
    try {

      /*
        {
          "transactId": 1,
          "description": "fake_data"
        }
      */

      var params = { transactId: data.transactId, description: data.description }
      var result = await this.post(url.URL_BACKEND_GovernanceInformation, params);

      return result;
      //return result.summaryProcess;
    }
    catch (err) {
      console.error("api getGovernanceInformation: ", err);
      return { status: err.response.status, error: err.response.data };
    }
  }

  //Guardar Firma de Contrato
  async saveSignContract(data) {
    try {

      /*
       data= {
"transactId": 1,
"description": "fake_data",
"signContract": true
}
      */
      data["status"] = true;
      var result = await this.post(url.URL_BACKEND_SignContract, data);

      // if (result.statusCode !== opt.ResponseBackend_STATUSOK) {
      //   result = await this.put(url.URL_BACKEND_SignContract, data);
      // }
      /*{
        "statusCode": "200",
        "statusDesc": "Succesful transaction"
      }*/

      return result;
      //return result.summaryProcess;
    }
    catch (err) {
      console.error("api getGovernanceInformation: ", err);
      return { status: err.response.status, error: err.response.data };
    }
  }
  async updateSignContract(data) {
    try {

      /*
       data= {
"transactId": 1,
"description": "fake_data",
"signContract": true
}
      */
      data["status"] = true;
      // var result = await this.post(url.URL_BACKEND_SignContract, data);

      // if (result.statusCode !== opt.ResponseBackend_STATUSOK) {
      var result = await this.put(url.URL_BACKEND_SignContract, data);
      // }
      /*{
        "statusCode": "200",
        "statusDesc": "Succesful transaction"
      }*/

      return result;
      //return result.summaryProcess;
    }
    catch (err) {
      console.error("api getGovernanceInformation: ", err);
      return { status: err.response.status, error: err.response.data };
    }
  }
  //Consultar Schedule de Instructivo de Desembolso
  async getSignContract(transactId) {
    try {
      var params = { transactId: transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_SignContract + "?" + data);
      console.log("getSignContract", result);
      /*{
"signContracts": [
{
"transactId": 1,
"description": "fake_data",
"date": "2022-05-13",
"signContract": true
},
{
"transactId": 1,
"description": "fake_data",
"date": "2022-05-13",
"signContract": true
}
],
"status": {
"statusCode": "200",
"statusDesc": "Succesful transaction"
}
}*/

      return result.signContracts[result.signContracts.length - 1];
    }
    catch (err) {
      console.error("api getDisbursementSchedule: ", err)
    }
    return undefined;
  }

  //TARIFARIO - consultar
  async getTariff(transactId, facilityId) {
    try {
      var params = { transactId: transactId, facilityId: facilityId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_Facilitytrustee + "?" + data);

      /*{
"data": [
{
"transactId": 1,
"facilityId": 57,
"comisionfidmenId": 86,
"subWarrantyCode": "fake_data",
"financialAmount": 34.59,
"monthlyFiduciaryCommission": 48.69,
"monthlyAdFiduciaryCommission": 47.08,
"status": true
},
{
"transactId": 1,
"facilityId": 57,
"comisionfidmenId": 86,
"subWarrantyCode": "fake_data",
"financialAmount": 34.59,
"monthlyFiduciaryCommission": 48.69,
"monthlyAdFiduciaryCommission": 47.08,
"status": true
},
{
"transactId": 1,
"facilityId": 57,
"comisionfidmenId": 86,
"subWarrantyCode": "fake_data",
"financialAmount": 34.59,
"monthlyFiduciaryCommission": 48.69,
"monthlyAdFiduciaryCommission": 47.08,
"status": true
}
],
"status": {
"statusCode": "200",
"statusDesc": "Succesful transaction"
}
}*/

      return result.data;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  //TARIFARIO - guardar
  async saveTariff(data) {
    try {

      /*{
"transactId": 1,
"facilityId": 57,
"comisionfidmenId": 86,
"subWarrantyCode": "fake_data",
"financialAmount": 34.59,
"monthlyFiduciaryCommission": 48.69,
"monthlyAdFiduciaryCommission": 47.08
}*/

      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_Facilitytrustee, data);//saveProposalData
      if (result.status.statusCode != opt.ResponseBackend_STATUSOK) {
        result = await this.post(url.URL_BACKEND_Facilitytrustee, data);//saveProposalData
      }

      return result;
    }
    catch (err) {
      console.error(err);
    }
    return undefined;
  }
  //TARIFARIO - consultar tablas 
  async getTariffData(subWarrantyCode, financialAmount) {
    try {
      var params = { subWarrantyCode: subWarrantyCode, financialAmount: financialAmount }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_CatalogTrustee + "?" + data);
      console.log("getTariffData", result);

      /*{
"catalog": [
{
"comisionfidmenId": 1,
"subWarrantyCode": "102",
"financialAmountMin": 0,
"financialAmountMax": 50000.00,
"commissionMonthly": 200.00,
"commissionMonthlyAd": 3.00
}
],
"status": {
"statusCode": "200",
"statusDesc": "Succesful transaction"
}
}*/

      return result.catalog;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }

  //INSTRUCTIVO DESEMBOLSO - catalogos  
  async getCatalogoInstructivoDesembolsoFrecuencia() {
    try {
      /*var params = { subWarrantyCode: subWarrantyCode, financialAmount: financialAmount }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_CatalogTrustee + "?" + data);
      console.log("getTariffData", result);*/

      var result = {
        "catalog": [
          {
            "code": 1,
            "value": "Diaria Esp"
          },
          {
            "code": 2,
            "value": "Semanal Esp"
          },
          {
            "code": 3,
            "value": "Mensual Esp"
          },
          {
            "code": 4,
            "value": "Diaria Freq"
          },
          {
            "code": 5,
            "value": "Semanal Freq"
          },
          {
            "code": 6,
            "value": "Mensual Freq"
          },
          {
            "code": 7,
            "value": "Anual Freq"
          },
        ],
        "status": {
          "statusCode": "200",
          "statusDesc": "Succesful transaction"
        }
      }

      return result.catalog;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async getCatalogoInstructivoDesembolsoFormaPago() {
    try {
      /*var params = { subWarrantyCode: subWarrantyCode, financialAmount: financialAmount }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_CatalogTrustee + "?" + data);
      console.log("getTariffData", result);*/

      var result = {
        "catalog": [
          {
            "code": "AP",
            "value": "Arreglo de Pago"
          },
          {
            "code": "PV",
            "value": "Pago Voluntario"
          },
          {
            "code": "DC",
            "value": "Descuento Cuenta"
          },
          {
            "code": "DD",
            "value": "Descuento Directo"
          },
        ],
        "status": {
          "statusCode": "200",
          "statusDesc": "Succesful transaction"
        }
      }

      return result.catalog;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async getInstructivoDesembolsoTipoPago() {
    try {
      /*var params = { subWarrantyCode: subWarrantyCode, financialAmount: financialAmount }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_CatalogTrustee + "?" + data);
      console.log("getTariffData", result);*/

      var result = {
        "catalog": [
          {
            "code": "CHARGE.INACT2",
            "value": "CARGO INACTIVA 2",
            "tipoCalc": "ACTUAL",
            "classProp": ""
          },
          {
            "code": "CHARGE.MINBALFEE",
            "value": "PAGO DE CARGOS MINBALFEE",
            "tipoCalc": "ACTUAL",
            "classProp": ""
          },
          {
            "code": "CONSTANT",
            "value": "Reembolso Constante",
            "tipoCalc": "CONSTANT",
            "classProp": "ACCOUNT"
          },
          {
            "code": "CURRENT",
            "value": "Tipo de Pago Actual",
            "tipoCalc": "ACTUAL",
            "classProp": "ACCOUNT"
          },
          {
            "code": "DEPOSIT.PRINCIPAL",
            "value": "Depósito de Fondos",
            "tipoCalc": "ACTUAL",
            "classProp": "ACCOUNT"
          },
          {
            "code": "DEPOSIT.SAVINGS",
            "value": "Depósitos Recibidos",
            "tipoCalc": "LINEAR",
            "classProp": ""
          },
          {
            "code": "DISBURSEMENT.%",
            "value": "Porcentaje de Desembolso",
            "tipoCalc": "ACTUAL",
            "classProp": ""
          },
          {
            "code": "DISBURSEMENT.AMT",
            "value": "Monto de Desembolso",
            "tipoCalc": "ACTUAL",
            "classProp": ""
          },
          {
            "code": "DRINTEREST",
            "value": "Interés",
            "tipoCalc": "ACTUAL",
            "classProp": ""
          },
          {
            "code": "ESCROW",
            "value": "Fideicomiso de Pago",
            "tipoCalc": "ACTUAL",
            "classProp": ""
          },
          {
            "code": "INSURANCE",
            "value": "Seguro Premium",
            "tipoCalc": "ACTUAL",
            "classProp": ""
          },
          {
            "code": "INTEREST",
            "value": "Interés",
            "tipoCalc": "ACTUAL",
            "classProp": ""
          },
          {
            "code": "INTEREST.ADVANCE",
            "value": "Interés por Adelantado",
            "tipoCalc": "ACTUAL",
            "classProp": ""
          },
          {
            "code": "INTEREST.DEFERRED",
            "value": "Interés Diferido",
            "tipoCalc": "ACTUAL",
            "classProp": ""
          },
          {
            "code": "INTEREST.ONLY",
            "value": "Pago de solo interés",
            "tipoCalc": "ACTUAL",
            "classProp": ""
          },
          {
            "code": "LINEAR",
            "value": "Principal Linear",
            "tipoCalc": "LINEAR",
            "classProp": ""
          },
          {
            "code": "PAYOFF$CHARGE",
            "value": "Tipo para la Factura de Pago",
            "tipoCalc": "ACTUAL",
            "classProp": ""
          },
          {
            "code": "PAYOFF$CURRENT",
            "value": "Tipo para la Factura de Pago",
            "tipoCalc": "ACTUAL",
            "classProp": ""
          },
          {
            "code": "PAYOFF$PAY.ACT.CHARGE",
            "value": "Tipo para la Factura de Pago",
            "tipoCalc": "ACTUAL",
            "classProp": ""
          },
          {
            "code": "PAYOFF$PAY.CURRENT",
            "value": "Tipo para la Factura de Pago",
            "tipoCalc": "ACTUAL",
            "classProp": ""
          },
          {
            "code": "PENALTY",
            "value": "Interés Penalizado",
            "tipoCalc": "ACTUAL",
            "classProp": ""
          },
          {
            "code": "PERIODICCHARGE",
            "value": "Cargo Periódico",
            "tipoCalc": "ACTUAL",
            "classProp": ""
          },
          {
            "code": "PERIODICCHG",
            "value": "Cargo Periódico",
            "tipoCalc": "ACTUAL",
            "classProp": ""
          },
          {
            "code": "PRINCIPAL",
            "value": "Principal",
            "tipoCalc": "ACTUAL",
            "classProp": ""
          },
          {
            "code": "PROGRESSIVE",
            "value": "Progresivo",
            "tipoCalc": "PROGRESSIVE",
            "classProp": ""
          },
          {
            "code": "RESIDUAL.PRINCIPAL",
            "value": "Principal Residual",
            "tipoCalc": "ACTUAL",
            "classProp": ""
          },
          {
            "code": "SPECIAL",
            "value": "Pago Especial",
            "tipoCalc": "ACTUAL",
            "classProp": ""
          },
        ],
        "status": {
          "statusCode": "200",
          "statusDesc": "Succesful transaction"
        }
      }

      return result.catalog;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async getInstructivoDesembolsoMetodos() {
    try {
      /*var params = { subWarrantyCode: subWarrantyCode, financialAmount: financialAmount }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_CatalogTrustee + "?" + data);
      console.log("getTariffData", result);*/

      var result = {
        "catalog": [
          {
            "code": "1",
            "value": "CAPITALISE"
          },
          {
            "code": "2",
            "value": "DUE"
          },
          {
            "code": "3",
            "value": "PAY"
          },
          {
            "code": "4",
            "value": "MAINTAIN"
          },
        ],
        "status": {
          "statusCode": "200",
          "statusDesc": "Succesful transaction"
        }
      }

      return result.catalog;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async getInstructivoDesembolsoPropiedade() {
    try {
      /*var params = { subWarrantyCode: subWarrantyCode, financialAmount: financialAmount }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_CatalogTrustee + "?" + data);
      console.log("getTariffData", result);*/

      var result = {
        "catalog": [
          {
            "code": "ACCHARGE",
            "value": "Cuenta de Cargos"
          },
          {
            "code": "ACCOUNT",
            "value": "Cuenta"
          },
          {
            "code": "ACCOUNTING",
            "value": "Regla Contable/Mapeo de Transacción"
          },
          {
            "code": "ACCOUNTS.PAYMENT.RULES",
            "value": "Reglas de Pago para Cuentas"
          },
          {
            "code": "ACCOUNTS.PAYOUT",
            "value": "Reglas de Pago para la Cuenta"
          },
          {
            "code": "ACCTCOMMISSION",
            "value": "Cuenta de Comisión"
          },
          {
            "code": "ACHCREDITFEE",
            "value": "Cargo de Crédito ACH"
          },
          {
            "code": "ACHDEBITFEE",
            "value": "Cargo por Débito ACH"
          },
          {
            "code": "ACTIVITY.CHARGES",
            "value": "Actividades de Cargos"
          },
          {
            "code": "ACTIVITY.MAPPING",
            "value": "Actividades de Mapeo"
          },
          {
            "code": "AD.PO.DEPOSIT",
            "value": "Reglas de Pago RD"
          },
        ],
        "status": {
          "statusCode": "200",
          "statusDesc": "Succesful transaction"
        }
      }

      return result.catalog;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async getInstructivoDesembolsoTipoFact() {
    try {
      /*var params = { subWarrantyCode: subWarrantyCode, financialAmount: financialAmount }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_CatalogTrustee + "?" + data);
      console.log("getTariffData", result);*/

      var result = {
        "catalog": [
          {
            "code": "ACT.CHARGE",
            "value": "Activity Charge",
            "sysBillType": "ACT.CHARGE"
          },
          {
            "code": "ADVANCE",
            "value": "Payment Rules for Advance",
            "sysBillType": "PAYMENT"
          },
          {
            "code": "BONUS",
            "value": "Bonus",
            "sysBillType": "PAYMENT"
          },
          {
            "code": "COMMISSION",
            "value": "Agent Commission",
            "sysBillType": "COMMISSION"
          },
          {
            "code": "DEF.CHARGE",
            "value": "Deferred Charge",
            "sysBillType": "DEF.CHARGE"
          },
        ],
        "status": {
          "statusCode": "200",
          "statusDesc": "Succesful transaction"
        }
      }

      return result.catalog;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }

  async getDevolutionCatalog() {
    try {
      var result = await this.get(url.URL_BACKEND_devolutionCatalog);
      console.log("getTariffData", result);

      // {
      //   "status": {
      //     "statusCode": "200",
      //       "statusDesc": "Succesful transaction"
      //   },
      //   "returnCatalog": [
      //     {
      //       "id": "1",
      //       "description": "fake-data",
      //       "status": true
      //     },
      //     {
      //       "id": "2",
      //       "description": "fake-data",
      //       "status": true
      //     },
      //     {
      //       "id": "3",
      //       "description": "fake-data",
      //       "status": true
      //     }
      //   ]
      // }


      return result.returnCatalog;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }

  async getSustainableProjectsCatalog() {
    try {
      var result = await this.get(url.URL_BACKEND_sustainableProjectsCatalog);
      //   [
      //     {
      //         "id": "ES",
      //         "description": "Energia solar",
      //         "state": true
      //     },
      //     {
      //         "id": "CIP",
      //         "description": "Energia eolica",
      //         "state": true
      //     },
      //     {
      //         "id": "CRP",
      //         "description": "Hidroelectrica",
      //         "state": true
      //     },
      //     {
      //         "id": "CSS",
      //         "description": "Reutilizacion de materia organica para generacion de energia (biomasa)",
      //         "state": true
      //     },
      //     {
      //         "id": "PAS",
      //         "description": "Reciclaje y saneamiento de aguas",
      //         "state": true
      //     }
      //   ]

      return result.sustainableProjects;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async getDocumentationJson(transactId) {
    try {
      var params = { transactId }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_LegalDocuments + "?" + data);
      return result;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async newDocumentationJson(transactId, documentId = 0, typeDocument, body, amount = 0, resultId = 0, status = true) {
    try {
      var params = { transactId, documentId, typeDocument, amount, resultId, status }
      var data = qs.stringify(params);
      var result = await this.post(url.URL_BACKEND_LegalDocuments + "?" + data, body);
      return result;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async updateDocumentationJson(transactId, documentId = 0, typeDocument, body, amount = 0, resultId = 0, status = true) {
    try {
      var params = { transactId, documentId, typeDocument, amount, resultId, status }
      var data = qs.stringify(params);
      var result = await this.put(url.URL_BACKEND_LegalDocuments + "?" + data, body);
      return result;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async getCreditRiskOpinionCatalog() {
    try {
      var result = await this.get(url.URL_BACKEND_creditRiskOpinionCat);
      //   {
      //     "status": {
      //         "statusCode": "200",
      //         "statusDesc": "Succesful transaction"
      //     },
      //     "creditRiskOpinions": [
      //         {
      //             "id": "1",
      //             "description": "Muy Urgente",
      //             "status": true
      //         },
      //         {
      //             "id": "2",
      //             "description": "Urgencia Moderada",
      //             "status": true
      //         },
      //         {
      //             "id": "3",
      //             "description": "Importante",
      //             "status": true
      //         },
      //         {
      //             "id": "4",
      //             "description": "Baja Urgencia",
      //             "status": true
      //         },
      //         {
      //             "id": "5",
      //             "description": "Sin Urgencia",
      //             "status": true
      //         }
      //     ]
      //  }


      return result.creditRiskOpinions;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }

  async getUsersByGroup(groupName) {
    try {
      //var data = qs.stringify({ userName: userName, password: password });
      var result = await this.get(url.URL_BACKEND_UserGroup + "/" + groupName);
      console.log("getUsersByGroup", result);
      return { status: 200, result: result };
    }
    catch (err) {
      console.error("api getUserInfo: ", err);
      return { status: err.response.status, error: err.response.data };
    }
  }


  ///Linea de Credito
  async saveCreditLine(data) {

    try {

      /*
      var data = {
        "idTramite": 1,
        "idDeudor": 1,
        "nombreDeudor": 1,
        "tipoPropuesta": 1,
        "descTipoPropuesta": 1,
        "tipoCambio": 1,
        "descTipoCambio": 1,
        "montoAprobado": 1,
        "maximoAprobado": 1,
        "montoModificado": 1,
        "moneda": 1,
        "descMoneda": 1,
        "tipoFacilidad": 1,
        "descTipoFacilidad": 1,
        "numeroCuentaCorriente": 1,
        "tasa": 1,
        "lineaRotativa": 1,
        "subCupoPrendario": 1,
        "montoSubcupoPrendario": 1,
        "prendario": 1,
        "otroNumeroCuenta": 1,
        "numeroAN": 1,
        "montoPignorar": 1,
        "cuentaClidebitar": 1,
        "riesgoPais": 1,
        "descriesgoPais": 1,
        "riesgoProvincia": 1,
        "descReiesgoProvincia": 1,
        "fechaPropuesta": 1,
        "fechaAprobada": 1,
        "fechaRevision": 1,
        "fechaVencimiento": 1,
        "actividadEconomica": 1,
        "descActividadEconomica": 1,
        "actividadEconomicacinu": 1,
        "descactividadEconomicacinu": 1,
        "tipoComision": 1,
        "montoComision": 1,
        "montoITBMS": 1,
        "diferido": 1,
        "instruccionesEspeciales": 1,
        "gastosNotaria": 1,
        "gastosTimbres": 1,
        "tipoLimite": 1,
        "descTipoLimite": 1,
        "tipoLinea": 1,
        "descTipoLinea": 1,
        "numeroLinea": 1,
        "informacionAdicional": 1,
        "comentariosAdicionales": 1,
        "permiteCompensacion": 1,
        "rechazarLimite": 1,
        "contabiliza": 1,
        "marcadorDisponible": 1,
        "frecuenciaRevision": 1,
        "autonomia": 1,
        "descAutonomia": 1,
        "usuarioAutonomia": 1,
        "tipoAutorizacion": 1,
        "porcentajeRiesgo": 1,
        "fechadeFrecuencia": 1,
        "tipoFrecuencia": 1,
        "montoFrecuencia": 1,
        "diaFrecuencia": 1,
        "idcClientet24": 1,
        "facilityId": 1,
        "creditLineDgs": [
            {
                "tipoLinea": "Linea01",
                "descTipoLinea": "descTipoLinea01",
                "idLineaT24":"idLineaT24",
                "monto": 123,
                "estado": true
            },
            {
                "tipoLinea": "Linea02",
                "descTipoLinea": "descTipoLinea02",
                "monto": 1234,
                "estado": true
            },
            {
                "tipoLinea": "Linea03",
                "descTipoLinea": "descTipoLinea03",
                "monto": 1234,
                "estado": true
            }
        ],
        "creditLineProds": [
            {
                "tipoProducto": "tipoProducto01",
                "descTipoProducto": "descTipoProducto01",
                "tipoSubProducto": "tipoSubProducto01",
                "descTipoSubproducto": "descTipoSubproducto01"
            }
        ]
      }*/

      data["status"] = true;
      var result = await this.put(url.URL_BACKEND_CREDITLINE, data);//saveProposalData
      console.log("guardar", result);
      if (result === undefined || result.statusCode !== opt.ResponseBackend_STATUSOK) {
        result = await this.post(url.URL_BACKEND_CREDITLINE, data);//saveProposalData
      }
      return result;
    }
    catch (err) { }
    return undefined;
  }
  async getCreditLine(transactId, idFacilidad) {
    try {
      var params = { transactId: transactId, idFacilidad: idFacilidad }
      var data = qs.stringify(params);
      var result = await this.get(url.URL_BACKEND_CREDITLINE + "?" + data);
      console.log("getCreditLine", result);

      /*{
"catalog": [
    {
      "idTramite": 1,
      "idDeudor": 1,
      "nombreDeudor": 1,
      "tipoPropuesta": 1,
      "descTipoPropuesta": 1,
      "tipoCambio": 1,
      "descTipoCambio": 1,
      "montoAprobado": 1,
      "maximoAprobado": 1,
      "montoModificado": 1,
      "moneda": 1,
      "descMoneda": 1,
      "tipoFacilidad": 1,
      "descTipoFacilidad": 1,
      "numeroCuentaCorriente": 1,
      "tasa": 1,
      "lineaRotativa": 1,
      "subCupoPrendario": 1,
      "montoSubcupoPrendario": 1,
      "prendario": 1,
      "otroNumeroCuenta": 1,
      "numeroAN": 1,
      "montoPignorar": 1,
      "cuentaClidebitar": 1,
      "riesgoPais": 1,
      "descriesgoPais": 1,
      "riesgoProvincia": 1,
      "descReiesgoProvincia": 1,
      "fechaPropuesta": 1,
      "fechaAprobada": 1,
      "fechaRevision": 1,
      "fechaVencimiento": 1,
      "actividadEconomica": 1,
      "descActividadEconomica": 1,
      "actividadEconomicacinu": 1,
      "descactividadEconomicacinu": 1,
      "tipoComision": 1,
      "montoComision": 1,
      "montoITBMS": 1,
      "diferido": 1,
      "instruccionesEspeciales": 1,
      "gastosNotaria": 1,
      "gastosTimbres": 1,
      "tipoLimite": 1,
      "descTipoLimite": 1,
      "tipoLinea": 1,
      "descTipoLinea": 1,
      "numeroLinea": 1,
      "informacionAdicional": 1,
      "comentariosAdicionales": 1,
      "permiteCompensacion": 1,
      "rechazarLimite": 1,
      "contabiliza": 1,
      "marcadorDisponible": 1,
      "frecuenciaRevision": 1,
      "autonomia": 1,
      "descAutonomia": 1,
      "usuarioAutonomia": 1,
      "tipoAutorizacion": 1,
      "porcentajeRiesgo": 1,
      "fechadeFrecuencia": 1,
      "tipoFrecuencia": 1,
      "montoFrecuencia": 1,
      "diaFrecuencia": 1,
      "idcClientet24": 1,
      "facilityId": 1,
      "creditLineDgs": [
          {
              "tipoLinea": "Linea01",
              "descTipoLinea": "descTipoLinea01",
              "monto": 123,
              "estado": true
          },
          {
              "tipoLinea": "Linea02",
              "descTipoLinea": "descTipoLinea02",
              "monto": 1234,
              "estado": true
          },
          {
              "tipoLinea": "Linea03",
              "descTipoLinea": "descTipoLinea03",
              "monto": 1234,
              "estado": true
          }
      ],
      "creditLineProds": [
          {
              "tipoProducto": "tipoProducto01",
              "descTipoProducto": "descTipoProducto01",
              "tipoSubProducto": "tipoSubProducto01",
              "descTipoSubproducto": "descTipoSubproducto01"
          }
      ]
    }
  ]*/

      return result;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async deleteCreditLine(transactId, lineId) {
    try {
      var params = { transactId: transactId, lineId: lineId }
      var data = qs.stringify(params);
      var result = await this.del(url.URL_BACKEND_CREDITLINE + "?" + data);
      console.log("getCreditLine", result);

      return result;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async getErrorsLog() {
    try {
      var result = await this.get(url.URL_BACKEND_ERRORLOG);
      return result;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }
  async newErrorsLog(data) {
    try {
      // {
      //  "logType": "fake_data-LogType",
      //  "logTypeDesc": "fake_data-LogTypeDesc",
      //  "url": "fake_data-Url",
      //  "description": "fake_data-Description"
      // }
      var result = await this.post(url.URL_BACKEND_ERRORLOG, data);
      return result;
    }
    catch (err) {
      console.error(err)
    }
    return undefined;
  }

}
