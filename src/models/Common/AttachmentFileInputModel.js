
export class AttachmentFileInputModel{    
    //transactId: instanceId, processId: processId, activityId: activityId, personId: personId
    constructor(transactId=0, processId=0, activityId=0,personId=0) {
      this.transactId=transactId;
      this.processId=processId;
      this.activityId=activityId; 
      this.personId=personId;
    }
  }