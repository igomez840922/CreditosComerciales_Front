import React, { useState, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Nav,
  NavLink,
  TabContent,
  TabPane,
  NavItem
} from "reactstrap"
import classnames from "classnames"

const WizardSidebar = React.forwardRef((props, ref) => {

  const [activeTab, setActiveTab] = useState(props.activeTab || 0);

  useImperativeHandle(ref, () => ({
    next: () => {
      toggleTab(activeTab + 1);
    },
    prev: () => {
      toggleTab(activeTab - 1);
    },
    selectTab: (index) => {
      toggleTab(index);
    }
  }));

  function toggleTab(tab) {
    if (tab !== props.activeTab ) {
      setActiveTab(tab);
      if( props.onChangeTab ) {
        props.onChangeTab(tab);
      }
      window.scrollTo(0, 0);
    }
  }

  const panelColWidth = 12 - props.sidebarColWidth;

  const sections = props.sections.map((header, index) => (
    <NavItem key={"wizard-sidebar-section-"+index}>
      <NavLink href="#"
        className={classnames({ active: activeTab === index })}
        onClick={ () => { toggleTab(index) } }>
        { header }
      </NavLink>
    </NavItem>
  ));

  return (
    <Row>
      <Col md={props.sidebarColWidth}>
        <Nav pills className="flex-column">{ sections }</Nav>
      </Col>
      <Col md={panelColWidth}>
        <TabContent activeTab={activeTab} className="body">
          { props.children }
        </TabContent>
      </Col>
    </Row>
  )
});

WizardSidebar.propTypes = {
  sections: PropTypes.array.isRequired,
  sidebarColWidth: PropTypes.number,
  onChangeTab: PropTypes.func,
  activeTab: PropTypes.number
};

WizardSidebar.defaultProps = {
  sidebarColWidth: 3,
  activeTab: 0
};

export default WizardSidebar;
