export function sumDouble(a: number, b: number){
  return a === b ? (a+b)*2 : a+b
}

let result = sumDouble(1, 2)
console.log(result)