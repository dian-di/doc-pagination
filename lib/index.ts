export function getEle(el: string, context?: HTMLElement) {
  if (!el) return null
  return (context || document).querySelector(el)
}

export function $$(el: string, context?: HTMLElement) {
  if (!el) return []
  return Array.from((context || document).querySelectorAll(el))
}

export function getEleBySelectorList(list: string[]) {
  let elRes: Element | null | undefined = null
  for (const selector of list) {
    elRes = getEle(selector)
    if (elRes) break
  }
  return elRes
}

export function uuid() {
  return (Math.random() + 1).toString(36).substring(4)
}
