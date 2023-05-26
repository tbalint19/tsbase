export function monkeyTrouble(aSmile: boolean, bSmile: boolean){
  return (aSmile && bSmile) || (!aSmile && !bSmile)
}

let res1 = monkeyTrouble(true, true) // true
let res2 = monkeyTrouble(false, false) // true
let res3 = monkeyTrouble(true, false) // false
let res4 = monkeyTrouble(false, true)  // false

console.log(res1);
console.log(res2);
console.log(res3);
console.log(res4);