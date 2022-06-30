import moment from 'moment';

export const getBuildDate = (epoch) => {
  const buildDate = moment(epoch).format("DD-MM-YYY HH:MM");
  return buildDate;
};

export function OnlyNumber(event) {
  if (!/[0-9.]/.test(event.key)) {
    event.preventDefault();
  }
}

export function GetMontNumberByName(monthName) {
  if (monthName.indexOf('ENERO') >= 0) {
    return "01";
  }
  if (monthName.indexOf('FEBRERO') >= 0) {
    return "02";
  }
  if (monthName.indexOf('MARZO') >= 0) {
    return "03";
  }
  if (monthName.indexOf('ABRIL') >= 0) {
    return "04";
  }
  if (monthName.indexOf('MAYO') >= 0) {
    return "05";
  }
  if (monthName.indexOf('JUNIO') >= 0) {
    return "06";
  }
  if (monthName.indexOf('JULIO') >= 0) {
    return "07";
  }
  if (monthName.indexOf('AGOSTO') >= 0) {
    return "08";
  }
  if (monthName.indexOf('SEPTIEMBRE') >= 0) {
    return "09";
  }
  if (monthName.indexOf('OCTUBRE') >= 0) {
    return "10";
  }
  if (monthName.indexOf('NOVIEMBRE') >= 0) {
    return "11";
  }
  if (monthName.indexOf('DICIEMBRE') >= 0) {
    return "12";
  }
  return 0;
}

export function GetMontNameByNumber(monthNumber) {
  switch (Number(monthNumber)) {
    case 1: {
      return "ENERO";
    }
    case 2: {
      return "FEBRERO";
    }
    case 3: {
      return "MARZO";
    }
    case 4: {
      return "ABRIL";
    }
    case 5: {
      return "MAYO";
    }
    case 6: {
      return "JUNIO";
    }
    case 7: {
      return "JULIO";
    }
    case 8: {
      return "AGOSTO";
    }
    case 9: {
      return "SEPTIEMBRE";
    }
    case 10: {
      return "OCTUBRE";
    }
    case 11: {
      return "NOVIEMBRE";
    }
    case 12: {
      return "DICIEMBRE";
    }
  }
  return "";
}

export function Capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


/**
 * *Transforma los values de un objecto a Mayúsculas
 * TODO: Altera el argumento de tipo Object directamente
 * @param {Object} dataObject 
 * @return {Promise}
 */
export function convertToUpperCasesData(dataObject) {
  return new Promise(async (resolve) => {
    for (let key in dataObject) {
      typeof dataObject[key] === "string" && (dataObject[key] = dataObject[key].toUpperCase());
      typeof dataObject[key] === "object" && await convertToUpperCasesData(dataObject[key])
    }
    resolve(dataObject);
  });
}