//Capex Presupuesto
export default class CashFlowWorkload {

    static fromJson(json) {
        const item = new CashFlowWorkload();
        item.id = json.id;
        item.clientName = json.clientName;
        item.projectName = json.projectName;
        item.publicOrganizationPrivateCompany = json.publicOrganizationPrivateCompany;
        item.contractAmount = json.contractAmount;
        item.pendingAmount = json.pendingAmount;
        item.startExecutionPlan = json.startExecutionPlan;
        item.endExecutionPlan = json.endExecutionPlan;
        item.percentExecuted = json.percentExecuted;
        item.percentRun = json.percentRun;
        item.expectedExecution = json.expectedExecution;
        item.assignedDomiciledContract = json.assignedDomiciledContract;
        return item;
    }
}