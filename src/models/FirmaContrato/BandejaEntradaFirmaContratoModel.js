export default class BandejaEntradaFirmaContratoModel {

    static fromJson(json) {
        //console.log(json)

        const item = new BandejaEntradaFirmaContratoModel();

        item.id = json.id;
        // parse date
        //item.date = new Date(json.date);
        item.order = json.order;
        item.date = json.date;
        item.procedure = json.procedure;
        item.client = {
            number: json.clientnumber,
            name: json.clientname,
           
        };
         item.facilityType = json.facilityType;
        item.proposalType = json.proposalType;
         
        return item;
    }
}
