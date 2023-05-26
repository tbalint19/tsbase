export function backAround(str: string){
  let count = 0
  while (str[count] !== undefined) {
    count = count + 1
  }

  let lastChar = str[1]
  
  return lastChar + str + lastChar
}
