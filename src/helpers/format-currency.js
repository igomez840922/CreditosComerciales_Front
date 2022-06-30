
export const formatCurrency = (currency = '$', value = 0, decimals = 2, preffix = true) => {

  let asVal = parseFloat(value);
  if (isNaN(asVal)) {
    asVal = 0;
  }
  if (decimals === 0) {
    const amount = asVal.toLocaleString('en');
    return preffix ? currency + amount : amount + currency;
  }
  else {
    const amount = asVal.toFixed(decimals).replace(/\B(?=(?=\d*\.)(\d{3})+(?!\d))/g, ',');
    return preffix ? currency + amount : amount + currency;
  }
}
