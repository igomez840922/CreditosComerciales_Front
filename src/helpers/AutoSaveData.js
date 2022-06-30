
import { BackendServices, CoreServices } from "../services";
import moment from "moment";

const backendServices = new BackendServices();
const coreServices = new CoreServices();

export default class AutoSaveData {


  //salvamos deudas de un tramite
  async saveInitialData(transactionId) {
    this.saveDebts(transactionId);
    this.saveAccountMovements(transactionId);
    this.saveCorporateExhibition(transactionId);
    this.saveCorporateExhibitionByClients(transactionId);
    this.saveFacilities(transactionId);
  }

  //salvamos exposicion por tramite
  async saveCorporateExhibition(transactionId) {
    try {

      /*var dataResult = await backendServices.getExposicionCorporativaBD(transactionId);
      if (dataResult !== undefined && dataResult !== null && dataResult.length > 0) {
        return;
      }*/

      //Borrar de BD todas las Exposicion Corporativa con "t24"= true
      await backendServices.eliminarExposicionCorporativaBD(transactionId);

      var dataResult = await coreServices.getCorporateExhibition(transactionId)
      for (let i = 0; i < dataResult.length; i++) {
        let datoSent = {
          "transactId": Number(transactionId),
          //"accountNumber": data.name,
          //"t24ClientId": data.customerNumberT24,
          "description": dataResult[i].name,
          "approved": dataResult[i].approved,
          "currentBalance": dataResult[i].balance,
          "proposed": dataResult[i].proposal,
          "ltv": 0,
          t24: true,
          "difference": dataResult[i].variation,
          "guarantee": 0,
        }
        await backendServices.saveExposicionCorporativaBD(datoSent)
      }
    }
    catch (err) { }
  }

  //salvamos exposicion por tramite
  async saveCorporateExhibitionByClients(transactionId) {
    try {

      /*var dataResult = await backendServices.getExposicionCorporativaClienteBD(transactionId);
      if (dataResult !== undefined && dataResult !== null && dataResult.length > 0) {
        return;
      }*/

      backendServices.eliminarExposicionCorporativaClienteBD(transactionId)

      var debtors = await backendServices.consultarDeudores(transactionId);
      if (debtors === null || debtors === undefined) {
        return undefined;
      }

      //Borrar de BD todas las Exposicion Corporativa Cliente con "t24"= true

      for (var i = 0; i < debtors.length; i++) {
        var partyId = debtors[i].customerNumberT24;
        var debtorName = debtors[i] !== undefined ? (debtors[i].typePerson == "2" ? debtors[i].name : (debtors[i].name + " " + debtors[i].name2 + " " + debtors[i].lastName + " " + debtors[i].lastName2)) : "";
        var dataResult = await coreServices.getCorporateExhibitionByClients(partyId)
        for (let p = 0; p < dataResult.length; p++) {
          let datoSent = {
            "transactId": Number(transactionId),
            "accountNumber": debtorName,
            "t24ClientId": partyId,
            "description": dataResult[p].name,
            "approved": dataResult[p].approved,
            "currentBalance": dataResult[p].balance,
            "proposed": dataResult[p].proposal,
            "ltv": 0,
            t24: true,
            "difference": dataResult[p].variation,
            "guarantee": 0,
          }
          console.log("saveCorporateExhibitionByClients", datoSent);
          await backendServices.saveExposicionCorporativaClienteBD(datoSent)
        }
      }


    }
    catch (err) { }
  }

