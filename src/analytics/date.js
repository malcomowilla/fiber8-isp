

const time = new Date();
// const date = time.getMonth()
console.log(time.getMonth())
// month 0 => Jan and so on
// 0 1 day before the month (so maybe one day before month of january which is 0 in javascript)
//  1 meaning start of month, 0 meaning end of month
console.log(new Date(time.getFullYear(), time.getMonth() + -2, 1).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' }));

// // String(d.getMonth() + 1)
// const lastDay = new Date(time.getFullYear(), time.getMonth() + 1, 0).getDate();
// console.log(lastDay)
// console.log(new Date(time.getFullYear(), time.getMonth()), )