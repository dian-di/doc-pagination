import { toast } from '@/lib/toast'

import type { Pattern } from '@/types/local.d'
import { getEle } from '@/lib'

const keyCodeMap = {
  left: ['ArrowLeft', 'KeyA'],
  right: ['ArrowRight', 'KeyD'],
}

/**
 * 1. 检测到分页元素
 * 2. 检查用户当前是否在编辑文本，检查用户是否在播放视频
 */
export default class Navigate {
  pattern: Pattern = {} as Pattern
  enabled = false
  prevEle: HTMLElement | null = null
  nextEle: HTMLElement | null = null
  constructor(pattern: Pattern, auto_enable?: boolean) {
    this.pattern = pattern
    if (auto_enable) {
      this.enabled = true
      this.init()
    }
  }

  init() {
    this.enabled = true
    this.prevEle = getEleBySelectorList(this.pattern.prev_selector) as HTMLElement
    this.nextEle = getEleBySelectorList(this.pattern.next_selector) as HTMLElement
    document.addEventListener('keydown', this.keyPad.bind(this), false)
  }

  check() {
    if (!this.enabled) return
    if (this.prevEle && this.nextEle) {
      this.prevEle.classList.add('ring-2', 'ring-blue-500')
      this.nextEle.classList.add('ring-2', 'ring-blue-500')
    } else {
      this.unInstall()
      toast({
        text: 'No element found, please check the selector',
      })
    }
  }

  unInstall() {
    this.enabled = false
    document.removeEventListener('keydown', this.keyPad.bind(this), false)
  }

  // [attr~=value]  "value xxx"
  // [attr|=value] "value-xxx"
  // [attr^=value] "valuexxx"
  // [attr$=value] "xxxvalue"
  // [attr*=value] "xxxvaluexxx"
  // [class^='value' i] i or s
  // test url: https://postgrest.org/en/stable/releases/v10.2.0.html
  keyPad(e: KeyboardEvent) {
    const code = e.code
    if (!this.enabled || !this.pattern || userEditing()) return
    if (keyCodeMap.left.includes(code)) {
      this.prevEle?.click()
    } else if (keyCodeMap.right.includes(code)) {
      this.nextEle?.click()
    }
  }
}

function getEleBySelectorList(list: string[]) {
  let elRes: Element | null | undefined = null
  for (const selector of list) {
    elRes = getEle(selector)
    if (elRes) break
  }
  return elRes
}

const INPUT_TAG = ['INPUT', 'TEXTAREA']
function userEditing() {
  const activeTarget = document.activeElement
  if (!activeTarget || !INPUT_TAG.includes(activeTarget.tagName)) return false
  return true
}
