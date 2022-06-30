export default class ClientInfoModel {

    static results=[];

    static fromJson(json) {
            
        this.results = [];
        
        this.searchValue('Party',json);
               
        //console.log("Results: " + this.results);
        
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
                            switch(key){
                                case "Party":{
                                    var item = {id:value['PartyKey'].PartyId,partyType:value['PartyKey'].PartyType};
                                    
                                    try{
                                        if(item.partyType === "1"){
                                        
                                            item.clientname = value['PersonPartyInfo'].PersonData.PersonName.FullName;
    
                                            item.firstname = value['PersonPartyInfo'].PersonData.PersonName.FirstName;
                                            item.secondname = value['PersonPartyInfo'].PersonData.PersonName.SecondName;
                                            item.lastname = value['PersonPartyInfo'].PersonData.PersonName.LastName;
                                            item.secondlastname = value['PersonPartyInfo'].PersonData.PersonName.SecondLastName;
        
                                            item.idtype= value['PersonPartyInfo'].PersonData.IssuedIdent[0].Ident.IssuedIdentType;
                                            item.idnumber=value['PersonPartyInfo'].PersonData.IssuedIdent[0].Ident.IssuedIdentValue;
                                            item["phoneNumber"] = value['PersonPartyInfo'].PersonData.Contact.Locator.Phone!==undefined? value['PersonPartyInfo'].PersonData.Contact.Locator.Phone[0].PhoneNum??"":"";
                                            item["email"] =value['PersonPartyInfo'].PersonData.Contact.Locator.Email!==undefined?  value['PersonPartyInfo'].PersonData.Contact.Locator.Email[0]?.Value??"":"";
                                            item["birthdate"] = value['PersonPartyInfo'].PersonData.BirthDt!==undefined? value['PersonPartyInfo'].PersonData.BirthDt:"";
                                            item["address"] = value['PersonPartyInfo'].PersonData.Contact.Locator.PostAddr!==undefined? value['PersonPartyInfo'].PersonData.Contact.Locator.PostAddr[0]:"";
                                            item["economicActivity"] = value['PersonPartyInfo']?.EconomicActivity?.Cod??"";
                                            item["nationality"] = value['PersonPartyInfo'].PersonData.Nationality;
                                        }
                                        else{                                        
                                            
                                            item.legalName = value['OrgPartyInfo'].OrgData.OrgName.LegalName;
                                            item.businessName = value['OrgPartyInfo'].OrgData.OrgName.BusinessName;
    
                                            item.clientname =item.businessName;
                                            item.firstname =  item.legalName;
                                            item.secondname = item.businessName;
                                            item.lastname = "";//item.legalName;
                                            item.secondlastname = "";
        
                                            item.idtype= value['OrgPartyInfo'].OrgData.IssuedIdent[0].Ident.IssuedIdentType;
                                            item.idnumber=value['OrgPartyInfo'].OrgData.IssuedIdent[0].Ident.IssuedIdentValue;
                                            item.phoneNumber = value['OrgPartyInfo'].OrgData.Contact.Locator.Phone[0]?.PhoneNum??"";
                                            item.email = value['OrgPartyInfo'].OrgData.Contact.Locator.Email[0]?.Value??"";
                                            item["address"] = value['OrgPartyInfo'].OrgData.Contact.Locator.PostAddr[0];
                                            item["economicActivity"] = value['OrgPartyInfo']?.EconomicActivity?.Cod??"";
                                            item["nationality"] = value['OrgPartyInfo'].OrgData.Nationality;
                                        }
                                    }
                                    catch(err){
                                        console.error("userInfo",err)
                                    }
                                    console.log("userInfo",item);
                                    
                                    item.idtype = item.idtype ==="CIP"?"CED":item.idtype;

                                    /*
                                    value['PersonPartyInfo'].PersonData.IssuedIdent.map(function(data, i){
                                        switch(data.Ident.IssuedIdentType){
                                            case "CED":{
                                                item.idtype="CEDULA";
                                                break;
                                            }
                                            case "PAS":{
                                                item.idtype="PASAPORTE";
                                                break;
                                            }
                                            default:{
                                                item.idtype="RUC";
                                                break;
                                            }
                                        }
                                        item.idnumber=data.Ident.IssuedIdentValue;
                                    })*/

                                    this.results.push(item);                                    
                                    break;
                                }
                                default:{break;}
                            }            
                        }
                    }
                }                
            }
        }
        catch(err){                      
            console.error(err);}
      }
    
    
}

