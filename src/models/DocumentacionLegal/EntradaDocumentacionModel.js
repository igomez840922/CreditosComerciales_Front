//      { id: 1, order: 1, date:"17/09/2021", nprestamo: "123321", clientnumber: '600149013', clientname: "Grupo Tova SA", grupoeconomico:"", facilityType:"Linea de credito rotativa", proposalType:"Mención" },

export default class EntradaDocumentacionModel {

    static fromJson(json) {
        //console.log(json)

        const item = new EntradaDocumentacionModel();

        item.id = json.id;
        // parse date
        //item.date = new Date(json.date);
        item.order = json.order;
        item.date = json.date;
        item.nloan = json.nprestamo;
        item.client = {
            number: json.clientnumber,
            name: json.clientname,
           
        };
        item.Economicgroup = json.grupoeconomico;  
         item.facilityType = json.facilityType;
        item.proposalType = json.proposalType;
         
        return item;
    }
}
