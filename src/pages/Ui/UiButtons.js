import React, { useState } from "react"
import { Link } from "react-router-dom"

import { Col, Row, Card, CardBody, CardTitle } from "reactstrap"
import {
  Button,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const UiButtons = () => {
  const [drp_link, setdrp_link] = useState(false)

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title="UI Elements" breadcrumbItem="Buttons" />

        <Row>
          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4">Default buttons</CardTitle>
                <p className="mb-4 card-title-desc">
                  Bootstrap includes six predefined button styles, each
                  serving its own semantic purpose.
                  </p>
                <div className="button-items">
                  <Button
                    color="primary"
                    className="btn btn-primary waves-effect waves-light"
                  >
                    Primary
                    </Button>{" "}
                  <Button
                    color="secondary"
                    className="btn btn-secondary waves-effect"
                  >
                    Secondary
                    </Button>{" "}
                  <Button
                    color="success"
                    className="btn btn-success waves-effect waves-light"
                  >
                    Success
                    </Button>{" "}
                  <Button
                    color="info"
                    className="btn btn-info waves-effect waves-light"
                  >
                    Info
                    </Button>{" "}
                  <Button
                    color="warning"
                    className="btn btn-warning waves-effect waves-light"
                  >
                    Warning
                    </Button>{" "}
                  <Button
                    color="danger"
                    className="btn btn-danger waves-effect waves-light"
                  >
                    Danger
                    </Button>{" "}
                  <Button
                      color="danger"
                    className="btn btn-dark waves-effect waves-light"
                  >
                    Dark
                    </Button>{" "}
                  <Button color="link" className="btn btn-link waves-effect">
                    Link
                    </Button>{" "}
                  <Button
                    color="light"
                    className="btn btn-light waves-effect"
                  >
                    Light
                    </Button>{" "}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4">Outline buttons</CardTitle>
                <p className="card-title-desc">
                  Replace the default modifier classes with the{" "}
                  <code className="highlighter-rouge">.btn-outline-*</code>{" "}
                    ones to remove all background images and colors on any
                    button.
                  </p>
                <div className="button-items">
                  <Button
                    color="primary"
                    outline
                    className="waves-effect waves-light"
                  >
                    Primary
                    </Button>{" "}
                  <Button color="secondary" outline className="waves-effect">
                    Secondary
                    </Button>{" "}
                  <Button
                    color="success"
                    outline
                    className="waves-effect waves-light"
                  >
                    Success
                    </Button>{" "}
                  <Button
                    color="info"
                    outline
                    className="waves-effect waves-light"
                  >
                    Info
                    </Button>{" "}
                  <Button
                    color="warning"
                    outline
                    className="waves-effect waves-light"
                  >
                    Warning
                    </Button>{" "}
                  <Button
                    color="danger"
                    outline
                    className="waves-effect waves-light"
                  >
                    Danger
                    </Button>{" "}
                  <Button
                      color="danger"
                    outline
                    className="waves-effect waves-light"
                  >
                    Dark
                    </Button>{" "}
                    <Button
                    color="light"
                    outline
                    className="waves-effect"
                  >
                    Light
                    </Button>{" "}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4">Rounded buttons</CardTitle>
                <p className="mb-4 card-title-desc">
                  Use class <code>.btn-rounded</code> for button round border.
                  </p>
                <div className="button-items">
                  <Button
                    color="primary"
                    className="btn-rounded waves-effect waves-light"
                  >
                    Primary
                    </Button>{" "}
                  <Button
                    color="secondary"
                    className="btn-rounded waves-effect waves-light"
                  >
                    Secondary
                    </Button>{" "}
                  <Button
                    color="success"
                    className="btn-rounded waves-effect waves-light"
                  >
                    Success
                    </Button>{" "}
                  <Button
                    color="info"
                    className="btn-rounded waves-effect waves-light"
                  >
                    Info
                    </Button>{" "}
                  <Button
                    color="warning"
                    className="btn-rounded waves-effect waves-light"
                  >
                    Warning
                    </Button>{" "}
                  <Button
                    color="danger"
                    className="btn-rounded waves-effect waves-light"
                  >
                    Danger
                    </Button>{" "}
                  <Button
                      color="danger"
                    className="btn-rounded waves-effect waves-light"
                  >
                    Dark
                    </Button>{" "}
                  <Button color="link" className="btn-rounded waves-effect">
                    Link
                    </Button>{" "}
                  <Button color="light" className="btn-rounded waves-effect">
                    Light
                    </Button>{" "}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4">Buttons with icon</CardTitle>
                <p className="mb-4 card-title-desc">Add icon in button.</p>

                <div className="button-items">
                  <button
                    type="button"
                    className="btn btn-primary waves-effect waves-light"
                  >
                    <i className="bx bx-smile font-size-16 align-middle me-2"></i>{" "}
                      Primary
                    </button>{" "}
                  <button
                    type="button"
                    className="btn btn-success waves-effect waves-light"
                  >
                    <i className="bx bx-check-double font-size-16 align-middle me-2"></i>{" "}
                      Success
                    </button>{" "}
                  <button
                    type="button"
                    className="btn btn-warning waves-effect waves-light"
                  >
                    <i className="bx bx-error font-size-16 align-middle me-2"></i>{" "}
                      Warning
                    </button>{" "}
                  <button
                    type="button"
                    className="btn btn-danger waves-effect waves-light"
                  >
                    <i className="bx bx-block font-size-16 align-middle me-2"></i>{" "}
                      Danger
                    </button>{" "}
                  <button
                    type="button"
                    className="btn btn-dark waves-effect waves-light"
                  >
                    <i className="bx bx-loader bx-spin font-size-16 align-middle me-2"></i>{" "}
                      Loading
                    </button>{" "}
                  <button
                    type="button"
                    className="btn btn-light waves-effect"
                  >
                    <i className="bx bx-hourglass bx-spin font-size-16 align-middle me-2"></i>{" "}
                      Loading
                    </button>{" "}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4">Buttons Sizes</CardTitle>
                <p className="card-title-desc">
                  Add <code>.btn-lg</code> or <code>.btn-sm</code> for
                    additional sizes.
                  </p>

                <div className="button-items">
                  <Button
                    color="primary"
                    className="btn btn-primary btn-lg waves-effect waves-light"
                  >
                    Large button
                    </Button>{" "}
                  <Button
                    color="secondary"
                    className="btn btn-secondary btn-lg waves-effect"
                  >
                    Large button
                    </Button>{" "}
                  <Button
                    color="primary"
                    className="btn btn-primary btn-sm waves-effect waves-light"
                  >
                    Small button
                    </Button>{" "}
                  <Button
                    color="secondary"
                    className="btn btn-secondary btn-sm waves-effect"
                  >
                    Small button
                    </Button>{" "}
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4">Buttons width</CardTitle>
                <p className="card-title-desc">
                  Add <code>.w-xs</code>, <code>.w-sm</code>,{" "}
                  <code>.w-md</code> and <code> .w-lg</code> className for
                    additional buttons width.
                  </p>

                <div className="button-items">
                  <button
                    type="button"
                    className="btn btn-primary width-xs waves-effect waves-light"
                  >
                    Xs
                    </button>{" "}
                  <button
                    type="button"
                    className="btn btn-danger width-sm waves-effect waves-light"
                  >
                    Small
                    </button>{" "}
                  <button
                    type="button"
                    className="btn btn-warning width-md waves-effect waves-light"
                  >
                    Medium
                    </button>{" "}
                  <button
                    type="button"
                    className="btn btn-success width-lg waves-effect waves-light"
                  >
                    Large
                    </button>{" "}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4">Button tags</CardTitle>
                <p className="card-title-desc">
                  The <code className="highlighter-rouge">.btn </code>
                    classes are designed to be used with the{" "}
                  <code className="highlighter-rouge">
                    &lt;button&gt;
                    </code>{" "}
                    element. However, you can also use these classes on{" "}
                  <code className="highlighter-rouge">&lt;Link&gt;</code> or{" "}
                  <code className="highlighter-rouge">&lt;input&gt;</code>{" "}
                    elements (though some browsers may apply a slightly
                    different rendering).
                  </p>

                <div className="button-items">
                  <Link
                    className="btn btn-primary waves-effect waves-light"
                    to="#"
                    role="button"
                  >
                    Link
                    </Link>{" "}
                  <Button
                    color="success"
                    className="btn btn-success waves-effect waves-light"
                    type="submit"
                  >
                    Button
                    </Button>{" "}
                  <input
                    className="btn btn-info"
                    type="button"
                    value="Input"
                  />{" "}
                  <input
                    className="btn btn-danger"
                    type="submit"
                    value="Submit"
                  />{" "}
                  <input
                    className="btn btn-warning"
                    type="reset"
                    value="Reset"
                  />{" "}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4">Toggle states</CardTitle>
                <p className="card-title-desc">
                  Add{" "}
                  <code className="highlighter-rouge">
                    data-toggle="button"
                    </code>
                    to toggle a button’s{" "}
                  <code className="highlighter-rouge">active </code>
                    state. If you’re pre-toggling a button, you must manually
                    add the <code className="highlighter-rouge">
                    .active
                    </code>{" "}
                    class
                    <strong> and</strong>{" "}
                  <code className="highlighter-rouge">
                    aria-pressed="true"
                    </code>{" "}
                    to the
                    <code className="highlighter-rouge">&lt;button&gt;</code>.
                  </p>

                <div className="button-items">
                  <Button
                    color="primary"
                    className="btn btn-primary waves-effect waves-light"
                    data-toggle="button"
                    aria-pressed="false"
                  >
                    Single toggle
                    </Button>{" "}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4">Block Buttons</CardTitle>
                <p className="card-title-desc">
                  Create block level buttons—those that span the full width of
                    a parent—by adding{" "}
                  <code className="highlighter-rouge">.btn-block</code>.
                  </p>

                <div className="d-grid gap-2">
                  <Button
                    color="primary"
                    className="btn btn-primary btn-lg btn-block waves-effect waves-light mb-1"
                  >
                    Block level button
                    </Button>{" "}
                  <Button
                    color="secondary"
                    className="btn btn-secondary btn-sm btn-block waves-effect waves-light"
                  >
                    Block level button
                    </Button>{" "}
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4">Checkbox & Radio Buttons</CardTitle>
                <p className="card-title-desc">Create button-like checkboxes and radio buttons by using
                                    <code>.btn</code> styles rather than <code>.form-check-label</code> on the
                                    <code>&lt;label&gt;</code> elements.
                                </p>

                <Row>
                  <Col lg={6}>
                    <div
                      className="btn-group btn-group-toggle"
                      data-toggle="buttons"
                    >
                      <input type="checkbox" className="btn-check" id="btncheck1" autoComplete="off" defaultChecked />
                      <label className="btn btn-primary" htmlFor="btncheck1">Checked-1</label>

                      <input type="checkbox" className="btn-check" id="btncheck2" autoComplete="off" />
                      <label className="btn btn-primary" htmlFor="btncheck2">Checked-2</label>

                      <input type="checkbox" className="btn-check" id="btncheck3" autoComplete="off" />
                      <label className="btn btn-primary" htmlFor="btncheck3">Checked-3</label>
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="btn-group mt-2 mt-xl-0" role="group" aria-label="Basic radio toggle button group">
                      <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" defaultChecked />
                      <label className="btn btn-secondary" htmlFor="btnradio1">Active</label>

                      <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" />
                      <label className="btn btn-secondary" htmlFor="btnradio2">Radio</label>

                      <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" />
                      <label className="btn btn-secondary" htmlFor="btnradio3">Radio</label>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4">Button group</CardTitle>
                <p className="card-title-desc">
                  Wrap a series of buttons with{" "}
                  <code className="highlighter-rouge">.btn</code> in{" "}
                  <code className="highlighter-rouge">.btn-group</code>.
                  </p>

                <Row>
                  <Col md={6}>
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Basic example"
                    >
                      <Button color="primary">Left</Button>{" "}
                      <Button color="primary">Middle</Button>{" "}
                      <Button color="primary">Right</Button>{" "}
                    </div>
                  </Col>

                  <Col md={6}>
                    <div
                      className="btn-group mt-4 mt-md-0"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button type="button" className="btn btn-secondary">
                        <i className="bx bx-menu-alt-right"></i>
                      </button>{" "}
                      <button type="button" className="btn btn-secondary">
                        <i className="bx bx-menu"></i>
                      </button>{" "}
                      <button type="button" className="btn btn-secondary">
                        <i className="bx bx-menu-alt-left"></i>
                      </button>{" "}
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4">Button toolbar</CardTitle>
                <p className="card-title-desc">Combine sets of button groups into button toolbars for
                more complex components. Use utility classes as needed to space out groups,
                                    buttons, and more.</p>

                <div
                  className="btn-toolbar"
                  role="toolbar"
                  aria-label="Toolbar with button groups"
                >
                  <div
                    className="btn-group me-2"
                    role="group"
                    aria-label="First group"
                  >
                    <Button color="secondary" className="btn btn-secondary">
                      1
                      </Button>{" "}
                    <Button color="secondary" className="btn btn-secondary">
                      2
                      </Button>{" "}
                    <Button color="secondary" className="btn btn-secondary">
                      3
                      </Button>{" "}
                    <Button color="secondary" className="btn btn-secondary">
                      4
                      </Button>{" "}
                  </div>
                  <div
                    className="btn-group me-2"
                    role="group"
                    aria-label="Second group"
                  >
                    <Button color="secondary" className="btn btn-secondary">
                      5
                      </Button>{" "}
                    <Button color="secondary" className="btn btn-secondary">
                      6
                      </Button>{" "}
                    <Button color="secondary" className="btn btn-secondary">
                      7
                      </Button>{" "}
                  </div>
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Third group"
                  >
                    <Button color="secondary" className="btn btn-secondary">
                      8
                      </Button>{" "}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4">Sizing</CardTitle>
                <p className="card-title-desc">
                  Instead of applying button sizing classes to every button in
                    a group, just add{" "}
                  <code className="highlighter-rouge">.btn-group-*</code> to
                    each <code className="highlighter-rouge">.btn-group</code>,
                    including each one when nesting multiple groups.
                  </p>

                <div
                  className="btn-group btn-group-lg"
                  role="group"
                  aria-label="Basic example"
                >
                  <Button color="primary">Left</Button>{" "}
                  <Button color="primary">Middle</Button>{" "}
                  <Button color="primary">Right</Button>{" "}
                </div>

                <br />

                <div
                  className="btn-group mt-2"
                  role="group"
                  aria-label="Basic example"
                >
                  <Button color="secondary" className="btn btn-secondary">
                    Left
                    </Button>{" "}
                  <Button color="secondary" className="btn btn-secondary">
                    Middle
                    </Button>{" "}
                  <Button color="secondary" className="btn btn-secondary">
                    Right
                    </Button>{" "}
                </div>

                <br />

                <div
                  className="btn-group btn-group-sm mt-2"
                  role="group"
                  aria-label="Basic example"
                >
                  <Button color="danger">Left</Button>{" "}
                  <Button color="danger">Middle</Button>{" "}
                  <Button color="danger">Right</Button>{" "}
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle className="h4">Vertical variation</CardTitle>
                <p className="card-title-desc">
                  Make a set of buttons appear vertically stacked rather than
                  horizontally. Split button dropdowns are not supported here.
                  </p>

                <div
                  className="btn-group-vertical"
                  role="group"
                  aria-label="Vertical button group"
                >
                  <Button
                    type="button"
                    color="secondary"
                    className="btn btn-secondary"
                  >
                    Button
                    </Button>{" "}

                  <ButtonDropdown
                    isOpen={drp_link}
                    toggle={() => {
                      setdrp_link(!drp_link)
                    }}
                  >
                    <DropdownToggle caret color="secondary">
                      Dropdown <i className="mdi mdi-chevron-down"></i>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem>Dropdown link</DropdownItem>
                      <DropdownItem>Dropdown link</DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>

                  <Button
                    color="secondary"
                    type="button"
                    className="btn btn-secondary"
                  >
                    Button
                    </Button>{" "}
                  <Button
                    color="secondary"
                    type="button"
                    className="btn btn-secondary"
                  >
                    Button
                    </Button>{" "}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  )
}

export default UiButtons
