export function frontBack(str: string){
  if (!str[1]) {
    return str
  }

  let middle = ""

  let firstChar = str[0]
  let lastChar

  let index = 1
  while (str[index] !== undefined) {

    if (str[index+1] !== undefined) {
      middle = middle + str[index]
    } else {
      lastChar = str[index]
    }
    
    index = index + 1
  }

  return lastChar + middle + firstChar
}

let res = frontBack('korte')
console.log(res)
