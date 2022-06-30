export default class PartiesInformationModel {
  static results = [];

  static fromJson(json) {
    this.results = [];

    this.searchValue("PersonData", json);

    const items = new PartiesInformationModel();
    items.results = this.results;

    console.log("Results: " + items.results);

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
                case "PersonData": {
                  mainkey = "PersonName";
                  this.searchValue(mainkey, value);
                  break;
                }
                case "PersonName": {
                  this.results.push({
                    id: this.results.length + 1,
                    FristName: value["FirstName"],
                    Fname: value["FullName"],
                    Lname: value["LastName"],
                    SLname: value["SecondLastName"],
                    Sname: value["SecondName"],
                    Shortname: value["ShortName"],
                  });
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
    } catch (err) {}
  }

  static getRequestModel() {
   

    const item = {
      
    };

    return item;
  }
}
