import moment from "moment";

export default class DocumentoAnexoModel {

    static fromJson(json) {
        //console.log(json)

        const item = new DocumentoAnexoModel();

        item.id = json.id;
        // parse date
        //item.date = new Date(json.date);
        item.date = json.date;
        item.client = {
            number: json.clientnumber,
            fname: json.clientfname,
            lname: json.clientlname,
            idtype: json.idtype,
            idname: json.identificationtype,
            idnumber: json.identificationnumber
        };
        item.observations = '';
        item.attachments = [];

        return item;
    }

    static getRequestModel(data) {
                
        const item = {
            onBaseIdentification:data.documentId,
            fileName: data.name,
            description:data.description,
            prospectIdentification:55,
            processIdentification:5,
            loadDate:moment().format("YYYY-MM-DD"),//"2021-11-10",
            identificationNumber:"458-956-899",
            customerIdentification:"fff"
        };
               
        return item;
    }

    static getDeleteModel(data) {
                
        const item = {
            onBaseIdentification:data.onBaseIdentification,
            prospectIdentification:data.prospectIdentification,
            processIdentification:data.processIdentification,
            identificationNumber:data.identificationNumber,
            customerIdentification:data.customerIdentification
        };
        
        return item;
    }

    static results=[];
    static getDataModel(json) {
            
        this.results = [];
        
        this.searchValue('attachments',json);
                       
        return this.results;
    }

    static searchValue(mainkey, json) {

        try{ 
            
            for (let [key, value] of Object.entries(json)) {
                if(value!==null && value!==undefined){
                    if(typeof value === 'object'){
                        if(key !== mainkey){
                            this.searchValue(mainkey,value);                            
                        }                        
                        else{
                            for (var i=0; i < value.length; i++) {
                                        
                                var data = value[i];

                                var item = {id:i,name:data.fileName,description:data.description,onbaseId: data.onBaseIdentification,loaddate:data.loadDate }

                                this.results.push(item);     
                            }             
                        }
                    }
                }                
            }
        }
        catch(err){}
      }
    

      static getSaveModel(data) {
                
        const item = {
            transactId:data.transactId,
            onBaseIdentification:data.documentId,
            fileName: data.name,
            fileDescription:data.description,
            processId:data.processId,
            activityId:data.activityId,
            personId:data.personId
        };
               
        return item;
    }


}
