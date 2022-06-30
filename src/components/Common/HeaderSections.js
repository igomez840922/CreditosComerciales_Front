import React from "react"
import PropTypes from 'prop-types'
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Input,
  CardHeader,
  CardTitle,
  InputGroup,
  Table,
  CardFooter
} from "reactstrap"
import { translationHelpers } from "../../helpers";

const HeaderSections = props => {
  const S_seccions = {
    "backgroundColor": "#eee",
    "color": '#187055',
    "padding": '2px',
    "borderRadius": '2px',
    "fontSize": '18px',
    "display": 'flex',
    "justifyContent": 'center',
    "flexDirection": 'column',
    "alignItems": 'center',
  };

  const t = props.t ?? translationHelpers('translation')[0];


  return (
    <Col>
      <div className="mb-3" style={S_seccions}>
        <span>{t(props.title)}</span>
        {props.descri && <p className="card-title-desc m-0">{props.t(props.descri)}</p>}
      </div>

    </Col>
  )
}

HeaderSections.propTypes = {
  title: PropTypes.string
}

export default HeaderSections
