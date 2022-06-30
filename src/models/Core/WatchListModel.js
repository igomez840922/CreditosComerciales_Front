export default class WatchListModel {

    static results=[];

    static fromJson(json) {
                                
        this.results = [];
        
        this.searchValue('LISTAS_VIGILANCIA',json);

        const items = new WatchListModel();
        items.results=this.results;
               
        console.log("Results: " + items.results);
        
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
                                case "LISTAS_VIGILANCIA":{
                                    mainkey = 'COINCIDENCIAS';
                                    this.searchValue(mainkey,value);                            
                                    break;
                                }
                                case "COINCIDENCIAS":{
                                    mainkey = 'RESUMEN';
                                    this.searchValue(mainkey,value);                            
                                    break;
                                }
                                case "RESUMEN":{
                                    mainkey = 'row';
                                    this.searchValue(mainkey,value);                            
                                    break;
                                }
                                case "row":{
                                    this.results.push({id:this.results.length + 1, name:value['@Criterio'],evaluation:value['@Evaluacion']});                                    
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
    
    static getRequestModel() {
                
        const item = {
            pCustomerId:'',
            pTypeId:'',
            pModelId:'LISTA_VIGILANCIA', 
            pCustomerListParams: {
                KeyValueParam:[]
            },
            pUser:'wallytech_ws_user',
            pWaitingInterval:180000000,
            pPriority:1
        };
        
        return item;
    }    

}
