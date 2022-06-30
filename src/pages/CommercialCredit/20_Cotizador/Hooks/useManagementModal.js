import { useState } from "react";
import { useTranslation } from "react-i18next";

export const useManagementModal = () => {
  // hooks
  const { t, i18n } = useTranslation();
  // custom hooks
  const [showModal, setShowModal] = useState(false);
  const [showModalQuoter, setShowModalQuoter] = useState(false);
  const [showModalNewClient, setShowModalNewClient] = useState(false);
  const [dataPrefillClient, setDataPrefillClient] = useState([]);

  const hdlCkShowModal = () => {
    setShowModal(true);
  };

  const hdlCkCloseModal = () => {
    setShowModal(false);
  };

  const hdlCkShowModalNewClient = () => {
    setShowModalNewClient(true);
  };

  const hdlCkCloseModalNewClient = () => {
    setShowModalNewClient(false);
    setDataPrefillClient([]);
  };

  const hdlCkShowModalQuoter = () => {
    console.log("handle click!");
    setShowModalQuoter(true);
  };

  const hdlCkCloseModalQuoter = () => {
    setDataPrefillClient([]);
    setShowModalQuoter(false);
  };

  const hdlTest = (data) => {
    // renameKeys({ partyType: "typePerson" }, data);
    helperChangeDataClient(data[0]);
    setDataPrefillClient(data);
    hdlCkShowModalNewClient();
  };

  const helperChangeDataClient = (dataClient) => {
    dataClient["partyType"] =
      dataClient["partyType"] === "1" || dataClient["partyType"] === "Natural"
        ? "Natural"
        : "Juridico";
  };

  const renameKeys = (keysMap, obj) =>
    Object.keys(obj).reduce(
      (acc, key) => ({
        ...acc,
        ...{ [keysMap[key] || key]: obj[key] },
      }),
      {}
    );

  return {
    hdlTest,
    showModal,
    showModalNewClient,
    showModalQuoter,
    dataPrefillClient,
    hdlCkShowModal,
    hdlCkCloseModal,
    hdlCkShowModalNewClient,
    hdlCkCloseModalNewClient,
    hdlCkShowModalQuoter,
    hdlCkCloseModalQuoter,
  };
};
