import { ToastType, toast } from '@/lib/toast'
import type { Pattern } from '@/types/local.d'
import { getElByXpath, scrollAndBlink } from './util'

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
  patternGetter: () => Pattern
  canNav = false
  enabled = false
  constructor(patternGetter: () => Pattern, auto_enable?: boolean) {
    this.pattern = patternGetter()
    this.patternGetter = patternGetter
    this.canNav = !!(this.getNextEl() || this.getPrevEl())
    if (auto_enable) {
      this.enabled = true
      this.init()
    }
  }

  init() {
    this.enabled = true
    document.addEventListener('keydown', this.keyPad.bind(this), false)
  }

  updatePattern() {
    this.pattern = this.patternGetter()
  }

  check() {
    if (!this.enabled) return
    if (this.pattern.prev && this.pattern.next) {
      const prevEl = this.getPrevEl()
      const nextEl = this.getNextEl()
      if (prevEl) {
        scrollAndBlink(prevEl)
      }
      if (nextEl) {
        scrollAndBlink(nextEl)
      }
    } else {
      this.unInstall()
      toast({
        text: 'No element found',
        type: ToastType.Warning,
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
      this.getPrevEl()?.click()
    } else if (keyCodeMap.right.includes(code)) {
      this.getNextEl()?.click()
    }
  }
  getPrevEl() {
    if (!this.pattern.prev) return null
    const el = getElByXpath(this.pattern.prev)
    // 说明dom有变更，xpath也随之变化
    // test url: https://docs.swmansion.com/react-native-reanimated/docs
    if (this.canNav && !el) {
      this.updatePattern()
    }
    return getElByXpath(this.pattern.prev) as HTMLElement
  }
  getNextEl() {
    if (!this.pattern.next) return null
    const el = getElByXpath(this.pattern.next)
    if (this.canNav && !el) {
      this.updatePattern()
    }
    return getElByXpath(this.pattern.next) as HTMLElement
  }
}

const INPUT_TAG = ['INPUT', 'TEXTAREA']
function userEditing() {
  const activeTarget = document.activeElement
  if (!activeTarget || !INPUT_TAG.includes(activeTarget.tagName)) return false
  return true
}
