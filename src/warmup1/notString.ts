export function notString(str: string){
  return str[0] === "n" && str[1] === "o" && str[2] === "t" ? str : "not " + str
}