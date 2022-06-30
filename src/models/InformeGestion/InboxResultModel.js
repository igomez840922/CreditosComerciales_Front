export default class InboxResultModel {

    static fromJson(json) {
        
        const item = new InboxResultModel();

        item.id = json.id;        
        item.date = json.date;
        item.client = {
            number: json.clientnumber,
            name: json.clientfname + " " + json.clientlname,           
            idType: json.idtype,           
            idNumber: json.idnumber,           
            idName: json.idname,           
        };
        item.facilityType = json.facilityType;
        item.proposalType = json.proposalType;
         
        return item;
    }
}
