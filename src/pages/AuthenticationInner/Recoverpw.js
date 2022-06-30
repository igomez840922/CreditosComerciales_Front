
import React, { useEffect } from "react"
import { Row, Col, Alert, Container } from "reactstrap"
import { Link } from "react-router-dom"

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"

// import images
import logo from "../../assets/images/logo-sm-dark.png"

const Recoverpw = props => {
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
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2"></i>
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <div className="card overflow-hidden">
                <div className="bg-login text-center">
                  <div className="bg-login-overlay"></div>
                  <div className="position-relative">
                    <h5 className="text-white font-size-20">Reset Password</h5>
                    <p className="text-white-50 mb-0">Re-Password with Qovex.</p>

                    <a href="/" className="logo logo-admin mt-4">
                      <img src={logo} alt="" height="30" />
                    </a>
                  </div>
                </div>
                <div className="card-body pt-5">

                  <div className="p-2">
                    {props.forgetError && props.forgetError ? (
                      <Alert color="danger" className="text-center mb-4" style={{ marginTop: "13px" }}>
                        {props.forgetError}
                      </Alert>
                    ) : null}
                    {props.forgetSuccessMsg ? (
                      <Alert color="success" className="text-center mb-4" style={{ marginTop: "13px" }}>
                        {props.forgetSuccessMsg}
                      </Alert>
                    ) : null}

                    <AvForm
                      className="form-horizontal"
                    >
                      <div className="mb-3">
                        <AvField
                          name="email"
                          label="Email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          required
                        />
                      </div>
                      <Row className="row mb-0">
                        <Col className="col-12 text-end">
                          <button
                            className="btn btn-primary w-md waves-effect waves-light"
                            type="submit"
                          >
                            Reset
                          </button>
                        </Col>
                      </Row>
                    </AvForm>
                  </div>
                </div>
              </div>
              <div className="mt-5 text-center">
                <p>Remember It ? <Link href="/pages-login" className="fw-medium text-primary"> Sign In
                                here</Link> </p>
                <p>
                  © {new Date().getFullYear()} Qovex. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger" /> by Soaint
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Recoverpw
