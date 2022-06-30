
import * as OPTs from "../../helpers/options_helper"

export default class PartiesStaffModel {
  static results = [];

  static fromJson(json) {
    this.results = [];

    this.searchValue("Staff", json);

    const items = new PartiesStaffModel();
    items.results = this.results;

    return items;
  }

  
  static searchValue(mainkey, json) {
    try {
      for (let [key, value] of Object.entries(json)) {        
        if (value !== null && value !== undefined) {
          if (typeof value === "object") {
            if (key !== mainkey) {              
              this.searchValue(mainkey, value);
            } else {              
              switch (key) {
                case "Staff": { 
                  for (var i=0; i < value.length; i++) {
                    var data = value[i];   
                    var staffCode = OPTs.STAFF_LIST.find(dt => Number(dt.Code) === Number(data["StaffPosition"]));
                    this.results.push({
                      id: i,
                      BirthDt: data["BirthDt"],
                      PersonName:data["PersonName"],
                      Nationality: data["PartyData"]["Nationality"],
                      Address: data["PartyData"]["Contact"]["Locator"]["PostAddr"],
                      Phone: data["PartyData"]["Contact"]["Locator"]["Phone"],
                      Identification: data["PartyData"]["IssuedIdent"],
                      PartyType: data["PartyKey"]["PartyType"],
                      Shareholding: data["Shareholding"]!==undefined?data["Shareholding"]:0,
                      StaffPosition:  staffCode?.DBCode??"ACC"
                    });      
                    console.log("Staff",this.results);             
                  }
                  break;
                }
                default: {
                  break;
                }
              }
            }
          }
        }
      }
    } catch (err) { }
  }

  static getRequestModel() {
    const item = {

    };

    return item;
  }
}



