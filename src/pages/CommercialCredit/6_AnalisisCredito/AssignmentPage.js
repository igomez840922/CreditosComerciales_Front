import React, { useState } from "react"
import { translationHelpers } from "../../../helpers"

import {
  Card,
  CardBody
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import FormFilter from "./assignment/FormFilter"
import SearchResults from "./assignment/SearchResults"


const InboxPage = (props) => {

  const [searchResults, setSearchResults] = useState([]);

  async function handleSearch(criteria) {
    console.log('search', criteria);
    const results = await searchAnalyst(criteria);
    setSearchResults(results);
  }

  function searchAnalyst(criteria) {
    return Promise.resolve([
      {
        name: 'Cristian Naranjo',
        taskCount: 3
      },
      {
        name: 'Lisdaris Valdes',
        taskCount: 3
      },
      {
        name: 'Cristian Naranjo',
        taskCount: 3
      },
      {
        name: 'Lisdaris Valdes',
        taskCount: 3
      }
    ]);
  }

  const [n, t, c] = translationHelpers('navigation', 'credit_analysis', 'common');

  return (
    <React.Fragment>

      <div className="page-content">

        <Breadcrumbs title={ n("Credit Analysis") } breadcrumbItem={ t("Assignment") } />

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
