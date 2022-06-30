import React from "react"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const PagesStarter = () => {
  return (
    <React.Fragment>
      <div className="page-content">

          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Pages" breadcrumbItem="Starter Page" />

      </div>
    </React.Fragment>
  )
}

export default PagesStarter
