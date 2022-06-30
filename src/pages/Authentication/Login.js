import PropTypes from 'prop-types'
import React, { useEffect } from "react"

import { Row, Col, Alert, Container } from "reactstrap"
import * as url from "../../helpers/url_helper"

// Redux
import { connect } from "react-redux"
import { withRouter, Link } from "react-router-dom"

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"

// actions
import { loginUser, apiError, socialLogin } from "../../store/actions"

// import images
import logo from "../../assets/images/logo3.jpg"
import logocontigo from "../../assets/images/login/Banesco_Logo.png"
import ApiServiceAuth from "../../services/ApiServiceAuth";

import packageJson from "../../../package.json";

import withClearCache from "../../ClearCache";

//i18n
import { useTranslation } from "react-i18next"

const ClearCacheComponent = withClearCache(Login);

function Login(props) {
//const Login = (props) => {

  const { t, i18n } = useTranslation();
  // or const [t, i18n] = useTranslation();

  useEffect(() => {
    document.body.className = "login-background";

    ////////////remove session
      localStorage.clear();
      sessionStorage.clear();
    /////////////////////////////   
    
    // remove classname when component will unmount
    return function cleanup() {
      document.body.className = "";
    };
  });
  // handleValidSubmit
  const handleValidSubmit = (event, values) => {
    props.loginUser(values, props.history)
    const auth = {
      headers: {
        username: values.email,
        password: values.password

      }
    }

    const header = {
      login: "ok",
      autorizatrion: "true"
    }

    let validatorLogin = false;
    let instancia = new ApiServiceAuth();
    instancia.post(url.URL_BPM_LOGIN, {}, {}, auth).then(resp => {
    }, reject => {
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
    });
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
                    <h5 className="text-white font-size-20">{t('WelcomeBack')}</h5>
                    {/*<p className="text-white-50 mb-0">Sign in to continue to Qovex.</p>*/}
                    <Link to="/" className="logo logo-admin mt-4">
                      <img src={logo} alt="" height="50" />
                    </Link>
                  </div>
                </div>
                <div className="card-body pt-5">
                  <div className="p-2">
                    <AvForm
                      autocomplete="off"
                      className="form-horizontal"
                      onValidSubmit={(e, v) => {
                        handleValidSubmit(e, v)
                      }}
                    >
                      {props.error && typeof props.error === "string" ? (
                        <Alert color="danger">{props.error}</Alert>
                      ) : null}

                      <div className="mb-3">
                        <AvField
                          name="email"
                          id="email"
                          style={{textTransform:"initial"}}
                          autocomplete="off"
                          label={t('UserName')}
                          className="form-control"
                          placeholder={t('EnterUserName')}
                          type="text"
                          errorMessage={t("Required Field")}
                          validate={{ required: { value: true } }}
                        />
                      </div>

                      <div className="mb-3">
                        <AvField
                          name="password"
                          autocomplete="off"
                          style={{textTransform:"initial"}}
                          label={t('Password')}
                          type="password"
                          errorMessage={t("Required Field")}
                          validate={{ required: { value: true } }}
                        />
                      </div>

                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customControlInline"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="customControlInline"
                        >
                          {t('RememberMe')}
                        </label>
                      </div>

                      <div className="mt-3">
                        <button
                          className="btn btn-success w-100 waves-effect waves-light"
                          type="submit"
                        >
                          {t('LogIn')}
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        {/*<Link to="/forgot-password" className="text-muted"><i className="mdi mdi-lock me-1"></i> {t('ForgotPassword')}?</Link>*/}
                      </div>
                    </AvForm>


                    <div className="logo center">
                      <a href="/" title="Inicio" rel="home">
                        <img className="sizeImgLogo" src={logocontigo} alt="Banesco" />
                      </a>
                    </div>

                  </div>


                </div>
              </div>
              <div className="mt-5 text-center">
                {/*<p>Don't have an account ? <Link to="/register" className="fw-medium text-primary"> Signup now </Link> </p>*/}
                <p className="text-footer">© {new Date().getFullYear()} Banesco  V{packageJson.version}</p>
              </div>
            </Col>
          </Row>

        </Container>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  const { error } = state.Login
  return { error }
}

export default withRouter(
  connect(mapStateToProps, { loginUser, apiError, socialLogin })(Login)
)

Login.propTypes = {
  error: PropTypes.any,
  history: PropTypes.object,
  loginUser: PropTypes.func,
  socialLogin: PropTypes.func
}
