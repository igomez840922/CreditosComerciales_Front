import React, { Component } from "react"
import { Card, CardBody, CardTitle } from "reactstrap"
import { Link } from "react-router-dom"

class ActivityComp extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <React.Fragment>
        <Card>
          <CardBody>
            <CardTitle className="h4 mb-5">Activity</CardTitle>
            <ul className="list-unstyled activity-wid">
              <li className="activity-list">
                <div className="activity-icon avatar-xs">
                  <span className="avatar-title bg-soft-primary text-primary rounded-circle">
                    <i className="mdi mdi-calendar-edit"></i>
                  </span>
                </div>
                <div className="d-flex align-items-start">
                  <div className="me-3">
                    <h5 className="font-size-14">20 Jan <i
                      className="mdi mdi-arrow-right text-primary align-middle ms-2"></i>
                    </h5>
                  </div>
                  <div className="flex-1">
                    <div>
                      Responded to need “Volunteer Activities"
                                                </div>
                  </div>
                </div>
              </li>

              <li className="activity-list">
                <div className="activity-icon avatar-xs">
                  <span className="avatar-title bg-soft-primary text-primary rounded-circle">
                    <i className="mdi mdi-account-multiple-outline"></i>
                  </span>
                </div>
                 <div className="d-flex align-items-start">
                  <div className="me-3">
                    <h5 className="font-size-14">23 Jan <i
                      className="mdi mdi-arrow-right text-primary align-middle ms-2"></i>
                    </h5>
                  </div>
                  <div className="flex-1">
                    <div>
                      Added an interest “Volunteer Activities”
                                                </div>
                  </div>
                </div>
              </li>

              <li className="activity-list">
                <div className="activity-icon avatar-xs">
                  <span className="avatar-title bg-soft-primary text-primary rounded-circle">
                    <i className="mdi mdi-square-edit-outline"></i>
                  </span>
                </div>
                 <div className="d-flex align-items-start">
                  <div className="me-3">
                    <h5 className="font-size-14">24 Jan <i
                      className="mdi mdi-arrow-right text-primary align-middle ms-2"></i>
                    </h5>
                  </div>
                  <div className="flex-1 d-flex">
                    <div>
                      Everyone realizes why a new common language.. <Link to="#">Read
                                                        more</Link>
                    </div>
                  </div>
                </div>
              </li>

              <li className="activity-list">
                <div className="activity-icon avatar-xs">
                  <span className="avatar-title bg-soft-primary text-primary rounded-circle">
                    <i className="mdi mdi-account-multiple-outline"></i>
                  </span>
                </div>
                 <div className="d-flex align-items-start">
                  <div className="me-3">
                    <h5 className="font-size-14">26 Jan <i
                      className="mdi mdi-arrow-right text-primary align-middle ms-2"></i>
                    </h5>
                  </div>
                  <div className="flex-1">
                    <div>
                      Joined the group “Boardsmanship Forum”
                                                </div>
                  </div>
                </div>
              </li>
            </ul>
            <div className="text-center mt-4">
              <Link
                to=""
                className="btn btn-primary btn-sm"
              >
                View More <i className="mdi mdi-arrow-right ms-1" />
              </Link>
            </div>
          </CardBody>
        </Card>
      </React.Fragment>
    )
  }
}

export default ActivityComp
