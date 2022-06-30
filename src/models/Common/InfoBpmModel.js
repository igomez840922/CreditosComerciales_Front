
import moment from "moment";

export class InfoBpmModel {
  constructor(instanceId = 0, transactId = 0, processId = 0, activityId = 0, personId = 0, personName = "", priority = 0) {
    this.instanceId = instanceId;
    this.transactId = transactId;
    this.processId = processId;
    this.activityId = activityId;
    this.personId = personId;
    this.personName = personName;
    this.priority = priority;
  }
}