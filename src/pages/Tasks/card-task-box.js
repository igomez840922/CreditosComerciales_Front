import PropTypes from 'prop-types'
import React from "react"
import { Link } from "react-router-dom"
import { Card, CardBody, Badge } from "reactstrap"

//Import Images
import avatar4 from "../../assets/images/users/avatar-4.jpg"
import avatar5 from "../../assets/images/users/avatar-5.jpg"

const CardTaskBox = props => {
  return (
    <React.Fragment>
      <Card className="task-box">
        <CardBody className="borad-width">
          <div className="float-end ms-2">
            <Badge
              className={"badge rounded-pill font-size-12 badge-soft-" + props.data["badgecolor"]}
              pill
            >
              {props.data["status"]}
            </Badge>
          </div>
          <div>
            <h5 className="font-size-15">
              <Link to="#" className="text-dark">
                {props.data["name"]}
              </Link>
            </h5>
            <p className="text-muted mb-4">{props.data["date"]}</p>
          </div>
          <div className="team float-start">
            <div className="team-member d-inline-block">
              <Link to="#" className="d-inline-block">
                <img
                  src={avatar4}
                  className="rounded-circle avatar-xs m-1"
                  alt=""
                />
              </Link>
            </div>
           
              <Link to="#" className="team-member d-inline-block">
                <img
                  src={avatar5}
                  className="rounded-circle avatar-xs m-1"
                  alt=""
                />
              </Link>

              <Link to="#" className="team-member d-inline-block">
                <div className="avatar-xs">
                  <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                    3 +
                </span>
                </div>
              </Link>

          </div>

          <div className="text-end">
            <h5 className="font-size-15 mb-1">$ 145</h5>
            <p className="mb-0 text-muted">Budget</p>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}

CardTaskBox.propTypes = {
  data: PropTypes.object
}

export default CardTaskBox
