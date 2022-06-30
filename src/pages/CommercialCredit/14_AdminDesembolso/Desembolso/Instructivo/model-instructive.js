import moment from "moment";

export default class instructiveClass {

    loandTypeCode
    loandTypeDesc

    transactId
    facilityId
    facilityNumber
    facilityTypeCode
    facilityTypeDesc
    proposalTypeCode
    proposalTypeDesc
    masterLineNumber
    disbursementInstructionNumber
    disbursementDate
    clientNumber
    clientName

    branchCode
    branchDesc
    saleChannel
    disbursementFinalDestinyFreeZone
    disbursementApprovedAmount
    advancement
    advancementAmount
    productTypeCode
    productTypeDesc
    subProductTypeCode
    subProductTypeDesc
    disbursementComisionDesc
    disbursementComisionAmount
    disbursementItbms
    differ
    pawn
    dpfSavingsCheckingAccount
    AN
    pledgeAmount
    indexRate
    dpfRate
    spreadRate
    totalRate
    disbursementTerm
    disbursementTermType
    debitAccountClientNumber
    interestRate
    feci
    interestPaymentCycleCode
    interestPaymentCycleDesc
    capitalPaymentCycleCod
    capitalPaymentCycleDesc
    monthlyLetterIncludesIntsandFeci
    monthlyLetterAmount
    fidBanescoCommissionAmount
    itbmFidAmount
    disbursementFormAccountNumber
    disbursementFormAccountName
    disbursementFormAccountAmount
    disbursementFormCheckNumber
    disbursementFormCheckName
    disbursementFormCheckAmount
    disbursementFormTransferNumber
    disbursementFormTransferName
    disbursementFormTransferAmount
    disbursementFormOtherNumber
    disbursementFormOtherName
    disbursementFormOtherAmount
    cppNumber
    cppBeneficiary
    cppAmount
    countryCode
    countryDesc
    provinceCode
    provinceDesc
    economicActivityTypeCode
    economicActivityTypeDesc
    cinuActivityTypeCode
    cinuActivityTypeDesc
    disbursementDetailDescription
    bankEspecialInstructions
    adminNotaryFees
    adminSealFees
    adminAditionalComments
    operationalLeasNumber
    operationalDueDate
    operationalNextPaymentDate
    sourceSalesCod
    sourceSalesDesc
    creditDestination
    paymentMethod
    fundsDestination
    fundsPurposeCode
    checkNumber
    originationRef
    writingType
    billsCombined
    settlement
    autonomyCode
    autonomyUser
    subCategoryCode
    authType
    totalLetterIncludingfiduciaryCommission

