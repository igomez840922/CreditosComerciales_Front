
import moment from "moment";

export class LogProcessModel {
  constructor(instanceId = 0, transactId = 0, clientId = 0, observations = "", responsible = "",
    processId = 0, activityId = 0, bpmModelAct = null, requestId = "", requestStatus = "",
    rejectionReason = "", devolutionId = ' ', devolutionDesc = ' ', autonomyCredit = '', autonomyBank = '', decAutonomyCredit = '', decAutonomyBank = '') {
    this.instanceId = instanceId;
    this.transactId = transactId;
    this.clientId = clientId;
    this.observations = observations;
    this.responsible = responsible;
    this.processId = processId;
    this.activityId = activityId;
    this.requestId = requestId;
    this.requestStatus = requestStatus;
    this.rejectionReason = rejectionReason;
    this.date = moment().format("YYYY-MM-DD");
    this.statusDescription = "";
    this.requestStage = "";
    this.processBpmId = bpmModelAct?.processId ?? 0;
    this.processBpmName = bpmModelAct?.processName ?? "";
    this.activityBpmId = bpmModelAct?.id ?? 0;
    this.activityBpmName = bpmModelAct?.name ?? "";
    this.status = true;

    this.devolutionId = devolutionId ?? ' ';
    this.devolutionDesc = devolutionDesc ?? ' ';

    this.autonomyCredit = autonomyCredit ?? ' ';
    this.autonomyBank = autonomyBank ?? ' ';
    this.decAutonomyCredit = decAutonomyCredit ?? ' ';
    this.decAutonomyBank = decAutonomyBank ?? ' ';

  }
}