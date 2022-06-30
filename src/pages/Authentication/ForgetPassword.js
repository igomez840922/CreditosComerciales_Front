import PropTypes from 'prop-types'
import React, { useEffect } from "react"
import { Row, Col, Alert, Container } from "reactstrap"

// Redux
import { connect } from "react-redux"
import { withRouter, Link } from "react-router-dom"

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"

// action
import { userForgetPassword } from "../../store/actions"

// import images
import logo from "../../assets/images/logo3.jpg"

import { useTranslation } from "react-i18next"

const ForgetPasswordPage = props => {

  const { t, i18n } = useTranslation();
  // or const [t, i18n] = useTranslation();

  useEffect(() => {
    document.body.className = "authentication-bg";
    // remove classname when component will unmount
    return function cleanup() {
      document.body.className = "";
    };
  });

  function handleValidSubmit(event, values) {
    props.userForgetPassword(values, props.history)
  }

  return (
    <React.Fragment>
      
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <div className="card overflow-hidden">
                <div className="bg-login text-center">
                  <div className="bg-login-overlay"></div>
                  <div className="position-relative">
                    <h5 className="text-white font-size-20">{t('ResetPassword')}</h5>

                    <a href="/" className="logo logo-admin mt-4">
                      <img src={logo} alt="" height="50" />
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
                      onValidSubmit={(e, v) => handleValidSubmit(e, v)}
                    >
                      <div className="mb-3">
                        <AvField
                          name="email"
                          label={t('Email')}
                          className="form-control"
                          placeholder={t('EnterEmail')}
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
                            {t('Reset')}
                          </button>
                        </Col>
                      </Row>
                    </AvForm>
                  </div>
                </div>
              </div>
              <div className="mt-5 text-center">
                  <p>{t('RememberIt')} ? <Link to="/" className="fw-medium text-primary"> {t('SignHere')}</Link> </p>
                  <p> © {new Date().getFullYear()} Banesco. </p>
                </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

ForgetPasswordPage.propTypes = {
  forgetError: PropTypes.any,
  forgetSuccessMsg: PropTypes.any,
  history: PropTypes.object,
  userForgetPassword: PropTypes.func
}

const mapStatetoProps = state => {
  const { forgetError, forgetSuccessMsg } = state.ForgetPassword
  return { forgetError, forgetSuccessMsg }
}

export default withRouter(
  connect(mapStatetoProps, { userForgetPassword })(ForgetPasswordPage)
)
