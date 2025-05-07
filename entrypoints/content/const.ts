export const selectors = [
  ["a[rel='prev']", "a[rel='next']"],
  ["a.prev", "a.next"],
  [".prev a", ".next a"],
  ["a.prev-link", "a.next-link"],
  ["[class*='paginat'][class*='prev']", "[class*='paginat'][class*='next']"],
  ["[class*='nav'] li:first-child>a", "[class*='nav'] li:last-child>a"],
  ["nav[role*='nav'] li:first-child>a", "nav[role*='nav'] li:last-child>a"],
  ["[class*='next'][class*='prev'] li:first-child>a", "[class*='next'][class*='prev'] li:last-child>a"],
  ["[class*='next'][class*='prev'] a:first-child", "[class*='next'][class*='prev']>a:last-child"],
  ["[class*='pagination'] a[id*=prev]", "[class*='pagination'] a[id*=next]"],
  ["[class*='prev'][class*='pag']", "[class*='next'][class*='pag']"],
]