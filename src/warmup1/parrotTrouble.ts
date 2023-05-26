export function parrotTrouble(talking: boolean, hour: number){
  return talking && (hour < 7 || hour > 20)
}