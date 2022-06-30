
import { WatchListModel, DocumentModel, ClientInfoModel, PartiesStaffModel } from "../../models/Core";
import ApiServiceCore from "../ApiServiceCore";
import * as url from "../../helpers/url_helper"
import qs from "qs";
import { ACT_FACILIDADACTIVOSFIJOS } from "../../helpers/options_helper";
import * as OPTs from "../../helpers/options_helper"
import { ResponseModel } from '../../models/Common/ResponseModel';
import moment from "moment";
import { part } from "core-js/core/function";

import { GetMontNumberByName, GetMontNameByNumber } from '../../helpers/commons'
import { ResourceStore } from "i18next";

import Currency from "../../helpers/currency"

import { convertToUpperCasesData } from '../../helpers/commons'

import { BackendServices } from "../../services";

import errorDispacherHelper from "../../helpers/errorDispacherHelper";

export default class Services extends ApiServiceCore {

    backendServices = new BackendServices();

    //analysis/customers -> retorna la info de lista de vigilancia
    //ConsultarListaCriterioCORE    
    async postWhatchList(params) {
        try {
            /*
        {
      "pCustomerId": "06--00711-002304",
      "pTypeId": "CEDULA_IDENTIDAD",
      "pModelId": "LISTA_VIGILANCIA",
      "pCustomerListParams": {
          "KeyValueParam": [
              {
                  "_x003C_Key_x003E_k__BackingField": "NOMBRE",
                  "_x003C_Value_x003E_k__BackingField": "Librada"
              },
              {
                  "_x003C_Key_x003E_k__BackingField": "SEGUNDO_NOMBRE",
                  "_x003C_Value_x003E_k__BackingField": "Emilio"
              },
              {
                  "_x003C_Key_x003E_k__BackingField": "PRIMER_APELLIDO",
                  "_x003C_Value_x003E_k__BackingField": "Rivera"
              },
              {
                  "_x003C_Key_x003E_k__BackingField": "SEGUNDO_APELLIDO",
                  "_x003C_Value_x003E_k__BackingField": "Gaviria"
              },
              {
                  "_x003C_Key_x003E_k__BackingField": "TIPO_ID",
                  "_x003C_Value_x003E_k__BackingField": "CEDULA_IDENTIDAD"
              },
              {
                  "_x003C_Key_x003E_k__BackingField": "CEDULA",
                  "_x003C_Value_x003E_k__BackingField": "06--00711-002304"
              }
          ]
      },
      "pUser": "wallytech_ws_user",
      "pWaitingInterval": 180000000,
      "pPriority": 1
  }
        */
            var result = await this.post(url.URL_CORE_WATCHLIST, params);

            return { status: 200, result: WatchListModel.fromJson(result).results };

        }
        catch (err) {
            return { status: err.response.status, error: err.response.data }; //errorMessage, //errorCode
        }
    }

    //documents -> salva documento en gestor documental ONBASE
    //GuardarDocumentoECM
    async postDocument(data) {

        var config = {
            headers: {
                //"Accept":"*/*",
                //"Accept-Encoding":"gzip, deflate, sdch, br",
                //"Accept-Language":"fr-FR,fr;q=0.8,en-US;q=0.6,en;q=0.4",
                //"Access-Control-Request-Headers":"accept, content-type",
                //"Content-Type":"text/plain",
                //"Content-Length":JSON.stringify(data).length.toString(),
                //"Host":"https://qa.api.ob.banesco.com.pa/",
                //Connection: "keep-alive",
                //"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
                "userId": "mq3898", //Usuario
                "clientDt": "clientDt", //"Fecha de ejecución del cliente."
                "appName": "ReactJs",//"Aplicacion que consume el servicio"
                "requestId": "202112202",//"Identificador de la solicitud."
                "channelId": "channelID", //"Canal consumidor",                
            }
        }

        var result = await this.post(url.URL_CORE_DOCUMENTS, data, config);

        console.log("Result Document: ", result);

        /*
        var result = {
            "Status": {
                "StatusCode": "M0000",
                "StatusDesc": "OK"
            },
            "Token": "e793-ddb2-ab0e-6626-5d3e-5f19-b79b-1f5d",
            "Result": {
                "DocName": "TDC - Contrato de TDC  (98765432)",
                "DocumentID": "34589873",
                "FormType": "HTML"
            }
        }
        */
        //console.log(result);
        if (result.Status.StatusCode === "M0000") {
            var dataresult = { docName: result.Result['DocName'], documentId: result.Result['DocumentID'], formType: result.Result['FormType'] }
            return dataresult;
        }

        return undefined;
    }

    //documents -> Ver documento en gestor documental ONBASE
    //VerDocumentoECM
    async postViewDocument(docId) {

        try {
            console.log(docId);
            var data = {
                DocumentHandle: docId,
                ReturnBase64: false
            }

            var result = await this.post(url.URL_CORE_DOCUMENTSVIEW, data);

            console.log("Result Document: ", result);

            return result.Documents[0].DocPop;
        }
        catch (e) { }
        return null;



    }

    //v1/parties/information -> retorna la info del cliente
    //BuscarClienteCORE
    async getPartiesInformation(params) {

        /*var item =[ {id:800120843,clientnumber:800120843,clientname:"Israel Michel Gomez Alfonso",firstname:"Israel",secondname:"Michel",
        lastname:"Gomez",secondlastname:"Alfonso",idtype:"CED",idnumber:"456123"},
        {id:800120845,clientnumber:800120845,clientname:"Pancho Pedro Gomez Alfonso",firstname:"Pancho",secondname:"Pedro",
        lastname:"Gomez",secondlastname:"Alfonso",idtype:"RUC",idnumber:"456456"}];
        return item;*/
        //params = {PartyType:Juridico,PartyId:600088018}
        var data = qs.stringify(params);
        console.log(data);
        //url.URL_CORSBYPASS +
        var result = await this.get(url.URL_CORE_PARTIEINFO + "?" + data);
        console.log(result);
        if (result.Status.StatusCode === "M0000") {
            return ClientInfoModel.fromJson(result);
        }
        else {
            result["error"] = "Error de Servicio del Core";//result.Status.StatusDesc;
            result["errorCode"] = result.Status.StatusCode;
            return result;
        }
    }

    async getPartiesInformationExtra(typePerson, customerNumberT24) {
        try {
            var params = { PartyType: (Number(typePerson) === 1 ? "Natural" : "Juridico"), PartyId: customerNumberT24 }
            var result = await this.getPartiesInformation(params);
            if (result !== undefined && result.length > 0) {
                var data = result[0];
                console.log("getPartiesInformationExtra", data);
                var extraInfo = {
                    activity: {
                        "EconomicActivity": data["economicActivity"]
                    },
                    address: {
                        "Country": data["address"]?.Country?.CountryCode ?? "",
                        "Province": data["address"]?.Province?.Cod ?? "",
                        "CountyDistrict": data["address"]?.CountyDistrict?.Cod ?? "",
                        "Jurisdiction": data["address"]?.Jurisdiction?.Cod ?? "",
                        "City": data["address"]?.City?.Desc ?? "",
                        "AddrDesc": data["address"]?.AddrDesc ?? "",
                        "Building": data["address"]?.Building?.Desc ?? "",
                        "HouseNumber": data["address"]?.HouseNumber ?? "",
                        "Street": data["address"]?.Street ?? ""
                    },
                    "PhoneNumber": data["phoneNumber"],
                    "Email": data["email"]
                }

                return extraInfo;
            }
        }
        catch (err) { }
        return undefined
    }

    //Accionistas
    async getPartiesStaff(PartyId) {

        if (PartyId.length <= 0) {
            return undefined;
        }

        var params = { PartyId: PartyId }//{PartyId:600235373}
        params = qs.stringify(params);

        var result = await this.get(url.URL_CORE_PARTIESTAFF + "?" + params);
        return PartiesStaffModel.fromJson(result);

    }

    ///v1/parties/staff
    async putPartiesStaff(data) {

        var result = await this.put(url.URL_CORE_PARTIESTAFF, data);

        return PartiesStaffModel.fromJson(result);
    }

    //ConsultarListaEmpresasRelacionadas
    async getCompaniesRelations(params) {

        //params = {PartyId:600012387}
        var data = qs.stringify(params);

        var result = await this.get(url.URL_CORE_COMPANIESRELATIONS + "?" + data);

        return PartiesStaffModel.fromJson(result);
    }

    /* ---------------------------------------------------------------------------------------------- */
    /*                       Api para obtener todos los paises desde el catalogo                      */
    /* ---------------------------------------------------------------------------------------------- */
    async getPaisesCatalogo() {
        try {
            // var result = sessionStorage.getItem('catPaises');
            // if (result !== undefined && result !== null) {
            //     result = JSON.parse(result)
            //     await convertToUpperCasesData(result)
            //     return result;
            // }
            //sessionStorage.setItem('catPaises', JSON.stringify(result.roles));

            let params = {
                catalog_name: 'PAIS',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);

            await convertToUpperCasesData(result.catalog)

            sessionStorage.setItem('catPaises', JSON.stringify(result.catalog));

            return result.catalog;
        }
        catch (ex) { }
        return null;
    }

