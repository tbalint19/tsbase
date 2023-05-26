export function endUp(str: string){
  let result = ""

  let index = 0
  while (str[index] !== undefined) {

    if (str[index+3] === undefined) {
      result = result + str[index].toUpperCase()
    } else {
      result = result + str[index]
    }

    index = index + 1
  }

  return result
}