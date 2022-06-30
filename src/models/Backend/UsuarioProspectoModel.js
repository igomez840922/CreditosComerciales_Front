import moment from "moment";

export default class UsuarioProspectoModel {

    static postSaveModel(json) {
        /*
        {
    "statusCode": "200",
    "statusDesc": "Transacciï¿½n Exitosa",
    "customerId":"",
    "transactId":"",
        }
        */

        return json;
    }

    static getSaveModel(data) {

        let item = null;
        item = {
            personType: data.personType !== undefined && data.personType !== null ? data.personType : "1",
            identificationType: data.identificationType, //→ vtipoId      
            customerDocumentId: data.customerDocumentId, //→ vidDocCliente
            customerNumberT24: data.customerNumberT24 !== undefined ? data.customerNumberT24 : "",
            firstName: data.firstName, //→ vNombre      
            secondName: data.secondName, //→ vNombre2
            firstLastName: data.firstLastName, //→ vApellido      
            secondLastName: data.secondLastName,// → vApellido2      
            instanceId: data.instanceId, //→ vidinstancia    --- BPM Id del Poceso
            currentProcess: 1, //→ vidprocesoActual      
            nextProcess: 2, //→ vidprocesoSig      
            responsible: data.responsible, //→ vresponsable    --- Nombre del Usuario logeado   
            date: moment().format("YYYY-MM-DD"),//"2021-11-10",
            status: true,
            requestId: "", //→ vidsolicitud 
        }
        /*
         "identificationType":"1",
     "personType":"1",
    "customerDocumentId":"1115",
    "customerNumberT24":"1125",
    "firstName":"diana",
    "secondName":"",
    "firstLastName":"perez",
    "secondLastName": "jj",
    "instanceId":"5",
    "currentProcess":1,
  "nextProcess" :2,
   "responsible":"dinaUser",
     "date":1643387326,
     "status":true,
     "requestId":"1"
        //Actualizar
        if(data.customerId!==null && data.customerId!==undefined && data.customerId.length > 0){            
            item = {
                idCustomer: data.customerId !== undefined && data.customerId !== null? data.customerId:"",
                identificationType: data.identificationType,
                customerDocumentId:data.customerDocumentId, 
                customerNumberT24: data.customerNumber !== undefined && data.customerNumber !== null? data.customerNumber:"", 
                firstName: data.firstName, //→ vNombre      
                secondName: data.secondName, //→ vNombre2
                firstLastName: data.firstLastName, //→ vApellido      
                secondLastName: data.secondLastName,// → vApellido2      
                date:moment().format("YYYY-MM-DD"),//"2021-11-10",
                status: true
                }
        }
        else{ //Nuevo
            item = {
                identificationType: data.identificationType, //→ vtipoId      
                customerDocumentId:data.customerDocumentId, //→ vidDocCliente
                customerNumberT24: data.customerNumber !== undefined && data.customerNumber !== null? data.customerNumber:"", 
                firstName: data.firstName, //→ vNombre      
                secondName: data.secondName, //→ vNombre2
                firstLastName: data.firstLastName, //→ vApellido      
                secondLastName: data.secondLastName,// → vApellido2      
                instanceId: data.instanceId, //→ vidinstancia    --- BPM Id del Poceso
                currentProcess: 1, //→ vidprocesoActual      
                nextProcess: 2, //→ vidprocesoSig      
                responsible: data.responsible, //→ vresponsable    --- Nombre del Usuario logeado   
                requestId: "", //→ vidsolicitud 
            }
        }
        */
        return item;
    }

    static getUpdateModel(data) {

        let item = null;
        item = {
            idCustomer: data.customerId !== undefined && data.customerId !== null ? data.customerId : "",
            personType: data.personType !== undefined && data.personType !== null ? data.personType : "1",
            identificationType: data.identificationType,
            customerDocumentId: data.customerDocumentId,
            customerNumberT24: data.customerNumberT24 !== undefined ? data.customerNumberT24 : "",
            firstName: data.firstName, //→ vNombre      
            secondName: data.secondName, //→ vNombre2
            firstLastName: data.firstLastName, //→ vApellido      
            secondLastName: data.secondLastName,// → vApellido2      
            date: moment().format("YYYY-MM-DD"),//"2021-11-10",
            status: true
        }

        return item;
    }
}
