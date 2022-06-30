const date = new Date();
const d = date.getDate();
const m = date.getMonth();
const y = date.getFullYear();

const events = [
  {
    id: 1,
    title: 'All Day Event',
    start: new Date(y, m, 1),
    className: "bg-success text-white",
  },
]

const calenderTypeEvent = [
  {
    id: 1,
    title: "Trámite",
    type: "bg-success",
  },
]

const tramits = [
  {
    id: 1,
    name: "Subject",
    description: "Description 1",
    date: date,
    time: date,
    status: "Pending"
  },
  {
    id: 2,
    name: "Subject 2",
    description: "Description 2",
    date: date,
    time: date,
    status: "Processing"
  },
  {
    id: 3,
    name: "Subject 3",
    description: "Description 3",
    date: date,
    time: date,
    status: "Canceled"
  },
  {
    id: 4,
    name: "Subject 4",
    description: "Description 4",
    date: date,
    time: date,
    status: "Ended"
  },
]

export { calenderTypeEvent, events, tramits }

// default values template

// const events = [
//   {
//     id: 1,
//     title: 'All Day Event',
//     start: new Date(y, m, 1),
//     className: "bg-primary text-white",
//   },
//   {
//     id: 2,
//     title: 'Long Event',
//     start: new Date(y, m, d - 5),
//     end: new Date(y, m, d - 2),
//     className: 'bg-warning text-white'
//   },
//   {
//     id: 3,
//     title: 'Repeating Event',
//     start: new Date(y, m, d - 3, 16, 0),
//     allDay: false,
//     className: 'bg-info text-white'
//   },
//   {
//     id: 4,
//     title: 'Repeating Event',
//     start: new Date(y, m, d + 4, 16, 0),
//     allDay: false,
//     className: 'bg-primary text-white'
//   },
//   {
//     id: 5,
//     title: 'Meeting',
//     start: new Date(y, m, d, 10, 30),
//     allDay: false,
//     className: 'bg-success text-white'
//   },
//   {
//     id: 6,
//     title: 'Lunch',
//     start: new Date(y, m, d, 12, 0),
//     end: new Date(y, m, d, 14, 0),
//     allDay: false,
//     className: 'bg-danger text-white'
//   },
//   {
//     id: 7,
//     title: 'Birthday Party',
//     start: new Date(y, m, d + 1, 19, 0),
//     end: new Date(y, m, d + 1, 22, 30),
//     allDay: false,
//     className: 'bg-success text-white'
//   },
//   {
//     id: 8,
//     title: 'Click for Google',
//     start: new Date(y, m, 28),
//     end: new Date(y, m, 29),
//     url: 'http://google.com/',
//     className: 'bg-dark text-white'
//   },
// ]

// const calenderDefaultCategories = [
//   {
//     id: 1,
//     title: "New Theme Release",
//     type: "bg-success",
//   },
//   {
//     id: 2,
//     title: "My Event",
//     type: "bg-info",
//   },
//   {
//     id: 3,
//     title: "Meet Manager",
//     type: "bg-warning",
//   },
//   {
//     id: 4,
//     title: "Report Error",
//     type: "bg-danger",
//   },
// ]

// export { calenderDefaultCategories, events }