  //salvamos facilidades por tramite
  async saveFacilities(transactionId) {
    try {

      var request = await backendServices.consultGeneralDataPropCred(transactionId);
      var dataResult = await backendServices.consultarFacilidadesT24(request[0].requestId);
      /*if (dataResult !== undefined && dataResult !== null && dataResult.length > 0) {
        return;
      }*/

      //Borrar de BD todas las Facilidades con "t24"= true
      console.log("saveFacilities", dataResult);
      backendServices.eliminarFacilidadesFisica(request[0].requestId);

      var dataResult = await coreServices.getFacilitiesByTransaction(transactionId)
      for (let i = 0; i < dataResult.length; i++) {
        let datoSent = {
          "facilityNumber": dataResult[i].AcctId,
          "cr": dataResult[i].AcctId,
          "amount": dataResult[i].approvedAmount,
          "debtor": dataResult[i].debtorName,
          "clientTypeId": dataResult[i].debtorId,
          "balance": dataResult[i].actualBalance,
          "purpose": "",
          "sublimits": "",
          "proposalRate": 0,
          "noSubsidyRate": 0,
          "effectiveRate": 0,
          "feci": false,
          "termDays": 0,
          "termDescription": "",
          "ltv": 0,
          "finantialConditions": " ",
          "environmentRiskCategory": 0,
          "covenant": " ",
          "environmentRiskOpinion": " ",
          "finantialCovenant": " ",
          "legalDocumentation": "  ",
          "otherConditions": " ",
          "creditRiskOpinion": " ",
          "provision": " ",
          "proposalTypeId": "",
          "proposalTypeName": "",
          "facilityTypeId": dataResult[i].facilityType ?? "",
          "termType": "",
          "origin": "CORE",
          "applyEscrow": false,
          "facilityId": 0,
          "requestId": request[0].requestId ?? "",
          "startingAmount": 0,
          t24: true,
          "term": ""
        }
        await backendServices.newFacilityPropCred(datoSent)
        console.log("saveFacilities", dataResult);
      }
    }
    catch (err) { }
  }

