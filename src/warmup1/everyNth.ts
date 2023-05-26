export function everyNth(str: string, n: number){
  let result = ""

  let index = 0
  while (str[index] !== undefined) {

    result = result + str[index]

    index = index + n
  }

  return result
}