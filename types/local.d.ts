// export type Pattern = {
//   prevEle: HTMLElement
//   nextEle: HTMLElement
// }

export type Pattern = (
  | { prevEle: HTMLElement; nextEle: null }
  | { prevEle: null; nextEle: HTMLElement }
  | { prevEle: HTMLElement; nextEle: HTMLElement }
)
