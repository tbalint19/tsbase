export function diff21(num: number){
  let result
  if (num > 21) {
    result = (num-21)*2
  } else {
    result = 21-num
  }
  return result
}