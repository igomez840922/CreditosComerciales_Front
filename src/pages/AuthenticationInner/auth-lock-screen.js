import React from "react"

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"
import { Link } from "react-router-dom"

import { Container, Row, Col, CardBody, Card, Button } from "reactstrap"

// import images
import logo from "../../assets/images/logo-sm-dark.png"
import avatar1 from "../../assets/images/users/avatar-1.jpg"

const LockScreen = () => {
  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-login text-center">
                  <div className="bg-login-overlay"></div>
                  <div className="position-relative">
                    <h5 className="text-white font-size-20">Lock screen</h5>
                    <p className="text-white-50 mb-0">Enter your password to unlock the screen!</p>
                    <Link to="/" className="logo logo-admin mt-4">
                      <img src={logo} alt="" height="30" />
                    </Link>
                  </div>
                </div>
                <CardBody className="pt-5">

                  <div className="p-2">
                    <AvForm className="form-horizontal">
                      <div className="user-thumb text-center mb-4">
                        <img src={avatar1}
                          className="rounded-circle img-thumbnail avatar-md" alt="thumbnail" />
                        <h5 className="font-size-15 mt-3">Maria Laird</h5>
                      </div>

                      <div className="mb-3">
                        <AvField
                          name="password"
                          label="Password"
                          type="password"
                          required
                          placeholder="Enter Password"
                        />
                      </div>

                      <div className="row mb-0">
                        <div className="col-12 text-end">
                          <Button
                            color="primary"
                            className="w-md waves-effect waves-light"
                            type="submit"
                          >
                            Unlock
                            </Button>
                        </div>
                      </div>
                    </AvForm>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>Not you ? return <Link to="/login" className="fw-medium text-primary"> Sign In
                            </Link> </p>
                <p>
                  © {new Date().getFullYear()} Qovex. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger" /> by Themesbrand
                  </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}
export default LockScreen
