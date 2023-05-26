export function posNeg(a: number, b: number, negative: boolean){
  return negative ? a < 0 && b < 0 : a < 0 !== b < 0
}