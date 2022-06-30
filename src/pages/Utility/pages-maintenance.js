import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { CardBody, Container, Row, Col, Card } from "reactstrap"

//Import Images
import logo from "../../assets/images/logo-dark.png"
import maintenance from "../../assets/images/maintenance.png"

const PagesMaintenance = () => {

  useEffect(() => {
    document.body.className = "authentication-bg";
    // remove classname when component will unmount
    return function cleanup() {
      document.body.className = "";
    };
  });

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark"><i className="fas fa-home h2"></i></Link>
      </div>
      <div className="my-5 pt-sm-5">
        <Container>
          <Row>
            <div className="col-12 text-center">
              <div className="home-wrapper">
                <div className="mb-5">
                  <Link to="/">
                    <img src={logo} alt="" height="24" />
                  </Link>
                </div>
                <Row className="justify-content-center">
                  <Col sm={4}>
                    <div className="maintenance-img">
                      <img src={maintenance} alt="" className="img-fluid mx-auto d-block" />
                    </div>
                  </Col>
                </Row>
                <h3 className="mt-5">Site is Under Maintenance</h3>
                <p>If several languages coalesce, the grammar of the resulting language is more simple and
                            <br /> regular than that of the individual languages.
                        </p>
                <Row>
                  <Col md={4}>
                    <Card className="mt-4 maintenance-box">
                      <CardBody>
                        <h5 className="font-size-15 text-uppercase">Why is the Site Down?</h5>
                        <p className="text-muted mb-0">There are many variations of passages of
                          Lorem Ipsum available, but the majority have suffered alteration.</p>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="mt-4 maintenance-box">
                      <CardBody>
                        <h5 className="font-size-15 text-uppercase">
                          What is the Downtime?</h5>
                        <p className="text-muted mb-0">Contrary to popular belief, Lorem Ipsum is not
                          simply random text. It has roots in a piece of classical.</p>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="mt-4 maintenance-box">
                      <CardBody>
                        <h5 className="font-size-15 text-uppercase">
                          Do you need Support?</h5>
                        <p className="text-muted mb-0">If you are going to use a passage of Lorem
                        Ipsum, you need to be sure there isn't anything embar..
                            <Link to="mailto:no-reply@domain.com"
                            className="text-decoration-underline"> no-reply@domain.com</Link></p>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </div>
            </div>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default PagesMaintenance
