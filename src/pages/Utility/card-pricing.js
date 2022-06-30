import PropTypes from 'prop-types'
import React from "react"
import { Link } from "react-router-dom"
import { Card, CardBody, Col } from "reactstrap"

const CardPricing = props => {
  return (
    <React.Fragment>
      <Col xl="3" md="6">
        <Card className="plan-box">
          <CardBody className="p-4">
            <div className="d-flex align-items-start">
              <div body className="flex-1 me-3">
                <h5>{props.pricing.title}</h5>
                <p className="text-muted">{props.pricing.description}</p>
              </div>
              <div className="ms-auto">
                <i
                  className={"bx " + props.pricing.icon + " h1 text-primary"}
                />
              </div>
            </div>
            <div className="py-4 mt-4 text-center bg-soft-light">
              <h1 className="m-0"><sup><small>$</small></sup> {props.pricing.price}/{" "}<span className="font-size-13">{props.pricing.duration}</span></h1>
            </div>
            <div className="plan-features p-4 text-muted mt-2">
              {props.pricing.features.map((feature, key) => (
                <p key={"_feature_" + key}>
                  <i className="mdi mdi-check-bold text-primary me-4" />
                  {feature.title}
                </p>
              ))}
            </div>
            <div className="text-center">
              <Link
                to={props.pricing.link}
                className="btn btn-primary waves-effect waves-light"
              >
                Sign up Now
              </Link>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  )
}

CardPricing.propTypes = {
  pricing: PropTypes.object
}

export default CardPricing
