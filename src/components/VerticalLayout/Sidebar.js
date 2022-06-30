import PropTypes from "prop-types"
import React from "react"
import { connect } from "react-redux"
import { withRouter, Link } from "react-router-dom"

//i18n
import { withTranslation } from "react-i18next"
import SidebarContent from "./SidebarContent"

//import avatar2 from "../../assets/images/users/avatar-2.jpg"
import avatar2 from "../../assets/images/users/avatar-4.jpg"
import LocalStorageHelper from "../../helpers/LocalStorageHelper";
    

const Sidebar = props => {
  
  const imgSrc = "data:image/png;base64,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"
  const localStorageHelper = new LocalStorageHelper();
  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="h-100">
          <div className="user-wid text-center py-4">
            <div className="user-img">
              <img src={imgSrc} alt="" className="avatar-md mx-auto rounded-circle" />
            </div>

              <div className="mt-3">
                <Link to="#" className="text-dark fw-medium font-size-16">{localStorageHelper.get("usrcredentials").usr}</Link>
                <p className="text-body mt-1 mb-0 font-size-13">{" "}</p>
              </div>
            </div>
            <div data-simplebar className="h-100">
            {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
          </div>
          </div>
        </div>
    </React.Fragment>
  )
}

Sidebar.propTypes = {
        type: PropTypes.string,
}

const mapStatetoProps = state => {
  return {
        layout: state.Layout,
  }
}
export default connect(
  mapStatetoProps,
      {}
)(withRouter(withTranslation()(Sidebar)))