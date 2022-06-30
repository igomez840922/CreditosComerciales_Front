import React from "react"
import { Row, Col } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

//Import Pricing Cards
import CardPricing from "./card-pricing"

const PagesPricing = () => {
  const pricings = [
    {
      id: 1,
      title: "Starter",
      description: "Neque quis est",
      icon: "bx-walk",
      price: "19",
      duration: "Per month",
      link: "",
      features: [
        { title: "Unlimited access to licence" },
        { title: "GB Storage" },
        { title: "No Domain" },
        { title: "SEO optimization" },
        { title: "Unlmited Users" },
        { title: "500 GB Bandwidth" },
      ],
    },
    {
      id: 2,
      title: "Professional",
      description: "Quis autem iure",
      icon: "bx-run",
      price: "29",
      duration: "Per month",
      link: "",
      features: [
        { title: "Unlimited access to licence" },
        { title: "GB Storage" },
        { title: "No Domain" },
        { title: "SEO optimization" },
        { title: "Unlmited Users" },
        { title: "500 GB Bandwidth" },
      ],
    },
    {
      id: 3,
      title: "Enterprise",
      description: "Sed ut neque unde",
      icon: "bx-cycling",
      price: "39",
      duration: "Per month",
      link: "",
      features: [
        { title: "Unlimited access to licence" },
        { title: "GB Storage" },
        { title: "No Domain" },
        { title: "SEO optimization" },
        { title: "Unlmited Users" },
        { title: "500 GB Bandwidth" },
      ],
    },
    {
      id: 4,
      title: "Unlimited",
      description: "Itaque earum hic",
      icon: "bx-car",
      price: "49",
      duration: "Per month",
      link: "",
      features: [
        { title: "Unlimited access to licence" },
        { title: "GB Storage" },
        { title: "No Domain" },
        { title: "SEO optimization" },
        { title: "Unlmited Users" },
        { title: "500 GB Bandwidth" },
      ],
    },
  ]
  return (
    <React.Fragment>
      <div className="page-content">
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Pages" breadcrumbItem="Pricing" />

          <Row className="justify-content-center">
            <Col lg={6}>
              <div className="text-center mb-5">
                <h4>Choose your Pricing plan</h4>
                <p className="text-muted">
                  To achieve this, it would be necessary to have uniform
                  grammar, pronunciation and more common words If several
                  languages coalesce
                </p>
              </div>
            </Col>
          </Row>

          <Row>
            {pricings.map((pricing, key) => (
              <CardPricing pricing={pricing} key={"_pricing_" + key} />
            ))}
          </Row>
      </div>
    </React.Fragment>
  )
}
export default PagesPricing
