import React from "react"

import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle
} from "reactstrap"
import Vector from "./Vectormap"
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const MapsVector = () => {
  return (
    <React.Fragment>
      <div className="page-content">

        <Breadcrumbs title="Maps" breadcrumbItem="Vector Maps" />

        <Row>
          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4">USA Map</CardTitle>
                <CardSubtitle className="mb-3">
                  Example of vector map.
                  </CardSubtitle>

                <div id="usa" className="vector-map-height">
                  <Vector
                    value="us_aea"
                    width="500"
                    color="#3b5de7"
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4">World Map</CardTitle>
                <CardSubtitle className="mb-3">
                  Example of vector map.
                  </CardSubtitle>

                <div id="world-map-markers" className="vector-map-height">
                  <Vector
                    value="world_mill"
                    width="500"
                    color="#3b5de7"
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4">Canada Map</CardTitle>
                <CardSubtitle className="mb-3">
                  Example of vector map.
                  </CardSubtitle>

                <div id="uk" className="vector-map-height">
                  <Vector
                    value="ca_lcc"
                    width="500"
                    color="#3b5de7"
                  />
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4">Asia Vector Map</CardTitle>
                <CardSubtitle className="mb-3">
                  Example of vector map.
                  </CardSubtitle>

                <div id="chicago" className="vector-map-height">
                  <Vector
                    value="asia_mill"
                    width="500"
                    color="#3b5de7"
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  )
}

export default MapsVector
