import { CoreServices } from "../../../services";

export const SearchClient = async (paramSearch) => {
  const { personType: PartyType, idnumber: PartyId } = paramSearch;

  console.group("Working searchClient");
  paramSearch["PartyId"] = paramSearch.idnumber;
  paramSearch["PartyType"] = paramSearch.personType;

  console.info({
    PartyType,
    PartyId,
  });
  console.groupEnd();

  const coreServices = new CoreServices();
  const dataClient = await coreServices
    .getPartiesInformation({
      PartyId,
      PartyType,
    })
    .then((data) => {
      return data;
    })
    .catch();
  // console.log("result:", result);

  return dataClient;
};
