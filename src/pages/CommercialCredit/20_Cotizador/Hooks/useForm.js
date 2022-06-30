import { useState } from "react";
import { SearchClient } from "../SearchClient";

export const useForm = (initialStateForm) => {
  const [form, setForm] = useState(initialStateForm);
  const [dataClient, setDataClient] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleOnChange = (evt, selectFields) => {
    const name = evt?.target ? evt.target.name : selectFields.name;

    const value = evt?.target ? evt.target.value : evt.value;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleOnSubmit = () => {
    console.group("handle submit from useForm");
    console.groupEnd();
  };

  const handleSearchClient = async () => {
    setIsSearching(true);
    const respDataClient = await SearchClient(form);
    setIsSearching(false);
    setShowAlert(true);
    setDataClient(respDataClient);
    console.groupEnd();
  };

  return {
    form,
    dataClient,
    isSearching,
    showAlert,
    handleOnChange,
    handleOnSubmit,
    handleSearchClient,
  };
};
