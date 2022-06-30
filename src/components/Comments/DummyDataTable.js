export const date = new Date();
export const d = date.getDate();
export const m = date.getMonth();
export const y = date.getFullYear();

export const dataTable = [
  {
    date: `${d}-${m}-${y}`,
    comment: 'Comment',
    process: 'process',
    activity: 'activity',
    estatus: 'estatus',
    user: 'user',
  },
  // {
  //   date: new Date(y, m, 1),
  //   comment: 'Comment',
  //   process: 'process',
  //   activity: 'activity',
  //   estatus: 'estatus',
  //   user: 'user',
  // }, 
  // {
  //   date: new Date(y, m, d - 5),
  //   comment: 'Comment',
  //   process: 'process',
  //   activity: 'activity',
  //   estatus: 'estatus',
  //   user: 'user',
  // },
  // {
  //   date: new Date(y, m, d - 3, 16, 0),
  //   comment: 'Comment',
  //   process: 'process',
  //   activity: 'activity',
  //   estatus: 'estatus',
  //   user: 'user',
  // },
  // {
  //   date: new Date(y, m, d, 10, 30),
  //   comment: 'Comment',
  //   process: 'process',
  //   activity: 'activity',
  //   estatus: 'estatus',
  //   user: 'user',
  // }
];

export const columns = [
  {
    dataField: 'date',
    text: 'Date'
  },
  {
    dataField: 'comment',
    text: 'Comment'
  },
  {
    dataField: 'process',
    text: 'Process'
  },
  {
    dataField: 'activity',
    text: 'Activity'
  },
  {
    dataField: 'estatus',
    text: 'Estatus'
  },
  {
    dataField: 'user',
    text: 'User'
  },
];

// comments section
export const commentsDB =
{
  "comments": [
    {
      "user": "Brian Selter",
      "textComment": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      "atStartComment": "20 May 2022",
      "responses": [
        {
          "user": "Jhon Doe",
          "textComment": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          "atStartComment": "22 May 2022",
        }
      ]
    },
    {
      "user": "John Defoe",
      "textComment": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      "atStartComment": "23 May 2022",
      "responses": [
        {
          "user": "Mark Jobs",
          "textComment": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          "atStartComment": "24 May 2022",
        },
        {
          "user": "Steve Zucker",
          "textComment": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          "atStartComment": "1h ago",
        }
      ]
    },
  ],
}
