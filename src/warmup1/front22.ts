export function front22(str: string){
  if (str[1] !== undefined) {
    return str[0] + str[1] + str + str[0] + str[1]
  }
  if (str === "") {
    return ""
  }
  return str + str + str
}