export default class Currency {
    format(number) {
        if (number?.match) {
            if (number?.match(/\./g)?.length > 1) {
                number = number?.split(".")[0] + "." + number?.split(".")[1];
            }
            if (number?.match(/\./g)?.length == 1) {
                // console.log("fase 3");
                let dato = number?.split(".")[1].split("")
                let cadena = "";
                if (dato.length > 0) {
                    // console.log("fase 4");
                    cadena = cadena + dato[0];
                    if (dato[1]) {
                        // console.log("fase 5");
                        cadena = cadena + dato[1];
                    }
                }
                number = number?.split(".")[0] + "." + cadena;
            }
        }
        return (number).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

    }
    getRealValue(x) {
        return x.toString().replace(/,/g, "");
    }
    formatTable(x) {
        return parseFloat(x).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }
    formatPercent(number, event) {
        event && event.preventDefault();
        number = `${number}`;
        // console.log("🚀 ~ file: currency.js ~ line 12 ~ Currency ~ formatPercent ~ number", number.split(''))
        if (!/^[0-9.%]*$/.test(number) || number.match(/\./g)?.length > 1) {
            if (number.match(/\./g)?.length > 1) {
                number = number.split(".")[0] + "." + number.split(".")[1];
                // console.log("fase 0");
            } else {
                if (number.match(/\./g)) {
                    // console.log("fase 1");
                    number = number.split(".")[0].split('')?.filter(Number)?.join('') + '.' + number.split(".")[1].split('')?.filter(Number)?.join('');
                } else {
                    // console.log("fase 2");
                    number = number.split('')?.filter(Number)?.join('');
                }
            }
        } else {
            if (number.match(/\./g)?.length == 1) {
                // console.log("fase 3");
                let dato = number.split(".")[1].split("")
                let cadena = "";
                if (dato.length > 0) {
                    // console.log("fase 4");
                    cadena = cadena + dato[0];
                    if (dato[1]) {
                        // console.log("fase 5");
                        cadena = cadena + dato[1];
                    }
                }
                number = number.split(".")[0] + "." + cadena;


            }
        }
        return number + "%";
    }
    getRealPercent(x) {
        return x.toString().replace(/%/g, "");
    }
    orderByJSON(arr, key, order) {
        return arr.sort(function (a, b) {
            switch (order) {
                case 'desc':
                    if (b[key] > a[key]) {
                        return 1;
                    }
                    if (b[key] < a[key]) {
                        return -1;
                    }
                    return 0;
                    break;
                case 'asc':
                    if (b[key] < a[key]) {
                        return 1;
                    }
                    if (b[key] > a[key]) {
                        return -1;
                    }
                    return 0;
                    break;
                default:
                    if (b[key] > a[key]) {
                        return 1;
                    }
                    if (b[key] < a[key]) {
                        return -1;
                    }
                    return 0;
                    break;
            }

        })
    }
    groupBy(collections, property) {
        var i = 0, val, index,
            values = [], result = [];
        for (let collection of collections) {
            val = collection[property];
            index = values.indexOf(val);
            if (index > -1)
                result[index].push(collection);
            else {
                values.push(val);
                result.push([collection]);
            }
        }
        return result;
    }
}