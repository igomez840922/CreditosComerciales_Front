import React, { useState, useEffect } from "react"
import { translationHelpers } from "../../../helpers"

import {
  Row,
  Col,
  Button
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import FormFilter from "./inbox/FormFilter"
import SearchResults from "./inbox/SearchResults"

const InboxPage = (props) => {

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // load report
    fetchInbox();
  }, []);

  function fetchInbox() {
    setSearchResults([
      {
        date: '23-SEPT-2021',
        procedure: 1000,
        client: {
          id: '321321',
          name: 'Grupo Tova SA'
        },
        proposal: {
          type: 'Renovación'
        },
        preclassifcation: 'Medio',
        classification: 'Medio Alto',
        analyst: {
          name: 'Elibeth'
        }
      }
    ])
  }

  function handleSearch(criteria) {
    console.log('search', criteria);
  }

  const [n] = translationHelpers('navigation');

  return (
    <React.Fragment>

      <div className="page-content">

        <Breadcrumbs title={ n("Commercial Credit") } breadcrumbItem={ n("Inbox") } />

        <Row>
          <Col xl="12">
            <FormFilter onSearch={ handleSearch } />
          </Col>
        </Row>

        { searchResults.length > 0 && (
        <Row>
          <Col xl="12">
            <SearchResults items={ searchResults } />
          </Col>
        </Row>
        )}

      </div>

    </React.Fragment>
  );

}


export default InboxPage;
