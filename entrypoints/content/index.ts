// import hotkeys from 'hotkeys-js'
import './index.scss'
import { $$, getEle } from '@/lib';
import type { Pattern } from '@/types/local';
import { selectors } from './const'
import Navigate from './navigate';
import { getElByContent, isDirectionArrowPath } from './util';

export default defineContentScript({
  matches: ['<all_urls>'],
  async main() {
    /**
     * 1. class
     * 2. previews, next
     * 3. svg
     */
    const pattern = executeFunctionsUntilSuccess(functions)
    if (pattern) {
      new Navigate(pattern)
    }
  },
})

function executeFunctionsUntilSuccess(functions: (() => any)[]) {
  for (const func of functions) {
      const result = func()
      if (result) return result
  }
  return undefined; // 或者返回一个默认值
}

// 使用示例
const functions = [
  getPatternBySelector,
  getPatternByXPath,
  getPatternBySVG
]



function getPatternBySelector(): Pattern | null {
  for (const select in selectors) {
    const prev = getEle(select[0])
    const next = getEle(select[1])
    if (prev || next) {
      return {
        prevEle: prev as HTMLElement,
        nextEle: next as HTMLElement,
      }
    }
  }
  return null
}

function getPatternByXPath() {
  const prevContentList = ['prev', 'previous', '上一页']
  const nextContentList = ['next', '下一页']
  const prev = executeFunctionsUntilSuccess(
    prevContentList.map(() => () => getElByContent)
  )
  const next = executeFunctionsUntilSuccess(
    nextContentList.map(() => () => getElByContent)
  )
  if (prev || next) {
    return {
      prevEle: prev as HTMLElement,
      nextEle: next as HTMLElement,
    }
  }
}

function getPatternBySVG() {
  const svgList = $$('a svg')
  const targetList = []
  for (const svg of svgList) {
    const path = svg.firstElementChild?.getAttribute('d')
    if (path && isDirectionArrowPath(path)) {
      targetList.push(svg.closest('a'))
    }
    if (targetList.length > 1) break
  }
  if (!targetList.length) return null
  if (length === 2) {
    return {
      prevEle: targetList[0],
      nextEle: targetList[1],
    }
  }
  // TODO: 根据开口方向判断是上一页还是下一页，需要opencv.js
  return {
    prevEle: targetList[0],
    nextEle: targetList[0],
  }
}


