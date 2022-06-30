import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { isEmpty } from "lodash"
import {
  Button,
  Card,
  CardBody,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap"
import { AvField, AvForm } from "availity-reactstrap-validation"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin, { Draggable } from "@fullcalendar/interaction"
import BootstrapTheme from "@fullcalendar/bootstrap"
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import {
  addNewEvent,
  deleteEvent,
  getCategories,
  getEvents,
  updateEvent,
  getTramit,
} from "../../store/actions"
import DeleteModal from "./DeleteModal"
//css
import "@fullcalendar/bootstrap/main.css"

const Calender = props => {
  const { t, i18n } = useTranslation();

  const { events, categories, onGetCategories, onGetEvents, onGetTramit } = props
  const [modal, setModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [modalcategory, setModalcategory] = useState(false)
  const [event, setEvent] = useState({})
  const [selectedDay, setSelectedDay] = useState(0)
  const [isEdit, setIsEdit] = useState(false)

  const tramitOptionsTest = [
    {
      id: 1,
      title: "Trámite",
      type: "bg-success",
    },
    {
      id: 2,
      title: "Trámite 2",
      type: "bg-success",
    },
    {
      id: 3,
      title: "Trámite 3",
      type: "bg-success",
    },
    {
      id: 4,
      title: "Trámite 4",
      type: "bg-success",
    },
    {
      id: 5,
      title: "Trámite 5",
      type: "bg-success",
    },
  ]
  
  useEffect(() => {
    onGetCategories()
    onGetEvents()
    onGetTramit()
    new Draggable(document.getElementById("external-events"), {
      itemSelector: ".external-event",
    })
  }, [onGetCategories, onGetEvents, onGetTramit]);
  /**
   * Handling the modal state
   */
  const toggle = () => {
    setModal(!modal)
    if (!modal && !isEmpty(event) && !isEdit) {
      setTimeout(() => {
        setEvent({})
        setIsEdit(false)
      }, 500)
    }
  }

  const toggleCategory = () => {
    setModalcategory(!modalcategory)
  }

  /**
   * Handling date click on calendar
   */
  const handleDateClick = arg => {
    setSelectedDay(arg)
    toggle()
  }

  /**
   * Handling click on event on calendar
   */
  const handleEventClick = arg => {
    const event = arg.event
    setEvent({
      id: event.id,
      title: event.title,
      title_category: event.title_category,
      start: event.start,
      className: event.classNames,
      category: event.classNames[0],
      event_category: event.classNames[0],
    })
    setIsEdit(true)
    toggle()
  }

  /**
   * Handling submit event on event form
   */
  const handleValidEventSubmit = (e, values) => {
    const { onAddNewEvent, onUpdateEvent } = props
    if (isEdit) {
      const updateEvent = {
        id: event.id,
        title: values.title,
        classNames: values.category + " text-white",
        start: event.start,
      }
      // update event
      onUpdateEvent(updateEvent)
    } else {
      const newEvent = {
        id: Math.floor(Math.random() * 100),
        title: values["title"],
        start: selectedDay ? selectedDay.date : new Date(),
        className: values.category + " text-white",
      }
      // save new event
      onAddNewEvent(newEvent)
    }
    setSelectedDay(null)
    toggle()
  }

  const handleValidEventSubmitcategory = (event, values) => {
    const { onAddNewEvent } = props
    const newEvent = {
      id: Math.floor(Math.random() * 100),
      title: values["title_category"],
      start: selectedDay ? selectedDay.date : new Date(),
      className: values.event_category + " text-white",
    }
    // save new event
    onAddNewEvent(newEvent)
    toggleCategory()
  }

  /**
   * On delete event
   */
  const handleDeleteEvent = () => {
    const { onDeleteEvent } = props
    onDeleteEvent(event)
    setDeleteModal(false)
    toggle()
  }

  /**
   * On category darg event
   */
  const onDrag = (event) => {
    event.preventDefault()
  }

  /**
   * On calendar drop event
   */
  const onDrop = event => {
    const { onAddNewEvent } = props
    const draggedEl = event.draggedEl
    const newEvent = {
      id: Math.floor(Math.random() * 100),
      title: draggedEl.innerText,
      start: event.date,
      className: draggedEl.className,
    }
    onAddNewEvent(newEvent)
  }

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteEvent}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">

        {/* Render Breadcrumb */}
        <Breadcrumbs title={t("Menu")} breadcrumbItem={t("Calendar")} />
        <Row>
          <Col xs={12}>
            <Row className="mb-4">
              <Col lg={3}>
                <Card className="h-100 mb-lg-0">
                  <CardBody>
                    <Button
                      color="primary"
                      className="btn font-16 btn-primary w-100"
                      onClick={toggleCategory}
                    >
                      <i className="mdi mdi-plus-circle-outline me-1" />
                      {t("Create new event")}
                    </Button>
                    <div id="external-events">
                      <br />
                      <p className="text-muted">
                        {t("Drag and drop your event or click in the calendar")}
                      </p>
                      {categories &&
                        categories.map((category, i) => (
                          <div
                            className={`${category.type} external-event fc-event text-white`}
                            key={"cat-" + category.id}
                            draggable
                            onDrag={event => onDrag(event, category)}
                          >
                            <i className="mdi mdi-checkbox-blank-circle font-size-11 me-2" />
                            {category.title}
                          </div>
                        ))}
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col className="col-lg-9 app-calendar">
                <Card className="mb-lg-0">
                  <CardBody>
                    <FullCalendar
                      plugins={[
                        BootstrapTheme,
                        dayGridPlugin,
                        interactionPlugin,
                      ]}
                      slotDuration={"00:15:00"}
                      handleWindowResize={true}
                      themeSystem="bootstrap"
                      headerToolbar={{
                        left: t("prev,next today"),
                        center: "title",
                        right: "dayGridMonth,dayGridWeek,dayGridDay",
                      }}
                      events={events}
                      editable={true}
                      droppable={true}
                      selectable={true}
                      dateClick={handleDateClick}
                      eventClick={handleEventClick}
                      drop={onDrop}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
            {/* New/Edit event modal */}
            <Modal isOpen={modal} className={props.className}>
              <ModalHeader toggle={toggle} tag="h4">
                {!!isEdit ? t("Edit event") : t("Add event")}
              </ModalHeader>
              <ModalBody>
                <AvForm onValidSubmit={handleValidEventSubmit}>
                  <Row form>
                    <Col className="col-12 mb-3">
                      <AvField
                        name="title"
                        label={t("Event name")}
                        type="text"
                        errorMessage="Invalid name"
                        validate={{
                          required: { value: true },
                        }}
                        value={(event && event.title) ? event.title : ""}
                      />
                    </Col>
                    <Col className="col-12 mb-3">
                      <AvField
                        type="select"
                        name="category"
                        label={t("Select tramit")}
                        validate={{
                          required: { value: true },
                        }}
                        value={event ? event.category : "bg-primary"}
                      >
                        {
                          tramitOptionsTest.map((tramitEvt) => (
                            <option
                              key={`tram-${tramitEvt.id}`}
                            >
                              {tramitEvt.title}
                            </option>
                          ))
                        }
                      </AvField>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="text-end">
                        <button
                          type="button"
                          className="btn btn-light me-2"
                          onClick={toggle}
                        >
                          {t("Close")}
                        </button>
                        {!!isEdit && (
                          <button
                            type="button"
                            className="btn btn-danger me-2"
                            onClick={() => setDeleteModal(true)}
                          >
                            {t("Delete")}
                          </button>
                        )}
                        <button
                          type="submit"
                          className="btn btn-success save-event"
                        >
                          {t("Save")}
                        </button>
                      </div>
                    </Col>
                  </Row>
                </AvForm>
              </ModalBody>
            </Modal>
            <Modal
              isOpen={modalcategory}
              toggle={toggleCategory}
              className={props.className}
            >
              <ModalHeader toggle={toggleCategory} tag="h4">
                {t("Add event")}
              </ModalHeader>
              <ModalBody>
                <AvForm
                  onValidSubmit={handleValidEventSubmitcategory}
                >
                  <Row form>
                    <Col className="col-12 mb-3">
                      <AvField
                        name="title_category"
                        label={t("Event name")}
                        type="text"
                        errorMessage="Invalid name"
                        validate={{
                          required: { value: true },
                        }}
                        value={
                          event.title_category
                            ? event.title_category
                            : ""
                        }
                      />
                    </Col>
                    <Col className="col-12 mb-3">
                      <AvField
                        type="select"
                        name="event_category"
                        label={t("Choose a tramit")}
                        value={
                          event ? event.event_category : "bg-success"
                        }
                      >
                        {
                          tramitOptionsTest.map((tramitEvt) => (
                            <option
                              key={`tram-${tramitEvt.id}`}
                              value={tramitEvt.id}
                            >
                              {tramitEvt.title}
                            </option>
                          ))
                        }
                      </AvField>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="text-right">
                        <button
                          type="button"
                          className="btn btn-light me-2"
                          onClick={toggleCategory}
                        >
                          {t("Close")}
                        </button>
                        <button
                          type="submit"
                          className="btn btn-success save-event"
                        >
                          {t("Save")}
                        </button>
                      </div>
                    </Col>
                  </Row>
                </AvForm>
              </ModalBody>
            </Modal>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  )
}
Calender.propTypes = {
  events: PropTypes.array,
  categories: PropTypes.array,
  tramits: PropTypes.array,
  className: PropTypes.string,
  onGetEvents: PropTypes.func,
  onAddNewEvent: PropTypes.func,
  onUpdateEvent: PropTypes.func,
  onDeleteEvent: PropTypes.func,
  onGetCategories: PropTypes.func,
  onGetTramit: PropTypes.func,
}
const mapStateToProps = ({ calendar }) => ({
  events: calendar.events,
  categories: calendar.categories,
  tramits: calendar.tramits,
  isEventUpdated: calendar.isEventUpdated
})
const mapDispatchToProps = dispatch => ({
  onGetEvents: () => dispatch(getEvents()),
  onGetCategories: () => dispatch(getCategories()),
  onGetTramit: () => dispatch(getTramit()),
  onAddNewEvent: event => dispatch(addNewEvent(event)),
  onUpdateEvent: event => dispatch(updateEvent(event)),
  onDeleteEvent: event => dispatch(deleteEvent(event)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Calender)