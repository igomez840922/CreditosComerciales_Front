export default class DetailModel {

    static fromJson(json) {
        //console.log(json)

        const item = new DetailModel();
        item.id = json.id;
        // parse date
        //item.date = new Date(json.date);
        item.date = json.date;
        item.generalData = {
            clientNumber: json.generalData.clientNumber, //numero de cliente
            debtorName: json.generalData.debtorName, //Nombre deudor
            surname: json.generalData.surname, //Primer Apellido
            secondSurname: json.generalData.secondSurname, //Segundo Apellido
            idType: json.generalData.idType, //tipo de identificacion
            idNumber: json.generalData.idNumber,//numero de identificacion
            economicGroup: json.generalData.economicGroup, //Grupo Economico
            economicActivity: json.generalData.economicActivity,//Actividad Economica
            banking: json.generalData.banking, //banca
        };
        item.companyGenerals = {
            country: json.companyGenerals.country, //Pais
            province: json.companyGenerals.province, //Provincia
            district: json.companyGenerals.district,//Distrito
            city: json.companyGenerals.city, //ciudad
            referencePoint: json.companyGenerals.referencePoint, //pto de referencia
            buildingResidence: json.companyGenerals.buildingResidence, // edificio o residencia
            apto: json.companyGenerals.apto, //apartamento
            mainPhone: json.companyGenerals.mainPhone, // telefono principal
            mobilePhone: json.companyGenerals.mobilePhone, // celular
            officePhone: json.companyGenerals.officePhone, //telefono oficina
            email: json.companyGenerals.email, //correo
            sector: json.companyGenerals.sector, //sector 
            subsector: json.companyGenerals.subsector, //subsector
            applyExclusionList: json.companyGenerals.applyExclusionList, //aplica a lista de exclusion (si/no)
            sustainableCustomer: json.companyGenerals.sustainableCustomer, // Cliente sostenible (si/no)
        };
        item.companyHistory = {
            details: json.companyHistory.details, //detalles
            attachments:json.companyHistory.attachments, //adjuntos o anexos
            employeeNumbers: json.companyHistory.employeeNumbers, // numero de empleados
            descriptions: json.companyHistory.descriptions, //descripción
        };
        item.shareholderInfo = { //Informacion de Accionistas
            shareholders: json.shareholderInfo.shareholders,//lista de Accionistas
            descriptions: json.shareholderInfo.descriptions,
        };
        item.organizationalStructure = { //Estructura Organizacional
            details: json.organizationalStructure.details, //detalles
            attachments:json.organizationalStructure.attachments, //adjuntos o anexos            
        };
        item.corporateGovernance = { //Goberno Corporativo
            governances: json.corporateGovernance.governances//lista de Gobiernos Corporativos
        };
        item.generationalRelief = { //Relevo Generacional
            reliefs: json.generationalRelief.reliefs,//lista de Relevos Generacionales
            descriptions: json.generationalRelief.descriptions,
        };
        item.operationalFlow = { //Flujo Operativo
            details: json.operationalFlow.details, //detalles
            attachments:json.operationalFlow.attachments, //adjuntos o anexos            
        };
        item.relatedCompanies = { //Empresas Relacionadas
            companies: json.relatedCompanies.companies, //lista de empresas
            descriptions: json.relatedCompanies.descriptions,
        };
        item.clientsInfo = { //Informacion de Clientes
            clients: json.clientsInfo.clients, //lista de clientes
            descriptions: json.relatedCompanies.descriptions,
            seasonalSales: json.clientsInfo.seasonalSales, // bool
            salePercent: json.clientsInfo.salePercent, //porciento de ventas
        };
        item.providersInfo = { //Informacion de Proveedores
            providers: json.providersInfo.providers, //lista de ProvidersModel
            description: json.providersInfo.description,
            shoppingCycle: json.providersInfo.shoppingCycle //coclo de compras
        };
        item.mainMarketCompetitors= { //Principales Competidores del Mercado
            competitors: json.mainMarketCompetitors.competitors, //lista de Competidores
        };
        item.projections= { //Proyecciones
            details: json.projections.details, //detalles
            attachments:json.projections.attachments, //adjuntos o anexos  
            assetStructure:{ //Estructura de Activo
                operatingAssets: //Activos Operativos
                {
                    reason:json.projections.assetStructure.operatingAssets.reason, //Motivo
                    amount:json.projections.assetStructure.operatingAssets.amount,  // Monto
                },
                fixedAssets: //Activos Fijos
                {
                    reason:json.projections.assetStructure.fixedAssets.reason,
                    amount:json.projections.assetStructure.fixedAssets.amount,
                },
                othersAssets: //Otros Activos
                {
                    reason:json.projections.assetStructure.othersAssets.reason,
                    amount:json.projections.assetStructure.othersAssets.amount,
                }
            },
            financingSources:{ //Fuentes de Financiamiento
                banking: //Banca
                {
                    reason:json.projections.financingSources.banking.reason, //Motivo
                    amount:json.projections.financingSources.banking.amount,  // Monto
                },
                providers: //Activos Fijos
                {
                    reason:json.projections.financingSources.providers.reason,
                    amount:json.projections.financingSources.providers.amount,
                },
                capital: //Capital
                {
                    reason:json.projections.financingSources.capital.reason,
                    amount:json.projections.financingSources.capital.amount,
                }
            },
            bankDebtoTake: json.projections.bankDebtoTake, //Monto Máximo de Deuda Bancario a Tomar
            estimatedDate: json.projections.estimatedDate, //Fecha Estimada
        };
        item.currentBankingRelations={ //Relaciones Bancarias Actuales
            shortTermDebts: json.currentBankingRelations.shortTermDebts,//Deudas a Corto Plazo
            longTermDebts: json.currentBankingRelations.longTermDebts,//Deudas a Lasrgo Plazo
            actualSow: json.currentBankingRelations.actualSow,//Sow Actual
            proposedSow: json.currentBankingRelations.proposedSow,//Sow Propuesto
            details: json.currentBankingRelations.details, //detalles
        };
        item.accountMovements={ //Movimientos de Cuentas
            accountMovements:json.accountMovements.accountMovements,//Lista de Movimientos de Cuentas
            details: json.accountMovements.details, //detalles
        };
        item.reciprocity={ //Reciprocidad
            reciprocity:json.reciprocity.reciprocity,//Lista de Reciprocidad
            description: json.reciprocity.description, //descripcion
        };
        item.fixedAssetsFacilities={ //Facilidades de Activos Fijos
            fixedAssetsFacilities:json.fixedAssetsFacilities.fixedAssetsFacilities,//Lista de Facilidades de Activos Fijos
            significantVariations:json.fixedAssetsFacilities.significantVariations, //Existen Variaciones Significativas en los Activos Fijos de las Empresas (bool)
            manufacturingCompaniesAgroindustries:json.fixedAssetsFacilities.manufacturingCompaniesAgroindustries, //Tiene Empresas Manufactureras o Agroindustrias (bool)
            tradingCompanies:json.fixedAssetsFacilities.tradingCompanies, //Tiene Empresas Manufactureras o Agroindustrias (bool)
            hasTransportationFleet:json.fixedAssetsFacilities.hasTransportationFleet, //Posee flota de trasporte/distribución (bool)
            attachments:json.fixedAssetsFacilities.attachments, //adjuntos o anexos              
        };
        item.environmentalAspects={ //Aspectos Ambientales
            preClassificationRisk:json.environmentalAspects.preClassificationRisk,//Pre Clasificaciond de Riesgo
            sustainableCreditRating:json.environmentalAspects.sustainableCreditRating, //Clasificación de Crédito Sostenible
            classificationRisk:json.environmentalAspects.classificationRisk, //Clasificaciond de Riesgo
            question1:json.environmentalAspects.question1, //El proyecto esta ubicado o es colindante a un area natural protegida? (bool)
            question2:json.environmentalAspects.question2, //El proyecto involucra reasentamiento fisico y/o economico de mas de 100 personas?
            question3:json.environmentalAspects.question3, //Se necesita la presentación de permisos ambientales para la ejecución del proyecto?
            question4:json.environmentalAspects.question4, //El proyecto es nuevo e involucra el uso de más de 35 Héctareas de terreno?
            question5:json.environmentalAspects.question5, //La actividad emplea más de 50 trabajadores y manejan más de 15 contratistas?
            attachments:json.environmentalAspects.attachments, //adjuntos o anexos              
        };
        item.guarantorInformation={ //Información del Garante
            debtorIsGuarantor:json.guarantorInformation.debtorIsGuarantor,//El Deudor es (será) el Garante del bien a ceder en Garantía? (Si/No)
            name:json.guarantorInformation.name, //Nombre
            surename:json.guarantorInformation.surename, //Apellido
            secondSurename:json.guarantorInformation.secondSurename, //Segundo Apellido
            answer1:json.guarantorInformation.answer1, //Relación directa que mantiene el deudor y el garante
            answer2:json.guarantorInformation.answer2, //Cómo y con qué fondos fue adquirido el bien a ceder en garantía?
            answer3:json.guarantorInformation.answer3, //El deudor mantiene algún compromiso u obligación crediticia con el garante?
            answer4:json.guarantorInformation.answer4, //Por qué otorga su bien en garantía?
        };
        item.currentCompanyInsurance={ //Seguros Actuales de la Empresa
            companyInsurances:json.currentCompanyInsurance.companyInsurances,//Lista de Seguros Actuales de la Empresa
        };
        item.enterpriseArchitecture={ //Arquitectura Empresarial
            answer1:json.enterpriseArchitecture.answer1, //Uso de Sistemas de Información Tecnológica para la Operativa en General de la Empresa
            answer2:json.enterpriseArchitecture.answer2, //Si algunas de sus áreas han sido auditadas, indicar el Dictamen de los Auditores Independientes
            attachments:json.enterpriseArchitecture.attachments, //adjuntos o anexos              
        };
        item.accountsReceivable={ //Cuentas por Cobrar
            fixedAssetsFacilities:json.accountsReceivable.fixedAssetsFacilities,//Lista de Facilidades de Activos Fijos
            attachments:json.accountsReceivable.attachments, //adjuntos o anexos              
        };
        item.capex={ //capex
            capexDescriptions:json.capex.capexDescriptions,//Lista de Descricion de Capex
            capexBudget:json.capex.capexBudget,//Lista de Presupuesto de Capex
            capexProjectDetails:json.capex.capexProjectDetails,//Lista de Detalles del Proyecto de Capex
            attachments:json.capex.attachments, //adjuntos o anexos              
        };
        item.cashFlow={ //Flujo de Cajas
            inDollars:json.cashFlow.inDollars,//Lista In Dolares
            incomeInvoices:json.cashFlow.incomeInvoices,//Lista de Ingresos por Facturas
            collections:json.cashFlow.collections,//Lista de Cajas Cobranzas
            expenses:json.cashFlow.expenses,//Lista de Cajas Egresos
            workload:json.cashFlow.workload,//Lista de Carga de Trabajo
        };
        item.businessObtain={ //Negocios a Obtener
            businessToObtain:json.businessObtain.businessToObtain,//Lista de Negocios a Obtener
            description: json.businessObtain.description, //descripcion            
        };
        item.competitiveMatrix={
            banescoPosition:json.competitiveMatrix.banescoPosition, //Lista de Posición Banesco
            banescoTransactionalProducts:json.competitiveMatrix.banescoTransactionalProducts, //Lista de Productos Transaccionales
            profitabilityMatrix:json.competitiveMatrix.profitabilityMatrix, //Lista de Matriz de Rentabilidad
            liabilitiesAssets:json.competitiveMatrix.liabilitiesAssets, // Lista de Otros Bancos / Pasivos y Activos
            newBusinessesCommitments:json.competitiveMatrix.newBusinessesCommitments, // Lista de Nuevos Negocios y Compromisos
            filesAndOthers:json.competitiveMatrix.filesAndOthers, // Lista de Expedientes y Otros
            description: json.competitiveMatrix.description, //descripcion            
        };
        item.recommendationsAndOthers={
            recomendations:json.recommendationsAndOthers.recomendations, //recomendaciones
            valueChain:json.recommendationsAndOthers.valueChain, //Cadena Valor
            background:json.recommendationsAndOthers.background, //Antecedentes
            refinancingLog:json.recommendationsAndOthers.refinancingLog, //Bitácora de Refinanciamiento
        }
                
        return item;
    }
}