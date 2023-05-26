export function stringE(str: string){
  let count = 0


  let index = 0
  while (str[index] !== undefined) {

    if (str[index] === "e") {
      count += 1
    }

    index = index + 1
  }


  return count > 0 && count < 4
}