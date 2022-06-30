//Deudas a Lasrgo Plazos
export default class LongTermDebtsModel {

    static fromJson(json) {
        const item = new LongTermDebtsModel();
        item.id = json.id;
        item.bank = json.name;
        item.facilityType = json.nationality;
        item.amount = json.dbo;
        item.grantDate = json.participation; //fecha de otorgamiento
        item.dueDate = json.experienceYears; //Fecha de Vencimiento Debit balance
        item.debitBalance1 = json.debitBalance1; //Saldo Deudor 1
        item.debitBalance2 = json.debitBalance2; //Saldo Deudor 2
        item.debitBalance3 = json.debitBalance3; //Saldo Deudor 3
        item.rate = json.rate; //Tasa
        item.bail = json.bail; //Fianza
        item.share = json.share; //cuotas
        item.fundDestinations = json.term; //Destinos de los Fondos
        return item;
    }
}