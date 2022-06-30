export default class TaskListPostownersModel {

    static results=[];

    static fromJson(json) {
            
        this.results = [];
        
        this.searchValue('task-summary',json);
        
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
                            
                            value.map(dt =>{

                                let date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(dt['task-created-on']['java.util.Date'])//, second: '2-digit'

                                var item = {id:dt['task-id'],processNumber:dt['task-id'],activity:dt['task-name'],date:date,status:dt['task-status']};
                                    this.results.push(item);   
                            })                             
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

/*
{
    "task-summary" : [ 
    {
    "task-id" : 36,
    "task-name" : "Task",
    "task-subject" : "",
    "task-description" : "",
    "task-status" : "Ready",
    "task-priority" : 0,
    "task-is-skipable" : false,
    "task-actual-owner" : null,
    "task-created-by" : null,
    "task-created-on" : 
    {
    "java.util.Date" : 1637935669704
    },
    "task-activation-time" : 
    {
    "java.util.Date" : 1637935669704
    },
    "task-expiration-time" : null,
    "task-proc-inst-id" : 36,
    "task-proc-def-id" : "CreditosComerciales.Test",
    "task-container-id" : "CreditosComerciales_1.0.0-SNAPSHOT",
    "task-parent-id" : -1,
    "correlation-key" : "36",
    "process-type" : 1
    }, 
    {
    "task-id" : 35,
    "task-name" : "Task",
    "task-subject" : "",
    "task-description" : "",
    "task-status" : "Ready",
    "task-priority" : 0,
    "task-is-skipable" : false,
    "task-actual-owner" : null,
    "task-created-by" : null,
    "task-created-on" : {
    "java.util.Date" : 1637934796010
    },
    "task-activation-time" : {
    "java.util.Date" : 1637934796010
    },
    "task-expiration-time" : null,
    "task-proc-inst-id" : 35,
    "task-proc-def-id" : "CreditosComerciales.Test",
    "task-container-id" : "CreditosComerciales_1.0.0-SNAPSHOT",
    "task-parent-id" : -1,
    "correlation-key" : "35",
    "process-type" : 1
    }, 
    {
    "task-id" : 34,
    "task-name" : "Task",
    "task-subject" : "",
    "task-description" : "",
    "task-status" : "Ready",
    "task-priority" : 0,
    "task-is-skipable" : false,
    "task-actual-owner" : null,
    "task-created-by" : null,
    "task-created-on" : {
    "java.util.Date" : 1637934773323
    },
    "task-activation-time" : {
    "java.util.Date" : 1637934773323
    },
    "task-expiration-time" : null,
    "task-proc-inst-id" : 34,
    "task-proc-def-id" : "CreditosComerciales.Test",
    "task-container-id" : "CreditosComerciales_1.0.0-SNAPSHOT",
    "task-parent-id" : -1,
    "correlation-key" : "34",
    "process-type" : 1
    }, 
    {
    "task-id" : 33,
    "task-name" : "Task",
    "task-subject" : "",
    "task-description" : "",
    "task-status" : "Ready",
    "task-priority" : 0,
    "task-is-skipable" : false,
    "task-actual-owner" : null,
    "task-created-by" : null,
    "task-created-on" : {
    "java.util.Date" : 1637934761221
    },
    "task-activation-time" : {
    "java.util.Date" : 1637934761221
    },
    "task-expiration-time" : null,
    "task-proc-inst-id" : 33,
    "task-proc-def-id" : "CreditosComerciales.Test",
    "task-container-id" : "CreditosComerciales_1.0.0-SNAPSHOT",
    "task-parent-id" : -1,
    "correlation-key" : "33",
    "process-type" : 1
    }, {
    "task-id" : 3,
    "task-name" : "Task",
    "task-subject" : "",
    "task-description" : "",
    "task-status" : "Ready",
    "task-priority" : 0,
    "task-is-skipable" : false,
    "task-actual-owner" : null,
    "task-created-by" : null,
    "task-created-on" : {
    "java.util.Date" : 1637877313843
    },
    "task-activation-time" : {
    "java.util.Date" : 1637877313843
    },
    "task-expiration-time" : null,
    "task-proc-inst-id" : 3,
    "task-proc-def-id" : "CreditosComerciales.Test",
    "task-container-id" : "CreditosComerciales_1.0.0-SNAPSHOT",
    "task-parent-id" : -1,
    "correlation-key" : "3",
    "process-type" : 1
    }, {
    "task-id" : 2,
    "task-name" : "Task",
    "task-subject" : "",
    "task-description" : "",
    "task-status" : "Ready",
    "task-priority" : 0,
    "task-is-skipable" : false,
    "task-actual-owner" : null,
    "task-created-by" : null,
    "task-created-on" : {
    "java.util.Date" : 1637876681565
    },
    "task-activation-time" : {
    "java.util.Date" : 1637876681565
    },
    "task-expiration-time" : null,
    "task-proc-inst-id" : 2,
    "task-proc-def-id" : "CreditosComerciales.Test",
    "task-container-id" : "CreditosComerciales_1.0.0-SNAPSHOT",
    "task-parent-id" : -1,
    "correlation-key" : "2",
    "process-type" : 1
    }, {
    "task-id" : 1,
    "task-name" : "Task",
    "task-subject" : "",
    "task-description" : "",
    "task-status" : "Ready",
    "task-priority" : 0,
    "task-is-skipable" : false,
    "task-actual-owner" : null,
    "task-created-by" : null,
    "task-created-on" : {
    "java.util.Date" : 1637871296078
    },
    "task-activation-time" : {
    "java.util.Date" : 1637871296078
    },
    "task-expiration-time" : null,
    "task-proc-inst-id" : 1,
    "task-proc-def-id" : "CreditosComerciales.Test",
    "task-container-id" : "CreditosComerciales_1.0.0-SNAPSHOT",
    "task-parent-id" : -1,
    "correlation-key" : "1",
    "process-type" : 1
    } ]
    }
*/    