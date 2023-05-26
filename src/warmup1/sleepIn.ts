export function sleepIn(weekday: boolean, vacation: boolean){
  return !weekday || vacation
}

let res1 = sleepIn(true, true) // true
let res2 = sleepIn(true, false) // false
let res3 = sleepIn(false, true) // true
let res4 = sleepIn(false, false)  // true

console.log(res1);
console.log(res2);
console.log(res3);
console.log(res4);
