    export default class AceptacionClienteModel {

    static fromJson(json) {
        //console.log(json)

        const item = new AceptacionClienteModel();

        item.id = json.id;
        item.order =json.order;
        // parse date
        //item.date = new Date(json.date);
        item.date = json.date;
        item.procedure = json.procedure;
        item.facilityType = json.facilityType;
        item.proposalType = json.proposalType;
        
        item.client = {
            clientnumber: json.clientnumber,
            Clientname: json.Clientname
        };
        return item;
    }
}