    constructor(instructive = {}) {
        // super();

        this.loandTypeCode = instructive?.loandTypeCode ?? ' '
        this.loandTypeDesc = instructive?.loandTypeDesc ?? ' '
        this.masterLineNumber = instructive?.masterLineNumber ?? ' '
        this.disbursementInstructionNumber = instructive?.disbursementInstructionNumber ?? ' '
        this.disbursementDate = instructive?.disbursementDate ?? moment().format("YYYY-MM-DD")
        this.transactId = instructive?.transactId ?? 0
        this.facilityId = instructive?.facilityId ?? 0
        this.facilityNumber = (instructive?.facilityId ?? 0)
        this.facilityTypeCode = (instructive?.facilityTypeId ?? ' ')
        this.facilityTypeDesc = instructive?.facilityTypeDesc ?? ' '
        this.branchCode = instructive?.branchCode ?? ' '
        this.branchDesc = instructive?.branchDesc ?? ' '
        this.proposalTypeCode = (instructive?.proposalTypeId ?? ' ')
        this.proposalTypeDesc = instructive?.proposalTypeDesc ?? ' '
        this.saleChannel = instructive?.saleChannel ?? ' '
        this.disbursementFinalDestinyFreeZone = instructive?.disbursementFinalDestinyFreeZone ?? false
        this.disbursementApprovedAmount = (instructive.amount ?? 0)
        this.advancement = instructive?.advancement ?? false
        this.advancementAmount = instructive?.advancementAmount ?? 0
        this.productTypeCode = instructive?.productTypeCode ?? ' '
        this.productTypeDesc = instructive?.productTypeDesc ?? ' '
        this.subProductTypeCode = instructive?.subProductTypeCode ?? ' '
        this.subProductTypeDesc = instructive?.subProductTypeDesc ?? ' '
        this.disbursementComisionDesc = instructive?.disbursementComisionDesc ?? ' '
        this.disbursementComisionAmount = instructive?.disbursementComisionAmount ?? 0
        this.disbursementItbms = instructive?.disbursementItbms ?? 0
        this.differ = instructive?.differ ?? false
        this.pawn = instructive?.pawn ?? false
        this.dpfSavingsCheckingAccount = instructive?.dpfSavingsCheckingAccount ?? ' '
        this.an = instructive?.an ?? ' '
        this.pledgeAmount = instructive?.pledgeAmount ?? 0
        this.indexRate = instructive?.indexRate ?? false
        this.dpfRate = instructive?.dpfRate ?? 0
        this.spreadRate = instructive?.spreadRate ?? 0
        this.totalRate = instructive?.totalRate ?? 0
        this.disbursementTerm = (instructive?.termDays ?? 0)
        this.disbursementTermType = (instructive?.termType ?? ' ')
        this.debitAccountClientNumber = instructive?.debitAccountClientNumber ?? ' '
        this.interestRate = (instructive?.proposalRate ?? 0)
        this.feci = instructive?.feci ?? false
        this.interestPaymentCycleCode = instructive?.interestPaymentCycleCode ?? ' '
        this.interestPaymentCycleDesc = instructive?.interestPaymentCycleDesc ?? ' '
        this.capitalPaymentCycleCod = instructive?.capitalPaymentCycleCod ?? ' '
        this.capitalPaymentCycleDesc = instructive?.capitalPaymentCycleDesc ?? ' '
        this.monthlyLetterIncludesIntsandFeci = instructive?.monthlyLetterIncludesIntsandFeci ?? false
        this.monthlyLetterAmount = instructive?.monthlyLetterAmount ?? 0
        this.fidBanescoCommissionAmount = instructive?.fidBanescoCommissionAmount ?? 0
        this.itbmFidAmount = instructive?.itbmFidAmount ?? 0
        this.disbursementFormAccountNumber = instructive?.disbursementFormAccountNumber ?? ' '
        this.disbursementFormAccountName = instructive?.disbursementFormAccountName ?? ' '
        this.disbursementFormAccountAmount = instructive?.disbursementFormAccountAmount ?? 0
        this.disbursementFormCheckNumber = instructive?.disbursementFormCheckNumber ?? ' '
        this.disbursementFormCheckName = instructive?.disbursementFormCheckName ?? ' '
        this.disbursementFormCheckAmount = instructive?.disbursementFormCheckAmount ?? 0
        this.disbursementFormTransferNumber = instructive?.disbursementFormTransferNumber ?? ' '
        this.disbursementFormTransferName = instructive?.disbursementFormTransferName ?? ' '
        this.disbursementFormTransferAmount = instructive?.disbursementFormTransferAmount ?? 0
        this.disbursementFormOtherNumber = instructive?.disbursementFormOtherNumber ?? ' '
        this.disbursementFormOtherName = instructive?.disbursementFormOtherName ?? ' '
        this.disbursementFormOtherAmount = instructive?.disbursementFormOtherAmount ?? 0
        this.cppNumber = instructive?.cppNumber ?? ' '
        this.cppBeneficiary = instructive?.cppBeneficiary ?? ' '
        this.cppAmount = instructive?.cppAmount ?? 0
        this.countryCode = instructive?.countryCode ?? ' '
        this.countryDesc = instructive?.countryDesc ?? ' '
        this.provinceCode = instructive?.provinceCode ?? ' '
        this.provinceDesc = instructive?.provinceDesc ?? ' '
        this.economicActivityTypeCode = instructive?.economicActivityTypeCode ?? ' '
        this.economicActivityTypeDesc = instructive?.economicActivityTypeDesc ?? ' '
        this.cinuActivityTypeCode = instructive?.cinuActivityTypeCode ?? ' '
        this.cinuActivityTypeDesc = instructive?.cinuActivityTypeDesc ?? ' '
        this.disbursementDetailDescription = instructive?.disbursementDetailDescription ?? ' '
        this.bankEspecialInstructions = instructive?.bankEspecialInstructions ?? ' '
        this.adminNotaryFees = instructive?.adminNotaryFees ?? 0
        this.adminSealFees = instructive?.adminSealFees ?? 0
        this.adminAditionalComments = instructive?.adminAditionalComments ?? ' '
        this.operationalLeasNumber = instructive?.operationalLeasNumber ?? ' '
        this.operationalDueDate = instructive?.operationalDueDate ?? moment().format("YYYY-MM-DD")
        this.operationalNextPaymentDate = instructive?.operationalNextPaymentDate ?? moment().format("YYYY-MM-DD")
        this.paymentMethod = instructive?.paymentMethod ?? ' '
        this.sourceSalesCod = instructive?.sourceSalesCod ?? ' '
        this.sourceSalesDesc = instructive?.sourceSalesDesc ?? ' '
        this.creditDestination = instructive?.creditDestination ?? ' '
        this.fundsDestination = instructive?.fundsDestination ?? ' '
        this.fundsPurposeCode = instructive?.fundsPurposeCode ?? ' '
        this.checkNumber = instructive?.checkNumber ?? ' '
        this.originationRef = instructive?.originationRef ?? ' '
        this.writingType = instructive?.writingType ?? ' '

        this.billsCombined = instructive?.billsCombined ?? false
        this.settlement = instructive?.settlement ?? false
        this.autonomyCode = instructive?.autonomyCode ?? ' '
        this.autonomyUser = instructive?.autonomyUser ?? ' '
        this.subCategoryCode = instructive?.subCategoryCode ?? ' '
        this.authType = instructive?.authType ?? ' '

        this.clientNumber = instructive?.clientNumber ?? ' '
        this.clientName = instructive?.clientName ?? ' '

        this.totalLetterIncludingfiduciaryCommission = instructive?.totalLetterIncludingfiduciaryCommission ?? 0
    }

}