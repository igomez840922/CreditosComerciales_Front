import moment from "moment";

export default class DocumentModel {

    static results=[];

    static fromJson(json) {
                                
        this.results = [];
        
        this.searchValue('Result',json);

        const items = new DocumentModel();

        items.results=this.results;        
        
        return items;
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
                            switch(key){
                                case "Result":{
                                    this.results.push({id:this.results.length + 1, docName:value['DocName'],documentId:value['DocumentID'],formType:value['FormType']});                                    
                                    break;
                                }
                                default:{break;}
                            }            
                        }
                    }
                }                
            }
        }
        catch(err){}
      }
    
    static getRequestModel(filedata) {
                
        const item = {
            ApplicationNumber:"456",
            ClientName:"JoseGarcia",
            ClientNumber:"98765432",
            ClientType:"N",
            DocumentTypeId:"1067",
            ExpirationDate:moment().format("DD/MM/YYYY"),
            FileExtension: filedata.fileExtension,
            Identification:"9-728-1643",
            ImageBase64: filedata.fileBase64,
            ProcessCode:"7",
            Token:"34543",
            UploadDate:moment().format("DD/MM/YYYY"),
            //ProductNumber:"456"
          };
        
        return item;
    }
}