/*
NATURAL
{
    "Party": {
        "PersonPartyInfo": {
            "AcctOfficial": "3917",
            "BankRelType": {
                "Cod": "4"
            },
            "ClubBanesco": "9999",
            "CustomerClass": "Cliente Regular",
            "CustomerType": "N",
            "EconomicActivity": {
                "Cod": "2103"
            },
            "EstablishedDt": "2016-01-22T00:00:00",
            "Industry": "1096",
            "Language": "2",
            "MNEMONIC": "P800120843",
            "OriginatingBranch": "PA0010016",
            "ReferredBy": "3365",
            "ResidenceCountry": {
                "CountryCode": "PA"
            },
            "SalesChannel": {
                "Value": "BRANCHES"
            },
            "SecAcctOfficial": "0903",
            "Sector": "1000",
            "SIBRelType": {
                "Cod": "P111"
            },
            "SubTarget": {
                "Cod": "0003"
            },
            "Target": "1",
            "Referral": "COLLABORATOR",
            "CRMRel": [
                {
                    "CustomerId": "600128176",
                    "RelationshipType": {
                        "Cod": "50"
                    }
                }
            ],
            "CostCenter": {
                "CostCenterId": "5112000016"
            },
            "PEPData": {
                "GovRelated": false,
                "IsPEP": false,
                "Family": false,
                "Collaborator": false
            },
            "Income": {
                "Freq": "3",
                "IncomeLocation": "01",
                "IncomeSource": "1004",
                "IncomeType": "LT"
            },
            "FATCA": {
                "OtherNationality": false,
                "US183Permanence": false,
                "USRelated": false,
                "USResid": false,
                "USSignor": false
            },
            "CreditRisk": [
                {
                    "CalcRiskClass": "RBAJ",
                    "ManualRiskClass": "PA01"
                }
            ],
            "PartyStatus": {
                "Status": "1"
            },
            "TaxData": {
                "PanamaResident": false,
                "TaxCountryRes": [
                    {
                        "Country": null
                    }
                ]
            },
            "EducationLevel": "5",
            "LastUpDt": "2022-01-12T00:00:00",
            "MaritalStat": {
                "Value": "SINGLE"
            },
            "Profession": {
                "Value": "1163"
            },
            "SocialSecNumber": "2",
            "Employment": {
                "EmploymentStartDt": "2020-08-16",
                "JobTitle": "ANALISTA DE SISTEMAS",
                "Salary": {
                    "Amt": "4500.00"
                },
                "SalaryFreq": "3",
                "SalaryRange": "4",
                "TimeFrame": {
                    "Duration": {
                        "Desc": "1 año 1 me"
                    }
                },
                "OtherIncome": [
                    {
                        "IncomeAmt": {
                            "Amt": "0.0"
                        },
                        "IncomeLocation": null,
                        "IncomeSource": null
                    }
                ],
                "OrgData": {
                    "Contact": {
                        "Locator": {
                            "Phone": [
                                {
                                    "PhoneNum": "3013665"
                                }
                            ],
                            "PostAddr": [
                                {
                                    "AddrDesc": "AQUILINO DE LA GUARDIA",
                                    "Building": {
                                        "Desc": "AUGUSTO SAMUEL BOYD"
                                    },
                                    "City": {
                                        "Cod": "PA"
                                    },
                                    "CountyDistrict": {
                                        "Cod": "8047"
                                    },
                                    "HouseNumber": "1",
                                    "Jurisdiction": {
                                        "Cod": "8590"
                                    },
                                    "Province": {
                                        "Cod": "PA08"
                                    },
                                    "Country": {
                                        "CountryCode": "PA"
                                    }
                                }
                            ]
                        }
                    },
                    "IssuedIdent": [
                        {
                            "Ident": {
                                "IssuedIdentValue": "001247"
                            }
                        }
                    ],
                    "BusinessType": "3001",
                    "Type": "3000",
                    "OrgName": {
                        "FullName": "BANESCO S A"
                    }
                }
            },
            "EmployeeData": null,
            "PersonData": {
                "Contact": {
                    "Locator": {
                        "Email": [
                            {
                                "Value": "CCAMPOS@BANESCO.COM"
                            }
                        ],
                        "Phone": [
                            {
                                "PhoneNum": "3821109",
                                "PhoneType": "Home"
                            },
                            {
                                "AreaCode": "507",
                                "PhoneNum": "69831403",
                                "PhoneType": "Mobile"
                            },
                            {
                                "PhoneNum": "3013665",
                                "PhoneType": "Other"
                            }
                        ],
                        "PostAddr": [
                            {
                                "AddrDesc": "FRENTE AL PH MIRADOR DEL CANGREJO",
                                "Building": {
                                    "Desc": "PH MARQUIS"
                                },
                                "City": {
                                    "Desc": "Panama"
                                },
                                "CountyDistrict": {
                                    "Cod": "8047"
                                },
                                "HouseNumber": "4B",
                                "Jurisdiction": {
                                    "Cod": "8590"
                                },
                                "Province": {
                                    "Cod": "PA08"
                                },
                                "Street": "AUGUSTO SAMUEL BOYD",
                                "Country": {
                                    "CountryCode": "Panama"
                                }
                            },
                            null
                        ]
                    }
                },
                "Nationality": "VE",
                "IssuedIdent": [
                    {
                        "ExpDt": "2022-12-16T00:00:00",
                        "Ident": {
                            "IssuedIdentType": "PAS",
                            "IssuedIdentValue": "084914794"
                        },
                        "IssuedLoc": {
                            "Value": "VE"
                        },
                        "IssueDt": "2020-12-16T00:00:00"
                    },
                    {
                        "Ident": {
                            "IssuedIdentType": "PAS",
                            "IssuedIdentValue": "84914794"
                        },
                        "IssuedLoc": {
                            "Value": "VE"
                        },
                        "IssueDt": "2019-08-02T00:00:00"
                    }
                ],
                "BirthDt": "1991-05-08",
                "Gender": "MALE",
                "PersonName": {
                    "FirstName": "MIGUEL",
                    "FullName": "MIGUEL ANGEL QUEVEDO MORENO",
                    "LastName": "QUEVEDO",
                    "SecondLastName": "MORENO",
                    "SecondName": "ANGEL",
                    "ShortName": "QUEVEDO MIGUEL"
                }
            }
        },
        "PartyKey": {
            "PartyId": "800120843",
            "PartyType": "1"
        }
    },
    "Status": {
        "StatusCode": "M0000",
        "StatusDesc": "OK"
    }
}
*/

