export default class BandejaEntradaFideicomisoModel {

    static fromJson(json) {
        //console.log(json)

        const item = new BandejaEntradaFideicomisoModel();

        item.id = json.id;
        // parse date
        //item.date = new Date(json.date);
        item.order = json.order;
        item.date = json.date;
        item.Fideicomiso = json.Fideicomiso;
        item.client = {
            number: json.clientnumber,
            name: json.clientname,
            idtype: json.idtype,
           
        };
        item.Economicgroup = json.grupoeconomico;  
         item.facilityType = json.facilityType;
        item.proposalType = json.proposalType;
         
        return item;
    }
}
