//Facilidades de Activos Fijos
export default class FixedAssetsFacilityModel {

    static fromJson(json) {
        const item = new FixedAssetsFacilityModel();
        item.id = json.id;
        item.address = json.address; //direccion
        item.description = json.description; 
        item.propertyType = json.propertyType; //Tipo de Propiedad
        item.ownerCompany=json.ownerCompany; //Sociedad Propietaria
        item.rentalAmount=json.rentalAmount; //Monto de Alquiler
        item.leaseFee=json.leaseFee; //Canon de Arrendamiento
        item.contractPeriod=json.contractPeriod; //Duración del Contrato
        item.leaseTerms=json.leaseTerms; //Condiciones de Arrendamiento
        return item;
    }
}