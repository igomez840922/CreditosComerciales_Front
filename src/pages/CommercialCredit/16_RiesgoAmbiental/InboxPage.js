import React, { useState } from "react"
import { translationHelpers } from "../../../helpers"

import {
  Row,
  Col,
  Card,
  CardBody
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import FormFilter from "./inbox/FormFilter"
import SearchResults from "./inbox/SearchResults"

const InboxPage = (props) => {

  const [searchResults, setSearchResults] = useState([]);

  async function handleSearch(criteria) {
    console.log('search', criteria);
    const results = await fetchInbox(criteria);
    setSearchResults(results);
  }

  function fetchInbox(criteria) {
    return Promise.resolve([
      {
        id: 1010,
        order: 1,
        date: '23-SEPT-2021',
        procedure: '1000',
        client: {
          id: '321321',
          name: 'Grupo Tova SA'
        },
        requestType: 'Renovación',
        preclassification: 'Medio',
        classification: 'Medio Alto'
      },
      {
        id: 1020,
        order: 2,
        procedure: '1001',
        date: '23-SEPT-2021',
        client: {
          id: '321321',
          name: 'Grupo Tova SA'
        },
        requestType: 'Nueva',
        preclassification: 'Alto',
        classification: 'Alto'
      }
    ]);
  }

  const [n, c] = translationHelpers('navigation', 'common');

  return (
    <React.Fragment>

      <div className="page-content">

        <Breadcrumbs title={ n("Environmental Risk") } breadcrumbItem={ n("Inbox") } />

        <Card>
      <CardBody>
      <FormFilter onSearch={ handleSearch } />
        
        { searchResults.length > 0 && (
        <SearchResults items={ searchResults } />
        )}
     
      </CardBody>
    </Card>

   

      </div>

    </React.Fragment>
  );

}


export default InboxPage;
