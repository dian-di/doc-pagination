// export type Pattern = (
//   | { prevEle: HTMLElement; nextEle: null }
//   | { prevEle: null; nextEle: HTMLElement }
//   | { prevEle: HTMLElement; nextEle: HTMLElement }
// )

export type Pattern = (
  | { prev: string; next: null }
  | { prev: null; next: string }
  | { prev: string; next: string }
)
