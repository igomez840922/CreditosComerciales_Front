import { BackendServices, CoreServices } from "../../../services";

export const LoadAsyncSelects = async () => {
  const backendServices = new BackendServices();
  const coreServices = new CoreServices();

  const idTypesList =
    await backendServices.consultarCatalogoTipoIdentificacion();

  const countriesList = await coreServices.getPaisesCatalogo();

  const banksList = await coreServices.getBancaCatalogo();

  return {
    idTypesList,
    countriesList,
    banksList,
  };
};
