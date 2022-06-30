import React, { useState, useContext } from "react"
import PropTypes from 'prop-types';
import { translationHelpers, formatCurrency } from '../../helpers';
import CreditProposalContext from './CreditProposalContext';
import { Link, useLocation } from "react-router-dom"
import {
  Table,
  Card,
  CardBody,
  Button
} from "reactstrap"

import FormNewFacility from "./FormNewFacility";
import ModalFacilityDetails from "./ModalFacilityDetails";
import { AvForm, AvGroup, AvField, AvFeedback } from "availity-reactstrap-validation"

// static data
import listaFacilidades from "../../api/bpm/propuestacredito/facilidades";
import { Facilidad } from "../../models/PropuestaCredito";
import { BackendServices, CoreServices } from "../../services";
import HeaderSections from "../Common/HeaderSections";


const FacilityList = React.forwardRef((props, ref) => {

  const [formValid, setFormValid] = useState(false);

  const [t, c] = translationHelpers('commercial_credit', 'common');
  const context = useContext(CreditProposalContext);
  const [displayModalFacilityDetails, setDisplayModalFacilityDetails] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

  function displayFacilityDetails(facility) {
    // setSelectedFacility(facility);
    const dummyFacility = Facilidad.fromJson(listaFacilidades[0]);
    setSelectedFacility(dummyFacility);
    setDisplayModalFacilityDetails(true);
  }

  function toggleFacilityDetailsModal() {
    setDisplayModalFacilityDetails(!displayModalFacilityDetails);
  }

  function handleSaveNewFacility(newFacility) {
    props.onSaveFacility(newFacility);
  }

  const { editMode, items } = props;
  const dataRows = items.map((item, index) => (
    <tr key={'row-' + index}>
      <td>{item.AcctMember[0].PartyName.ShortName}</td>
      <td>{item.ProductDesc}</td>
      <td>{item.AcctBal[0].BalType}</td>
      <td className="text-end">{formatCurrency('$', item.AcctOpeningInfo.InitialAmt.Amt, 2)}</td>
      <td className="text-end">{formatCurrency('$', item.AcctBal[0].CurAmt.Amt, 2)}</td>
      <td className="text-end">{formatCurrency('$', item.AcctBal[0].CurAmt.Amt, 2)}</td>
      <td className="text-end">{formatCurrency('$', item.AcctBal[0].CurAmt.Amt, 2)}</td>
      <td className="text-end">
        <Button type="button" color="link" className="btn btn-link" onClick={() => { displayFacilityDetails(item) }}><i className="mdi mdi-eye mdi-24px"></i></Button>
      </td>
    </tr>)
  );
  function handleSubmit(event, errors, values) {
    event.preventDefault();
    if (event.target.id !== 'formCreditProposal') {
      return;
    }
    setFormValid(true);
  }
  return (
    <React.Fragment>
      {/* <AvForm id="formFacilidades" className="needs-validation" onSubmit={handleSubmit}> */}

      <>
        <CardBody>
          <HeaderSections title={props.title} t={t}></HeaderSections>

          <p className="card-title-desc"></p>
          <Table className="table mt-1" responsive>
            <thead className="table-light">
              <tr>
                <th>{t("Debtor")}</th>
                <th>{t("Facility Type")}</th>
                <th>{t("Proposal")}</th>
                <th className="text-end">{t("Approved Risk")}</th>
                <th className="text-end">{t("Balance / Usage")}</th>
                <th className="text-end">{t("Proposed Risk")}</th>
                <th className="text-end">{t("Variation")}</th>
                {/* <th><Link className="float-end"><i className="mdi mdi-plus-box-multiple-outline mdi-24px"></i></Link></th> */}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dataRows}
            </tbody>
          </Table>
        </CardBody>

      </>
      {/* </AvForm> */}


      {selectedFacility && (
        <ModalFacilityDetails isOpen={displayModalFacilityDetails} toggle={toggleFacilityDetailsModal} facility={selectedFacility} />
      )}

    </React.Fragment>

  );
});

FacilityList.propTypes = {
  items: PropTypes.array.isRequired,
  editMode: PropTypes.bool,
  onSaveFacility: PropTypes.func
};

FacilityList.defaultProps = {
  items: [],
  editMode: false
};

export default FacilityList;
