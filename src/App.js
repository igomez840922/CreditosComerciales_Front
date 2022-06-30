import PropTypes from 'prop-types'
import React, { useState } from 'react';

import { Switch, BrowserRouter as Router } from "react-router-dom"
import { connect } from "react-redux"

// Import Routes all
import { userRoutes, authRoutes } from "./routes/allRoutes"

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware"

// layouts Format
import VerticalLayout from "./components/VerticalLayout/"
import HorizontalLayout from "./components/HorizontalLayout/"
import NonAuthLayout from "./components/NonAuthLayout"

// Import scss
import "./assets/scss/theme.scss"
import "./assets/scss/custom.scss"


import fakeBackend from "./helpers/AuthType/fakeBackend"

import packageJson from "../package.json";
import ModalErrrorMessage from './helpers/errorModalSoaint';
import * as opt from "./helpers/options_helper"
import LocalStorageHelper from "./helpers/LocalStorageHelper";


import toastr from "toastr";
import "toastr/build/toastr.min.css"
import { BackendServices } from './services';


// Activating fake backend
fakeBackend()

const App = props => {

  const [localStorageHelper, setlocalStorageHelper] = useState(new LocalStorageHelper());

  //On Mounting (componentDidMount)
  React.useEffect(() => {
    window.onbeforeunload = confirmExit;
    function confirmExit() {
      return "show warning";
    }

    //Tratamiento de Errores
    window.addEventListener('generalError', showGeneralError);
    return () => {
      window.removeEventListener("generalError", showGeneralError)
    }
  }, []);

  function showGeneralError() {
    var error = localStorageHelper.get("generalError");
    const backendServices = new BackendServices();
    if (error.error != {}) {
      console.error("ErrorLog", error);
      toastr.error(error.error, 'Error!');
      let dataSet = {
        "logType": error?.type??"N/A",
        "logTypeDesc": error?.status??"500",
        "url": error?.url??"NO URL",
        "description": error?.error??"NO ERROR DATA"
      }
      backendServices.newErrorsLog(dataSet)
    }
  }

  function getLayout() {
    let layoutCls = VerticalLayout

    switch (props.layout.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout
        break
      default:
        layoutCls = VerticalLayout
        break
    }
    return layoutCls
  }

  const Layout = getLayout();
  return (
    <React.Fragment>
      <Router>
        <Switch>
          {authRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={NonAuthLayout}
              component={route.component}
              key={idx}
              isAuthProtected={false}
            />
          ))}

          {userRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={Layout}
              component={route.component}
              key={idx}
              isAuthProtected={true}
              exact
            />
          ))}
        </Switch>
      </Router>
      <ModalErrrorMessage />
    </React.Fragment>
  )
}

App.propTypes = {
  layout: PropTypes.any
}

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  }
}

export default connect(mapStateToProps, null)(App)