
import moment from "moment";

export class PersonModel{    
    constructor() {
      this.transactId=0;
      this.personId=0;
      this.personType="1"; //tipo de Persona
      this.idType="CED"; //tipo de Identificacion
      this.clientDocumentId="";//No. de identificacion
      this.customerNumberT24=""; //No. de Cliente T24
      this.name="";//1er Nombre
      this.secondName="";//2do Nombre
      this.lastName=""; //1er Apellido
      this.secondSurname=""//2do Apellido
      this.nationality="PA";//Nacionalidad
      this.birthDate= "";//moment().format("YYYY-MM-DD");//Fecha nacimiento "1998-08-17",
      this.address=""; //direccion
      this.phone=""; //Telefono,
      this.email="";//Email
      this.countryOfResidence="PA";//pais de residencia
      this.comments="";
      this.roles =[];
      this.blacklist =[];
      this.isNew =true;
    }
  }