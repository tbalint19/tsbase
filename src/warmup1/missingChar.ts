export function missingChar(str: string, n: number){
  let result = ""

  let index = 0
  while (str[index] !== undefined) {
    console.log("adding " + str[index] + " to result")
    if (index !== n) {
      result += str[index]
    }
    index = index + 1
  }

  return result
}

let res1 = missingChar("korte", 3)
console.log(res1);
