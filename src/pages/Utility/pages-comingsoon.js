import React, { useEffect } from "react"
import { Container, Row, Col } from "reactstrap"

//Import Countdown
import Countdown from "react-countdown"

//Import Images
import logo from "../../assets/images/logo-dark.png"
import commingsoon from "../../assets/images/maintenance.png"

const PagesComingsoon = () => {
  useEffect(() => {
    document.body.className = "authentication-bg";
    // remove classname when component will unmount
    return function cleanup() {
      document.body.className = "";
    };
  });

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <span>You are good to go!</span>
    } else {
      return (
        <>
          <div className="coming-box">
            {days} <span>Days</span>
          </div>{" "}
          <div className="coming-box">
            {hours} <span>Hours</span>
          </div>{" "}
          <div className="coming-box">
            {minutes} <span>Minutes</span>
          </div>{" "}
          <div className="coming-box">
            {seconds} <span>Seconds</span>
          </div>
        </>
      )
    }
  }

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <a href="/" className="text-white"><i className="fas fa-home h2"></i></a>
      </div>
      <div className="my-5 pt-sm-5">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center">
                <a href="/" className="d-block auth-logo">
                  <img src={logo} alt="" height="24" />
                </a>

                <Row className="justify-content-center mt-5">
                  <Col sm={4}>
                    <div className="maintenance-img">
                    <img src={commingsoon} alt="" className="img-fluid mx-auto d-block" />
                    </div>
                  </Col>
                </Row>

                <h4 className="mt-5">Let's get started with Qovex</h4>
                <p className="text-muted">It will be as simple as Occidental in fact it will be Occidental.</p>

                <Row className="justify-content-center mt-5">
                  <Col md={8}>
                    <div className="counter-number">
                      <Countdown date="2021/12/31" renderer={renderer} className="counter-number" />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default PagesComingsoon
