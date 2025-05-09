// import hotkeys from 'hotkeys-js'
import './style.css'
import { $$, getEle } from '@/lib'
import type { Pattern } from '@/types/local'
import { selectors } from './const'
import Navigate from './navigate'
import { getElByContent, getXpath, isDirectionArrowPath, peerElements } from './util'

export default defineContentScript({
  matches: ['<all_urls>'],
  async main() {
    setTimeout(() => {
      new Navigate(() => executeFunctionsUntilSuccess(functions), true)
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

// 通过常用class名
function getPatternBySelector(): Pattern | null {
  for (const select of selectors) {
    const prev = getEle(select[0])
    const next = getEle(select[1])
    if (prev || next) {
      console.log(prev, next, 'prev next')
      return {
        prev: getXpath(prev as HTMLElement),
        next: getXpath(next as HTMLElement),
      }
    }
  }
  return null
}

// 通过常用xpath是否包含'next','previous'等关键字
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
      prev: getXpath(prev?.closest('a') as HTMLElement),
      next: getXpath(next?.closest('a') as HTMLElement),
    }
  }
}

// 通过svg是否为箭头
function getPatternBySVG() {
  // 从网页底部往上找
  const svgList = $$('a svg').reverse()
  const targetList = []
  for (const svg of svgList) {
    const path = svg.querySelector('path')?.getAttribute('d')
    if (path && isDirectionArrowPath(path)) {
      svg.closest('a') && targetList.push(svg.closest('a'))
    }
  }
  if (!targetList.length) return null
  // a元素相邻，且距文档顶部的距离一样，则为分页元素
  const finalList = peerElements(targetList)
  console.log(finalList, 'finalList')
  if (!finalList.length) return null
  return {
    prev: getXpath(finalList[1] || finalList[0]),
    next: getXpath(finalList[0]),
  }
}
