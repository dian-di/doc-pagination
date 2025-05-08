// import hotkeys from 'hotkeys-js'
import './style.css'
import { $$, getEle } from '@/lib'
import type { Pattern } from '@/types/local'
import { selectors } from './const'
import Navigate from './navigate'
import { getElByContent, isDirectionArrowPath, peerElements } from './util'

export default defineContentScript({
  matches: ['<all_urls>'],
  async main() {
    /**
     * 1. class
     * 2. previews, next
     * 3. svg
     */
    setTimeout(() => {
      const pattern = executeFunctionsUntilSuccess(functions)
      if (pattern) {
        new Navigate(pattern, true)
      }
    }, 2000)
  },
})

function executeFunctionsUntilSuccess(functions: (() => any)[]) {
  for (const func of functions) {
    const result = func()
    if (result) return result
  }
  return undefined // 或者返回一个默认值
}

// 使用示例
const functions = [getPatternBySelector, getPatternByXPath, getPatternBySVG]

function getPatternBySelector(): Pattern | null {
  for (const select of selectors) {
    const prev = getEle(select[0])
    const next = getEle(select[1])
    if (prev || next) {
      console.log(prev, next, 'prev next')
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
    prevContentList.map((item) => () => getElByContent(item)),
  )
  const next = executeFunctionsUntilSuccess(
    nextContentList.map((item) => () => getElByContent(item)),
  )
  console.log(prev, next, 'prev next')
  if (prev || next) {
    return {
      prevEle: prev?.closest('a') as HTMLElement,
      nextEle: next?.closest('a') as HTMLElement,
    }
  }
}

function getPatternBySVG() {
  const svgList = $$('a svg').reverse()
  const targetList = []
  for (const svg of svgList) {
    const path = svg.querySelector('path')?.getAttribute('d')
    if (path && isDirectionArrowPath(path)) {
      svg.closest('a') && targetList.push(svg.closest('a'))
    }
  }
  if (!targetList.length) return null
  // TODO: a元素相邻，且距文档顶部的距离一样，则为分页元素
  const finalList = peerElements(targetList)
  if (!finalList.length) return null
  return {
    prevEle: finalList[1] || finalList[1],
    nextEle: finalList[0],
  }
}
