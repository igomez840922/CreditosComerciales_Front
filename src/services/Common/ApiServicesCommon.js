import EconomicActivityModel from "../../models/Common/EconomicActivityModel";
import EconomicGroupModel from "../../models/Common/EconomicGroupModel";
import BankingModel from "../../models/Common/BankingModel";
import IdentificationTypeModel from "../../models/Common/IdentificationTypeModel";
import CountryModel from "../../models/Common/CountryModel";
import ProvinceModel from "../../models/Common/ProvinceModel";
import CityModel from "../../models/Common/CityModel";
import DistrictModel from "../../models/Common/DistrictModel";
import TownshipModel from "../../models/Common/TownshipModel";
import SectorModel from "../../models/Common/SectorModel";
import SubSectorModel from "../../models/Common/SubSectorModel";
import ShareholderModel from "../../models/Common/ShareholderModel";
import TransactionModel from "../../models/Common/TransactionModel";

const defaultResponseHandler = (response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response.json();
};

const bpmResponseHandler = (response) => {
  if( !response || !response.Status ) {
    throw Error("Invalid Response");
  }
  if( response.Status.StatusCode !== 'M0000' ) {
    throw Error(response.Status.StatusDesc);
  }
  return response;
}

export default class ApiServicesCommon {

  getEconomicActivityList() {
    return fetch("/api/bpm/common/economicactivity", { method: 'GET' })
      .then(defaultResponseHandler)
      .then((data) => {
        // parse results
        return data.map(item => EconomicActivityModel.fromJson(item));
      });
  }

  getEconomicGroupList() {
    return fetch("/api/bpm/common/economicgroup", { method: 'GET' })
      .then(defaultResponseHandler)
      .then((data) => {
        // parse results
        return data.map(item => EconomicGroupModel.fromJson(item));
      });
  }

  getBankingList() {
    return fetch("/api/bpm/common/banking", { method: 'GET' })
      .then(defaultResponseHandler)
      .then((data) => {
        // parse results
        return data.map(item => BankingModel.fromJson(item));
      });
  }

  getIdentificationTypeList() {
    return fetch("/api/bpm/common/idtype", { method: 'GET' })
      .then(defaultResponseHandler)
      .then((data) => {
        // parse results
        return data.map(item => IdentificationTypeModel.fromJson(item));
      });
  }

  getCountryList() {
    return fetch("/api/bpm/common/country", { method: 'GET' })
      .then(defaultResponseHandler)
      .then((data) => {
        // parse results
        return data.map(item => CountryModel.fromJson(item));
      });
  }

  getProvinceList() {
    return fetch("/api/bpm/common/province", { method: 'GET' })
      .then(defaultResponseHandler)
      .then((data) => {
        // parse results
        return data.map(item => ProvinceModel.fromJson(item));
      });
  }

  getCityList() {
    return fetch("/api/bpm/common/city", { method: 'GET' })
      .then(defaultResponseHandler)
      .then((data) => {
        // parse results
        return data.map(item => CityModel.fromJson(item));
      });
  }

  getDistrictList() {
    return fetch("/api/bpm/common/district", { method: 'GET' })
      .then(defaultResponseHandler)
      .then((data) => {
        // parse results
        return data.map(item => DistrictModel.fromJson(item));
      });
  }

  getTownshipList() {
    return fetch("/api/bpm/common/township", { method: 'GET' })
      .then(defaultResponseHandler)
      .then((data) => {
        // parse results
        return data.map(item => TownshipModel.fromJson(item));
      });
  }

  getSectorList() {
    return fetch("/api/bpm/common/sector", { method: 'GET' })
      .then(defaultResponseHandler)
      .then((data) => {
        // parse results
        return data.map(item => SectorModel.fromJson(item));
      });
  }

  getSubSectorList() {
    return fetch("/api/bpm/common/subsector", { method: 'GET' })
      .then(defaultResponseHandler)
      .then((data) => {
        // parse results
        return data.map(item => SubSectorModel.fromJson(item));
      });
  }

  getShareholderList() {
    return fetch("/api/bpm/common/shareholderinfo", { method: 'GET' })
      .then(defaultResponseHandler)
      .then((data) => {
        // parse results
        return data.map(item => ShareholderModel.fromJson(item));
      });
  }

  getTransactions(accountId, startDate, endDate) {
    return fetch(`/api/bpm/common/transactions/${accountId}?startDate=${startDate}&endDate=${endDate}`)
      .then(bpmResponseHandler)
      .then((data) => {
        // parse results
        return TransactionModel.fromJsonArray(data.Trn);
      });
  }

}
