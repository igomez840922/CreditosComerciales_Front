import i18next from "i18next"

export const translationHelper = (id) => {
  return (key, args) => {
    return i18next.t(id + ':' + key, args);
  }
};

export const translationHelpers = (...keys) => {
  return keys.map(translationHelper);
};

