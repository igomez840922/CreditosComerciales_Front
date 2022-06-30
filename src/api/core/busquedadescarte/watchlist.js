const json = {
    "EnqueueCustomerAnalysisV2Result": {
        "_x003C_Code_x003E_k__BackingField": 0,
        "_x003C_IsSuccessful_x003E_k__BackingField": true,
        "_x003C_TechnicalMessage_x003E_k__BackingField": null,
        "_x003C_UserMessage_x003E_k__BackingField": null,
        "_x003C_BurCustomerInfo_x003E_k__BackingField": null,
        "_x003C_BurEmployerLatePayer_x003E_k__BackingField": null,
        "_x003C_BurErrorLog_x003E_k__BackingField": null,
        "_x003C_BurLienPenalties_x003E_k__BackingField": null,
        "_x003C_BurLien_x003E_k__BackingField": null,
        "_x003C_BurMortgagePenalties_x003E_k__BackingField": null,
        "_x003C_BurMortgage_x003E_k__BackingField": null,
        "_x003C_BurPhone_x003E_k__BackingField": null,
        "_x003C_BurPropertyAssessment_x003E_k__BackingField": null,
        "_x003C_BurPropertyPenalties_x003E_k__BackingField": null,
        "_x003C_BurPropertySeizure_x003E_k__BackingField": null,
        "_x003C_BurProperty_x003E_k__BackingField": null,
        "_x003C_BurReference_x003E_k__BackingField": null,
        "_x003C_BurTrial_x003E_k__BackingField": null,
        "_x003C_BurVehiclesAssessment_x003E_k__BackingField": null,
        "_x003C_BurVehiclesPenalty_x003E_k__BackingField": null,
        "_x003C_BurVehicles_x003E_k__BackingField": null,
        "_x003C_BurXmlDatasource_x003E_k__BackingField": {
            "BUR_XML_DATASOURCE_GET_BY_CUSTOMERResult": [
                {
                    "BATCHID": "20211102",
                    "BATCHTYPE": "ONEONONE",
                    "BEGIN_SERVICE_REQUEST": "2021-11-02T11:10:42.382-05:00",
                    "CREATEDDATE": "2021-11-02T11:10:42.382-05:00",
                    "CUSTOMERID": "06--00711-002304",
                    "EXCEPTION": null,
                    "IDSERVICE": "BANESCO_REJECT_LIST",
                    "ISCLONED": false,
                    "ISSUCCESSFUL": true,
                    "QUERYDATE": "2021-11-02T11:10:42.383-05:00",
                    "TIMESTAMP": "2021-11-02T11:10:42.383-05:00",
                    "USERMESSAGE": null,
                    "XMLREQUEST": {
                        "Envelope": {
                            "Header": {
                                "Action": "\nhttp://tempuri.org/IRejectListService/GetRejectionList\n",
                                "To": "\nhttps://10.101.30.6/BANESCO.TimeToYes.ServicesFacade/RejectListService.svc\n"
                            },
                            "Body": {
                                "GetRejectionList": {
                                    "pResquest": {
                                        "ApellidoCasada": "Librada",
                                        "Cedula": "06--00711-002304",
                                        "ClasificacionEmpresas": "S.A.|SA|LTD|CORP.",
                                        "Edad": null,
                                        "FechaNacimiento": null,
                                        "LugarNacimiento": null,
                                        "Nacionalidad": null,
                                        "Nombre": "Librada",
                                        "PaisResidencia": null,
                                        "Pasaporte": "Librada",
                                        "Pesos": "NOMBRE:90|FECHA_NACIMIENTO:0|EDAD:0|NACIONALIDAD:0|LUGAR_NACIMIENTO:0|PASAPORTE:0|CEDULA:10|PAIS_RESIDENCIA:0|FALLECIDO:0|PUESTO:0|RIGUROSIDAD_FONETICA:75",
                                        "PrimerApellido": "Rivera",
                                        "Puesto": null,
                                        "SegundoApellido": "Gaviria",
                                        "SegundoNombre": "Emilio",
                                        "TipoId": "CEDULA_IDENTIDAD",
                                        "Fallecido": null
                                    }
                                }
                            }
                        }
                    },
                    "XMLRESPONSE": {
                        "Envelope": {
                            "Header": {
                                "Action": {
                                    "@mustUnderstand": "1",
                                    "$": "\nhttp://tempuri.org/IRejectListService/GetRejectionListResponse\n"
                                }
                            },
                            "Body": {
                                "GetRejectionListResponse": {
                                    "GetRejectionListResult": {
                                        "Code": "0",
                                        "IsSuccessful": "true",
                                        "MessageCode": null,
                                        "TechnicalMessage": null,
                                        "UserMessage": null,
                                        "Response": {
                                            "RESPONSE": {
                                                "REJECT_LIST_REPONSE": {
                                                    "LISTAS_VIGILANCIA": {
                                                        "COINCIDENCIAS": {
                                                            "RESUMEN": {
                                                                "row": {
                                                                    "@Criterio": "LIBRADA EMILIO RIVERA GAVIRIA | RIVERA GAVIRIA LIBRADA EMILIO",
                                                                    "@TipoBusqueda": "FONETICA",
                                                                    "@Evaluacion": "62"
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        },
        "_x003C_Bur_Excelservice_Result_x003E_k__BackingField": {
            "BUR_EXCELSERVICE_RESULT": [
                {
                    "ERRORMESSAGE": null,
                    "EXCELFILETYPE": "REGLAS",
                    "EXCELNAME": "PRIV_LISTA_VIGILANCIA_REGLAS",
                    "FINALTIME": "2021-11-02T11:10:42.383-05:00",
                    "IDEXCELSERVICE": "4c9c0636-2a9f-4a10-a66d-a19657eaf059",
                    "IDOPERATION": 19252,
                    "INITIALTIME": "2021-11-02T11:10:42.383-05:00",
                    "ISSUCCESSFUL": true,
                    "XMLDATASOURCE": {
                        "CustomerResponse": {
                            "IsSuccessful": "true",
                            "Code": "0",
                            "UserMessage": null,
                            "TechnicalMessage": null,
                            "Customer": {
                                "BATCHID": "2021-08-03T01:09:02.893",
                                "BATCHTYPE": "ONEONONE",
                                "CUSTOMERID": "06--00711-002304",
                                "CREATEDDATE": "2021-08-03T01:09:02.893",
                                "TYPEID": "CEDULA_IDENTIDAD",
                                "MODELID": "LISTA_VIGILANCIA",
                                "ROWINDEX": {
                                    "@nil": "true"
                                },
                                "NAME": "Librada Emilio Rivera Gaviria Librada",
                                "SUPER_QUERYDATE": {
                                    "@nil": "true"
                                },
                                "SUPER_FINALSCORE": {
                                    "@nil": "true"
                                },
                                "SUPER_HISTORICSCORE": {
                                    "@nil": "true"
                                },
                                "SUPERISCLONED": "false",
                                "ISDEAD": {
                                    "@nil": "true"
                                },
                                "AGE": {
                                    "@nil": "true"
                                },
                                "WORKINGMONTHS": {
                                    "@nil": "true"
                                },
                                "INCOME": {
                                    "@nil": "true"
                                },
                                "INCOME_PAYROLL": {
                                    "@nil": "true"
                                },
                                "INCOME_NEW": {
                                    "@nil": "true"
                                },
                                "INCOME_AVG": {
                                    "@nil": "true"
                                },
                                "STATUS_GENERAL": "PROCESSING",
                                "NOTE": "|",
                                "USERID": "soap.ui.banesco",
                                "UPDATEDDATE": "2021-08-03T01:09:11.16",
                                "WORKINGMONTHS_PAYROLL": {
                                    "@nil": "true"
                                },
                                "DEBT_PERCENT_FOREIGN_CURRENCY": {
                                    "@nil": "true"
                                },
                                "DEBT_PERCENT_RATE_VARIABLE": {
                                    "@nil": "true"
                                },
                                "PROCESSING": "true",
                                "IDOPERATION": "19252",
                                "PARENT_IDOPERATION": {
                                    "@nil": "true"
                                },
                                "MEMBERTYPE": "DEUDOR",
                                "PRIORITY": "1",
                                "USERNOTE": "|",
                                "SUPER_FINALSCORE_SBD": {
                                    "@nil": "true"
                                },
                                "SUPER_HISTORICSCORE_SBD": {
                                    "@nil": "true"
                                }
                            },
                            "CustomerDetail": {
                                "BATCHID": "20210803",
                                "BATCHTYPE": "ONEONONE",
                                "CUSTOMERID": "cc1116263511",
                                "CREATEDDATE": "2021-08-03T01:09:02.893",
                                "MODELID": "LISTA_VIGILANCIA",
                                "XMLRESULT": {
                                    "MODELO": {
                                        "PARAMETROS_ENDEUDAMIENTO": {
                                            "DEUDOR": {
                                                "CUSTOMERINFO_APC": {
                                                    "CUSTOMERINFO_APC": {
                                                        "KINDID": "PRINCIPAL",
                                                        "TIPO_IDENTIFICACION": "CEDULA_IDENTIDAD",
                                                        "NUMERO_IDENTIFICACION": "06--00711-002304",
                                                        "MEMBERTYPE": "DEUDOR",
                                                        "NOMBRE": null,
                                                        "APELLIDO": null,
                                                        "SCORE_APC": "0",
                                                        "SCORE_APC_EXCLUSION": null,
                                                        "RESULTADO_APC": null,
                                                        "ESTATUS_APC": null
                                                    }
                                                },
                                                "DEUDAS_APC": null,
                                                "RPAResult": "NO SE ENCONTRARON DATOS",
                                                "PARAMETROS": {
                                                    "FECHA_CONSULTA": "08-03-2021",
                                                    "FECHA_CONSULTA_UTC": "1627948800000"
                                                },
                                                "LISTAS_VIGILANCIA": {
                                                    "COINCIDENCIAS": {
                                                        "RESUMEN": {
                                                            "row": {
                                                                "@Criterio": "LIBRADA EMILIO RIVERA GAVIRIA | RIVERA GAVIRIA LIBRADA EMILIO",
                                                                "@TipoBusqueda": "FONETICA",
                                                                "@Evaluacion": "62"
                                                            }
                                                        }
                                                    }
                                                },
                                                "GOOGLE_SEARCH_CUSTOMER": "NO SE ENCONTRARON DATOS"
                                            }
                                        }
                                    }
                                },
                                "XMLPARAMETER": {
                                    "XMLPARAMETERS": {
                                        "row": {
                                            "@Key": "NOMBRE",
                                            "@Value": "Librada"
                                        },
                                        "row": {
                                            "@Key": "SEGUNDO_NOMBRE",
                                            "@Value": "Emilio"
                                        },
                                        "row": {
                                            "@Key": "PRIMER_APELLIDO",
                                            "@Value": "Rivera"
                                        },
                                        "row": {
                                            "@Key": "SEGUNDO_APELLIDO",
                                            "@Value": "Gaviria"
                                        },
                                        "row": {
                                            "@Key": "APELLIDO_CASADA",
                                            "@Value": "Librada"
                                        },
                                        "row": {
                                            "@Key": "TIPO_ID",
                                            "@Value": "CEDULA_IDENTIDAD"
                                        },
                                        "row": {
                                            "@Key": "CEDULA",
                                            "@Value": "06--00711-002304"
                                        }
                                    }
                                },
                                "ISACTIVE": "true",
                                "SEND_STATUS": "LISTO"
                            },
                            "CustomerDebts": null,
                            "SuperOperation": null,
                            "SuperOperationHist": null,
                            "BurCustomerInfo": null,
                            "BurProperty": null,
                            "BurPropertyAssessment": null,
                            "BurPropertyPenalties": null,
                            "BurVehicles": null,
                            "BurVehiclesAssessment": null,
                            "BurVehiclesPenalty": null,
                            "BurTrial": null,
                            "BurReference": null,
                            "BurPhone": null,
                            "BurLien": null,
                            "BurLienPenalties": null,
                            "BurMortgage": null,
                            "BurMortgagePenalties": null,
                            "BurPropertySeizure": null,
                            "BurEmployerLatePayer": null,
                            "BurErrorLog": null,
                            "BurXmlDatasource": {
                                "BUR_XML_DATASOURCE_GET_BY_CUSTOMERResult": {
                                    "CUSTOMERID": "06--00711-002304",
                                    "BATCHID": "20210803",
                                    "BATCHTYPE": "ONEONONE",
                                    "CREATEDDATE": "2021-08-03T01:09:02.893",
                                    "QUERYDATE": "2021-08-03T01:09:34.41",
                                    "IDSERVICE": "BANESCO_REJECT_LIST",
                                    "XMLREQUEST": {
                                        "Envelope": {
                                            "Header": {
                                                "Action": "\nhttp://tempuri.org/IRejectListService/GetRejectionList\n                        ",
                                                "To": "\nhttps://10.101.30.6/BANESCO.TimeToYes.ServicesFacade/RejectListService.svc\n                        "
                                            },
                                            "Body": {
                                                "GetRejectionList": {
                                                    "pResquest": {
                                                        "ApellidoCasada": null,
                                                        "Cedula": "06--00711-002304",
                                                        "ClasificacionEmpresas": "S.A.|SA|LTD|CORP.",
                                                        "Edad": null,
                                                        "FechaNacimiento": null,
                                                        "LugarNacimiento": null,
                                                        "Nacionalidad": null,
                                                        "Nombre": "Librada",
                                                        "PaisResidencia": null,
                                                        "Pasaporte": null,
                                                        "Pesos": "NOMBRE:90|FECHA_NACIMIENTO:0|EDAD:0|NACIONALIDAD:0|LUGAR_NACIMIENTO:0|PASAPORTE:0|CEDULA:10|PAIS_RESIDENCIA:0|FALLECIDO:0|PUESTO:0|RIGUROSIDAD_FONETICA:75",
                                                        "PrimerApellido": "Rivera",
                                                        "Puesto": null,
                                                        "SegundoApellido": "Gaviria",
                                                        "SegundoNombre": "Emilio",
                                                        "TipoId": "CEDULA_IDENTIDAD",
                                                        "Fallecido": null
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    "XMLRESPONSE": {
                                        "Envelope": {
                                            "Header": {
                                                "Action": {
                                                    "@mustUnderstand": "1",
                                                    "$": "\nhttp://tempuri.org/IRejectListService/GetRejectionListResponse\n"
                                                }
                                            },
                                            "Body": {
                                                "GetRejectionListResponse": {
                                                    "GetRejectionListResult": {
                                                        "Code": "0",
                                                        "IsSuccessful": "true",
                                                        "MessageCode": null,
                                                        "TechnicalMessage": null,
                                                        "UserMessage": null,
                                                        "Response": {
                                                            "RESPONSE": {
                                                                "REJECT_LIST_REPONSE": {
                                                                    "LISTAS_VIGILANCIA": {
                                                                        "COINCIDENCIAS": {
                                                                            "RESUMEN": {
                                                                                "row": {
                                                                                    "@Criterio": "LIBRADA EMILIO RIVERA GAVIRIA | RIVERA GAVIRIA LIBRADA EMILIO",
                                                                                    "@TipoBusqueda": "FONETICA",
                                                                                    "@Evaluacion": "62"
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    "TIMESTAMP": "2021-08-03T01:09:34.41",
                                    "ISCLONED": "false",
                                    "ISSUCCESSFUL": "true",
                                    "BEGIN_SERVICE_REQUEST": "2021-08-03T01:09:11.813"
                                }
                            },
                            "SettingsModel": {
                                "MODELID": "LISTA_VIGILANCIA",
                                "MODELNAME": "Análisis Lista de Vigilancia",
                                "STATUS": "true",
                                "DESCRIPTION": "Modelo de calculo para Análisis BANESCO",
                                "XSLGRID": "BANESCO_GRIDVIEW",
                                "XSLWIN": "BANESCO_WINVIEW",
                                "XSLWEB": "BANESCO_WEBVIEW",
                                "XSLEXP": "BANESCO_PYME_EXPEDIENT",
                                "UCPARAMETER": "BANESCO/containerPymes",
                                "UCFORM": null,
                                "CREATEDUSER": "michael.villarreal",
                                "CREATEDDATE": "2020-07-28T11:22:23.067",
                                "UPDATEDUSER": null,
                                "UPDATEDDATE": {
                                    "@nil": "true"
                                },
                                "INCLUDEBUREAU": "false",
                                "INCLUDEBATCH": "true",
                                "INCLUDEONEONONE": "true",
                                "ISPUBLIC": "true",
                                "COLUMNSTOSHOW": "\nPRODUCT,PRODUCTTYPE,STATUS,TERM,RATE,DESCRIPTION,MIN_CREDITLINE,MAX_CREDITLINE,MIN_SALARY,MAX_SALARY,MIN_FACTOR,MAX_FACTOR,MIN_AGE,MAX_AGE,MIN_SENIORITY,MIN_SENIORITY_INDEPENDENT,MIN_INVESTMENT_AMOUNT,MAX_INVESTMENT_AMOUNT,LOWESTRATE,YEAR,CURRENCY,COMMISSION,MIN_COMMISSION,MAX_PERCENT_FINANCING,PERCENT_TRANSFER,LIENPERCENTAGE,CREATEDDATE,UPDATEDDATE,RATETYPE,RATETYPE_REFERENCE\n        ",
                                "MAILSUBJECT": "Documentos Formalizar",
                                "MAILBODY": "\nSi requiere mas informacion favor comuniquese a:\n        ",
                                "REPORTSTOREDPROCEDURE": null,
                                "EXTRAPARAMPROCEDURE": null,
                                "FROMPORT": "0",
                                "SSLSERVERFROMENABLE": {
                                    "@nil": "true"
                                },
                                "PASSWORDMAILFROM": "soporte.tty",
                                "RETY_ANALYSIS": "true",
                                "UDCSUPEREXPIRATION": null,
                                "DEBTSEDITIONMODE": "2_ESTADOS_EDICION"
                            },
                            "ReportParams": null,
                            "Bur_Excelservice_Result": null,
                            "TimesConsulted": "8"
                        }
                    },
                    "XMLREQUEST": {
                        "ArrayOfExcelParameter": {
                            "ExcelParameter": {
                                "Sheet": "LISTAS_VIGILANCIA",
                                "FieldName": "CQ_REQ_LISTAS_VIGILANCIA",
                                "XPathCustomer": "\n/CustomerResponse/CustomerDetail/XMLRESULT/MODELO/PARAMETROS_ENDEUDAMIENTO/DEUDOR/LISTAS_VIGILANCIA/COINCIDENCIAS/RESUMEN\n",
                                "DataType": "DataTable",
                                "Value": null
                            },
                            "ExcelParameter": {
                                "Sheet": "PARAMETROS",
                                "FieldName": "CQ_REQ_NOMBRE",
                                "XPathCustomer": "\n/CustomerResponse/CustomerDetail/XMLPARAMETER/XMLPARAMETERS/row[@Key='NOMBRE']\n",
                                "DataType": "Value",
                                "Value": null
                            },
                            "ExcelParameter": {
                                "Sheet": "PARAMETROS",
                                "FieldName": "CQ_REQ_SEGUNDO_NOMBRE",
                                "XPathCustomer": "\n/CustomerResponse/CustomerDetail/XMLPARAMETER/XMLPARAMETERS/row[@Key='SEGUNDO_NOMBRE']\n",
                                "DataType": "Value",
                                "Value": null
                            },
                            "ExcelParameter": {
                                "Sheet": "PARAMETROS",
                                "FieldName": "CQ_REQ_PRIMER_APELLIDO",
                                "XPathCustomer": "\n/CustomerResponse/CustomerDetail/XMLPARAMETER/XMLPARAMETERS/row[@Key='PRIMER_APELLIDO']\n",
                                "DataType": "Value",
                                "Value": null
                            },
                            "ExcelParameter": {
                                "Sheet": "PARAMETROS",
                                "FieldName": "CQ_REQ_SEGUNDO_APELLIDO",
                                "XPathCustomer": "\n/CustomerResponse/CustomerDetail/XMLPARAMETER/XMLPARAMETERS/row[@Key='SEGUNDO_APELLIDO']\n",
                                "DataType": "Value",
                                "Value": null
                            },
                            "ExcelParameter": {
                                "Sheet": "PARAMETROS",
                                "FieldName": "CQ_REQ_APELLIDO_CASADA",
                                "XPathCustomer": "\n/CustomerResponse/CustomerDetail/XMLPARAMETER/XMLPARAMETERS/row[@Key='APELLIDO_CASADA']\n",
                                "DataType": "Value",
                                "Value": null
                            },
                            "ExcelParameter": {
                                "Sheet": "PARAMETROS",
                                "FieldName": "CQ_REQ_FECHA_NACIMIENTO",
                                "XPathCustomer": "\n/CustomerResponse/CustomerDetail/XMLPARAMETER/XMLPARAMETERS/row[@Key='FECHA_NACIMIENTO']\n",
                                "DataType": "Value"
                            },
                            "ExcelParameter": {
                                "Sheet": "PARAMETROS",
                                "FieldName": "CQ_REQ_EDAD",
                                "XPathCustomer": "\n/CustomerResponse/CustomerDetail/XMLPARAMETER/XMLPARAMETERS/row[@Key='EDAD']\n",
                                "DataType": "Value"
                            },
                            "ExcelParameter": {
                                "Sheet": "PARAMETROS",
                                "FieldName": "CQ_REQ_NACIONALIDAD",
                                "XPathCustomer": "\n/CustomerResponse/CustomerDetail/XMLPARAMETER/XMLPARAMETERS/row[@Key='NACIONALIDAD']\n",
                                "DataType": "Value"
                            },
                            "ExcelParameter": {
                                "Sheet": "PARAMETROS",
                                "FieldName": "CQ_REQ_LUGAR_NACIMIENTO",
                                "XPathCustomer": "\n/CustomerResponse/CustomerDetail/XMLPARAMETER/XMLPARAMETERS/row[@Key='LUGAR_NACIMIENTO']\n",
                                "DataType": "Value"
                            },
                            "ExcelParameter": {
                                "Sheet": "PARAMETROS",
                                "FieldName": "CQ_REQ_PASAPORTE",
                                "XPathCustomer": "\n/CustomerResponse/CustomerDetail/XMLPARAMETER/XMLPARAMETERS/row[@Key='PASAPORTE']\n",
                                "DataType": "Value"
                            },
                            "ExcelParameter": {
                                "Sheet": "PARAMETROS",
                                "FieldName": "CQ_REQ_CEDULA",
                                "XPathCustomer": "\n/CustomerResponse/CustomerDetail/XMLPARAMETER/XMLPARAMETERS/row[@Key='CEDULA']\n",
                                "DataType": "Value",
                                "Value": "cc1116263511"
                            },
                            "ExcelParameter": {
                                "Sheet": "PARAMETROS",
                                "FieldName": "CQ_REQ_PAIS_RESIDENCIA",
                                "XPathCustomer": "\n/CustomerResponse/CustomerDetail/XMLPARAMETER/XMLPARAMETERS/row[@Key='PAIS_RESIDENCIA']\n",
                                "DataType": "Value"
                            },
                            "ExcelParameter": {
                                "Sheet": "PARAMETROS",
                                "FieldName": "CQ_REQ_FALLECIDO",
                                "XPathCustomer": "\n/CustomerResponse/CustomerDetail/XMLPARAMETER/XMLPARAMETERS/row[@Key='FALLECIDO']\n",
                                "DataType": "Value"
                            },
                            "ExcelParameter": {
                                "Sheet": "PARAMETROS",
                                "FieldName": "CQ_REQ_PUESTO",
                                "XPathCustomer": "\n/CustomerResponse/CustomerDetail/XMLPARAMETER/XMLPARAMETERS/row[@Key='PUESTO']\n",
                                "DataType": "Value"
                            },
                            "ExcelParameter": {
                                "Sheet": "PARAMETROS",
                                "FieldName": "CQ_REQ_TIPO_ID",
                                "XPathCustomer": "\n/CustomerResponse/CustomerDetail/XMLPARAMETER/XMLPARAMETERS/row[@Key='TIPO_ID']\n",
                                "DataType": "Value",
                                "Value": "CEDULA_IDENTIDAD"
                            },
                            "ExcelParameter": {
                                "Sheet": "PARAMETROS",
                                "FieldName": "CQ_REQ_FECHA_CONSULTA",
                                "XPathCustomer": "\n/CustomerResponse/CustomerDetail/XMLRESULT/MODELO/PARAMETROS_ENDEUDAMIENTO/DEUDOR/PARAMETROS/FECHA_CONSULTA\n",
                                "DataType": "Property",
                                "Value": "08-03-2021"
                            },
                            "ExcelParameter": {
                                "Sheet": "PARAMETROS",
                                "FieldName": "CQ_REQ_FECHA_CONSULTA_UTC",
                                "XPathCustomer": "\n/CustomerResponse/CustomerDetail/XMLRESULT/MODELO/PARAMETROS_ENDEUDAMIENTO/DEUDOR/PARAMETROS/FECHA_CONSULTA_UTC\n",
                                "DataType": "Property",
                                "Value": "1627948800000"
                            }
                        }
                    },
                    "XMLRESPONSE": {
                        "ArrayOfExcelParameter": {
                            "ExcelParameter": {
                                "Sheet": "PARAMETROS",
                                "FieldName": "CQ_RES_RESULTADOS",
                                "UniqueNameResp": "CQ_RES_RESULTADOS",
                                "DataType": "DataTable"
                            }
                        }
                    },
                    "XMLRESULT": {
                        "ExcelService": {
                            "CQ_RES_RESULTADOS": {
                                "CQ_RES_RESULTADOS": {
                                    "KEY": "NOTE",
                                    "VALUE": "APROBADO |"
                                },
                                "CQ_RES_RESULTADOS": {
                                    "KEY": "USER_NOTE",
                                    "VALUE": "APROBADO |"
                                }
                            }
                        }
                    }
                }
            ]
        },
        "_x003C_CustomerDebts_x003E_k__BackingField": {
            "@nill": "true"
        },
        "_x003C_CustomerDetail_x003E_k__BackingField": {
            "BATCHID": "20211102",
            "BATCHTYPE": "ONEONONE",
            "CREATEDDATE": "2021-11-02T11:10:42.384-05:00",
            "CUSTOMERID": "06--00711-002304",
            "DESCRIPTION": null,
            "ISACTIVE": true,
            "MODELID": "LISTA_VIGILANCIA",
            "SEND_STATUS": "LISTO",
            "XMLFORM": null
        },
        "_x003C_Customer_x003E_k__BackingField": {
            "AGE": {
                "@nill": "true"
            },
            "BATCHID": "20211102",
            "BATCHTYPE": "ONEONONE",
            "COMMENTS": null,
            "CREATEDDATE": "2021-11-02T11:10:42.384-05:00",
            "CUSTOMERID": "06--00711-002304",
            "DEBT_PERCENT_FOREIGN_CURRENCY": {
                "@nill": "true"
            },
            "DEBT_PERCENT_RATE_VARIABLE": {
                "@nill": "true"
            },
            "DROID": null,
            "IDOPERATION": 19249,
            "INCOME": {
                "@nill": "true"
            },
            "INCOME_AVG": {
                "@nill": "true"
            },
            "INCOME_NEW": {
                "@nill": "true"
            },
            "INCOME_PAYROLL": {
                "@nill": "true"
            },
            "MEMBERTYPE": "DEUDOR",
            "MODELID": "LISTA_VIGILANCIA",
            "NAME": "Librada",
            "NOTE": "APROBADO",
            "PARENT_IDOPERATION": {
                "@nill": "true"
            },
            "PRIORITY": 1,
            "PROCESSING": false,
            "ROWINDEX": {
                "@nill": "true"
            },
            "STATUS_BUR": null,
            "STATUS_DEBT": null,
            "STATUS_GENERAL": "APROBADO",
            "STATUS_SUPER": null,
            "SUPERISCLONED": false,
            "SUPER_FINALSCORE": {
                "@nill": "true"
            },
            "SUPER_FINALSCORE_SBD": {
                "@nill": "true"
            },
            "SUPER_HISTORICSCORE": {
                "@nill": "true"
            },
            "SUPER_HISTORICSCORE_SBD": {
                "@nill": "true"
            },
            "SUPER_QUERYDATE": {
                "@nill": "true"
            },
            "SUPER_REPORTTYPE": null,
            "TYPEID": "CEDULA_IDENTIDAD",
            "UPDATEDDATE": "2021-11-02T11:10:42.385-05:00",
            "USERID": "soap.ui.banesco",
            "USERNOTE": "APROBADO",
            "WORKINGMONTHS": {
                "@nill": "true"
            },
            "WORKINGMONTHS_PAYROLL": {
                "@nill": "true"
            }
        },
        "_x003C_ReportParams_x003E_k__BackingField": null,
        "_x003C_SSOT_x003E_k__BackingField": null,
        "_x003C_SettingsModel_x003E_k__BackingField": {
            "_x003C_COLUMNSTOSHOW_x003E_k__BackingField": "PRODUCT,PRODUCTTYPE,STATUS,TERM,RATE,DESCRIPTION,MIN_CREDITLINE,MAX_CREDITLINE,MIN_SALARY,MAX_SALARY,MIN_FACTOR,MAX_FACTOR,MIN_AGE,MAX_AGE,MIN_SENIORITY,MIN_SENIORITY_INDEPENDENT,MIN_INVESTMENT_AMOUNT,MAX_INVESTMENT_AMOUNT,LOWESTRATE,YEAR,CURRENCY,COMMISSION,MIN_COMMISSION,MAX_PERCENT_FINANCING,PERCENT_TRANSFER,LIENPERCENTAGE,CREATEDDATE,UPDATEDDATE,RATETYPE,RATETYPE_REFERENCE",
            "_x003C_CREATEDDATE_x003E_k__BackingField": "2021-11-02T11:10:42.385-05:00",
            "_x003C_CREATEDUSER_x003E_k__BackingField": "banesco",
            "_x003C_DEBTSEDITIONMODE_x003E_k__BackingField": "2_ESTADOS_EDICION",
            "_x003C_DESCRIPTION_x003E_k__BackingField": "Modelo de calculo para Análisis BANESCO",
            "_x003C_EMAILFROM_x003E_k__BackingField": null,
            "_x003C_EXTRAPARAMPROCEDURE_x003E_k__BackingField": null,
            "_x003C_FROMPORT_x003E_k__BackingField": 0,
            "_x003C_INCLUDEBATCH_x003E_k__BackingField": true,
            "_x003C_INCLUDEBUREAU_x003E_k__BackingField": false,
            "_x003C_INCLUDEONEONONE_x003E_k__BackingField": true,
            "_x003C_ISPUBLIC_x003E_k__BackingField": true,
            "_x003C_MAILBODY_x003E_k__BackingField": null,
            "_x003C_MAILSUBJECT_x003E_k__BackingField": "Documentos Formalizar",
            "_x003C_MODELID_x003E_k__BackingField": "LISTA_VIGILANCIA",
            "_x003C_MODELNAME_x003E_k__BackingField": "Análisis Lista de Vigilancia",
            "_x003C_PASSWORDMAILFROM_x003E_k__BackingField": "soporte.tty",
            "_x003C_REPORTSTOREDPROCEDURE_x003E_k__BackingField": null,
            "_x003C_RETY_ANALYSIS_x003E_k__BackingField": true,
            "_x003C_SMTPSERVERFROM_x003E_k__BackingField": null,
            "_x003C_SSLSERVERFROMENABLE_x003E_k__BackingField": {
                "@nill": "true"
            },
            "_x003C_STATUS_x003E_k__BackingField": true,
            "_x003C_UCFORM_x003E_k__BackingField": null,
            "_x003C_UCPARAMETER_x003E_k__BackingField": "BANESCO/containerPymes",
            "_x003C_UDCSUPEREXPIRATION_x003E_k__BackingField": null,
            "_x003C_UPDATEDDATE_x003E_k__BackingField": {
                "@nill": "true"
            },
            "_x003C_UPDATEDUSER_x003E_k__BackingField": null,
            "_x003C_XSLEXP_x003E_k__BackingField": "BANESCO_PYME_EXPEDIENT",
            "_x003C_XSLGRID_x003E_k__BackingField": "BANESCO_GRIDVIEW",
            "_x003C_XSLWEB_x003E_k__BackingField": "BANESCO_WEBVIEW",
            "_x003C_XSLWIN_x003E_k__BackingField": "BANESCO_WINVIEW"
        },
        "_x003C_SuperOperationHist_x003E_k__BackingField": null,
        "_x003C_SuperOperation_x003E_k__BackingField": null,
        "_x003C_TimesConsulted_x003E_k__BackingField": 5
    }
}
  
  export default json;
  