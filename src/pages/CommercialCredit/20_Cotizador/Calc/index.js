// function that calculates payments
/*
 * ir   - interest rate per month
 * nper   - number of periods (months)
 * amountRequest   - loan requested
 * fv   - future value
 * type - when the payments are due:
 *        0: end of the period, e.g. end of month (default)
 *        1: beginning of period
 */
const calculatePMT = (rate, nper, amountRequest) => {
    let ir = rate / 12
    let monthlyBill = amountRequest * ((ir * (1 + ir) ** nper) / (((1 + ir) ** nper) - 1))
    monthlyBill = monthlyBill.toFixed(2)
    console.log(monthlyBill);
}
calculatePMT(0.075, 33, 2620510)

// function that calculates monthly interests
const calculateInterest = (amountRequest, rate) => {
    let monthlyInterest = amountRequest * ((rate / 360) * 30)
    monthlyInterest = monthlyInterest.toFixed(2)
    console.log(monthlyInterest);
}
calculateInterest(2620510, 0.075)

// function that calculates capital
const calculateCapital = (monthlyBill, monthlyInterest, feci = 0) => {
    let capital = monthlyBill - monthlyInterest - feci;
    capital = capital.toFixed(2)
    console.log(capital);
}
calculateCapital(88126.81, 16378.19)

// function that calculates capital
const calculateBalance = (amountRequest, capital) => {
    let balance = amountRequest - capital;
    balance = balance.toFixed(2);
    console.log(balance);
}
calculateBalance(2620510, 71748.62)

// function that calculates total interests
// at first operation 
const calculateTotalInterests = (initialInterest, monthlyInterest) => {
    let totalInterests = initialInterest + monthlyInterest;
    totalInterests = totalInterests.toFixed(2);
    console.log(totalInterests);
}
calculateTotalInterests(16378.19, 15929.76)

// function that calculates total capital
const calculateTotalCapital = (initialCapital, capital) => {
    let totalCapital = initialCapital + capital;
    totalCapital = totalCapital.toFixed(2)
    console.log(totalCapital);
}
calculateTotalCapital(71748.62, 72197.05)

// function that calculates total capital
const calculateTotalPaid = (totalInterests, totalCapital) => {
    let totalPaid = totalInterests + totalCapital;
    totalPaid = totalPaid.toFixed(2)
    console.log(totalPaid);
}
calculateTotalPaid(16378.19, 71748.62)
