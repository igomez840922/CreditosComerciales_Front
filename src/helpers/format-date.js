import dateFormat, { masks } from "dateformat";

export const formatDate = (date, format = 'DD/MM/YYYY') => {
  return dateFormat(date, format);
}