  //salvamos deudas a Corto y largo Plazo
  async saveDebts(transactionId) {
    try {

      var checkCP = false;
      var checkLP = false;
      var dataResult = await backendServices.consultBankingRelationsDebtsCP(transactionId);
      dataResult = dataResult.getBankingRelationCPDTOList;
      var dataResultLP = await backendServices.consultBankRelationsDebtsLP(transactionId);
      dataResultLP = dataResultLP.bankingRelationLPDTOList;
      var dataResultCore = await coreServices.getAllTermDebtsByTransaction(transactionId);

      console.log("fase0", dataResult);
      console.log("fase001", dataResultLP);
      console.log("fase002", dataResultCore);
      for (var short of dataResultCore.shortTermresult) {
        let record = dataResult == undefined || dataResult == null || dataResult.length == 0 ? undefined : dataResult.find(x => x.codigot24 == short?.codeT24 ?? "");
        console.log("fase1", short);
        console.log("fase1", record);

        if (record !== undefined && record != null) {
          if (short?.dateT24 ?? "" > record.fechat24) {
            console.log("fase2", short);

            //Verificar si existe un record en dataResult.getBankingRelationCPDTOList con el mismo codeT24 .... si la fecha es mayor, actualizar amount, dateT24
            let dataSet = {
              "facilityType": record.facilityType,
              "amount": Number(short?.approvedAmount ?? 0),//ACTUALIZA
              "date": record?.startDate ?? "",
              "expirationDate": record?.endDate ?? "",
              "debitBalance1": Number(record?.balance ?? 0),
              "debitBalance2": record.debitBalance2,
              "debitBalance3": record.debitBalance3,
              "paymentHistory": record.paymentHistory,
              "rate": record.rate,
              "fee": record.fee,
              "bail": record.bail,
              "fundDestiny": record.fundDestiny,
              status: true,
              t24: true,
              "bank": record.bank,
              "transactId": Number(transactionId),
              "codigot24": short?.codeT24 ?? "",
              "fechat24": (moment(short?.dateT24, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? moment().format("YYYY-MM-DD") : (moment(short?.dateT24, "DD/MM/YYYY").format("YYYY-MM-DD"))),//ACTUALIZA
              "debtId": record?.debtId,
            }
            await backendServices.updateBankRelationsDebtsCP(dataSet).then(resp => {

            })
          } else if (short?.dateT24 == "" || short?.dateT24 == null) {
            console.log("fase3", short);

            //si no tiene fecha actualizar todo
            let dataSet = {
              "facilityType": short?.facilityType ?? " ",
              "amount": Number(short?.approvedAmount ?? 0),//ACTUALIZA
              "date": record?.startDate ?? "",
              "expirationDate": record?.endDate ?? "",
              "debitBalance1": Number(short?.balance ?? 0),//ACTUALIZA
              "debitBalance2": record.debitBalance2,
              "debitBalance3": record.debitBalance3,
              "paymentHistory": short?.paymentHistory ?? " ",//ACTUALIZA
              "rate": record.rate,
              "fee": record.fee,
              "bail": record.bail,
              "fundDestiny": record.fundDestiny,
              status: true,
              t24: true,
              "bank": short?.bank ?? " ",//ACTUALIZA
              "transactId": Number(transactionId),
              "codigot24": short?.codeT24 ?? "",//ACTUALIZA
              "fechat24": (moment(short?.dateT24, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? moment().format("YYYY-MM-DD") : (moment(short?.dateT24, "DD/MM/YYYY").format("YYYY-MM-DD"))),//ACTUALIZA
              "debtId": record?.debtId,
            }
            await backendServices.updateBankRelationsDebtsCP(dataSet).then(resp => {

            })
          }
        } else {
          console.log("fase5", short);

          // si no existe un record en dataResult.getBankingRelationCPDTOList... siempre agregamos
          let dataSet = {
            "facilityType": short.facilityType,//NUEVO
            "amount": Number(short?.approvedAmount ?? 0),//NUEVO
            "date": record?.startDate ?? "",
            "expirationDate": record?.endDate ?? "",
            "debitBalance1": Number(short?.balance ?? 0),//NUEVO
            "debitBalance2": 0,//NUEVO
            "debitBalance3": 0,//NUEVO
            "paymentHistory": short?.paymentHistory ?? " ",//NUEVO
            "rate": 0,//NUEVO
            "fee": 0,//NUEVO
            "bail": 0,//NUEVO
            "fundDestiny": "",//NUEVO
            status: true,//NUEVO
            t24: true,//NUEVO
            "bank": short?.bank ?? " ",//NUEVO
            "transactId": Number(transactionId),//NUEVO
            "codigot24": short?.codeT24 ?? "",//NUEVO
            "fechat24": (moment(short?.dateT24, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? moment().format("YYYY-MM-DD") : (moment(short?.dateT24, "DD/MM/YYYY").format("YYYY-MM-DD"))),//ACTUALIZA

          }
          await backendServices.newBankingRelationsDebtsCP(dataSet).then(resp => {

          })
        }
      }
      for (var long of dataResultCore.longTermresult) {
        let record = dataResultLP == undefined || dataResultLP == null || dataResultLP.length == 0 ? undefined : dataResultLP.find(x => x.codigot24 == long?.codeT24 ?? "");
        if (record !== undefined && record != null) {
          if (long?.dateT24 ?? "" > record.fechat24) {
            //Verificar si existe un record en dataResult.getBankingRelationCPDTOList con el mismo codeT24 .... si la fecha es mayor, actualizar amount, dateT24
            let dataSet = {
              "facilityType": record.facilityType,
              "amount": Number(long?.approvedAmount ?? 0),//ACTUALIZA
              "date": record?.startDate ?? "",
              "expirationDate": record?.endDate ?? "",
              "debitBalance1": Number(record?.balance ?? 0),
              "debitBalance2": record.debitBalance2,
              "debitBalance3": record.debitBalance3,
              "paymentHistory": record.paymentHistory,
              "rate": record.rate,
              "fee": record.fee,
              "bail": record.bail,
              "fundDestiny": record.fundDestiny,
              status: true,
              t24: true,
              "bank": record.bank,
              "transactId": Number(transactionId),
              "codigot24": long?.codeT24 ?? "",//ACTUALIZA
              "fechat24": (moment(long?.dateT24, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? moment().format("YYYY-MM-DD") : (moment(long?.dateT24, "DD/MM/YYYY").format("YYYY-MM-DD"))),//ACTUALIZA
              "debtId": record?.debtId,
            }
            await backendServices.updateBankRelationsDebtsLP(dataSet).then(resp => {

            })
          } else if (long?.dateT24 == "" || long?.dateT24 == null) {
            //si no tiene fecha actualizar todo
            let dataSet = {
              "facilityType": long?.facilityType ?? " ",
              "amount": Number(long?.approvedAmount ?? 0),//ACTUALIZA
              "date": record?.startDate ?? "",
              "expirationDate": record?.endDate ?? "",
              "debitBalance1": Number(long?.balance ?? 0),//ACTUALIZA
              "debitBalance2": record.debitBalance2,
              "debitBalance3": record.debitBalance3,
              "paymentHistory": long?.paymentHistory ?? " ",//ACTUALIZA
              "rate": record.rate,
              "fee": record.fee,
              "bail": record.bail,
              "fundDestiny": record.fundDestiny,
              status: true,
              t24: true,
              "bank": long?.bank ?? " ",//ACTUALIZA
              "transactId": Number(transactionId),
              "codigot24": long?.codeT24 ?? "",
              "fechat24": (moment(long?.dateT24, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? moment().format("YYYY-MM-DD") : (moment(long?.dateT24, "DD/MM/YYYY").format("YYYY-MM-DD"))),//ACTUALIZA
              "debtId": record?.debtId,
            }
            await backendServices.updateBankRelationsDebtsLP(dataSet).then(resp => {

            })

          }
        } else {
          // si no existe un record en dataResult.getBankingRelationCPDTOList... siempre agregamos
          let dataSet = {
            "facilityType": long.facilityType,
            "amount": Number(long?.approvedAmount ?? 0),
            "date": record?.startDate ?? "",
            "expirationDate": record?.endDate ?? "",
            "debitBalance1": Number(long?.balance ?? 0),
            "debitBalance2": 0,
            "debitBalance3": 0,
            "paymentHistory": long.paymentHistory,
            "rate": 0,
            "fee": 0,
            "bail": 0,
            "fundDestiny": "",
            status: true,
            t24: true,
            "bank": long.bank,
            "transactId": Number(transactionId),
            "codigot24": long?.codeT24 ?? "",
            "fechat24": (moment(long?.dateT24, "DD/MM/YYYY").format("YYYY-MM-DD") == "Invalid date" ? moment().format("YYYY-MM-DD") : (moment(long?.dateT24, "DD/MM/YYYY").format("YYYY-MM-DD"))),//ACTUALIZA
          }
          await backendServices.newBankingRelationsDebtsLP(dataSet).then(resp => {

          })
        }
      }
    }
    catch (err) { console.error("newBankingRelationsDebts", err) }
  }

  //salvamos facilidades por tramite
  async saveAccountMovements(transactionId) {
    try {

      //var dataResult = await backendServices.consultMovementsBank(transactionId);
      //if (dataResult !== undefined && dataResult !== null && (dataResult.bankBanesco.length > 0 || dataResult.bankOthersBank.length > 0)) {
      //return;
      //}

      //Borrar de BD todos los Movimientos de Cuenta cuyo "t24"= true
      backendServices.deleteFisicalMovementsAccountsIGR(transactionId);

      var dataResult = await coreServices.getAccountMovementsByTransaction(transactionId)
      for (let i = 0; i < dataResult.length; i++) {
        //aqui cargamos por cuentas
        let cuenta = dataResult[i].AcctId;
        for (let j = 0; j < dataResult[i].dataByYear.length; j++) {
          console.log("data[i].dataByYear", dataResult[i].dataByYear);
          for (let k = 0; k < dataResult[i].dataByYear[j].dataresult.length; k++) {
            let jsonSet = {
              "trasactId": Number(transactionId),
              "year": dataResult[i].dataByYear[j].dataresult[k].year,
              "month": dataResult[i].dataByYear[j].dataresult[k].month,
              "deposits": dataResult[i].dataByYear[j].dataresult[k].deposits,
              "averageBalance": dataResult[i].dataByYear[j].dataresult[k].amount,
              "observations": "",
              "accountNumber": cuenta,
              "t24": true
            }
            await backendServices.newMovementsAccountsIGR(jsonSet);
          }
        }
      }
    }
    catch (err) { }
  }

}