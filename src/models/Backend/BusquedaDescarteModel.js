import moment from "moment";

export default class BusquedaDescarteModel {

    static fromJson(json) {
        /*
        {
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

        return json.getSearchAndDiscardSectionResponseDTO;
    }

    static getRequestModel() {                

        const item = {
        identificationType: "RUC",
        customerDocumentId: "",
        firstName: "",
        secondName: "",
        firstLastName: "",
        secondLastName: "",
        transactId: 0,
        compliance: true,
        observationsSearchDiscard: "",
        approved: false,
        observationsCompliance: null,
        status: true,
        date:moment().format("YYYY-MM-DD"),//"2021-11-10",
        attachments: []
        }
        
        return item;
    }

    static getSaveModel(data) {                

        const item = {
            transactId: data.transactId,
            compliance: data.compliance,
            observations: data.observationsSearchDiscard
        }
        
        return item;
    }

}
