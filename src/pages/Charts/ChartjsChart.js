import React from "react"
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap"
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

// import chartJs
import LineChart from "../AllCharts/chartjs/linechart"
import DountChart from "../AllCharts/chartjs/dountchart"
import PieChart from "../AllCharts/chartjs/piechart"
import BarChart from "../AllCharts/chartjs/barchart"
import RadarChart from "../AllCharts/chartjs/radarchart"
import PolarChart from "../AllCharts/chartjs/polarchart"

const ChartjsChart = () => {
  return (
    <React.Fragment>
      <div className="page-content">

        <Breadcrumbs title="Charts" breadcrumbItem="Chartjs charts" />
        <Row>
          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4 mb-4">Line Chart</CardTitle>
                <Row className="text-center">
                  <div className="col-4">
                    <h5 className="mb-0">86541</h5>
                    <p className="text-muted text-truncate">Activated</p>
                  </div>
                  <div className="col-4">
                    <h5 className="mb-0">2541</h5>
                    <p className="text-muted text-truncate">Pending</p>
                  </div>
                  <div className="col-4">
                    <h5 className="mb-0">102030</h5>
                    <p className="text-muted text-truncate">Deactivated</p>
                  </div>
                </Row>
                <LineChart />
              </CardBody>
            </Card>
          </Col>

          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4 mb-4">Bar Chart</CardTitle>
                <Row className="text-center">
                  <div className="col-4">
                    <h5 className="mb-0">2541</h5>
                    <p className="text-muted text-truncate">Activated</p>
                  </div>
                  <div className="col-4">
                    <h5 className="mb-0">84845</h5>
                    <p className="text-muted text-truncate">Pending</p>
                  </div>
                  <div className="col-4">
                    <h5 className="mb-0">12001</h5>
                    <p className="text-muted text-truncate">Deactivated</p>
                  </div>
                </Row>
                <BarChart />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4 mb-4">Pie Chart</CardTitle>
                <Row className="text-center">
                  <div className="col-4">
                    <h5 className="mb-0">2536</h5>
                    <p className="text-muted text-truncate">Activated</p>
                  </div>
                  <div className="col-4">
                    <h5 className="mb-0">69421</h5>
                    <p className="text-muted text-truncate">Pending</p>
                  </div>
                  <div className="col-4">
                    <h5 className="mb-0">89854</h5>
                    <p className="text-muted text-truncate">Deactivated</p>
                  </div>
                </Row>
                <PieChart />
              </CardBody>
            </Card>
          </Col>

          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4 mb-4">Donut Chart</CardTitle>
                <Row className="text-center">
                  <div className="col-4">
                    <h5 className="mb-0">9595</h5>
                    <p className="text-muted text-truncate">Activated</p>
                  </div>
                  <div className="col-4">
                    <h5 className="mb-0">36524</h5>
                    <p className="text-muted text-truncate">Pending</p>
                  </div>
                  <div className="col-4">
                    <h5 className="mb-0">62541</h5>
                    <p className="text-muted text-truncate">Deactivated</p>
                  </div>
                </Row>
                <DountChart />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4 mb-4">Polar Chart</CardTitle>
                <Row className="text-center">
                  <div className="col-4">
                    <h5 className="mb-0">4852</h5>
                    <p className="text-muted text-truncate">Activated</p>
                  </div>
                  <div className="col-4">
                    <h5 className="mb-0">3652</h5>
                    <p className="text-muted text-truncate">Pending</p>
                  </div>
                  <div className="col-4">
                    <h5 className="mb-0">85412</h5>
                    <p className="text-muted text-truncate">Deactivated</p>
                  </div>
                </Row>
                <PolarChart />
              </CardBody>
            </Card>
          </Col>

          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4 mb-4">Radar Chart</CardTitle>
                <Row className="text-center">
                  <div className="col-4">
                    <h5 className="mb-0">694</h5>
                    <p className="text-muted text-truncate">Activated</p>
                  </div>
                  <div className="col-4">
                    <h5 className="mb-0">55210</h5>
                    <p className="text-muted text-truncate">Pending</p>
                  </div>
                  <div className="col-4">
                    <h5 className="mb-0">489498</h5>
                    <p className="text-muted text-truncate">Deactivated</p>
                  </div>
                </Row>
                <RadarChart />
              </CardBody>
            </Card>
          </Col>
        </Row>{" "}
      </div>
    </React.Fragment>
  )
}

export default ChartjsChart
