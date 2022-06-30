// import React, { useState } from "react"
// import PropTypes from 'prop-types';

// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   TabPane,
//   Row,
//   Col
// } from "reactstrap"

// import { translationHelpers } from "../../helpers";

// // UI Components
// import CustomerSection from "./facilities/facilityDetails/CustomerSection";
// import CommissionSection from "./facilities/facilityDetails/CommissionSection";
// import DisbursementSection from "./facilities/facilityDetails/DisbursementSection";
// import InterestRateSection from "./facilities/facilityDetails/InterestRateSection";
// import LtvSection from "./facilities/facilityDetails/LtvSection";
// import ProposalSection from "./facilities/facilityDetails/ProposalSection";
// import SuretiesSection from "./facilities/facilityDetails/SuretiesSection";
// import TermsSection from "./facilities/facilityDetails/TermsSection";
// import WarrantsSection from "./facilities/facilityDetails/WarrantsSection";


// const ModalListaFacilidades = (props) => {

//   const [t, c] = translationHelpers('commercial_credit', 'common');
//   const facility = props.facility;
//   console.log('facility details', facility);

//   const sections = [
//     t('General'),
//     t('Proposal'),
//     t('Interest Rate'),
//     t('Commision'),
//     t('Terms'),
//     t('Disbursement'),
//     t('Warrants'),
//     t('LTV'),
//     t('Sureties'),
//     t('FinancialConditions'),
//     t('AmbientalRisk'),
//     t('FinantialCovenant'),
//     t('LegalDocumentation'),
//     t('OtherConditions'),
//     t('CreditRisk'),
//     t('Provision')
//   ];

//   return (
//     <Modal isOpen={ props.isOpen }
//       toggle={ props.toggle }
//       centered={true}
//       size="lg">

//       <ModalHeader toggle={ props.toggle } color="primary">{ t("Facility") }</ModalHeader>

//       <ModalBody>
//         <Row className="mt-3">
//           <Col xl="12">
//             <CustomerSection facility={ facility } />
//           </Col>
//         </Row>
//         <Row className="mt-3">
//           <Col xl="12">
//             <ProposalSection facility={ facility } />
//           </Col>
//         </Row>
//         <Row className="mt-3">
//           <Col xl="12">
//             <InterestRateSection facility={ facility } />
//           </Col>
//         </Row>
//         <Row className="mt-3">
//           <Col xl="12">
//             <CommissionSection facility={ facility } />
//           </Col>
//         </Row>
//         <Row className="mt-3">
//           <Col xl="12">
//             <TermsSection facility={ facility } />
//           </Col>
//         </Row>
//         <Row className="mt-3">
//           <Col xl="12">
//             <DisbursementSection facility={ facility } />
//           </Col>
//         </Row>
//         <Row className="mt-3">
//           <Col xl="12">
//             <WarrantsSection facility={ facility } />
//           </Col>
//         </Row>
//         <Row className="mt-3">
//           <Col xl="12">
//             <LtvSection facility={ facility } />
//           </Col>
//         </Row>
//         <Row className="mt-3">
//           <Col xl="12">
//             <SuretiesSection facility={ facility } />
//           </Col>
//         </Row>
//       </ModalBody>
//     </Modal>
//   );
// };

// ModalListaFacilidades.propTypes = {
//   isOpen: PropTypes.bool,
//   toggle: PropTypes.func,
//   facility: PropTypes.object.isRequired
// };

// export default ModalListaFacilidades;