/*
JURIDICO
{    
    "Party": {
        "OrgPartyInfo": {
            "AcctOfficial": "3929",
            "BankRelType": {
                "Cod": "1"
            },
            "ClubBanesco": "9999",
            "CustomerClass": "Clien",
            "CustomerType": "N",
            "EconomicActivity": {
                "Cod": "1413"
            },
            "Industry": "1001",
            "Language": "2",
            "MNEMONIC": "P600213598",
            "OriginatingBranch": "PA0010065",
            "ResidenceCountry": {
                "CountryCode": "PA"
            },
            "SalesChannel": {
                "Value": "BRANCHES"
            },
            "SecAcctOfficial": "2418",
            "Sector": "2000",
            "SIBRelType": {
                "Cod": "G111 "
            },
            "SubTarget": {
                "Cod": "0124"
            },
            "Target": "10",
            "CRMRel": [
                {
                    "CustomerId": "600128176",
                    "RelationshipType": {
                        "Cod": "61"
                    }
                },
                null
            ],
            "CostCenter": {
                "CostCenterId": "5150300065"
            },
            "PEPData": {
                "IsPEP": false
            },
            "Income": {
                "Freq": "3",
                "IncomeLocation": "03",
                "IncomeSource": "MD"
            },
            "FATCA": null,
            "CreditRisk": [
                {
                    "CalcRiskClass": "RALT",
                    "ManualRiskClass": "PA01"
                }
            ],
            "PartyStatus": {
                "Status": "1"
            },
            "TaxData": {
                "PanamaResident": false,
                "TaxCountryRes": [
                    null
                ]
            },
            "BusinessStartDt": "2010-11-23",
            "FirstContactDt": "2017-04-03",
            "LastUpDt": "2021-11-19T00:00:00",
            "IdGroup": {
                "Cod": "600213598"
            },
            "OrgEstablishDt": "2010-10-25",
            "ResidenceAgent": [
                "LUIS"
            ],
            "SocCountry": {
                "CountryName": "PA"
            },
            "SocType": {
                "Cod": "1"
            },
            "StockQuoting": false,
            "StockExchange": {
                "Percentage": 0
            },
            "OrgData": {
                "Contact": {
                    "Locator": {
                        "Email": [
                            {
                                "Value": "BARAKE.RD@HOTMAIL.COM"
                            }
                        ],
                        "Phone": [
                            null,
                            {
                                "AreaCode": "507",
                                "PhoneNum": "69828201"
                            },
                            null
                        ],
                        "PostAddr": [
                            {
                                "AddrDesc": "C 4TA FTE A MELO Y CIA DAVID",
                                "Building": {
                                    "Desc": "AVENIDA OVALDIA"
                                },
                                "City": {
                                    "Desc": "Panama"
                                },
                                "CountyDistrict": {
                                    "Cod": "8020"
                                },
                                "HouseNumber": "S/N",
                                "Jurisdiction": {
                                    "Cod": "8360"
                                },
                                "Province": {
                                    "Cod": "PA04"
                                },
                                "Street": "CALLE CUARTA FINAL",
                                "Country": {
                                    "CountryCode": "PA"
                                }
                            },
                            {
                                "AddrDesc": "CHIRIQUI",
                                "Country": {
                                    "CountryCode": "PA"
                                }
                            }
                        ]
                    }
                },
                "Nationality": "PA",
                "IssuedIdent": [
                    {
                        "Ident": {
                            "IssuedIdentType": "RUC",
                            "IssuedIdentValue": "0001866702-0001-0000716350"
                        },
                        "IssuedLoc": {
                            "Value": "PA"
                        },
                        "IssueDt": "2019-08-02T00:00:00"
                    }
                ],
                "NumShareholder": 1,
                "NumShares": 200,
                "SalesVolume": {
                    "Cod": "03"
                },
                "SharesType": {
                    "Cod": "1"
                },
                "MonthlySalesVol": 163373.56,
                "OrgName": {
                    "BusinessName": "BARAKE",
                    "FullName": "BARAKE S A",
                    "LegalName": "BARAKE S A "
                }
            }
        },
        "PartyKey": {
            "PartyId": "600213598",
            "PartyType": "2"
        }
    },
    "Status": {
        "StatusCode": "M0000",
        "StatusDesc": "OK"
    }
}
*/