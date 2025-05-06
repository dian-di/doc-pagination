import hotkeys from 'hotkeys-js'

export default defineContentScript({
  matches: ['<all_urls>'],
  async main() {
    
    console.log('main')
    /**
     * 1. class
     * 2. previews, next
     * 3. svg
     */

  },
})

function executeFunctionsUntilSuccess(functions, predicate) {
  for (const func of functions) {
      const result = func();
      if (predicate(result)) {
          return result;
      }
  }
  return undefined; // 或者返回一个默认值
}

// 使用示例
const functions = [
  () => { console.log('执行函数1'); return null; },
  () => { console.log('执行函数2'); return 'success'; },
  () => { console.log('执行函数3'); return 'another result'; }
];

const result = executeFunctionsUntilSuccess(functions, (res) => res === 'success');
console.log(result); // 输出: 'success'
function getElByContent(content) {
  const startTime = Date.now()
  const result = document.evaluate(
    `//*[normalize-space(text())='${content}']`,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  )
  console.log(Date.now() - startTime, 'time')
  return result.singleNodeValue
}

function getLinkByChild(element) {
  return element.closest('a')
}