    /* ---------------------------------------------------------------------------------------------- */
    /*       Api para obtener las provincias de un pais, pasandole como parametro el id del pais      */
    /* ---------------------------------------------------------------------------------------------- */
    async getProvinciasCatalogo(pais) {
        try {
            let params = {
                catalog_name: 'PROVINCIA',
                parent_catalog_name: pais,
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;
    }

    /* ---------------------------------------------------------------------------------------------- */
    /*    API para obtener los distrito de cada provincia pasandole como parametro el id provincia    */
    /* ---------------------------------------------------------------------------------------------- */
    async getDistritoCatalogo(provincia) {
        try {
            let params = {
                catalog_name: 'DISTRITO',
                parent_catalog_name: provincia,
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;


    }

    /* ---------------------------------------------------------------------------------------------- */
    /*                      Api para obtener los corregimientos de cada distrito                      */
    /* ---------------------------------------------------------------------------------------------- */
    async getCorregimientoCatalogo(distrito) {
        try {
            let params = {
                catalog_name: 'CORREGIMIENTO',
                parent_catalog_name: distrito,
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;
    }

    /* ---------------------------------------------------------------------------------------------- */
    /*                         Api para obtener las ciudades de cada provincia                        */
    /* ---------------------------------------------------------------------------------------------- */
    async getCiudadCatalogo(provincia) {
        try {
            let params = {
                catalog_name: 'CIUDAD',
                parent_catalog_name: provincia,
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;

    }

    /* ---------------------------------------------------------------------------------------------- */
    /*                      Api para obtener el grupo economico de los catalogos                      */
    /* ---------------------------------------------------------------------------------------------- */
    async getGrupoEconomicoCatalogo() {
        try {
            let params = {
                catalog_name: 'GRUPO ECONOMICO',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            result.catalog.Records.unshift({ Description: "N/A", Code: "N/A" })
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (err) { }
        return null;
    }

    /* ---------------------------------------------------------------------------------------------- */
    /*                   Api para obtener las bancas esta api proviene de catalogos                   */
    /* ---------------------------------------------------------------------------------------------- */
    async getBancaCatalogo() {
        try {
            let params = {
                catalog_name: 'BANCA',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (err) { }
        return null;

    }

    /* ---------------------------------------------------------------------------------------------- */
    /*                   Api muestra todos los cargos que retorna desde el catalogo                   */
    /* ---------------------------------------------------------------------------------------------- */
    async getCargosCatalogo() {
        try {
            let params = {
                catalog_name: 'CARGO',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;
    }

    /* ---------------------------------------------------------------------------------------------- */
    /*                     Api retorna todos los bancos exitentes para el catalogo                    */
    /* ---------------------------------------------------------------------------------------------- */
    async getBancosCatalogo() {
        try {
            let params = {
                catalog_name: 'BANCOS',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;

    }

    /* ---------------------------------------------------------------------------------------------- */
    /*                     CATALOGO DE ACTIVIDAD ECONOMICA                    */
    /* ---------------------------------------------------------------------------------------------- */
    async getActividadEconomicaCatalogo() {
        try {
            let params = {
                catalog_name: 'ACTIVIDAD ECONOMICA',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (err) { }
        return null;
    }

    /* ---------------------------------------------------------------------------------------------- */
    /*                     CATALOGO DE ACTIVIDAD ECONOMICA                    */
    /* ---------------------------------------------------------------------------------------------- */
    async getSubActividadEconomicaCatalogo(codeActividad) {
        try {
            let params = {
                catalog_name: 'SUB ACTIVIDAD ECONOMICA',
                parent_catalog_name: codeActividad,
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (err) { }
        return null;
    }
    /* ---------------------------------------------------------------------------------------------- */
    /*                     CATALOGO DE SECTOR ECONOMICO                    */
    /* ---------------------------------------------------------------------------------------------- */
    async getSectorEconomicoCatalogo() {
        try {
            let params = {
                catalog_name: 'SECTOR ECONOMICO',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;

    }

    /* ---------------------------------------------------------------------------------------------- */
    /*                     CATALOGO RELACION                    */
    /* ---------------------------------------------------------------------------------------------- */
    async getRelacionCatalogo() {
        try {
            let params = {
                catalog_name: 'RELACION',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;


    }

    /* ---------------------------------------------------------------------------------------------- */
    /*                     CATALOGO TIPO DE GARANTIA                    */
    /* ---------------------------------------------------------------------------------------------- */
    async getTipoGarantiaCatalogo() {
        try {
            let params = {
                catalog_name: 'TIPO DE GARANTIA',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;
    }

    async getSubTipoGarantiaCatalogo(codGarantia) {
        try {
            let params = {
                catalog_name: 'SUB TIPO GARANTIA',
                parent_catalog_name: codGarantia,
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;


    }
    /*
    "catalog": {
        "type": "TIPO DE GARANTIA",
        "records": [
            {
                "CODIGO": "100",
                "DESCRIPCION": "Garantia Hipotecaria Mueble"
            },
            {
                "CODIGO": "200",
                "DESCRIPCION": "Garantia Hipotecaria Inmueble"
            },
            {
                "CODIGO": "300",
                "DESCRIPCION": "Depositos Pignorados en el Banco"
            },
            {
                "CODIGO": "400",
                "DESCRIPCION": "Depositos Pignorados en Otros Banco"
            },
            {
                "CODIGO": "500",
                "DESCRIPCION": "Garantia Prendaria"
            },
            {
                "CODIGO": "600",
                "DESCRIPCION": "Otras Garantias"
            },
            {
                "CODIGO": "700",
                "DESCRIPCION": "SIN GARANTIAS"
            }
        ]
    }
    */
    /* ---------------------------------------------------------------------------------------------- */
    /*                     CATALOGO MONEDAS                    */
    /* ---------------------------------------------------------------------------------------------- */
    async getMonedaCatalogo() {

        try {
            let params = {
                catalog_name: 'MONEDA',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;


    }

    /* ---------------------------------------------------------------------------------------------- */
    /*                       Api para obtener todos las sucursales o agencias catalogo                      */
    /* ---------------------------------------------------------------------------------------------- */
    async getSucursalesCatalogo() {
        try {
            // return json;
            let params = {
                catalog_name: 'SUCURSAL',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;
    }

    //CATALOGO - Tipo de Limites de Credito
    async getTypeOfCreditLimitsCatalog() {
        try {
            // return json;
            let params = {
                catalog_name: 'LIMIT REFERENCE',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;
    }

    //CATALOGO - Aseguradoras
    async getInsurersCatalog() {
        try {
            // return json;
            let params = {
                catalog_name: 'ASEGURADORAS',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;
    }

    //CATALOGO - Marcas de Auto
    async getCarBrandCatalog() {
        try {
            // return json;
            let params = {
                catalog_name: 'MARCA DE AUTOS',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;
    }

    //CATALOGO - Modelos de Auto
    async getCarModelCatalog() {
        try {
            // return json;
            let params = {
                catalog_name: 'MODELO DE AUTO',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;
    }

    //CATALOGO - Corredoras
    async getBrokersCatalog() {
        try {
            // return json;
            let params = {
                catalog_name: 'BROKER',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;
    }

    //CATALOGO - Fiduciaria
    async getTrusteeCatalog() {
        try {
            // return json;
            let params = {
                catalog_name: 'FIDUCIARIAS',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;
    }

    //CATALOGO - Producto
    async getProductCatalog() {
        try {
            // return json;
            /*let params = {
                catalog_name: 'SUBPRODUCTO',
                parent_catalog_name: "3200",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            */

            var result = {
                "catalog": {
                    "type": "TIPO DE PRODUCTO",
                    "records": [
                        {
                            "CODIGO": "3200",
                            "DESCRIPCION": "Comercial"
                        }
                    ]
                }
            }

            return result.catalog;
        }
        catch (ex) { }
        return null;
    }

    //CATALOGO - SubProducto
    async getSubProductCatalog() {
        try {
            // return json;
            let params = {
                catalog_name: 'SUBPRODUCTO',
                parent_catalog_name: "3200",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;
    }

    //CATALOGO - Categorias
    async getCategoriesCatalog() {
        try {
            // return json;
            let params = {
                catalog_name: 'CATEGORIA',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;
    }

    //CATALOGO - Tipo de poliza
    async getPolicyTypeCatalog() {
        try {
            // return json;
            let params = {
                catalog_name: 'TIPO POLIZA',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;
    }

    //CATALOGO - Sub tipo de Garantia
    async getSubTypeWarrantyCatalog() {
        try {
            // return json;
            let params = {
                catalog_name: 'SUB TIPO GARANTIA',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;
    }

    //CATALOGO - Clases de Auto
    async getAutoClassCatalog() {
        try {
            // return json;
            let params = {
                catalog_name: 'CLASE AUTO',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;
    }

    //CATALOGO - Avaluadora
    async getAppraiserCatalog() {
        try {
            // return json;
            let params = {
                catalog_name: 'AVALUADORA',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;
    }

    //CATALOGO - Tipo de Desembolso
    async getTipoDesembolsoCatalogo() {
        try {
            /*let params = {
                catalog_name: 'CIUDAD',
                parent_catalog_name: provincia,
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)*/

            var result = {
                "catalog": {
                    "type": "Tipo Desembolso",
                    "records": [
                        {
                            "CODIGO": "100",
                            "DESCRIPCION": "Bajo Linea"
                        },
                        {
                            "CODIGO": "200",
                            "DESCRIPCION": "Comercial"
                        },
                    ]
                }
            }

            return result.catalog;
        }
        catch (ex) { }
        return null;

    }

    //CATALOGO - Fuentes de Ventas
    async getSourceSalesCatalogo() {
        try {
            // return json;
            let params = {
                catalog_name: 'SALE INFORMATION',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;

    }

    //CATALOGO - Autonomias
    async getAutonomiaCatalogo() {
        try {
            // return json;
            let params = {
                catalog_name: 'AUTONOMIAS',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;

    }

    //CATALOGO - Authority
    async getAuthorityTypeCatalogo() {
        try {
            // return json;
            let params = {
                catalog_name: 'AUTH TYPE',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);
            await convertToUpperCasesData(result.catalog)
            return result.catalog;
        }
        catch (ex) { }
        return null;

    }

    /*------------------------------------------------------------------------------------*/
    ///v1/loans/details/informations
    //Retorna las facilidades de un cliente ... partyId -> numero del cliente en T24
    //getFacilidades

    async getFacilitiesByTransaction(transactId) {

        var debtors = await this.backendServices.consultarDeudores(transactId);
        if (debtors !== null && debtors !== undefined) {

            var result = [];
            for (var i = 0; i < debtors.length; i++) {
                try {
                    var dataResult = await this.getFacilities(debtors[i].customerNumberT24);
                    if (dataResult !== null && dataResult !== undefined) {
                        dataResult.forEach(function (item) {
                            item["debtorName"] = debtors[i].typePerson === "2" ? debtors[i].name : (debtors[i].name + " " + debtors[i].name2 + " " + debtors[i].lastName + " " + debtors[i].lastName2)
                            item["debtorId"] = debtors[i].personId;
                            result.push(item);
                        });
                    }
                }
                catch (err) { }
                try {
                    var dataResult = await this.getCreditCard(debtors[i].customerNumberT24);
                    if (dataResult !== null && dataResult !== undefined) {
                        dataResult.forEach(function (item) {
                            item["debtorName"] = debtors[i].typePerson === "2" ? debtors[i].name : (debtors[i].name + " " + debtors[i].name2 + " " + debtors[i].lastName + " " + debtors[i].lastName2)
                            item["debtorId"] = debtors[i].personId;
                            result.push(item);
                        });
                    }
                }
                catch (err) { }
            }
            console.log("getAllTermDebtsByTransaction", result);

            return result;
        }

        return undefined;
    }
    async getFacilities(partyId) {
        try {

            const currencyData = new Currency();

            if (partyId.length <= 0) {
                return undefined;
            }

            var dataResult = [];

            ////// Credit - Cortos Plazos
            try {
                var params = { PartyId: partyId }
                var data = qs.stringify(params);

                //https://qa.api.ob.banesco.com.pa/party/v1/parties/credits?PartyId=600088018    
                //servicio retorna las cuentas del cliente
                var result = await this.get(url.URL_CORE_CREDITOS_LINE + "?" + data);

                //var dataResults = result.Party.PartyInfo.CreditLine.filter(x => x.CreditLineId.split(".")[1].indexOf(facilityTypeCode) >= 0)

                if (Array.isArray(result.Party.PartyInfo.CreditLine)) {

                    result.Party.PartyInfo.CreditLine.forEach((item) => {
                        try {
                            /*
                            {
                        "AvailableAmt": {
                            "Amt": "75,000.00"
                        },
                        "CreditLineId": "800048231.0010000.01",
                        "CreditLineNum": "01",
                        "CreditType": {
                            "Desc": "Límite Global - rotativo"
                        },
                        "CurCode": "USD",
                        "IntRateType": {
                            "Desc": "Fixed"
                        },
                        "OnlineAmt": {
                            "Amt": "125000.00"
                        },
                        "PendingAmt": {
                            "Amt": "50,000.00"
                        },
                        "Rating": "01",
                        "SecuredAmt": {
                            "Amt": "0.00"
                        }
                    }
                            */

                            if ((item.CreditLineId.split(".")[1]).replace(/0/g, '').length < 2) {
                                //item.AvailableAmt.Amt
                                var deudas = { debtype: "short", facilityType: item.CreditType.Desc, bank: "Banesco", balance: Number(currencyData.getRealValue(item.PendingAmt.Amt)), approved: Number(currencyData.getRealValue(item.OnlineAmt.Amt)), variation: Number(currencyData.getRealValue(item.PendingAmt.Amt)), startDate: moment().format("YYYY-MM-DD"), endDate: moment().format("YYYY-MM-DD") }
                                //deudas.variation=deudas.approvedAmount - deudas.balance;
                                dataResult.push({
                                    "facilityType": deudas.facilityType,
                                    "approvedAmount": deudas.approved,
                                    "approvedDate": deudas.startDate,
                                    "actualBalance": deudas.variation,
                                    "debtorName": "",
                                    "AcctId": "",
                                });
                            }
                        }
                        catch (err) { }
                    })
                }
                else {
                    // myVarToTest is not an array
                    //Armamos la data a mostrar en pantalla
                    var item = result.ConsultarAPCResponse.ConsultarAPCResult.DetCompromisoAPC.DetCompromisoAPC;
                    try {
                        if ((item.CreditLineId.split(".")[1]).replace(/0/g, '').length < 2) {
                            var deudas = { debtype: "short", facilityType: item.CreditType.Desc, bank: "Banesco", balance: Number(currencyData.getRealValue(item.PendingAmt.Amt)), approved: Number(currencyData.getRealValue(item.OnlineAmt.Amt)), variation: Number(currencyData.getRealValue(item.PendingAmt.Amt)), startDate: moment().format("YYYY-MM-DD"), endDate: moment().format("YYYY-MM-DD") }
                            //deudas.variation=deudas.approvedAmount - deudas.balance;
                            dataResult.push({
                                "facilityType": deudas.facilityType, "approvedAmount": deudas.approved,
                                "approvedDate": deudas.startDate, "actualBalance": deudas.balance,
                                "debtorName": "",
                                "AcctId": "",
                            });
                        }
                    }
                    catch (err) { }
                }
            }
            catch (err) { }

            ////// loands - Cortos y Largos Plazos
            try {
                let params = {
                    PartyId: partyId
                }
                let data = qs.stringify(params);
                var result = await this.get(url.URL_CORE_FACILIDADES + "?" + data);

                if (Array.isArray(result.AcctLoans.AcctLoan)) {

                    result.AcctLoans.AcctLoan.forEach((item) => {
                        if (item.AcctKey !== null) {
                            try {
                                /*
                                {
                        "Category": "01",
                        "Desc": "340000071156",
                        "ProductDesc": "Prestamo Comercia",
                        "AcctOpeningInfo": {
                            "InitialAmt": {
                                "Amt": "120000.00",
                                "CurCode": "USD"
                            },
                            "OpenDt": "2019-08-02"
                        },
                        "CreditAcctData": {
                            "DueDt": "2028-07-05",
                            "CreditAcctPmtInfo": null
                        },
                        "AcctKey": {
                            "AcctId": "1020243542"
                        },
                        "AcctBal": [
                            {
                                "BalType": "Balance",
                                "CurAmt": {
                                    "Amt": "87245.92"
                                }
                            }
                        ],
                        "AcctMember": [
                            {
                                "PartyRole": {
                                    "Cod": "TITULAR/DEUDOR"
                                },
                                "PartyName": {
                                    "ShortName": "ASI DEVELOPMENT"
                                },
                                "PartyKey": null
                            }
                        ]
                    }
                                */

                                var deudas = { debtype: "short", facilityType: item.ProductDesc, bank: "Banesco", balance: Number(currencyData.getRealValue(item.AcctBal[0].CurAmt.Amt)), approved: Number(currencyData.getRealValue(item.AcctOpeningInfo.InitialAmt.Amt)), variation: 0, startDate: moment(item.AcctOpeningInfo.OpenDt).format("YYYY-MM-DD"), endDate: moment(item.CreditAcctData.DueDt).format("YYYY-MM-DD") }
                                deudas.variation = deudas.approved - deudas.balance;
                                dataResult.push({
                                    "facilityType": deudas.facilityType, "approvedAmount": deudas.approved,
                                    "approvedDate": deudas.startDate, "actualBalance": deudas.balance,
                                    "debtorName": "",
                                    "AcctId": item.AcctKey.AcctId,
                                });
                            }
                            catch (err) { }
                        }
                    })
                }
                else {
                    // myVarToTest is not an array
                    //Armamos la data a mostrar en pantalla
                    var item = result.ConsultarAPCResponse.ConsultarAPCResult.DetCompromisoAPC.DetCompromisoAPC;
                    if (item.AcctKey !== null) {
                        try {
                            var deudas = { debtype: "short", facilityType: item.ProductDesc, bank: "Banesco", balance: Number(currencyData.getRealValue(item.AcctBal[0].CurAmt.Amt)), approved: Number(currencyData.getRealValue(item.AcctOpeningInfo.InitialAmt.Amt)), variation: 0, startDate: moment(item.AcctOpeningInfo.OpenDt).format("YYYY-MM-DD"), endDate: moment(item.CreditAcctData.DueDt).format("YYYY-MM-DD") }
                            deudas.variation = deudas.approved - deudas.balance;
                            dataResult.push({
                                "facilityType": deudas.facilityType, "approvedAmount": deudas.approved,
                                "approvedDate": deudas.startDate, "actualBalance": deudas.balance,
                                "debtorName": "",
                                "AcctId": item.AcctKey.AcctId,
                            });
                        }
                        catch (err) { }
                    }

                }
            }
            catch (err) { }


            console.log("getFacilities", dataResult)
            return dataResult;
        }
        catch (err) { console.error(err) }
        return undefined;
    }

    //retorna los Clientes Relacionados se le pasa el Numero de Cliente de T24
    async getRelatedClients(partyId) {

        if (partyId.length <= 0) {
            return undefined;
        }

        let params = {
            PartyId: partyId
        }

        let data = qs.stringify(params);

        var dataResult = [];

        try {

            //servicio retorna clientes relacionados
            var result = await this.get(url.URL_CORE_COMPANIESRELATIONS + "?" + data);
            if (result.error !== undefined) {
                return result;
            }

            //Armamos la data a mostrar en pantalla
            result.PartyPartyRels.PartyPartyRel.forEach((client) => {
                try {
                    var partyNumber = client.PartyPartyRelInfo.PartyRef[0].RelPartyRef[0].PartyKey[0].PartyId;
                    if (partyNumber !== undefined && partyNumber !== null && partyNumber.length > 0) {
                        dataResult.push(partyNumber);
                    }
                }
                catch (err) { }
            });
        }
        catch (err) { }

        return dataResult;
    }

    //ExposicionCorporativa se le pasa el Numero de Cliente de T24
    async getCorporateExhibition(transactId) {

        const currencyData = new Currency();

        var debtors = await this.backendServices.consultarDeudores(transactId);
        if (debtors === null || debtors === undefined) {
            return undefined;
        }

        var dataResult = [];
        var longTerm = { name: "Facilidades Largo Plazo", approved: 0, balance: 0, proposal: 0, variation: 0 };
        var shortTerm = { name: "Facilidades Corto Plazo", approved: 0, balance: 0, proposal: 0, variation: 0 };
        var totalTerm = { name: "Total de Facilidades", approved: 0, balance: 0, proposal: 0, variation: 0 };
        var pledged = { name: "Monto Pignorado", approved: 0, balance: 0, proposal: 0, variation: 0 };
        var netExposition = { name: "Exposicion Neta", approved: 0, balance: 0, proposal: 0, variation: 0 };

        ////// Credit - Cortos Plazos
        for (var i = 0; i < debtors.length; i++) {
            var partyId = debtors[i].customerNumberT24;
            if (partyId.length > 0) {
                try {
                    var params = { PartyId: partyId }
                    var data = qs.stringify(params);

                    //https://qa.api.ob.banesco.com.pa/party/v1/parties/credits?PartyId=600088018    
                    //servicio retorna las cuentas del cliente
                    var result = await this.get(url.URL_CORE_CREDITOS_LINE + "?" + data);
                    if (result.error !== undefined) {
                        return result;
                    }
                    //var dataResults = result.Party.PartyInfo.CreditLine.filter(x => x.CreditLineId.split(".")[1].indexOf(facilityTypeCode) >= 0)

                    if (Array.isArray(result.Party.PartyInfo.CreditLine)) {

                        result.Party.PartyInfo.CreditLine.forEach((item) => {
                            try {
                                /*
                                {
                            "AvailableAmt": {
                                "Amt": "75,000.00"
                            },
                            "CreditLineId": "800048231.0010000.01",
                            "CreditLineNum": "01",
                            "CreditType": {
                                "Desc": "Límite Global - rotativo"
                            },
                            "CurCode": "USD",
                            "IntRateType": {
                                "Desc": "Fixed"
                            },
                            "OnlineAmt": {
                                "Amt": "125000.00"
                            },
                            "PendingAmt": {
                                "Amt": "50,000.00"
                            },
                            "Rating": "01",
                            "SecuredAmt": {
                                "Amt": "0.00"
                            }
                        }
                                */

                                if ((item.CreditLineId.split(".")[1]).replace(/0/g, '').length < 2) {
                                    var deudas = { debtype: "short", facilityType: item.CreditType.Desc, bank: "Banesco", balance: Number(currencyData.getRealValue(item.PendingAmt.Amt)), approved: Number(currencyData.getRealValue(item.OnlineAmt.Amt)), variation: Number(currencyData.getRealValue(item.PendingAmt.Amt)), startDate: moment().format("YYYY-MM-DD"), endDate: moment().format("YYYY-MM-DD") }
                                    //deudas.variation=deudas.approvedAmount - deudas.balance;
                                    if (moment(deudas.endDate).diff(deudas.startDate, 'years') > 1) {
                                        //deudas.debtype="long";     
                                        longTerm.approved += Number(deudas.approved);
                                        longTerm.balance += Number(deudas.variation);
                                    }
                                    else {
                                        shortTerm.approved += Number(deudas.approved);
                                        shortTerm.balance += Number(deudas.variation);
                                    }
                                }
                            }
                            catch (err) { }
                        })
                    }
                    else {
                        // myVarToTest is not an array
                        //Armamos la data a mostrar en pantalla
                        var item = result.ConsultarAPCResponse.ConsultarAPCResult.DetCompromisoAPC.DetCompromisoAPC;
                        try {
                            if ((item.CreditLineId.split(".")[1]).replace(/0/g, '').length < 2) {
                                var deudas = { debtype: "short", facilityType: item.CreditType.Desc, bank: "Banesco", balance: Number(currencyData.getRealValue(item.PendingAmt.Amt)), approved: Number(currencyData.getRealValue(item.OnlineAmt.Amt)), variation: Number(currencyData.getRealValue(item.PendingAmt.Amt)), startDate: moment().format("YYYY-MM-DD"), endDate: moment().format("YYYY-MM-DD") }
                                //deudas.variation=deudas.approvedAmount - deudas.balance;
                                if (moment(deudas.endDate).diff(deudas.startDate, 'years') > 1) {
                                    //deudas.debtype="long";     
                                    longTerm.approved += Number(deudas.approved);
                                    longTerm.balance += Number(deudas.variation);
                                }
                                else {
                                    shortTerm.approved += Number(deudas.approved);
                                    shortTerm.balance += Number(deudas.variation);
                                }
                            }
                        }
                        catch (err) { }
                    }
                }
                catch (err) { }
            }
        }

        ////// Tarjeta de Creditos - Cortos Plazos
        for (var i = 0; i < debtors.length; i++) {
            try {
                var result = await this.getCreditCard(debtors[i].customerNumberT24);
                if (result.error !== undefined) {
                    return result;
                }
                /*{
                    "facilityType": item.CardInfo.Desc, 
                    "approvedAmount": approvedAmt?.CurAmt??0,
                    "approvedDate": item.CardInfo.EndDt!==undefined?item.CardInfo.EndDt:moment().format("YYYY-MM-DD"), 
                    "actualBalance":  balanceAmt?.CurAmt??0,
                    "debtorName": item.CardInfo.EmbossInfo.FirstName + " " + item.CardInfo.EmbossInfo.LastName,
                    "AcctId": "",
                } */

                result.forEach(item => {
                    shortTerm.approved += Number(item.approvedAmount);
                    shortTerm.balance += Number(item.actualBalance);
                })
            }
            catch (err) { }
        }

        ////// loands - Cortos y Largos Plazos
        for (var i = 0; i < debtors.length; i++) {
            var partyId = debtors[i].customerNumberT24;
            if (partyId.length > 0) {
                try {
                    let params = {
                        PartyId: partyId
                    }
                    let data = qs.stringify(params);
                    var result = await this.get(url.URL_CORE_FACILIDADES + "?" + data);
                    if (result.error !== undefined) {
                        return result;
                    }

                    if (Array.isArray(result.AcctLoans.AcctLoan)) {

                        result.AcctLoans.AcctLoan.forEach((item) => {
                            if (item.AcctKey !== null) {
                                try {
                                    /*
                                    {
                            "Category": "01",
                            "Desc": "340000071156",
                            "ProductDesc": "Prestamo Comercia",
                            "AcctOpeningInfo": {
                                "InitialAmt": {
                                    "Amt": "120000.00",
                                    "CurCode": "USD"
                                },
                                "OpenDt": "2019-08-02"
                            },
                            "CreditAcctData": {
                                "DueDt": "2028-07-05",
                                "CreditAcctPmtInfo": null
                            },
                            "AcctKey": {
                                "AcctId": "1020243542"
                            },
                            "AcctBal": [
                                {
                                    "BalType": "Balance",
                                    "CurAmt": {
                                        "Amt": "87245.92"
                                    }
                                }
                            ],
                            "AcctMember": [
                                {
                                    "PartyRole": {
                                        "Cod": "TITULAR/DEUDOR"
                                    },
                                    "PartyName": {
                                        "ShortName": "ASI DEVELOPMENT"
                                    },
                                    "PartyKey": null
                                }
                            ]
                        }
                                    */

                                    var deudas = { debtype: "short", facilityType: item.ProductDesc, bank: "Banesco", balance: Number(currencyData.getRealValue(item.AcctBal[0].CurAmt.Amt)), approved: Number(currencyData.getRealValue(item.AcctOpeningInfo.InitialAmt.Amt)), variation: 0, startDate: moment(item.AcctOpeningInfo.OpenDt).format("YYYY-MM-DD"), endDate: moment(item.CreditAcctData.DueDt).format("YYYY-MM-DD") }
                                    deudas.variation = deudas.approved - deudas.balance;
                                    if (moment(deudas.endDate).diff(deudas.startDate, 'years') > 1) {
                                        //deudas.debtype="long";     
                                        longTerm.approved += Number(deudas.approved);
                                        longTerm.balance += Number(deudas.balance);
                                    }
                                    else {
                                        shortTerm.approved += Number(deudas.approved);
                                        shortTerm.balance += Number(deudas.balance);
                                    }
                                }
                                catch (err) { }
                            }
                        })
                    }
                    else {
                        // myVarToTest is not an array
                        //Armamos la data a mostrar en pantalla
                        var item = result.ConsultarAPCResponse.ConsultarAPCResult.DetCompromisoAPC.DetCompromisoAPC;
                        if (item.AcctKey !== null) {
                            try {
                                var deudas = { debtype: "short", facilityType: item.ProductDesc, bank: "Banesco", balance: Number(currencyData.getRealValue(item.AcctBal[0].CurAmt.Amt)), approved: Number(currencyData.getRealValue(item.AcctOpeningInfo.InitialAmt.Amt)), variation: 0, startDate: moment(item.AcctOpeningInfo.OpenDt).format("YYYY-MM-DD"), endDate: moment(item.CreditAcctData.DueDt).format("YYYY-MM-DD") }
                                deudas.variation = deudas.approved - deudas.balance;
                                if (moment(deudas.endDate).diff(deudas.startDate, 'years') > 1) {
                                    //deudas.debtype="long";     
                                    longTerm.approved += Number(deudas.approved);
                                    longTerm.balance += Number(deudas.balance);
                                }
                                else {
                                    shortTerm.approved += Number(deudas.approved);
                                    shortTerm.balance += Number(deudas.balance);
                                }
                            }
                            catch (err) { }
                        }

                    }
                }
                catch (err) { }
            }
        }

        longTerm.variation = Number(longTerm.approved) - Number(longTerm.balance);
        shortTerm.variation = Number(shortTerm.approved) - Number(shortTerm.balance);

        dataResult.push(longTerm);
        dataResult.push(shortTerm);

        totalTerm.approved = Number(shortTerm.approved) + Number(longTerm.approved);
        totalTerm.balance = Number(shortTerm.balance) + Number(longTerm.balance);
        totalTerm.variation = Number(totalTerm.approved) - Number(totalTerm.balance);

        dataResult.push(totalTerm);

        //servicio retorna Pignorados
        for (var i = 0; i < debtors.length; i++) {
            var partyId = debtors[i].customerNumberT24;
            if (partyId.length > 0) {
                let params = {
                    PartyId: partyId
                }
                let data = qs.stringify(params);
                try {
                    var result = await this.get(url.URL_CORE_PIGNORADO + "?" + data);
                    if (result.error !== undefined) {
                        return result;
                    }
                    //Armamos la data a mostrar en pantalla
                    result.Collaterals.CollateralInfo.map(function (item, i) {
                        if (item.AcctKey.AcctReference !== null && item.Collateral.InsuranceInfo.Status === "CUR") {
                            pledged.approved += Number(item.Collateral.CollateralAmt.Amt);
                            pledged.balance = pledged.approved;
                        }
                    })
                    pledged.variation = Number(pledged.approved) - Number(pledged.balance);

                }
                catch (err) {
                    console.error("URL_CORE_PIGNORADO", err);
                }
            }
        }
        dataResult.push(pledged);

        if (dataResult.length > 0) {
            netExposition.approved = Number(totalTerm.approved) - Number(pledged.approved);
            netExposition.proposal = Number(totalTerm.proposal) - Number(pledged.proposal);
            netExposition.variation = Number(totalTerm.variation) - Number(pledged.variation);

            dataResult.push(netExposition);
        }

        return dataResult;
    }

    //ExposicionCorporativa se le pasa el Numero de Cliente de T24
    async getCorporateExhibitionByClients(partyId) {

        const currencyData = new Currency();
        var dataResult = [];

        var longTerm = { name: "Facilidades Largo Plazo", approved: 0, balance: 0, proposal: 0, variation: 0 };
        var shortTerm = { name: "Facilidades Corto Plazo", approved: 0, balance: 0, proposal: 0, variation: 0 };
        var totalTerm = { name: "Total de Facilidades", approved: 0, balance: 0, proposal: 0, variation: 0 };
        var pledged = { name: "Monto Pignorado", approved: 0, balance: 0, proposal: 0, variation: 0 };
        var netExposition = { name: "Exposicion Neta", approved: 0, balance: 0, proposal: 0, variation: 0 };

        ////// Credit - Cortos Plazos       
        if (partyId.length > 0) {
            try {
                var params = { PartyId: partyId }
                var data = qs.stringify(params);

                //https://qa.api.ob.banesco.com.pa/party/v1/parties/credits?PartyId=600088018    
                //servicio retorna las cuentas del cliente
                var result = await this.get(url.URL_CORE_CREDITOS_LINE + "?" + data);
                if (result.error !== undefined) {
                    return result;
                }
                //var dataResults = result.Party.PartyInfo.CreditLine.filter(x => x.CreditLineId.split(".")[1].indexOf(facilityTypeCode) >= 0)

                if (Array.isArray(result.Party.PartyInfo.CreditLine)) {

                    result.Party.PartyInfo.CreditLine.forEach((item) => {
                        try {
                            /*
                            {
                        "AvailableAmt": {
                            "Amt": "75,000.00"
                        },
                        "CreditLineId": "800048231.0010000.01",
                        "CreditLineNum": "01",
                        "CreditType": {
                            "Desc": "Límite Global - rotativo"
                        },
                        "CurCode": "USD",
                        "IntRateType": {
                            "Desc": "Fixed"
                        },
                        "OnlineAmt": {
                            "Amt": "125000.00"
                        },
                        "PendingAmt": {
                            "Amt": "50,000.00"
                        },
                        "Rating": "01",
                        "SecuredAmt": {
                            "Amt": "0.00"
                        }
                    }
                            */

                            if ((item.CreditLineId.split(".")[1]).replace(/0/g, '').length < 2) {
                                var deudas = { debtype: "short", facilityType: item.CreditType.Desc, bank: "Banesco", balance: Number(currencyData.getRealValue(item.PendingAmt.Amt)), approved: Number(currencyData.getRealValue(item.OnlineAmt.Amt)), variation: Number(currencyData.getRealValue(item.PendingAmt.Amt)), startDate: moment().format("YYYY-MM-DD"), endDate: moment().format("YYYY-MM-DD") }
                                //deudas.variation=deudas.approvedAmount - deudas.balance;
                                if (moment(deudas.endDate).diff(deudas.startDate, 'years') > 1) {
                                    //deudas.debtype="long";     
                                    longTerm.approved += Number(deudas.approved);
                                    longTerm.balance += Number(deudas.variation);
                                }
                                else {
                                    shortTerm.approved += Number(deudas.approved);
                                    shortTerm.balance += Number(deudas.variation);
                                }
                            }
                        }
                        catch (err) { }
                    })
                }
                else {
                    // myVarToTest is not an array
                    //Armamos la data a mostrar en pantalla
                    var item = result.ConsultarAPCResponse.ConsultarAPCResult.DetCompromisoAPC.DetCompromisoAPC;
                    try {
                        if ((item.CreditLineId.split(".")[1]).replace(/0/g, '').length < 2) {
                            var deudas = { debtype: "short", facilityType: item.CreditType.Desc, bank: "Banesco", balance: Number(currencyData.getRealValue(item.PendingAmt.Amt)), approved: Number(currencyData.getRealValue(item.OnlineAmt.Amt)), variation: Number(currencyData.getRealValue(item.PendingAmt.Amt)), startDate: moment().format("YYYY-MM-DD"), endDate: moment().format("YYYY-MM-DD") }
                            //deudas.variation=deudas.approvedAmount - deudas.balance;
                            if (moment(deudas.endDate).diff(deudas.startDate, 'years') > 1) {
                                //deudas.debtype="long";     
                                longTerm.approved += Number(deudas.approved);
                                longTerm.balance += Number(deudas.variation);
                            }
                            else {
                                shortTerm.approved += Number(deudas.approved);
                                shortTerm.balance += Number(deudas.variation);
                            }
                        }
                    }
                    catch (err) { }
                }
            }
            catch (err) { }
        }

        ////// Tarjeta de Creditos - Cortos Plazos
        if (partyId.length > 0) {
            try {
                var result = await this.getCreditCard(partyId);
                if (result.error !== undefined) {
                    return result;
                }
                /*{
                    "facilityType": item.CardInfo.Desc, 
                    "approvedAmount": approvedAmt?.CurAmt??0,
                    "approvedDate": item.CardInfo.EndDt!==undefined?item.CardInfo.EndDt:moment().format("YYYY-MM-DD"), 
                    "actualBalance":  balanceAmt?.CurAmt??0,
                    "debtorName": item.CardInfo.EmbossInfo.FirstName + " " + item.CardInfo.EmbossInfo.LastName,
                    "AcctId": "",
                } */

                result.forEach(item => {
                    shortTerm.approved += Number(item.approvedAmount);
                    shortTerm.balance += Number(item.actualBalance);
                })
            }
            catch (err) { }
        }

        ////// loands - Cortos y Largos Plazos
        if (partyId.length > 0) {
            try {
                let params = {
                    PartyId: partyId
                }
                let data = qs.stringify(params);
                var result = await this.get(url.URL_CORE_FACILIDADES + "?" + data);
                if (result.error !== undefined) {
                    return result;
                }

                if (Array.isArray(result.AcctLoans.AcctLoan)) {

                    result.AcctLoans.AcctLoan.forEach((item) => {
                        if (item.AcctKey !== null) {
                            try {
                                /*
                                {
                        "Category": "01", 
                        "Desc": "340000071156",
                        "ProductDesc": "Prestamo Comercia",
                        "AcctOpeningInfo": {
                            "InitialAmt": {
                                "Amt": "120000.00",
                                "CurCode": "USD"
                            },
                            "OpenDt": "2019-08-02"
                        },
                        "CreditAcctData": {
                            "DueDt": "2028-07-05",
                            "CreditAcctPmtInfo": null
                        },
                        "AcctKey": {
                            "AcctId": "1020243542"
                        },
                        "AcctBal": [
                            {
                                "BalType": "Balance",
                                "CurAmt": {
                                    "Amt": "87245.92"
                                }
                            }
                        ],
                        "AcctMember": [
                            {
                                "PartyRole": {
                                    "Cod": "TITULAR/DEUDOR"
                                },
                                "PartyName": {
                                    "ShortName": "ASI DEVELOPMENT"
                                },
                                "PartyKey": null
                            }
                        ]
                    }
                                */

                                var deudas = { debtype: "short", facilityType: item.ProductDesc, bank: "Banesco", balance: Number(currencyData.getRealValue(item.AcctBal[0].CurAmt.Amt)), approved: Number(currencyData.getRealValue(item.AcctOpeningInfo.InitialAmt.Amt)), variation: 0, startDate: moment(item.AcctOpeningInfo.OpenDt).format("YYYY-MM-DD"), endDate: moment(item.CreditAcctData.DueDt).format("YYYY-MM-DD") }
                                deudas.variation = deudas.approved - deudas.balance;
                                if (moment(deudas.endDate).diff(deudas.startDate, 'years') > 1) {
                                    //deudas.debtype="long";     
                                    longTerm.approved += Number(deudas.approved);
                                    longTerm.balance += Number(deudas.balance);
                                }
                                else {
                                    shortTerm.approved += Number(deudas.approved);
                                    shortTerm.balance += Number(deudas.balance);
                                }
                            }
                            catch (err) { }
                        }
                    })
                }
                else {
                    // myVarToTest is not an array
                    //Armamos la data a mostrar en pantalla
                    var item = result.ConsultarAPCResponse.ConsultarAPCResult.DetCompromisoAPC.DetCompromisoAPC;
                    if (item.AcctKey !== null) {
                        try {
                            var deudas = { debtype: "short", facilityType: item.ProductDesc, bank: "Banesco", balance: Number(currencyData.getRealValue(item.AcctBal[0].CurAmt.Amt)), approved: Number(currencyData.getRealValue(item.AcctOpeningInfo.InitialAmt.Amt)), variation: 0, startDate: moment(item.AcctOpeningInfo.OpenDt).format("YYYY-MM-DD"), endDate: moment(item.CreditAcctData.DueDt).format("YYYY-MM-DD") }
                            deudas.variation = deudas.approved - deudas.balance;
                            if (moment(deudas.endDate).diff(deudas.startDate, 'years') > 1) {
                                //deudas.debtype="long";     
                                longTerm.approved += Number(deudas.approved);
                                longTerm.balance += Number(deudas.balance);
                            }
                            else {
                                shortTerm.approved += Number(deudas.approved);
                                shortTerm.balance += Number(deudas.balance);
                            }
                        }
                        catch (err) { }
                    }

                }
            }
            catch (err) { }
        }

        //servicio retorna Pignorados
        if (partyId.length > 0) {
            let params = {
                PartyId: partyId
            }
            let data = qs.stringify(params);
            try {
                var result = await this.get(url.URL_CORE_PIGNORADO + "?" + data);
                if (result.error !== undefined) {
                    return result;
                }
                //Armamos la data a mostrar en pantalla
                result.Collaterals.CollateralInfo.map(function (item, i) {
                    if (item.AcctKey.AcctReference !== null && item.Collateral.InsuranceInfo.Status === "CUR") {
                        pledged.approved += Number(item.Collateral.CollateralAmt.Amt);
                        pledged.balance = pledged.approved;
                    }
                })
                pledged.variation = Number(pledged.approved) - Number(pledged.balance);
            }
            catch (err) {
                console.error("URL_CORE_PIGNORADO", err);
            }
        }

        longTerm.variation = Number(longTerm.approved) - Number(longTerm.balance);
        shortTerm.variation = Number(shortTerm.approved) - Number(shortTerm.balance);

        dataResult.push(longTerm);
        dataResult.push(shortTerm);

        totalTerm.approved = Number(shortTerm.approved) + Number(longTerm.approved);
        totalTerm.balance = Number(shortTerm.balance) + Number(longTerm.balance);
        totalTerm.variation = Number(totalTerm.approved) - Number(totalTerm.balance);

        netExposition.approved = Number(totalTerm.approved) - Number(pledged.approved);
        netExposition.proposal = Number(totalTerm.proposal) - Number(pledged.proposal);
        netExposition.variation = Number(totalTerm.variation) - Number(pledged.variation);

        dataResult.push(totalTerm);
        dataResult.push(pledged);
        dataResult.push(netExposition);

        return dataResult;
    }


    //ExposicionCorporativa se le pasa el Numero de Cliente de T24
    /*async getCorporateExhibitionByClients(partyId) {

        if (partyId.length <= 0) {
            return undefined;
        }

        let clients = await this.getRelatedClients(partyId);
        if (clients.error !== undefined) {
            return clients;
        }

        var dataResult = [];
        for (var i = 0; i < clients.length; i++) {
            let result = await this.getCorporateExhibition(clients[i]);
            if (result.error !== undefined) {
                return result;
            }

            if (result !== null && result.length > 0) {
                dataResult.push({ clientId: "Cliente: " + clients[i], data: result });
            }
        }
        return dataResult;
    }
    */

    //Deudas a Corto y Largo Plazo --- APC, Credit, Loand del Tramite Completo    
    async getAllTermDebtsByTransaction(transactId) {

        var debtors = await this.backendServices.consultarDeudores(transactId);
        if (debtors !== null && debtors !== undefined) {

            var result = { longTermresult: [], shortTermresult: [] };
            for (var i = 0; i < debtors.length; i++) {
                try {
                    var dataResult = await this.getAllTermDebts(debtors[i].customerNumberT24, debtors[i].clientDocId, debtors[i].idType);
                    if (dataResult !== null && dataResult !== undefined) {
                        dataResult.longTermresult.forEach(function (item) {
                            result.longTermresult.push(item);
                        });
                        dataResult.shortTermresult.forEach(function (item) {
                            result.shortTermresult.push(item);
                        });
                    }
                }
                catch (err) { }
            }

            return result;
        }

        return undefined;
    }

    //Deudas a Corto y Largo Plazo --- APC, Credit, Loand
    async getAllTermDebts(partyId, identification, idType) {

        const currencyData = new Currency();

        if (partyId.length <= 0) {
            return undefined;
        }

        if (identification.length <= 0) {
            return undefined;
        }

        var dataResult = { longTermresult: [], shortTermresult: [] };

        ////// APC
        try {
            let typeofId = "Cedula";
            switch (idType) {
                case "CED": {
                    typeofId = "Cedula";
                    break;
                }
                case "RUC": {
                    typeofId = "RUC";
                    break;
                }
                case "PAS": {
                    typeofId = "Pasaporte";
                    break;
                }
            }
            var tmpidentification = "";
            identification.split('-').map((str) => {
                if (str.startsWith("0")) {
                    tmpidentification += str.replace(/^0+/, '') + "-";
                }
                else {
                    tmpidentification += str + "-";
                }
            })
            if (tmpidentification.startsWith("-")) {
                tmpidentification = tmpidentification.substring(1);
            }

            identification = tmpidentification.substring(0, tmpidentification.length - 1);
            var params = {
                "ConsultarAPC": {
                    "Model": {
                        "EsPrueba": 0,
                        "ForzarBusqueda": 0,
                        "IdentificacionConsulta": identification,//"8-773-1899",
                        "PasswordAPC": "Banesco19.",
                        "TipoCliente": typeofId,
                        "UltimusProcess": 7,
                        "UsuarioAPC": "WTIBANESCO001"
                    }
                }
            }

            //servicio retorna la info de APC del cliente
            const result = await this.post(url.URL_CORE_APCINFO, params);

            if (Array.isArray(result.ConsultarAPCResponse.ConsultarAPCResult.DetCompromisoAPC.DetCompromisoAPC)) {
                // myVatToTest is an array
                //Armamos la data a mostrar en pantalla
                result.ConsultarAPCResponse.ConsultarAPCResult.DetCompromisoAPC.DetCompromisoAPC.map(function (item, i) {
                    try {
                        if (item.dc_nom_asoc.toUpperCase().indexOf('BANESCO') < 0 && item.dc_descr_corta_rela.toUpperCase().indexOf('SERVICIOS') < 0) {
                            console.log("ServicioAPC", item.dc_nom_asoc)
                            var deudas = { paymentHistory: item.dc_historia, debtype: "short", facilityType: item.dc_descr_corta_rela, bank: item.dc_nom_asoc, balance: Number(currencyData.getRealValue(item.dc_saldo_actual)), approvedAmount: Number(currencyData.getRealValue(item.dc_monto_original)), variation: 0, startDate: item.dc_fec_inicio_rel, endDate: item.dc_fec_fin_rel,codeT24:item?.dc_codigo??"",dateT24:item?.dc_fec_actualizacion??"" }
                            deudas.variation = deudas.approvedAmount - deudas.balance;
                            if (moment(deudas.endDate).diff(deudas.startDate, 'years') > 1 && item.dc_descr_corta_rela.toUpperCase().indexOf('TARJ') < 0) {
                                deudas.debtype = "long";
                                dataResult.longTermresult.push(deudas)
                            }
                            else {
                                dataResult.shortTermresult.push(deudas)
                            }
                            deudas.endDate = moment(deudas.endDate).format("YYYY-MM-DD")
                            deudas.startDate = moment(deudas.startDate).format("YYYY-MM-DD")
                            deudas.codeT24 = item.dc_codigo
                            deudas.dateT24 =moment(item.dc_fec_actualizacion).format("YYYY-MM-DD")
                        }
                    }
                    catch (err) { }
                })
            }
            else {
                // myVarToTest is not an array
                //Armamos la data a mostrar en pantalla
                var item = result.ConsultarAPCResponse.ConsultarAPCResult.DetCompromisoAPC.DetCompromisoAPC;
                try {
                    if (item.dc_nom_asoc.toUpperCase().indexOf('BANESCO') < 0 && item.dc_descr_corta_rela.toUpperCase().indexOf('SERVICIOS') < 0) {
                        var deudas = { paymentHistory: item.dc_historia, debtype: "short", facilityType: item.dc_descr_corta_rela, bank: item.dc_nom_asoc, balance: Number(currencyData.getRealValue(item.dc_saldo_actual)), approvedAmount: Number(currencyData.getRealValue(item.dc_monto_original)), variation: 0, startDate: item.dc_fec_inicio_rel, endDate: item.dc_fec_fin_rel,codeT24:item?.dc_codigo??"",dateT24:item?.dc_fec_actualizacion??"" }
                        deudas.variation = deudas.approvedAmount - deudas.balance;
                        if (moment(deudas.endDate).diff(deudas.startDate, 'years') > 1 && item.dc_descr_corta_rela.toUpperCase().indexOf('TARJ') < 0) {
                            deudas.debtype = "long";
                            dataResult.longTermresult.push(deudas)
                        }
                        else {
                            dataResult.shortTermresult.push(deudas)
                        }
                        deudas.endDate = moment(deudas.endDate).format("YYYY-MM-DD")
                        deudas.startDate = moment(deudas.startDate).format("YYYY-MM-DD")
                        deudas.codeT24 = item.dc_codigo
                        deudas.dateT24 =moment(item.dc_fec_actualizacion).format("YYYY-MM-DD")
                    }
                }
                catch (err) { }
            }
        }
        catch (err) { }

        ////// Credit - Cortos Plazos
        try {
            var params = { PartyId: partyId }
            var data = qs.stringify(params);

            //https://qa.api.ob.banesco.com.pa/party/v1/parties/credits?PartyId=600088018    
            //servicio retorna las cuentas del cliente
            var result = await this.get(url.URL_CORE_CREDITOS_LINE + "?" + data);

            if (Array.isArray(result.Party.PartyInfo.CreditLine)) {

                result.Party.PartyInfo.CreditLine.forEach((item) => {
                    try {
                        
                        console.log("PartyInfo",item);
                        /*
                        {
                    "AvailableAmt": {
                        "Amt": "75,000.00"
                    },
                    "CreditLineId": "800048231.0010000.01",
                    "CreditLineNum": "01",
                    "CreditType": {
                        "Desc": "Límite Global - rotativo"
                    },
                    "CurCode": "USD",
                    "IntRateType": {
                        "Desc": "Fixed"
                    },
                    "OnlineAmt": {
                        "Amt": "125000.00"
                    },
                    "PendingAmt": {
                        "Amt": "50,000.00"
                    },
                    "Rating": "01",
                    "SecuredAmt": {
                        "Amt": "0.00"
                    }
                }
                        */
                        var deudas = { paymentHistory: "", debtype: "short", facilityType: item.CreditType.Desc, bank: "Banesco", balance: Number(currencyData.getRealValue(item.PendingAmt.Amt)), approvedAmount: Number(currencyData.getRealValue(item.OnlineAmt.Amt)), variation: Number(currencyData.getRealValue(item.PendingAmt.Amt)), startDate: moment().format("YYYY-MM-DD"), endDate: moment().format("YYYY-MM-DD") }
                        //deudas.variation=deudas.approvedAmount - deudas.balance;

                        if ((item.CreditLineId.split(".")[1]).replace(/0/g, '').length < 2) {
                            if (moment(deudas.endDate).diff(deudas.startDate, 'years') > 1) {
                                deudas.debtype = "long";
                                dataResult.longTermresult.push(deudas)
                            }
                            else {
                                dataResult.shortTermresult.push(deudas)
                            }

                            deudas.endDate = moment(deudas.endDate).format("YYYY-MM-DD")
                            deudas.startDate = moment(deudas.startDate).format("YYYY-MM-DD")
                            deudas.codeT24 = item.CreditLineId
                            deudas.dateT24 =moment().format("YYYY-MM-DD")
                        }
                    }
                    catch (err) { }
                })
            }
            else {
                // myVarToTest is not an array
                //Armamos la data a mostrar en pantalla
                var item = result.ConsultarAPCResponse.ConsultarAPCResult.DetCompromisoAPC.DetCompromisoAPC;
                try {

                    var deudas = { paymentHistory: "", debtype: "short", facilityType: item.CreditType.Desc, bank: "Banesco", balance: Number(currencyData.getRealValue(item.PendingAmt.Amt)), approvedAmount: Number(currencyData.getRealValue(item.OnlineAmt.Amt)), variation: Number(currencyData.getRealValue(item.PendingAmt.Amt)), startDate: moment().format("YYYY-MM-DD"), endDate: moment().format("YYYY-MM-DD") }
                    //deudas.variation=deudas.approvedAmount - deudas.balance;
                    if ((item.CreditLineId.split(".")[1]).replace(/0/g, '').length < 2) {
                        if (moment(deudas.endDate).diff(deudas.startDate, 'years') > 1) {
                            deudas.debtype = "long";
                            dataResult.longTermresult.push(deudas)
                        }
                        else {
                            dataResult.shortTermresult.push(deudas)
                        }

                        deudas.endDate = moment(deudas.endDate).format("YYYY-MM-DD")
                        deudas.startDate = moment(deudas.startDate).format("YYYY-MM-DD")
                        deudas.codeT24 = item.CreditLineId
                        deudas.dateT24 =moment().format("YYYY-MM-DD")
                    }
                }
                catch (err) { }
            }
        }
        catch (err) { }

        /// Tarjetas de Creditos
        try {
            var result = await this.getCreditCard(partyId);
            if (Array.isArray(result)) {

                /*{
                                        "facilityType": item.CardInfo.Desc, 
                                        "approvedAmount": approvedAmt?.CurAmt??0,
                                        "approvedDate": item.CardInfo.EndDt!==undefined?item.CardInfo.EndDt:moment().format("YYYY-MM-DD"), 
                                        "actualBalance":  balanceAmt?.CurAmt??0,
                                        "debtorName": item.CardInfo.EmbossInfo.FirstName + " " + item.CardInfo.EmbossInfo.LastName,
                                        "AcctId": "",
                                    } */
                result.forEach((item,idx) => {
                    try {
                        var deudas = { paymentHistory: "", debtype: "short", facilityType: item.facilityType, bank: "Banesco", balance: Number(currencyData.getRealValue(item.actualBalance)), approvedAmount: Number(currencyData.getRealValue(item.approvedAmount)), variation: Number(currencyData.getRealValue(0)), startDate: moment().format("YYYY-MM-DD"), endDate: moment().format("YYYY-MM-DD") }
                        //deudas.variation=deudas.approvedAmount - deudas.balance;

                        dataResult.shortTermresult.push(deudas)
                        deudas.endDate = moment(deudas.endDate).format("YYYY-MM-DD")
                        deudas.startDate = moment(item.approvedDate).format("YYYY-MM-DD")
                        deudas.codeT24 = idx
                        deudas.dateT24 =moment().format("YYYY-MM-DD")
                    }
                    catch (err) { }
                })
            }
            else {
                // myVarToTest is not an array
                //Armamos la data a mostrar en pantalla
                var item = result;
                try {

                    var deudas = { paymentHistory: "", debtype: "short", facilityType: item.facilityType, bank: "Banesco", balance: Number(currencyData.getRealValue(item.actualBalance)), approvedAmount: Number(currencyData.getRealValue(item.approvedAmount)), variation: Number(currencyData.getRealValue(0)), startDate: moment().format("YYYY-MM-DD"), endDate: moment().format("YYYY-MM-DD") }
                    //deudas.variation=deudas.approvedAmount - deudas.balance;

                    dataResult.shortTermresult.push(deudas)
                    deudas.endDate = moment(deudas.endDate).format("YYYY-MM-DD")
                    deudas.startDate = moment(item.approvedDate).format("YYYY-MM-DD")
                    deudas.codeT24 = 1
                    deudas.dateT24 =moment().format("YYYY-MM-DD")
                }
                catch (err) { }
            }
        }
        catch (err) { }

        ////// loands - Cortos y Largos Plazos
        try {
            let params = {
                PartyId: partyId
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_FACILIDADES + "?" + data);
            console.log("shortTermresultLoands", result);

            if (Array.isArray(result.AcctLoans.AcctLoan)) {

                result.AcctLoans.AcctLoan.forEach((item) => {
                    if (item.AcctKey !== null) {
                        try {
                            /*
                            {
                    "Category": "01",
                    "Desc": "340000071156",
                    "ProductDesc": "Prestamo Comercia",
                    "AcctOpeningInfo": {
                        "InitialAmt": {
                            "Amt": "120000.00",
                            "CurCode": "USD"
                        },
                        "OpenDt": "2019-08-02"
                    },
                    "CreditAcctData": {
                        "DueDt": "2028-07-05",
                        "CreditAcctPmtInfo": null
                    },
                    "AcctKey": {
                        "AcctId": "1020243542"
                    },
                    "AcctBal": [
                        {
                            "BalType": "Balance",
                            "CurAmt": {
                                "Amt": "87245.92"
                            }
                        }
                    ],
                    "AcctMember": [
                        {
                            "PartyRole": {
                                "Cod": "TITULAR/DEUDOR"
                            },
                            "PartyName": {
                                "ShortName": "ASI DEVELOPMENT"
                            },
                            "PartyKey": null
                        }
                    ]
                }
                            */

                            var deudas = { paymentHistory: "", debtype: "short", facilityType: item.ProductDesc, bank: "Banesco", balance: Number(currencyData.getRealValue(item.AcctBal[0].CurAmt.Amt)), approvedAmount: Number(currencyData.getRealValue(item.AcctOpeningInfo.InitialAmt.Amt)), variation: 0, startDate: moment(item.AcctOpeningInfo.OpenDt).format("YYYY-MM-DD"), endDate: moment(item.CreditAcctData.DueDt).format("YYYY-MM-DD") }
                            deudas.variation = deudas.approvedAmount - deudas.balance;
                            if (moment(deudas.endDate).diff(deudas.startDate, 'years') > 1) {
                                deudas.debtype = "long";
                                dataResult.longTermresult.push(deudas)
                            }
                            else {
                                // dataResult.shortTermresult.push(deudas)                    
                            }

                            deudas.endDate = moment(deudas.endDate).format("YYYY-MM-DD")
                            deudas.startDate = moment(deudas.startDate).format("YYYY-MM-DD")
                            deudas.codeT24 = item.AcctKey.AcctId
                            deudas.dateT24 =moment().format("YYYY-MM-DD")
                        }
                        catch (err) { }
                    }
                })
            }
            else {
                // myVarToTest is not an array
                //Armamos la data a mostrar en pantalla
                var item = result.ConsultarAPCResponse.ConsultarAPCResult.DetCompromisoAPC.DetCompromisoAPC;
                if (item.AcctKey !== null) {
                    try {

                        var deudas = { paymentHistory: "", debtype: "short", facilityType: item.ProductDesc, bank: "Banesco", balance: Number(currencyData.getRealValue(item.AcctBal[0].CurAmt.Amt)), approvedAmount: Number(currencyData.getRealValue(item.AcctOpeningInfo.InitialAmt.Amt)), variation: 0, startDate: moment(item.AcctOpeningInfo.OpenDt).format("YYYY-MM-DD"), endDate: moment(item.CreditAcctData.DueDt).format("YYYY-MM-DD") }
                        deudas.variation = deudas.approvedAmount - deudas.balance;
                        if (moment(deudas.endDate).diff(deudas.startDate, 'years') > 1) {
                            deudas.debtype = "long";
                            dataResult.longTermresult.push(deudas)
                        }
                        else {
                            //dataResult.shortTermresult.push(deudas)                    
                        }

                        deudas.endDate = moment(deudas.endDate).format("YYYY-MM-DD")
                        deudas.startDate = moment(deudas.startDate).format("YYYY-MM-DD")
                        deudas.codeT24 = item.AcctKey.AcctId
                        deudas.dateT24 =moment().format("YYYY-MM-DD")
                    }
                    catch (err) { }
                }

            }
        }
        catch (err) { }

        return dataResult;
    }

    //Tarjetas de Credito
    async getCreditCardByTransaction(transactId) {

        var debtors = await this.backendServices.consultarDeudores(transactId);
        if (debtors !== null && debtors !== undefined) {

            var result = [];
            for (var i = 0; i < debtors.length; i++) {
                try {
                    var dataResult = await this.getCreditCard(debtors[i].customerNumberT24);
                    if (dataResult !== null && dataResult !== undefined) {
                        dataResult.forEach(function (item) {
                            result.push(item);
                        });
                    }
                }
                catch (err) { }
            }
            console.log("getCreditCardByTransaction", result);

            return result;
        }

        return undefined;
    }
    async getCreditCard(partyId) {

        const currencyData = new Currency();

        if (partyId.length <= 0) {
            return undefined;
        }

        var data = {
            "readCardTDC_Rq": {
                "MsgHdr": {
                    "TransactionInfo": {
                        "MsgUID": "F01F1A70-30E0-4478-B95F-987D78A10037",
                        "ChannelId": "CC",
                        "AgencyCode": 5808,
                        "OrderDprt": "5808-001",
                        "TransactionDate": moment().format("YYYY-MM-DD"),//"2021-12-12",
                        "TransactionTime": "12:12:12"
                    },
                    "ApplicationInfo": {
                        "SourceApp": "ESB",
                        "Channel": "WAY4"
                    }
                },
                "Customer": {
                    "Type": "Personal",
                    "PersonInfo": {
                        "Type": "Personal",
                        "CustId": partyId
                    }
                }
            }
        }

        var dataResult = [];

        ////// Tarjeta de Creditos
        try {

            var result = await this.post(url.URL_CORE_CreditCard, data);
            console.log("shortTermresultCredit", result);

            if (Array.isArray(result.readCardTDC_Rs.Customer.Product)) {

                result.readCardTDC_Rs.Customer.Product.forEach((item) => {
                    try {

                        if ((item.CardInfo.Type === "E" && item.CardInfo.RelationType === "Y") || (item.CardInfo.Type === "I" && item.CardInfo.RelationType === "Y") || (item.CardInfo.Type === "Y" && item.CardInfo.RelationType === "Y")) {
                            var approvedAmt = item.Statement.StatementInfo.find(x => x.Type === "CR_LIMIT");
                            var balanceAmt = item.Statement.StatementInfo.find(x => x.Type === "TOTAL_BALANCE");

                            dataResult.push({
                                "facilityType": item.CardInfo.Desc,
                                "approvedAmount": approvedAmt?.CurAmt ?? 0,
                                "approvedDate": item.CardInfo.EndDt !== undefined ? item.CardInfo.EndDt : moment().format("YYYY-MM-DD"),
                                "actualBalance": balanceAmt?.CurAmt ?? 0,
                                "debtorName": item.CardInfo.EmbossInfo.FirstName + " " + item.CardInfo.EmbossInfo.LastName,
                                "AcctId": ""
                            });
                        }

                        /* if(item.CardInfo.Desc.toUpperCase().indexOf('CREDITO') > 0){
                             dataResult.push({
                                 "facilityType": item.CardInfo.Desc, "approvedAmount": approvedAmt?.CurAmt??0,
                                 "approvedDate": item.CardInfo.EndDt!==undefined?item.CardInfo.EndDt:moment().format("YYYY-MM-DD"), "actualBalance":  balanceAmt?.CurAmt??0,
                                 "debtorName": item.CardInfo.EmbossInfo.FirstName + " " + item.CardInfo.EmbossInfo.LastName,
                                 "AcctId": "",
                             });   
                         } */

                    }
                    catch (err) { console.log("getCreditCard", err); }
                })
            }
            else {
                // myVarToTest is not an array
                //Armamos la data a mostrar en pantalla
                var item = result.readCardTDC_Rs.Customer.Product;
                try {

                    var approvedAmt = item.Statement.StatementInfo.find(x => x.Type === "AVAILABLE");
                    var balanceAmt = item.Statement.StatementInfo.find(x => x.Type === "TOTAL_BALANCE");

                    if (item.CardInfo.Desc.toUpperCase().indexOf('CREDITO') > 0) {
                        dataResult.push({
                            "facilityType": item.CardInfo.Desc,
                            "approvedAmount": approvedAmt?.CurAmt ?? 0,
                            "approvedDate": item.CardInfo.EndDt !== undefined ? item.CardInfo.EndDt : moment().format("YYYY-MM-DD"),
                            "actualBalance": balanceAmt?.CurAmt ?? 0,
                            "debtorName": item.CardInfo.EmbossInfo.FirstName + " " + item.CardInfo.EmbossInfo.LastName,
                            "AcctId": "",
                        });
                    }
                }
                catch (err) { }
            }
        }
        catch (err) { }

        return dataResult;
    }


    /* ---------------------------------------------------------------------------------------------- */
    /*                                 Retorna los balances por meses                                 */
    /* ---------------------------------------------------------------------------------------------- */
    async getAverages(AcctReference) {
        if (AcctReference.length <= 0) {
            return undefined;
        }

        let params = {
            AcctReference: AcctReference
        }
        let data = qs.stringify(params);
        var result = await this.get(url.URL_CORE_AVERAGES + "?" + data);

        return result;
    }
    /* ---------------------------------------------------------------------------------------------- */
    /*                     Obtenemos una lista de las importaciones que se generen                    */
    /* ---------------------------------------------------------------------------------------------- */
    async getListaImportaciones(PartyId) {
        if (PartyId.length <= 0) {
            return undefined;
        }

        let params = {
            PartyId: PartyId
        }
        let data = qs.stringify(params);
        var result = await this.get(url.URL_CORE_IMPORTACIONES + "?" + data);

        return result;
    }
    /* ---------------------------------------------------------------------------------------------- */
    /*                 Obtenemos una lista de las exportaciones que se hayan generado                 */
    /* ---------------------------------------------------------------------------------------------- */
    async getListaExportaciones(PartyId) {

        if (PartyId.length <= 0) {
            return undefined;
        }

        let params = {
            PartyId: PartyId
        }
        let data = qs.stringify(params);
        var result = await this.get(url.URL_CORE_EXPORTACIONES + "?" + data);

        return result;
    }
    /* ---------------------------------------------------------------------------------------------- */
    /*                          Obtenemos los prestamos entrantes existentes                          */
    /* ---------------------------------------------------------------------------------------------- */
    async getPrestamosEntrantes(PartyId) {

        if (PartyId.length <= 0) {
            return undefined;
        }

        let params = {
            PartyId: PartyId
        }
        let data = qs.stringify(params);
        var result = await this.get(url.URL_CORE_INGOING + "?" + data);

        return result;
    }
    /* ---------------------------------------------------------------------------------------------- */
    /*                    Obtenemos una lista de todos los presstamos que ya salen                    */
    /* ---------------------------------------------------------------------------------------------- */
    async getPrestamosSalientes(PartyId) {

        if (PartyId.length <= 0) {
            return undefined;
        }

        let params = {
            PartyId: PartyId
        }
        let data = qs.stringify(params);
        var result = await this.get(url.URL_CORE_OUTOGOING + "?" + data);

        return result;
    }
    /* ---------------------------------------------------------------------------------------------- */
    /*               Obtenemos la lista de creditos que existen en la actualidad activos              */
    /* ---------------------------------------------------------------------------------------------- */
    async getCreditosExistentes(PartyId) {

        if (PartyId.length <= 0) {
            return undefined;
        }

        let params = {
            PartyId: PartyId
        }
        let data = qs.stringify(params);
        var result = await this.get(url.URL_CORE_CREDITOS + "?" + data);

        return result;
    }
    /* ---------------------------------------------------------------------------------------------- */
    /*                                        Creditos en linea                                       */
    /* ---------------------------------------------------------------------------------------------- */
    async getCreditosLine(PartyId) {

        if (PartyId.length <= 0) {
            return undefined;
        }

        let params = {
            PartyId: PartyId
        }
        let data = qs.stringify(params);
        var result = await this.get(url.URL_CORE_CREDITOS_LINE + "?" + data);

        return result;
    }
    /* ---------------------------------------------------------------------------------------------- */
    /*     Nos devuelve todas las transacciones que ha realizado el usuario por un rango de fechas    */
    /* ---------------------------------------------------------------------------------------------- */
    async getTransactions(AcctId, EndDt, StartDt) {

        if (AcctId.length <= 0 || EndDt.length <= 0 || StartDt.length <= 0) {
            return undefined;
        }

        // ejemplo del dataField
        // AcctId=1001553287&EndDt=2021-10-16T09:32:51&StartDt=2021-09-16T00:00:00
        let params = {
            AcctId: AcctId,
            EndDt: EndDt,
            StartDt: StartDt,
        }
        let data = qs.stringify(params);
        var result = await this.get(url.URL_CORE_TRANSACCTIONS + "?" + data);

        return result;
    }
    /* ---------------------------------------------------------------------------------------------- */
    /*                                  Obtenemos todos los prestamos                                 */
    /* ---------------------------------------------------------------------------------------------- */
    async getPrestamos(PartyId) {

        if (PartyId.length <= 0) {
            return undefined;
        }

        let params = {
            PartyId: PartyId
        }
        let data = qs.stringify(params);
        var result = await this.get(url.URL_CORE_PRESTAMOS + "?" + data);

        return result;
    }
    /* ---------------------------------------------------------------------------------------------- */
    /*               Obtenemos toda la informacion del prestamos dentro de una actividad              */
    /* ---------------------------------------------------------------------------------------------- */
    //Detalle Facilidad
    async getFacilityInfo(AcctId) {
        try {

            if (AcctId.length <= 0) {
                return null;
            }

            let params = {
                AcctId: AcctId
            }
            let data = qs.stringify(params);

            var result = await this.get(url.URL_CORE_PRESTAMOS_INFORMATION + "?" + data);

            /*
            {
        "AcctLoan": {
            "AcctSubtype": {
                "Cod": "3200"
            },
            "AutonomyCode": "0201",
            "AutonomyUser": "38",
            "Category": "COMMERCIAL.CHILD",
            "ClosedDt": "2022-05-30",
            "CurCode": "USD",
            "FIData": {
                "Agency": {
                    "AgencyIdent": "PA0010062"
                }
            },
            "PrinProperty": "PRINCIPALINT",
            "SubCategory": "1614",
            "AcctKey": {
                "AcctId": "AA19214M07G3"
            },
            "IntRateData": {
                "IntDayBasis": "B",
                "IntRate": 6.75
            },
            "AcctBal": [
                {
                    "BalType": "FECIBalance",
                    "CurAmt": {
                        "Amt": "1009.71"
                    }
                },
                {
                    "BalType": "PrincipalBalance",
                    "CurAmt": {
                        "Amt": "44113.66"
                    }
                },
                {
                    "BalType": "InterestBalance",
                    "CurAmt": {
                        "Amt": "6807.90"
                    }
                }
            ],
            "CreditAcctData": {
                "AuthType": "13",
                "CodeDestination": "PA08",
                "CountryDestination": "PA",
                "CreditDestination": "LOCAL",
                "FeciProperty": true,
                "FundsPurpose": "3228",
                "IntFeci": 1,
                "LatePenalty": true,
                "OriginationDt": "2019-08-02",
                "RefinanceDate": "2021-04-29",
                "RefinanceNum": "1020096515",
                "SourceSales": {
                    "Cod": "16"
                },
                "Charge": [
                    {
                        "ChargeType": "FIXED",
                        "CurAmt": {
                            "Amt": "0.00",
                            "CurCode": "USD"
                        }
                    }
                ],
                "Term": {
                    "ProposedTerm": "1031D"
                },
                "CreditAcctPmtInfo": {
                    "NextPmtDt": "2022-05-30",
                    "PmtMethod": "DC"
                },
                "CreditRegularPmt": [
                    {
                        "PmtClass": "DUE DUE DUE",
                        "PmtType": "INTEREST INTEREST LINEAR"
                    }
                ],
                "SettleInstruction": {
                    "PayIn": {
                        "PayInAcctRef": [
                            {
                                "PayInAcct": {
                                    "AcctId": "1000141368"
                                }
                            }
                        ]
                    }
                }
            },
            "AcctOpeningInfo": {
                "EffDt": "2019-08-02",
                "InitialAmt": {
                    "Amt": "44113.66"
                },
                "SaleOfficer": "0630"
            }
        },
        "Party": {
            "PartyKey": [
                {
                    "PartyId": "600088018"
                }
            ]
        },
        "Status": {
            "StatusCode": "M0000",
            "StatusDesc": "OK"
        }
    }
            */

            return result?.AcctLoan;
        }
        catch (err) { }
        return null;
    }

    /* ---------------------------------------------------------------------------------------------- */
    /*               Obtenemos toda la informacion del Reporting Services                            */
    /* ---------------------------------------------------------------------------------------------- */

    //https://qa.api.ob.banesco.com.pa/APIUtil/v1/reports/atoms?FECHA=20210930&CLIENTE=600167424

    async getReportingServices(partyId) { //partyId -> numero del cliente en T24

        if (partyId === undefined || partyId === null || partyId.length <= 0) {
            return undefined;
        }

        let params = {
            FECHA: moment().add(-1, 'months').format("YYYYMM") + "01", //preguntar pq la fecha no se puede cambiar
            CLIENTE: partyId
        }
        let data = qs.stringify(params);

        var result = await this.get(url.URL_CORE_REPORTINGSERVICES + "?" + data);


        return result;

        /*{
    "records": [
        {
            "FECHA": "20210930",
            "T_CREDITO": "002",
            "T_FACILIDAD": "05",
            "CLASIFICACION": "02",
            "LOC_EXT": "L",
            "REGION": "014",
            "CLIENTE_RUC": "8-805-442",
            "TNO_EMPRESA": "06",
            "NOMBRE_CLIENTE": "ROBERTO ANTONIO SANCHEZ CONCEPCION",
            "GRUPO_ECON": "ROBERTO ANTONIO SANCHEZ CONCEPCION",
            "GRUPO_RUC": "8-805-442",
            "T_RELACION": "P999",
            "ACT_ECON": "2103",
            "TASA_INT": "10.5",
            "MONTO_IN": 5400,
            "INT_PC": 0,
            "FECHA_INI": "20150616",
            "FECHA_FIN": "20230116",
            "FECHA_REFIN": "NA",
            "FECHA_RENEG": "20200817",
            "G1": "0701",
            "MONTO_G1": 0,
            "G2": "NA",
            "MONTO_G2": 0,
            "G3": "NA",
            "MONTO_G3": 0,
            "G4": "NA",
            "MONTO_G4": 0,
            "G5": "NA",
            "MONTO_G5": 0,
            "PROV_REG": 0,
            "PROV_NIIF": 119.05,
            "PROV_PAIS": 0,
            "SALDO": 6401.61,
            "N_CUOTAS_VENCER": "7",
            "X_VENCER30": "100.86",
            "X_VENCER60": "100.86",
            "X_VENCER90": "100.86",
            "X_VENCER120": "100.86",
            "X_VENCER180": "100.86",
            "X_VENCER1A": "100.86",
            "X_VENCER5A": "5796.45",
            "X_VENCER10A": "0.00",
            "X_VENCERM10A": "0.00",
            "N_CUOTA_VENCIDAS": "0",
            "VENCIDOS30": "0.00",
            "VENCIDOS60": "0.00",
            "VENCIDOS90": "0.00",
            "VENCIDOS120": "0.00",
            "VENCIDOS180": "0.00",
            "VENCIDOS1A": "0.00",
            "VENCIDOSM1A": "0.00",
            "RANGO_MORA": "1. Al día",
            "DIAS_MORA": 0,
            "PROX_CAP": "20211016",
            "PER_CAP": "01",
            "PROX_INT": "20211016",
            "PER_INT": "01",
            "CUOTA_XPAGAR": "100.86",
            "SUCURSAL": "201",
            "MONEDA": "USD",
            "CUENTA_CONTABLE": "",
            "PRODUCTO": "TDC",
            "BANCA": "",
            "SECTOR1": "PRESTACARD",
            "SECTOR2": "",
            "SECTOR3": "",
            "SECTOR4": "PRESTACARD",
            "PRODUCTO1": "TARJETA DE CREDITO CONSUMO",
            "PRODUCTO2": "TDC",
            "PRODUCTO3": "Prestacard Visa",
            "NUM_OPS": "4466840182907004",
            "NUM_CLIENTE": "600167424",
            "CENTRO_COSTO": "",
            "NUM_LINEA": "",
            "COD_OFIC": "",
            "COD_OFIC2": "",
            "INGRESO": 0,
            "SEGMENTO": "",
            "TIPO_PAGO": "",
            "PUNTAJE": 0,
            "FECHA_ULT_PAGO_CAPITAL": "20200304",
            "CATEGORIA_CAMBIO": "03",
            "MONTO_ULT_PAGO_CAPITAL": 69.2,
            "FECHA_ULT_PAGO_INTERES": "20200304",
            "MONTO_ULT_PAGO_INTERES": 82.8,
            "STAGE": 2,
            "PROXIMO_CAP_HIST": "20211016",
            "PROXIMO_INT_HIS": "20211016"
        }
    ],
    "Status": {
        "StatusCode": "M0000",
        "StatusDesc": "SUCCESS"
    }
}*/
    }


    //Retorna todos los colateralsId por numero de cliente
    async getColaterals(partyId) { //Numero del cliente en T24

        if (partyId.length <= 0) {
            return undefined;
        }

        let params = {
            PartyId: partyId
        }

        let data = qs.stringify(params);

        var dataResult = [];
        try {

            console.log("plage");

            //servicio retorna Pignorados
            var result = await this.get(url.URL_CORE_PIGNORADO + "?" + data);

            //Armamos la data a mostrar en pantalla
            result.Collaterals.CollateralInfo.map(function (item, i) {
                if (item.Collateral.CollateralKey.CollateralId !== null) {
                    dataResult.push({ collateralId: item.Collateral.CollateralKey.CollateralId, facilityAmt: item.Collateral.CollateralAmt.Amt });
                }

            })
        }
        catch (err) {
            console.error("URL_CORE_PIGNORADO", err);
        }

        console.log("dataResult", dataResult);
        return dataResult;
    }

    // retorna Detalle de Garantias
    async getWarrantyDetails(collateralId, warrantyType) { //Numero del id colateral ... warrytype = Muebles, Inmuebles, Otros, Depositos

        if (collateralId.length <= 0 || warrantyType.length <= 0) {
            return undefined;
        }

        let params = {
            CollateralId: collateralId,
            InqType: warrantyType
        }

        let data = qs.stringify(params);

        try {
            //servicio retorna Pignorados
            const result = await this.get(url.URL_CORE_COLLATERALS + "?" + data);
            return result
            //Armamos la data a mostrar en pantalla
            /*result.Collaterals.CollateralInfo.map(function(item, i){
                if(item.Collateral.CollateralKey.CollateralId!==null){
                    dataResult.push({collateralId: item.Collateral.CollateralKey.CollateralId,facilityAmt: item.Collateral.CollateralAmt.Amt});
                }                                
            })*/
        }
        catch (err) {
            console.error("URL_CORE_PIGNORADO", err);
            return undefined;
        }
    }

    async getAccountMovementsByTransaction(transactId) {

        var debtors = await this.backendServices.consultarDeudores(transactId);
        if (debtors !== null && debtors !== undefined) {
            var result = [];
            let flagAcctId = [];
            for (var i = 0; i < debtors.length; i++) {
                try {
                    var dataResult = await this.getAccountMovements(debtors[i].customerNumberT24);
                    if (dataResult !== null && dataResult !== undefined) {
                        // dataResult.forEach(function (item) {
                        //     result.push(item);
                        // });
                        for (let item of dataResult) {
                            if (flagAcctId.includes(item.AcctId))
                                continue;
                            flagAcctId.push(item.AcctId)
                            result.push(item);
                        };
                    }
                }
                catch (err) { }
            }
            console.log("getAccountMovementsByTransaction", result);

            return result;
        }

        return undefined;
    }

    //retorna movimientos de cuentas
    async getAccountMovements(partyId) { //Numero de Cliente de T24

        if (partyId.length <= 0) {
            return undefined;
        }

        let params = { PartyId: partyId }
        let data = qs.stringify(params);

        //servicio retorna las cuentas del cliente
        var result = await this.get(url.URL_CORE_ACCOUNTSPARTIES + "?" + data);

        if (result.Status.StatusCode !== OPTs.ResponseT24_STATUSOK) {
            throw new Error(result.Status.StatusCode + " - " + result.Status.StatusDesc);
            return;
        }

        var dataResult = [];
        for (var i = 0; i < result.Accounts.Acct.length; i++) {
            var item = result.Accounts.Acct[i];

            if (item.AcctPartyType !== result.PartyKey.PartyType && item.AcctPartyType === "2") { }
            else {
                params = { AcctReference: item.AcctKey.AcctReference }
                data = qs.stringify(params);
                try {
                    var year = 0;
                    var dtResult = await this.get(url.URL_CORE_AVERAGES + "?" + data);
                    if (dtResult.Acct.AcctBal.length > 0) {
                        // queda pendiente el tema de los depositos con el servicio de banesco  
                        var dt = { AcctId: item.AcctKey.AcctId, dataByYear: [] }
                        for (var accItem of dtResult.Acct.AcctBal) {
                            if (year !== Number(accItem.AverageBalanceDt.split(' ')[1])) {
                                year = Number(accItem.AverageBalanceDt.split(' ')[1]);
                                dt.dataByYear.push({ year, dataresult: [] })
                            }

                            var dtr = {
                                "year": Number(accItem.AverageBalanceDt.split(' ')[1]),
                                "month": accItem.AverageBalanceDt.split(' ')[0],
                                "amount": accItem.CurAmt.Amt,
                                "deposits": 0
                            }
                            dt.dataByYear[dt.dataByYear.length - 1].dataresult.push(dtr);
                        }
                        /*dtResult.Acct.AcctBal.map(function (accItem, i) {  
                            if(year !== Number(accItem.AverageBalanceDt.split(' ')[1])){
                                year = Number(accItem.AverageBalanceDt.split(' ')[1]);
                                dt.dataByYear.push({year,dataresult:[]})
                            }                                                
                            dt.dataByYear[dt.dataByYear.length-1].dataresult.push({
                                "year": Number(accItem.AverageBalanceDt.split(' ')[1]), 
                                "month": accItem.AverageBalanceDt.split(' ')[0],
                                "amount": accItem.CurAmt.Amt
                            }); 
                        }) */
                        dataResult.push(dt);
                    }
                }
                catch (err) {
                    console.error("getAccountMovementsByTransaction", err);
                }
            }

        }

        //Para sacar los depositos
        //https://qa.api.ob.banesco.com.pa/acct/v1/accounts/transactions?AcctId=1000129123
        //servicio retorna los movimientos de cuentas del cliente                        
        /*try{
            for (var i = 0; i < dataResult.length; ++i) {
                var dtResult = dataResult[i];
                for (var p = 0; p < dtResult.dataByYear.length; ++p) {
                    var dtYear = dtResult.dataByYear[p];
                    var currentYear =dtYear.year;
                    params = null; //dtResult.AcctId
                    if(currentYear === Number(moment().format("YYYY"))){
                        params = { AcctId: dtResult.AcctId, EndDt:moment().format("YYYY-MM-DD[T]HH:mm:ss"), StartDt:currentYear+"-01-01T00:00:00" } //EndDt=2021-10-31T09:32:51&StartDt=2021-05-01T00:00:00
                    }
                    else{
                        params = { AcctId: dtResult.AcctId, EndDt:currentYear+"-12-31T23:59:59", StartDt:currentYear+"-01-01T00:00:00" } //EndDt=2021-10-31T09:32:51&StartDt=2021-05-01T00:00:00
                    }
                    data = qs.stringify(params);
                    try{
                        var deposits = await this.get(url.URL_CORE_TRANSACCTIONS + "?" + data); 
                        for (var depo of deposits.Trn) {
                            if(depo.Desc.indexOf("CREDITO A CONTRATO") < 0 && depo.Desc.indexOf("Intereses - Capitalizables") < 0){
                                var monthName = GetMontNameByNumber(moment(depo.EffDt).format('M'));
                                var dataByMonth = dtYear.dataresult.find(x => x.month.indexOf(monthName)>= 0);
                                    if(dataByMonth!==undefined){
                        
                                        dataByMonth.deposits= (Number(dataByMonth.deposits) + Number(depo.TotalCurAmt.Amt)).toFixed(2);
                                    }
                            }                    
                        }        
                    }
                    catch(err){}
                }
            }
        }
        catch(err){}
        */
        //Para sacar los depositos
        //https://qa.api.ob.banesco.com.pa/acct/v1/accounts/balances/totals?CUENTA=120000086315&FECHA_INI=20220101&FECHA_FIN=20220330&PROMEDIO=S

        try {
            for (var i = 0; i < dataResult.length; ++i) {
                var dtResult = dataResult[i];
                for (var p = 0; p < dtResult.dataByYear.length; ++p) {
                    var dtYear = dtResult.dataByYear[p];
                    var currentYear = dtYear.year;
                    params = null; //dtResult.AcctId
                    if (currentYear === Number(moment().format("YYYY"))) {
                        params = { CUENTA: dtResult.AcctId, FECHA_INI: currentYear + "0101", FECHA_FIN: moment().format("YYYYMMDD"), PROMEDIO: "S" } //EndDt=2021-10-31T09:32:51&StartDt=2021-05-01T00:00:00
                    }
                    else {
                        params = { CUENTA: dtResult.AcctId, FECHA_INI: currentYear + "0101", FECHA_FIN: currentYear + "1231", PROMEDIO: "S" } //EndDt=2021-10-31T09:32:51&StartDt=2021-05-01T00:00:00
                    }
                    data = qs.stringify(params);
                    try {
                        var deposits = await this.get(url.URL_CORE_BALANCETOTALS + "?" + data);
                        //console.log("getAccountMovementsByTransactionDeposits",deposits);

                        for (var record of deposits.records) {
                            //console.log("depositsMonth", record.FECHA.toString().substring(4, 6));
                            var monthName = GetMontNameByNumber(record.FECHA.toString().substring(4, 6));
                            var dataByMonth = dtYear.dataresult.find(x => x.month.indexOf(monthName) >= 0);
                            if (dataByMonth !== undefined) {
                                dataByMonth.deposits = (Number(record.MONTO)).toFixed(2);
                            }
                        }
                    }
                    catch (err) { }
                }
            }
        }
        catch (err) { }

        return dataResult;
    }

    async getAccountDepositsByTransaction(transactId, year, month) {

        var debtors = await this.backendServices.consultarDeudores(transactId);
        if (debtors !== null && debtors !== undefined) {

            var result = [];
            for (var i = 0; i < debtors.length; i++) {
                try {
                    var dataResult = await this.getAccountDeposits(debtors[i].customerNumberT24, year, month);
                    if (dataResult !== null && dataResult !== undefined) {
                        dataResult.forEach(function (item) {
                            result.push(item);
                        });
                    }
                }
                catch (err) { }
            }
            console.log("getAccountMovementsByTransaction", result);

            return result;
        }

        return undefined;
    }

    async getAccountDeposits(partyId, year, month) { //Numero de Cliente de T24

        if (partyId.length <= 0) {
            return undefined;
        }

        let params = { PartyId: partyId }
        let data = qs.stringify(params);

        //servicio retorna las cuentas del cliente
        var result = await this.get(url.URL_CORE_ACCOUNTSPARTIES + "?" + data);

        if (result.Status.StatusCode !== OPTs.ResponseT24_STATUSOK) {
            throw new Error(result.Status.StatusCode + " - " + result.Status.StatusDesc);
            return;
        }

        var dataResult = [];
        for (var i = 0; i < result.Accounts.Acct.length; i++) {
            var item = result.Accounts.Acct[i];
            try {
                year = Number(year).toString("00");
                month = Number(month).toString("00");
                var endDate = moment(year + "-" + month + "-01").endOf('month').format('DD');

                params = { AcctId: item.AcctKey.AcctId, EndDt: year + "-" + month + "-" + endDate + "T23:59:59", StartDt: year + "-" + month + "-01T00:00:00" } //EndDt=2021-10-31T09:32:51&StartDt=2021-05-01T00:00:00

                data = qs.stringify(params);
                try {
                    var deposits = await this.get(url.URL_CORE_TRANSACCTIONS + "?" + data);
                    for (var depo of deposits.Trn) {
                        if (depo.Desc.indexOf("CREDITO A CONTRATO") < 0 && depo.Desc.indexOf("Intereses - Capitalizables") < 0) {
                            dataResult.push({ deposits: Number(depo.TotalCurAmt.Amt) })
                        }
                    }
                }
                catch (err) { }
            }
            catch (err) { }
        }
        //Para sacar los depositos
        //https://qa.api.ob.banesco.com.pa/acct/v1/accounts/transactions?AcctId=1000129123

        return dataResult;
    }

    //retorna movimientos de cuentas
    async getApcInfo(identification, idType) { //Numero de identificacion del cliente

        if (identification.length <= 0) {
            return undefined;
        }

        let typeofId = "Cedula";
        switch (idType) {
            case "CED": {
                typeofId = "Cedula";
                break;
            }
            case "RUC": {
                typeofId = "RUC";
                break;
            }
            case "PAS": {
                typeofId = "Pasaporte";
                break;
            }
        }


        var tmpidentification = "";
        identification.split('-').map((str) => {
            if (str.startsWith("0")) {
                tmpidentification += str.replace(/^0+/, '') + "-";
            }
            else {
                tmpidentification += str + "-";
            }
        })
        if (tmpidentification.startsWith("-")) {
            tmpidentification = tmpidentification.substring(1);
        }
        identification = tmpidentification.substring(0, tmpidentification.length - 1);
        var params = {
            "ConsultarAPC": {
                "Model": {
                    "EsPrueba": 0,
                    "ForzarBusqueda": 0,
                    "IdentificacionConsulta": identification,//"8-773-1899",
                    "PasswordAPC": "Banesco19.",
                    "TipoCliente": typeofId,
                    "UltimusProcess": 7,
                    "UsuarioAPC": "WTIBANESCO001"
                }
            }
        }

        //servicio retorna la info de APC del cliente
        const result = await this.post(url.URL_CORE_APCINFO, params);

        var dataResult = [];
        try {
            if (Array.isArray(result.ConsultarAPCResponse.ConsultarAPCResult.DetCompromisoAPC.DetCompromisoAPC)) {
                //Armamos la data a mostrar en pantalla
                result.ConsultarAPCResponse.ConsultarAPCResult.DetCompromisoAPC.DetCompromisoAPC.map(function (item, i) {
                    try {
                        dataResult.push({
                            "year": moment(item.dc_fec_inicio_rel).format("YYYY"), "month": moment(item.dc_fec_inicio_rel).format("MMMM"),
                            "initialAmount": item.dc_monto_original, "actualAmount": item.dc_saldo_actual, "asociation": item.dc_nom_asoc, "source": item.dc_descr_corta_rela,codeT24:item?.dc_codigo??"",dateT24:item?.dc_fec_actualizacion??""
                        });
                    }
                    catch (err) { }
                })
            }
            else {
                var item = result.ConsultarAPCResponse.ConsultarAPCResult.DetCompromisoAPC.DetCompromisoAPC;
                try {
                    dataResult.push({
                        "year": moment(item.dc_fec_inicio_rel).format("YYYY"), "month": moment(item.dc_fec_inicio_rel).format("MMMM"),
                        "initialAmount": item.dc_monto_original, "actualAmount": item.dc_saldo_actual, "asociation": item.dc_nom_asoc, "source": item.dc_descr_corta_rela,codeT24:item?.dc_codigo??"",dateT24:item?.dc_fec_actualizacion??""
                    });
                }
                catch (err) { }
            }

        }
        catch (err) { console.error(err); }

        return dataResult;
    }

    async getEconomicGroup(partyId) { //partyId -> numero del cliente en T24
        try {
            let params = { PartyId: partyId }
            let data = qs.stringify(params);

            var result = await this.get(url.URL_CORE_COMPANIESRELATIONS + "?" + data);

            console.log("getEconomicGroup", result);

            return result.PartyPartyRels.PartyPartyRel[0].PartyPartyRelInfo.PartyRelName[0];
        }
        catch (err) { }
        if (partyId.length <= 0) {
            return undefined;
        }

        return null;

    }

    async getReciprocityByTransaction(transactId, year, month) {

        var debtors = await this.backendServices.consultarDeudores(transactId);
        if (debtors !== null && debtors !== undefined) {

            var result = { averageAmt: 0, deposits: 0 }
            for (var i = 0; i < debtors.length; i++) {
                try {
                    var dataResult = await this.getReciprocity(debtors[i].customerNumberT24, year, month);
                    if (dataResult !== null && dataResult !== undefined) {
                        result.averageAmt += dataResult.averageAmt;
                        result.deposits += dataResult.deposits;
                    }
                }
                catch (err) { }
            }
            console.log("getAccountMovementsByTransaction", result);

            return result;
        }

        return undefined;
    }

    async getReciprocity(partyId, year, month) {

        if (partyId.length <= 0) {
            return undefined;
        }

        year = Number(year);

        let params = { PartyId: partyId }
        let data = qs.stringify(params);

        //servicio retorna las cuentas del cliente
        var result = await this.get(url.URL_CORE_ACCOUNTSPARTIES + "?" + data);

        if (result.Status.StatusCode !== OPTs.ResponseT24_STATUSOK) {
            return undefined;
        }

        var resultToReturn = { averageAmt: 0, deposits: 0 }
        for (var i = 0; i < result.Accounts.Acct.length; i++) {
            var item = result.Accounts.Acct[i];
            params = { AcctReference: item.AcctKey.AcctReference }
            data = qs.stringify(params);
            try {
                var dtResult = await this.get(url.URL_CORE_AVERAGES + "?" + data);
                if (dtResult.Acct.AcctBal.length > 0) {
                    // queda pendiente el tema de los depositos con el servicio de banesco  
                    for (var accItem of dtResult.Acct.AcctBal) {
                        var dMonth = accItem.AverageBalanceDt.split(' ')[0]
                        if (Number(accItem.AverageBalanceDt.split(' ')[1]) === year && dMonth.indexOf(month) >= 0) {
                            resultToReturn.averageAmt = (Number(resultToReturn.averageAmt) + Number(accItem.CurAmt.Amt)).toFixed(2);
                        }
                    }
                }
            }
            catch (err) { }

            //Para sacar los depositos
            try {
                var currentYear = year;
                var monthNum = GetMontNumberByName(month);
                var endDate = moment(year + "-" + monthNum + "-01").endOf('month').format('DD'); params = null; //dtResult.AcctId
                params = { CUENTA: item.AcctKey.AcctId, FECHA_INI: currentYear + monthNum + "01", FECHA_FIN: currentYear + monthNum + endDate, PROMEDIO: "S" } //EndDt=2021-10-31T09:32:51&StartDt=2021-05-01T00:00:00

                data = qs.stringify(params);
                try {
                    var deposits = await this.get(url.URL_CORE_BALANCETOTALS + "?" + data);
                    for (var record of deposits.records) {
                        //console.log("depositsMonth",record.Fecha.toString().substring(4,6));

                        //var monthName = GetMontNameByNumber(record.Fecha.toString().substring(4,6));
                        //var dataByMonth = dtYear.dataresult.find(x => x.month.indexOf(monthName)>= 0);
                        //if(dataByMonth!==undefined){                        
                        resultToReturn.deposits = (Number(resultToReturn.deposits) + Number(record.monto)).toFixed(2);
                        //  }                    
                    }
                }
                catch (err) { }
            }
            catch (err) { }

        }
        return resultToReturn;
    }

    async getReciprocityByYearByTransaction(transactId, year) {

        var debtors = await this.backendServices.consultarDeudores(transactId);
        if (debtors !== null && debtors !== undefined) {

            var result = { averageAmt: 0, deposits: 0 }
            for (var i = 0; i < debtors.length; i++) {
                try {
                    var dataResult = await this.getReciprocityByYear(debtors[i].customerNumberT24, year);
                    if (dataResult !== null && dataResult !== undefined) {
                        result.averageAmt += dataResult.averageAmt;
                        result.deposits += dataResult.deposits;
                    }
                }
                catch (err) { }
            }
            console.log("getAccountMovementsByTransaction", result);

            return result;
        }

        return undefined;
    }

    async getReciprocityByYear(partyId, year) {

        if (partyId.length <= 0) {
            return undefined;
        }

        year = Number(year);

        let params = { PartyId: partyId }
        let data = qs.stringify(params);

        //servicio retorna las cuentas del cliente
        var result = await this.get(url.URL_CORE_ACCOUNTSPARTIES + "?" + data);

        if (result.Status.StatusCode !== OPTs.ResponseT24_STATUSOK) {
            return undefined;
        }

        var resultToReturn = { averageAmt: 0, deposits: 0 }
        for (var i = 0; i < result.Accounts.Acct.length; i++) {
            var item = result.Accounts.Acct[i];
            params = { AcctReference: item.AcctKey.AcctReference }
            data = qs.stringify(params);
            try {
                var dtResult = await this.get(url.URL_CORE_AVERAGES + "?" + data);
                if (dtResult.Acct.AcctBal.length > 0) {
                    // queda pendiente el tema de los depositos con el servicio de banesco  
                    for (var accItem of dtResult.Acct.AcctBal) {
                        //var dMonth = accItem.AverageBalanceDt.split(' ')[0]
                        if (Number(accItem.AverageBalanceDt.split(' ')[1]) === year) {
                            resultToReturn.averageAmt = (Number(resultToReturn.averageAmt) + Number(accItem.CurAmt.Amt)).toFixed(2);
                        }
                    }
                }
            }
            catch (err) { }

            //Para sacar los depositos
            try {
                var currentYear = year;
                var monthNum = year === Number(moment().format("YYYY")) ? moment().format("MM") : "12";
                var endDate = moment(year + "-" + monthNum + "-01").endOf('month').format('DD'); params = null; //dtResult.AcctId
                params = { CUENTA: item.AcctKey.AcctId, FECHA_INI: currentYear + "0101", FECHA_FIN: currentYear + monthNum + endDate, PROMEDIO: "S" } //EndDt=2021-10-31T09:32:51&StartDt=2021-05-01T00:00:00

                data = qs.stringify(params);
                try {
                    var deposits = await this.get(url.URL_CORE_BALANCETOTALS + "?" + data);
                    for (var record of deposits.records) {
                        //console.log("depositsMonth",record.Fecha.toString().substring(4,6));

                        //var monthName = GetMontNameByNumber(record.Fecha.toString().substring(4,6));
                        //var dataByMonth = dtYear.dataresult.find(x => x.month.indexOf(monthName)>= 0);
                        //if(dataByMonth!==undefined){                        
                        resultToReturn.deposits = (Number(resultToReturn.deposits) + Number(record.monto)).toFixed(2);
                        //  }                    
                    }
                }
                catch (err) { }
            }
            catch (err) { }

        }
        return resultToReturn;
    }

    async getDepositsByTransaction(transactId, year, month) {

        var debtors = await this.backendServices.consultarDeudores(transactId);
        if (debtors !== null && debtors !== undefined) {

            var result = { averageAmt: 0, deposits: 0 }
            for (var i = 0; i < debtors.length; i++) {
                try {
                    var dataResult = await this.getDeposits(debtors[i].customerNumberT24, year, month);
                    if (dataResult !== null && dataResult !== undefined) {
                        result.averageAmt += dataResult.averageAmt;
                        result.deposits += dataResult.deposits;
                    }
                }
                catch (err) { }
            }
            console.log("getAccountMovementsByTransaction", result);

            return result;
        }

        return undefined;
    }

    async getDeposits(partyId, year, month) {

        //https://qa.api.ob.banesco.com.pa/acct/v1/accounts/balances/totals

        if (partyId.length <= 0) {
            return undefined;
        }

        year = Number(year);

        let params = { PartyId: partyId }
        let data = qs.stringify(params);

        //servicio retorna las cuentas del cliente
        var result = await this.get(url.URL_CORE_ACCOUNTSPARTIES + "?" + data);

        if (result.Status.StatusCode !== OPTs.ResponseT24_STATUSOK) {
            return undefined;
        }

        var resultToReturn = { averageAmt: 0, deposits: 0 }
        for (var i = 0; i < result.Accounts.Acct.length; i++) {
            var item = result.Accounts.Acct[i];

            //CUENTA=120000086315&FECHA_INI=20220101&FECHA_FIN=20220330&PROMEDIO=S
            var endDate = moment(year + "-12-01").endOf('month').format('DD');
            params = { CUENTA: item.AcctKey.AcctId, FECHA_INI: year + "0101", FECHA_FIN: year + "12" + endDate }
            data = qs.stringify(params);
            try {
                var dtResult = await this.get(url.URL_CORE_BALANCETOTALS + "?" + data);
                if (dtResult.Acct.AcctBal.length > 0) {
                    // queda pendiente el tema de los depositos con el servicio de banesco  
                    for (var accItem of dtResult.Acct.AcctBal) {
                        if (Number(accItem.AverageBalanceDt.split(' ')[1]) === year) {
                            resultToReturn.averageAmt = (Number(resultToReturn.averageAmt) + Number(accItem.CurAmt.Amt)).toFixed(2);
                        }
                    }
                }
            }
            catch (err) { }

            //Para sacar los depositos
            //https://qa.api.ob.banesco.com.pa/acct/v1/accounts/transactions?AcctId=1000129123
            //servicio retorna los movimientos de cuentas del cliente                        
            try {
                //var monthN=GetMontNumberByName(month);
                var endDate = moment(year + "-12-01").endOf('month').format('DD');
                params = { AcctId: item.AcctKey.AcctId, EndDt: year + "-12-" + endDate + "T23:59:59", StartDt: year + "-01-01T00:00:00" } //EndDt=2021-10-31T09:32:51&StartDt=2021-05-01T00:00:00
                data = qs.stringify(params);
                var deposits = await this.get(url.URL_CORE_TRANSACCTIONS + "?" + data);
                console.log("getReciprocityByYear", deposits);
                for (var depo of deposits.Trn) {
                    if (depo.Desc.indexOf("CREDITO A CONTRATO") < 0 && depo.Desc.indexOf("Intereses - Capitalizables") < 0) {
                        resultToReturn.deposits = (Number(resultToReturn.deposits) + Number(depo.TotalCurAmt.Amt)).toFixed(2);
                    }
                }
            }
            catch (err) { }
        }
        return resultToReturn;

    }

    /// Obtener el serial de la linea -- Parametros: NumeroT24 y Codigo Facilidad
    async getLineSerial(partyId, lineTypeCode, maxLineNum = 0) {
        try {

            //var errorDispacher = new errorDispacherHelper(); 
            console.log("getLineSerial", partyId, lineTypeCode)
            //partyId="800048231"; facilityTypeCode="10000"

            if (partyId.length <= 0) {
                return undefined;
            }

            let params = { PartyId: partyId }
            let data = qs.stringify(params);

            //https://qa.api.ob.banesco.com.pa/party/v1/parties/credits?PartyId=600088018

            //servicio retorna las cuentas del cliente
            var result = await this.get(url.URL_CORE_CREDITOS_LINE + "?" + data);

            // if (result.Status.StatusCode !== OPTs.ResponseT24_STATUSOK && result.Status.StatusCode !== OPTs.ResponseT24_STATUSOK1) {
            //     errorDispacherHelper.dispatch({ status: result.Status.StatusCode, error: result.Status.StatusDesc });
            //     return;
            // }            

            var dataResults = result.Party.PartyInfo.CreditLine.filter(x => x.CreditLineId.split(".")[1].indexOf(lineTypeCode) >= 0)

            var lineNumber = 1 + maxLineNum;
            dataResults.forEach((dt) => {
                lineNumber = Number(dt.CreditLineId.split(".")[2]) > lineNumber ? Number(dt.CreditLineId.split(".")[2]) : lineNumber;
            })

            while (lineTypeCode.length < 7) {
                lineTypeCode = "0" + lineTypeCode;
            }

            if (lineNumber.toString().length < 2) {
                lineNumber = ("0" + (lineNumber + 1).toString()).slice(-2);
            }
            else {
                lineNumber = lineNumber.toString();
            }

            var lineserial = partyId + "." + lineTypeCode + "." + lineNumber;
            console.log("lineas", lineserial);

            return lineserial;
        }
        catch (err) {
            // errorDispacherHelper.dispatch({status: "500",data: result, error: err.message});
        }

        return null;
    }
    ///Creacion de Linea para desembolso
    //numero de linea = numero de cliente + tipo de linea + serial === EJ: 600197109.0011000.01

    //https://qa.api.ob.banesco.com.pa/APIUtil/v1/catalogs?catalog_name=LIMIT REFERENCE&parent_catalog_name=&keyword=  
    //===> Catalogo de Tipo de Lineas

    //https://qa.api.ob.banesco.com.pa/party/v1/parties/credits?PartyId=600088018  
    //===> Obtenemos todas las lineas y tomamos el total + 1 => Mas serial
    async newline(data) {

        try {

            /*
            {
  "CreditLine": {
    "Activity": {
      "Cod": 2103
    },
    "AuthType": 1,
    "AutonomyCode": {
      "Cod": 100,
      "Desc": "JUNTA DIRECTIVA"
    },
    "AutonomyUser": 2,
    "CreditLimit": {
      "AdviseAmt": {
        "Amt": 50000,
        "CurCode": "USD"
      },
      "AllowNetting": "Y",
      "ApprovalDt": "2022-06-24",
      "AvailDt": "2022-06-24",
      "AvailMarker": "Y",
      "CountryRisk": {
        "Country": {
          "CountryCode": "PA",
          "CountryName": ""
        },
        "Percent": 100
      },
      "CreditLimitKey": {
        "CreditLimitId": "600197109.0000100.02"
      },
      "CurCode": "USD",
      "DeadLineDt": "2022-06-24",
      "DueDt": "2023-06-30",
      "LimitAmt": {
        "Amt": 50000,
        "CurCode": "USD"
      },
      "LimitAmtType": "FIXED",
      "LimitReject": "Y",
      "MaxCurAmt": {
        "Amt": 50000,
        "CurCode": "USD"
      },
      "ProposalDt": "2022-06-24",
      "ReviewFreq": {
        "FreqValue": "20230630M1230"
      },
      "Signatories": {
        "Signatory": {
          "PartyKey": {
            "PartyId": 990057781
          }
        }
      },
      "StateProvDest": {
        "Cod": "",
        "Desc": ""
      }
    }
  }
}
            */


            /*
        {
   "CreditLine":{
      "Activity":{
         "Cod":"2103"
      },
      "AuthType":"01",
      "AutonomyCode":{
         "Cod":"0100",
         "Desc":"JUNTA DIRECTIVA"
      },
      "AutonomyUser":"02",
      "CreditLimit":{
         "AdviseAmt":{
            "Amt":"2000",
            "CurCode":"USD"
         },
         "Allow":{
            "CurrencyData":{
               "CurAmt":{
                  "Amt":{
                     "-self-closing":"true"
                  },
                  "CurCode":{
                     "-self-closing":"true"
                  }
               }
            },
            "Party":{
               "PartyId":{
                  "-self-closing":"true"
               }
            },
            "ProductData":[
               {
                  "Product":{
                     "Cod":"1000"
                  }
               }
            ]
         },
         "AllowNetting":"N",
         "ApprovalDt":"2022-05-11",
         "AvailDt":"2022-05-11",
         "AvailMarker":"Y",
         "CountryRisk":{
            "Country":{
               "CountryCode":"PA",
               "CountryName":{
                  "-self-closing":"true"
               }
            },
            "Percent":"100"
         },
         "CreditLimitKey":{
            "CreditLimitId":"990001176.0010000.09"
         },
         "CurCode":"USD",
         "DeadLineDt":"2022-05-11",
         "DueDt":"2023-05-11",
         "LimitAmt":{
            "Amt":"2000",
            "CurCode":"USD"
         },
         "LimitAmtType":"FIXED",
         "LimitReject":"Y",
         "MaxCurAmt":{
            "Amt":"2000",
            "CurCode":"USD"
         },
         "ProposalDt":"2022-05-11",
         "ReviewFreq":{
            "FreqValue":"20230430M1230"
         },
         "Signatories":{
            "Signatory":{
               "PartyKey":{
                  "PartyId":"990001176"
               }
            }
         }
      }
   }
}        */

            //console.log("NewLine",data);
            // return;

            var result = await this.post(url.URL_CORE_LINES, data);
            console.log("NewLine", data, result);
            if (result.StatusCode === OPTs.ResponseT24_STATUSOK) {
                await this.newlineChild(data);
                return result;
            }
            else {
                errorDispacherHelper.dispatch({ status: result.StatusCode, data: result, error: result.StatusDesc });
            }
        }
        catch (err) {
            errorDispacherHelper.dispatch({ status: "500", data: result, error: err.message });
        }

        return undefined;
    }
    async newlineChild(data) {
        try {

            //data.CreditLine.Allow.ProductData            
            for (var i = 0; i < data.CreditLine.CreditLimit.Allow.ProductData.length; i++) {
                try {
                    var dataProd = data.CreditLine.CreditLimit.Allow.ProductData[i];

                    var CreditLimitId = data.CreditLine.CreditLimit.CreditLimitKey.CreditLimitId;
                    var CreditLimitIdNum = CreditLimitId.split(".")[1].replace(/0/g, '');
                    CreditLimitIdNum = CreditLimitIdNum + "0";

                    var ToReplaceIdNum = (Number(CreditLimitIdNum) + i + 1).toString();

                    data.CreditLine.CreditLimit.CreditLimitKey.CreditLimitId =
                        data.CreditLine.CreditLimit.CreditLimitKey.CreditLimitId.split(".")[0] + "." +
                        data.CreditLine.CreditLimit.CreditLimitKey.CreditLimitId.split(".")[1].replace(CreditLimitIdNum, ToReplaceIdNum) + "." +
                        data.CreditLine.CreditLimit.CreditLimitKey.CreditLimitId.split(".")[2];

                    var tmpdata = JSON.parse(JSON.stringify(data))
                    delete tmpdata.CreditLine.CreditLimit.Allow.ProductData

                    var result = await this.post(url.URL_CORE_LINES, tmpdata);
                    console.log("NewLineChild", tmpdata, result);
                    if (result.Status.StatusCode === OPTs.ResponseT24_STATUSOK) {
                        //return result;
                    }
                }
                catch (err) {
                    errorDispacherHelper.dispatch({ status: "500", data: result, error: err.message });
                }
            }
        }
        catch (err) { }

        return undefined;
    }

    // Garantia loans/Colateral
    //https://qa.api.ob.banesco.com.pa/acctloan/v1/loans/collaterals

    // Desembolso
    //https://qa.api.ob.banesco.com.pa/acctloan/v1/loans

    //lineas
    //https://qa.api.ob.banesco.com.pa/acctloan/v1/loans/credits/lines/limits


    async DesembolsoBajoLinea(data) {

        /*
        data =
        {
            AcctLoan: {
                AcctSubtype: {
                    Cod: "AL.COMPANY.PRIVATE"  // Subproducto
                },
                AutonomyCode: "0523", // ******** Codigo de la autonomia
                AutonomyUser: "134", //La autonomia o usuario que esta logueado
                //ClosedDt:"2029-10-03", //
                //ClubBanesco:"false",
                CurCode: "USD", //codigo de Moneda
                SubCategory: "1623", //Codigo de Subcategoria??
                Variation: { //variacion -> Puede ir vacía
                    "Cod": "CLIENTE"
                },
                "AcctOpeningInfo": {
                    BusinessUnit: "SUCURSAL", // Banca viene de IGR
                    "InitialAmt": {
                        "Amt": "5950" //monto
                    },
                    OpenDt: "2022-02-07",// Fecha de Inicio del desembolso
                    SaleOfficer: "3766" //Canal de venta .... ****** no está en pantalla
                },
                CreditAcctData: {
                    AuthType: "06", //-> ?? ************ no esta en pantalla
                    BillsCombined: "true", // Capital de Interes ... ********** no esta en pantalla
                    CodeDestination: "PA10", // codigo de Destino ... Provincia de Destino
                    CollOfficer: "9999", /// campo fijo siempre
                    CountryDestination: "PA", // codigo Pais de Destino
                    CreditDestination: "LOCAL", // ********* Destino del Credito : LOCAL 1 /EXTRANJERO 2
                    FundsDestination: "1", // ********* Destino de los Fondos: LOCAL 1 / EXTRANJERO 2
                    FundsPurpose: "2103", // ********** Proposito de los Fondos viene de un catalogo
                    OriginationRef: "99986",// ********** referencia de Orientacion , viene de un catalodo
                    RefinanceNum: { // QUEDA FIJO
                        "self-closing": "true"
                    },
                    SourceSales: { // ********* Viene de Catalogo
                        "Cod": "14",
                        "Desc": "REFERIDO POR EMPLEADO"
                    },
                    WritingType: "PAG", // *********** Tipo de Escritura .. PAG/WRT .. Pagaré o Escritura
                    Charge: [ //cargos 
                        {
                            ChargeType: "LENDCOMMISSION", //Instrucciones Operativas -> Monto por Comision
                            "CurAmt": {
                                "Amt": "392.7"
                            }
                        },
                        {
                            "ChargeType": "TAX", //Instrucciones Operativas -> ITBMs
                            "CurAmt": {
                                "Amt": "2.18"
                            }
                        },
                        {
                            "ChargeType": "ALLEGALFEE", //Instrucciones Operativas -> Notaría
                            "CurAmt": {
                                "Amt": "4.36"
                            }
                        },
                        {
                            "ChargeType": "TFISCAL", //Instrucciones Operativas -> Timbre Fisical
                            "CurAmt": {
                                "Amt": "3"
                            }
                        },
                    ],
                    "CreditRegularPmt": { // La podemos Omitir no es obligatorio
                        "BillType": "INSTALLMENT",
                        "Freq": {
                            "NoPaymentMonth": "1",
                            "OnDayNumber": "3"
                        },
                        "PmtClass": "DUE",
                        "PmtType": "CONSTANT",
                        "PmtTargetDetail": {
                            "ActualAmt": {
                                "Amt": "114.9"
                            },
                            "StartDate": "2022-04-03"
                        }
                    },
                    Term: {    //*********** Termino o Plazo de desembolso ... + Tipo de Termino D/M/A
                        ProposedTerm: "91M"
                    },
                    SettleInstruction: {
                        PayIn: [
                            {
                                ACDBRule: "PARTIAL", //Constante
                                PmtType: "CONSTANT",//Constante
                                SettleActivity: { //Constante
                                    Cod: "LENDING-APPLYPAYMENT-PR.REPAYMENT"
                                },
                                Settlement: "false", //************* desembolso en cuenta TRUE/FALSE
                                PayInAcctRef: {
                                    Activity: {  //Constante
                                        Cod: "ACCOUNTS-DEBIT-ARRANGEMENT"
                                    },
                                    PayInAcct: { // Número de Línea de Crédito
                                        "AcctReference": "USD1273300020014"
                                    }
                                }
                            },
                        ],
                        PayOut: {
                            PayOutAcct: { // Número de Línea de Crédito, el numero de la cuenta
                                "AcctReference": "USD1273300020014"
                            },
                            Property: "ACCOUNT", // Si es una cuenta "ACCOUNT"
                            SettleActivity: { //Constante
                                Cod: "LENDING-APPLYPAYMENT-PR.REPAYMENT"
                            },
                            Settlement: "true" //Constante
                        }
                    },
                    CreditAcctPmtInfo: {
                        PmtMethod: "DD" // ******** Metodo de Pago ... DC/PV  Descuento Directo - Pago Voluntario
                    }
                },
                IntRateData: [
                    {
                        IntRate: "11.50", // Tasa de Interes
                        IntRateType: "PRINCIPALINT"
                    },
                    {
                        "IntRate": "12.50",
                        "IntRateType": "LT.DPF.BASE"
                    },
                    {
                        "IntRate": "13.50",
                        "IntRateType": "LT.SPREAD.POINT"
                    }
                ],
                AcctMember: {
                    "PartyKey": {
                        "PartyId": "990091561" //Numero de Cliente T24
                    },
                    "PartyRole": {
                        "Cod": "OWNER"
                    }
                }
            }
        }
        */
        var result = await this.put(url.URL_CORE_PRESTAMOS, data);

        if (result.Status.StatusCode !== OPTs.ResponseT24_STATUSOK) {
            return result;
        }


        return result;
    }


    async test() {

        try {

            let data = {
                "Acct": {
                    "Activity": 3201,
                    "Category": 28212,
                    "CurCode": "USD",
                    "CreditAcctData": {
                        "CountryDestination": "PA",
                        "PromiseLetter": {
                            "AdvExpiryDt": "2022-12-31",
                            "AutoExpiry": true,
                            "BeneficiaryCust": {
                                "PartyId": "",
                                "PartyType": ""
                            },
                            "BeneficiaryName": "AUTO TUNNIG CA",
                            "ContractType": "CA",
                            "CustomerReferenceId": "MP2022154001",
                            "DealSubType": "CMTA",
                            "EffDt": "2022-06-03",
                            "EventsProcessing": "ONLINE",
                            "LimitRef": "",
                            "LiquidationMode": "Automatic",
                            "MaturityDt": "2022-12-31",
                            "OpenDt": "2022-06-03",
                            "PrincipalAmt": {
                                "Amt": 15000,
                                "CurCode": "USD"
                            }
                        }
                    },
                    "AcctMember": {
                        "PartyKey": {
                            "PartyId": 600072721,
                            "PartyType": 2
                        }
                    }
                }
            }

            var result = await this.get(url.URL_CORE_TEST);
            console.log("getLineSerial", result)


            return result;
        }
        catch (err) { }

        return null;
    }

    async getTreasuryCurveCatalogo1() {
        try {

            let params = {
                catalog_name: 'CURVA GRUPO',
                parent_catalog_name: "",
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);

            await convertToUpperCasesData(result.catalog)

            return result.catalog;
        }
        catch (ex) { }
        return null;
    }

    async getTreasuryCurveCatalogoChild(code) {
        try {

            let params = {
                catalog_name: 'CURVA TESORERIA',
                parent_catalog_name: code,
                keyword: ""
            }
            let data = qs.stringify(params);
            var result = await this.get(url.URL_CORE_CATALOGO + "?" + data);

            await convertToUpperCasesData(result.catalog)

            return result.catalog;
        }
        catch (ex) { }
        return null;
    }

}
