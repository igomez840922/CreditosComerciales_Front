import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardBody,
  CardTitle,
  Label,
  Row,
  Col,
  Container,
  Button,
  Table,
} from "reactstrap";
import { Alert } from "react-bootstrap";
import Select from "react-select";
import { AvField, AvForm } from "availity-reactstrap-validation";
import { Link } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
// custom imports
import { useManagementModal } from "./Hooks/useManagementModal";
import ModalData from "../../../components/Common/ModalData";
import { useForm } from "./Hooks/useForm";
import { optionsPersonType, optionsIdType } from "./dummy/optionsSelect";

const initialFormSearchClient = {
  idnumber: "",
  personType: "Natural",
};

const CardSearchClient = () => {
  // console.log("props", props.showModal)
  const { t, i18n } = useTranslation();

  const {
    form,
    dataClient,
    isSearching,
    showAlert,
    handleOnChange,
    handleOnSubmit,
    handleSearchClient,
  } = useForm(initialFormSearchClient);

  const {
    hdlTest,
    showModal,
    showModalNewClient,
    dataPrefillClient,
    hdlCkShowModal,
    hdlCkCloseModal,
    hdlCkShowModalNewClient,
    hdlCkCloseModalNewClient,
  } = useManagementModal();

  return (
    <Container>
      <AvForm>
        {/* <AvForm onSubmit={handleSubmitSearchClient}> */}
        <Row>
          <Col md={6} lg={3}>
            <div className="">
              <Label htmlFor="idnumber">{t("IdNumber")}</Label>
              <AvField
                id="idnumber"
                name="idnumber"
                options={optionsIdType}
                value={form.idnumber}
                validate={{ required: { value: true } }}
                errorMessage={t("Required Field")}
                onChange={handleOnChange}
              />
            </div>
          </Col>
          <Col md={6} lg={3}>
            <div className="mb-3">
              <Label htmlFor="personType">{t("PersonType")}</Label>
              <Select
                id="personType"
                name="personType"
                options={optionsPersonType}
                defaultValue={optionsPersonType[0]}
                value={optionsPersonType.find(
                  (option) => option.value === form.personType.value
                )}
                onChange={handleOnChange}
              />
            </div>
          </Col>
          <Col md={6} lg={3} className="mt-4">
            <div className="">
              <Button
                color="success"
                type="submit"
                className="mt-1"
                onClick={handleSearchClient}
              >
                <i className="mdi mdi-file-find mdi-12px me-2"></i>
                {t("Search")}
              </Button>
            </div>
          </Col>
          <Col md={6} lg={3} className="mt-4">
            <div className="">
              <Button
                color="primary"
                type="button"
                className="mt-1 float-end"
                onClick={hdlCkShowModalNewClient}
              >
                <i className="mdi mdi-account-plus mdi-12px me-2"></i>
                {t("NewClient")}
              </Button>
            </div>
          </Col>
        </Row>
      </AvForm>
      {dataClient.length !== 0 ? (
        <div className="table-responsive styled-table-div mt-5">
          <Table className="table table-striped table-hover styled-table table">
            <thead>
              <tr>
                <th>{t("Client Number")}</th>
                <th>{t("Client Name")}</th>
                <th>{t("ID Type")}</th>
                <th>{t("ID Number")}</th>
                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {dataClient.map((data, key) => (
                <tr key={key}>
                  <td>{data.id}</td>
                  <td>{data.clientname}</td>
                  <td>{data.idtype}</td>
                  <td>{data.idnumber}</td>
                  <td>
                    <Link
                      to={"#"}
                      onClick={() => hdlTest(dataClient)}
                      title={t("Select")}
                    >
                      <i className="mdi mdi-check-box-multiple-outline mdi-24px"></i>
                    </Link>
                  </td>
                  {/* <td><i className="mdi mdi-check-box-multiple-outline mdi-24px"></i></td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <Alert show={showAlert} variant={"warning"} className={"mt-2"}>
          <p style={{ color: "#000000", margin: 0 }}>
            {t("Client doesn't exist")}
          </p>
        </Alert>
      )}
      <LoadingOverlay
        active={isSearching}
        // active={isSearching}
        // spinner={<BounceLoader />}
        spinner={true}
        text={t("Searching client")}
      >
        {/* <p>Some content or children or something.</p> */}
      </LoadingOverlay>
      <ModalData
        titleModal={t("Quoter")}
        show={showModalNewClient}
        toggle={hdlCkCloseModalNewClient}
        data={dataPrefillClient}
      />
    </Container>
  );
};

export default CardSearchClient;
