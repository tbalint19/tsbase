export function front3(str: string){
  if (str[3] === undefined) {
    return str + str + str
  }
  let front = str[0] + str[1] + str[2]
  return front + front + front
}