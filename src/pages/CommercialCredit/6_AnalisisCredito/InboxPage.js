import React, { useState } from "react"
import { translationHelpers } from "../../../helpers"

import {
  Row,
  Col,
  Button,
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
        date: '23-SEPT-2021',
        bank: {
          name: 'PYME'
        },
        client: {
          id: '321321',
          name: 'Grupo Tova SA'
        },
        proposal: {
          type: 'Renovación'
        },
        preapproved: true,
        analyst: {
          name: 'Carolina Herrera'
        },
        status: 'A Tiempo'
      },
      {
        id: 1020,
        date: '23-SEPT-2021',
        bank: {
          name: 'PYME'
        },
        client: {
          id: '321321',
          name: 'Grupo Tova SA'
        },
        proposal: {
          type: 'Renovación'
        },
        preapproved: true,
        analyst: {
          name: 'Carolina Herrera'
        },
        status: 'A Tiempo'
      },
      {
        id: 1033,
        date: '23-SEPT-2021',
        bank: {
          name: 'PYME'
        },
        client: {
          id: '321321',
          name: 'Grupo Tova SA'
        },
        proposal: {
          type: 'Renovación'
        },
        preapproved: true,
        analyst: {
          name: 'Carolina Herrera'
        },
        status: 'A Tiempo'
      }
    ]);
  }

  const [n, c] = translationHelpers('navigation', 'common');

  return (
    <React.Fragment>

      <div className="page-content">

        <Breadcrumbs title={ n("Credit Analysis") } breadcrumbItem={ n("Inbox") } />

        <Card>
            <CardBody>
            <FormFilter onSearch={ handleSearch } />
                {  searchResults.length > 0 && (
                    <SearchResults items={ searchResults } />
                )}
            </CardBody>
        </Card>

      </div>

    </React.Fragment>
  );

}


export default InboxPage;
