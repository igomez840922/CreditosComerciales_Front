export default class ResultadoFideicomitenteModel {

    static fromJson(json) {
        //console.log(json)

        const item = new ResultadoFideicomitenteModel();

        item.id = json.id;
        // parse date
        //item.date = new Date(json.date);   
        item.client = {
            name: json.name,
            address: json.address,
            email: json.email,
              phone: json.phone,
           
        };
      
         
        return item;
    }
}

