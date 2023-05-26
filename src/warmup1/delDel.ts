export function delDel(str: string){
  let hasDelThere = str[1] === "d" && str[2] === "e" && str[3] === "l"
  if (!hasDelThere) {
    return str
  }

  let result = ""

  let index = 0
  while (str[index] !== undefined) {

    if (index !== 1 && index !== 2 && index !== 3) {
      result = result + str[index]
    }

    index = index + 1
  }

  return result
}