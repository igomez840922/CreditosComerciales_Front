import React from "react"
import { Row, Col } from "reactstrap"
import { Link } from "react-router-dom"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

import img2 from "../../assets/images/small/img-2.jpg"
import img5 from "../../assets/images/small/img-5.jpg"

const PagesTimeline = () => {

  return (
    <React.Fragment>
      <div className="page-content">
        {/* Render Breadcrumbs */}
        <Breadcrumbs title="Pages" breadcrumbItem="Timeline" />
        <Row>
          <Col lg={12}>
            <div className="card">
              <div className="card-body">

                <div className="timeline-count p-4">
                  <Row>

                    <div className="timeline-box col-lg-4">
                      <div className="timeline-spacing">
                        <div className="item-lable bg-primary rounded">
                          <p className="text-center text-white">April, 12</p>
                        </div>
                        <div className="timeline-line active">
                          <div className="dot bg-primary"></div>
                        </div>
                        <div className="vertical-line">
                          <div className="wrapper-line bg-light"></div>
                        </div>
                        <div className="bg-light p-4 rounded mx-3">
                          <h5>Timeline Event One</h5>
                          <p className="text-muted mt-1 mb-0">Sed ut perspiciatis unde omnis
                          it voluptatem accusantium doloremque laudantium, totam rem
                          aperiam, eaque ipsa quae ab illo inventore veritatis et
                          quasi architecto beatae vitae dicta sunt explicabo. enim
                          ipsam voluptatem quia voluptas sit aspernatur aut odit aut
                                                        fugit</p>
                        </div>
                      </div>
                    </div>
                    <div className="timeline-box col-lg-4">
                      <div className="timeline-spacing">
                        <div className="item-lable bg-primary rounded">
                          <p className="text-center text-white">April, 13</p>
                        </div>
                        <div className="timeline-line active">
                          <div className="dot bg-primary"></div>
                        </div>
                        <div className="vertical-line">
                          <div className="wrapper-line bg-light"></div>
                        </div>
                        <div className="bg-light p-4 rounded mx-3">
                          <h5>Timeline Event Two</h5>
                          <p className="text-muted mt-1 mb-0">Vivamus ultrices massa tellus,
                          sed convallis urna interdum eu. Pellentesque habitant morbi
                          tristique eget justo sit amet est varius mollis et quis
                          nisi. Suspendisse potenti. senectus et netus et malesuada
                          fames ac turpis egestas. Donec vitae blandit ipsum. Donec ac
                                                        tempus nulla.</p>

                        </div>
                      </div>
                    </div>
                    <div className="timeline-box col-lg-4">
                      <div className="timeline-spacing">
                        <div className="item-lable bg-primary rounded">
                          <p className="text-center text-white">April, 26</p>
                        </div>
                        <div className="timeline-line active">
                          <div className="dot bg-primary"></div>
                        </div>
                        <div className="vertical-line">
                          <div className="wrapper-line bg-light"></div>
                        </div>
                        <div className="bg-light p-4 rounded mx-3">
                          <h5>Timeline Event Three</h5>
                          <p className="text-muted mt-1">At vero eos dignissimos ducimus quos
                                                        dolores et</p>

                          <img src={img2} alt=""
                            className="img-fluid rounded me-3" width="100" />{" "}
                          <img src={img5} alt=""
                            className="img-fluid rounded" width="100" />

                        </div>
                      </div>
                    </div>
                  </Row>
                  <Row>
                    <div className="timeline-box col-lg-4">
                      <div className="timeline-spacing">
                        <div className="item-lable bg-primary rounded">
                          <p className="text-center text-white">April, 27</p>
                        </div>
                        <div className="timeline-line active">
                          <div className="dot bg-primary"></div>
                        </div>
                        <div className="vertical-line">
                          <div className="wrapper-line bg-light"></div>
                        </div>
                        <div className="bg-light  text-start p-4 rounded mx-3">
                          <h5>Timeline Event End</h5>
                          <p className="text-muted mb-0">Suspendisse tempor porttitor elit non
                          maximus. Sed suscipit, purus in convallis condimentum, risus
                          ex pellentesque sapien, vel tempor arcu dolor ut est. Nam ac
                          felis id mauris fermentum luctus. Etiam iaculis mollis lacus
                                                        a at posuere nisl pharetra auctor.</p>
                        </div>
                      </div>
                    </div>
                    <div className="timeline-box col-lg-4">
                      <div className="timeline-spacing">
                        <div className="item-lable bg-primary rounded">
                          <p className="text-center text-white">April, 28</p>
                        </div>
                        <div className="timeline-line active">
                          <div className="dot bg-primary"></div>
                        </div>
                        <div className="vertical-line">
                          <div className="wrapper-line bg-light"></div>
                        </div>
                        <div className="bg-light  text-start p-4 rounded mx-3">
                          <h5>Timeline Event Four</h5>
                          <p className="text-muted mb-0">Excepturi, obcaecati, quisquam id
                          molestias eaque asperiores voluptatibus cupiditate error
                          assumenda delectus odit similique earum voluptatem
                          doloremque dolorem ipsam quae rerum quis. Odit, itaque,
                                                        deserunt corporis vero ipsum nisi repellat ... <Link to="#">Read
                                                            more</Link></p>
                        </div>
                      </div>
                    </div>

                    <div className="timeline-box col-lg-4">
                      <div className="timeline-spacing">
                        <div className="item-lable bg-primary rounded">
                          <p className="text-center text-white">April, 30</p>
                        </div>
                        <div className="timeline-line active">
                          <div className="dot bg-primary"></div>
                        </div>
                        <div className="vertical-line">
                          <div className="wrapper-line bg-light"></div>
                        </div>
                        <div className="bg-light text-start p-4 rounded mx-3">
                          <h5>Timeline Event five</h5>
                          <p className="text-muted mb-0">printing and typesetting industry.
                          been the industry'scrambled it to make a type specimen book.
                                                    </p>
                          <button type="button"
                            className="btn btn-info btn-rounded waves-effect waves-light mt-4">See
                                                        more detail</button>
                        </div>
                      </div>
                    </div>
                  </Row>
                </div>

              </div>
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  )
}

export default PagesTimeline